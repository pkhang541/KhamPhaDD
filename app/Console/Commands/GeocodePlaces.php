<?php

namespace App\Console\Commands;

use App\Models\Place;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class GeocodePlaces extends Command
{
    protected $signature = 'places:geocode
        {--limit=25 : Maximum number of places to process}
        {--ids= : Comma-separated place IDs to process}
        {--force : Re-geocode places even when coordinates already look valid}
        {--dry-run : Show results without updating the database}
        {--sleep=1.2 : Seconds to wait between requests}
        {--country=Vietnam : Country name appended to search queries}';

    protected $description = 'Fill missing or invalid place coordinates using the free Nominatim geocoder.';

    public function handle(): int
    {
        $limit = max(1, (int) $this->option('limit'));
        $sleepSeconds = max(1.0, (float) $this->option('sleep'));
        $ids = $this->parseIds((string) $this->option('ids'));
        $force = (bool) $this->option('force');
        $dryRun = (bool) $this->option('dry-run');
        $country = trim((string) $this->option('country')) ?: 'Vietnam';

        $places = Place::query()
            ->with('city:id,name')
            ->when(!empty($ids), fn ($query) => $query->whereIn('id', $ids))
            ->when(empty($ids) && !$force, function ($query) {
                $query->where(function ($query) {
                    $query
                        ->whereNull('latitude')
                        ->orWhereNull('longitude')
                        ->orWhere('latitude', 0)
                        ->orWhere('longitude', 0)
                        ->orWhere('latitude', '<', 8)
                        ->orWhere('latitude', '>', 24)
                        ->orWhere('longitude', '<', 102)
                        ->orWhere('longitude', '>', 110);
                });
            })
            ->orderBy('id')
            ->limit($limit)
            ->get();

        if ($places->isEmpty()) {
            $this->info('No places matched the geocoding criteria.');
            return self::SUCCESS;
        }

        $this->info(sprintf(
            'Processing %d place(s)%s.',
            $places->count(),
            $dryRun ? ' in dry-run mode' : ''
        ));

        $updated = 0;
        $failed = 0;

        foreach ($places as $index => $place) {
            $this->line(sprintf('[%d/%d] #%d %s', $index + 1, $places->count(), $place->id, $place->name));

            $result = $this->geocodePlace($place, $country, $sleepSeconds);

            if (!$result) {
                $failed++;
                $this->warn('No coordinate found.');
                continue;
            }

            $this->line(sprintf(
                'Found: %s, %s - %s',
                $result['latitude'],
                $result['longitude'],
                $result['display_name']
            ));

            if (!$dryRun) {
                $place->forceFill([
                    'latitude' => $result['latitude'],
                    'longitude' => $result['longitude'],
                ])->save();
            }

            $updated++;
            $this->sleep($sleepSeconds);
        }

        $this->info(sprintf(
            '%s %d place(s). Failed: %d.',
            $dryRun ? 'Matched coordinates for' : 'Updated',
            $updated,
            $failed
        ));

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }

    private function parseIds(string $value): array
    {
        if (trim($value) === '') {
            return [];
        }

        return collect(explode(',', $value))
            ->map(fn (string $id) => (int) trim($id))
            ->filter(fn (int $id) => $id > 0)
            ->unique()
            ->values()
            ->all();
    }

    private function geocodePlace(Place $place, string $country, float $sleepSeconds): ?array
    {
        $coordinatesFromUrl = $this->extractCoordinatesFromUrl((string) $place->google_maps_url);

        if ($coordinatesFromUrl) {
            $this->line('Found coordinates in Google Maps URL.');
            return $coordinatesFromUrl;
        }

        foreach ($this->buildSearchQueries($place, $country) as $query) {
            $this->line('Query: ' . $query);

            $result = $this->geocode($query);

            if ($result) {
                return $result;
            }

            $this->sleep($sleepSeconds);
        }

        return null;
    }

    private function buildSearchQueries(Place $place, string $country): array
    {
        $city = $place->city?->name;

        $candidates = [
            [$place->name, $place->address, $city, $country],
            [$place->address, $city, $country],
            [$place->name, $city, $country],
            [$place->name, $country],
        ];

        return collect($candidates)
            ->map(function (array $parts) {
                return collect($parts)
                    ->filter(fn ($part) => is_string($part) && trim($part) !== '')
                    ->map(fn (string $part) => trim($part))
                    ->unique()
                    ->implode(', ');
            })
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    private function geocode(string $query): ?array
    {
        $response = Http::acceptJson()
            ->withHeaders([
                'User-Agent' => config('app.name', 'KhamPhaDD') . '/1.0 local-geocoder',
                'Accept-Language' => 'vi,en',
            ])
            ->timeout(15)
            ->retry(2, 1000)
            ->get('https://nominatim.openstreetmap.org/search', [
                'q' => $query,
                'format' => 'jsonv2',
                'limit' => 1,
                'countrycodes' => 'vn',
                'addressdetails' => 1,
            ]);

        if (!$response->ok()) {
            $this->warn('Geocoder returned HTTP ' . $response->status());
            return null;
        }

        $first = $response->collect()->first();

        if (!$first || empty($first['lat']) || empty($first['lon'])) {
            return null;
        }

        $latitude = (float) $first['lat'];
        $longitude = (float) $first['lon'];

        if (!$this->isValidCoordinate($latitude, $longitude)) {
            return null;
        }

        return [
            'latitude' => $latitude,
            'longitude' => $longitude,
            'display_name' => $first['display_name'] ?? 'Unknown place',
        ];
    }

    private function extractCoordinatesFromUrl(string $url): ?array
    {
        if (trim($url) === '') {
            return null;
        }

        $patterns = [
            '/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/',
            '/[?&]query=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/',
            '/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/',
        ];

        foreach ($patterns as $pattern) {
            if (!preg_match($pattern, $url, $matches)) {
                continue;
            }

            $latitude = (float) $matches[1];
            $longitude = (float) $matches[2];

            if (!$this->isValidCoordinate($latitude, $longitude)) {
                continue;
            }

            return [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'display_name' => 'Google Maps URL',
            ];
        }

        return null;
    }

    private function isValidCoordinate(float $latitude, float $longitude): bool
    {
        return $latitude >= -90
            && $latitude <= 90
            && $longitude >= -180
            && $longitude <= 180
            && !($latitude === 0.0 && $longitude === 0.0);
    }

    private function sleep(float $seconds): void
    {
        usleep((int) round($seconds * 1_000_000));
    }
}
