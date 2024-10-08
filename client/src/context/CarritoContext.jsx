import { createContext, useContext, useState, useEffect } from "react";
import useLocalStorage from '../hooks/useLocalStorage'
import { toast } from 'react-toastify'; // Importar Toast
import axios from "axios";


const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "Para utilizar useCart debe estar incluido dentro del provider!"
    );
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useLocalStorage("carrito", [])
  const [cartVisible, setCartVisible] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [products, setProducts] = useState([])


  const getProducts = async () => {
    await axios.get("http://127.0.0.1:8000/productos/")
    .then((response) => {
      setProducts(response.data)
    })
   
  }

  const addToCart = (producto, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.cod_producto === producto.cod_producto);
      if (existingItem) {
        return prevItems.map(item =>
          item.cod_producto === producto.cod_producto
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...producto, quantity }];
      }
    });
  };

  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("carrito"));
    if (!savedCartItems) {
      console.log("no hay objetos en el context");
    } else {
      console.log("si hay objetos en el context");
      setCartItems(savedCartItems);
    }
  }, []);

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(
      (producto) => producto.cod_producto !== itemId
    );
    setCartItems(updatedCart);
    localStorage.setItem("carrito", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    setShowCart(false);
    localStorage.removeItem("carrito");
  };

  const toggleCart = () => {
    setCartVisible(!cartVisible);
  };

  const calculateTotal = () => {
    const totalProductos = cartItems.reduce(
      (sum, producto) => sum + producto.precio_producto * producto.quantity,
      0
    );
    return totalProductos; // Sumar el costo de entrega al total de productos
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        toggleCart,
        showCart,
        setShowCart,
        calculateTotal,
        deliveryCost,
        setDeliveryCost,
        products,
        getProducts
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
