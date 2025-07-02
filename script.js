// 1. Create the map and set the initial view
const map = L.map('map').setView([42.8782, -8.5448], 14); 

// 2. Add a tile layer (base map) from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);


document.getElementById('loader').style.display = 'none';
