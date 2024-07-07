import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Importar useParams para obtener el ID de la URL
import Navbar from "../components/Navbar";
import Footer from '../components/Footer'
import { getProducto } from "../api/cerveceria_API"; // Importar la función para obtener un producto
import { useCart } from "../context/CarritoContext";
import "../css/estilovistaproducto.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VistaProductoPage() {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const [producto, setProducto] = useState(null); // Estado para almacenar la información del producto
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true); // Estado para controlar el loading
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCartHandler,
    toggleCart,
    showCart,
    setShowCart,
  } = useCart();

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => {
      if (prevQuantity < producto.stock_producto) {
        return prevQuantity + 1;
      }
      return prevQuantity;
    });
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= producto.stock_producto) {
      setQuantity(value);
    } else if (value > producto.stock_producto) {
      setQuantity(producto.stock_producto);
    } else {
      setQuantity(1);
    }
  };

  useEffect(() => {
    async function fetchProducto() {
      try {
        const res = await getProducto(id); // Llamar a la API con el ID del producto
        setProducto(res.data); // Almacenar la información del producto en el estado
        setLoading(false); // Terminar el loading
      } catch (error) {
        console.error("Error al obtener el producto:", error); // Manejar errores
        setLoading(false); // Terminar el loading incluso si hay un error
      }
    }

    fetchProducto();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Mostrar mensaje de loading mientras se carga el producto
  }

  if (!producto) {
    return <div>No se encontró el producto</div>; // Mostrar mensaje si no se encontró el producto
  }

  const handleAddToCart = () => {
    const cartItem = cartItems.find(
      (item) => item.cod_producto === producto.cod_producto
    );
    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > producto.stock_producto) {
        toast.error(
          "La cantidad total en el carrito supera el stock disponible."
        );
        return;
      }
    }
    addToCart(producto, quantity);
    toast.success("¡Producto añadido al carrito!", { autoClose: 2000 }); // Toast de éxito al agregar al carrito
  };

  return (
    <>
    <Navbar
          cartItems={cartItems}
          /* removeFromCart={removeFromCart} */
          toggleCart={toggleCart}
          showCart={showCart}
          setShowCart={setShowCart}
        /* clearCartHandler={clearCartHandler} */
        />
    <div className="vista-producto">
    
  
      <div className="container-title center-container">
        <h1>Detalles del Producto</h1>
        <h2>{producto.nombre_producto}</h2>
      </div>

      <main>
        <div className="imagen">
          <img
            src={producto.imagen} // Usar la URL real de la imagen del producto
            className="img-fluid"
            alt={`Imagen de ${producto.nombre_producto}`}
          />
        </div>

        <div className="container-info-product">
          <div className="container-description">
            <div className="title-description">
              <h2>Descripcion</h2>
              <i className="fa-solid fa-chevron-down"></i>
            </div>

            <div className="text-description">
              <p>{producto.descripcion_producto}</p>
              {/* Mostrar la descripción del producto */}
            </div>
          </div>
          <div className="text-description">
            <h2>Grado alcoholico: {producto.grado_alcoholico}</h2>
            {/* Mostrar la descripción del producto */}
          </div>
          <hr />
          <div className="text-description">
            <h2>Cantidad en CC: {producto.litros} CC</h2>
            {/* Mostrar la descripción del producto */}
          </div>
          <hr />
          <div className="container-quantity">
            <h2>Stock disponible: {producto.stock_producto}</h2>
          </div>
          <hr />
          <div className="container-price">
            <h2>Precio: ${producto.precio_producto}</h2>
            {/* Mostrar el precio del producto */}
            <i className="fa-solid fa-angle-right"></i>
          </div>

          <div className="container-add-cart">
            <div className="container-quantity">
              <input
                type="number"
                placeholder="1"
                value={quantity} /* Modifica aquí para usar value */
                min="1"
                className="input-quantity"
                onChange={handleChange}
              />

              <div className="btn-increment-decrement">
                <i
                  className="fa-solid fa-chevron-up"
                  id="increment"
                  onClick={incrementQuantity}
                ></i>
                <i
                  className="fa-solid fa-chevron-down"
                  id="decrement"
                  onClick={decrementQuantity}
                ></i>
              </div>
            </div>
            <br />
            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              <i className="fa-solid fa-plus"></i>
              Añadir al carrito
            </button>
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>

      <script
        src="https://kit.fontawesome.com/81581fb069.js"
        crossOrigin="anonymous"
      ></script>

      <script
        src="https://kit.fontawesome.com/81581fb069.js"
        crossOrigin="anonymous"
      ></script>
      <script src="vistaproducto.js"></script>
      <ToastContainer />
    </div>
    </>

    
  );
}

export default VistaProductoPage;
