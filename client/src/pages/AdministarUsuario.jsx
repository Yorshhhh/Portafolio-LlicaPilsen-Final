import React from "react";
import RegisterAdmin from "../components/RegisterAdmin";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    <div style={styles.container}>
      <Navbar />
      <div className="registercontainer">
        <RegisterAdmin />
      </div>
      <Footer />
    </div>
  );
}

export default verpedidos;
  