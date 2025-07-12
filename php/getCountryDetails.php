<?php
header('Content-Type: application/json');

if (!isset($_POST['code'])) {
  echo json_encode(['status' => 'error', 'message' => 'No country code provided']);
  exit;
}

$code = strtoupper(trim($_POST['code']));
$url = "https://restcountries.com/v3.1/alpha/$code";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
  echo json_encode(['status' => 'error', 'message' => 'Request error']);
  curl_close($ch);
  exit;
}

curl_close($ch);

$data = json_decode($response, true);

if (!is_array($data) || !isset($data[0])) {
  echo json_encode(['status' => 'error', 'message' => 'Invalid country data']);
  exit;
}

echo json_encode(['status' => 'success', 'data' => $data[0]]);
