import axios from "axios";

const cerveceriaAPI = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  timeout: 10000, // Tiempo de espera opcional, ajusta según sea necesario
  headers: {
    "Content-Type": "application/json",
  },
});
// Agregar un interceptor para incluir el token en todas las solicitudes
cerveceriaAPI.interceptors.request.use(
  (config) => {
    // Obtener el token del almacenamiento local o algún otro lugar seguro
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllProductos = () => {
  return cerveceriaAPI.get("/productos/");
};

export const agregarProducto = (producto) => {
  return cerveceriaAPI.post("/productos/", producto);
};

export const registrarUsuario = (usuario) => {
  return cerveceriaAPI.post("/usuarios/register/", usuario);
};

export const registrarAdmin = (admin) => {
  return cerveceriaAPI.post("/usuarios/create_admin/", admin);
};

export const loginUsuario = (credenciales) => {
  return cerveceriaAPI.post("/login/", credenciales);
};
// Función para actualizar la dirección del usuario
export const actualizarDireccion = (id, nuevaDireccion) => {
  return cerveceriaAPI.patch(`/usuarios/${id}/`, { direccion: nuevaDireccion });
};

export const confirmarPedido = (cod_pedido_id, fecha_Entregado) => {
  return cerveceriaAPI.patch(`/pedidos/${cod_pedido_id}/`, {
    fecha_entrega: fecha_Entregado,
  });
};

export const registrarPedido = async (pedido) => {
  try {
    const response = await cerveceriaAPI.post("/pedidos/", pedido);
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    throw error; // Lanza el error para que sea manejado en el componente React
  }
};

export const registrarDetalles = async (detalles) => {
  try {
    const response = await cerveceriaAPI.post("/detalle_pedidos/", detalles);
    return response.data; // Devuelve la respuesta para manejarla en la función que llama
  } catch (error) {
    throw error; // Propaga el error para ser manejado en otro lugar
  }
};

export const obtenerGananciasPorProducto = async () => {
  try {
    const response = await cerveceriaAPI.get("/ganancias_producto/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const historialPedidos = async (id) => {
  try {
    const response = await cerveceriaAPI.get("/historial_pedidos/", {
      params: { id: id },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ventasMensuales = async(mes) =>{
  try{
    const response = await cerveceriaAPI.get(("/ventas_mensuales/"), {
      params: {mes: mes},
    })
    return response.data;
  }catch(error)
{
  throw error;
}}

export const obtenerPedidosPendientes = async () => {
  try {
    const response = await cerveceriaAPI.get("/pedidos_pendientes/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerPedidosEntregados = async () => {
  try {
    const response = await cerveceriaAPI.get("/pedidos_entregados/");
    return response.data;
  } catch (error) {
    throw error;
  }
};
/* export const actualizarDireccion = (correoUsuario, nuevaDireccion) => {
  return axios.put(`http://localhost:8000/usuarios/actualizar-direccion/${correoUsuario}/`, { direccion: nuevaDireccion })
      .then(response => {
          console.log('Dirección actualizada correctamente:', response.data);
          return response.data;
      })
      .catch(error => {
          console.error('Error al actualizar la dirección:', error);
          throw error;
      });
}; */

export const getProducto = (id) => {
  return cerveceriaAPI.get(`/productos/${id}`);
};

/* export const getTokenTransbank = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/webpay_plus/getToken"
    );
    // Verificar si la respuesta contiene los datos esperados
    const { token, url } = response.data;
    if (!token || !url) {
      throw new Error(
        "La respuesta del servidor no contiene el token o la URL"
      );
    }
    return { token, url };
  } catch (error) {
    console.error("Error al obtener el token de Transbank:", error);
    throw error; // Relanzar el error para que el componente que llama pueda manejarlo
  }
};
 */
export const createTransaction = async (amount) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/webpay_plus/create",
      { amount }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};
