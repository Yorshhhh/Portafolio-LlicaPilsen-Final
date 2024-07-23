import { useState } from "react";
import { buscarPedidoCodigo } from "../api/cerveceria_API";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

function BuscarPedidos() {
  const [busquedaCodigo, setBusquedaCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pedidos, setPedidos] = useState([]);

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
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener los pedidos: ", error);
      setError("Error al cargar los pedidos");
    } finally {
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
        total: pedido.cantidad * pedido.precio_unitario,
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

  /*   const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript comienzan desde 0.
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
  };
 */
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Permitir solo números mayores que 0 o vacío
    if (value === "" || (value.match(/^\d+$/) && Number(value) > 0)) {
      setBusquedaCodigo(value);
      setError(null); // Limpiar el error si el valor es válido
    } else {
      setError("Por favor, ingrese un código de pedido válido mayor que 0.");
    }
  };

  return (
    <div>
      <h1 className="text-center">Buscar Pedidos</h1>
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Ingresar código del pedido"
          value={busquedaCodigo}
          onChange={handleInputChange}
          className="border border-gray-400 rounded py-2 px-4"
        />
        <button
          onClick={buscarPedidoCod}
          className="btn btn-success rounded-none py-2 px-4 ml-4 bg-green-600"
        >
          Buscar
        </button>
      </div>

      {loading && <div>Cargando...</div>}
      {error && <div>{error}</div>}

      <table className="pedidos-table mx-auto">
        <thead>
          <tr>
            <th>Correo Cliente</th>
            <th>Codigo Pedido</th>
            <th>Detalles</th>
            <th>Fecha Pedido</th>
            <th>Fecha Entrega</th>
            <th>Codigo Envio</th>
            <th>Tipo Entrega</th>
            <th>Comuna Envio</th>
          </tr>
        </thead>
        <tbody>
          {agruparPedidos(pedidos).map((pedidoAgrupado) => (
            <tr key={pedidoAgrupado.cod_pedido}>
              <td>{pedidoAgrupado.correo}</td>
              <td>{pedidoAgrupado.cod_pedido}</td>
              <td>
                <ul>
                  {pedidoAgrupado.detalles.map((detalle, index) => (
                    <li key={index} className="mb-4">
                      <strong>Producto:</strong> {detalle.nombre_producto}
                      <br />
                      <strong>Codigo Producto:</strong>{" "}
                      {detalle.cod_producto_id}
                      <br />
                      <strong>Cantidad:</strong> {detalle.cantidad} <br />
                      <strong>Precio:</strong>{" "}
                      {detalle.precio_unitario.toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                      <br />
                      <strong>Total:</strong>{" "}
                      {detalle.total.toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                      <br />
                    </li>
                  ))}
                  <li className="mt-4">
                    <strong>Total Boleta:</strong>{" "}
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
                {pedidoAgrupado.codigo_envio || "codigo no proporcionado aun"}
              </td>
              <td>{pedidoAgrupado.tipo_entrega}</td>
              <td>{pedidoAgrupado.comuna_envio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BuscarPedidos;
