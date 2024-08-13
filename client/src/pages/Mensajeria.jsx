import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { sendBulkEmail } from "../api/cerveceria_API";

function Mensajeria() {
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Llama a sendBulkEmail pasando asunto y mensaje como argumentos separados
      const response = await sendBulkEmail(asunto, mensaje);
      setAsunto("");
      setMensaje("");
      console.log("Correo enviado exitosamente");
      toast.success("Correo masivo enviado correctamente");
    } catch (error) {
      console.error("Error al intentar enviar correo:", error);
      toast.error("Error al enviar correo masivo");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-6 py-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Mensajería
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="asunto"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Asunto:
            </label>
            <input
              type="text"
              id="asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="Ingresa el asunto"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="mensaje"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Mensaje:
            </label>
            <textarea
              id="mensaje"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Ingresa el mensaje"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Enviar
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Mensajeria;
