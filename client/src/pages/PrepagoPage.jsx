import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LoginForm from "../components/LoginForm";
import CarritoPrepago from "../components/CarritoPrepago";
import { useCart } from "../context/CarritoContext";
import { createTransaction } from "../api/cerveceria_API";
import "../css/Prepago.css";

function Prepago() {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedComuna, setSelectedComuna] = useState(""); // Estado para la comuna seleccionada
  const [user, setUser] = useState(null);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const [total, setTotal] = useState(0);
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isDeliveryFormValid, setIsDeliveryFormValid] = useState(false);

  const {
    cartItems,
    removeFromCart,
    clearCart,
    toggleCart,
    showCart,
    setShowCart,
    calculateTotal,
    deliveryCost,
    setDeliveryCost,
  } = useCart();

  useEffect(() => {
    if (token && url) {
      const form = document.createElement("form");
      form.action = url;
      form.method = "POST";

      const tokenInput = document.createElement("input");
      tokenInput.type = "hidden";
      tokenInput.name = "token_ws";
      tokenInput.value = token;

      form.appendChild(tokenInput);
      document.body.appendChild(form);
      form.submit();
    }
  }, [token, url]);

  useEffect(() => {
    setTotal(calculateTotal());
  }, [cartItems, deliveryCost, calculateTotal]);

  useEffect(() => {
    const userJson = localStorage.getItem("usuario");
    if (userJson) {
      try {
        const userParsed = JSON.parse(userJson);
        setUser(userParsed);

        // Set default values for address and phone
        setDireccion(userParsed.direccion || "");
        setTelefono(userParsed.telefono || "");
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage: ", error);
      }
    } else {
      console.warn("No existe un usuario en el localStorage");
    }
  }, []);

  const handleDeliveryChange = (event) => {
    if (event.target.id === "retiro") {
      setDeliveryCost(0);
      setSelectedOption("retiro");
      setShowProceedButton(true);
      setShowDeliveryForm(false);
    } else if (event.target.id === "despacho") {
      setDeliveryCost(1000);
      setSelectedOption("domicilio");
      setShowProceedButton(false);
      setShowDeliveryForm(true);
    }
  };

  const handlePayment = async () => {
    try {
      const pedidoDetalles = {
        total,
        tipo_entrega: selectedOption,
        comuna: selectedComuna, // Aquí se envía la comuna seleccionada
        direccion,
        telefono,
        productos: cartItems,
      };

      localStorage.setItem("pedidoDetalles", JSON.stringify(pedidoDetalles));

      const { token, url } = await createTransaction(total);
      setToken(token);
      setUrl(url);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const clearCartHandler = () => {
    clearCart(setCartItems, setShowCart);
  };

  const handleComunaChange = (event) => {
    setSelectedComuna(event.target.value); // Actualiza la comuna seleccionada
    validateDeliveryForm(event.target.value, direccion, telefono);
  };

  const handleDireccionChange = (event) => {
    setDireccion(event.target.value);
    validateDeliveryForm(selectedComuna, event.target.value, telefono);
  };

  const handleTelefonoChange = (event) => {
    setTelefono(event.target.value);
    validateDeliveryForm(selectedComuna, direccion, event.target.value);
  };

  const validateDeliveryForm = (comuna, direccion, telefono) => {
    if (comuna && direccion && telefono) {
      setIsDeliveryFormValid(true);
      setShowProceedButton(true);
    } else {
      setIsDeliveryFormValid(false);
      setShowProceedButton(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Puedes agregar más validaciones aquí si es necesario
  };

  return (
    <>
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        toggleCart={toggleCart}
        showCart={showCart}
        setShowCart={setShowCart}
        clearCartHandler={clearCartHandler}
      />
      <div className="horizontal-container">
        {user ? (
          <>
            <div className="card">
              <h2>A continuación, selecciona el tipo de entrega para tu pedido</h2>
              <div className="form-check radio-despacho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="retiro"
                  onChange={handleDeliveryChange}
                  checked={selectedOption === "retiro"}
                />
                <label className="form-check-label" htmlFor="retiro">
                  Retiro en tienda
                </label>
              </div>
              <div className="form-check radio-despacho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="despacho"
                  onChange={handleDeliveryChange}
                  checked={selectedOption === "domicilio"}
                />
                <label className="form-check-label" htmlFor="despacho">
                  Despacho a domicilio
                </label>
              </div>
              {showDeliveryForm && (
                <div className="delivery-form">
                  <h2>Formulario de Despacho a Domicilio</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="comuna">Comuna:</label>
                      <select
                        id="comuna"
                        className="form-control"
                        value={selectedComuna}
                        onChange={handleComunaChange}
                      >
                        <option value="">Selecciona una comuna</option>
                        <option value="lota">Lota</option>
                        <option value="coronel">Coronel</option>
                        <option value="san_pedro">San Pedro</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="direccion">Dirección: </label>
                      <input
                        type="text"
                        id="direccion"
                        className="form-control"
                        value={direccion}
                        onChange={handleDireccionChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="telefono">Teléfono: </label>
                      <input
                        type="text"
                        id="telefono"
                        className="form-control"
                        value={telefono}
                        onChange={handleTelefonoChange}
                      />
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">
                        Confirmar Envío
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <div className="card centered-content">
              <h1>Resumen de compra</h1>
              <CarritoPrepago />
              <h3>Tipo de entrega: {selectedOption === "retiro" ? "Retiro en tienda" : "Despacho a domicilio"}</h3>
              <h2>Total: ${calculateTotal(cartItems)}</h2>
              <hr />
              <h2>Compra 100% Segura</h2>
              <h2>Envíos a toda la región por ventas superiores a los 20.000 pesos</h2>
              <hr />
              <h2>Aceptamos los siguientes medios de pago</h2>
              <img
                src="logos_medios_de_pago.png"
                alt="Medios de pago"
                style={{ width: "70%", height: "auto" }}
              />
              <hr />
              {(selectedOption === "retiro" || (selectedOption === "domicilio" && isDeliveryFormValid)) && showProceedButton && (
                <input
                  onClick={handlePayment}
                  className="btn btn-success"
                  type="submit"
                  value={"Continuar compra"}
                />
              )}
            </div>
          </>
        ) : (
          <div className="login-container">
            <LoginForm />
          </div>
        )}
      </div>
    </>
  );
}

export default Prepago;
