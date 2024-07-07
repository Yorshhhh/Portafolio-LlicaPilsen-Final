import { useState, useEffect } from "react";
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

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

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
        precio_unitario: pedido.precio_unitario.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        }),
        total: pedido.total,
      });
    });

    return Object.values(pedidosAgrupados);
  };
  const calcularTotalBoleta = (detalles) => {
    let totalBoleta = 0;
    detalles.forEach((detalle) => {
      totalBoleta += detalle.total;
    });
    return totalBoleta.toLocaleString("es-CL", {
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
    <>
      <div>
        <h2>Pedidos Entregados</h2>
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>Cod Pedido</th>
              <th>Nombre Cliente</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Detalles</th>
              <th>Fecha Pedido</th>
              <th>Fecha Entrega</th>
            </tr>
          </thead>
          <tbody>
            {agruparPedidos(p_entregados).map((pedidoAgrupado) => (
              <tr key={pedidoAgrupado.cod_pedido}>
                <td>{pedidoAgrupado.cod_pedido}</td>
                <td>{pedidoAgrupado.nombre_cliente}</td>
                <td>{pedidoAgrupado.correo}</td>
                <td>{pedidoAgrupado.telefono}</td>
                <td>
                  <ul>
                    {pedidoAgrupado.detalles.map((detalle, index) => (
                      <li key={index}>
                        <strong>Producto:</strong> {detalle.nombre_producto}
                        <br />
                        <strong>Codigo Producto:{detalle.cod_producto}</strong>
                        <br />
                        <strong>Cantidad:</strong> {detalle.cantidad} <br />
                        <strong>Precio:</strong>
                        {detalle.precio_unitario} <br />
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
                <td>{formatearFecha(pedidoAgrupado.fecha_pedido)}</td>{" "}
                {/* Aquí se formatea la fecha */}
                <td>{formatearFecha(pedidoAgrupado.fecha_entrega)}</td>{" "}
                {/* Aquí se formatea la fecha */}
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
}

export default PedidosEntregados;
