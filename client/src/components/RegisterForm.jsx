import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { registrarUsuario } from "../api/cerveceria_API";

function RegisterForm() {
  const [nombres, setNombre] = useState("");
  const [apellidos, setApellido] = useState("");
  const [telefono, setTelefono] = useState(0);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorApellido, setErrorApellido] = useState(false);
  const [errorTelefono, setErrorTelefono] = useState(false);
  const [correoError, setCorreoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();

  /*   const [confirmPassword, setConfirmPassword] = useState("") */

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos antes de enviar los datos
    if (nombres.trim() === "") {
      setErrorNombre(true);
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(nombres)) {
      setErrorNombre(true);
      return;
    }

    if (apellidos.trim() === "") {
      setErrorApellido(true);
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(apellidos)) {
      setErrorApellido(true);
      return;
    }

    if (telefono.trim() === "") {
      setErrorTelefono(true);
      return;
    }
    if (!/^\d{9}$/.test(telefono)) {
      setErrorTelefono(true);
      return;
    }

    // Validar correo electrónico
    if (!correo.trim()) {
      setCorreoError("El correo electrónico es requerido.");
      return;
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(correo)) {
      setCorreoError("El correo electrónico no es válido.");
      return;
    }

    // Validar contraseña
    if (!password.trim()) {
      setPasswordError("La contraseña es requerida.");
      return;
    } else if (password.trim().length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      return;
    }

    // Aquí puedes realizar la lógica para enviar los datos del formulario al servidor
    const newUser = {
      nombres,
      apellidos,
      telefono,
      correo,
      password,
    };
    try {
      const response = await registrarUsuario(newUser);
      if (response.status === 201) {
        console.log("Usuario creado con exito!");
        console.log(response.data);
        localStorage.setItem("usuario", JSON.stringify(response.data));
        navigate("/perfil");
      } else {
        console.error("Error al registrar al usuario");
      }
    } catch (error) {
      console.error("Error registrando usuario:", error.response?.data);
    }
    console.log(newUser);
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f5f5f5",
    },
    card: {
      background: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      maxWidth: "400px",
      width: "100%",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px 15px",
      border: "none",
      borderRadius: "4px",
      background: "#f39c12", // Cambiado a naranja
      color: "white",
      cursor: "pointer",
      textAlign: "center",
      width: "100%",
      marginTop: "10px",
      transition: "background-color 0.3s, color 0.3s", // Añadida transición
    },
    link: {
      display: "block",
      textAlign: "center",
      marginTop: "10px",
      color: "#007bff",
      textDecoration: "none",
    },
    // Estilos para los mensajes de error
    errorMessage: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: "5px",
    },
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1>Regístrate</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="nombre">
                Nombre
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="Ingresa tus nombres"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setNombre(inputValue);
                  setErrorNombre(false); // Resetear error al escribir en el campo
                }}
                value={nombres}
              />
              {errorNombre && (
                <div style={styles.errorMessage}>
                  Por favor, ingresa un nombre válido.
                </div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="apellido">
                Apellido
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="Ingresa tus apellidos"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setApellido(inputValue);
                  setErrorApellido(false); // Resetear error al escribir en el campo
                }}
                value={apellidos}
              />
              {errorApellido && (
                <div style={styles.errorMessage}>
                  Por favor, ingresa un apellido válido.
                </div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="telefono">
                Teléfono
              </label>
              <input
                style={styles.input}
                type="tel"
                placeholder="Ingresa un numero de telefono"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setTelefono(inputValue);
                  setErrorTelefono(false); // Resetear error al escribir en el campo
                }}
                value={telefono}
                required
              />
              {errorTelefono && (
                <div style={styles.errorMessage}>
                  Por favor, ingresa un número de teléfono válido.
                </div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="correo">
                Correo
              </label>
              <input
                style={styles.input}
                type="email"
                placeholder="Ingresa un correo"
                onChange={(e) => setCorreo(e.target.value)}
                value={correo}
              />
              {correoError && <div className="text-danger">{correoError}</div>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="password">
                Contraseña
              </label>
              <input
                style={styles.input}
                type="password"
                placeholder="Ingresa tu contraseña"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {passwordError && (
                <div className="text-danger">{passwordError}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="password">
                Repetir Contraseña
              </label>
              <input
                style={styles.input}
                type="password"
                placeholder="Repite la contraseña"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
              {confirmPasswordError && (
                <div className="text-danger">{confirmPasswordError}</div>
              )}
            </div>
            <button type="submit" style={styles.button}>
              Registrarse
            </button>
          </form>
          <NavLink to="/login" style={styles.link}>
            Iniciar Sesion
          </NavLink>
          <NavLink to="/" style={styles.link}>
            Volver al Inicio
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default RegisterForm;
