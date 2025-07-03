<?php
header('Content-Type: application/json');

$lat = $_POST['lat'] ?? null;
$lng = $_POST['lng'] ?? null;

if (!$lat || !$lng) {
    echo json_encode(['error' => 'Missing coordinates']);
    exit;
}

$apiKey = '8e9bb7715e604f6a968c9f4a2d7d7b4a'; 

$url = "https://api.opencagedata.com/geocode/v1/json?q={$lat}+{$lng}&key={$apiKey}";

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec($curl);
curl_close($curl);

$data = json_decode($response, true);

if (isset($data['results'][0]['components']['country_code'])) {
    $countryCode = strtoupper($data['results'][0]['components']['country_code']);
    echo json_encode(['countryCode' => $countryCode]);
} else {
    echo json_encode(['error' => 'Country not found']);
}
