<?php
$rows = App\Models\Place::select('city_id')
    ->selectRaw('count(*) as total')
    ->groupBy('city_id')
    ->get();
foreach ($rows as $r) {
    $city = App\Models\City::find($r->city_id);
    echo ($city ? $city->name : 'NULL') . ': ' . $r->total . "\n";
}
echo "\nTotal: " . App\Models\Place::count() . "\n";
