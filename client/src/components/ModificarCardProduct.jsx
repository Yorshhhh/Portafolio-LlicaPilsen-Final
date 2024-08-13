import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
<<<<<<< HEAD
import { toast } from "react-toastify";
=======
import { toast, ToastContainer } from "react-toastify";
>>>>>>> ramayorsh
import "../css/modifiCard.css";

const DEFAULT_IMAGE_URL = "https://via.placeholder.com/150?text=No+Image";

<<<<<<< HEAD
function ModificarCardProduct({ producto, actualizarProducto }) {
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
      formData.append("descripcion_producto", editedProduct.descripcion_producto);
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

      const productoActualizado = await response.json();
      actualizarProducto(productoActualizado);

      toast.success("Producto modificado correctamente");
      setIsEditing(false);
    } catch (error) {
      toast.error("Error al guardar el producto: " + error.message);
      console.error("Error al guardar el producto:", error);
    }
  };
=======
export default function ModificarCardProduct({ producto, setIsEditing }) {
  const [editedProduct, setEditedProduct] = useState(producto);
  const [errors, setErrors] = useState({
    nombre_producto: false,
    descripcion_producto: false,
    precio_producto: false,
    stock_producto: false,
    grado_alcoholico: false,
    litros: false,
  });
  const [open, setOpen] = useState(true);
>>>>>>> ramayorsh

  const handleChange = (field, value) => {
    setEditedProduct({
      ...editedProduct,
      [field]: value,
    });

    // Reiniciar el error del campo modificado
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false,
    }));
  }
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

