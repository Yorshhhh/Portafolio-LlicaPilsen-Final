import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer"
import Navbar from  "../components/Navbar"
function LoginPage() {
  //REALIZAR METODO POST AL ENVIAR EL FORMULARIO PARA LOGEARSE
  return (
    <>
    <Navbar/>
    <div>
      <LoginForm />
    </div>
      <Footer/>
    </>
  );
}

export default LoginPage;
