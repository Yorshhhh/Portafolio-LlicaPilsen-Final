import React from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar";
import { useCart } from "../context/CarritoContext";

function Layout({ children }) {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart,
    showCart,
    setShowCart,
    clearCartHandler,
  } = useCart();
  Layout.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return (
    <div className="relative">
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        toggleCart={toggleCart}
        showCart={showCart}
        setShowCart={setShowCart}
        clearCartHandler={clearCartHandler}
      />
      {children}
    </div>
  );
}

export default Layout;
