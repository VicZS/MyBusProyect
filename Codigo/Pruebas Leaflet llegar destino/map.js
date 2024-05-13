//Coordeanadas de defecto

var latitud = 17.8438791
var longitud = -94.6915679

//Crea el mapa
var map = L.map('map').setView([19.0011094,-98.1996078], 17);

//Agrega la capa de google maps para que se vea como si fuera google maps
googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

googleStreets.addTo(map);

//---Mostrar Ubicacion Actual---

// Función para manejar la respuesta de la geolocalización
function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("Estás dentro de " + radius + " metros de este punto").openPopup();

    L.circle(e.latlng, radius).addTo(map);
    // Mostrar la latitud y longitud en la consola
    console.log("Latitud:", e.latlng.lat);
    console.log("Longitud:", e.latlng.lng);

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

