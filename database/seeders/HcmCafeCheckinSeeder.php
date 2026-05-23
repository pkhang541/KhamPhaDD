<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\City;
use App\Models\Place;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HcmCafeCheckinSeeder extends Seeder
{
    public function run(): void
    {
        $categoryId = Category::where('slug', 'ca-phe')->value('id');
        $cityId = City::where('slug', 'tp-ho-chi-minh')->value('id');

        if (!$categoryId || !$cityId) {
            $this->command?->warn('Không tìm thấy danh mục Cà phê hoặc thành phố TP. Hồ Chí Minh.');
            return;
        }

        $image = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80';

        $cafes = [
            [
                'name' => 'The Workshop Coffee',
                'address' => 'Lầu 2, 27 Ngô Đức Kế, Quận 1, TP. HCM',
                'latitude' => 10.7644,
                'longitude' => 106.6945,
                'tip' => 'Nên đến buổi sáng 8 - 10h để tận dụng ánh sáng tự nhiên chiếu từ cửa sổ lớn, chọn trang phục tông trung tính để nổi bật trên nền gỗ tối.',
            ],
            [
                'name' => 'Vòm Coffee',
                'address' => '251 Tô Hiến Thành, Phường 13, Quận 10, TP. HCM',
                'latitude' => 10.7620,
                'longitude' => 106.6810,
                'tip' => 'Không gian Địa Trung Hải với tone màu trắng và xanh nhẹ, nhiều góc sống ảo đẹp, đặc biệt là sân thượng thoáng mát.',
            ],
            [
                'name' => 'Cheese Coffee',
                'address' => '154 Thành Thái, Phường 12, Quận 10, TP. HCM',
                'latitude' => 10.7625,
                'longitude' => 106.6815,
                'tip' => 'Phong cách châu Âu hiện đại, không gian rộng rãi với nhiều góc chụp đẹp.',
            ],
            [
                'name' => 'LiBB House',
                'address' => '198B Nguyễn Kim, Phường 6, Quận 10, TP. HCM',
                'latitude' => 10.7620,
                'longitude' => 106.6815,
                'tip' => 'View tầng trên hướng ra đường phố, không gian thoáng mát với thiết kế bắt mắt.',
            ],
            [
                'name' => 'Take Coffee',
                'address' => '339/24 Tô Hiến Thành, Phường 12, Quận 10, TP. HCM',
                'latitude' => 10.7620,
                'longitude' => 106.6815,
                'tip' => 'Kết hợp giữa cà phê và đồ ăn nhanh kiểu châu Âu, không gian hiện đại, phù hợp cho những ai yêu thích sự mới mẻ.',
            ],
            [
                'name' => 'FC Good Coffee',
                'address' => '1A Đường Đồng Nai, Phường 15, Quận 10, TP. HCM',
                'latitude' => 10.7620,
                'longitude' => 106.6815,
                'tip' => 'Không gian rộng rãi, thoáng đãng, thiết kế hiện đại và trẻ trung, nhiều góc sống ảo đẹp.',
            ],
            [
                'name' => 'Tượng Cafe Acoustic',
                'address' => 'Số 1 Đường 3/2, Phường 12, Quận 10, TP. HCM',
                'latitude' => 10.7620,
                'longitude' => 106.6815,
                'tip' => 'Không gian âm nhạc acoustic, phù hợp cho những ai yêu thích âm nhạc và chụp ảnh.',
            ],
            [
                'name' => 'iTune Coffee',
                'address' => 'Số 1 Đường 3/2, Phường 12, Quận 10, TP. HCM',
                'latitude' => 10.7620,
                'longitude' => 106.6815,
                'tip' => 'Không gian âm nhạc, phù hợp cho những ai yêu thích âm nhạc và chụp ảnh.',
            ],
            [
                'name' => 'Three O’clock',
                'address' => '822 Sư Vạn Hạnh, Phường 12, Quận 10, TP. HCM',
                'latitude' => 10.7620,
                'longitude' => 106.6815,
                'tip' => 'Không gian thoáng đãng, kết hợp giữa phong cách Á và Âu, nhiều góc chụp đẹp.',
            ],
            [
                'name' => 'Cư Xá - Trà Bánh Cà Phê',
                'address' => 'Số 1 Đường 3/2, Phường 12, Quận 10, TP. HCM',
                'latitude' => 10.7620,
                'longitude' => 106.6815,
                'tip' => 'Không gian rộng rãi, thoáng mát, phù hợp cho nhóm bạn tụ tập và chụp ảnh.',
            ],
        ];

        foreach ($cafes as $index => $cafe) {
            Place::updateOrCreate(
                ['slug' => Str::slug($cafe['name'])],
                [
                    'name' => $cafe['name'],
                    'category_id' => $categoryId,
                    'city_id' => $cityId,
                    'address' => $cafe['address'],
                    'description' => "Quán cà phê check-in tại TP. HCM. Mẹo check-in: {$cafe['tip']}",
                    'image' => $image,
                    'opening_hours' => null,
                    'price_range' => null,
                    'tags' => ['cafe', 'check-in', 'tp-hcm'],
                    'is_featured' => $index < 3,
                    'latitude' => $cafe['latitude'],
                    'longitude' => $cafe['longitude'],
                    'view_count' => 1200 + ($index * 137),
                    'avg_rating' => 4.5,
                ]
            );
        }
    }
}
