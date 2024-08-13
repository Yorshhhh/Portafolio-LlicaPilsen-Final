<<<<<<< HEAD
import React, { useState } from "react";
import AgregarProducto from "../components/AgregarProducto";
import ListarProductos from "../components/ListarProductos";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdministrarProducto() {
  const [mostrarAgregar, setMostrarAgregar] = useState(true);
  const [mostrarListar, setMostrarListar] = useState(false);

  const toggleAgregar = () => {
    setMostrarAgregar(!mostrarAgregar);
    // Si se muestra Agregar, ocultar Listar
    if (!mostrarAgregar) {
      setMostrarListar(false);
    }
  };

  const toggleListar = () => {
    setMostrarListar(!mostrarListar);
    // Si se muestra Listar, ocultar Agregar
    if (!mostrarListar) {
      setMostrarAgregar(false);
    }
  };

  return (
    <>
      <style>
        {`
          .ver-pedidos-container {
            background-color: white;
            padding-top: 20px;
          }
          .botones-pedidos {
            margin-top: 20px;
          }
        `}
      </style>

      <Navbar />
      <div className="ver-pedidos-container user-profile-staff-actions flex flex-col items-center justify-center">
        <div className="botones-pedidos flex justify-center gap-4 mb-8">
          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              mostrarAgregar
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={toggleAgregar}
          >
            {mostrarAgregar
              ? "Ocultar Agregar Producto"
              : "Mostrar Agregar Producto"}
          </button>

          <button
            className={`user-profile-button user-profile-staff-button py-2 px-4 text-sm rounded-md ${
              mostrarListar
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={toggleListar}
          >
            {mostrarListar
              ? "Ocultar Listado Productos"
              : "Mostrar Listado Productos"}
          </button>
        </div>

        {mostrarAgregar && (
          <div className="w-full flex justify-center items-center">
            <AgregarProducto />
          </div>
        )}

        {mostrarListar && (
          <div className="w-full flex justify-center items-center">
            <ListarProductos />
          </div>
        )}
      </div>

      <Footer />
    </>
=======
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CarritoContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AgregarProducto from "../components/AgregarProducto";
import ModificarCardProduct from "../components/ModificarCardProduct";

function AdministrarProducto() {
  const initialState = {
    nombre_producto: "",
    descripcion_producto: "",
    precio_producto: 0,
    stock_producto: 0,
    grado_alcoholico: 0,
    litros: 0,
    imagen: null,
  };

  const { getProducts, products } = useCart();
  const [newProduct, setNewProduct] = useState(initialState);
  const [openModalAgregarProducto, setOpenModalAgregarProducto] =
    useState(false);
  const [openModalEditarProducto, setOpenModalEditarProducto] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setOpenModalEditarProducto(true);
  };

  const handleCancelEdit = () => {
    setOpenModalEditarProducto(false);
    setProductToEdit(null);
  };

  return (
    <div className="mx-4">
      <div className="relative">
        <button
          data-modal-target="static-modal"
          data-modal-toggle="static-modal"
          className="py-2 px-4 bg-orange-500 rounded-md text-white m-4"
          onClick={() => setOpenModalAgregarProducto(!openModalAgregarProducto)}
        >
          Agregar
        </button>

        {openModalAgregarProducto && (
          <AgregarProducto initialProduct={newProduct} />
        )}
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-auto z-0">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nombre Producto
              </th>
              <th scope="col" className="px-6 py-3">
                Descripción
              </th>
              <th scope="col" className="px-6 py-3">
                Precio
              </th>
              <th scope="col" className="px-6 py-3">
                Stock
              </th>
              <th scope="col" className="px-6 py-3">
                Grado Alcohólico
              </th>
              <th scope="col" className="px-6 py-3">
                Cc
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Editar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products == null ? (
              <h1>Cargando...</h1>
            ) : (
              products?.map((product, i) => (
                <tr key={i} className="bg-white border-b  hover:bg-gray-50">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {product.nombre_producto}
                  </th>
                  <td className="px-6 py-4">{product.descripcion_producto}</td>
                  <td className="px-6 py-4">{product.precio_producto}</td>
                  <td className="px-6 py-4">{product.stock_producto}</td>
                  <td className="px-6 py-4">{product.grado_alcoholico}</td>
                  <td className="px-6 py-4">{product.litros}</td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => handleEditClick(product)}
                    >
                      Editar
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {openModalEditarProducto && productToEdit && (
          <ModificarCardProduct
            producto={productToEdit}
            onCancel={handleCancelEdit}
          />
        )}
      </div>

      {/* <ListarProductos/> */}
    </div>
>>>>>>> ramayorsh
  );
}

export default AdministrarProducto;
