function Modalidad() {
  return (
    <>
      <section className="about section" id="modalidad">
        <div className="container">
          <div className="row">
            <div className="mt-lg-5 mb-lg-0 mb-4 col-lg-5 col-md-10 mx-auto col-12">
              <h2 className="mb-4" data-aos="fade-up" data-aos-delay="300">
                Somos LlicaPilsen, aquí encontrarás nuestras mejores cervezas artesanales!{" "}
              </h2>

              <p data-aos="fade-up" data-aos-delay="400">
                {" "}
                Llica Pilsen comenzó como un pequeño proyecto entre amigos
                juntos con mucho esfuerzo y entusiasmo les ofrecemos nuestras exquisitas cervezas artesanales
                cuyo sabor estamos muy orgullosos.
                {" "}
              </p>

              <p data-aos="fade-up" data-aos-delay="500">
                Puedes consultar en nuestro correo{" "}
                <a rel="nofollow" href="" target="_parent">
                  llicapilsen@gmail.com
                </a>
                , nuestro personal{" "}
                <a
                  rel="nofollow"
                  href="https://www.tooplate.com/contact"
                  target="_parent"
                >
                  contactara
                </a>{" "}
                en la brevedad posible.
              </p>
            </div>

            <div
              className="ml-lg-auto col-lg-3 col-md-6 col-12"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <div className="team-thumb">
                <img
                  src="pack_cervezas.png"
                  className="img-fluid"
                  alt="Perrito"
                />

                <div className="team-info d-flex flex-column">
                  <h3>Cerveza Piqueña</h3>
                  <span>Pack de 6 cervezas</span>

                  <ul className="social-icon mt-3"></ul>
                </div>
              </div>
            </div>

            <div
              className="mr-lg-auto mt-5 mt-lg-0 mt-md-0 col-lg-3 col-md-6 col-12"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <div className="team-thumb">
                <img
                  src="SLIDER_13-10-20_SABORES.png"
                  className="img-fluid"
                  alt="Perrito"
                />

                <div className="team-info d-flex flex-column">
                  <h3>Cerveza Ribereña</h3>
                  <span>Pack de 6 cervezas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Modalidad;
