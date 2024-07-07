import React, { useState, useEffect } from "react";
import { historialPedidos } from "../api/cerveceria_API";
import "../css/PedidosPendientes.css";

const HistorialPedidos = () => {
  const [user, setUser] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const userJson = localStorage.getItem("usuario");
        if (!userJson) {
          throw new Error("No se encontró un usuario en el localStorage.");
        }
        const userParsed = JSON.parse(userJson);
        setUser(userParsed);

        const res = await historialPedidos(userParsed.id);
        console.log("Datos recibidos:", res);
        setHistorial(res.results); // Actualiza los resultados de la página actual
        setNextPage(res.next); // Actualiza el enlace a la siguiente página
        setPrevPage(res.previous); // Actualiza el enlace a la página anterior
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el historial: ", error);
        setError("Error al cargar el historial de pedidos.");
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const handlePageChange = async (pageUrl) => {
    try {
      setLoading(true);
      const response = await fetch(pageUrl);
      const data = await response.json();
      setHistorial(data.results); // Actualiza los resultados de la página actual
      setNextPage(data.next); // Actualiza el enlace a la siguiente página
      setPrevPage(data.previous); // Actualiza el enlace a la página anterior
      setLoading(false);
    } catch (error) {
      console.error("Error al cambiar de página: ", error);
      setError("Error al cambiar de página.");
      setLoading(false);
    }
  };

  const agruparPedidos = (pedidos) => {
    const pedidosAgrupados = {};

    pedidos.forEach((pedido) => {
      if (!pedidosAgrupados[pedido.cod_pedido_id]) {
        pedidosAgrupados[pedido.cod_pedido_id] = {
          ...pedido,
          detalles: [],
        };
      }
      pedidosAgrupados[pedido.cod_pedido_id].detalles.push({
        id_detalle_pedido: pedido.id_detalle_pedido,
        cod_producto: pedido.cod_producto,
        nombre_producto: pedido.nombre_producto,
        cantidad: pedido.cantidad,
        precio_unitario: pedido.precio_unitario,
        total: pedido.total,
      });
    });

    return Object.values(pedidosAgrupados);
  };

  const calcularTotalBoleta = (detalles) => {
    // Verificar si detalles está definido y no es null
    if (!detalles || detalles.length === 0) {
      return "0,00 CLP"; // O cualquier valor predeterminado que desees mostrar
    }

    let totalBoleta = 0;
    detalles.forEach((detalle) => {
      totalBoleta += detalle.total;
    });

    return totalBoleta.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div>
        <h2>Historial de Pedidos</h2>
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>Cod Pedido</th>
              <th>Detalle Pedido</th>
              <th>Fecha de Pedido</th>
              <th>Fecha de Entrega</th>
              <th>Total del Pedido</th>
            </tr>
          </thead>
          <tbody>
            {agruparPedidos(historial).map((pedidoAgrupado) => (
              <tr key={pedidoAgrupado.cod_pedido_id}>
                <td>{pedidoAgrupado.cod_pedido_id}</td>
                <td>
                  <ul>
                    {pedidoAgrupado.detalles.map((detalle, index) => (
                      <li key={index}>
                        <strong>Codigo Producto:</strong> {detalle.cod_producto} <br />
                        <strong>Nombre Producto:</strong> {detalle.nombre_producto} <br />
                        <strong>Cantidad:</strong> {detalle.cantidad} <br />
                        <strong>Precio:</strong>{" "}
                        {detalle.precio_unitario.toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}
                        <br />
                      </li>
                    ))}
                    <li>
                      Total:{" "}
                      <strong>
                        {calcularTotalBoleta(pedidoAgrupado.detalles)}
                      </strong>
                    </li>
                  </ul>
                </td>
                <td>{pedidoAgrupado.fecha_pedido}</td>
                <td
                  className={
                    pedidoAgrupado.fecha_entrega
                      ? "estado-entregado"
                      : "estado-pendiente"
                  }
                >
                  {pedidoAgrupado.fecha_entrega ? (
                    <>
                      ¡Entregado! <br />
                      Fecha: {pedidoAgrupado.fecha_entrega}
                    </>
                  ) : (
                    "Pendiente"
                  )}
                </td>
                <td>
                  <strong>{calcularTotalBoleta(pedidoAgrupado.detalles)}</strong>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {prevPage && (
          <button onClick={() => handlePageChange(prevPage)}>
            Página Anterior
          </button>
        )}
        {nextPage && (
          <button onClick={() => handlePageChange(nextPage)}>
            Siguiente Página
          </button>
        )}
      </div>
    </>
  );
};

export default HistorialPedidos;
