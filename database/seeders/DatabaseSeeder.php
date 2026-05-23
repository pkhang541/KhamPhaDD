<?php

namespace Database\Seeders;

use App\Models\Place;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Tạo Admin
        User::updateOrCreate(
            ['email' => 'khang541@gmail.com'],
            [
                'name' => 'khang2005',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        if (User::count() < 10) {
            User::factory(5)->create();
        }

        // 3. Chạy CitySeeder
        $this->call(CitySeeder::class);

        // 4. Chạy CategorySeeder
        $this->call(CategorySeeder::class);

        // 5. Chạy PlaceSeeder (Các địa điểm thật)
        $this->call(PlaceSeeder::class);

        // 5a. Seed nhóm cafe check-in TP.HCM
        $this->call(HcmCafeCheckinSeeder::class);

        // 5b. Seed địa điểm từ Google Places JSON
        $this->call(GooglePlacesSeeder::class);

        // 6. Chạy ReviewSeeder (Sinh đánh giá thật và tính lại avg_rating)
        $this->call(ReviewSeeder::class);
    }
}
