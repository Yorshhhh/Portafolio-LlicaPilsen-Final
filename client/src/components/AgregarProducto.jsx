import React, { useState,useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AgregarProducto({ initialProduct }) {
  const [producto, setProducto] = useState(
    initialProduct || {
      nombre_producto: "",
      descripcion_producto: "",
      precio_producto: 0,
      stock_producto: 0,
      grado_alcoholico: 0,
      litros: 0,
      imagen: null,
    }
  );

  const [error, setError] = useState("");
  const [errorNombreProducto, setErrorNombreProducto] = useState(false);
  const [errorDescripcionProducto, setErrorDescripcionProducto] =
    useState(false);
  const [errorPrecioProducto, setErrorPrecioProducto] = useState(false);
  const [errorStockProducto, setErrorStockProducto] = useState(false); // Nuevo estado de error
  const [errorGradoAlcoholico, setErrorGradoAlcoholico] = useState(false); // Nuevo estado de error
  const [errorLitros, setErrorLitros] = useState(false); // Nuevo estado de error
  const [errorImagen, setErrorImagen] = useState(false); // Nuevo estado para error de imagen
  const [open, setOpen] = useState(true); // Estado para controlar la visibilidad del modal

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen") {
      setProducto({
        ...producto,
        imagen: files[0], // Guardar la imagen seleccionada en el estado
      });
      setErrorImagen(false); // Reiniciar el error de imagen
    } else {
      setProducto({
        ...producto,
        [name]: value,
      });

      // Reiniciar los errores según el campo modificado
      switch (name) {
        case "nombre_producto":
          setErrorNombreProducto(false);
          break;
        case "descripcion_producto":
          setErrorDescripcionProducto(false);
          break;
        case "precio_producto":
          setErrorPrecioProducto(false);
          break;
        case "stock_producto":
          setErrorStockProducto(false);
          break;
        case "grado_alcoholico":
          setErrorGradoAlcoholico(false);
          break;
        case "litros":
          setErrorLitros(false);
          break;
        default:
          break;
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    if (
      producto.nombre_producto.trim() === "" ||
      producto.nombre_producto.length < 5
    ) {
      setErrorNombreProducto(true);
      valid = false;
    }
    if (
      producto.descripcion_producto.trim() === "" ||
      producto.descripcion_producto.length < 10 ||
      producto.descripcion_producto.length > 255
    ) {
      setErrorDescripcionProducto(true);
      valid = false;
    }
    const precio = parseFloat(producto.precio_producto);
    if (isNaN(precio) || precio <= 0 || precio < 5000 || precio > 20000) {
      setErrorPrecioProducto(true);
      valid = false;
    } else {
      setErrorPrecioProducto(false);
    }
    // Validar campo stock_producto
    if (
      producto.stock_producto === "" ||
      producto.stock_producto === 0 ||
      producto.stock_producto < 1
    ) {
      setErrorStockProducto(true);
      valid = false;
    } else {
      setErrorStockProducto(false);
    }
    const gradoAlcoholico = parseFloat(producto.grado_alcoholico);
    if (
      isNaN(gradoAlcoholico) ||
      gradoAlcoholico === 0 ||
      gradoAlcoholico < 4.5 ||
      gradoAlcoholico > 7.2
    ) {
      setErrorGradoAlcoholico(true); // Error de grado_alcoholico
      valid = false;
    }
    const litros = parseFloat(producto.litros);
    if (isNaN(litros) || litros === 0 || litros < 473 || litros > 574) {
      setErrorLitros(true); // Error de litros
      valid = false;
    }
    // Validar la presencia de una imagen
    if (!producto.imagen) {
      setErrorImagen(true);
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre_producto", producto.nombre_producto);
      formData.append("descripcion_producto", producto.descripcion_producto);
      formData.append("precio_producto", parseFloat(producto.precio_producto));
      formData.append("stock_producto", parseInt(producto.stock_producto));
      formData.append(
        "grado_alcoholico",
        parseFloat(producto.grado_alcoholico)
      );
      formData.append("litros", parseFloat(producto.litros));
      formData.append("imagen", producto.imagen); // Agregar la imagen al formulario FormData

      const response = await fetch("http://127.0.0.1:8000/productos/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al agregar el producto");
      }

      console.log("Producto agregado exitosamente");
      // Reiniciar el estado del formulario después de enviar los datos
      setProducto({
        nombre_producto: "",
        descripcion_producto: "",
        precio_producto: 0,
        stock_producto: 0,
        grado_alcoholico: 0,
        litros: 0,
        imagen: null,
      });
      setError(""); // Limpiar mensaje de error
      toast.success("Producto agregado correctamente");
      console.log("Producto agregado exitosamente");
    } catch (error) {
      setError("Error al agregar el producto");
      console.error("Error al agregar el producto:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      tabIndex="-1"
      aria-hidden="true"
      className="absolute top-64 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-lg font-semibold text-gray-900">
              Agregar Producto
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
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

          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
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
                  name="nombre_producto"
                  id="nombre_producto"
                  value={producto.nombre_producto}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Escriba el nombre del producto"
                />
                {errorNombreProducto && (
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
                <input
                  type="text"
                  name="descripcion_producto"
                  id="descripcion_producto"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Escriba la descripcion del producto"
                  value={producto.descripcion_producto}
                  onChange={handleChange}
                />
                {errorDescripcionProducto && (
                  <div style={styles.errorMessage}>
                    El campo Descripción no puede estar vacío y debe tener entre
                    10 y 255 caracteres.
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="precio_producto"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Precio
                </label>
                <input
                  type="number"
                  name="precio_producto"
                  id="precio_producto"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Escriba el precio del producto"
                  value={producto.precio_producto}
                  onChange={handleChange}
                />
                {errorPrecioProducto && (
                  <div style={styles.errorMessage}>
                    El campo Precio debe ser un número mayor a 0 y estar entre
                    5000 y 20000.
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="stock_producto"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Stock Producto
                </label>
                <input
                  type="number"
                  name="stock_producto"
                  id="stock_producto"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Escriba el stock del producto"
                  value={producto.stock_producto}
                  onChange={handleChange}
                />
                {errorStockProducto && (
                  <div style={styles.errorMessage}>
                    El campo Stock Producto no puede estar vacío, debe ser mayor
                    a 0 y no puede estar vacío.
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="grado_alcoholico"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Grado Alcoholico
                </label>
                <input
                  type="number"
                  name="grado_alcoholico"
                  id="grado_alcoholico"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Escriba el grado alcoholico"
                  value={producto.grado_alcoholico}
                  onChange={handleChange}
                />
                {errorGradoAlcoholico && (
                  <div style={styles.errorMessage}>
                    El campo Grado Alcoholico debe ser un número mayor a 0 y
                    estar entre 4.5 y 7.2.
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="litros"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Litros
                </label>
                <input
                  type="number"
                  name="litros"
                  id="litros"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Escriba los litros"
                  value={producto.litros}
                  onChange={handleChange}
                />
                {errorLitros && (
                  <div style={styles.errorMessage}>
                    El campo Litros debe ser un número mayor a 0 y estar entre
                    473 y 574.
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="imagen"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Imagen
                </label>
                <input
                  type="file"
                  name="imagen"
                  id="imagen"
                  accept="image/*"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
                {errorImagen && (
                  <div style={styles.errorMessage}>
                    Por favor, seleccione una imagen.
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Agregar Producto
              </button>
            </div>
          </form>
          {error && <div style={styles.errorMessage}>{error}</div>}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

const styles = {
  errorMessage: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: "0.5rem",
  },
};
