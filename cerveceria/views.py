from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import Group
from django.db import connection
from rest_framework import viewsets,status
from django.db.utils import OperationalError
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from rest_framework.decorators import api_view,action


from .paginacion import PedidoPagination,HistorialPagination,PedidoPendientePagination,\
    PedidoEntregadoPagination
from .serializer import ProductoSerializer,UsuarioSerializer,\
    Detalle_PedidoSerializer,PedidoSerializer,CustomAuthTokenSerializer

from .models import Producto,Usuario,Detalle_Pedido,Pedido,GananciasProducto,PedidoPendiente,PedidoEntregado

# Create your views here.
class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()
    lookup_field = 'id'

    # Protege la vista con permisos adecuados
    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Handle user registration.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Perform create and save the user instance
        user = serializer.save()
        
        # Optional: Assign user to a default group (e.g., "customers")
        default_group_name = "Cliente"
        try:
            group = Group.objects.get(name=default_group_name)
            user.groups.add(group)
        except Group.DoesNotExist:
            # Optionally handle the case where the group does not exist
            pass

        # Prepare response headers
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['post'], url_path='create_admin')
    def create_admin(self, request):
        correo = request.data.get('correo')
        password = request.data.get('password')
        nombres = request.data.get('nombres')
        apellidos = request.data.get('apellidos')
        telefono = request.data.get('telefono')
    
        try:
            user = Usuario.objects.create_admin(
                correo=correo,
                password=password,
                nombres=nombres,
                apellidos=apellidos,
                telefono=telefono
            )
            return Response({'detail': 'Administrador creado con éxito'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def create(self, request, *args, **kwargs):
        """
        Override the create method to handle user registration.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        default_group_name = "Cliente"
        try:
            group = Group.objects.get(name=default_group_name)
            user.groups.add(group)
        except Group.DoesNotExist:
            # Optionally handle the case where the group does not exist
            pass

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        """
        Handle the user login and token creation.
        """
        serializer = CustomAuthTokenSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        # Retrieve the user and create/get the token
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Serialize user data for response
        user_data = UsuarioSerializer(user).data
        print("tu eres el encargado de enviarme la informacion del usuario o no?")

        return Response({'token': token.key, 'user': user_data}, status=status.HTTP_200_OK)

class VentasProductoView(APIView):
    def get(self, request):
        try:
            ventas = GananciasProducto.objects.all()
            ventas_data = [
                {
                    "cod_producto": venta.cod_producto,
                    "nombre_producto": venta.nombre_producto,
                    "total": venta.total
                }
                for venta in ventas
            ]
            return Response(ventas_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PedidoEntregadoView(APIView):
    pagination_class = PedidoEntregadoPagination

    def get(self, request):
        try:
            pedidos_entregados = PedidoEntregado.objects.all()
            pedidos_data = [
                {
                    "cod_pedido": pedido.cod_pedido,
                    "nombre_cliente": pedido.nombre_cliente,
                    "correo": pedido.correo,
                    "telefono": pedido.telefono,
                    "id_detalle_pedido": pedido.id_detalle_pedido,
                    "cod_producto": pedido.cod_producto,
                    "nombre_producto": pedido.nombre_producto,
                    "cantidad": pedido.cantidad,
                    "precio_unitario": pedido.precio_unitario,
                    "total": pedido.total,
                    "fecha_pedido": pedido.fecha_pedido,
                    "fecha_entrega": pedido.fecha_entrega,
                }
                for pedido in pedidos_entregados
            ]
            # Paginar los resultados utilizando la clase de paginación personalizada
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(pedidos_data, request)
            return paginator.get_paginated_response(page)
            #return Response(pedidos_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
               
class VentasMensualesView(APIView):
    def get(self, request):
        month_year = request.query_params.get('mes')  # Parámetro para el mes en formato MM-YYYY

        if not month_year:
            return Response({"error": "Falta el parámetro 'mes' en la solicitud."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT b.cod_producto, b.nombre_producto, TO_CHAR(c.fecha_entrega,'MM-YYYY') AS mes_solicitado,
                           NVL(SUM(a.precio_unitario * a.cantidad), 0) AS Total
                    FROM cerveceria_detalle_pedido a
                        JOIN cerveceria_producto b ON (a.cod_producto_id = b.cod_producto)
                        JOIN cerveceria_pedido c ON (a.cod_pedido_id = c.cod_pedido)
                    WHERE c.fecha_entrega IS NOT NULL AND TO_CHAR(c.fecha_entrega,'MM-YYYY') = %s
                    GROUP BY b.cod_producto, b.nombre_producto, TO_CHAR(c.fecha_entrega, 'MM-YYYY')
                    ORDER BY b.cod_producto
                """, [month_year])

                ventas_mensuales = cursor.fetchall()

                if not ventas_mensuales:
                    return Response({"error": "No se encontraron ventas para el mes especificado."}, status=status.HTTP_404_NOT_FOUND)

                ventas_data = []
                for venta in ventas_mensuales:
                    venta_dict = {
                        "cod_producto": venta[0],
                        "nombre_producto": venta[1],
                        "mes_solicitado": venta[2],
                        "total": venta[3],
                    }
                    ventas_data.append(venta_dict)
                return Response(ventas_data, status=status.HTTP_200_OK)

        except OperationalError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PedidoPendienteView(APIView):
    pagination_class =  PedidoPendientePagination

    def get(self, request):
        try:
            # Obtiene todos los pedidos pendientes de la vista
            pedidos_pendientes = PedidoPendiente.objects.all()
            
            # Preparar los datos para enviarlos al frontend
            pedidos_data = [
                {
                    "nombre_cliente": pedido.nombre_cliente,
                    "correo": pedido.correo,
                    "telefono": pedido.telefono,
                    "cod_pedido_id": pedido.cod_pedido_id,
                    "id_detalle_pedido": pedido.id_detalle_pedido,
                    "cod_producto": pedido.cod_producto,
                    "nombre_producto": pedido.nombre_producto,
                    "cantidad": pedido.cantidad,
                    "precio_unitario": pedido.precio_unitario,
                    "total": pedido.total,
                    "fecha_pedido": pedido.fecha_pedido,
                }
                for pedido in pedidos_pendientes
            ]
            # Paginar los resultados utilizando la clase de paginación personalizada
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(pedidos_data, request)
            return paginator.get_paginated_response(page)
        
            # Retorna la respuesta con los datos en formato JSON
            #return Response(pedidos_data, status=status.HTTP_200_OK)
        except Exception as e:
            # Manejo de excepciones en caso de error
            print("estas aqui?")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HistorialPedidosView(APIView):
    pagination_class = HistorialPagination  # Especifica la clase de paginación personalizada

    def get(self, request):
        user_id = request.query_params.get('id')

        if not user_id:
            return Response({"error": "Falta el parámetro ID en la solicitud."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = user_id.strip().replace('-', '')

            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT a.cod_pedido_id, a.id_detalle_pedido, c.cod_producto AS Codigo_Producto, c.nombre_producto,
                           TO_CHAR(b.fecha_pedido,'DD-MM-YYYY') fecha_pedido, cantidad, precio_unitario, cantidad * precio_unitario AS total,
                           TO_CHAR(b.fecha_entrega, 'DD-MM-YYYY') AS fecha_entrega
                    FROM cerveceria_detalle_pedido a    
                    JOIN cerveceria_pedido b ON (a.cod_pedido_id = b.cod_pedido)
                    JOIN cerveceria_producto c ON (a.cod_producto_id = c.cod_producto)
                    WHERE b.id_usuario_id = %s
                    ORDER BY a.cod_pedido_id
                """, [user_id])

                # Obtener todos los resultados de la consulta
                pedidos = cursor.fetchall()

                if not pedidos:
                    return Response({"error": "No se encontraron pedidos para el usuario especificado."}, status=status.HTTP_404_NOT_FOUND)
            
            # Convertir los resultados a una lista paginable
            pedidos_data = []
            for pedido in pedidos:
                pedido_dict = {
                    "cod_pedido_id": pedido[0],
                    "id_detalle_pedido": pedido[1],
                    "cod_producto": pedido[2],
                    "nombre_producto": pedido[3],
                    "fecha_pedido": pedido[4],
                    "cantidad": pedido[5],
                    "precio_unitario": pedido[6],
                    "total": pedido[7],
                    "fecha_entrega": pedido[8]
                }
                pedidos_data.append(pedido_dict)

            # Paginar los resultados utilizando la clase de paginación personalizada
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(pedidos_data, request)
            return paginator.get_paginated_response(page)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 
class ProductoView(viewsets.ModelViewSet):
    serializer_class = ProductoSerializer
    queryset = Producto.objects.all()

class Detalle_PedidoView(viewsets.ModelViewSet):
    serializer_class = Detalle_PedidoSerializer
    queryset = Detalle_Pedido.objects.all()

class PedidoView(viewsets.ModelViewSet):
    serializer_class = PedidoSerializer
    pagination_class = PedidoPagination

    def get_queryset(self):
        id_usuario_id = self.request.query_params.get('id_usuario_id', None)
        if id_usuario_id:
            return Pedido.objects.filter(id_usuario_id=id_usuario_id, fecha_entrega__isnull=False)
        return Pedido.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        pedido = self.get_object()
        pedido.confirmado = True
        pedido.save()
        return Response({'status': 'pedido confirmado'})

@api_view(['POST'])
def update_stock(request):
    try:
        for item in request.data.get('products', []):
            product = Producto.objects.get(id=item['cod_producto'])
            product.stock -= item['quantity']
            product.save()
        return Response({"message": "Stock updated successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
""" @api_view(['PUT'])
def actualizar_producto(request, pk):
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    if 'imagen' not in data:
        data['imagen'] = producto.imagen  # Mantén la imagen existente si no se proporciona una nueva

    serializer = ProductoSerializer(producto, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) """