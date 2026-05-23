<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            // 6 Thành phố trực thuộc Trung ương
            ['name' => 'TP. Hà Nội', 'slug' => 'tp-ha-noi', 'description' => 'Thành phố trực thuộc trung ương (Không sáp nhập).'],
            ['name' => 'TP. Hồ Chí Minh', 'slug' => 'tp-ho-chi-minh', 'description' => 'Sáp nhập: TP.HCM + Bình Dương + Bà Rịa Vũng Tàu.'],
            ['name' => 'TP. Hải Phòng', 'slug' => 'tp-hai-phong', 'description' => 'Sáp nhập: TP. Hải Phòng + Hải Dương.'],
            ['name' => 'TP. Đà Nẵng', 'slug' => 'tp-da-nang', 'description' => 'Sáp nhập: TP. Đà Nẵng + Quảng Nam.'],
            ['name' => 'TP. Cần Thơ', 'slug' => 'tp-can-tho', 'description' => 'Sáp nhập: TP. Cần Thơ + Sóc Trăng + Hậu Giang.'],
            ['name' => 'TP. Huế', 'slug' => 'tp-hue', 'description' => 'Thành phố trực thuộc trung ương (Không sáp nhập).'],

            // Các tỉnh không sáp nhập
            ['name' => 'Lai Châu', 'slug' => 'lai-chau', 'description' => 'Tỉnh không thực hiện sắp xếp.'],
            ['name' => 'Quảng Ninh', 'slug' => 'quang-ninh', 'description' => 'Tỉnh không thực hiện sắp xếp.'],
            ['name' => 'Thanh Hoá', 'slug' => 'thanh-hoa', 'description' => 'Tỉnh không thực hiện sắp xếp.'],
            ['name' => 'Nghệ An', 'slug' => 'nghe-an', 'description' => 'Tỉnh không thực hiện sắp xếp.'],
            ['name' => 'Điện Biên', 'slug' => 'dien-bien', 'description' => 'Tỉnh không thực hiện sắp xếp.'],
            ['name' => 'Sơn La', 'slug' => 'son-la', 'description' => 'Tỉnh không thực hiện sắp xếp.'],
            ['name' => 'Lạng Sơn', 'slug' => 'lang-son', 'description' => 'Tỉnh không thực hiện sắp xếp.'],
            ['name' => 'Hà Tĩnh', 'slug' => 'ha-tinh', 'description' => 'Tỉnh không thực hiện sắp xếp.'],
            ['name' => 'Cao Bằng', 'slug' => 'cao-bang', 'description' => 'Tỉnh không thực hiện sắp xếp.'],

            // Các tỉnh mới sáp nhập
            ['name' => 'Tuyên Quang', 'slug' => 'tuyen-quang', 'description' => 'Sáp nhập: Tuyên Quang + Hà Giang.'],
            ['name' => 'Lào Cai', 'slug' => 'lao-cai', 'description' => 'Sáp nhập: Lào Cai + Yên Bái.'],
            ['name' => 'Thái Nguyên', 'slug' => 'thai-nguyen', 'description' => 'Sáp nhập: Thái Nguyên + Bắc Kạn.'],
            ['name' => 'Phú Thọ', 'slug' => 'phu-tho', 'description' => 'Sáp nhập: Phú Thọ + Vĩnh Phúc + Hòa Bình.'],
            ['name' => 'Bắc Ninh', 'slug' => 'bac-ninh', 'description' => 'Sáp nhập: Bắc Ninh + Bắc Giang.'],
            ['name' => 'Hưng Yên', 'slug' => 'hung-yen', 'description' => 'Sáp nhập: Hưng Yên + Thái Bình.'],
            ['name' => 'Ninh Bình', 'slug' => 'ninh-binh', 'description' => 'Sáp nhập: Ninh Bình + Nam Định + Hà Nam.'],
            ['name' => 'Quảng Trị', 'slug' => 'quang-tri', 'description' => 'Sáp nhập: Quảng Bình + Quảng Trị.'],
            ['name' => 'Quảng Ngãi', 'slug' => 'quang-ngai', 'description' => 'Sáp nhập: Quảng Ngãi + Kon Tum.'],
            ['name' => 'Gia Lai', 'slug' => 'gia-lai', 'description' => 'Sáp nhập: Gia Lai + Bình Định.'],
            ['name' => 'Khánh Hòa', 'slug' => 'khanh-hoa', 'description' => 'Sáp nhập: Khánh Hòa + Ninh Thuận.'],
            ['name' => 'Lâm Đồng', 'slug' => 'lam-dong', 'description' => 'Sáp nhập: Lâm Đồng + Bình Thuận + Đắk Nông.'],
            ['name' => 'Đắk Lắk', 'slug' => 'dak-lak', 'description' => 'Sáp nhập: Đắk Lắk + Phú Yên.'],
            ['name' => 'Đồng Nai', 'slug' => 'dong-nai', 'description' => 'Sáp nhập: Đồng Nai + Bình Phước.'],
            ['name' => 'Tây Ninh', 'slug' => 'tay-ninh', 'description' => 'Sáp nhập: Tây Ninh + Long An.'],
            ['name' => 'Vĩnh Long', 'slug' => 'vinh-long', 'description' => 'Sáp nhập: Vĩnh Long + Bến Tre + Trà Vinh.'],
            ['name' => 'Đồng Tháp', 'slug' => 'dong-thap', 'description' => 'Sáp nhập: Đồng Tháp + Tiền Giang.'],
            ['name' => 'Cà Mau', 'slug' => 'ca-mau', 'description' => 'Sáp nhập: Cà Mau + Bạc Liêu.'],
            ['name' => 'An Giang', 'slug' => 'an-giang', 'description' => 'Sáp nhập: An Giang + Kiên Giang.'],
        ];

        foreach ($cities as $city) {
            $city['image'] = 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80';
            \App\Models\City::updateOrCreate(['slug' => $city['slug']], $city);
        }
    }
}
