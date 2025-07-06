<?php
header('Content-Type: application/json');

// 1. Get latitude and longitude from POST
$lat = $_POST['lat'] ?? '';
$lng = $_POST['lng'] ?? '';


if (!($lat) || !($lng)) {
    http_response_code(400); 
    echo json_encode(['status' => 'error', 'message' => 'Missing coordinates']);
    exit;
}

// 2. Build the GeoNames URL for findNearbyPlaceNameJSON using lat/lng

$url = "http://api.geonames.org/findNearbyPlaceNameJSON?lat=$lat&lng=$lng&username=amaia";

// 3. Initialize cURL and set options
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
]);

// 4. Execute cURL and close it
$response = curl_exec($curl);
if($response === false){
    http_response_code(500);
    $err = curl_error($curl);
    curl_close($curl);
    echo json_encode(['status'=>'error','message'=>$err]);
    exit;

}
curl_close($curl);

// 5. Decode the JSON response
$data = json_decode($response, true);
$city = $data['geonames'][0] ?? null;

// 6. check if response is valid 
if (!$city) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'City not found']);
    exit;
}

// 7. If response is valid, extract: city name, country code, population
echo json_encode([
  'status' => 'ok',
  'name' => $city['name'] ?? $city['toponymName'] ?? 'Unknown',
  'code' => $city['countryCode'] ?? '',
  'population' => $city['population'] ?? 0
]);

?>
