from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Definir un UserManager personalizado
class CustomUserManager(BaseUserManager):
    def create_user(self, correo, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo electrónico debe ser proporcionado')
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_admin(self, correo, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo electrónico es obligatorio')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', False)
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, correo, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(correo, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    correo = models.EmailField(max_length=254, unique=True)
    nombres = models.CharField(max_length=155)
    apellidos = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20, unique=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombres', 'apellidos', 'telefono']

    def __str__(self):
        return self.correo
# MODELO PRODUCTO CERVEZAS
class Producto(models.Model):
    cod_producto = models.AutoField(primary_key=True)
    nombre_producto = models.CharField(max_length=50)
    descripcion_producto = models.CharField(max_length=255)
    precio_producto = models.IntegerField()
    stock_producto = models.IntegerField()
    grado_alcoholico = models.FloatField()
    litros = models.FloatField()
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)

    def __str__(self):
        return self.nombre_producto

# MODELO PEDIDOS
class Pedido(models.Model):
    cod_pedido = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='pedidos')
    fecha_pedido = models.DateField()
    fecha_entrega = models.DateField(null=True, blank=True)
    
# MODELO DETALLE PEDIDO
class Detalle_Pedido(models.Model):
    id_detalle_pedido = models.AutoField(primary_key=True)
    cod_pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')
    cod_producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    precio_unitario = models.IntegerField()
    cantidad = models.IntegerField()
    descuento = models.FloatField()

    def __str__(self):
        return f"Detalle del pedido {self.cod_pedido} para el producto {self.cod_producto}"


class GananciasProducto(models.Model):
    cod_producto = models.IntegerField(primary_key=True)
    nombre_producto = models.CharField(max_length=100)
    total = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'view_ventas_producto'

class PedidoPendiente(models.Model):
    nombre_cliente = models.CharField(max_length=100)
    correo = models.EmailField()
    telefono = models.CharField(max_length=20)
    cod_pedido_id = models.IntegerField(primary_key=True)
    id_detalle_pedido = models.IntegerField()
    cod_producto = models.IntegerField()
    nombre_producto = models.CharField(max_length=20)
    cantidad = models.IntegerField()
    precio_unitario = models.IntegerField()
    total = models.IntegerField()
    fecha_pedido = models.DateField()

    class Meta:
        managed =  False
        db_table = 'view_pedidos_pendientes'

class PedidoEntregado(models.Model):
    cod_pedido = models.IntegerField(primary_key=True)
    nombre_cliente = models.CharField(max_length=255)
    correo = models.EmailField()
    telefono = models.CharField(max_length=20)
    id_detalle_pedido = models.CharField(max_length=255)
    cod_producto = models.CharField(max_length=255)
    nombre_producto = models.CharField(max_length=255)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_pedido = models.DateTimeField()
    fecha_entrega = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'view_pedidos_entregados'