const uid = sessionStorage.getItem('uid');

//Protege la pagina para que no se pueda acceder sin estar logeado
if (!uid) {
    alert("Necesitas iniciar sesión para acceder a esta página.");
    window.location.href = "./index.html";
}

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

// Función para actualizar el nombre de usuario
function actualizarNombreUsuario() {
    const nuevoNombre = document.getElementById('NombreUsuario').value.trim();
    if (nuevoNombre !== '') { // Verificar si el nuevo nombre no está vacío
        // Actualizar el nombre de usuario en la base de datos Firebase
        firebase.database().ref('Usuarios/' + uid).update({ nombre: nuevoNombre })
            .then(() => {
                console.log('Nombre de usuario actualizado correctamente');
                // Puedes agregar aquí cualquier lógica adicional después de actualizar el nombre
            })
            .catch(error => {
                console.error('Error al actualizar el nombre de usuario:', error);
            });
    } else {
        console.error('El nuevo nombre de usuario no puede estar vacío');
    }
}

