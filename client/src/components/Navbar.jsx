import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useCart } from "../context/CarritoContext";
import Carrito from "./Carrito";
import UserCard from "./UserCard";

function Navbar() {
  const {
    cartItems,
    removeFromCart,
    clearCartHandler,
    toggleCart,
    showCart,
    setShowCart,
  } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("usuario");
    if (userJson) {
      try {
        setUser(JSON.parse(userJson));
      } catch (error) {
        console.error("Usuario no se encuentra autenticado: ", error);
      }
    }
    setLoading(false);
  }, []);

  const history = useNavigate();

  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("carrito");
    setUser(null);
    history("/");
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleProfileMenu = () => {
    setProfileMenuVisible(!profileMenuVisible);
  };

  return (
    <nav className="bg-gray-800 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={menuVisible}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <NavLink to="/home" className="text-white text-lg font-bold">
                Llica Pilsen
              </NavLink>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <NavLink
                  to="/productos"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Tienda
                </NavLink>
                {loading ? (
                  <div className="loader">Cargando...</div>
                ) : (
                  !user && (
                    <>
                      <NavLink
                        to="/register"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Registrarse
                      </NavLink>
                      <NavLink
                        to="/login"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Ingresar
                      </NavLink>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div>
              <Carrito
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                toggleCart={toggleCart}
                showCart={showCart}
                setShowCart={setShowCart}
                clearCart={clearCartHandler}
              />
            </div>

            {user && (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded={profileMenuVisible}
                    aria-haspopup="true"
                    onClick={toggleProfileMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://img.icons8.com/ios/50/000000/user.png"
                      alt="Profile"
                    />
                  </button>
                </div>

                {profileMenuVisible && (
                  <div
                    className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <h2 className="text-black">
                      Bienvenido {user.nombres} {user.apellidos}
                    </h2>
                    <NavLink
                      to="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-0"
                    >
                      Ir al perfil
                    </NavLink>

                    {user.is_staff ? (
                      <div>
                        <NavLink
                          to="/pedidos"
                          className="block px-4 py-2 text-sm text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="user-menu-item-0"
                        >
                          Administrar Pedidos
                        </NavLink>

                        <NavLink
                          to="/administrar-usuario"
                          className="block px-4 py-2 text-sm text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="user-menu-item-0"
                        >
                          Administrar Usuario
                        </NavLink>

                        <NavLink
                          to="/administrar-productos"
                          className="block px-4 py-2 text-sm text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="user-menu-item-0"
                        >
                          Administrar Productos
                        </NavLink>
                      </div>
                    ) : (
                      <div>
                        <NavLink
                          to="/historial-pedidos"
                          className="block px-4 py-2 text-sm text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="user-menu-item-0"
                        >
                          Ver historial pedidos
                        </NavLink>
                      </div>
                    )}

                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                      onClick={logout}
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {menuVisible && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <NavLink
              to="/productos"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Tienda
            </NavLink>
            {loading ? (
              <div className="loader">Cargando...</div>
            ) : (
              !user && (
                <>
                  <NavLink
                    to="/register"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Registrarse
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Ingresar
                  </NavLink>
                </>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
