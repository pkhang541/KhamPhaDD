<?php

use App\Models\Category;
use App\Models\City;
use App\Models\Place;
use Illuminate\Support\Str;

$cat = Category::where('slug', 'an-vat')->first();
if (!$cat) { echo "Không tìm thấy category an-vat!\n"; return; }

$cityId = fn(string $slug) => City::where('slug', $slug)->value('id');
$img    = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80';

$snacks = [
    // --- Vĩnh Long ---
    [
        'name'    => 'Cà Phê Và Trà',
        'city'    => 'vinh-long',
        'address' => 'Hẻm 1 Hoàng Thái Hiếu, Phường 1, TP. Vĩnh Long',
        'desc'    => 'Quán cà phê và trà sữa với không gian thoải mái, phục vụ nhiều loại thức uống và bánh ngọt ngon miệng.',
        'lat'     => 10.2534, 'lng' => 105.9732,
        'hours'   => '07:00 - 22:00',
    ],
    [
        'name'    => 'Quán Ăn Vặt Miền Tây',
        'city'    => 'vinh-long',
        'address' => 'Số 1, Đường 3/2, Phường 1, TP. Vĩnh Long',
        'desc'    => 'Nổi bật với các món ăn đặc sản miền Tây như bánh tráng trộn, bánh xèo, nem nướng — hương vị đậm đà khó quên.',
        'lat'     => 10.2530, 'lng' => 105.9735,
        'hours'   => '08:00 - 22:00',
    ],
    [
        'name'    => 'Bánh Bèo Bà Hai',
        'city'    => 'vinh-long',
        'address' => 'Số 2, Đường Nguyễn Thị Minh Khai, Phường 1, TP. Vĩnh Long',
        'desc'    => 'Quán bánh bèo truyền thống với hương vị đậm đà, đa dạng các loại bánh theo kiểu miền Tây Nam Bộ.',
        'lat'     => 10.2535, 'lng' => 105.9730,
        'hours'   => '07:00 - 21:00',
    ],
    [
        'name'    => 'Chè Thái Lan 3Q',
        'city'    => 'vinh-long',
        'address' => 'Số 3, Đường Nguyễn Thị Minh Khai, Phường 1, TP. Vĩnh Long',
        'desc'    => 'Quán chè Thái Lan với nhiều loại topping phong phú — mát lạnh, ngọt thanh, rực rỡ sắc màu.',
        'lat'     => 10.2536, 'lng' => 105.9731,
        'hours'   => '09:00 - 22:00',
    ],
    [
        'name'    => 'Bánh Mì Chảo 7 Tầng',
        'city'    => 'vinh-long',
        'address' => 'Số 4, Đường Nguyễn Thị Minh Khai, Phường 1, TP. Vĩnh Long',
        'desc'    => 'Bánh mì chảo kiểu sáng tạo với 7 tầng nguyên liệu hấp dẫn — ăn một lần nhớ mãi.',
        'lat'     => 10.2537, 'lng' => 105.9732,
        'hours'   => '06:30 - 21:00',
    ],

    // --- TP.HCM ---
    [
        'name'    => 'Bánh Tráng Trộn G.',
        'city'    => 'tp-ho-chi-minh',
        'address' => 'Số 1, Đường Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
        'desc'    => 'Quán bánh tráng trộn nổi tiếng Sài Gòn — hương vị đậm đà, cay ngọt hài hòa, đa dạng topping hấp dẫn.',
        'lat'     => 10.7620, 'lng' => 106.6940,
        'hours'   => '10:00 - 22:00',
    ],
    [
        'name'    => 'Chè Khúc Bạch Hẻm 284',
        'city'    => 'tp-ho-chi-minh',
        'address' => 'Số 284, Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh',
        'desc'    => 'Quán chè khúc bạch trong hẻm nổi tiếng — mát lạnh, ngọt thanh với các topping phong phú và thạch trân châu.',
        'lat'     => 10.7550, 'lng' => 106.6945,
        'hours'   => '10:00 - 22:00',
    ],
    [
        'name'    => 'Bánh Mì Phượng',
        'city'    => 'tp-ho-chi-minh',
        'address' => 'Số 2, Đường Phan Châu Trinh, Quận 1, TP. Hồ Chí Minh',
        'desc'    => 'Bánh mì kẹp thịt nướng thơm ngon theo phong cách đặc trưng — được nhiều thực khách yêu thích và giới thiệu.',
        'lat'     => 10.7625, 'lng' => 106.6942,
        'hours'   => '06:30 - 21:30',
    ],
    [
        'name'    => 'Sữa Chua Nếp Cẩm 84',
        'city'    => 'tp-ho-chi-minh',
        'address' => 'Số 84, Đường Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
        'desc'    => 'Sữa chua nếp cẩm truyền thống — ngọt ngào, béo ngậy, thơm mùi nếp; món ăn vặt bình dân được yêu thích.',
        'lat'     => 10.7622, 'lng' => 106.6941,
        'hours'   => '09:00 - 22:00',
    ],
    [
        'name'    => 'Bánh Flan Cô Lan',
        'city'    => 'tp-ho-chi-minh',
        'address' => 'Số 5, Đường Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
        'desc'    => 'Bánh flan mềm mịn, hương vị thơm ngon chuẩn vị — thương hiệu lâu đời được nhiều thực khách Sài Gòn yêu thích.',
        'lat'     => 10.7623, 'lng' => 106.6943,
        'hours'   => '09:00 - 21:00',
    ],
    [
        'name'    => 'Bánh Xèo 46A',
        'city'    => 'tp-ho-chi-minh',
        'address' => 'Số 46A, Đường Dương Quang Trung, Quận 1, TP. Hồ Chí Minh',
        'desc'    => 'Bánh xèo giòn rụm, nhân tôm thịt tươi ngon — nước chấm đậm đà, ăn kèm rau sống theo kiểu miền Trung.',
        'lat'     => 10.7624, 'lng' => 106.6944,
        'hours'   => '10:00 - 21:30',
    ],
    [
        'name'    => 'Chè Bà Ba',
        'city'    => 'tp-ho-chi-minh',
        'address' => 'Số 3, Đường Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
        'desc'    => 'Quán chè truyền thống Sài Gòn với đủ loại chè Nam Bộ — hương vị ngọt thanh, nguyên liệu tươi sạch.',
        'lat'     => 10.7621, 'lng' => 106.6946,
        'hours'   => '09:00 - 22:00',
    ],
];

$inserted = 0;
$updated  = 0;

foreach ($snacks as $s) {
    $cId = $cityId($s['city']);
    if (!$cId) { echo "⚠️  Không tìm thấy city: {$s['city']} cho {$s['name']}\n"; continue; }

    $slug   = Str::slug($s['name']);
    $exists = Place::withTrashed()->where('slug', $slug)->exists();

    Place::updateOrCreate(
        ['slug' => $slug],
        [
            'name'          => $s['name'],
            'category_id'   => $cat->id,
            'city_id'       => $cId,
            'address'       => $s['address'],
            'description'   => $s['desc'],
            'image'         => $img,
            'opening_hours' => $s['hours'],
            'latitude'      => $s['lat'],
            'longitude'     => $s['lng'],
            'view_count'    => rand(200, 3000),
            'avg_rating'    => 0,
        ]
    );

    $exists ? $updated++ : $inserted++;
}

echo "✅ Thêm mới: {$inserted} | Cập nhật: {$updated} | Tổng: " . ($inserted + $updated) . " địa điểm ăn vặt.\n";
