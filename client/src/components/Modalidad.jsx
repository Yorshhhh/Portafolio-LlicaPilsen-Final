import React from 'react';
import ambarImage from '../img/Ambar-x24.png';
import stoutImage from '../img/Stout-x24.png';



function Modalidad() {
  return (
    <section className="modalidad">
      <div className="container mx-auto">
        <div className="row">
          <div className="mt-lg-5 mb-lg-0 mb-4 col-lg-5 col-md-10 mx-auto col-12">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Somos LlicaPilsen, aquí encontrarás nuestras mejores cervezas artesanales!
            </h2>
            <p className="text-white">
              Llica Pilsen comenzó como un pequeño proyecto entre amigos, con mucho esfuerzo y entusiasmo les ofrecemos nuestras exquisitas cervezas artesanales cuyo sabor estamos muy orgullosos.
            </p>
            <p className="text-white">
              Puedes consultar en nuestro correo{" "}
              <a href="mailto:llicapilsen@gmail.com" className="text-blue-300">
                llicapilsen@gmail.com
              </a>
              , nuestro personal te contactará en la brevedad posible.
            </p>
          </div>

          <div className="col-lg-3 col-md-6 col-12 mx-auto">
            <div className="team-thumb">
              <img
                src={ambarImage}
                className="img-fluid rounded-lg shadow-md"
                alt="Pack de Cervezas"
              />
              <div className="team-info text-center mt-4">
                <h3 className="text-xl font-semibold text-white">Cerveza Cuello negro Ambar</h3>
                <span className="text-gray-400">Pack de 24 cervezas</span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 col-12 mx-auto mt-5 mt-md-0">
            <div className="team-thumb">
              <img
                src={stoutImage}
                className="img-fluid rounded-lg shadow-md"
                alt="Cerveza Ribereña"
              />
              <div className="team-info text-center mt-4">
                <h3 className="text-xl font-semibold text-white">Cerveza Cuello negro Stout</h3>
                <span className="text-gray-400">Pack de 24 cervezas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Modalidad;
