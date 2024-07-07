from rest_framework.pagination import PageNumberPagination

class PedidoPagination(PageNumberPagination):
    page_size = 3  # Número de elementos por página
    page_size_query_param = 'page_size'
    max_page_size = 100  # Tamaño máximo permitido de la página

class HistorialPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 100

class PedidoPendientePagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class PedidoEntregadoPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100