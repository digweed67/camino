

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