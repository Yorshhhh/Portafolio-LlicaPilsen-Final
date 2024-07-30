import React, { useEffect, useState } from "react";
import axios from "axios";
import { registrarPedido, registrarDetalles } from "../api/cerveceria_API";
import { useLocation } from "react-router-dom";
import CarritoExito from "../components/CarritoExito";
import Navbar from "../components/Navbar";
import "../css/ExitoPage.css";

function ExitoPage() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [carro, setCarrito] = useState([]);
  const [transactionData, setTransactionData] = useState(null);
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [error, setError] = useState(null);

  const fechaPedido = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const userCarrito = localStorage.getItem("carrito");
    if (userCarrito) {
      try {
        const carritoParsed = JSON.parse(userCarrito);
        setCarrito(carritoParsed);
        setCantidadProductos(carritoParsed.length);
      } catch (error) {
        console.error("Error al parsear el carrito del localStorage:", error);
        setError("Error al cargar el carrito.");
      }
    } else {
      console.warn("No existen productos en el carrito.");
      setError("No hay productos en el carrito.");
    }

    const userJson = localStorage.getItem("usuario");
    if (userJson) {
      try {
        const userParsed = JSON.parse(userJson);
        setUser(userParsed);
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage: ", error);
        setError("Error al cargar el usuario.");
      }
    } else {
      console.warn("No existe un usuario en el localStorage");
      setError("No hay usuario registrado.");
    }
  }, []);

  useEffect(() => {
    const confirmTransaction = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token_ws");

      if (!token) {
        setError("Token no encontrado en la URL");
        return;
      }

      if (!user) {
        setError("Usuario no encontrado. No se puede procesar la transacción.");
        return;
      }

      if (carro.length === 0) {
        setError("Carrito vacío. No se puede procesar la transacción.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/webpay_plus/commit",
          { token_ws: token }
        );

        if (response.data.status === "success") {
          setTransactionData(response.data.viewData.commitResponse);

          const pedidoDetalles = localStorage.getItem("pedidoDetalles");

          if (pedidoDetalles) {
            const {
              total,
              iva, // Desestructuramos el valor del IVA
              tipo_entrega,
              comuna,
              tipo_documento,
              direccion,
              telefono,
              productos,
              razon_social,
              rut_empresa,
              giro_comercial,
              direccion_empresa,
              numero_empresa,
              ciudad_empresa,
              comuna_empresa,
            } = JSON.parse(pedidoDetalles);

            const nuevoPedido = {
              fecha_pedido: fechaPedido,
              id_usuario: user.id,
              total: total,
              iva: iva,
              tipo_entrega: tipo_entrega,
              tipo_documento: tipo_documento,
              comuna_envio: comuna,
              direccion: direccion,
              telefono: telefono,
              ...(tipo_documento === "factura" && {
                razon_social: razon_social,
                rut_empresa: rut_empresa,
                giro_comercial: giro_comercial,
                direccion_empresa: direccion_empresa,
                numero_empresa: numero_empresa,
                ciudad_empresa: ciudad_empresa,
                comuna_empresa: comuna_empresa,
              }),
            };

            try {
              const pedido = await registrarPedido(nuevoPedido);
              console.log("Pedido registrado:", pedido);

              const detalles = productos.map((producto) => ({
                cod_producto: producto.cod_producto,
                cod_pedido: pedido.cod_pedido,
                descuento: 0,
                cantidad: producto.quantity,
                precio_unitario: producto.precio_producto,
                iva: iva / productos.length, // Distribuir el IVA proporcionalmente
              }));

              const promises = detalles.map((detalle) =>
                registrarDetalles(detalle)
              );
              await Promise.all(promises);
              console.log(
                "Todos los detalles de pedidos han sido registrados."
              );
              localStorage.removeItem("carrito");
              localStorage.removeItem("pedidoDetalles");
              console.log("Carrito y detalles eliminados del localStorage.");
            } catch (error) {
              console.error(
                "Error al registrar los detalles del pedido:",
                error
              );
              setError("Error al registrar los detalles del pedido.");
            }
          } else {
            setError("No se encontraron detalles de pedido en localStorage.");
          }
        } else {
          setError(
            "Error en la transacción: " +
              JSON.stringify(response.data.commitResponse)
          );
        }
      } catch (error) {
        setError("Error confirmando la transacción: " + error.message);
      }
    };

    if (user && carro.length > 0) {
      confirmTransaction();
    }
  }, [location, user, carro]);

  return (
    <>
      <Navbar />
      <div className="center-container">
        {transactionData && (
          <div>
            <div className="alert alert-success" role="alert">
              <h2>¡Transacción exitosa!</h2>
              <img
                src="tic-verde.jpg"
                alt=""
                style={{ width: "20%", height: "auto" }}
              />
              <CarritoExito />
            </div>
          </div>
        )}
        {error && (
          <div>
            <h2>¡Error!</h2>
            <img
              src="cruz-roja.png"
              alt=""
              style={{ width: "30%", height: "auto" }}
            />
            <p>{error}</p>
          </div>
        )}
        <a href="/home">Volver al inicio</a>
        <hr />
      </div>
    </>
  );
}

export default ExitoPage;
