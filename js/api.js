

export function fetchCityInfo(lat, lng) {
  return $.ajax({
    url: 'php/getCityInfo.php',
    method: 'POST',
    data: { lat, lng },
    dataType: 'json'
  });
}


export function fetchWeather(lat, lon) {  
  return $.ajax({
    url: 'php/getWeather.php',
    method: 'POST',
    data: { lat, lon },
    dataType: 'json'
  });
}