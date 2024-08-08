import { useEffect, useState } from "react";
import { getAllProductos } from "../api/cerveceria_API";
import { useCart } from "../context/CarritoContext";
import Modalidad from "../components/Modalidad";
import Footer from "../components/Footer";
import CardProducts from "../components/CardProducts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carrusel from "../components/carrusel";


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
      const featuredProductIds = [3, 1, 21, 2];
      const featuredProducts = res.data.filter(producto =>
        featuredProductIds.includes(producto.cod_producto)
      );
      setProductos(featuredProducts);
    }
    loadProductos();
  }, []);

  return (
    <div className="homepage">

      {/* CARRUSEL */}
      <Carrusel />

      {/* PRODUCTOS DESTACADOS */}
      <section className="featured-products py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Productos Destacados</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <CardProducts key={producto.cod_producto} producto={producto} />
            ))}
          </div>
        </div>
      </section>

      {/* INFORMACION Y MODALIDAD DE VENTAS */}
      <Modalidad />

      {/* FOOTER */}
      <Footer />

      <ToastContainer />
    </div>
  );
}


export default HomePage;
