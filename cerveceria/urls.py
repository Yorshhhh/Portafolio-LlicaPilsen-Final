from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from .views import *

router = routers.DefaultRouter()

router.register(r'regiones', RegionView, 'region')
router.register(r'ciudades', CiudadView, 'ciudad')
router.register(r'comunas', ComunaView, 'comuna')
router.register(r'productos', ProductoView, 'producto')
router.register(r'usuarios', UsuarioView, 'usuario')
router.register(r'empresas', EmpresaView, 'empresa')
router.register(r'pedidos', PedidoView, 'pedido')
router.register(r'detalle_pedidos', Detalle_PedidoView, 'detalle_pedido')


urlpatterns = [
    path("", include(router.urls)),
    path("docs/", include_docs_urls(title="Cerveceria API")),
    path("update-stock/", update_stock, name="update_stock"), 
    path("login/", CustomAuthToken.as_view(), name="login"),
    path("historial_pedidos/", HistorialPedidosView.as_view(),name='historial_pedidos'),
    path('ventas_producto/', VentasProductoView.as_view(), name='ventas_por_producto'),
    path('ventas_comuna/', VentasComunaView.as_view(), name='ventas_por_comuna'),
    path('ventas_documento/', VentasDocumentoView.as_view(), name='ventas_por_documento'),
    path('ventas_entrega/', VentasEntregaView.as_view(), name='ventas_por_entrega'),
    path('pedidos_pendientes/', PedidoPendienteView.as_view(), name='pedidos_pendientes'),
    path('pedidos_despachados/', PedidoEntregadoView.as_view(), name='pedidos_despachados'),
    path('buscar_pedidos_cod/', BuscarPedidosConCodigoView.as_view(), name='buscar_pedido_codigo'),
    path('buscar_pedidos_correo/', BuscarPedidosConCorreoView.as_view(), name='buscar_pedido_correo'),
    path('ventas_mensuales/', VentasMensualesView.as_view(), name='ventas_mensuales'),
    path('ventas_entre/', VentasFechaView.as_view(), name='ventas_entre'),
    path('ventas_f29/', DocumentosFechaView.as_view(), name='ventas_f29'),
    path('ventas_mensuales_comuna/', VentasMensualesComunaView.as_view(), name='ventas_mensuales'),
    path('correo-masivo/', SendBulkEmailView.as_view(), name='correo-masivo'),
    path('verify-email/', VerifyEmail.as_view(), name='email-verify'),
]
#MOISES SEPULVEDA, OJO