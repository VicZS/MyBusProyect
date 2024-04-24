
// Inicialización del mapa
let map = L.map('mi_mapa').setView([19.00432,-98.20308], 19);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Inicialización de Firebase
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

const database = firebase.database();
document.getElementById("boton_buscar").addEventListener("click", buscarRuta);

// Variable para almacenar la referencia al control de enrutamiento
let routingControl = null;

function buscarRuta() {
    const nombreRutaPasado = document.getElementById("input_ruta").value;
    var nombreRuta = nombreRutaPasado.replace(/\s+/g, '').toLowerCase();
    if (nombreRuta.trim() === "") {
        alert("Por favor ingrese un nombre de ruta.");
        return;
    }

    // Limpiar el control de enrutamiento existente, si lo hay
    if (routingControl !== null) {
        map.removeControl(routingControl);
    }

    // Limpiar marcadores y rutas existentes
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });

    // Acceso a la base de datos de Firebase para la ruta especificada
    const paradasRef = database.ref('Paradas/' + nombreRuta);
    
    paradasRef.once('value').then((snapshot) => {
        const coordenadas = [];
        snapshot.forEach((childSnapshot) => {
            const paradaData = childSnapshot.val();
            const latitud = paradaData.latitud;
            const longitud = paradaData.longitud;
            const nombre = paradaData.nombre;

            coordenadas.push([parseFloat(latitud).toFixed(7), parseFloat(longitud).toFixed(7)]);

            console.log(paradaData);
            console.log(latitud);

            L.marker([parseFloat(latitud).toFixed(7), parseFloat(longitud).toFixed(7)]).addTo(map).bindPopup(nombre);
        });

        // Agregar la ruta
        if (coordenadas.length > 1) {
            routingControl = L.Routing.control({
                waypoints: coordenadas.map(coord => L.latLng(coord[0], coord[1])),
                routeWhileDragging: true,
                show: false,
                showInstructions: false,
                routeDrag: false,
                addWaypoints: false,
                createMarker: function(i, waypoint, n) { // Función para crear marcadores
                    return L.marker(waypoint.latLng, {
                        draggable: false, // Deshabilitar el arrastre de marcadores
                        icon: L.icon({ // Icono personalizado para los marcadores
                            iconUrl: '../img/punto-final.png',
                            iconSize: [1, 1],
                            iconAnchor: [1, 1],
                            popupAnchor: [0, -32]
                        }),
                        waypointIndex: i // Índice del marcador en la lista de waypoints
                    });
                },
                lineOptions: {
                    styles: [{ color: 'blue', opacity: 0.4, weight: 5 }]
                }
            }).addTo(map);
        } else {
            console.error("No hay suficientes coordenadas para trazar la ruta.");
        }
    }).catch((error) => {
        console.error("Error al acceder a la base de datos de Firebase:", error);
    });
}