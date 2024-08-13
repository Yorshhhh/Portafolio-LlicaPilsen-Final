import React, { useEffect, useState } from "react";
import { getAllProductos } from "../api/cerveceria_API";
import { useCart } from "../context/CarritoContext";
import "../css/styleproducto.css";
import CardProducts from "../components/CardProducts";
import ReactPaginate from "react-paginate";
<<<<<<< HEAD
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
=======
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
>>>>>>> ramayorsh
import Footer from "../components/Footer";

function ProductosPage() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart,
    showCart,
    setShowCart,
  } = useCart();

  const [productos, setProductos] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("default");
  const [pageNumber, setPageNumber] = useState(0);
  const productosPerPage = 6;

  const clearCartHandler = () => {
    clearCart(setCartItems, setShowCart);
  };

  useEffect(() => {
    async function loadProductos() {
      try {
        const res = await getAllProductos();
        console.log("Respuesta de productos res:", res);
        console.log("Respuesta de res.data: ", res.data)
        if (Array.isArray(res.data)) {
          setProductos(res.data);
        } else {
          setProductos([]); // En caso de que res.data no sea un arreglo
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    }
    loadProductos();
  }, []);

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const sortProducts = (products, criteria) => {
    switch (criteria) {
      case "price-asc":
        return products
          .slice()
          .sort((a, b) => a.precio_producto - b.precio_producto);
      case "price-desc":
        return products
          .slice()
          .sort((a, b) => b.precio_producto - a.precio_producto);
      default:
        return products;
    }
  };

  const displayedProducts = sortProducts(productos, sortCriteria);

  const pageCount = Math.ceil(displayedProducts.length / productosPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const selectedProducts = displayedProducts
    .slice(pageNumber * productosPerPage, (pageNumber + 1) * productosPerPage)
    .map((producto) => (
      <CardProducts key={producto.cod_producto} producto={producto} />
    ));

  return (
    <>
<<<<<<< HEAD
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        toggleCart={toggleCart}
        showCart={showCart}
        setShowCart={setShowCart}
        clearCartHandler={clearCartHandler}
      />
      <div className="productos-header">
        <h1 className="text-4xl font-bold text-center mb-8">
          Todos los productos
        </h1>
      </div>
      <div className="flex justify-center mb-4">
        <select
          className="p-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-filter"
          onChange={handleSortChange}
          value={sortCriteria}
        >
          <option value="default">Ordenar por...</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto w-full max-w-7xl">
        {selectedProducts}
      </div>
      <div className="flex justify-center mt-8 mb-16">
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"pagination"}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
        />
      </div>
      <ToastContainer />  
      <Footer />
=======
      <div className="productos-page">
        <div className="productos-header">
          <h1 className="text-4xl font-bold text-center mb-8">
            Todos los productos
          </h1>
        </div>
        <div className="flex justify-center mb-4">
          <select
            className="p-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-filter"
            onChange={handleSortChange}
            value={sortCriteria}
          >
            <option value="default">Ordenar por...</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto w-full max-w-7xl">
          {selectedProducts}
        </div>
        <div className="flex justify-center mt-8 mb-16 pagination-container"></div>
        <ToastContainer />
        <Footer />
      </div>
>>>>>>> ramayorsh
    </>
  );
}

export default ProductosPage;
