import React, { useState, useEffect } from "react";
import {
  obtenerPedidosPendientes,
  confirmarPedido,
} from "../api/cerveceria_API";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import "../css/PedidosPendientes.css";

function PedidosPendientes() {
  const [p_pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const fechaEntrega = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const data = await obtenerPedidosPendientes();
        setPendientes(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los pedidos pendientes: ", error);
        setError("Error al cargar los pedidos pendientes");
        setLoading(false);
      }
    };
    fetchPendientes();
  }, []);

  const handlePageChange = async (pageUrl) => {
    try {
      setLoading(true);
      const response = await fetch(pageUrl);
      const data = await response.json();
      setPendientes(data.results); // Actualiza los resultados de la página actual
      setNextPage(data.next); // Actualiza el enlace a la siguiente página
      setPrevPage(data.previous); // Actualiza el enlace a la página anterior
      setLoading(false);
    } catch (error) {
      console.error("Error al cambiar de página: ", error);
      setError("Error al cambiar de página.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  // Función para agrupar los pedidos por cod_pedido_id
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
        iva: pedido.iva,
      });
    });

    return Object.values(pedidosAgrupados);
  };

  // Manejar la confirmación de un pedido
  const handleConfirmar = async (pedido) => {
    const confirmar = window.confirm(
      `¿Estás seguro de confirmar el pedido ${pedido.cod_pedido_id}?`
    );
    if (confirmar) {
      console.log("Pedido confirmado:", pedido);
      try {
        await confirmarPedido(pedido.cod_pedido_id, fechaEntrega);
        alert(`Pedido ${pedido.cod_pedido_id} confirmado exitosamente.`);
        // Actualizar la lista de pedidos después de confirmar
        const nuevosPedidos = p_pendientes.filter(
          (p) => p.cod_pedido_id !== pedido.cod_pedido_id
        );
        setPendientes(nuevosPedidos);
      } catch (error) {
        console.error("Error al confirmar el pedido: ", error);
        setError("Error al confirmar este");
      }
    }
  };
  const calcularTotales = (detalles) => {
    if (!detalles || detalles.length === 0) {
      return { total: 0, iva: 0, totalConIva: 0 };
    }

    let totalBoleta = 0;
    let totalIva = 0;

    detalles.forEach((detalle) => {
      const subtotal = detalle.precio_unitario * detalle.cantidad;
      totalBoleta += subtotal;
      totalIva += detalle.iva * detalle.cantidad;
    });

    const totalConIva = totalBoleta + totalIva;

    return { total: totalBoleta, iva: totalIva, totalConIva: totalConIva };
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });
  };

  // Función para formatear la fecha
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript comienzan desde 0.
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
  };

  return (
    <div>
      <h1>Pedidos Pendientes</h1>
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
      <table className="pedidos-table">
        <thead>
          <tr>
            <th>Cod Pedido</th>
            <th>Nombre Cliente</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Detalles</th>
            <th>Total Pedido</th>
            <th>Fecha Pedido</th>
            <th>Confirmar Pedido</th>
          </tr>
        </thead>
        <tbody>
          {agruparPedidos(p_pendientes).map((pedidoAgrupado) => {
            const { total, iva, totalConIva } = calcularTotales(
              pedidoAgrupado.detalles
            );
            return (
              <tr key={pedidoAgrupado.cod_pedido}>
                <td>{pedidoAgrupado.cod_pedido_id}</td>
                <td>{pedidoAgrupado.nombre_cliente}</td>
                <td>{pedidoAgrupado.correo}</td>
                <td>{pedidoAgrupado.telefono}</td>
                <td>
                  <ul>
                    {pedidoAgrupado.detalles.map((detalle, index) => (
                      <li key={index} className="mb-4">
                        <strong>Producto:</strong> {detalle.nombre_producto}
                        <br />
                        <strong>Codigo Producto:</strong> {detalle.cod_producto}
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
                <td>{formatearFecha(pedidoAgrupado.fecha_pedido)}</td>
                <td>
                  <button
                    onClick={() => handleConfirmar(pedidoAgrupado)}
                    className="btn btn-danger"
                  >
                    Confirmar Pedido?
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
  );
}

export default PedidosPendientes;
