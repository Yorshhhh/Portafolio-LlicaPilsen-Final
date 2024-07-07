import React, { useState } from "react";
import PropTypes from "prop-types";
import { toast } from 'react-toastify'
import "../css/modifiCard.css";

const DEFAULT_IMAGE_URL = "https://via.placeholder.com/150?text=No+Image";

function ModificarCardProduct({ producto }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...producto });
  const [errors, setErrors] = useState({});

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Por favor, corrija los errores antes de guardar.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre_producto", editedProduct.nombre_producto);
      formData.append(
        "descripcion_producto",
        editedProduct.descripcion_producto
      );
      formData.append("precio_producto", editedProduct.precio_producto);
      formData.append("stock_producto", editedProduct.stock_producto);
      formData.append("grado_alcoholico", editedProduct.grado_alcoholico);
      formData.append("litros", editedProduct.litros);

      if (editedProduct.imagen instanceof File) {
        formData.append("imagen", editedProduct.imagen);
      }

      const response = await fetch(
        `http://127.0.0.1:8000/productos/${editedProduct.cod_producto}/`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el producto");
      }
      toast.success("Producto modificado correctamente");
      setIsEditing(false);
    } catch (error) {
      toast.error("Error al guardar el producto: " + error.message);
      console.error("Error al guardar el producto:", error);
    }
  };

  const handleChange = (field, value) => {
    setEditedProduct({ ...editedProduct, [field]: value });
  };

  const validateForm = () => {
    const errors = {};
    let valid = true;

    if (
      editedProduct.nombre_producto.trim() === "" ||
      editedProduct.nombre_producto.length < 5
    ) {
      errors.nombre_producto =
        "El campo Nombre Producto no puede estar vacío y debe tener al menos 5 caracteres.";
      valid = false;
    }
    if (
      editedProduct.descripcion_producto.trim() === "" ||
      editedProduct.descripcion_producto.length < 10 ||
      editedProduct.descripcion_producto.length > 255
    ) {
      errors.descripcion_producto =
        "El campo Descripción no puede estar vacío y debe tener entre 10 y 255 caracteres.";
      valid = false;
    }
    const precio = parseFloat(editedProduct.precio_producto);
    if (isNaN(precio) || precio <= 0 || precio < 5000 || precio > 20000) {
      errors.precio_producto =
        "Por favor, ingresa un precio válido (entre $5000 y $20000).";
      valid = false;
    }
    if (
      editedProduct.stock_producto === "" ||
      editedProduct.stock_producto <= 0 ||
      editedProduct.stock_producto < 1 ||
      editedProduct.stock_producto > 10
    ) {
      errors.stock_producto = "El Stock debe estar entre 1 y 10.";
      valid = false;
    }
    const gradoAlcoholico = parseFloat(editedProduct.grado_alcoholico);
    if (
      isNaN(gradoAlcoholico) ||
      gradoAlcoholico <= 0 ||
      gradoAlcoholico < 4.5 ||
      gradoAlcoholico > 7.2
    ) {
      errors.grado_alcoholico =
        "El campo Grado Alcohólico no puede estar vacío y debe estar entre 4.5 y 7.2 grados.";
      valid = false;
    }
    const litros = parseFloat(editedProduct.litros);
    if (isNaN(litros) || litros <= 0 || litros < 473 || litros > 574) {
      errors.litros =
        "El campo Litros no puede estar vacío y debe estar entre 473cc y 574cc.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditedProduct({ ...editedProduct, imagen: file });
    }
  };

  return (
    <div className="product-card-content flex flex-col items-center">
      <h1>Modificar Producto</h1>
      {!isEditing ? (
        <>
          <div className="h-[150px] w-[150px] bg-cover mb-2">
            <img
              src={producto.imagen || DEFAULT_IMAGE_URL}
              alt={`Imagen de ${producto.nombre_producto}`}
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="text-center">
            Nombre Producto
            <br /> {producto.nombre_producto}
          </h3>
          <h3>Descripción: {producto.descripcion_producto}</h3>
          <h3>Precio: ${producto.precio_producto}</h3>
          <h3>Stock: {producto.stock_producto}</h3>
          <h3>Grado Alcohol: {producto.grado_alcoholico}</h3>
          <h3>CC: {producto.litros}</h3>
          <button
            onClick={handleEdit}
            className="w-full bg-orange-400 py-2 px-6 text-white text-lg font-bold rounded-md hover:bg-orange-600"
          >
            Modificar
          </button>
        </>
      ) : (
        <div className="edit-form flex flex-col items-center justify-center bg-slate-800">
          <label className="text-white block mb-2">Nombre Producto:</label>
          <input
            type="text"
            value={editedProduct.nombre_producto}
            onChange={(e) => handleChange("nombre_producto", e.target.value)}
            className="mb-2 p-2 border rounded-md w-full"
          />
          {errors.nombre_producto && (
            <div className="text-red-500 mb-2">{errors.nombre_producto}</div>
          )}
          <label className="text-white block mb-2">Descripción:</label>
          <textarea
            value={editedProduct.descripcion_producto}
            onChange={(e) =>
              handleChange("descripcion_producto", e.target.value)
            }
            className="mb-2 p-2 border rounded-md w-full"
          />
          {errors.descripcion_producto && (
            <div className="text-red-500 mb-2">
              {errors.descripcion_producto}
            </div>
          )}
          <label className="text-white block mb-2">Precio:</label>
          <input
            type="number"
            value={editedProduct.precio_producto}
            onChange={(e) => handleChange("precio_producto", e.target.value)}
            className="mb-2 p-2 border rounded-md w-full"
          />
          {errors.precio_producto && (
            <div className="text-red-500 mb-2">{errors.precio_producto}</div>
          )}
          <label className="text-white block mb-2">Stock:</label>
          <input
            type="number"
            value={editedProduct.stock_producto}
            onChange={(e) => handleChange("stock_producto", e.target.value)}
            className="mb-2 p-2 border rounded-md w-full"
          />
          {errors.stock_producto && (
            <div className="text-red-500 mb-2">{errors.stock_producto}</div>
          )}
          <label className="text-white block mb-2">Grado Alcohólico:</label>
          <input
            type="number"
            value={editedProduct.grado_alcoholico}
            onChange={(e) => handleChange("grado_alcoholico", e.target.value)}
            className="mb-2 p-2 border rounded-md w-full"
          />
          {errors.grado_alcoholico && (
            <div className="text-red-500 mb-2">{errors.grado_alcoholico}</div>
          )}
          <label className="text-white block mb-2">Litros:</label>
          <input
            type="number"
            value={editedProduct.litros}
            onChange={(e) => handleChange("litros", e.target.value)}
            className="mb-2 p-2 border rounded-md w-full"
          />
          {errors.litros && (
            <div className="text-red-500 mb-2">{errors.litros}</div>
          )}
          <label className="text-white block mb-2">Imagen:</label>
          <input type="file" onChange={handleImageChange} className="mb-2" />
          {editedProduct.imagen && typeof editedProduct.imagen === "string" ? (
            <div className="h-[150px] w-[150px] bg-cover mb-2">
              <img
                src={editedProduct.imagen || DEFAULT_IMAGE_URL}
                alt="Imagen Producto"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-[150px] w-[150px] bg-cover mb-2">
              <img
                src={DEFAULT_IMAGE_URL}
                alt="Imagen por Defecto"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <button
            onClick={handleSave}
            className="w-full bg-green-500 py-2 px-6 text-white text-lg font-bold rounded-md hover:bg-green-700"
          >
            Guardar
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="w-full bg-gray-500 py-2 px-6 text-white text-lg font-bold rounded-md hover:bg-gray-700 mt-2"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

ModificarCardProduct.propTypes = {
  producto: PropTypes.object.isRequired,
};

export default ModificarCardProduct;
