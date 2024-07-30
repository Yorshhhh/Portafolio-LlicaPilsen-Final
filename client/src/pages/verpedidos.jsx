import React, { useState } from "react";
import PedidosEntregados from "../components/PedidosEntregados";
import PedidosPendientes from "../components/PedidosPendientes";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BuscarPedidos from "../components/BuscarPedidos";

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
      <Navbar />

      <div className="user-profile-staff-actions flex flex-col items-center justify-center">
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              activeButton === "entregados"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={toggleEntregados}
          >
            {activeButton === "entregados"
              ? "Ocultar Pedidos Entregados"
              : "Mostrar Pedidos Entregados"}
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

      <Footer />
    </>
  );
}

export default VerPedidos;