<<<<<<< HEAD
    if (editedProduct.nombre_producto.trim() === "" || editedProduct.nombre_producto.length < 5) {
      errors.nombre_producto = "El campo Nombre Producto no puede estar vacío y debe tener al menos 5 caracteres.";
      valid = false;
    }
    if (
      editedProduct.descripcion_producto.trim() === "" ||
      editedProduct.descripcion_producto.length < 10 ||
      editedProduct.descripcion_producto.length > 255
    ) {
      errors.descripcion_producto = "El campo Descripción no puede estar vacío y debe tener entre 10 y 255 caracteres.";
=======
    if (!editedProduct.nombre_producto || editedProduct.nombre_producto.length < 5) {
      newErrors.nombre_producto = true;
      valid = false;
    }
    if (!editedProduct.descripcion_producto || editedProduct.descripcion_producto.length < 10 || editedProduct.descripcion_producto.length > 255) {
      newErrors.descripcion_producto = true;
>>>>>>> ramayorsh
      valid = false;
    }
    const precio = parseFloat(editedProduct.precio_producto);
    if (isNaN(precio) || precio <= 0 || precio < 5000 || precio > 20000) {
<<<<<<< HEAD
      errors.precio_producto = "Por favor, ingresa un precio válido (entre $5000 y $20000).";
=======
      newErrors.precio_producto = true;
>>>>>>> ramayorsh
      valid = false;
    }
    if (!editedProduct.stock_producto || editedProduct.stock_producto < 1) {
      newErrors.stock_producto = true;
      valid = false;
    }
    const gradoAlcoholico = parseFloat(editedProduct.grado_alcoholico);
<<<<<<< HEAD
    if (
      isNaN(gradoAlcoholico) ||
      gradoAlcoholico <= 0 ||
      gradoAlcoholico < 4.5 ||
      gradoAlcoholico > 7.2
    ) {
      errors.grado_alcoholico = "El campo Grado Alcohólico no puede estar vacío y debe estar entre 4.5 y 7.2 grados.";
      valid = false;
    }
    const litros = parseFloat(editedProduct.litros);
    if (isNaN(litros) || litros <= 0 || litros < 473 || litros > 574) {
      errors.litros = "El campo Litros no puede estar vacío y debe estar entre 473cc y 574cc.";
=======
    if (isNaN(gradoAlcoholico) || gradoAlcoholico < 4.5 || gradoAlcoholico > 7.2) {
      newErrors.grado_alcoholico = true;
      valid = false;
    }
    const litros = parseFloat(editedProduct.litros);
    if (isNaN(litros) || litros < 473 || litros > 574) {
      newErrors.litros = true;
>>>>>>> ramayorsh
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    setEditedProduct(producto);
    setOpen(true);
  }, [producto]);

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("nombre_producto", editedProduct.nombre_producto);
      formData.append("descripcion_producto", editedProduct.descripcion_producto);
      formData.append("precio_producto", parseFloat(editedProduct.precio_producto));
      formData.append("stock_producto", parseInt(editedProduct.stock_producto));
      formData.append("grado_alcoholico", parseFloat(editedProduct.grado_alcoholico));
      formData.append("litros", parseFloat(editedProduct.litros));
      if (editedProduct.imagen instanceof File) {
        formData.append("imagen", editedProduct.imagen);
      }
      const response = await fetch(`http://127.0.0.1:8000/productos/${editedProduct.cod_producto}/`, {
        method: "PUT",
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al actualizar el producto");
      }
      toast.success("Producto editado correctamente");
      setOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al editar el producto: " + error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
  };

  if (!open) {
    return null;
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditedProduct({ ...editedProduct, imagen: file });
    }
  };

  return (
    <div
      tabIndex="-1"
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-lg font-semibold text-gray-900">Editar Producto</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
              onClick={handleClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
<<<<<<< HEAD
          <div className="product-card-content flex flex-col items-center">
            <h1 className="text-center">{producto.nombre_producto}</h1>
            <div className="text-left w-full px-4">
              <p className="text-black"><strong>Precio:</strong> ${producto.precio_producto}</p>
              <p className="text-black">{producto.descripcion_producto}</p>
              <p className="text-black"><strong>Grado Alcohol:</strong> {producto.grado_alcoholico}</p>
              <p className="text-black"><strong>CC:</strong> {producto.litros}</p>
              <p className="text-black"><strong>Stock:</strong> {producto.stock_producto}</p>
            </div>
            <button
              onClick={handleEdit}
              className="w-full bg-orange-400 py-2 px-6 text-white text-lg font-bold rounded-md hover:bg-orange-600"
            >
              Modificar
            </button>
          </div>
        </>
      ) : (
        <div className="edit-form flex flex-col items-center justify-center bg-slate-800">
          <label className="text-white block mb-2">Nombre Producto:</label>
          <input
            type="text"
            value={editedProduct.nombre_producto}
            onChange={(e) => handleChange("nombre_producto", e.target.value)}
            className="mb-2 p-2 border rounded-md w-full"
            style={{ color: "black" }} // Establecer el color del texto en negro
          />
          {errors.nombre_producto && (
            <div className="text-red-500 mb-2">{errors.nombre_producto}</div>
          )}
          <label className="text-white block mb-2">Descripción:</label>
          <textarea
            value={editedProduct.descripcion_producto}
            onChange={(e) => handleChange("descripcion_producto", e.target.value)}
            className="mb-2 p-2 border rounded-md w-full"
            style={{ color: "black" }} // Establecer el color del texto en negro
          />
          {errors.descripcion_producto && (
            <div className="text-red-500 mb-2">{errors.descripcion_producto}</div>
          )}
          <label className="text-white block mb-2">Precio:</label>
          <input
            type="number"
            value={editedProduct.precio_producto}
            onChange={(e) => handleChange("precio_producto", e.target.value)}
            className="mb-2 p-2 border rounded-md w-full"
            style={{ color: "black" }} // Establecer el color del texto en negro
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
            style={{ color: "black" }} // Establecer el color del texto en negro
          />
          {errors.stock_producto && (
            <div className="text-red-500 mb-2">{errors.stock_producto}</div>
          )}
          <label className="text-white block mb-2">Grado Alcohólico:</label>
          <input
            type="number"
            step="0.1"
            value={editedProduct.grado_alcoholico}
            onChange={(e) => handleChange("grado_alcoholico", e.target.value)}
            className="mb-2 p-2 border rounded-md w-full"
            style={{ color: "black" }} // Establecer el color del texto en negro
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
            style={{ color: "black" }} // Establecer el color del texto en negro
          />
          {errors.litros && (
            <div className="text-red-500 mb-2">{errors.litros}</div>
          )}
          <label className="text-white block mb-2">Imagen:</label>
          <input type="file" onChange={handleImageChange} className="mb-2" />
          <button
            onClick={handleSave}
            className="w-full bg-green-500 py-2 px-6 text-white text-lg font-bold rounded-md hover:bg-green-600"
          >
            Guardar
          </button>
=======

          <div className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="nombre_producto"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Nombre Producto
                </label>
                <input
                  type="text"
                  value={editedProduct.nombre_producto}
                  onChange={(e) =>
                    handleChange("nombre_producto", e.target.value)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Escriba el nombre del producto"
                />
                {errors.nombre_producto && (
                  <div style={styles.errorMessage}>
                    El campo Nombre Producto no puede estar vacío y debe tener
                    al menos 5 caracteres.
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="descripcion_producto"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Descripción
                </label>
                <textarea
                  value={editedProduct.descripcion_producto}
                  onChange={(e) =>
                    handleChange("descripcion_producto", e.target.value)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Escriba la descripcion del producto"
                />
                {errors.descripcion_producto && (
                  <div style={styles.errorMessage}>
                    El campo Descripción no puede estar vacío y debe tener entre
                    10 y 255 caracteres.
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="precio_producto"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Precio
                </label>
                <input
                  type="number"
                  value={editedProduct.precio_producto}
                  onChange={(e) =>
                    handleChange("precio_producto", e.target.value)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Escriba el precio del producto"
                />
                {errors.precio_producto && (
                  <div style={styles.errorMessage}>
                    El campo Precio debe ser un número mayor a 0 y estar entre
                    5000 y 20000.
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="stock_producto"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Stock Producto
                </label>
                <input
                  type="number"
                  value={editedProduct.stock_producto}
                  onChange={(e) =>
                    handleChange("stock_producto", e.target.value)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Escriba el stock del producto"
                />
                {errors.stock_producto && (
                  <div style={styles.errorMessage}>
                    El campo Stock Producto no puede estar vacío y debe ser
                    mayor a 0.
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="grado_alcoholico"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Grado Alcohólico
                </label>
                <input
                  type="number"
                  value={editedProduct.grado_alcoholico}
                  onChange={(e) =>
                    handleChange("grado_alcoholico", e.target.value)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Escriba el grado alcohólico"
                />
                {errors.grado_alcoholico && (
                  <div style={styles.errorMessage}>
                    El campo Grado Alcohólico debe ser un número entre 4.5 y
                    7.2.
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="litros"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Litros
                </label>
                <input
                  type="number"
                  value={editedProduct.litros}
                  onChange={(e) => handleChange("litros", e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Escriba la cantidad en litros"
                />
                {errors.litros && (
                  <div style={styles.errorMessage}>
                    El campo Litros debe ser un número entre 473 y 574.
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="imagen"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Guardar Cambios
            </button>
          </div>
>>>>>>> ramayorsh
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

<<<<<<< HEAD
ModificarCardProduct.propTypes = {
  producto: PropTypes.shape({
    cod_producto: PropTypes.number.isRequired,
    nombre_producto: PropTypes.string.isRequired,
    descripcion_producto: PropTypes.string.isRequired,
    precio_producto: PropTypes.number.isRequired,
    stock_producto: PropTypes.number.isRequired,
    grado_alcoholico: PropTypes.number.isRequired,
    litros: PropTypes.number.isRequired,
    imagen: PropTypes.string,
  }).isRequired,
  actualizarProducto: PropTypes.func.isRequired,
=======
const styles = {
  errorMessage: {
    color: "red",
    fontSize: "0.75rem",
  },
>>>>>>> ramayorsh
};

ModificarCardProduct.propTypes = {
  producto: PropTypes.object.isRequired,
  setIsEditing: PropTypes.isRequired,
};
