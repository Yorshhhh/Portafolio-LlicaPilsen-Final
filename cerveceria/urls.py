from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from .views import *

router = routers.DefaultRouter()

router.register(r'productos', ProductoView, 'producto')
router.register(r'usuarios', UsuarioView, 'usuario')
router.register(r'pedidos', PedidoView, 'pedido')
router.register(r'detalle_pedidos', Detalle_PedidoView, 'detalle_pedido')

urlpatterns = [
    path("", include(router.urls)),
    path("docs/", include_docs_urls(title="Cerveceria API")),
    path("update-stock/", update_stock, name="update_stock"), 
    path("login/", CustomAuthToken.as_view(), name="login"),
    path("historial_pedidos/", HistorialPedidosView.as_view(),name='historial_pedidos'),
    path('ganancias_producto/', VentasProductoView.as_view(), name='ganancias_por_producto'),
    path('pedidos_pendientes/', PedidoPendienteView.as_view(), name='pedidos_pendientes'),
    path('pedidos_entregados/', PedidoEntregadoView.as_view(), name='pedidos_entregados'),
    path('ventas_mensuales/', VentasMensualesView.as_view(), name='ventas_mensuales')
]
#MOISES SEPULVEDA, OJO