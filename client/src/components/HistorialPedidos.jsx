import React, { useState, useEffect } from "react";
import { historialPedidos } from "../api/cerveceria_API";
import "../css/PedidosPendientes.css";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";

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
      if (!pedidosAgrupados[pedido.cod_pedido_]) {
        pedidosAgrupados[pedido.cod_pedido] = {
          ...pedido,
          detalles: [],
        };
      }
      pedidosAgrupados[pedido.cod_pedido].detalles.push({
        id_detalle_pedido: pedido.id_detalle_pedido,
        cod_producto: pedido.cod_producto,
        nombre_producto: pedido.nombre_producto,
        cantidad: pedido.cantidad,
        precio_unitario: pedido.precio_unitario,
      });
    });

    return Object.values(pedidosAgrupados);
  };

  const calcularTotales = (detalles) => {
    if (!detalles || detalles.length === 0) {
      return { total: 0, iva: 0, totalConIva: 0 };
    }

    let totalBoleta = 0;

    detalles.forEach((detalle) => {
      const subtotal = detalle.precio_unitario * detalle.cantidad;
      totalBoleta += subtotal;
    });

    const totalIva = totalBoleta * 0.19;
    const totalConIva = totalBoleta + totalIva;

    return { total: totalBoleta, iva: totalIva, totalConIva: totalConIva };
  };
  const formatCurrency = (amount) => {
    return amount.toLocaleString("es-CL", {
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
        <div className="flex justify-center">
          {prevPage && (
            <button onClick={() => handlePageChange(prevPage)}>
              Página Anterior
              <FaArrowAltCircleLeft className="ml-2" />
            </button>
          )}
          {nextPage && (
            <button onClick={() => handlePageChange(nextPage)}>
              Siguiente Página
              <FaArrowAltCircleRight className="ml-2" />
            </button>
          )}
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Cod Pedido
              </th>
              <th scope="col" className="px-6 py-3">
                Datos Despacho
              </th>
              <th scope="col" className="px-6 py-3">
                Detalle Pedido
              </th>
              <th scope="col" className="px-6 py-3">
                Total del Pedido
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha de Pedido
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha de Entrega
              </th>
            </tr>
          </thead>
          <tbody>
            {agruparPedidos(historial).map((pedidoAgrupado) => {
              const { total, iva, totalConIva } = calcularTotales(
                pedidoAgrupado.detalles
              );
              return (
                <tr
                  key={pedidoAgrupado.cod_pedido}
                  className="bg-white border-b  hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{pedidoAgrupado.cod_pedido}</td>
                  <td className="px-6 py-4">
                    Comuna:
                    {pedidoAgrupado.comuna}
                    <br />
                    Dirección: {user.direccion}
                    <br />
                    Tipo Documento:{pedidoAgrupado.tipo_documento}
                    <br />
                    Tipo Entrega: {pedidoAgrupado.tipo_entrega}
                  </td>
                  <td className="px-6 py-4">
                    <ul>
                      {pedidoAgrupado.detalles.map((detalle, index) => (
                        <li key={index} className="mb-4">
                          <strong>Codigo Producto:</strong>{" "}
                          {detalle.cod_producto}
                          <br />
                          <strong>Nombre Producto:</strong>
                          {detalle.nombre_producto}
                          <br />
                          <strong>Cantidad:</strong> {detalle.cantidad} <br />
                          <strong>Precio:</strong>{" "}
                          {detalle.precio_unitario.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}
                          <br />
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="text-center">
                    <strong>Total neto: {formatCurrency(total)}</strong>
                    <br />
                    <strong>IVA: {formatCurrency(iva)}</strong>
                    <br />
                    <strong>Total + IVA: {formatCurrency(totalConIva)}</strong>
                  </td>
                  <td className="px-6 py-4">{pedidoAgrupado.fecha_pedido}</td>
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
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-center">
          {prevPage && (
            <button onClick={() => handlePageChange(prevPage)}>
              Página Anterior
              <FaArrowAltCircleLeft className="ml-2" />
            </button>
          )}
          {nextPage && (
            <button onClick={() => handlePageChange(nextPage)}>
              Siguiente Página
              <FaArrowAltCircleRight className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorialPedidos;
