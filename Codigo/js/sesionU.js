// Obtén el UID del cliente guardado en sessionStorage
const uid = sessionStorage.getItem('uid');
const email = sessionStorage.getItem('email');

const userName = document.getElementById('NombreUsuario');
const NumTel = document.getElementById('NumTelefono');

if (uid) {
    // Si se encuentra el UID en sessionStorage, muestra una alerta con el UID
    //alert("UID del cliente guardado: " + uid);
    
} else {
    // Si no se encuentra el UID en sessionStorage, muestra un mensaje indicando que no se encontró el UID
    window.location.href = "./index.html";
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




  // Configura tu app Firebase
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


// Referencia a la colección "Usuarios"
var usuariosRef = firebase.database().ref('Usuarios');


// ID del documento que deseas obtener
var idDocumento = uid;

// Obtener el objeto del documento
usuariosRef.child(idDocumento).once('value', function (snapshot) {
    // Verificar si el documento existe
    if (snapshot.exists()) {
        // El documento existe, obtener su contenido
        var objetoUsuario = snapshot.val();
        //console.log("Objeto del usuario:", objetoUsuario);
        //Cambia el nombre de usuario para hacerlo mas personalizado
        if(objetoUsuario.nombre){
            userName.textContent = objetoUsuario.nombre;
        }
        
        if (objetoUsuario.numTelefono) {
            //si el usuario ha registrado su numero lo muestra
            NumTel.textContent = "+52 " + objetoUsuario.numTelefono;
        }else{
            //en caso contrario mostrar el email que usa para iniciar sesion
            NumTel.textContent = email;
        }
        
    } else {
        console.log("El documento no existe.");
    }
}, function (error) {
    console.error("Error al obtener el documento:", error);
});
