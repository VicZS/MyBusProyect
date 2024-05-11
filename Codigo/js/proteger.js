// Verifica si hay un UID guardado en sessionStorage
const uid = sessionStorage.getItem('uid');

// Si no hay un UID guardado, muestra una alerta y redirige a la página de inicio
if (!uid) {
    alert("Necesitas iniciar sesión para acceder a esta página.");
    window.location.href = "./index.html";
}
