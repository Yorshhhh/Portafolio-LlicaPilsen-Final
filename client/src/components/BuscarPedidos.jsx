import { useState } from "react";
import { buscarPedidoCodigo, buscarPedidoCorreo } from "../api/cerveceria_API";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

function BuscarPedidos() {
  const [busquedaCodigo, setBusquedaCodigo] = useState("");
  const [busquedaCorreo, setBusquedaCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pedidosCodigo, setPedidosCodigo] = useState([]);
  const [pedidosCorreo, setPedidosCorreo] = useState([]);
  const [nextPageCorreo, setNextPageCorreo] = useState(null);
  const [prevPageCorreo, setPrevPageCorreo] = useState(null);

  const buscarPedidoCod = async () => {
    if (
      !busquedaCodigo ||
      isNaN(busquedaCodigo) ||
      Number(busquedaCodigo) <= 0
    ) {
      setError("Por favor, ingrese un código de pedido válido mayor que 0.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await buscarPedidoCodigo(busquedaCodigo);
      setPedidosCodigo(data);
      setPedidosCorreo([]); // Limpiar resultados de correo
      setNextPageCorreo(null);
      setPrevPageCorreo(null);
    } catch (error) {
      const mensajeError = error.response?.data?.error || "Error desconocido";
      toast.error(mensajeError);
    } finally {
      setLoading(false);
      setBusquedaCodigo(""); // Limpiar el input de código
      setBusquedaCorreo(""); // Limpiar el input de correo
    }
  };

  const buscarPedidoCorreoHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await buscarPedidoCorreo(busquedaCorreo);
      setPedidosCorreo(data.results);
      setPedidosCodigo([]); // Limpiar resultados de código
      setNextPageCorreo(data.next);
      setPrevPageCorreo(data.previous);
    } catch (error) {
      const mensajeError = error.response?.data?.error || "Error desconocido";
      toast.error(mensajeError);
    } finally {
      setLoading(false);
      setBusquedaCodigo(""); // Limpiar el input de código
      setBusquedaCorreo(""); // Limpiar el input de correo
    }
  };

  const handlePageChange = async (pageUrl) => {
    try {
      setLoading(true);
      const response = await fetch(pageUrl);
      const data = await response.json();
      setPedidosCorreo(data.results); // Actualiza los resultados de la página actual
      setNextPageCorreo(data.next); // Actualiza el enlace a la siguiente página
      setPrevPageCorreo(data.previous); // Actualiza el enlace a la página anterior
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
        cod_producto_id: pedido.cod_producto_id,
        nombre_producto: pedido.nombre_producto,
        cantidad: pedido.cantidad,
        precio_unitario: pedido.precio_unitario,
        iva: pedido.iva,
        total_boleta: pedido.total_boleta,
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
    if (typeof amount !== "number" || isNaN(amount)) {
      return ""; // o un valor predeterminado
    }
    return amount.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });
  };

  const handleCodigoInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || (value.match(/^\d+$/) && Number(value) > 0)) {
      setBusquedaCodigo(value);
      setError(null);
    } else {
      setError("Por favor, ingrese un código de pedido válido mayor que 0.");
    }
  };

  const handleCorreoInputChange = (e) => {
    setBusquedaCorreo(e.target.value);
  };

  return (
    <div>
      <h1 className="text-center">Buscar Pedidos</h1>
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Ingresar código del pedido"
          value={busquedaCodigo}
          onChange={handleCodigoInputChange}
          className="border border-gray-400 rounded py-2 px-4"
        />
        <button
          onClick={buscarPedidoCod}
          className="btn btn-success rounded-none py-2 px-4 ml-4 bg-green-600"
        >
          Buscar
        </button>

        <input
          type="email"
          placeholder="Ingresar correo@buscar.cl"
          value={busquedaCorreo}
          onChange={handleCorreoInputChange}
          className="border border-gray-400 rounded py-2 px-4 ml-4"
        />
        <button
          onClick={buscarPedidoCorreoHandler}
          className="btn btn-success rounded-none py-2 px-4 ml-4 bg-green-600"
        >
          Buscar
        </button>
      </div>

      {loading && <div>Cargando...</div>}

      {pedidosCorreo.length > 0 && (
        <div className="flex justify-center">
          {prevPageCorreo && (
            <button onClick={() => handlePageChange(prevPageCorreo)}>
              Página Anterior
              <FaArrowAltCircleLeft className="ml-2" />
            </button>
          )}
          {nextPageCorreo && (
            <button onClick={() => handlePageChange(nextPageCorreo)}>
              Siguiente Página
              <FaArrowAltCircleRight className="ml-2" />
            </button>
          )}
        </div>
      )}

      <table className="pedidos-table mx-auto">
        <thead>
          <tr>
            <th>Codigo Pedido</th>
            <th>Nombre Cliente</th>
            <th>Correo Cliente</th>
            <th>Datos Despacho</th>
            <th>Detalles</th>
            <th>Total del Pedido</th>
            <th>Fecha Pedido</th>
            <th>Fecha Despacho</th>
            <th>Codigo Envio</th>
          </tr>
        </thead>
        <tbody>
          {agruparPedidos([...pedidosCodigo, ...pedidosCorreo]).map(
            (pedidoAgrupado) => {
              const { total, iva, totalConIva } = calcularTotales(
                pedidoAgrupado.detalles
              );

              return (
                <tr key={pedidoAgrupado.cod_pedido}>
                  <td>{pedidoAgrupado.cod_pedido}</td>
                  <td>{pedidoAgrupado.nombre_cliente}</td>
                  <td>{pedidoAgrupado.correo}</td>
                  <td>
                    Comuna:
                    {pedidoAgrupado.comuna}
                    <br />
                    Dirección: {pedidoAgrupado.direccion}
                    <br />
                    Tipo Documento:{pedidoAgrupado.tipo_documento}
                    <br />
                    Tipo Entrega: {pedidoAgrupado.tipo_entrega}
                  </td>
                  <td>
                    <ul>
                      {pedidoAgrupado.detalles.map((detalle, index) => (
                        <li key={index} className="mb-4">
                          <strong>Producto:</strong> {detalle.nombre_producto}
                          <br />
                          <strong>Codigo Producto:</strong>{" "}
                          {detalle.cod_producto_id}
                          <br />
                          <strong>Cantidad:</strong> {detalle.cantidad}
                          <br />
                          <strong>Precio:</strong>
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
                      Total Boleta:{" "}
                      {formatCurrency(pedidoAgrupado.total_boleta)}
                    </strong>
                    <br />
                    <strong>IVA: {formatCurrency(pedidoAgrupado.iva)}</strong>
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
                    {pedidoAgrupado.codigo_envio ||
                      "codigo no proporcionado aun"}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
      <div className="flex justify-center">
        {prevPageCorreo && (
          <button onClick={() => handlePageChange(prevPageCorreo)}>
            Página Anterior
            <FaArrowAltCircleLeft className="ml-2" />
          </button>
        )}
        {nextPageCorreo && (
          <button onClick={() => handlePageChange(nextPageCorreo)}>
            Siguiente Página
            <FaArrowAltCircleRight className="ml-2" />
          </button>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default BuscarPedidos;
