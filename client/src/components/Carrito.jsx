import { useCart } from "../context/CarritoContext";
import "../css/CarritoPrepago.css";

function Carrito() {
  const {
    cartItems,
    removeFromCart,
    toggleCart,
    showCart,
    setShowCart,
    clearCart,
  } = useCart();

  const calculateTotal = (cartItems) => {
    return cartItems.reduce(
      (total, producto) => total + producto.precio_producto * producto.quantity,
      0
    );
  };

  return (
    <div className="relative">
      <a
        className="cart-icon"
        onClick={() => setShowCart(!showCart)}
        style={{ color: "white", textDecoration: "none" }}
      >
        <i class="fa-sharp fa-solid fa-cart-shopping"></i> ({cartItems.length})
      </a>
      {showCart && (
        <div id="carrito" className="cart-dropdown absolute top-0 right-0 z-40 w-auto">
          <table className="cart-vista">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((producto) => (
                <tr key={producto.cod_producto}>
                  <td>
                    <img
                      src={producto.imagen} // Usar la URL real de la imagen del producto
                      className="img-fluid"
                      alt={`Imagen de ${producto.nombre_producto}`}
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td>
                    <p>{producto.nombre_producto}</p>
                  </td>
                  <td>
                    <p>{producto.quantity}</p>
                  </td>
                  <td>
                    <p>${producto.precio_producto * producto.quantity}</p>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromCart(producto.cod_producto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-warning" onClick={clearCart}>
            Vaciar Carrito
          </button>

          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/prepago")}
          >
            Pagar
          </button>
          <div className="cart-total-preview">
            <span>
              <p>Total: ${calculateTotal(cartItems)}</p>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;
