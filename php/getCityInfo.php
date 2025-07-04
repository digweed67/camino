<?php
header('Content-Type: application/json');

// 1. Get latitude and longitude from POST
$lat = $_POST['lat'] ?? '';
$lng = $_POST['lng'] ?? '';


if (!($lat) || !($lng)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing coordinates']);
    exit;
}

// 2. Build the GeoNames URL for findNearbyPlaceNameJSON using lat/lng

$url = "http://api.geonames.org/findNearbyPlaceNameJSON?lat=$lat&lng=$lng&username=amaia";

// 3. Initialize cURL and set options
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true
]);

// 4. Execute cURL and close it
$response = curl_exec($curl);
curl_close($curl);

// 5. Decode the JSON response
$data = json_decode($response, true);
$city = $data['geonames'][0] ?? null;

// 6. check if response is valid 
if (!$city) {
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
