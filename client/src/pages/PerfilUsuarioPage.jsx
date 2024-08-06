import React, { useState, useEffect } from "react";
import "../css/PerfilUsuario.css";
import UserCard from "../components/UserCard";
import VentasProductos from "../components/VentasProductos";
import EmpresaForm from "../components/EmpresaForm";

function PerfilUsuarioPage() {
  const [user, setUser] = useState(null);
  const [showVentasProducto, setShowVentasProducto] = useState(false);
  const [showVentasComuna, setShowVentasComuna] = useState(false);
  const [showEmpresaForm, setShowEmpresaForm] = useState(false);
  const [empresaData, setEmpresaData] = useState({
    razonSocial: "",
    rutEmpresa: "",
    giroComercial: "",
    direccionEmpresa: "",
    numeroEmpresa: "",
    ciudadEmpresa: "",
    comunaEmpresa: "",
  });

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

  const toggleEmpresaForm = () => {
    setShowEmpresaForm(!showEmpresaForm);
  };

  if (!user) {
    return (
      <>
        <div className="center-container">
          <h2>No se pudo cargar la información del usuario.</h2>
        </div>
      </>
    );
  }

  return (
    <>
      {user.is_staff ? (
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
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="mb-4">
              <UserCard user={user} />
            </div>
            <div className="flex justify-center gap-4 mb-8">
              <button
                className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
                  showEmpresaForm
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={toggleEmpresaForm}
              >
                {showEmpresaForm
                  ? "Ocultar Agregar Empresa"
                  : "Agregar Empresa"}
              </button>
            </div>
            {showEmpresaForm && (
              <EmpresaForm onChange={setEmpresaData} usuario_id={user.id} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PerfilUsuarioPage;
