// const map = L.map('map').setView([51.505, -0.09], 13);

// L.tileLayer(
//   'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
//   {
//     maxZoom: 19,
//     attribution: '&copy; OpenStreetMap contributors'
//   }
// ).addTo(map);



// const map = L.map('map').setView(
//    [coordinates[1], coordinates[0]],
//    13
// );

// L.tileLayer(
//    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
//    {
//       maxZoom: 19,
//       attribution: '&copy; OpenStreetMap contributors'
//    }
// ).addTo(map);

// L.marker([coordinates[1], coordinates[0]])
//    .addTo(map);

const mapDiv = document.getElementById("map");

const coordinates = JSON.parse(
    mapDiv.dataset.coordinates
);

const map = L.map('map').setView(
    [coordinates[1], coordinates[0]],
    13
);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }
).addTo(map);

L.marker([coordinates[1], coordinates[0]])
.addTo(map);