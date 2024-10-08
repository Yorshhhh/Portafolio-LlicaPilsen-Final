from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

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
    is_verified = models.BooleanField(default=False)  # Nuevo campo
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombres', 'apellidos', 'telefono']

    def __str__(self):
        return self.correo


# MODELO EMPRESA
class Empresa(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='empresa')
    razon_social = models.CharField(max_length=255)
    rut_empresa = models.CharField(max_length=20)
    giro_comercial = models.CharField(max_length=255)
    direccion_empresa = models.CharField(max_length=255)
    numero_empresa = models.CharField(max_length=20)
    comuna_empresa = models.ForeignKey('Comuna', on_delete=models.SET_NULL, null=True, blank=True)
    ciudad_empresa = models.ForeignKey('Ciudad', on_delete=models.SET_NULL, null=True, blank=True)
    region_empresa = models.ForeignKey('Region', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.razon_social

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
    
# MODELO REGION DE CLIENTES
class Region(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

# MODELO CIUDAD DE CLIENTES
class Ciudad(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='ciudades')

    def __str__(self):
        return self.nombre

# MODELO COMUNA CLIENTES
class Comuna(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    ciudad = models.ForeignKey(Ciudad, on_delete=models.CASCADE, related_name='comunas')

    def __str__(self):
        return self.nombre

# MODELO PEDIDOS
class Pedido(models.Model):
    TIPO_ENTREGA_CHOICES = [
        ('retiro', 'Retiro en tienda'),
        ('domicilio', 'Despacho a domicilio'),
    ]
    TIPO_DOCUMENTO_CHOICES = [
        ('boleta', 'Boleta'),
        ('factura', 'Factura')
    ]

    cod_pedido = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='pedidos')
    cod_comuna = models.ForeignKey(Comuna, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_pedido = models.DateField()
    fecha_entrega = models.DateField(null=True, blank=True)
    tipo_entrega = models.CharField(
        max_length=20,
        choices=TIPO_ENTREGA_CHOICES,
        null=True,  
        blank=True,
        default=None,
        help_text="Tipo de entrega: 'retiro', 'domicilio'."
    )
    codigo_envio = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        default=None,
        help_text="Código de envío proporcionado por el servicio de mensajería."
    )
    tipo_documento = models.CharField(
        max_length=20,
        choices=TIPO_DOCUMENTO_CHOICES,
        null=False,
        blank=False,
        default='boleta',
        help_text="Tipo de documento: 'boleta', 'factura'."
    )
    iva = models.FloatField()
    total_neto = models.IntegerField()
    total_boleta = models.IntegerField()
    costo_envio = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"
        ordering = ['fecha_pedido']

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
    total_ventas = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'view_ventas_producto'


class VentasTipoDocumento(models.Model):
    tipo_documento = models.CharField(max_length=20, primary_key=True)
    total_ventas = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'view_ventas_documento'

class VentasTipoEntrega(models.Model):
    tipo_entrega = models.CharField(max_length=20, primary_key=True)
    total_ventas = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'view_ventas_entrega'

class VentasComuna(models.Model):
    cod_comuna_id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=20)
    total_ventas = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'view_ventas_comuna'

class PedidoPendiente(models.Model):
    nombre_cliente = models.CharField(max_length=100)
    cod_comuna_id = models.IntegerField()
    comuna = models.CharField(max_length=255)
    direccion = models.CharField(max_length=255)
    tipo_documento = models.CharField(max_length=255)
    tipo_entrega = models.CharField(max_length=255)
    correo = models.EmailField()
    telefono = models.CharField(max_length=20)
    cod_pedido = models.IntegerField(primary_key=True)
    id_detalle_pedido = models.IntegerField()
    cod_producto = models.IntegerField()
    nombre_producto = models.CharField(max_length=20)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    iva = models.DecimalField(max_digits=10, decimal_places=2)
    total_boleta = models.DecimalField(max_digits=10, decimal_places=2)
    costo_envio = models.DecimalField(max_digits=10, decimal_places=2)
    total_neto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_pedido = models.DateField()

    class Meta:
        managed =  False
        db_table = 'view_pedidos_pendientes'

class PedidoEntregado(models.Model):
    cod_pedido = models.IntegerField(primary_key=True)
    nombre_cliente = models.CharField(max_length=255)
    cod_comuna_id = models.IntegerField()
    comuna = models.CharField(max_length=255)
    direccion = models.CharField(max_length=255)
    tipo_documento = models.CharField(max_length=255)
    tipo_entrega = models.CharField(max_length=255)
    correo = models.EmailField()
    telefono = models.CharField(max_length=20)
    id_detalle_pedido = models.CharField(max_length=255)
    cod_producto = models.CharField(max_length=255)
    nombre_producto = models.CharField(max_length=255)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    iva = models.DecimalField(max_digits=10, decimal_places=2)
    total_boleta = models.DecimalField(max_digits=10, decimal_places=2)
    total_neto = models.DecimalField(max_digits=10, decimal_places=2)
    costo_envio = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_pedido = models.DateTimeField()
    fecha_entrega = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'view_pedidos_despachados'