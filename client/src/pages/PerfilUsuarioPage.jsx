import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

import "../css/PerfilUsuario.css";
import UserCard from "../components/UserCard";
import VentasProductos from "../components/VentasProductos";

function PerfilUsuarioPage() {
  const [user, setUser] = useState(null);
  const [showVentasProducto, setShowVentasProducto] = useState(false);
  const [showVentasComuna, setShowVentasComuna] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("usuario");
    try {
      setUser(JSON.parse(userJson));
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  const toggleVentasProducto = () => {
    setShowVentasProducto(!showVentasProducto);
  };

  const toggleVentasComuna = () => {
    setShowVentasComuna(!showVentasComuna);
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="center-container">
          <h2>No se pudo cargar la información del usuario.</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-row items-center justify-center">
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              showVentasProducto
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={toggleVentasProducto}
          >
            {showVentasProducto
              ? "Ocultar Ventas por Producto"
              : "Ver Ventas por Producto"}
          </button>
        </div>
        {showVentasProducto && <VentasProductos />}

        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              showVentasComuna
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={toggleVentasComuna}
          >
            {showVentasComuna
              ? "Ocultar Ventas por Comuna"
              : "Ver Ventas por Comuna"}
          </button>
        </div>
        {showVentasComuna && <div>Se viene esta implementacion</div>}
      </div>

      <div className="m-auto h-screen w-full flex justify-center items-center">
        <UserCard user={user} />
      </div>
    </>
  );
}

export default PerfilUsuarioPage;
