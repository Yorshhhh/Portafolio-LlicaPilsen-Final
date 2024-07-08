import React, { useState } from "react";
import AgregarProducto from "../components/AgregarProducto";
import ListarProductos from "../components/ListarProductos";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdministrarProducto() {
  const [mostrarAgregar, setMostrarAgregar] = useState(true);
  const [mostrarListar, setMostrarListar] = useState(false);

  const toggleAgregar = () => {
    setMostrarAgregar(!mostrarAgregar);
    // Si se muestra Agregar, ocultar Listar
    if (!mostrarAgregar) {
      setMostrarListar(false);
    }
  };

  const toggleListar = () => {
    setMostrarListar(!mostrarListar);
    // Si se muestra Listar, ocultar Agregar
    if (!mostrarListar) {
      setMostrarAgregar(false);
    }
  };

  return (
    <>
      <style>
        {`
          .ver-pedidos-container {
            background-color: white;
            padding-top: 20px;
          }
          .botones-pedidos {
            margin-top: 20px;
          }
        `}
      </style>

      <Navbar />
      <div className="ver-pedidos-container user-profile-staff-actions flex flex-col items-center justify-center">
        <div className="botones-pedidos flex justify-center gap-4 mb-8">
          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              mostrarAgregar
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={toggleAgregar}
          >
            {mostrarAgregar
              ? "Ocultar Agregar Producto"
              : "Mostrar Agregar Producto"}
          </button>

          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              mostrarListar
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={toggleListar}
          >
            {mostrarListar
              ? "Ocultar Listado Productos"
              : "Mostrar Listado Productos"}
          </button>
        </div>

        {mostrarAgregar && (
          <div className="w-full flex justify-center items-center">
            <AgregarProducto />
          </div>
        )}

        {mostrarListar && (
          <div className="w-full flex justify-center items-center">
            <ListarProductos />
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default AdministrarProducto;
