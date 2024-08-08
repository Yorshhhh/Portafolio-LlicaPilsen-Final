from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from .utils import Util
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from django.db import transaction
from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import Usuario, Empresa, Producto, Detalle_Pedido, Pedido, Region, Ciudad, Comuna



class RegionSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(label='Nombre de la Región')

    class Meta:
        model = Region
        fields = '__all__'


class CiudadSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(label='Nombre de la Ciudad')
    region = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all(), label='Región')

    class Meta:
        model = Ciudad
        fields = '__all__'

    def create(self, validated_data):
        return Ciudad.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.region = validated_data.get('region', instance.region)
        instance.save()
        return instance

class ComunaSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(label='Nombre de la Comuna')
    ciudad = serializers.PrimaryKeyRelatedField(queryset=Ciudad.objects.all(), label='Ciudad')

    class Meta:
        model = Comuna
        fields = '__all__'

    def create(self, validated_data):
        return Comuna.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.ciudad = validated_data.get('ciudad', instance.ciudad)
        instance.save()
        return instance

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    empresa = EmpresaSerializer(required=False)

    class Meta:
        model = Usuario
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
            'correo': {'required': False},
            'nombres': {'required': False},
            'apellidos': {'required': False},
            'telefono': {'required': False},
        }

    def create(self, validated_data):
        empresa_data = validated_data.pop('empresa', None)
        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({"password": "Se requiere una contraseña."})

        usuario = Usuario(**validated_data)
        usuario.password = make_password(password)
        usuario.is_active = False  # Desactivar la cuenta hasta que el correo sea verificado
        usuario.save()

        if empresa_data:
            Empresa.objects.create(usuario=usuario, **empresa_data)

        try:
            group = Group.objects.get(name="Clientes")
            usuario.groups.add(group)
        except Group.DoesNotExist:
            pass

        # Enviar correo de verificación
        current_site = '1c52-191-114-35-218.ngrok-free.app'
        token = RefreshToken.for_user(usuario).access_token
        relativeLink = reverse('email-verify')
        absurl = 'http://' + current_site + relativeLink + "?token=" + str(token)
        email_body = f'Hola {usuario.nombres}, utiliza el siguiente enlace para verificar tu correo: \n{absurl}'
        data = {'email_body': email_body, 'to_email': usuario.correo, 'email_subject': 'Verifica tu correo'}

        Util.send_email(data)

        return usuario

    def update(self, instance, validated_data):
        empresa_data = validated_data.pop('empresa', None)
        instance = super().update(instance, validated_data)

        if empresa_data:
            empresa, created = Empresa.objects.update_or_create(
                usuario=instance, defaults=empresa_data
            )

        return instance
    
class CustomAuthTokenSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        correo = attrs.get('correo')
        password = attrs.get('password')

        if correo and password:
            user = authenticate(correo=correo, password=password)
            if not user:
                raise serializers.ValidationError("Credenciales inválidas.")
            if not user.is_verified:
                raise serializers.ValidationError("Por favor, verifique su correo electrónico para activar su cuenta.")
        else:
            raise serializers.ValidationError("Debe proporcionar tanto el correo como la contraseña.")

        attrs['user'] = user
        return attrs

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
        extra_kwargs = {
            'imagen': {'required': False},
        }

class Detalle_PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detalle_Pedido
        fields = '__all__'

    def validate(self, data):
        producto = data['cod_producto']
        cantidad_solicitada = data['cantidad']

        if producto.stock_producto < cantidad_solicitada:
            raise serializers.ValidationError(
                f"No hay suficiente stock para el producto {producto.nombre_producto}. Disponible: {producto.stock_producto}, solicitado: {cantidad_solicitada}."
            )

        return data

    @transaction.atomic
    def create(self, validated_data):
        producto = validated_data['cod_producto']
        cantidad_solicitada = validated_data['cantidad']

        producto.stock_producto -= cantidad_solicitada
        producto.save()

        return super().create(validated_data)

class PedidoSerializer(serializers.ModelSerializer):
    cod_comuna = serializers.PrimaryKeyRelatedField(queryset=Comuna.objects.all(), label='Comuna')

    class Meta:
        model = Pedido
        fields = '__all__'

    def validate_fecha_entrega(self, value):
        if self.instance and value < self.instance.fecha_pedido:
            raise serializers.ValidationError("La fecha de entrega no puede ser anterior a la fecha del pedido.")
        return value

    def create(self, validated_data):
        # Obtener la comuna seleccionada
        comuna = validated_data.pop('cod_comuna')

        # Crear el pedido con la comuna
        pedido = Pedido.objects.create(cod_comuna=comuna, **validated_data)
        return pedido

    def update(self, instance, validated_data):
        comuna = validated_data.pop('cod_comuna', None)

        if comuna is not None:
            instance.cod_comuna = comuna

        # Actualizar la comuna y los demás campos del pedido
        instance.cod_comuna = comuna
        instance.fecha_pedido = validated_data.get('fecha_pedido', instance.fecha_pedido)
        instance.fecha_entrega = validated_data.get('fecha_entrega', instance.fecha_entrega)
        instance.tipo_entrega = validated_data.get('tipo_entrega', instance.tipo_entrega)
        instance.codigo_envio = validated_data.get('codigo_envio', instance.codigo_envio)
        instance.tipo_documento = validated_data.get('tipo_documento', instance.tipo_documento)
        instance.iva = validated_data.get('iva', instance.iva)
        instance.total_boleta = validated_data.get('total_boleta', instance.total_boleta)
        instance.save()
        return instance