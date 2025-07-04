<?php
header('Content-Type: application/json');

// 1. Get the country code from POST
$countryCode = $_POST['countryCode'] ?? '';

if (empty($countryCode)) {
    echo json_encode(['status' => 'error', 'message' => 'No country code provided']);
    exit;
}

// 2. Prepare GeoNames API URL

$url = "http://api.geonames.org/searchJSON?country=$countryCode&featureClass=P&maxRows=10&username=amaia";

// 3. Fetch the data
$response = file_get_contents($url);

// 4. Return the API response directly
if ($response !== false) {
    echo $response;
} else {
    echo json_encode(['status' => 'error', 'message' => 'GeoNames request failed']);
}
?>
