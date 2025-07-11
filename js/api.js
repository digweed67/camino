

export function fetchCityInfo(lat, lng) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'php/getCityInfo.php',
      method: 'POST',
      data: { lat, lng },
      dataType: 'json',
      success: resolve,
      error: reject
    });
  });
}



export function fetchWeather(lat, lon) {  
  return new Promise((resolve, reject) => {
    $.ajax({
    url: 'php/getWeather.php',
    method: 'POST',
    data: { lat, lon },
    dataType: 'json',
    success: resolve,
    error: reject
    });
  });
}

export function fetchCountry (lat, lng) {  
  return new Promise((resolve, reject) => {
    $.ajax({
    url: 'php/getCountryFromCoords.php',
    method: 'POST',
    data: { lat, lng },
    dataType: 'json',
    success: resolve,
    error: reject
    });
  });
}

export function fetchCountryList () {  
  return new Promise((resolve, reject) => {
    $.ajax({
    url: 'php/getCountryList.php',
    method: 'GET',
    dataType: 'json',
    success: resolve,
    error: reject
    });
  });
}

export function fetchCountryBorder (code) {  
  return new Promise((resolve, reject) => {
    $.ajax({
    url: 'php/getCountryBorder.php',
    method: 'POST',
    data: { code },
    dataType: 'json',
    success: resolve,
    error: reject
    });
  });
}

export function fetchCities (countryCode) {  
  return new Promise((resolve, reject) => {
    $.ajax({
    url: 'php/getCities.php',
    method: 'POST',
    data: { countryCode },
    dataType: 'json',
    success: resolve,
    error: reject
    });
  });
}