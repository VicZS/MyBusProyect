// Inicialización del mapa
let map = L.map('mi_mapa').setView([19.00432,-98.20308], 19);

L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
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
        const polyline = L.polyline(coordenadasCamino, { color: 'yellow',opacity: 0.4, weight: 5 }).addTo(map);

        // Define el icono personalizado
        const busStopIcon = L.icon({
            iconUrl: './img/pin_parada_bus.png',
            iconSize: [60, 60], // tamaño del icono
            iconAnchor: [30, 45], // punto de anclaje del icono, correspondiente a su base
            popupAnchor: [0, -38] // punto donde se abrirá el popup con respecto al icono
        });

        // Iterar sobre las paradas
        const paradas = rutaData.Paradas;
        Object.keys(paradas).forEach((key) => {
            const paradaData = paradas[key];
            const coordenadas = paradaData.coordenadas.split(",");
            const latitud = parseFloat(coordenadas[1].trim()).toFixed(7);
            const longitud = parseFloat(coordenadas[0].trim()).toFixed(7);
            const nombre = paradaData.nombre;
            const numeroParada = paradaData.numparada;

            const marker = L.marker([latitud, longitud], { icon: busStopIcon }).addTo(map);
            marker.bindPopup(`<b>${nombre}</b><br>Número de Parada: ${numeroParada}`).openPopup();
        });
    }).catch((error) => {
        console.error("Error al acceder a la base de datos de Firebase:", error);
    });
}

//---Mostrar Ubicacion Actual---

// Función para manejar la respuesta de la geolocalización
function onLocationFound(e) {

    //calcula el radio de presicion
    var radius = e.accuracy / 2;

    // Define el icono personalizado
    const myPosicionIcon = L.icon({
        iconUrl: './img/miPosicionIcon.png',
        iconSize: [60, 60], // tamaño del icono
        iconAnchor: [30, 45], // punto de anclaje del icono, correspondiente a su base
        popupAnchor: [0, -38] // punto donde se abrirá el popup con respecto al icono
    });

    L.marker(e.latlng,{ icon: myPosicionIcon }).addTo(map)
        .bindPopup("Ten encuentras cerca de este punto").openPopup();

    //Agregar el radio en la posicion actual
    //L.circle(e.latlng, radius).addTo(map);
    
    // Mostrar la latitud y longitud en la consola
    //console.log("Latitud:", e.latlng.lat);
    //console.log("Longitud:", e.latlng.lng);

    //centra el mapa en la posicion actual
    map.setView(e.latlng);
}

// Función para manejar errores de geolocalización
function onLocationError(e) {
    alert(e.message);
}

// Configurar opciones de geolocalización
var geoOptions = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
};

// Solicitar la ubicación del usuario
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
map.locate(geoOptions);



function paradaCercana(rutaUtilizarSeleccionada, lugar) {
    return new Promise((resolve, reject) => {
        const rutaUtilizarRef = database.ref('Rutas/' + rutaUtilizarSeleccionada);

        rutaUtilizarRef.once('value').then((snapshot) => {
            const rutaData = snapshot.val();

            let paradaMasCercana = null;
            let distanciaMinima = Infinity;

            // Iterar sobre las paradas
            const paradas = rutaData.Paradas;
            Object.keys(paradas).forEach((key) => {
                const paradaData = paradas[key];
                const coordenadas = paradaData.coordenadas.split(",");
                const latitud = parseFloat(coordenadas[1].trim());
                const longitud = parseFloat(coordenadas[0].trim());
                const nombre = paradaData.nombre;
                const numeroParada = paradaData.numparada;

                const distancia = calcularDistancia([latitud, longitud], lugar);

                // Si la distancia es menor que la distancia mínima registrada hasta ahora,
                // actualiza la parada más cercana y la distancia mínima.
                if (distancia < distanciaMinima) {
                    distanciaMinima = distancia;
                    paradaMasCercana = {
                        nombre: nombre,
                        coordenadas: [latitud, longitud]
                    };
                }
            });

            if (paradaMasCercana) {
                resolve(paradaMasCercana);
            } else {
                reject("No se encontraron paradas.");
            }

        }).catch((error) => {
            reject("Error al acceder a la base de datos de Firebase: " + error);
        });
    });
}

// Definir una función para crear y mostrar la ruta
function mostrarRuta(origen, destino) {
    // Crear la ruta
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(origen), // Origen
            L.latLng(destino) // Destino
        ],
        lineOptions: {
            styles: [{ color: 'purple', opacity: 0.6, weight: 4 }]
        },
        show: false, // No mostrar la ruta por defecto
        createMarker: function(i, waypoint, number) {
            // Personalizar los marcadores de inicio y fin de la ruta
            if (number === 0) {
                // Origen
                return L.marker(waypoint.latLng, { icon: myPosicionIcon, draggable: true });
            } else if (number === 1) {
                // Destino
                return L.marker(waypoint.latLng, { icon: busStopIcon, draggable: true });
            }
        }
    }).addTo(map);
}

