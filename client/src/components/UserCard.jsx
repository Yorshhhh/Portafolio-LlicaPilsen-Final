import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { actualizarDireccion, actualizarTelefono } from "../api/cerveceria_API";
import PropTypes from "prop-types";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserCard({ user, onDireccionChange, onTelefonoChange }) {
  UserCard.propTypes = {
    user: PropTypes.object.isRequired,
    onDireccionChange: PropTypes.func.isRequired,
    onTelefonoChange: PropTypes.func.isRequired, // Agregar PropTypes para el nuevo prop
  };

  const [editDireccion, setEditDireccion] = useState(false);
  const [direccion, setDireccion] = useState(user.direccion || "");
  const [editTelefono, setEditTelefono] = useState(false); // Estado para editar el teléfono
  const [telefono, setTelefono] = useState(user.telefono || ""); // Inicia con el teléfono del usuario

  // Función para manejar el cambio en el campo de dirección
  const handleDireccionChange = (e) => {
    const newDireccion = e.target.value;
    setDireccion(newDireccion);
    onDireccionChange(newDireccion); // Notifica al componente padre del cambio
  };

  // Función para guardar la dirección editada y enviarla al servidor
  const handleGuardarDireccionClick = async () => {
    if (direccion.trim()) {
      try {
        const updatedUser = await actualizarDireccion(
          user.id,
          direccion.trim()
        );
        // Actualiza la dirección en localStorage si es necesario
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            ...user,
            direccion: updatedUser.data.direccion,
          })
        );
<<<<<<< HEAD
        setEditDireccion(false); // Ocultar el input de edición después de guardar
        toast.success("Dirección actualizada correctamente.");
      } catch (error) {
        console.error("Error al actualizar la dirección:", error);
        toast.error("Ocurrió un error al actualizar la dirección.");
      } finally {
        setLoading(false); // Oculta el indicador de carga
=======
        setEditDireccion(false); // Oculta el input de edición
        alert("Dirección actualizada correctamente.");
      } catch (error) {
        console.error("Error al actualizar la dirección:", error);
        alert("Ocurrió un error al actualizar la dirección.");
>>>>>>> ramayorsh
      }
    } else {
      toast.error("Por favor, ingresa una dirección válida.");
    }
  };

  // Función para manejar el clic en el botón para editar dirección
  const handleEditarDireccionClick = () => {
    setEditDireccion(true); // Muestra el input de edición
    setDireccion(user.direccion || ""); // Carga la dirección actual
  };

  // Función para manejar el cambio en el campo de teléfono
  const handleTelefonoChange = (e) => {
    const newTelefono = e.target.value;
    // Verificar que solo contenga números y tenga exactamente 9 dígitos
    if (/^\d{0,9}$/.test(newTelefono)) {
      setTelefono(newTelefono);
      onTelefonoChange(newTelefono); // Notifica al componente padre del cambio
    } else {
      toast.error("Solo puede ingresar numeros");
    }
  };

  // Función para guardar el teléfono editado y enviarlo al servidor
  const handleGuardarTelefonoClick = async () => {
    if (telefono.trim()) {
      try {
        const updatedUser = await actualizarTelefono(user.id, telefono.trim());
        // Actualiza el teléfono en localStorage si es necesario
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            ...user,
            telefono: updatedUser.data.telefono,
          })
        );
        setEditTelefono(false); // Oculta el input de edición
        alert("Teléfono actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar el teléfono:", error);
        alert("Ocurrió un error al actualizar el teléfono.");
      }
    } else {
      alert("Por favor, ingresa un teléfono válido.");
    }
  };

  // Función para manejar el clic en el botón para editar teléfono
  const handleEditarTelefonoClick = () => {
    setEditTelefono(true); // Muestra el input de edición
    setTelefono(user.telefono || ""); // Carga el teléfono actual
  };

  return (
<<<<<<< HEAD
    <div>
      <div className="user-profile-card">
        <h1>Información del usuario</h1>
        <h2>Nombres: {user.nombres}</h2>
        <h2>Apellidos: {user.apellidos}</h2>
        <h2>Correo: {user.correo}</h2>
        <h2>Teléfono: {user.telefono}</h2>
        <h2>Dirección:</h2>
        {editDireccion ? (
          // Mostrar input de edición si se está editando la dirección
          <div className="user-profile-direccion-input-container">
            <input
              type="text"
              placeholder="Ingresa tu dirección"
              value={direccion}
              onChange={handleDireccionChange}
              className="user-profile-direccion-input"
              style={{ color: "black" }} // Establecer el color del texto en negro
            />
            <button
              onClick={handleGuardarDireccionClick}
              className="user-profile-button user-profile-btn-primary"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar dirección"}
            </button>
          </div>
        ) : (
          // Mostrar la dirección y botón de editar si está proporcionada
          <div>
            <h2>{user.direccion || "Dirección no proporcionada"}</h2>
            <button
              onClick={handleEditarDireccionClick}
              className="user-profile-button user-profile-btn-secondary"
            >
              Editar dirección
            </button>
          </div>
        )}
      </div>
=======
    <div className="user-card">
      <h1 className="text-black">Información del usuario</h1>
      <h2 className="text-black">Nombres: {user.nombres}</h2>
      <h2 className="text-black">Apellidos: {user.apellidos}</h2>
      <h2 className="text-black">Correo: {user.correo}</h2>
      <h2 className="text-black">Teléfono:</h2>
      {editTelefono ? (
        <div className="user-profile-telefono-input-container text-black">
          <input
            type="text"
            placeholder="Ingresa tu teléfono"
            value={telefono}
            onChange={handleTelefonoChange}
            className="user-profile-telefono-input w-full h-12 p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleGuardarTelefonoClick}
            className="btn btn-success mt-2"
          >
            Guardar teléfono
          </button>
        </div>
      ) : (
        <div>
          <p className="text-black">
            {user.telefono || "Sin teléfono registrado"}
          </p>
          <button
            onClick={handleEditarTelefonoClick}
            className="btn btn-primary"
          >
            Editar teléfono
          </button>
        </div>
      )}
      <h2>Dirección:</h2>
      {editDireccion ? (
        <div className="user-profile-direccion-input-container">
          <input
            type="text"
            placeholder="Ingresa tu dirección"
            value={direccion}
            onChange={handleDireccionChange}
            className="text-black user-profile-direccion-input w-full h-12 p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleGuardarDireccionClick}
            className="btn btn-success mt-2"
          >
            Guardar dirección
          </button>
        </div>
      ) : (
        <div>
          <p className="text-black">
            {user.direccion || "Sin dirección registrada"}
          </p>
          <button
            onClick={handleEditarDireccionClick}
            className="btn btn-primary"
          >
            Editar dirección
          </button>
        </div>
      )}

>>>>>>> ramayorsh
      <ToastContainer />
    </div>
  );
}

export default UserCard;
