import React, { useState } from "react";
import PedidosEntregados from "../components/PedidosEntregados";
import PedidosPendientes from "../components/PedidosPendientes";
<<<<<<< HEAD
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
=======
import BuscarPedidos from "../components/BuscarPedidos";
>>>>>>> ramayorsh

function VerPedidos() {
  const [activeButton, setActiveButton] = useState(null);

  const toggleEntregados = () => {
    if (activeButton === "entregados") {
      setActiveButton(null);
    } else {
      setActiveButton("entregados");
    }
  };

  const togglePendientes = () => {
    if (activeButton === "pendientes") {
      setActiveButton(null);
    } else {
      setActiveButton("pendientes");
    }
  };

  const toggleBuscarPedidos = () => {
    if (activeButton === "buscar") {
      setActiveButton(null);
    } else {
      setActiveButton("buscar");
    }
  };

  return (
    <>
<<<<<<< HEAD
      <style>
        {`
          .ver-pedidos-container {
            background-color: white; /* Fondo blanco */
            padding-top: 20px; /* Añadir un espacio de padding arriba */
          }
          .botones-pedidos {
            margin-top: 20px; /* Añadir un margen arriba a los botones */
          }
        `}
      </style>

      <Navbar />

      <div className="ver-pedidos-container user-profile-staff-actions flex flex-col items-center justify-center">
        <div className="botones-pedidos flex justify-center gap-4 mb-8">
=======
      <div className="user-profile-staff-actions flex flex-col items-center justify-center">
        <div className="flex justify-center gap-4 mb-8">
>>>>>>> ramayorsh
          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              activeButton === "entregados"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={toggleEntregados}
          >
<<<<<<< HEAD
            {showEntregados ? "Ocultar Pedidos Entregados" : "Mostrar Pedidos Entregados"}
=======
            {activeButton === "entregados"
              ? "Ocultar Pedidos Despachados"
              : "Mostrar Pedidos Despachados"}
>>>>>>> ramayorsh
          </button>

          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              activeButton === "pendientes"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={togglePendientes}
          >
            {activeButton === "pendientes"
              ? "Ocultar Pedidos Pendientes"
              : "Mostrar Pedidos Pendientes"}
          </button>

          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              activeButton === "buscar"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={toggleBuscarPedidos}
          >
            {activeButton === "buscar"
              ? "Ocultar Buscar Pedidos"
              : "Mostrar Buscar Pedidos"}
          </button>
        </div>

        {activeButton === "entregados" && (
          <div className="w-full flex justify-center items-center">
            <PedidosEntregados />
          </div>
        )}

        {activeButton === "pendientes" && (
          <div className="w-full flex justify-center items-center">
            <PedidosPendientes />
          </div>
        )}

        {activeButton === "buscar" && (
          <div className="w-full flex justify-center items-center">
            <BuscarPedidos />
          </div>
        )}
      </div>
    </>
  );
}

export default VerPedidos;
