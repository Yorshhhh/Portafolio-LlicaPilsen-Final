import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LoginForm from "../components/LoginForm";
import CarritoPrepago from "../components/CarritoPrepago";
import { useCart } from "../context/CarritoContext";
import { createTransaction } from "../api/cerveceria_API";

import "../css/Prepago.css";

function Prepago() {
  const [selectedOption, setSelectedOption] = useState("");
  const [user, setUser] = useState(null);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const [total, setTotal] = useState(0);
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");

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
      setSelectedOption("Retiro en tienda");
      setShowProceedButton(true);
    } else if (event.target.id === "despacho") {
      setDeliveryCost(1000);
      setSelectedOption("Despacho a domicilio");
      setShowProceedButton(false);
    }
  };

  const handlePayment = async () => {
    try {
      const { token, url } = await createTransaction(total);
      setToken(token);
      setUrl(url);
      if (url) {
        window.location.href = url; // Redirige al usuario a la URL de pago de Transbank
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const clearCartHandler = () => {
    clearCart(setCartItems, setShowCart);
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
              <h2>
                A continuacion selecciona el tipo de entrega para tu pedido
              </h2>
              <div className="form-check radio-despacho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="retiro"
                  onChange={handleDeliveryChange}
                  checked={selectedOption === "Retiro en tienda"}
                />
                <label className="form-check-label" htmlFor="retiro">
                  Retiro en tienda
                </label>
              </div>
              {/*               <div className="form-check radio-despacho">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="despacho"
                  onChange={handleDeliveryChange}
                  checked={selectedOption === "Despacho a domicilio"}
                />
                <label className="form-check-label" htmlFor="despacho">
                  Despacho a domicilio
                </label>
              </div> */}
            </div>
            <div className="card centered-content">
              <h1>Resumen de compra</h1>
              <CarritoPrepago />
              <h3>Tipo de entrega: {selectedOption}</h3>
              <h2>Total: ${calculateTotal(cartItems)}</h2>
              <hr />
              <h2>Compra 100% Segura</h2>
              <h2>
                Envíos a toda la región por ventas superiores a los 20.000 pesos
              </h2>
              <hr />
              <h2>Aceptamos los siguientes medios de pago</h2>
              <img
                src="logos_medios_de_pago.png"
                alt="Medios de pago"
                style={{ width: "70%", height: "auto" }}
              />
              <hr />
              {selectedOption === "Retiro en tienda" && showProceedButton && (
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
