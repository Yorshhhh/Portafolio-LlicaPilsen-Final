import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { loginUsuario } from "../api/cerveceria_API";
import { useAuth } from "../context/AuthContext";

function LoginForm() {
  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (correo.trim() === "") {
      setShowAlert(true);
      return;
    }
    if (password.trim() === "") {
      setShowPasswordAlert(true);
      return;
    }
    const userLogin = {
      correo,
      password,
    };
    try {
      const response = await loginUsuario(userLogin);
      if (response.status === 200) {
        console.log("Usuario autenticado correctamente!");
        const userData = response.data.user;
        const token = response.data.token;

        // Usa el método login del AuthContext
        login(userData); // Esto actualiza el estado en AuthContext

        localStorage.setItem("token", token); // Guardar token en localStorage si es necesario
        console.log(token);

        // Redirigir después de actualizar el estado de autenticación
        navigate("/perfil");
      } else {
        console.error("Error al intentar logear");
      }
    } catch (err) {
      console.error("Error al hacer login: ", err);
    }
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
<<<<<<< HEAD
      color: "black", // Cambiado a color negro
=======
      color: "black",
>>>>>>> ramayorsh
    },
    formGroup: {
      marginBottom: "15px",
      color: "black",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
<<<<<<< HEAD
      color: "#000",
=======
      color: "black",
>>>>>>> ramayorsh
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
<<<<<<< HEAD
      color: "black", // Cambiado a color negro
=======
      color: "black",
>>>>>>> ramayorsh
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
    alert: {
      marginTop: "10px",
      background: "#f8d7da",
      color: "#721c24",
      padding: "8px",
      borderRadius: "4px",
    },
    navLink: {
      textAlign: "center",
      marginTop: "20px",
      color: "black",
    },
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1>Iniciar Sesión</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="correo">
                Correo
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="Usuario"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              {showAlert && (
                <div style={styles.alert}>
                  Por favor, ingresa un nombre de usuario.
                </div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="password">
                Contraseña
              </label>
              <input
                style={styles.input}
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPasswordAlert && (
                <div style={styles.alert}>
                  Por favor, ingresa una contraseña.
                </div>
              )}
            </div>
            <button type="submit" style={styles.button}>
              Entrar
            </button>
          </form>
<<<<<<< HEAD
          <div style={{ textAlign: "center", marginTop: "20px", color:"#000"}}>
            <NavLink to="/register">Registrate</NavLink>
          </div>
          <div style={{ textAlign: "center", marginTop: "20px", color:"#000" }}>
=======
          <div style={styles.navLink}>
            <NavLink to="/register">Registrate</NavLink>
          </div>
          <div style={styles.navLink}>
>>>>>>> ramayorsh
            <NavLink to="/home">Volver al Inicio</NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
