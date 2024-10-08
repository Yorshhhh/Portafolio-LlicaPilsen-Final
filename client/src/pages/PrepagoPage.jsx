import React, { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import CarritoPrepago from "../components/CarritoPrepago";
import { ToastContainer, toast } from "react-toastify";
import { useCart } from "../context/CarritoContext";
import { createTransaction, obtenerComunas } from "../api/cerveceria_API";
import "../css/Prepago.css";
import medioPagoImage from "../img/mediopago.png";

function Prepago() {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedComuna, setSelectedComuna] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [comunas, setComunas] = useState([]);
  const [user, setUser] = useState(null);
  const [totalNeto, setTotalNeto] = useState(0);
  const [totalIva, setTotalIva] = useState(0);
  const [totalConIva, setTotalConIva] = useState(0);
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [rutEmpresa, setRutEmpresa] = useState("");
  const [giroComercial, setGiroComercial] = useState("");
  const [direccionEmpresa, setDireccionEmpresa] = useState("");
  const [numeroEmpresa, setNumeroEmpresa] = useState("");
  const [ciudadEmpresa, setCiudadEmpresa] = useState("");
  const [comunaEmpresa, setComunaEmpresa] = useState("");
  const [isDeliveryFormValid, setIsDeliveryFormValid] = useState(false);
  const [isFacturaFormValid, setIsFacturaFormValid] = useState(false);
  const [empresa, setEmpresa] = useState(null);

  const IVA_PORCENTAJE = 19;

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
    const totalNeto = calculateTotal(); // Llamar a calculateTotal para obtener el total sin IVA
    const iva = totalNeto * (IVA_PORCENTAJE / 100);
    const totalConIva = totalNeto + iva + deliveryCost;

    setTotalNeto(totalNeto); // Guardar el total sin IVA
    setTotalIva(iva); // Guardar el IVA calculado
    setTotalConIva(totalConIva); // Guardar el total con IVA
  }, [cartItems, deliveryCost, calculateTotal]);

  useEffect(() => {
    const userJson = localStorage.getItem("usuario");
    if (userJson) {
      try {
        const userParsed = JSON.parse(userJson);
        const { direccion, telefono, empresa } = userParsed;
        setUser(userParsed);
        setDireccion(userParsed.direccion || "");
        setTelefono(userParsed.telefono || "");

        if (empresa) {
          setEmpresa(empresa); // Almacena el objeto empresa en el estado
          setRazonSocial(empresa.razon_social || "");
          setRutEmpresa(empresa.rut_empresa || "");
          setGiroComercial(empresa.giro_comercial || "");
          setDireccionEmpresa(empresa.direccion_empresa || "");
          setNumeroEmpresa(empresa.numero_empresa || "");
          setCiudadEmpresa(empresa.ciudad_empresa || "");
          setComunaEmpresa(empresa.comuna_empresa || "");
          validateFacturaForm(
            empresa.razon_social,
            empresa.rut_empresa,
            empresa.giro_comercial,
            empresa.direccion_empresa,
            empresa.numero_empresa,
            empresa.ciudad_empresa,
            empresa.comuna_empresa
          );
        }

        validateDeliveryForm(
          selectedComuna,
          userParsed.direccion,
          userParsed.telefono
        );
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage: ", error);
      }
    } else {
      console.warn("No existe un usuario en el localStorage");
    }
  }, [selectedComuna]);

  useEffect(() => {
    async function getComunas() {
      try {
        const res = await obtenerComunas();
        console.log(res);
        setComunas(res);
      } catch (error) {
        console.error("Error al obtener comunas:", error);
      }
    }
    getComunas();
  }, []);

  const handleDeliveryChange = (event) => {
    if (event.target.id === "retiro") {
      setDeliveryCost(0);
      setSelectedOption("retiro");
      console.log(selectedComuna);
    } else if (event.target.id === "despacho") {
      setDeliveryCost(4000);
      console.log(selectedComuna);
      setSelectedOption("domicilio");
    }
  };

  const handleDocumentChange = (event) => {
    setSelectedDocument(event.target.value);
  };

  const handlePayment = async () => {
    const totalRounded = Math.round(totalConIva);
    const ivaRounded = Math.round(totalIva);

    // Establecer cod_comuna basado en el tipo de entrega
    const codComunaFinal = selectedOption === "retiro" ? 3 : selectedComuna;

    // Preparar los detalles del pedido
    const pedidoDetalles = {
      total_neto: totalNeto,
      total: totalRounded,
      iva: ivaRounded,
      tipo_entrega: selectedOption,
      tipo_documento: selectedDocument,
      direccion: selectedOption === "domicilio" ? direccion : null, // Solo incluir si es domicilio
      telefono: selectedOption === "domicilio" ? telefono : null, // Solo incluir si es domicilio
      productos: cartItems,
      costo_envio: deliveryCost,
      cod_comuna: codComunaFinal,
      ...(selectedDocument === "factura" && {
        razon_social: razonSocial,
        rut_empresa: rutEmpresa,
        giro_comercial: giroComercial,
        direccion_empresa: direccionEmpresa,
        numero_empresa: numeroEmpresa,
        ciudad_empresa: ciudadEmpresa,
        comuna_empresa: comunaEmpresa,
      }),
    };

    console.log(pedidoDetalles.cod_comuna); // Esto debería mostrar 3 para retiro
    localStorage.setItem("pedidoDetalles", JSON.stringify(pedidoDetalles));

    try {
      const { token, url } = await createTransaction(totalRounded);
      setToken(token);
      setUrl(url);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Hubo un error al procesar el pago. Intente nuevamente."); // Mensaje al usuario
    }
  };

  const clearCartHandler = () => {
    clearCart(setCartItems, setShowCart);
  };

  const handleComunaChange = (event) => {
    setSelectedComuna(event.target.value);
    validateDeliveryForm(event.target.value, direccion, telefono);
  };

  const handleDireccionChange = (event) => {
    setDireccion(event.target.value);
    validateDeliveryForm(selectedComuna, event.target.value, telefono);
  };

  const handleTelefonoChange = (e) => {
    const newTelefono = e.target.value;
    if (/^\d{0,9}$/.test(newTelefono)) {
      setTelefono(newTelefono);
    } else {
      toast.error("Solo puede ingresar numeros");
    }
    // Verificar que solo contenga números y tenga exactamente 9 dígitos
  };

  const handleRazonSocialChange = (event) => {
    setRazonSocial(event.target.value);
    validateFacturaForm(
      event.target.value,
      rutEmpresa,
      giroComercial,
      direccionEmpresa,
      numeroEmpresa,
      ciudadEmpresa,
      comunaEmpresa
    );
  };

  const handleRutEmpresaChange = (event) => {
    setRutEmpresa(event.target.value);
    validateFacturaForm(
      razonSocial,
      event.target.value,
      giroComercial,
      direccionEmpresa,
      numeroEmpresa,
      ciudadEmpresa,
      comunaEmpresa
    );
  };

  const handleGiroComercialChange = (event) => {
    setGiroComercial(event.target.value);
    validateFacturaForm(
      razonSocial,
      rutEmpresa,
      event.target.value,
      direccionEmpresa,
      numeroEmpresa,
      ciudadEmpresa,
      comunaEmpresa
    );
  };

  const handleDireccionEmpresaChange = (event) => {
    setDireccionEmpresa(event.target.value);
    validateFacturaForm(
      razonSocial,
      rutEmpresa,
      giroComercial,
      event.target.value,
      numeroEmpresa,
      ciudadEmpresa,
      comunaEmpresa
    );
  };

  const handleNumeroEmpresaChange = (event) => {
    setNumeroEmpresa(event.target.value);
    validateFacturaForm(
      razonSocial,
      rutEmpresa,
      giroComercial,
      direccionEmpresa,
      event.target.value,
      ciudadEmpresa,
      comunaEmpresa
    );
  };

  const handleCiudadEmpresaChange = (event) => {
    setCiudadEmpresa(event.target.value);
    validateFacturaForm(
      razonSocial,
      rutEmpresa,
      giroComercial,
      direccionEmpresa,
      numeroEmpresa,
      event.target.value,
      comunaEmpresa
    );
  };

  const handleComunaEmpresaChange = (event) => {
    setComunaEmpresa(event.target.value);
    validateFacturaForm(
      razonSocial,
      rutEmpresa,
      giroComercial,
      direccionEmpresa,
      numeroEmpresa,
      ciudadEmpresa,
      event.target.value
    );
  };

  const validateDeliveryForm = (comuna, direccion, telefono) => {
    if (selectedOption === "domicilio") {
      setIsDeliveryFormValid(!!(comuna && direccion && telefono));
    } else {
      setIsDeliveryFormValid(true);
    }
  };

  const validateFacturaForm = (
    razonSocial,
    rutEmpresa,
    giroComercial,
    direccionEmpresa,
    numeroEmpresa,
    ciudadEmpresa,
    comunaEmpresa
  ) => {
    setIsFacturaFormValid(
      !!(
        razonSocial &&
        rutEmpresa &&
        giroComercial &&
        direccionEmpresa &&
        numeroEmpresa &&
        ciudadEmpresa &&
        comunaEmpresa
      )
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      {user ? (
        <div className="horizontal-container">
          <div className="flex flex-col">
            <div className="card">
              <h2>
                A continuación, selecciona el tipo de entrega para tu pedido
              </h2>
              <hr className="custom-hr" />
              <div className="">
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
            </div>

            {selectedOption && (
              <div className="card">
                <h3>Tipo de Documento</h3>
                <hr className="custom-hr" />
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="documentType"
                    id="boleta"
                    value="boleta"
                    checked={selectedDocument === "boleta"}
                    onChange={handleDocumentChange}
                  />
                  <label className="form-check-label" htmlFor="boleta">
                    Boleta
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="documentType"
                    id="factura"
                    value="factura"
                    checked={selectedDocument === "factura"}
                    onChange={handleDocumentChange}
                  />
                  <label className="form-check-label" htmlFor="factura">
                    Factura
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="basis-1/2">
            {selectedOption === "domicilio" && (
              <div className="card">
                <h2>Formulario de Despacho a Domicilio</h2>
                <hr className="custom-hr" />
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
                      {comunas.map((comuna) => (
                        <option key={comuna.id} value={comuna.id}>
                          {comuna.nombre}
                        </option>
                      ))}
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
                </form>
              </div>
            )}

            {selectedDocument === "boleta" && selectedOption === "retiro"}

            {selectedDocument === "factura" && (
              <div className="card">
                <h2>Información de la Empresa</h2>
                <hr className="custom-hr" />
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="razonSocial">Razón Social:</label>
                    <input
                      type="text"
                      id="razonSocial"
                      className="form-control"
                      value={razonSocial || empresa?.razon_social || ""} // Establecer el valor del campo
                      onChange={handleRazonSocialChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="rutEmpresa">RUT Empresa:</label>
                    <input
                      type="text"
                      id="rutEmpresa"
                      className="form-control"
                      value={rutEmpresa || empresa?.rut_empresa || ""} // Establecer el valor del campo
                      onChange={handleRutEmpresaChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="giroComercial">Giro Comercial:</label>
                    <input
                      type="text"
                      id="giroComercial"
                      className="form-control"
                      value={giroComercial || empresa?.giro_comercial || ""} // Establecer el valor del campo
                      onChange={handleGiroComercialChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="direccionEmpresa">Dirección Empresa:</label>
                    <input
                      type="text"
                      id="direccionEmpresa"
                      className="form-control"
                      value={
                        direccionEmpresa || empresa?.direccion_empresa || ""
                      } // Establecer el valor del campo
                      onChange={handleDireccionEmpresaChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="numeroEmpresa">Número:</label>
                    <input
                      type="text"
                      id="numeroEmpresa"
                      className="form-control"
                      value={numeroEmpresa || empresa?.numero_empresa || ""} // Establecer el valor del campo
                      onChange={handleNumeroEmpresaChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ciudadEmpresa">Ciudad:</label>
                    <input
                      type="text"
                      id="ciudadEmpresa"
                      className="form-control"
                      value={ciudadEmpresa || empresa?.ciudad_empresa || ""} // Establecer el valor del campo
                      onChange={handleCiudadEmpresaChange}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="comunaEmpresa">Comuna:</label>
                    <input
                      type="text"
                      id="comunaEmpresa"
                      className="form-control"
                      value={comunaEmpresa || empresa?.comuna_empresa || ""} // Establecer el valor del campo
                      onChange={handleComunaEmpresaChange}
                      readOnly
                    />
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="card centered-content">
            <h1>Resumen de compra</h1>
            <CarritoPrepago />
            <hr className="custom-hr" />
            <h3>
              Tipo de entrega:{" "}
              {selectedOption === "retiro"
                ? "Retiro en tienda"
                : "Despacho a domicilio"}
            </h3>
            <h3>
              Tipo de documento:{" "}
              {selectedDocument === "boleta" ? "Boleta" : "Factura"}
            </h3>
            <h2>
              Total neto:
              {totalNeto.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </h2>
            <h2>
              Costo Envío:
              {deliveryCost.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </h2>
            <h2>
              IVA:
              {totalIva.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </h2>
            <h2>
              Total Boleta:
              {totalConIva.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </h2>

            <hr className="custom-hr" />
            <h2>Compra 100% Segura</h2>
            <h2>
              Envíos a las comunas de Coronel y San Pedro por compras superiores
              a los 20.000 pesos
            </h2>
            <hr className="custom-hr" />
            <h2>Aceptamos los siguientes medios de pago</h2>
            <img
              src={medioPagoImage}
              alt="Medios de pago"
              style={{ width: "70%", height: "auto" }}
            />
            {(selectedOption === "retiro" &&
              (selectedDocument === "boleta" ||
                selectedDocument === "factura")) ||
            (selectedOption === "domicilio" &&
              (selectedDocument === "boleta" ||
                selectedDocument === "factura")) ? (
              <input
                onClick={handlePayment}
                className="btn btn-success"
                type="submit"
                disabled={
                  (selectedOption === "domicilio" && !isDeliveryFormValid) ||
                  (selectedDocument === "factura" && !isFacturaFormValid)
                }
                value={"Continuar compra"}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <div className="login-container">
          <LoginForm />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
export default Prepago;
