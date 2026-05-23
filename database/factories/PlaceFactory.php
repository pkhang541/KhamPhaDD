<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PlaceFactory extends Factory
{
    public function definition(): array
    {
        $places = [
            [
                'name' => 'The Workshop Coffee',
                'address' => '27 Ngô Đức Kế, Bến Nghé, Quận 1',
                'description' => 'Một trong những quán cà phê specialty đầu tiên tại Sài Gòn, không gian rộng rãi, hiện đại, cực kỳ thích hợp để làm việc và học bài.',
                'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Thư viện KHTH TP.HCM',
                'address' => '69 Lý Tự Trọng, Bến Thành, Quận 1',
                'description' => 'Thư viện cổ kính với không gian yên tĩnh tuyệt đối, vườn cây xanh mát, là nơi lý tưởng để tập trung nghiên cứu.',
                'image' => 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Hào Sỹ Phường',
                'address' => '206 Trần Hưng Đạo, Quận 5',
                'description' => 'Con hẻm chung cư cũ với kiến trúc người Hoa đặc sắc, điểm check-in không thể bỏ qua cho những ai yêu thích vẻ đẹp cổ điển.',
                'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Bến Bạch Đằng Park',
                'address' => '1 Tôn Đức Thắng, Quận 1',
                'description' => 'Công viên ven sông Sài Gòn mới được nâng cấp, tầm nhìn triệu đô sang Thủ Thiêm, nơi chill nhất mỗi buổi chiều hoàng hôn.',
                'image' => 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Zone 87',
                'address' => '87 Nguyễn Huệ, Quận 1',
                'description' => 'Khu tổ hợp giải trí, ẩm thực và mua sắm ngay phố đi bộ, trung tâm của sự sôi động và trẻ trung.',
                'image' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
            ]
        ];

        $place = $this->faker->randomElement($places);

        return [
            'name' => $place['name'] . ' ' . $this->faker->unique()->numberBetween(1, 100),
            'slug' => fn (array $attributes) => Str::slug($attributes['name']),
            'description' => $place['description'],
            'address' => $place['address'],
            'image' => $place['image'],
            'category_id' => Category::inRandomOrder()->first()->id ?? 1,
            'view_count' => $this->faker->numberBetween(100, 5000),
            'avg_rating' => $this->faker->randomFloat(2, 3.5, 5.0),
        ];
    }
}
