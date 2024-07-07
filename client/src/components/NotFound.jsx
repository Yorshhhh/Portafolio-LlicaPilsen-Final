import Navbar from "../components/Navbar";

function NotFound() {
  return (
    <>
      <Navbar />
      <hr />
      <hr />
      <hr />
      <hr />
      <div className="center-container">
        <img
          src="cruz-roja.png"
          alt=""
          style={{ width: "30%", height: "auto" }}
        />
        <h1>Pagina no encontrada!</h1>
        <p>La pagina que estas buscando no existe</p>
      </div>
    </>
  );
}

export default NotFound;
