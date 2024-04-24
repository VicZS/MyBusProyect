
function validarContraseña(pass){
    if(pass.value === '' || pass.value.length < 8){
        return false;
    }
    return true;
}

function validateForm() {
    // Get references to form elements and error message container
    const email = document.querySelector('.style_inputs input[type="email"]');
    const pass = document.querySelector('.style_inputs input[type="password"]');
    const MsgError = document.querySelector('.warning p');

    // Clear any existing error messages
    MsgError.textContent = '';

    // Validation logic
    let hasErrors = false;

    // Check if phone number is empty
    if (email.value === '') {
        hasErrors = true;
        MsgError.textContent += 'Debes ingresar tu email.\n';
    }

    if(!validarContraseña(pass)){
        hasErrors = true;
        MsgError.textContent += 'La contraseña debe tener al menos 8 caracteres.\n';
    }

    // Prevent form submission if there are errors
    if (hasErrors) {
        return false; // Prevent default form submission behavior
    }

    // If no errors, allow form submission
    return true;
}

// Add event listener to the form's submit event
const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    if (!validateForm()) {
        event.preventDefault(); // Prevent form submission if validation fails
    }
});
