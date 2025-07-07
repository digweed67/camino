<?php
header('Content-Type: application/json');

$lat = $_POST['lat'] ?? null;
$lon = $_POST['lon'] ?? null;

if (!$lat || !$lon) {
    http_response_code(400);    
    echo json_encode(['error' => 'Missing coordinates']);
    exit;
}

require_once 'config.php';
$apiKey = OPENWEATHER_API_KEY;


$url = "https://api.openweathermap.org/data/2.5/weather?lat={$lat}&lon={$lon}&appid={$apiKey}&units=metric";

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
]);

$response = curl_exec($curl);
if ($response === false){
    http_response_code(500);
    $err = curl_error($curl);
    curl_close($curl);
    exit(json_encode(['status' => 'error', 'msg' => $err]));
}
curl_close($curl);

$data = json_decode($response, true);
$weather = $data['weather'][0] ?? null;
$temp = $data['main'] ?? null; 
$weatherIcon = $data['weather'][0]['icon'] ?? null; 

// 6. check if response is valid 
if (!$weather) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Weather not found']);
    exit;
}
if (!$temp) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Temperature not found']);
    exit;
}



// 7. If response is valid, extract data
echo json_encode([
  'status' => 'ok',
  'weather' => $weather['description'] ?? '',
  'temp' => $temp['temp'] ?? 0,
  'icon' => $weatherIcon,
  
]);
