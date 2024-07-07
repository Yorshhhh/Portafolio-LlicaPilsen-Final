import React, { useEffect, useState } from "react";
import { getAllProductos } from "../api/cerveceria_API";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CarritoContext";
import "../css/styleproducto.css";
import CardProducts from "../components/CardProducts";
import ReactPaginate from "react-paginate";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const productosPerPage = 9;

  const clearCartHandler = () => {
    clearCart(setCartItems, setShowCart);
  };

  useEffect(() => {
    async function loadProductos() {
      const res = await getAllProductos();
      console.log(res.data);
      setProductos(res.data);
    }
    loadProductos();
  }, []);

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const sortProducts = (products, criteria) => {
    switch (criteria) {
      case "price-asc":
        return products.slice().sort((a, b) => a.precio_producto - b.precio_producto);
      case "price-desc":
        return products.slice().sort((a, b) => b.precio_producto - a.precio_producto);
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
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        toggleCart={toggleCart}
        showCart={showCart}
        setShowCart={setShowCart}
        clearCartHandler={clearCartHandler}
      />
      <h1 className="text-4xl font-bold text-center mb-8">
        Todos los productos
      </h1>
      <div className="flex justify-center mb-4">
        <select
          className="p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="flex justify-center mt-8">
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
    </>
  );
}

export default ProductosPage;
