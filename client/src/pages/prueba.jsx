import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CarritoContext";
import "../css/estilovistaproducto.css";
import Footer from "../components/Footer";

function VistaProductoPage() {
  const [producto, setProducto] = useState(null); // Estado para almacenar la información del producto
  const [quantity, setQuantity] = useState(1); // Estado para el contador de cantidad
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCartHandler,
    toggleCart,
    showCart,
    setShowCart,
  } = useCart();

  // funciones para aumentar o disminuir producto a carrito
  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };
  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  return (
    <div className="vista-producto">
      <div>
        <Navbar
          cartItems={cartItems}
          removeFromCart={removeFromCart}
          toggleCart={toggleCart}
          showCart={showCart}
          setShowCart={setShowCart}
          clearCartHandler={clearCartHandler}
        />
      </div>
      <hr />
      <hr />
      <hr />
      <hr />
      <div className="container-title center-container">
        <h1>Detalles del Producto</h1>
        <h2></h2>
      </div>

      <main>
        {/*         <div className="container-img">
          <img
            src={producto.imagen || "images.jpeg"} // Mostrar la imagen del producto o una por defecto
            alt="imagen-producto"
          />
        </div> */}
        <div className="container-img">
          <img
            src="../../public/images.jpeg" // Mostrar la imagen del producto o una por defecto
            alt="imagen-producto"
          />
        </div>

        <div className="container-info-product">
          <div className="container-description">
            <div className="title-description">
              <h2>Descripcion</h2>
            </div>

            <div className="text-description">
              <p></p>
              {/* Mostrar la descripción del producto */}
            </div>
          </div>
          <div className="text-description">
            <h2>Grado alcoholico: </h2>
            {/* Mostrar la descripción del producto */}
          </div>
          <hr />
          <div className="text-description">
            <h2>Cantidad en CC: CC</h2>
            {/* Mostrar la descripción del producto */}
          </div>
          <hr />
          <div className="container-quantity">
            <h2>Stock disponible:</h2>
          </div>
          <hr />
          <div className="container-price">
            <h2>Precio: </h2>
            {/* Mostrar el precio del producto */}
          </div>

          <div className="container-add-cart">
            <div className="container-quantity">
              <input
                type="number"
                placeholder="1"
                value={quantity} /* Modifica aquí para usar value */
                min="1"
                className="input-quantity"
                onChange={(e) =>
                  setQuantity(parseInt(e.target.value) || 1)
                } /* Actualiza el estado quantity */
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
            <button
              className="btn-add-to-cart"
              onClick={() => addToCart(producto, quantity)}
            >
              <i className="fa-solid fa-plus"></i>
              Añadir al carrito
            </button>
          </div>
        </div>
      </main>

      <section className="container-related-products">
        <h2>Productos Relacionados</h2>
        <div className="card-list-products">
          {/* Aquí puedes agregar lógica para mostrar productos relacionados */}
          <div className="card">
            <div className="card-img">
              <img src="../../public/Pack-Cerveza-Rural.jpg" alt="producto-1" />
            </div>
            <div className="info-card">
              <div className="text-product">
                <h3>Cerveza -----</h3>
                <p className="category">Ver Producto</p>
              </div>
              <div className="price">$10.000</div>
            </div>
          </div>
          {/* Repite las tarjetas de productos relacionados según sea necesario */}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default VistaProductoPage;
