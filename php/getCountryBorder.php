<?php
// Return one country's GeoJSON by ISO-A2 code (e.g. ES)

header('Content-Type: application/json');

$code = strtoupper($_POST['code'] ?? '');

if (!$code) {
  http_response_code(400);
  echo json_encode(['status' => 'error', 'msg' => 'Missing code']);
  exit;
}

// your countries file -- adjust the path if needed
$geoFile = __DIR__ . '/../data/countryBorders.geo.json';
$all = json_decode(file_get_contents($geoFile), true);

foreach ($all['features'] as $feature) {
  if (strtoupper($feature['properties']['iso_a2']) === $code) {
    echo json_encode($feature);        // send **one** feature back
    exit;
  }
}

http_response_code(404);
echo json_encode(['status' => 'error', 'msg' => 'Country not found']);


?>