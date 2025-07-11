<?php
header('Content-Type: application/json');

$name = $_POST['name'] ?? '';

if (!$name) {
  echo json_encode(['status' => 'error', 'message' => 'Missing city name']);
  exit;
}

$name = urlencode($name);
$url = "https://en.wikipedia.org/api/rest_v1/page/summary/$name";

$ch = curl_init();
curl_setopt_array($ch, [
  CURLOPT_URL => $url,
  CURLOPT_RETURNTRANSFER => true,
  
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if (isset($data['extract'])) {
  echo json_encode(['status' => 'ok', 'summary' => $data['extract']]);
} else {
  echo json_encode(['status' => 'error', 'message' => 'No summary found']);
}