function limpiarRutas() {
    // Limpiar el control de enrutamiento existente, si lo hay
    const routingContainer = document.querySelector('.leaflet-routing-container');
    if (routingContainer) {
        routingContainer.parentNode.removeChild(routingContainer);
        routingControl = null; // Restablecer la variable a null
    }

    // Limpiar todos los marcadores y capas (incluidos los controles)
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    // Volver a añadir la capa base después de limpiar todo
    L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(map);
}

function obtenerUbicacionActual() {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitud = position.coords.latitude;
                    const longitud = position.coords.longitude;
                    resolve([latitud, longitud]);
                },
                (error) => {
                    reject("Error al obtener la ubicación: " + error.message);
                }
            );
        } else {
            reject("La geolocalización no está disponible en este navegador.");
        }
    });
}



async function irLugar() {
    var listaDeLugares = document.getElementById("listaDeLugares");
    var rutaUtilizar = document.getElementById("rutaUtilizar");
    var lugarSeleccionado = listaDeLugares.value;
    var rutaUtilizarSeleccionada = rutaUtilizar.value;
    

    limpiarRutas();

    if (lugarSeleccionado != "na" && rutaUtilizarSeleccionada != "na") {
        const lugaresRef = database.ref('Lugares/' + lugarSeleccionado);

        lugaresRef.once('value').then(async (snapshot) => {
            const lugarData = snapshot.val();
            let coordenadasLugar = lugarData.coordenadas;
            let nombreLugar = lugarData.nombre;

            var lugarOrigen = await obtenerUbicacionActual();

            let coordenadasSeparadas = coordenadasLugar.split(', ');
            let coordenadasInvertidas = coordenadasSeparadas.reverse().join(', ');

            let [latitud, longitud] = coordenadasInvertidas.split(',').map(coord => parseFloat(coord));
            var LugarDestino = [latitud, longitud];

            const markerDestino = await paradaCercana(rutaUtilizarSeleccionada, LugarDestino);
            const markerOrigen = await paradaCercana(rutaUtilizarSeleccionada, lugarOrigen);

            //icono mi posicion
            const myPosicionIcon = L.icon({
                iconUrl: './img/miPosicionIcon.png',
                iconSize: [60, 60], // tamaño del icono
                iconAnchor: [30, 45], // punto de anclaje del icono, correspondiente a su base
                popupAnchor: [0, -38] // punto donde se abrirá el popup con respecto al icono
            });

            //icono mi posicion
            const busStopIcon = L.icon({
                iconUrl: './img/pin_parada_bus.png',
                iconSize: [60, 60], // tamaño del icono
                iconAnchor: [30, 45], // punto de anclaje del icono, correspondiente a su base
                popupAnchor: [0, -38] // punto donde se abrirá el popup con respecto al icono
            });

            //icono mi posicion
            const destinoIcon = L.icon({
                iconUrl: './img/destinoIcon.png',
                iconSize: [60, 60], // tamaño del icono
                iconAnchor: [30, 45], // punto de anclaje del icono, correspondiente a su base
                popupAnchor: [0, -38] // punto donde se abrirá el popup con respecto al icono
            });

            // Crear marcadores para la parada cercana al origen y al destino
            const markerOrigenObj = L.marker(markerOrigen.coordenadas,{ icon: busStopIcon }).addTo(map);
            markerOrigenObj.bindPopup(`<b>Parada:</b><br>${markerOrigen.nombre}`).openPopup();

            const markerDestinoObj = L.marker(markerDestino.coordenadas,{ icon: busStopIcon }).addTo(map);
            markerDestinoObj.bindPopup(`<b>Parada:</b><br>${markerDestino.nombre}`).openPopup();

            //Crear marcadores de origen y destino
            const puntoOrigen = L.marker(lugarOrigen,{ icon: myPosicionIcon }).addTo(map);
            puntoOrigen.bindPopup(`<b>Lugar de origen</b>`).openPopup();

            const puntoDestino = L.marker(LugarDestino,{ icon: destinoIcon }).addTo(map);
            puntoDestino.bindPopup(`<b>Lugar de destino: ${nombreLugar}</b>`).openPopup();

            // Mostrar la ruta desde el punto de origen a la parada más cercana al destino
            mostrarRuta(lugarOrigen, markerOrigenObj.getLatLng());

            // Mostrar la ruta desde la parada más cercana al destino al destino
            mostrarRuta(markerDestinoObj.getLatLng(), LugarDestino);

        }).catch((error) => {
            console.error("Error al acceder a la base de datos de Firebase:", error);
        });
    } else {
        alert("Se necesita seleccionar el lugar y/o la ruta a utilizar");
    }
}
// Asigna el evento onclick al botón
document.getElementById("irLugar").onclick = irLugar;

