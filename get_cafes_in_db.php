<?php
$cafes = App\Models\Place::whereHas('category', function($q) {
    $q->where('slug', 'ca-phe');
})->get();

foreach ($cafes as $cafe) {
    echo $cafe->name . ' | Lat: ' . $cafe->latitude . ' | Lng: ' . $cafe->longitude . ' | URL: ' . $cafe->google_maps_url . "\n";
}
