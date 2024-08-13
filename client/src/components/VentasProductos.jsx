import React, { useState, useEffect } from "react";
import {
  obtenerVentasPorProducto,
  ventasMensualesProducto,
  ventasPorFecha,
  ventasF29,
} from "../api/cerveceria_API";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#6A4C93",
];

const formatCurrency = (value) => {
  return `$${Number(value).toLocaleString("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

function VentasProductos() {
  const [ventasProducto, setVentasProducto] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [ventasPorFechaData, setVentasPorFechaData] = useState([]);
  const [documentosData, setDocumentosData] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [tempMonth, setTempMonth] = useState("");

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(5, 7);
    const currentYear = new Date().getFullYear();
    const initialMonth = `${currentMonth}-${currentYear}`;
    setTempMonth(initialMonth);
    setSelectedMonth(initialMonth);
    fetchVentasMensuales(initialMonth);
    fetchVentasPorProducto();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchVentasMensuales(selectedMonth);
    }
  }, [selectedMonth]);

  const fetchVentasPorProducto = async () => {
    try {
      setLoading(true);
      const data = await obtenerVentasPorProducto();
      setVentasProducto(data);
    } catch (error) {
      console.error("Error al obtener las ventas por producto: ", error);
      toast.error("Error al cargar las ventas por producto.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVentasMensuales = async (mes) => {
    try {
      setLoading(true);
      const data = await ventasMensualesProducto(mes);
      if (data.length === 0) {
        toast.info(`No se encontraron ventas para el mes ${mes}.`);
      } else {
        setVentasMensuales(data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error desconocido";
      console.error("Error al obtener las ventas mensuales: ", error);
      toast.error(`Error al obtener ventas mensuales: \n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (value) => {
    // Filtra caracteres no permitidos y asegura que el formato sea DD-MM-YYYY
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits; // DD
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`; // DD-MM
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`; // DD-MM-YYYY
  };

  const handleFechaChange = (event, setter) => {
    const value = event.target.value;
    setter(formatFecha(value));
  };


  const handleFetchVentas = async () => {

    const fechaRegex = /^\d{2}-\d{2}-\d{4}$/;

    if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
      toast.error("Formato de fecha inválido. Use DD-MM-YYYY.");
      return;
    }

    try {
      setLoading(true);
      const data = await ventasPorFecha(fechaInicio, fechaFin);
      if (data.length === 0) {
        toast.info(
          "No se encontraron ventas para el rango de fechas especificado."
        );
      } else {
        setVentasPorFechaData(data);
        const documentosResponse = await ventasF29(fechaInicio, fechaFin);
        console.log(documentosResponse);
        setDocumentosData(documentosResponse);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error desconocido";
      console.error("Error al obtener las ventas por fecha: ", error);
      toast.error(`Error al obtener ventas por periodo: \n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    setTempMonth(newMonth);
  };

  const handleProductChange = (event) => {
    const options = event.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedProducts(selectedValues);
  };

  const handleFetchClick = () => {
    const monthRegex = /^(0[1-9]|1[0-2])-(\d{4})$/;

    if (monthRegex.test(tempMonth)) {
      setSelectedMonth(tempMonth);
    } else {
      setError("Formato de mes y año inválido. Use MM-YYYY.");
    }
  };

  const filteredVentasProducto =
    selectedProducts.length > 0
      ? ventasProducto.filter((venta) =>
        selectedProducts.includes(venta.nombre_producto)
      )
      : ventasProducto;

  if (loading) {
    return <div>Cargando...</div>;
  }



  return (

    <div className="flex justify-between flex-row flex-wrap">
      <div className="basis-1/4">
        <h1 className="text-center text-2xl font-bold mb-4">
          Ventas Totales Acumuladas por Producto
        </h1>

        <label htmlFor="productFilter" className="mr-2">
          Seleccionar Productos:
        </label>
        <select
          id="productFilter"
          multiple
          value={selectedProducts}
          onChange={handleProductChange}
          className="h-36 p-2 border border-gray-300 rounded"
        >
          {ventasProducto.map((venta) => (
            <option
              className="text-black"
              key={venta.cod_producto}
              value={venta.nombre_producto}
            >
              {venta.nombre_producto}
            </option>
          ))}
        </select>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={filteredVentasProducto}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="nombre_producto"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12, fill: "#8884d8" }}
            />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="total_ventas" fill="#8884d8" barSize={30}>
              {filteredVentasProducto.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="basis-1/4">
        <h1 className="text-center text-2xl font-bold mb-4">
          Buscar ventas por periodo
        </h1>
        <label htmlFor="fechaInicio" className="mr-2">
          Fecha Inicio (DD-MM-YYYY):
        </label>
        <input
          id="fechaInicio"
          type="text"
          value={fechaInicio}
          onChange={(e) => handleFechaChange(e, setFechaInicio)}
          placeholder="DD-MM-YYYY"
          className="p-2 border border-gray-300 rounded mr-2 text-black"
        />
        <label htmlFor="fechaFin" className="mr-2">
          Fecha Fin (DD-MM-YYYY):
        </label>
        <input
          id="fechaFin"
          type="text"
          value={fechaFin}
          onChange={(e) => handleFechaChange(e, setFechaFin)}
          placeholder="DD-MM-YYYY"
          className="p-2 border border-gray-300 rounded mr-2 text-black"
        />
        <button
          onClick={handleFetchVentas}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Buscar Ventas
        </button>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={ventasPorFechaData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="nombre_producto"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12, fill: "#8884d8" }}
            />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="total_ventas" fill="#8884d8" barSize={30}>
              {ventasPorFechaData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div>Aqui viene la Info para el Formulario 29</div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tipo Documento
              </th>
              <th scope="col" className="px-6 py-3">
                Cantidad de Documentos
              </th>
              <th scope="col" className="px-6 py-3">
                IVA Acumulado
              </th>
              <th scope="col" className="px-6 py-3">
                Total Neto
              </th>
              <th scope="col" className="px-6 py-3">
                Total Boleta
              </th>
            </tr>
          </thead>
          <tbody>
            {documentosData.map((info) => (
              <tr
                key={info.tipo_documento}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4">{info.tipo_documento}</td>
                <td className="px-6 py-4">{info.cantidad_documentos}</td>
                <td className="px-6 py-4">{info.total_iva}</td>
                <td className="px-6 py-4">{info.total_neto}</td>
                <td className="px-6 py-4">{info.total_con_iva}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="basis-1/4">
        <h1 className="text-center text-2xl font-bold mb-4">
          Ventas Mensuales
        </h1>
        <div className="mb-4">
          <label htmlFor="monthInput" className="mr-2">
            Selecciona Mes y Año (MM-YYYY):
          </label>
          <input
            id="monthInput"
            type="text"
            value={tempMonth}
            onChange={handleMonthChange}
            placeholder="MM-YYYY"
            className="p-2 border border-gray-300 rounded mr-2 text-black"
            pattern="\d{2}-\d{4}"
            title="Formato requerido: MM-YYYY"
          />
          <button
            onClick={handleFetchClick}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Buscar
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={ventasMensuales}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="nombre_producto"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12, fill: "#8884d8" }}
            />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="total_ventas" fill="#8884d8" barSize={30}>
              {ventasMensuales.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ToastContainer />
    </div>
  );
}

export default VentasProductos;
