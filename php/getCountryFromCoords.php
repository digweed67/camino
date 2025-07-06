<?php
header('Content-Type: application/json');

$lat = $_POST['lat'] ?? null;
$lng = $_POST['lng'] ?? null;

if (!$lat || !$lng) {
    http_response_code(400);    
    echo json_encode(['error' => 'Missing coordinates']);
    exit;
}

require_once 'config.php';
$apiKey = OPENCAGE_API_KEY;


$url = "https://api.opencagedata.com/geocode/v1/json?q={$lat}+{$lng}&key={$apiKey}";

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
]);

$response = curl_exec($curl);
if ($response === false){
    http_response_code(500);// Internal Server Error
    $err = curl_error($curl);
    curl_close($curl);
    exit(json_encode(['status' => 'error', 'msg' => $err]));
}
curl_close($curl);

$data = json_decode($response, true);

if (isset($data['results'][0]['components']['country_code'])) {
    $countryCode = strtoupper($data['results'][0]['components']['country_code']);
    echo json_encode(['countryCode' => $countryCode]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Country not found']);
}
