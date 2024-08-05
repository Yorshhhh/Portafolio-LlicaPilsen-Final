function validarRegistro() {
    var nombre = document.getElementById('nombre').value;
    var apellido = document.getElementById('apellido').value;

    if (nombre == "" || apellido == "") {
        alert("Por favor, complete todos los campos.");
        return false;
    }

    return true;
}