import React, { useEffect, useState } from "react";
import {
  obtenerVentasPorProducto,
  ventasMensualesProducto,
  obtenerVentasPorComuna,
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
} from "recharts";/* 
import "../css/GananciasAdmin.css"; */

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

function GananciasAdmin() {
  const [ventasProducto, setVentasProducto] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [ventasComuna, setVentasComuna] = useState([]);
  const [ventasComunaMensuales, setVentasComunaMensuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // Estado para el mes seleccionado
  const [tempMonth, setTempMonth] = useState(""); // Estado temporal para el input de fecha
  const [selectedProducts, setSelectedProducts] = useState([]); // Estado para el producto seleccionado
  const [selectedCommunes, setSelectedCommunes] = useState([]); // Estado para la comuna seleccionada

  useEffect(() => {
    // Inicialmente, carga las ventas para el mes actual
    const currentMonth = new Date().toISOString().slice(5, 7);
    const currentYear = new Date().getFullYear();
    const initialMonth = `${currentMonth}-${currentYear}`;
    setTempMonth(initialMonth);
    setSelectedMonth(initialMonth);
    fetchVentasMensuales(initialMonth);
    fetchVentasPorProducto();
    fetchVentasPorComuna();
    fetchVentasMensualesComuna(initialMonth);
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchVentasMensuales(selectedMonth);
      fetchVentasMensualesComuna(selectedMonth);
    }
  }, [selectedMonth]);

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

  // Función para obtener ventas mensuales por comuna
  const fetchVentasMensualesComuna = async (mes) => {
    try {
      setLoading(true);
      setError(null); // Limpia cualquier error anterior
      const data = await obtenerVentasPorComuna(mes);
      setVentasComunaMensuales(data);
    } catch (error) {
      console.error(
        "Error al obtener las ventas mensuales por comuna: ",
        error
      );
      setError("Error al cargar las ventas mensuales por comuna.");
    } finally {
      setLoading(false);
    }
  };

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

  // Función para obtener ventas por comuna (histórico)
  const fetchVentasPorComuna = async () => {
    try {
      setLoading(true);
      setError(null); // Limpia cualquier error anterior
      const data = await obtenerVentasPorComuna();
      setVentasComuna(data);
    } catch (error) {
      console.error("Error al obtener las ventas por comuna: ", error);
      setError("Error al cargar las ventas por comuna.");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    setTempMonth(newMonth); // Actualiza el estado temporal del input de fecha
  };

  const handleFetchClick = () => {
    const monthRegex = /^(0[1-9]|1[0-2])-(\d{4})$/;

    if (monthRegex.test(tempMonth)) {
      setSelectedMonth(tempMonth);
    } else {
      setError("Formato de mes y año inválido. Use MM-YYYY.");
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Función para renderizar la etiqueta personalizada con el porcentaje
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    );
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

  const handleCommuneChange = (event) => {
    const options = event.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedCommunes(selectedValues);
  };

  const filteredVentasProducto =
    selectedProducts.length > 0
      ? ventasProducto.filter((venta) =>
          selectedProducts.includes(venta.nombre_producto)
        )
      : ventasProducto;

  const filteredVentasComuna =
    selectedCommunes.length > 0
      ? ventasComuna.filter((venta) =>
          selectedCommunes.includes(venta.comuna_envio)
        )
      : ventasComuna;

  const filteredVentasComunaMensuales =
    selectedCommunes.length > 0
      ? ventasComunaMensuales.filter((venta) =>
          selectedCommunes.includes(venta.comuna_envio)
        )
      : ventasComunaMensuales;

  return (
    <div className="ventasProducto-admin">
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

      <h1>Ventas Mensuales por Producto</h1>
      {/* Filtro de mes */}
      <div className="chart-container">
        <div className="month-filter">
          <label htmlFor="monthInput">Selecciona Mes y Año (MM-YYYY):</label>
          <input
            id="monthInput"
            type="text"
            value={tempMonth}
            onChange={handleMonthChange}
            placeholder="MM-YYYY"
            pattern="\d{2}-\d{4}"
            title="Formato requerido: MM-YYYY"
          />
          <button onClick={handleFetchClick}>Buscar</button>
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
            <Bar dataKey="total" fill="#8884d8" barSize={30}>
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

      <h1>Ventas por Comuna</h1>
      {/* Filtro de comunas */}
      <div className="detalle-ventasComuna">
        <div className="flex justify-end filter-container">
          <label htmlFor="communeFilter">Selecciona Comunas:</label>
          <select
            id="communeFilter"
            multiple
            value={selectedCommunes}
            onChange={handleCommuneChange}
            style={{ height: "150px" }} // Para ver múltiples opciones a la vez
          >
            {ventasComuna.map((venta) => (
              <option key={venta.comuna_envio} value={venta.comuna_envio}>
                {venta.comuna_envio}
              </option>
            ))}
          </select>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={filteredVentasComuna}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="comuna_envio"
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 12, fill: "#8884d8" }}
              />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" barSize={30}>
                {filteredVentasComuna.map((entry, index) => (
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

      <h1>Ventas Mensuales por Comuna</h1>
      {/* Visualización de ventas mensuales por comuna */}
      <div className="chart-container">
        <div className="month-filter">
          <label htmlFor="monthInput">Selecciona Mes y Año (MM-YYYY):</label>
          <input
            id="monthInput"
            type="text"
            value={tempMonth}
            onChange={handleMonthChange}
            placeholder="MM-YYYY"
            pattern="\d{2}-\d{4}"
            title="Formato requerido: MM-YYYY"
          />
          <button onClick={handleFetchClick}>Buscar</button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={filteredVentasComunaMensuales}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="comuna_envio"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12, fill: "#8884d8" }}
            />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" barSize={30}>
              {filteredVentasComunaMensuales.map((entry, index) => (
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
  );
}

export default GananciasAdmin;
