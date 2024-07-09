import React, { useState, useEffect } from "react";
import {
    obtenerVentasPorProducto,
    ventasMensualesProducto
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

// Formato de moneda
const formatCurrency = (value) => {
  return `$${Number(value).toLocaleString("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

function VentasProductos() {
  const [ventasProducto, setVentasProducto] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [tempMonth, setTempMonth] = useState("");

  useEffect(() => {
    // Inicialmente, carga las ventas para el mes actual
    const currentMonth = new Date().toISOString().slice(5, 7);
    const currentYear = new Date().getFullYear();
    const initialMonth = `${currentMonth}-${currentYear}`;
    setTempMonth(initialMonth);
    setSelectedMonth(initialMonth);
    fetchVentasMensuales(initialMonth);
    fetchVentasPorProducto();
  }, []);

  // Función para obtener ventas por producto (histórico)
  const fetchVentasPorProducto = async () => {
    try {
      setLoading(true);
      setError(null); // Limpia cualquier error anterior
      const data = await obtenerVentasPorProducto();
      setVentasProducto(data);
    } catch (error) {
      console.error("Error al obtener las ventas por producto: ", error);
      setError("Error al cargar las ventas por producto.");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener ventas mensuales
  const fetchVentasMensuales = async (mes) => {
    try {
      setLoading(true);
      setError(null); // Limpia cualquier error anterior
      const data = await ventasMensualesProducto(mes);
      setVentasMensuales(data);
    } catch (error) {
      console.error("Error al obtener las ventas mensuales: ", error);
      setError("Error al cargar las ventas mensuales.");
    } finally {
      setLoading(false);
    }
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

  const filteredVentasProducto =
    selectedProducts.length > 0
      ? ventasProducto.filter((venta) =>
          selectedProducts.includes(venta.nombre_producto)
        )
      : ventasProducto;

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Ventas Históricas por Producto</h1>
      {/* Filtro de productos */}
      <div className="detalle-ventasProducto">
        <div className="flex justify-end filter-container">
          <label htmlFor="productFilter">Selecciona Productos:</label>
          <select
            id="productFilter"
            multiple
            value={selectedProducts}
            onChange={handleProductChange}
            style={{ height: "150px" }} // Para ver múltiples opciones a la vez
          >
            {ventasProducto.map((venta) => (
              <option key={venta.cod_producto} value={venta.nombre_producto}>
                {venta.nombre_producto}
              </option>
            ))}
          </select>
        </div>
        <div className="chart-container">
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
              <Bar dataKey="total" fill="#8884d8" barSize={30}>
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
      </div>
    </div>
  );
}

export default VentasProductos;
