import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { CartProvider } from "./context/CarritoContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
