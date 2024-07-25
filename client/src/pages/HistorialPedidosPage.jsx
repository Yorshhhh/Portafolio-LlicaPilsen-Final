import React from "react";
import HistorialPedidos from "../components/HistorialPedidos";
import Navbar from "../components/Navbar";

function HistorialPedidosPage() {
  return (
    <>
      <Navbar />
      <div className="w-full flex justify-center items-center">
        <HistorialPedidos />
      </div>
    </>
  );
}

export default HistorialPedidosPage;
