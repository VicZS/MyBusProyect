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

firebase.initializeApp(firebaseConfig);

// Referencia al formulario y al mensaje de error
const form = document.getElementById('formularioInicioSesion');
const errorMsg = document.getElementById('msgError');

// Agrega un evento de escucha para el envío del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    try {
        // Intenta iniciar sesión con el correo electrónico y la contraseña proporcionados
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        // Si el usuario se autentica correctamente
        const user = userCredential.user;
        // Guarda el UID del cliente en sessionStorage
        sessionStorage.setItem('uid', user.uid);
        sessionStorage.setItem('email', email);
        // Puedes redirigirlo a otra página si lo deseas
        window.location.href = "../Menu.html";
    } catch (error) {
        // Maneja el error, mostrando un mensaje adecuado según el tipo de error
        console.error(error);
        errorMsg.textContent = "El correo electrónico no está registrado o La contraseña es incorrecta. Por favor, intenta de nuevo.";
    }
});
