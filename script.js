document.addEventListener('DOMContentLoaded', () => {
// ------------ Show the map 
  // 1. Create the map and keep in variable
  const map = L.map('map');         

  // 2. Add a tile layer 
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

// ------------ Get current position of user and fallback if no location access
navigator.geolocation.getCurrentPosition(
  function (position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    console.log('User location:', lat, lng);

    // Marker to show user location
    L.marker([lat, lng]).addTo(map).bindPopup('You are here').openPopup();

     // Zoom the map 
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

    const lat = 40.0;
    const lng = -3.7;

    L.marker([lat, lng]).addTo(map).bindPopup('Default location (Spain)').openPopup();

    map.setView([lat, lng], 6);

    $.ajax({
      url: 'php/getCountryFromCoords.php',
      method: 'POST',
      data: { lat: lat, lng: lng },
      dataType: 'json',
      success: function (response) {
        const countryCode = response.countryCode;
        console.log('Fallback country:', countryCode);

        // Set dropdown value and trigger change event
        $('#countryDropdown').val(countryCode).trigger('change');
      },
      error: function (xhr, status, err) {
        console.error('Could not determine country from fallback coords:', err);
      }
    });
  }
);



document.getElementById('loader').style.display = 'none';
// ------------ Populate dropdown 
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


// ------------ Change map when the selected country changes 

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
