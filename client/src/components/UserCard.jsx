import React, { useState } from "react";
import { actualizarDireccion } from "../api/cerveceria_API";
import PropTypes from "prop-types";

function UserCard({ user }) {
  UserCard.propTypes = {
    user: PropTypes.object,
  };
  const [editDireccion, setEditDireccion] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para manejar el cambio en el campo de dirección
  const handleDireccionChange = (e) => {
    setDireccion(e.target.value);
  };

  // Función para guardar la dirección editada y enviarla al servidor
  const handleGuardarDireccionClick = async () => {
    if (direccion.trim()) {
      setLoading(true); // Muestra un indicador de carga

      try {
        const updatedUser = await actualizarDireccion(
          user.id,
          direccion.trim()
        );
        // Actualiza la dirección localmente
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            ...user,
            direccion: updatedUser.data.direccion, // Actualiza también en localStorage
          })
        );
        setEditDireccion(false); // Ocultar el input de edición después de guardar
        alert("Dirección actualizada correctamente.");
      } catch (error) {
        console.error("Error al actualizar la dirección:", error);
        alert("Ocurrió un error al actualizar la dirección.");
      } finally {
        setLoading(false); // Oculta el indicador de carga
      }
    } else {
      alert("Por favor, ingresa una dirección válida.");
    }
  };

  // Función para manejar el clic en el botón para editar dirección
  const handleEditarDireccionClick = () => {
    setEditDireccion(true); // Mostrar el input de edición
    setDireccion(user.direccion || ""); // Cargar la dirección actual si existe
  };

  return (
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
    </div>
  );
}

export default UserCard;
