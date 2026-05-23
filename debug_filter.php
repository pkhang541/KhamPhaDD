<?php
// Debug city filter
$cityId = '5';
$places = App\Models\Place::whereIn('city_id', ['5'])->count();
echo "Places with city_id=5: $places\n";

// All categories
$cats = App\Models\Place::with('category', 'city')
    ->where('city_id', 5)
    ->whereIn('category_id', [3, 9]) // Adjust these IDs as needed
    ->count();
echo "Filtered count: $cats\n";

// Check actual category IDs
$categoryIds = App\Models\Category::all()->pluck('id', 'name');
print_r($categoryIds->toArray());

// How many places per city?
$cityCounts = App\Models\Place::select('city_id')->selectRaw('count(*) as total')->groupBy('city_id')->with('city')->get();
foreach ($cityCounts as $row) {
    echo ($row->city->name ?? 'null') . ": " . $row->total . "\n";
}
