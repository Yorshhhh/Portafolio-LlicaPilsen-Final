import { useEffect, useState } from "react";
import { getAllProductos } from "../api/cerveceria_API";
import { useCart } from "../context/CarritoContext";
import Modalidad from "../components/Modalidad";
import Bienvenida from "../components/Bienvenida";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CardProducts from "../components/CardProducts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/font-awesome.min.css";
import "../css/bootstrap.min.css";
import "../css/paginaestilo.css";

function HomePage() {
  const [productos, setProductos] = useState([]);
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart,
    showCart,
    setShowCart,
  } = useCart();

  const clearCartHandler = () => {
    clearCart(setCartItems, setShowCart);
  };

  useEffect(() => {
    async function loadProductos() {
      const res = await getAllProductos();
      // IDs específicos de los productos que deseas mostrar
      const featuredProductIds = [32, 34, 36, 38, 28];
      const featuredProducts = res.data.filter(producto =>
        featuredProductIds.includes(producto.cod_producto)
      );
      setProductos(featuredProducts);
    }
    loadProductos();
  }, []);

  return (
    <body data-spy="scroll" data-target="#navbarNav" data-offset="50">
      {/* BARRA DE NAVEGACION */}
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        toggleCart={toggleCart}
        showCart={showCart}
        setShowCart={setShowCart}
        clearCartHandler={clearCartHandler}
      />
      {/* BIENVENIDA */}
      <Bienvenida />

      {/* PRODUCTOS DESTACADOS */}
      <section className="featured-products">
        <h1 className="font-bold text-2xl text-white">Productos Destacados!</h1>
        <div className="flex flex-wrap my-8 gap-8 justify-center">
          {productos.map((producto) => (
            <CardProducts producto={producto} />
          ))}
        </div>
      </section>
      {/* CARRUSEL */}
      {/* INFORMACION Y MODALIDAD DE VENTAS */}
      <Modalidad />
      {/* FOOTER */}
      <Footer />
      <ToastContainer />
    </body>
  );
}

export default HomePage;
