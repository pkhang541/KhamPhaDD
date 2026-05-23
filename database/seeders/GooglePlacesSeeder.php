<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\City;
use App\Models\Place;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GooglePlacesSeeder extends Seeder
{
    private array $catCache = [];
    private array $cityCache = [];

    private function catId(string $slug): int
    {
        if (!isset($this->catCache[$slug])) {
            $this->catCache[$slug] = Category::where('slug', $slug)->value('id')
                ?? Category::where('slug', 'tham-quan')->value('id');
        }
        return $this->catCache[$slug];
    }

    private function cityId(string $slug): ?int
    {
        if (!isset($this->cityCache[$slug])) {
            $this->cityCache[$slug] = City::where('slug', $slug)->value('id');
        }
        return $this->cityCache[$slug];
    }

    private function mapCategory(string $catName): string
    {
        $map = [
            'ca-phe'           => ['quán cà phê','cafe','coffee'],
            'an-chay'          => ['chay','vegan','thuần chay'],
            'sieu-thi'         => ['siêu thị','winmart','bách hoá','bách hóa','co.op'],
            'mua-sam'          => ['trung tâm mua sắm','shopping','mall','vincom'],
            'ton-giao'         => ['chùa','đình','nhà thờ','hành hương','thờ'],
            'tham-quan'        => ['điểm thu hút','lịch sử','bảo tàng','cổ','tượng'],
            'du-lich-sinh-thai'=> ['sinh thái','farmstay','homestay','khu du lịch','vườn'],
            'noi-nghi-duong'   => ['khách sạn','resort','nhà nghỉ'],
            'nha-hang'         => ['nhà hàng','quán ăn','restaurant','bistro','phở','lẩu','cơm','bún','bánh tráng','trà sữa','chè','kem','ăn vặt'],
        ];
        $lower = mb_strtolower($catName);
        foreach ($map as $slug => $keywords) {
            foreach ($keywords as $kw) {
                if (str_contains($lower, $kw)) return $slug;
            }
        }
        return 'nha-hang';
    }

    private function imgFor(string $catSlug): string
    {
        $imgs = [
            'ca-phe'            => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
            'an-chay'           => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
            'sieu-thi'          => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
            'mua-sam'           => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
            'ton-giao'          => 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
            'tham-quan'         => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            'du-lich-sinh-thai' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
            'noi-nghi-duong'    => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
            'nha-hang'          => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
        ];
        return $imgs[$catSlug] ?? $imgs['nha-hang'];
    }

    private function mapCity(string $city): string
    {
        $map = [
            // TP. Hà Nội
            'Hà Nội'           => 'tp-ha-noi',
            // TP. Hồ Chí Minh (sáp nhập: HCM + Bình Dương + BRVT)
            'Hồ Chí Minh'      => 'tp-ho-chi-minh',
            'TP. Hồ Chí Minh'  => 'tp-ho-chi-minh',
            'Ho Chi Minh'      => 'tp-ho-chi-minh',
            'Bình Dương'       => 'tp-ho-chi-minh',
            'Bà Rịa - Vũng Tàu'=> 'tp-ho-chi-minh',
            'Vũng Tàu'         => 'tp-ho-chi-minh',
            // TP. Hải Phòng (sáp nhập: Hải Phòng + Hải Dương)
            'Hải Phòng'        => 'tp-hai-phong',
            'Hải Dương'        => 'tp-hai-phong',
            // TP. Đà Nẵng (sáp nhập: Đà Nẵng + Quảng Nam)
            'Đà Nẵng'          => 'tp-da-nang',
            'Quảng Nam'        => 'tp-da-nang',
            // TP. Cần Thơ (sáp nhập: Cần Thơ + Sóc Trăng + Hậu Giang)
            'Cần Thơ'          => 'tp-can-tho',
            'Sóc Trăng'        => 'tp-can-tho',
            'Hậu Giang'        => 'tp-can-tho',
            // TP. Huế
            'Thừa Thiên Huế'   => 'tp-hue',
            'Huế'              => 'tp-hue',
            // Lai Châu
            'Lai Châu'         => 'lai-chau',
            // Quảng Ninh
            'Quảng Ninh'       => 'quang-ninh',
            // Thanh Hóa
            'Thanh Hóa'        => 'thanh-hoa',
            'Thanh Hoá'        => 'thanh-hoa',
            // Nghệ An
            'Nghệ An'          => 'nghe-an',
            // Điện Biên
            'Điện Biên'        => 'dien-bien',
            // Sơn La
            'Sơn La'           => 'son-la',
            // Lạng Sơn
            'Lạng Sơn'         => 'lang-son',
            // Hà Tĩnh
            'Hà Tĩnh'          => 'ha-tinh',
            // Cao Bằng
            'Cao Bằng'         => 'cao-bang',
            // Tuyên Quang (sáp nhập: Tuyên Quang + Hà Giang)
            'Tuyên Quang'      => 'tuyen-quang',
            'Hà Giang'         => 'tuyen-quang',
            // Lào Cai (sáp nhập: Lào Cai + Yên Bái)
            'Lào Cai'          => 'lao-cai',
            'Yên Bái'          => 'lao-cai',
            // Thái Nguyên (sáp nhập: Thái Nguyên + Bắc Kạn)
            'Thái Nguyên'      => 'thai-nguyen',
            'Bắc Kạn'          => 'thai-nguyen',
            // Phú Thọ (sáp nhập: Phú Thọ + Vĩnh Phúc + Hòa Bình)
            'Phú Thọ'          => 'phu-tho',
            'Vĩnh Phúc'        => 'phu-tho',
            'Hòa Bình'         => 'phu-tho',
            // Bắc Ninh (sáp nhập: Bắc Ninh + Bắc Giang)
            'Bắc Ninh'         => 'bac-ninh',
            'Bắc Giang'        => 'bac-ninh',
            // Hưng Yên (sáp nhập: Hưng Yên + Thái Bình)
            'Hưng Yên'         => 'hung-yen',
            'Thái Bình'        => 'hung-yen',
            // Ninh Bình (sáp nhập: Ninh Bình + Nam Định + Hà Nam)
            'Ninh Bình'        => 'ninh-binh',
            'Nam Định'         => 'ninh-binh',
            'Hà Nam'           => 'ninh-binh',
            // Quảng Trị (sáp nhập: Quảng Bình + Quảng Trị)
            'Quảng Trị'        => 'quang-tri',
            'Quảng Bình'       => 'quang-tri',
            // Quảng Ngãi (sáp nhập: Quảng Ngãi + Kon Tum)
            'Quảng Ngãi'       => 'quang-ngai',
            'Kon Tum'          => 'quang-ngai',
            // Gia Lai (sáp nhập: Gia Lai + Bình Định)
            'Gia Lai'          => 'gia-lai',
            'Bình Định'        => 'gia-lai',
            // Khánh Hòa (sáp nhập: Khánh Hòa + Ninh Thuận)
            'Khánh Hòa'        => 'khanh-hoa',
            'Ninh Thuận'       => 'khanh-hoa',
            // Lâm Đồng (sáp nhập: Lâm Đồng + Bình Thuận + Đắk Nông)
            'Lâm Đồng'         => 'lam-dong',
            'Bình Thuận'       => 'lam-dong',
            'Đắk Nông'         => 'lam-dong',
            // Đắk Lắk (sáp nhập: Đắk Lắk + Phú Yên)
            'Đắk Lắk'          => 'dak-lak',
            'Phú Yên'          => 'dak-lak',
            // Đồng Nai (sáp nhập: Đồng Nai + Bình Phước)
            'Đồng Nai'         => 'dong-nai',
            'Bình Phước'       => 'dong-nai',
            // Tây Ninh (sáp nhập: Tây Ninh + Long An)
            'Tây Ninh'         => 'tay-ninh',
            'Long An'          => 'tay-ninh',
            // Vĩnh Long (sáp nhập: Vĩnh Long + Bến Tre + Trà Vinh)
            'Vĩnh Long'        => 'vinh-long',
            'Bến Tre'          => 'vinh-long',
            'Trà Vinh'         => 'vinh-long',
            // Đồng Tháp (sáp nhập: Đồng Tháp + Tiền Giang)
            'Đồng Tháp'        => 'dong-thap',
            'Tiền Giang'       => 'dong-thap',
            // Cà Mau (sáp nhập: Cà Mau + Bạc Liêu)
            'Cà Mau'           => 'ca-mau',
            'Bạc Liêu'         => 'ca-mau',
            // An Giang (sáp nhập: An Giang + Kiên Giang)
            'An Giang'         => 'an-giang',
            'Kiên Giang'       => 'an-giang',
        ];

        $city = trim($city);
        if (isset($map[$city])) return $map[$city];

        // Thử fuzzy match — tìm key chứa hoặc bị chứa trong tên thành phố
        foreach ($map as $name => $slug) {
            if (str_contains($city, $name) || str_contains($name, $city)) {
                return $slug;
            }
        }

        return 'vinh-long'; // fallback
    }

    private function extractCoordinates(array $item): ?array
    {
        $latitude = $this->valueFromPaths($item, [
            'latitude',
            'lat',
            'location.lat',
            'location.latitude',
            'coordinates.lat',
            'coordinates.latitude',
            'gpsCoordinates.lat',
            'gpsCoordinates.latitude',
        ]);

        $longitude = $this->valueFromPaths($item, [
            'longitude',
            'lng',
            'lon',
            'location.lng',
            'location.lon',
            'location.longitude',
            'coordinates.lng',
            'coordinates.lon',
            'coordinates.longitude',
            'gpsCoordinates.lng',
            'gpsCoordinates.lon',
            'gpsCoordinates.longitude',
        ]);

        if ($latitude !== null && $longitude !== null) {
            return $this->normalizeCoordinates($latitude, $longitude);
        }

        foreach (['url', 'website', 'google_maps_url'] as $key) {
            if (!empty($item[$key]) && is_string($item[$key])) {
                $coords = $this->extractCoordinatesFromUrl($item[$key]);
                if ($coords) {
                    return $coords;
                }
            }
        }

        return null;
    }

    private function valueFromPaths(array $item, array $paths): mixed
    {
        foreach ($paths as $path) {
            $value = $item;

            foreach (explode('.', $path) as $segment) {
                if (!is_array($value) || !array_key_exists($segment, $value)) {
                    $value = null;
                    break;
                }

                $value = $value[$segment];
            }

            if ($value !== null && $value !== '') {
                return $value;
            }
        }

        return null;
    }

    private function extractCoordinatesFromUrl(string $url): ?array
    {
        $patterns = [
            '/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/',
            '/[?&]query=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/',
            '/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $this->normalizeCoordinates($matches[1], $matches[2]);
            }
        }

        return null;
    }

    private function normalizeCoordinates(mixed $latitude, mixed $longitude): ?array
    {
        if (!is_numeric($latitude) || !is_numeric($longitude)) {
            return null;
        }

        $latitude = (float) $latitude;
        $longitude = (float) $longitude;

        if ($latitude < -90 || $latitude > 90 || $longitude < -180 || $longitude > 180) {
            return null;
        }

        if ($latitude === 0.0 && $longitude === 0.0) {
            return null;
        }

        return [
            'latitude' => $latitude,
            'longitude' => $longitude,
        ];
    }

    public function run(): void
    {
        $dataFile = database_path('data/places_raw.json');
        if (!file_exists($dataFile)) {
            $this->command->warn("File $dataFile không tồn tại. Bỏ qua.");
            return;
        }

        $items = json_decode(file_get_contents($dataFile), true);
        $count = 0;

        foreach ($items as $item) {
            if (empty($item['title'])) continue;

            $catName = $item['categoryName'] ?? $item['categories'][0] ?? 'Nhà hàng';
            $catSlug = $this->mapCategory($catName);
            $citySlug = $this->mapCity($item['city'] ?? 'Vĩnh Long');

            $name = $item['title'];
            $slug = Str::slug($name);
            $place = !empty($item['url']) ? Place::where('google_maps_url', $item['url'])->first() : null;
            
            if (!$place) {
                // Tránh trùng slug cho địa điểm mới
                if (Place::where('slug', $slug)->exists()) {
                    $slug = $slug . '-' . substr(md5($item['url'] ?? $name), 0, 6);
                }
            } else {
                $slug = $place->slug; // Giữ nguyên slug cũ
            }

            $address = trim(implode(', ', array_filter([
                $item['street'] ?? null,
                $item['state'] ?? null,
            ])));
            if (empty($address)) $address = ($item['city'] ?? '') . ', Việt Nam';

            $rating  = is_numeric($item['totalScore'] ?? null) ? (float)$item['totalScore'] : 0;
            $reviews = (int)($item['reviewsCount'] ?? 0);
            $coords = $this->extractCoordinates($item);

            $place = Place::updateOrCreate(
                ['slug' => $slug],
                [
                    'name'          => $name,
                    'category_id'   => $this->catId($catSlug),
                    'city_id'       => $this->cityId($citySlug),
                    'address'       => $address,
                    'description'   => $catName . ' tại ' . ($item['state'] ?? $item['city'] ?? 'Việt Nam') . '. Được đánh giá cao bởi cộng đồng KhamPhaDD.',
                    'image'         => $this->imgFor($catSlug),
                    'avg_rating'    => $rating,
                    'view_count'    => $reviews * 3,
                    'phone'         => \Illuminate\Support\Str::limit($item['phone'] ?? '', 50, ''),
                    'website'       => !empty($item['website']) ? \Illuminate\Support\Str::limit($item['website'], 250, '') : null,
                    'google_maps_url' => !empty($item['url']) ? \Illuminate\Support\Str::limit($item['url'], 250, '') : null,
                    'opening_hours' => '07:00 - 22:00',
                ]
            );

            if ($coords) {
                $place->forceFill([
                    'latitude' => $coords['latitude'],
                    'longitude' => $coords['longitude'],
                ])->save();
            }

            $count++;
        }

        $this->command->info("Đã seed $count địa điểm từ places_raw.json");
    }
}
