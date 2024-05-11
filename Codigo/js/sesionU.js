// Obtén el UID del cliente guardado en sessionStorage
const uid = sessionStorage.getItem('uid');

if (uid) {
    // Si se encuentra el UID en sessionStorage, muestra una alerta con el UID
    //alert("UID del cliente guardado: " + uid);
} else {
    // Si no se encuentra el UID en sessionStorage, muestra un mensaje indicando que no se encontró el UID
    alert("No se encontró el UID del cliente guardado.");
}

// Obtén el botón para cerrar sesión
const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');

// Agrega un evento de clic al botón para cerrar sesión
cerrarSesionBtn.addEventListener('click', () => {
    // Elimina el UID del cliente de sessionStorage al cerrar sesión
    sessionStorage.removeItem('uid');
    // Redirecciona a la página de inicio (index.html), o a la página que desees
    window.location.href = "./index.html";
});
