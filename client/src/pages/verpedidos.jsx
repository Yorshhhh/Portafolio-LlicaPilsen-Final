import React, { useState } from "react";
import PedidosEntregados from "../components/PedidosEntregados";
import PedidosPendientes from "../components/PedidosPendientes";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BuscarPedidos from "../components/BuscarPedidos";

function VerPedidos() {
  const [showEntregados, setShowEntregados] = useState(false);
  const [showPendientes, setShowPendientes] = useState(false);
  const [showBuscarPedidos, setShowBuscarPedidos] = useState(false);

  const toggleEntregados = () => {
    setShowEntregados(!showEntregados);
    if (showPendientes) {
      setShowPendientes(false);
    }
  };

  const togglePendientes = () => {
    setShowPendientes(!showPendientes);
    if (showEntregados) {
      setShowEntregados(false);
    }
  };

  const toggleBuscarPedidos = () => {
    setShowBuscarPedidos(!showBuscarPedidos);
    if (showBuscarPedidos) {
      setShowBuscarPedidos(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="user-profile-staff-actions flex flex-col items-center justify-center">
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              showEntregados
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={toggleEntregados}
          >
            {showEntregados
              ? "Ocultar Pedidos Entregados"
              : "Mostrar Pedidos Entregados"}
          </button>

          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              showPendientes
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={togglePendientes}
          >
            {showPendientes
              ? "Ocultar Pedidos Pendientes"
              : "Mostrar Pedidos Pendientes"}
          </button>

          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              showPendientes
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={toggleBuscarPedidos}
          >
            {showBuscarPedidos
              ? "Ocultar Buscar Pedidos"
              : "Mostrar Buscar Pedidos"}
          </button>
        </div>

        {showEntregados && (
          <div className="w-full flex justify-center items-center">
            <PedidosEntregados />
          </div>
        )}

        {showPendientes && (
          <div className="w-full flex justify-center items-center">
            <PedidosPendientes />
          </div>
        )}

        {showBuscarPedidos && (
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
