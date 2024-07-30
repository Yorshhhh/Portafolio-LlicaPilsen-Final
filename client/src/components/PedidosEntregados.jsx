import { useState, useEffect } from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import { obtenerPedidosEntregados } from "../api/cerveceria_API";

function PedidosEntregados() {
  const [p_entregados, setEntregados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    const fetchEntregados = async () => {
      try {
        const data = await obtenerPedidosEntregados();
        setEntregados(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los pedidos entregados: ", error);
        setError("Error al cargar los pedidos entregados");
        setLoading(false);
      }
    };
    fetchEntregados();
  }, []);

  const handlePageChange = async (pageUrl) => {
    try {
      setLoading(true);
      const response = await fetch(pageUrl);
      const data = await response.json();
      setEntregados(data.results); // Actualiza los resultados de la página actual
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
      if (!pedidosAgrupados[pedido.cod_pedido]) {
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
        iva: pedido.iva,
      });
    });

    return Object.values(pedidosAgrupados);
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

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
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
        <h1>Pedidos Entregados</h1>
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
        <table className="pedidos-table mx-auto">
          <thead>
            <tr>
              <th>Cod Pedido</th>
              <th>Nombre Cliente</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Detalles</th>
              <th>Total Pedido</th>
              <th>Fecha Pedido</th>
              <th>Fecha Entrega</th>
            </tr>
          </thead>
          <tbody>
            {agruparPedidos(p_entregados).map((pedidoAgrupado) => {
              const { total, iva, totalConIva } = calcularTotales(pedidoAgrupado.detalles);
              return (
                <tr key={pedidoAgrupado.cod_pedido}>
                  <td>{pedidoAgrupado.cod_pedido}</td>
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
                  <td>{formatearFecha(pedidoAgrupado.fecha_entrega)}</td>
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
}

export default PedidosEntregados;
