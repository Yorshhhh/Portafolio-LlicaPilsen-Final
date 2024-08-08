import React, { useState, useEffect } from "react";
import {
  obtenerVentasPorComuna,
  obtenerVentasPorDocumento,
  obtenerVentasPorEntrega,
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

const formatCurrency = (value) => {
  return `$${Number(value).toLocaleString("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

function VentasExtra() {
  const [ventasComuna, setVentasComuna] = useState([]);
  const [ventasDocumento, setVentasDocumento] = useState([]);
  const [ventasEntrega, setVentasEntrega] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*   useEffect(() => {
    if (selectedMonth) {
      fetchVentasMensuales(selectedMonth);
    }
  }, [selectedMonth]); */

  useEffect(() => {
    const fetchVentasPorComuna = async () => {
      try {
        const data = await obtenerVentasPorComuna();
        console.log(data);
        setVentasComuna(data);
      } catch (error) {
        console.error("Error al obtener las ventas por comuna: ", error);
        setError("Error al cargar las ventas por comuna.");
      }
    };

    const fetchVentasPorDocumento = async () => {
      try {
        const data = await obtenerVentasPorDocumento();
        console.log(data);
        setVentasDocumento(data);
      } catch (error) {
        console.error("Error al obtener las ventas por documento: ", error);
        setError("Error al cargar las ventas por documento.");
      }
    };

    const fetchVentasPorEntrega = async () => {
      try {
        const data = await obtenerVentasPorEntrega();
        console.log(data);
        setVentasEntrega(data);
      } catch (error) {
        console.error("Error al obtener las ventas por Entrega: ", error);
        setError("Error al cargar las ventas por Entrega.");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchVentasPorComuna(),
        fetchVentasPorDocumento(),
        fetchVentasPorEntrega(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex justify-between flex-row flex-wrap">
      <div className="basis-1/4">
        <h1 className="text-center text-2xl font-bold mb-4">
          Ventas Totales Acumuladas por Comuna
        </h1>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={ventasComuna}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="comuna_envio"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12, fill: "#8884d8" }}
            />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="total_ventas" fill="#8884d8" barSize={30}>
              {ventasComuna.map((entry, cod_comuna) => (
                <Cell
                  key={`cell-${cod_comuna}`}
                  fill={COLORS[cod_comuna % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="basis-1/4">
        <h1 className="text-center text-2xl font-bold mb-4">
          Ventas Totales Acumuladas por Tipo de Documento
        </h1>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={ventasDocumento}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="tipo_documento"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12, fill: "#8884d8" }}
            />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="total_ventas" fill="#8884d8" barSize={30}>
              {ventasDocumento.map((entry, index) => (
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
          Ventas Totales Acumuladas por Tipo de Entrega
        </h1>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={ventasEntrega}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="tipo_entrega"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12, fill: "#8884d8" }}
            />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="total_ventas" fill="#8884d8" barSize={30}>
              {ventasDocumento.map((entry, index) => (
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

export default VentasExtra;