// Función para calcular la distancia entre dos puntos geográficos en coordenadas latitud/longitud
function calcularDistancia(coordenadas1, coordenadas2) {
    const [lat1, lon1] = coordenadas1;
    const [lat2, lon2] = coordenadas2;
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180; // Convertir a radianes
    const dLon = (lon2 - lon1) * Math.PI / 180; // Convertir a radianes
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distancia en kilómetros
    return distancia;
}

/*--------------V1 de la funcion irLugar----------------

function irLugar() {
    // Obtener el elemento select
    var listaDeLugares = document.getElementById("listaDeLugares");

    var rutaUtilizar = document.getElementById("rutaUtilizar");
    
    // Obtener el valor seleccionado
    var lugarSeleccionado = listaDeLugares.value;
    var rutaUtilizarSeleccionada = rutaUtilizar.value;
    
    // Imprimir el lugar seleccionado en la consola
    console.log("Lugar seleccionado:", lugarSeleccionado);
    console.log("Ruta seleccionada:", rutaUtilizarSeleccionada);

    var lugarOrigen = [18.99515358259309, -98.20061997535299];

    if(lugarSeleccionado != "na" && rutaUtilizarSeleccionada != "na"){
        // Acceso a la base de datos de Firebase para la ruta especificada
    const lugaresRef = database.ref('Lugares/' + lugarSeleccionado);
    
    lugaresRef.once('value').then((snapshot) => {
        const lugarData = snapshot.val();
        let coordenadasLugar = lugarData.coordenadas;
        let nombreLugar = lugarData.nombre;

        //console.log(coordenadasLugar);

        // Separar las coordenadas en longitud y latitud
        let coordenadasSeparadas = coordenadasLugar.split(', ');

        // Invertir las corregidas
        let coordenadasInvertidas = coordenadasSeparadas.reverse().join(', ');

        console.log(coordenadasInvertidas);

        // Obtener las coordenadas invertidas como números
        let [latitud, longitud] = coordenadasInvertidas.split(',').map(coord => parseFloat(coord));

        var LugarDestino = [latitud, longitud];

        // Crear un marcador en las coordenadas invertidas
        const marker = L.marker(LugarDestino).addTo(map);
        marker.bindPopup(`<b>${nombreLugar}</b>`).openPopup();
        
        console.log("parada cercada al origen");
        var paradaCercanaAlOrigen = paradaCercana(rutaUtilizarSeleccionada, lugarOrigen);

        console.log("parada cercada al destino");
        var paradaCercanaAlDestino = paradaCercana(rutaUtilizarSeleccionada, LugarDestino);
        
    }).catch((error) => {
        console.error("Error al acceder a la base de datos de Firebase:", error);
    });
    }
    else{
        alert("Se necesita seleccionar el lugar y/o la ruta a utilizar");
    }
    
}

*/


/*------------ V1 de la funcion paradaCercana----------- 
function paradaCercana(rutaUtilizarSeleccionada, lugar) {
    const rutaUtilizarRef = database.ref('Rutas/' + rutaUtilizarSeleccionada);

    rutaUtilizarRef.once('value').then((snapshot) => {
        const rutaData = snapshot.val();

        let paradaMasCercana = null;
        let distanciaMinima = Infinity;

        // Iterar sobre las paradas
        const paradas = rutaData.Paradas;
        Object.keys(paradas).forEach((key) => {
            const paradaData = paradas[key];
            const coordenadas = paradaData.coordenadas.split(",");
            const latitud = parseFloat(coordenadas[1].trim());
            const longitud = parseFloat(coordenadas[0].trim());
            const nombre = paradaData.nombre;
            const numeroParada = paradaData.numparada;

            const distancia = calcularDistancia([latitud, longitud], lugar);
            
            // Si la distancia es menor que la distancia mínima registrada hasta ahora,
            // actualiza la parada más cercana y la distancia mínima.
            if (distancia < distanciaMinima) {
                distanciaMinima = distancia;
                paradaMasCercana = {
                    nombre: nombre,
                    coordenadas: [latitud, longitud]
                };
            }
        });

        if (paradaMasCercana) {
            console.log("Parada más cercana:");
            console.log("Nombre:", paradaMasCercana.nombre);
            console.log("Coordenadas:", paradaMasCercana.coordenadas);
        } else {
            console.log("No se encontraron paradas.");
        }

    }).catch((error) => {
        console.error("Error al acceder a la base de datos de Firebase:", error);
    });
}

*/
