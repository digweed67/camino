<?php

header('Content-Type: application/json');

// 1. Load the GeoJSON file
$filename = '../data/countryBorders.geo.json';
//2. read the file and return as a JSON string (built-in method)
$data = file_get_contents($filename);

// 3. Decode JSON into a PHP array (true = turn into array)
$geojson = json_decode($data, true);

//4. Create an emtpy array to hold only the data we want 
$countryList = [];

// 5. Loop through the entire array of JSON and select only the data we need 
foreach($geojson['features'] as $feature){
        $props = $feature['properties'];
    $countryList[] = [
         'code' => $props['iso_a2'],
         'name' => $props['name']
    ];
   
}

echo json_encode($countryList); 


?> 