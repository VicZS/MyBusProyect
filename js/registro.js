// Configura tu objeto de configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCPYtYz9VJbA_IWgmDm-xo5T5iV9ZWc57w",
    authDomain: "proyectomodelados.firebaseapp.com",
    databaseURL: "https://proyectomodelados-default-rtdb.firebaseio.com",
    projectId: "proyectomodelados",
    storageBucket: "proyectomodelados.appspot.com",
    messagingSenderId: "1080640133390",
    appId: "1:1080640133390:web:6c704868576d19e4e35f5f",
    measurementId: "G-B602XD07CB"
  };

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Referencia al formulario y al mensaje de error
const form = document.getElementById('formularioRegistro');
const errorMsg = document.getElementById('msgError');

// Agrega un evento de escucha para el envío del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    if (password.length < 8) {
        errorMsg.textContent = "La contraseña debe tener al menos 8 caracteres.";
        return; // Detiene la ejecución de la función
    }

    try {
        // Verifica si el correo electrónico ya está registrado
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        console.log(userCredential);
        // Si se crea el usuario correctamente, puedes redirigirlo a otra página o mostrar un mensaje de éxito
        window.location.href = "../exito.html";
    } catch (error) {
        // Maneja el error, por ejemplo, si el correo electrónico ya está en uso
        console.error(error.message);
        if(error.message == "The email address is already in use by another account."){
            errorMsg.textContent = "Correo actualmente utilizado";
        }else{
            if(error.message == "Password should be at least 6 characters"){
                errorMsg.textContent = "Contraseña no valida";
            }else{
                errorMsg.textContent = error.message;
            }
        } 
    }
});
