import { useCart } from "../context/CarritoContext";
import { useState } from "react";
import '../css/CarritoPrepago.css'

function CarritoPrepago() {
  const { cartItems, calculateTotal,removeFromCart } = useCart();

  const [productos, setProductos] = useState([]);
  return (
    <>
      <div className="cart-dropdown">
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
      </div>
    </>
  );
}

export default CarritoPrepago;
