import { fetchCityInfo, fetchWeather, fetchCountry, fetchCountryList, fetchCountryBorder, fetchCities, fetchWikipedia } from './api.js';



document.addEventListener('DOMContentLoaded', () => {
//create modal for cities 
const cityModalEl = document.getElementById('cityModal');
const cityModal   = bootstrap.Modal.getOrCreateInstance(cityModalEl);
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
    

    // Marker to show user location
    L.marker([lat, lng]).addTo(map).bindPopup('You are here').openPopup();

     // Zoom the map 
    map.setView([lat, lng], 6);

    // Call PHP to convert lat/lng → country code
    fetchCountry(lat, lng)
      .then(function (response) {
            const countryCode = response.countryCode;
            

            // Set dropdown value and trigger change event
            $('#countryDropdown').val(countryCode).trigger('change');
            
            getCities(countryCode);
          })
      .catch(err => console.error('Could not determine country from location:', err));
        
  },
  function (error) {
    console.error('Geolocation error:', error);

    const lat = 40.0;
    const lng = -3.7;

    L.marker([lat, lng]).addTo(map).bindPopup('Default location (Spain)').openPopup();

    map.setView([lat, lng], 6);

  fetchCountry(lat, lng)
    .then(function (response) {
          const countryCode = response.countryCode;
          

          // Set dropdown value and trigger change event
          $('#countryDropdown').val(countryCode).trigger('change');
          
          getCities(countryCode);
        })
    .catch(err => console.error('Could not determine country from location:', err));
      
  }

);

// Hide loader after map is fully ready 
map.whenReady(() => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500); // removes it smoothly after fading out
  }
});



// ------------ Populate dropdown 
// 1. Grab the dropdown element 
const dropdown = document.getElementById('countryDropdown');

// 2. Ask the server for the country list 
fetchCountryList()
  .then(function (list) {
    list.forEach(function ({ code, name }) {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = name;
      $('#countryDropdown').append(option);
    });
  })

  .catch(err => console.error('Could not load countries:', err));
 


// ------------ Change map when the selected country changes 

let borderLayer;   // keep a reference so we can remove/replace it
let cityClusterLayer = null; 

$('#countryDropdown').on('change', function () {
  const code = $(this).val();          // e.g. "ES"
  if (!code) return;

  
fetchCountryBorder(code)
  .then(function (feature) {
      // remove previous border if it exists
      if (borderLayer) map.removeLayer(borderLayer);

      // draw new border
      borderLayer = L.geoJSON(feature, {
        style: { color: 'red', weight: 2 }
      }).addTo(map);

      // zoom so the whole country fits
      map.fitBounds(borderLayer.getBounds());
      getCities(code);
    })

  .catch(err => console.error('Could not load border for', code, err));
});


// ------------ Make a request to getCities and add cities to map
function getCities(countryCode){
  fetchCities(countryCode)
    .then(function (response) {
      if (cityClusterLayer) {
        map.removeLayer(cityClusterLayer);
        cityClusterLayer = null;
      }
      const cities = response.geonames;
      const clusters = L.markerClusterGroup();

      cities.forEach(city => {
        const lat = parseFloat(city.lat);
        const lng = parseFloat(city.lng);
        const cityName = city.toponymName || city.name; 

        const marker = L.marker([lat, lng]);
        clusters.addLayer(marker)
        
        // When the user clicks the marker ➜ open the modal
      marker.on('click', () => loadCityInfo({ lat, lng, name: cityName }));
        
      });
    map.addLayer(clusters)
    map.fitBounds(clusters.getBounds());
    cityClusterLayer = clusters;
    })
    
    .catch(err => console.error('Could not load cities:', err));
};

// ------------ Open a modal with the city info and weather info

function loadCityInfo({ lat, lng, name }) {
  // Show modal immediately with a placeholder
  $('#cityModalLabel').text(`Loading ${name}…`);
  $('#cityModalBody').html('<em>Fetching data…</em>');
  cityModal.show();

  fetchCityInfo(lat, lng).then(function(cityData) {
    
      if (cityData.status === 'error') {
        $('#cityModalBody').html(`<strong>${cityData.message}</strong>`);
        return;
      } 

      $('#cityModalLabel').text(cityData.name);
      
      let cityHTML = `
        <ul class="list-unstyled mb-2">
          <li><strong>Country Code:</strong> ${cityData.code}</li>
          <li><strong>Population:</strong> ${Number(cityData.population).toLocaleString()}</li>
        </ul>
      `;

      fetchWeather(lat, lng).then(function(weatherData) {
        let weatherHTML =
            weatherData.status === 'ok'
              ? `
                <hr>
                <div class="weather">
                  <img src="https://openweathermap.org/img/wn/${weatherData.icon}@2x.png" alt="weather icon">
                  <div><strong>${(+weatherData.temp).toFixed(1)} °C</strong></div>
                  <div>${weatherData.weather}</div>
                </div>
              `
              : '<p><em>Weather unavailable.</em></p>';

          $('#cityModalBody').html(cityHTML + weatherHTML);
      }).catch(function () {
        $('#cityModalBody').html(cityHTML + '<p><em>Weather unavailable.</em></p>');
      });

        fetchWikipedia(name)
          .then(function(wikiData) {
            if (wikiData.status === 'ok') {
              const wikiHTML = `
                <hr>
                <div class="wikipedia">
                  <strong>Wikipedia:</strong>
                  <p>${wikiData.summary}</p>
                  <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(name)}" target="_blank">Read more</a>
                </div>
              `;
              $('#cityModalBody').append(wikiHTML);
            } else {
              $('#cityModalBody').append('<p><em>No Wikipedia summary available.</em></p>');
            }
          })
          .catch(() => {
            $('#cityModalBody').append('<p><em>Wikipedia info unavailable.</em></p>');
          });

  }).catch(function () {
    $('#cityModalBody').html('<strong>Server error—try again.</strong>');
  });

   
}  

}); //DOM closing tags 
