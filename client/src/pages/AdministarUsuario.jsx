import React from "react";
import RegisterAdmin from "../components/RegisterAdmin";

const styles = {
  container: {
    backgroundColor: "#ffffff",  // Fondo blanco
    minHeight: "100vh",  // Asegura que el contenedor tenga al menos el alto de la pantalla
    display: "flex",
    flexDirection: "column",
  },
};

function verpedidos() {
  return (
    <>
      <div>
        <RegisterAdmin />
      </div>
    </>
  );
}

export default verpedidos;
  