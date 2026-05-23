<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    // Unsplash ảnh mẫu theo chủ đề cà phê / phong cảnh Việt Nam
    private array $cafePics = [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=800&q=80',
    ];

    private array $restaurantPics = [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    ];

    private array $sceneryPics = [
        'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581456495146-65a71543d316?auto=format&fit=crop&w=800&q=80',
    ];

    private array $cafeAmenities = [
        'wifi' => 'WiFi miễn phí',
        'parking' => 'Bãi đỗ xe',
        'ac' => 'Máy lạnh',
        'outdoor' => 'Chỗ ngồi ngoài trời',
        'music' => 'Nhạc sống',
        'takeaway' => 'Mang đi',
        'pet_friendly' => 'Thú cưng được phép',
        'power_outlet' => 'Ổ cắm điện',
    ];

    private array $restaurantAmenities = [
        'wifi' => 'WiFi miễn phí',
        'parking' => 'Bãi đỗ xe',
        'ac' => 'Máy lạnh',
        'private_room' => 'Phòng riêng',
        'halal' => 'Đồ ăn Halal',
        'vegetarian' => 'Món chay',
        'delivery' => 'Giao hàng tận nơi',
        'reservation' => 'Đặt bàn trước',
    ];

    private array $touristAmenities = [
        'parking' => 'Bãi đỗ xe',
        'toilet' => 'Nhà vệ sinh',
        'guide' => 'Hướng dẫn viên',
        'wheelchair' => 'Tiếp cận xe lăn',
        'photo_spot' => 'Điểm chụp ảnh đẹp',
        'souvenir' => 'Quà lưu niệm',
    ];

    public function up(): void
    {
        $places = DB::table('places')->get();

        foreach ($places as $place) {
            // Chọn ảnh theo loại địa điểm
            $name = strtolower($place->name);
            if (str_contains($name, 'coffee') || str_contains($name, 'cafe') || str_contains($name, 'tea') || str_contains($name, 'cà phê')) {
                $gallery   = $this->cafePics;
                $amenities = array_keys($this->cafeAmenities);
                shuffle($amenities);
                $amenities = array_slice($amenities, 0, rand(4, 7));
            } elseif (str_contains($name, 'nhà hàng') || str_contains($name, 'lẩu') || str_contains($name, 'kitchen') || str_contains($name, 'house')) {
                $gallery   = $this->restaurantPics;
                $amenities = array_keys($this->restaurantAmenities);
                shuffle($amenities);
                $amenities = array_slice($amenities, 0, rand(3, 6));
            } else {
                $gallery   = $this->sceneryPics;
                $amenities = array_keys($this->touristAmenities);
                shuffle($amenities);
                $amenities = array_slice($amenities, 0, rand(2, 5));
            }

            DB::table('places')->where('id', $place->id)->update([
                'gallery'   => json_encode($gallery),
                'amenities' => json_encode($amenities),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('places')->update(['gallery' => null, 'amenities' => null]);
    }
};
