import { useCart } from "../context/CarritoContext";
import '../css/CarritoPrepago.css'

function CarritoPrepago() {
  const { cartItems, calculateTotal, removeFromCart } = useCart();

  return (
    <>
      <div id="carritoExito" className="cart-dropdown">
        <h2>Resumen compra</h2>
        <table className="cart-vista">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
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
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Total: ${calculateTotal(cartItems)}</h2>
      </div>
    </>
  );
}

export default CarritoPrepago;
