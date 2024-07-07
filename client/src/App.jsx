import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProductosPage from "./pages/ProductosPage";
import PrepagoPage from "./pages/PrepagoPage";
import ExitoPage from "./pages/ExitoPage";
import PerfilUsuarioPage from "./pages/PerfilUsuarioPage";
import VistaProducto from "./pages/VistaProducto";
import AgregarProductoPage from "./pages/AgregarProductoPage";
import ListarProductosPage from './pages/ListarProductosPage'; // Importar el nuevo componente
import NotFound from './components/NotFound';
import Verpedidos from './pages/verpedidos';
import AdministarUsuario from './pages/AdministarUsuario';
import AdministrarProducto from './pages/AdministrarProducto';
import HistorialPedidosPage from "./pages/HistorialPedidosPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/productos" element={<ProductosPage />} />
      <Route path="/prepago" element={<PrepagoPage />} />
      <Route path="/exito" element={<ExitoPage />} />
      <Route path="/perfil" element={<PerfilUsuarioPage />} />
      <Route path="/producto/:id" element={<VistaProducto />} />
      <Route path="/agregar-producto" element={<AgregarProductoPage />} />
      <Route path="/listar-productos" element={<ListarProductosPage/>} />
      <Route path="*" element={<NotFound />} />
      <Route path="/pedidos" element={<Verpedidos/>}/>
      <Route path="/administrar-usuario" element={<AdministarUsuario/>}/>
      <Route path="/administrar-productos" element={<AdministrarProducto/>}/>
      <Route path="/historial-pedidos" element={<HistorialPedidosPage/>}/>
    </Routes>
  );
}  
export default App;
