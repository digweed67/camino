document.addEventListener('DOMContentLoaded', () => {

// 1. Create the map and set the initial view
const map = L.map('map').setView([42.8782, -8.5448], 14); 

// 2. Add a tile layer (base map) from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);


document.getElementById('loader').style.display = 'none';

// 1. Grab the dropdown element 
const dropdown = document.getElementById('countryDropdown');

// 2. Ask the server for the country list 
$.ajax({
  url: 'php/getCountryList.php',
  method: 'GET',
  dataType: 'json',
  success: function (list) {
    list.forEach(function ({ code, name }) {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = name;
      $('#countryDropdown').append(option);
    });
  },
  error: function (xhr, status, err) {
    console.error('Could not load countries:', err);
  }
});


});
