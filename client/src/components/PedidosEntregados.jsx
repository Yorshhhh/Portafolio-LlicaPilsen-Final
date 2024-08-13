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
        total_boleta: pedido.total_boleta,
        total_neto: pedido.total_neto,
        costo_envio: pedido.costo_envio,
      });
    });

    return Object.values(pedidosAgrupados);
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
        <h1 className="text-center font-medium text-white">
          Pedidos Despachados
        </h1>
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
                Nombre Cliente
              </th>
              <th scope="col" className="px-6 py-3">
                Datos Despacho
              </th>
              <th scope="col" className="px-6 py-3">
                Correo
              </th>
              <th scope="col" className="px-6 py-3">
                Teléfono
              </th>
              <th scope="col" className="px-6 py-3">
                Detalles
              </th>
              <th scope="col" className="px-6 py-3">
                Total Pedido
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha Pedido
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha Despacho
              </th>
            </tr>
          </thead>
          <tbody>
            {agruparPedidos(p_entregados).map((pedidoAgrupado) => (
              <tr
                key={pedidoAgrupado.cod_pedido}
                className="bg-white border-b  hover:bg-gray-50"
              >
                <td className="px-6 py-4">{pedidoAgrupado.cod_pedido}</td>
                <td className="px-6 py-4">{pedidoAgrupado.nombre_cliente}</td>
                <td className="px-6 py-4">
                  Comuna:
                  {pedidoAgrupado.comuna}
                  <br />
                  Dirección: {pedidoAgrupado.direccion}
                  <br />
                  Tipo Documento:{pedidoAgrupado.tipo_documento}
                  <br />
                  Tipo Entrega: {pedidoAgrupado.tipo_entrega}
                </td>
                <td className="px-6 py-4">{pedidoAgrupado.correo}</td>
                <td className="px-6 py-4">{pedidoAgrupado.telefono}</td>
                <td className="px-6 py-4">
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
                  <strong>
                    Total Neto: {formatCurrency(pedidoAgrupado.total_neto)}
                  </strong>
                  <br />
                  <strong>
                    Costo Envio: {formatCurrency(pedidoAgrupado.costo_envio)}
                  </strong>
                  <br />
                  <strong>IVA: {formatCurrency(pedidoAgrupado.iva)}</strong>
                  <br />
                  <strong>
                    Total Boleta: {formatCurrency(pedidoAgrupado.total_boleta)}
                  </strong>
                  <br />
                </td>
                <td className="px-6 py-4">
                  {formatearFecha(pedidoAgrupado.fecha_pedido)}
                </td>
                <td className="px-6 py-4">
                  {formatearFecha(pedidoAgrupado.fecha_entrega)}
                </td>
              </tr>
            ))}
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
