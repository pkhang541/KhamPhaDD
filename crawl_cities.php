<?php
/**
 * Crawl top 10 places for each city stored in the `cities` table using Apify.
 *
 * Usage: php crawl_cities.php
 *
 * The script will:
 *   1. Load all city names from the DB (App\Models\City).
 *   2. For each city, call the Apify Google Maps scraper (actor: compass/crawler-google-places)
 *      with a simple query: "địa điểm tham quan nổi bật ở <city>".
 *   3. Limit the result to 10 places per city.
 *   4. Merge the new data with the existing `places_raw.json` file, removing duplicates
 *      based on the `url` field.
 *   5. Save the merged data back to `database/data/places_raw.json`.
 *
 * After running this script, execute the seeder to import the data into the `places` table:
 *   php artisan db:seed --class=GooglePlacesSeeder
 *   php artisan cache:clear
 */

require __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;
use App\Models\City;

// Load Laravel environment (bootstrap) – adjust path if needed
$app = require __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$actorId = env('APIFY_ACTOR_ID');
$token   = env('APIFY_TOKEN');

if (!$actorId || !$token) {
    echo "Missing Apify credentials (APIFY_ACTOR_ID / APIFY_TOKEN).\n";
    exit(1);
}

$cities = City::pluck('name')->unique()->toArray();
if (empty($cities)) {
    echo "No cities found in the database.\n";
    exit(0);
}

$allNewPlaces = [];
$apiUrl = "https://api.apify.com/v2/acts/{$actorId}/run-sync-get-dataset-items?token={$token}";

foreach ($cities as $city) {
    $query = "địa điểm tham quan nổi bật ở {$city}";
    echo "Fetching top 10 places for city: {$city}\n";

    $response = Http::post($apiUrl, [
        'searchStringsArray' => [$query],
        'locationQuery'      => $city,
        'maxCrawledPlacesPerSearch' => 10,
    ]);

    if ($response->failed()) {
        echo "  → Failed: " . $response->body() . "\n";
        continue;
    }

    $data = $response->json();
    if (!empty($data)) {
        $allNewPlaces = array_merge($allNewPlaces, $data);
        echo "  → Retrieved " . count($data) . " places.\n";
    } else {
        echo "  → No places returned.\n";
    }
}

if (empty($allNewPlaces)) {
    echo "No new places collected. Exiting.\n";
    exit(0);
}

// Load existing raw data (if any)
$rawPath = database_path('data/places_raw.json');
$existing = [];
if (File::exists($rawPath)) {
    $existing = json_decode(File::get($rawPath), true) ?? [];
}

$merged = array_merge($existing, $allNewPlaces);
// Remove duplicates based on the 'url' field (fallback to title)
$unique = collect($merged)->unique(function ($item) {
    return $item['url'] ?? $item['title'] ?? md5(json_encode($item));
})->values()->toArray();

File::put($rawPath, json_encode($unique, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "\nFinished. Saved " . count($unique) . " unique places to {$rawPath}.\n";
?>
