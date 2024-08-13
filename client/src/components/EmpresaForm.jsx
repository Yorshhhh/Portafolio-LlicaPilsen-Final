import React, { useState, useEffect } from "react";
import {
  obtenerComunas,
  obtenerCiudades,
  obtenerRegiones,
  registrarEmpresa,
} from "../api/cerveceria_API";

function EmpresaForm({ onChange, usuario_id }) {
  const [comunas, setComunas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [selectedComuna, setSelectedComuna] = useState("");
  const [selectedCiudad, setSelectedCiudad] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [rutEmpresa, setRutEmpresa] = useState("");
  const [giroComercial, setGiroComercial] = useState("");
  const [direccionEmpresa, setDireccionEmpresa] = useState("");
  const [numeroEmpresa, setNumeroEmpresa] = useState("");
  const [isFacturaFormValid, setIsFacturaFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    onChange({
      razonSocial,
      rutEmpresa,
      giroComercial,
      direccionEmpresa,
      numeroEmpresa,
      comunaEmpresa: selectedComuna,
      ciudadEmpresa: selectedCiudad,
      regionEmpresa: selectedRegion,
    });
    validateFacturaForm();
  }, [
    razonSocial,
    rutEmpresa,
    giroComercial,
    direccionEmpresa,
    numeroEmpresa,
    selectedComuna,
    selectedCiudad,
    selectedRegion,
  ]);

  useEffect(() => {
    async function getComunas() {
      try {
        const res = await obtenerComunas();
        setComunas(res);
      } catch (error) {
        console.error("Error al obtener comunas:", error);
      }
    }
    getComunas();
  }, []);

  useEffect(() => {
    async function getCiudades() {
      try {
        const res = await obtenerCiudades();
        setCiudades(res);
      } catch (error) {
        console.error("Error al obtener ciudades:", error);
      }
    }
    getCiudades();
  }, []);

  useEffect(() => {
    async function getRegiones() {
      try {
        const res = await obtenerRegiones();
        setRegiones(res);
      } catch (error) {
        console.error("Error al obtener regiones:", error);
      }
    }
    getRegiones();
  }, []);

  const validateFacturaForm = () => {
    const errors = {};
    if (!razonSocial) errors.razonSocial = "Razón Social es requerida.";
    if (!rutEmpresa) errors.rutEmpresa = "RUT Empresa es requerido.";
    if (!giroComercial) errors.giroComercial = "Giro Comercial es requerido.";
    if (!direccionEmpresa) errors.direccionEmpresa = "Dirección Empresa es requerida.";
    if (!numeroEmpresa) errors.numeroEmpresa = "Número es requerido.";
    if (!selectedComuna) errors.selectedComuna = "Comuna es requerida.";
    if (!selectedCiudad) errors.selectedCiudad = "Ciudad es requerida.";
    if (!selectedRegion) errors.selectedRegion = "Región es requerida.";

    setFormErrors(errors);
  };

  const handleComunaChange = (event) => {
    setSelectedComuna(event.target.value);
  };

  const handleCiudadChange = (event) => {
    setSelectedCiudad(event.target.value);
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    validateFacturaForm();
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    const nuevaEmpresa = {
      razon_social: razonSocial,
      rut_empresa: rutEmpresa,
      giro_comercial: giroComercial,
      direccion_empresa: direccionEmpresa,
      numero_empresa: numeroEmpresa,
      comuna_empresa: selectedComuna,
      usuario: usuario_id,
      ciudad_empresa: selectedCiudad,
      region_empresa: selectedRegion,
    };
    try {
      const response = await registrarEmpresa(nuevaEmpresa);
      if (response.status === 201) {
        console.log("Empresa agregada con éxito!");
      } else {
        console.error("Error al intentar agregar empresa");
      }
    } catch (err) {
      console.error("Error al agregar empresa: ", err);
    }
  };

  return (
    <div className="card p-4">
      <h2>Formulario Factura</h2>
      <hr className="custom-hr" />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="razonSocial">Razón Social:</label>
          <input
            type="text"
            id="razonSocial"
            className="form-control"
            value={razonSocial}
            onChange={handleChange(setRazonSocial)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="rutEmpresa">RUT Empresa:</label>
          <input
            type="text"
            id="rutEmpresa"
            className="form-control"
            value={rutEmpresa}
            onChange={handleChange(setRutEmpresa)}
          />
          {formErrors.rutEmpresa && <p className="text-danger">{formErrors.rutEmpresa}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="giroComercial">Giro Comercial:</label>
          <input
            type="text"
            id="giroComercial"
            className="form-control"
            value={giroComercial}
            onChange={handleChange(setGiroComercial)}
          />
          {formErrors.giroComercial && <p className="text-danger">{formErrors.giroComercial}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="direccionEmpresa">Dirección Empresa:</label>
          <input
            type="text"
            id="direccionEmpresa"
            className="form-control"
            value={direccionEmpresa}
            onChange={handleChange(setDireccionEmpresa)}
          />
          {formErrors.direccionEmpresa && <p className="text-danger">{formErrors.direccionEmpresa}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="numeroEmpresa">Número:</label>
          <input
            type="text"
            id="numeroEmpresa"
            className="form-control"
            value={numeroEmpresa}
            onChange={handleChange(setNumeroEmpresa)}
          />
          {formErrors.numeroEmpresa && <p className="text-danger">{formErrors.numeroEmpresa}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="region">Región:</label>
          <select
            id="region"
            className="form-control"
            value={selectedRegion}
            onChange={handleRegionChange}
          >
            <option value="">Selecciona una región</option>
            {regiones.map((region) => (
              <option key={region.id} value={region.id}>
                {region.nombre}
              </option>
            ))}
          </select>
          {formErrors.selectedRegion && <p className="text-danger">{formErrors.selectedRegion}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="ciudad">Ciudad:</label>
          <select
            id="ciudad"
            className="form-control"
            value={selectedCiudad}
            onChange={handleCiudadChange}
            disabled={!selectedRegion}
          >
            <option value="">Selecciona una ciudad</option>
            {ciudades
              .filter((ciudad) => ciudad.region === parseInt(selectedRegion))
              .map((ciudad) => (
                <option key={ciudad.id} value={ciudad.id}>
                  {ciudad.nombre}
                </option>
              ))}
          </select>
          {formErrors.selectedCiudad && <p className="text-danger">{formErrors.selectedCiudad}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="comuna">Comuna:</label>
          <select
            id="comuna"
            className="form-control"
            value={selectedComuna}
            onChange={handleComunaChange}
            disabled={!selectedCiudad}
          >
            <option value="">Selecciona una comuna</option>
            {comunas
              .filter((comuna) => comuna.ciudad === parseInt(selectedCiudad))
              .map((comuna) => (
                <option key={comuna.id} value={comuna.id}>
                  {comuna.nombre}
                </option>
              ))}
          </select>
          {formErrors.selectedComuna && <p className="text-danger">{formErrors.selectedComuna}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-success"
          disabled={!isFacturaFormValid}
        >
          Guardar Empresa
        </button>
      </form>
    </div>
  );
}

export default EmpresaForm;