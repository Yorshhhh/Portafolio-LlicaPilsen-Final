import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModificarCardProduct from "./ModificarCardProduct";

export default function ListarProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/productos/");
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    fetchProductos();
  }, []);

  return (
    <div className="my-[2rem]  flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-screen-xl p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Lista de Productos
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((producto, index) => (
            <div
              key={producto.cod_producto}
              className="rounded-md shadow-md hover:shadow-xl bg-white"
            >
              <ModificarCardProduct producto={producto} />
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
