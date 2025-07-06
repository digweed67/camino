<?php
header('Content-Type: application/json');

// 1. Get the country code from POST
$countryCode = $_POST['countryCode'] ?? '';

if (empty($countryCode)) {
    http_response_code(400); // Bad Request - missing input
    echo json_encode(['status' => 'error', 'message' => 'No country code provided']);
    exit;
}

// 2. Prepare GeoNames API URL

$url = "http://api.geonames.org/searchJSON?country=$countryCode&featureClass=P&maxRows=10&username=amaia";

// 3. Initialise cURL
$ch = curl_init($url);
curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, 
        CURLOPT_TIMEOUT => 8,
]);

// 4. Execute and handle errors
$response = curl_exec($ch);
if ($response === false){
    http_response_code(500);// Internal Server Error
    $err = curl_error($ch);
    curl_close($ch);
    exit(json_encode(['status' => 'error', 'msg' => $err]));
}
curl_close($ch);

// 5. Decode and return 
$data = json_decode($response, true);
// if the key doesn't exist or is empty 
if (!isset($data['geonames']) || empty($data['geonames'])) {
    http_response_code(404); // No results found
    echo json_encode(['status'=>'error','msg'=>'No cities found']);
    exit;
}

echo json_encode($data);
?>
