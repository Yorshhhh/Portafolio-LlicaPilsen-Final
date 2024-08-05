import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useCart } from "../context/CarritoContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CardProducts({ producto }) {
  const { cartItems, addToCart } = useCart();

  const handleAddToCart = () => {
    const existingItem = cartItems.find(item => item.cod_producto === producto.cod_producto);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    if (currentQuantity + 1 > producto.stock_producto) {
      toast.error(`No puedes agregar más de ${producto.stock_producto} unidades de este producto.`);
    } else {
      console.log('Antes de agregar al carrito');
      addToCart(producto, 1);
      console.log('Después de agregar al carrito');
      toast.success(`¡${producto.nombre_producto} se agregó al carrito!`);
    }
  };

  return (
    <div className="card-product flex flex-col justify-between items-center border-1 rounded-md bg-white shadow-md hover:shadow-xl">
      <Link to={`/producto/${producto.cod_producto}`} className="h-[200px] w-full">
        <img
          src={producto.imagen} // Usar la URL real de la imagen del producto
          alt={`Imagen de ${producto.nombre_producto}`}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="p-2 flex flex-col flex-grow w-full">
        <h3 className="mb-1 text-lg font-bold">{producto.nombre_producto}</h3>
        <p className="text-gray-700 mb-4">{producto.descripcion}</p>
        <p className="text-gray-900 font-bold mb-2">Precio: ${producto.precio_producto}</p>
        <p className="text-gray-600 mb-4">Stock: {producto.stock_producto}</p>
        {/* Botón con ancho igual al de la tarjeta */}
        <button
          className="card-button bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-600 w-full"
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </button>
      </div>

    </div>
  );
}

CardProducts.propTypes = {
  producto: PropTypes.object.isRequired,
};

export default CardProducts;
