
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
    const rutaRef = database.ref('Rutas/' + nombreRuta);
    
    rutaRef.once('value').then((snapshot) => {
        const rutaData = snapshot.val();
        let coordenadasCamino = rutaData.Camino;

        // Corregir las coordenadas del camino (intercambiar longitud y latitud)
        coordenadasCamino = coordenadasCamino.map(coord => [coord[1], coord[0]]);

        // Trazar la línea del camino
        const polyline = L.polyline(coordenadasCamino, { color: 'blue' }).addTo(map);

        // Iterar sobre las paradas
        const paradas = rutaData.Paradas;
        Object.keys(paradas).forEach((key) => {
            const paradaData = paradas[key];
            const coordenadas = paradaData.coordenadas.split(",");
            const latitud = parseFloat(coordenadas[1].trim()).toFixed(7);
            const longitud = parseFloat(coordenadas[0].trim()).toFixed(7);
            const nombre = paradaData.nombre;
            const numeroParada = paradaData.numparada;

            const marker = L.marker([latitud, longitud]).addTo(map);
            marker.bindPopup(`<b>${nombre}</b><br>Número de Parada: ${numeroParada}`).openPopup();
        });
    }).catch((error) => {
        console.error("Error al acceder a la base de datos de Firebase:", error);
    });
}


