<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $coords = [
            23 => [10.2420, 105.9660],
            24 => [10.2430, 105.9670],
            25 => [10.2440, 105.9680],
            26 => [10.2450, 105.9650],
            27 => [10.2460, 105.9640],
            28 => [10.2510, 105.9720],
            29 => [10.2500, 105.9710],
            30 => [10.2480, 105.9700],
            31 => [10.2470, 105.9690],
            32 => [10.3200, 106.0100],
        ];

        foreach ($coords as $id => [$lat, $lng]) {
            DB::table('places')->where('id', $id)->update([
                'latitude'  => $lat,
                'longitude' => $lng,
            ]);
        }
    }

    public function down(): void
    {
        DB::table('places')
            ->whereIn('id', range(23, 32))
            ->update(['latitude' => null, 'longitude' => null]);
    }
};
