import React from "react";

function Bienvenida() {
  return (
    <>
      <section className="flex hero bg-cover h-[calc(100vh-30rem)] items-center justify-center" id="inicio">
        <h1 className="text-white text-6xl font-bold" style={{ textShadow: '2px 2px 0 #000, -2px -2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000' }}
        >Bienvenidos a LlicaPilsen</h1>
      </section>
    </>
  );
}

export default Bienvenida;
