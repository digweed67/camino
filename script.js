document.addEventListener('DOMContentLoaded', () => {
  // 1. Create the map and keep in variable
  const map = L.map('map');         

  // 2. Add a tile layer 
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  
navigator.geolocation.getCurrentPosition(
  function (position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    console.log('User location:', lat, lng);

    // Optional: marker to show user location
    L.marker([lat, lng]).addTo(map).bindPopup('You are here').openPopup();

     // Zoom the map here (just to confirm if map works at all)
    map.setView([lat, lng], 6);

    // Call PHP to convert lat/lng → country code
    $.ajax({
      url: 'php/getCountryFromCoords.php',
      method: 'POST',
      data: { lat: lat, lng: lng },
      dataType: 'json',
      success: function (response) {
        const countryCode = response.countryCode;
        console.log('User is in country:', countryCode);

        // Set dropdown value and trigger change event
        $('#countryDropdown').val(countryCode).trigger('change');
      },
      error: function (xhr, status, err) {
        console.error('Could not determine country from location:', err);
      }
    });
  },
  function (error) {
    console.error('Geolocation error:', error);
  }
);



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

let borderLayer;   // keep a reference so we can remove/replace it

$('#countryDropdown').on('change', function () {
  const code = $(this).val();          // e.g. "ES"
  if (!code) return;

  $.ajax({
    url: 'php/getCountryBorder.php',
    method: 'POST',
    data: { code },
    dataType: 'json',
    success: function (feature) {
      // remove previous border if it exists
      if (borderLayer) map.removeLayer(borderLayer);

      // draw new border
      borderLayer = L.geoJSON(feature, {
        style: { color: 'red', weight: 2 }
      }).addTo(map);

      // zoom so the whole country fits
      map.fitBounds(borderLayer.getBounds());
    },
    error: function () {
      console.error('Could not load border for', code);
    }
  });
});



});
