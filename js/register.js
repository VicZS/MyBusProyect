// Importar las funciones necesarias desde Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Configurar Firebase
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const registerForm = document.getElementById("registerForm");

// Event listener para el envío del formulario
registerForm.addEventListener("submit", async e => {
  e.preventDefault();
  const email = registerForm.email.value;
  const password = registerForm.password.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Usuario registrado:", userCredential.user);
    alert("¡Registro exitoso! Por favor inicia sesión con tu cuenta.");
    registerForm.reset();
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    alert("Error al registrar usuario. Por favor intenta nuevamente.");
  }
});
