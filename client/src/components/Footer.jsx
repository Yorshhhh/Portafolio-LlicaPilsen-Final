function Footer() {
  return (
    <footer className="site-footer footer">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm">&copy; Derechos Reservados LlicaPilsen</p>
        <div className="text-sm">
          <p className="mb-1">
            <i className="fa fa-envelope-o mr-2"></i> 
            <a href="mailto:estudiante@info.com" className="text-blue-500">llicapilsen@gmail.com</a>
          </p>
          <p>
            <i className="fa fa-phone mr-2"></i>
            Para más información llame al número +569840892
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
