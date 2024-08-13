import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProductosPage from "./pages/ProductosPage";
import PrepagoPage from "./pages/PrepagoPage";
import ExitoPage from "./pages/ExitoPage";
import PerfilUsuarioPage from "./pages/PerfilUsuarioPage";
import VistaProducto from "./pages/VistaProducto";
import AgregarProductoPage from "./pages/AgregarProductoPage";
import ListarProductosPage from "./pages/ListarProductosPage";
import NotFound from "./components/NotFound";
import Verpedidos from "./pages/verpedidos";
import AdministarUsuario from "./pages/AdministarUsuario";
import AdministrarProducto from "./pages/AdministrarProducto";
import HistorialPedidosPage from "./pages/HistorialPedidosPage";
import PrivateRoute from "./components/PrivateRoute";
import EsperaVerificacion from "./pages/EsperaVerificacion";
import Mensajeria from "./pages/Mensajeria";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verificar" element={<EsperaVerificacion />} />
      <Route path="/productos" element={<ProductosPage />} />
      <Route path="/prepago" element={<PrepagoPage />} />
      <Route path="/producto/:id" element={<VistaProducto />} />

      {/*ESTAS 3 RUTAS ME GUSTARIA PROTEGERLAS, PARA QUE NINGUN USUARIO QUE NO ESTE
      AUTENTICADO PUEDA ACCEDER A ELLAS*/}
      <Route
        path="/exito"
        element={
          <PrivateRoute>
            <ExitoPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/historial-pedidos"
        element={
          <PrivateRoute>
            <HistorialPedidosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <PerfilUsuarioPage />
          </PrivateRoute>
        }
      />

      {/* Rutas para el usuario con is_staff */}
      {user && user.is_staff && (
        <>
          <Route
            path="/agregar-producto"
            element={
              <PrivateRoute>
                <AgregarProductoPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/listar-productos"
            element={
              <PrivateRoute>
                <ListarProductosPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/pedidos"
            element={
              <PrivateRoute>
                <Verpedidos />
              </PrivateRoute>
            }
          />
          <Route
            path="/administrar-usuario"
            element={
              <PrivateRoute>
                <AdministarUsuario />
              </PrivateRoute>
            }
          />
          <Route
            path="/administrar-productos"
            element={
              <PrivateRoute>
                <AdministrarProducto />
              </PrivateRoute>
            }
          />
          <Route
            path="/mensajeria"
            element={
              <PrivateRoute>
                <Mensajeria />
              </PrivateRoute>
            }
          />
        </>
      )}
    </Routes>
  );
}

export default App;
