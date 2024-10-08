import axios from "axios";

const cerveceriaAPI = axios.create({
  baseURL: "https://6d80-191-114-51-188.ngrok-free.app",
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
      config.headers["Authorization"] = `Bearer ${token}`; // Cambiado a 'Bearer'
      console.log("Token agregado a la solicitud:", token); // Añadir un console.log para verificar
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllProductos = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/productos/");
    return response; // Devuelve la respuesta
  } catch (error) {
    console.error("Error al obtener productos:", error.response || error.message);
    throw error; // Lanza el error para que se pueda manejar donde se llame
  }
};

/* export const agregarProducto = (producto) => {
  return cerveceriaAPI.post("/productos/", producto);
};
 */
export const registrarUsuario = (usuario) => {
  return cerveceriaAPI.post("/usuarios/register/", usuario);
};

export const registrarAdmin = (admin) => {
  return cerveceriaAPI.post("/usuarios/create_admin/", admin);
};

export const loginUsuario = (credenciales) => {
  return cerveceriaAPI.post("/login/", credenciales);
};

export const registrarEmpresa = (empresaData) => {
  return cerveceriaAPI.post("/empresas/", empresaData);
};
// Función para actualizar la dirección del usuario
export const actualizarDireccion = (id, nuevaDireccion) => {
  return cerveceriaAPI.patch(`/usuarios/${id}/`, { direccion: nuevaDireccion });
};

export const actualizarTelefono = (id, nuevoTelefono) => {
  return cerveceriaAPI.patch(`/usuarios/${id}/`, { telefono: nuevoTelefono });
}

export const confirmarPedido = (cod_pedido_id, fecha_Entregado, cod_comuna) => {
  return cerveceriaAPI.patch(`/pedidos/${cod_pedido_id}/`, {
    fecha_entrega: fecha_Entregado,
    cod_comuna: cod_comuna,
  });
};

export const confirmar = async (pedidoId) => {
  const response = await cerveceriaAPI.post(
    `/pedidos/${pedidoId}/confirmar/`,
    {}
  );
  return response.data;
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

export const obtenerVentasPorProducto = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/ventas_producto/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerVentasPorComuna = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/ventas_comuna/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerVentasPorDocumento = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/ventas_documento/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerVentasPorEntrega = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/ventas_entrega/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const historialPedidos = async (id) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/historial_pedidos/", {
      params: { id: id },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buscarPedidoCodigo = async (codigo) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/buscar_pedidos_cod/", {
      params: { cod_pedido: codigo },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buscarPedidoCorreo = async (correo) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/buscar_pedidos_correo/", {
      params: { correo: correo },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ventasPorFecha = async (fecha_inicio, fecha_fin) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/ventas_entre/", {
      params: {
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ventasF29 = async (fecha_inicio, fecha_fin) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/ventas_f29/", {
      params: {
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ventasMensualesProducto = async (mes) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/ventas_mensuales/", {
      params: { mes: mes },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ventasMensualesComuna = async (mes) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/ventas_mensuales_comuna/", {
      params: { mes: mes },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerPedidosPendientes = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/pedidos_pendientes/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerPedidosEntregados = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/pedidos_despachados/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerComunas = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/comunas/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerCiudades = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/ciudades/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerRegiones = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/regiones/");
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
  return axios.get(`http://127.0.0.1:8000/productos/${id}`);
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

export const sendBulkEmail = async (subject, body) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/correo-masivo/', {
      email_subject: subject,
      email_body: body,
    });
  } catch (error) {
    console.error('Error enviando correos:', error);
  }
};
