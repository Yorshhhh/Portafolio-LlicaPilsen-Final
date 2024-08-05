import React, { useState } from "react";
import AgregarProducto from "../components/AgregarProducto";
import Navbar from "../components/Navbar";

const AgregarProductoPage = () => {
  return (
    <>
      <div className="mt-8">
        <AgregarProducto />
      </div>
    </>
  );
};

export default AgregarProductoPage;
