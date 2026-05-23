<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;

class FetchApifyPlaces extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'apify:fetch-places {--url= : The Apify dataset URL} {--query= : The search query (e.g. "quán cafe Vĩnh Long")} {--location= : The location query (e.g. "Vĩnh Long, Vietnam")} {--limit=10 : Max crawled places}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch places from Google Maps using Apify API and save to database/data/places_raw.json';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $actorId = config('services.apify.actor_id') ?? env('APIFY_ACTOR_ID', 'your-actor-id');
        $token = config('services.apify.token') ?? env('APIFY_TOKEN', 'YOUR_TOKEN');

        $datasetUrl = $this->option('url');

        if ($datasetUrl) {
            $this->info("Fetching dataset directly from URL...");
            $response = Http::get($datasetUrl);
        } else {
            if ($actorId === 'your-actor-id' || $token === 'YOUR_TOKEN') {
                $this->warn('Please set APIFY_ACTOR_ID and APIFY_TOKEN in your .env file');
            }

            $apiUrl = "https://api.apify.com/v2/acts/{$actorId}/run-sync-get-dataset-items?token={$token}";

            $searchQuery = $this->option('query') ?? "quán cafe Vĩnh Long";
            $locationQuery = $this->option('location') ?? "Vĩnh Long, Vietnam";
            $limit = (int) $this->option('limit');

            $this->info("Fetching places from Apify for query: '{$searchQuery}' in '{$locationQuery}' (limit: {$limit})...");

            $response = Http::post($apiUrl, [
                'searchStringsArray' => [$searchQuery],
                'locationQuery' => $locationQuery,
                'maxCrawledPlacesPerSearch' => $limit,
            ]);
        }

        if ($response->failed()) {
            $this->error('Failed to fetch data from Apify: ' . $response->body());
            return Command::FAILURE;
        }

        $data = $response->json();

        if (empty($data)) {
            $this->warn('No data returned from Apify.');
            return Command::SUCCESS;
        }

        $this->info('Successfully fetched ' . count($data) . ' places.');

        $dataPath = database_path('data/places_raw.json');
        
        $existingData = [];
        if (File::exists($dataPath)) {
            $existingData = json_decode(File::get($dataPath), true) ?? [];
        }

        $mergedData = array_merge($existingData, $data);
        
        // Optionally remove duplicates by URL or title
        $uniqueData = collect($mergedData)->unique(function ($item) {
            return $item['url'] ?? $item['title'] ?? uniqid();
        })->values()->toArray();

        File::put($dataPath, json_encode($uniqueData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $this->info("Saved to {$dataPath}. Total unique places: " . count($uniqueData));
        $this->info('You can now run "php artisan db:seed --class=GooglePlacesSeeder" to import them into the database.');

        return Command::SUCCESS;
    }
}
