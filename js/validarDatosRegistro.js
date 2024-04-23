function validarFormulario() {
    // Obtener referencias a los elementos del formulario y al contenedor del mensaje de error
    const telefonoInput = document.querySelector('.style_inputs input[type="number"]');
    const passwordInput = document.querySelector('.style_inputs input[type="password"]');
    const contenedorErrores = document.querySelector('.warning p');

    // Limpiar cualquier mensaje de error existente
    contenedorErrores.textContent = '';

    // Lógica de validación
    let hayErrores = false;

    // Comprobar si el número de teléfono está vacío
    if (telefonoInput.value === '') {
        hayErrores = true;
        contenedorErrores.textContent += 'Debes ingresar tu número de teléfono.\n';
    }

    if (telefonoInput.value.length != 10) {
        hayErrores = true;
        contenedorErrores.textContent += 'Número de teléfono no válido, debe tener 10 dígitos.\n';
    }

    // Comprobar si la contraseña está vacía o tiene menos de 8 caracteres
    if (passwordInput.value === '' || passwordInput.value.length < 8) {
        hayErrores = true;
        contenedorErrores.textContent += 'La contraseña debe tener al menos 8 caracteres.\n';
    }

    // Evitar el envío del formulario si hay errores
    if (hayErrores) {
        return false; // Evitar el comportamiento predeterminado de envío del formulario
    }

    // Si no hay errores, permitir el envío del formulario
    return true;
}

// Agregar escuchador de eventos al evento submit del formulario
const formulario = document.querySelector('form');
formulario.addEventListener('submit', function (event) {
    if (!validarFormulario()) {
        event.preventDefault(); // Evitar el envío del formulario si la validación falla
    }
});
