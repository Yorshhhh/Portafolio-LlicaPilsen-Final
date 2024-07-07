from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.db import transaction
from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import Usuario,Producto,Detalle_Pedido,Pedido

class UsuarioSerializer(serializers.ModelSerializer):
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
        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({"password": "Se requiere una contraseña."})

        usuario = Usuario(**validated_data)
        usuario.password = make_password(password)
        usuario.save()

        try:
            group = Group.objects.get(name="Clientes")
            usuario.groups.add(group)
        except Group.DoesNotExist:
            pass

        return usuario
    
class CustomAuthTokenSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        correo = attrs.get('correo')
        password = attrs.get('password')

        if correo and password:
            # Intenta autenticar al usuario con las credenciales proporcionadas
            user = authenticate(correo=correo, password=password)
            if not user:
                raise serializers.ValidationError("Credenciales inválidas.")
        else:
            raise serializers.ValidationError("Debe proporcionar tanto el correo como la contraseña.")

        # Agrega el usuario autenticado a los datos validados
        attrs['user'] = user

        return attrs

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

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
    class Meta:
        model = Pedido
        fields = '__all__'

    # Ejemplo de validación adicional
    def validate_fecha_entrega(self, value):
        if value and value < self.instance.fecha_pedido:
            raise serializers.ValidationError("La fecha de entrega no puede ser anterior a la fecha del pedido.")
        return value

    
