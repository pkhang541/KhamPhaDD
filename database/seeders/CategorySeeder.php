<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Học tập',           'slug' => 'hoc-tap',           'icon' => '📖', 'description' => 'Thư viện, không gian làm việc yên tĩnh'],
            ['name' => 'Cà phê',            'slug' => 'ca-phe',            'icon' => '☕', 'description' => 'Quán cà phê đẹp, view phố'],
            ['name' => 'Ăn vặt',            'slug' => 'an-vat',            'icon' => '🍡', 'description' => 'Trà sữa, bánh tráng, xiên que'],
            ['name' => 'Mua sắm',           'slug' => 'mua-sam',           'icon' => '🛍️', 'description' => 'Trung tâm thương mại, chợ'],
            ['name' => 'Về đêm',            'slug' => 've-dem',            'icon' => '🌙', 'description' => 'Bar, club, rooftop'],
            ['name' => 'Tham quan',         'slug' => 'tham-quan',         'icon' => '📸', 'description' => 'Địa điểm check-in, chụp hình'],
            ['name' => 'Nhà hàng',          'slug' => 'nha-hang',          'icon' => '🍽️', 'description' => 'Nhà hàng các loại ẩm thực trong nước và quốc tế'],
            ['name' => 'Ăn chay',           'slug' => 'an-chay',           'icon' => '🥗', 'description' => 'Nhà hàng chay, thuần chay, thực dưỡng'],
            ['name' => 'Nơi nghỉ dưỡng',    'slug' => 'noi-nghi-duong',    'icon' => '🏨', 'description' => 'Khách sạn, nhà nghỉ, resort, homestay'],
            ['name' => 'Du lịch sinh thái', 'slug' => 'du-lich-sinh-thai', 'icon' => '🌿', 'description' => 'Khu du lịch, vườn sinh thái, farmstay'],
            ['name' => 'Tôn giáo',          'slug' => 'ton-giao',          'icon' => '🛕', 'description' => 'Chùa, đình làng, nhà thờ, địa điểm tâm linh'],
            ['name' => 'Siêu thị',          'slug' => 'sieu-thi',          'icon' => '🏪', 'description' => 'Siêu thị, bách hoá, trung tâm mua sắm'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
