<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\City;
use App\Models\Place;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PlaceSeeder extends Seeder
{
    public function run(): void
    {
        $vinhLong = City::where('slug', 'vinh-long')->first();
        
        $categories = [
            'cafe'    => Category::where('slug', 'ca-phe')->first()->id,
            'food'    => Category::where('slug', 'nha-hang')->first()->id,
            'sightseeing' => Category::where('slug', 'tham-quan')->first()->id,
            'study'   => Category::where('slug', 'hoc-tap')->first()->id,
        ];

        $places = [
            // --- CAFE HỌC TẬP ---
            [
                'name'          => 'Thóc Cafe',
                'category_id'   => $categories['cafe'],
                'address'       => 'Số 19 Đường Lê Lai, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian rộng rãi, thoáng mát, yên tĩnh — lý tưởng để học tập và thư giãn giữa lòng thành phố Vĩnh Long.',
                'opening_hours' => '07:00 - 22:00',
                'phone'         => '027 0399 3939',
                'latitude'      => 10.2518,
                'longitude'     => 105.9722,
            ],
            [
                'name'          => 'Thóc Cafe (Học tập)',
                'category_id'   => $categories['study'],
                'address'       => 'Số 19 Đường Lê Lai, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian rộng rãi, thoáng mát, yên tĩnh — lý tưởng để học tập và thư giãn giữa lòng thành phố Vĩnh Long.',
                'opening_hours' => '07:00 - 22:00',
                'phone'         => '027 0399 3939',
                'latitude'      => 10.2518,
                'longitude'     => 105.9722,
            ],
            [
                'name'          => 'UP Coffee & Tea',
                'category_id'   => $categories['cafe'],
                'address'       => '01 Nguyễn Thái Học, Phường 1, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian hiện đại, thoải mái, ánh sáng tốt — phù hợp cho việc học tập, làm việc và các buổi họp nhóm.',
                'opening_hours' => '06:30 - 21:30',
                'phone'         => '+84 376 158 037',
                'latitude'      => 10.2492,
                'longitude'     => 105.9695,
            ],
            [
                'name'          => 'UP Coffee & Tea (Học tập)',
                'category_id'   => $categories['study'],
                'address'       => '01 Nguyễn Thái Học, Phường 1, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian hiện đại, thoải mái, ánh sáng tốt — phù hợp cho việc học tập, làm việc và các buổi họp nhóm.',
                'opening_hours' => '06:30 - 21:30',
                'phone'         => '+84 376 158 037',
                'latitude'      => 10.2492,
                'longitude'     => 105.9695,
            ],
            [
                'name'          => 'Thiền Cà Phê',
                'category_id'   => $categories['cafe'],
                'address'       => 'Phường 8, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1521017432531-fbd92d744264?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian thiền yên tĩnh, phong cách tối giản — thích hợp để học tập, đọc sách và lắng đọng tâm trí.',
                'opening_hours' => '07:00 - 21:00',
                'phone'         => '+84 939 477 669',
                'latitude'      => 10.2535,
                'longitude'     => 105.9671,
            ],
            [
                'name'          => 'Thiền Cà Phê (Học tập)',
                'category_id'   => $categories['study'],
                'address'       => 'Phường 8, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1521017432531-fbd92d744264?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian thiền yên tĩnh, phong cách tối giản — thích hợp để học tập, đọc sách và lắng đọng tâm trí.',
                'opening_hours' => '07:00 - 21:00',
                'phone'         => '+84 939 477 669',
                'latitude'      => 10.2535,
                'longitude'     => 105.9671,
            ],
            [
                'name'          => 'Robusta Koi Garden',
                'category_id'   => $categories['cafe'],
                'address'       => '68/19 Phạm Thái Bường, Phường 4, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian gần gũi thiên nhiên với hồ cá Koi xanh mát — thư giãn và học tập bên tiếng nước chảy nhẹ nhàng.',
                'opening_hours' => '07:00 - 22:00',
                'phone'         => '0917 971 175',
                'latitude'      => 10.2506,
                'longitude'     => 105.9663,
            ],
            [
                'name'          => 'Robusta Koi Garden (Học tập)',
                'category_id'   => $categories['study'],
                'address'       => '68/19 Phạm Thái Bường, Phường 4, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian gần gũi thiên nhiên với hồ cá Koi xanh mát — thư giãn và học tập bên tiếng nước chảy nhẹ nhàng.',
                'opening_hours' => '07:00 - 22:00',
                'phone'         => '0917 971 175',
                'latitude'      => 10.2506,
                'longitude'     => 105.9663,
            ],

            // --- CAFE HỌC TẬP (mới) ---
            [
                'name'          => 'Crush Coffee and Tea',
                'category_id'   => $categories['cafe'],
                'address'       => 'Vòng xoay Công Viên Đài Truyền Hình, Phường 3, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian yên tĩnh, view đẹp nhìn ra vòng xoay Công Viên — thích hợp cho việc học tập và thư giãn.',
                'opening_hours' => '09:00 - 22:00',
                'phone'         => '+84 567 139 666',
                'latitude'      => 10.2560,
                'longitude'     => 105.9741,
            ],
            [
                'name'          => 'Crush Coffee and Tea (Học tập)',
                'category_id'   => $categories['study'],
                'address'       => 'Vòng xoay Công Viên Đài Truyền Hình, Phường 3, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian yên tĩnh, view đẹp nhìn ra vòng xoay Công Viên — thích hợp cho việc học tập và thư giãn.',
                'opening_hours' => '09:00 - 22:00',
                'phone'         => '+84 567 139 666',
                'latitude'      => 10.2560,
                'longitude'     => 105.9741,
            ],
            [
                'name'          => 'Lai Coffee & Tea',
                'category_id'   => $categories['cafe'],
                'address'       => '23 Tô Thị Huỳnh, Phường 1, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian yên tĩnh, nhẹ nhàng với âm nhạc du dương — phù hợp cho việc học tập và thư giãn.',
                'opening_hours' => '07:00 - 22:00',
                'phone'         => '+84 389 646 493',
                'latitude'      => 10.2480,
                'longitude'     => 105.9702,
            ],
            [
                'name'          => 'Lai Coffee & Tea (Học tập)',
                'category_id'   => $categories['study'],
                'address'       => '23 Tô Thị Huỳnh, Phường 1, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian yên tĩnh, nhẹ nhàng với âm nhạc du dương — phù hợp cho việc học tập và thư giãn.',
                'opening_hours' => '07:00 - 22:00',
                'phone'         => '+84 389 646 493',
                'latitude'      => 10.2480,
                'longitude'     => 105.9702,
            ],
            [
                'name'          => 'Coffee Lộc Vừng 6',
                'category_id'   => $categories['cafe'],
                'address'       => 'Số 6, Đường Lộc Vừng, Xã Hòa Phú, Huyện Long Hồ, Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian thoáng đãng, yên bình giữa thiên nhiên huyện Long Hồ — thích hợp để học tập và tận hưởng không khí trong lành.',
                'opening_hours' => '07:00 - 21:00',
                'latitude'      => 10.2298,
                'longitude'     => 105.9812,
            ],
            [
                'name'          => 'Coffee Lộc Vừng 6 (Học tập)',
                'category_id'   => $categories['study'],
                'address'       => 'Số 6, Đường Lộc Vừng, Xã Hòa Phú, Huyện Long Hồ, Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian thoáng đãng, yên bình giữa thiên nhiên huyện Long Hồ — thích hợp để học tập và tận hưởng không khí trong lành.',
                'opening_hours' => '07:00 - 21:00',
                'latitude'      => 10.2298,
                'longitude'     => 105.9812,
            ],
            [
                'name'          => 'Hidden Coffee & Tea',
                'category_id'   => $categories['cafe'],
                'address'       => 'Nguyễn Thái Học, Phường 1, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Quán cà phê ẩn trong con phố Nguyễn Thái Học — không gian yên tĩnh, thư giãn, thích hợp để học tập và đọc sách.',
                'opening_hours' => '07:00 - 22:00',
                'latitude'      => 10.2488,
                'longitude'     => 105.9692,
            ],
            [
                'name'          => 'Hidden Coffee & Tea (Học tập)',
                'category_id'   => $categories['study'],
                'address'       => 'Nguyễn Thái Học, Phường 1, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Quán cà phê ẩn trong con phố Nguyễn Thái Học — không gian yên tĩnh, thư giãn, thích hợp để học tập và đọc sách.',
                'opening_hours' => '07:00 - 22:00',
                'latitude'      => 10.2488,
                'longitude'     => 105.9692,
            ],
            [
                'name'          => 'Vincia Coffee',
                'category_id'   => $categories['cafe'],
                'address'       => '339 Trần Phú, Phường 7, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian đẹp, yên tĩnh trên đường Trần Phú — phù hợp để học tập, làm việc và thư giãn từ sáng sớm.',
                'opening_hours' => '06:00 - 22:00',
                'phone'         => '094 966 86 39',
                'latitude'      => 10.2441,
                'longitude'     => 105.9713,
            ],
            [
                'name'          => 'Vincia Coffee (Học tập)',
                'category_id'   => $categories['study'],
                'address'       => '339 Trần Phú, Phường 7, TP. Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian đẹp, yên tĩnh trên đường Trần Phú — phù hợp để học tập, làm việc và thư giãn từ sáng sớm.',
                'opening_hours' => '06:00 - 22:00',
                'phone'         => '094 966 86 39',
                'latitude'      => 10.2441,
                'longitude'     => 105.9713,
            ],
            [
                'name'          => 'Cafe Nguyễn Trúc',
                'category_id'   => $categories['cafe'],
                'address'       => 'QL1A, Xã Hòa Phú, Huyện Long Hồ, Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Quán cà phê ven quốc lộ 1A thoáng rộng, yên tĩnh — điểm dừng chân lý tưởng để học tập và nghỉ ngơi.',
                'opening_hours' => '06:00 - 22:00',
                'latitude'      => 10.2275,
                'longitude'     => 105.9852,
            ],
            [
                'name'          => 'Cafe Nguyễn Trúc (Học tập)',
                'category_id'   => $categories['study'],
                'address'       => 'QL1A, Xã Hòa Phú, Huyện Long Hồ, Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Quán cà phê ven quốc lộ 1A thoáng rộng, yên tĩnh — điểm dừng chân lý tưởng để học tập và nghỉ ngơi.',
                'opening_hours' => '06:00 - 22:00',
                'latitude'      => 10.2275,
                'longitude'     => 105.9852,
            ],
            [
                'name'          => 'Cafe Thiên Phú',
                'category_id'   => $categories['cafe'],
                'address'       => '25 ĐT911, Thạnh Phú, Cầu Kè, Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian xanh mát, yên bình ven đường tỉnh 911 — thích hợp để học tập, đọc sách và tận hưởng thiên nhiên.',
                'opening_hours' => '07:00 - 21:00',
                'latitude'      => 9.9012,
                'longitude'     => 106.1498,
            ],
            [
                'name'          => 'Cafe Thiên Phú (Học tập)',
                'category_id'   => $categories['study'],
                'address'       => '25 ĐT911, Thạnh Phú, Cầu Kè, Vĩnh Long',
                'image'         => 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?auto=format&fit=crop&w=800&q=80',
                'description'   => 'Không gian xanh mát, yên bình ven đường tỉnh 911 — thích hợp để học tập, đọc sách và tận hưởng thiên nhiên.',
                'opening_hours' => '07:00 - 21:00',
                'latitude'      => 9.9012,
                'longitude'     => 106.1498,
            ],

            // --- CAFE (cũ) ---
            [
                'name' => 'PHUC Coffee',
                'category_id' => $categories['cafe'],
                'address' => 'Thành phố Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
                'description' => 'Không gian hiện đại 2 tầng, tầng 2 ngoài trời ngắm cảnh cực chill.',
                'opening_hours' => '07:00 - 22:00',
                'latitude' => 10.252003,
                'longitude' => 105.973400,
            ],
            [
                'name' => 'Central Coffee',
                'category_id' => $categories['cafe'],
                'address' => '306 Nguyễn Văn Thiệt, Phường 3, TP. Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                'description' => 'Địa điểm lý tưởng cho những ai yêu thích không gian hiện đại, nhiều góc chụp ảnh đẹp.',
                'opening_hours' => '07:30 - 21:30',
                'latitude' => 10.246535,
                'longitude' => 105.964521,
            ],
            [
                'name' => 'Catimor Coffee',
                'category_id' => $categories['cafe'],
                'address' => 'TP. Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                'description' => 'Thiết kế trẻ trung, hiện đại, view ngắm phố xá thoáng đãng.',
                'opening_hours' => '08:00 - 22:00',
                'latitude' => 10.253000,
                'longitude' => 105.975000,
            ],
            [
                'name' => 'Tiệm Cafe Đời Đá Vàng',
                'category_id' => $categories['cafe'],
                'address' => 'Nguyễn Văn Thiệt, TP. Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1508766917616-d22f3f1eea14?auto=format&fit=crop&w=800&q=80',
                'description' => 'Phong cách Vintage hoài cổ, không gian ấm cúng và tĩnh lặng.',
                'opening_hours' => '07:00 - 22:00',
                'latitude' => 10.246600,
                'longitude' => 105.965000,
            ],
            [
                'name' => 'Brownie Coffee & Dessert',
                'category_id' => $categories['cafe'],
                'address' => '109 Nguyễn Thị Minh Khai, Phường 1, TP. Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1559925393-8be0ec41b50d?auto=format&fit=crop&w=800&q=80',
                'description' => 'Không gian thanh nhã, nổi tiếng với các loại bánh ngọt và thức uống chất lượng.',
                'opening_hours' => '07:00 - 22:00',
                'latitude' => 10.257004,
                'longitude' => 105.966840,
            ],
            [
                'name' => 'Zilo Coffee',
                'category_id' => $categories['cafe'],
                'address' => '10 Đường 2/9, Phường 1, TP. Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1521017432531-fbd92d744264?auto=format&fit=crop&w=800&q=80',
                'description' => 'Ngôi nhà nhỏ màu trắng với khoảng sân đầy hoa cỏ, cực kỳ thơ mộng.',
                'opening_hours' => '07:30 - 21:30',
                'latitude' => 10.256247,
                'longitude' => 105.971168,
            ],
            [
                'name' => 'Robusta Koi Garden',
                'category_id' => $categories['cafe'],
                'address' => '68/19 Phạm Thái Bường, TP. Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'description' => 'Không gian hồ cá Koi độc đáo, thoáng mát và thư giãn.',
                'opening_hours' => '07:00 - 22:00',
                'latitude' => 10.250550,
                'longitude' => 105.966345,
            ],

            // --- FOOD ---
            [
                'name' => 'Mèo Ú Kitchen',
                'category_id' => $categories['food'],
                'address' => 'Hẻm 73 đường 2/9, TP. Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
                'description' => 'Thực đơn đa dạng Nhật - Âu - Á trong không gian ấm cúng.',
                'opening_hours' => '10:00 - 21:30',
                'latitude' => 10.255500,
                'longitude' => 105.971500,
            ],
            [
                'name' => 'Nhà hàng Hương Quê',
                'category_id' => $categories['food'],
                'address' => '88/1 Phạm Thái Bường, TP. Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
                'description' => 'Chuyên đặc sản miền Tây, không gian rộng phù hợp gia đình.',
                'opening_hours' => '09:00 - 22:00',
                'latitude' => 10.250600,
                'longitude' => 105.966400,
            ],
            [
                'name' => 'Lẩu Tài Có',
                'category_id' => $categories['food'],
                'address' => '66 Hưng Đạo Vương, TP. Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
                'description' => 'Thương hiệu lẩu lâu đời, giá bình dân và cực kỳ đông khách.',
                'opening_hours' => '15:00 - 23:00',
                'latitude' => 10.252445,
                'longitude' => 105.971485,
            ],

            // --- SIGHTSEEING ---
            [
                'name' => 'Chùa Phật Ngọc Xá Lợi',
                'category_id' => $categories['sightseeing'],
                'address' => 'TP. Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
                'description' => 'Ngôi chùa có kiến trúc uy nghiêm, là biểu tượng tâm linh của tỉnh.',
                'opening_hours' => '05:00 - 21:00',
                'latitude' => 10.264807,
                'longitude' => 105.915484,
            ],
            [
                'name' => 'Văn Thánh Miếu',
                'category_id' => $categories['sightseeing'],
                'address' => 'P.4, TP. Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1599140849279-1014532882fe?auto=format&fit=crop&w=800&q=80',
                'description' => 'Quốc tử giám phương Nam, nơi lưu giữ giá trị văn hóa lịch sử triều Nguyễn.',
                'opening_hours' => '07:30 - 17:00',
                'latitude' => 10.237233,
                'longitude' => 105.964821,
            ],
            [
                'name' => 'Khu du lịch Vinh Sang',
                'category_id' => $categories['sightseeing'],
                'address' => 'Tổ 14, ấp An Thuận, An Bình, Long Hồ, Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&w=800&q=80',
                'description' => 'Trải nghiệm du lịch miệt vườn, tát mương bắt cá và các trò chơi dân gian.',
                'opening_hours' => '08:00 - 18:00',
                'latitude' => 10.267675,
                'longitude' => 105.968032,
            ],
            [
                'name' => 'Lò gạch Mang Thít',
                'category_id' => $categories['sightseeing'],
                'address' => 'Huyện Mang Thít, Vĩnh Long',
                'image' => 'https://images.unsplash.com/photo-1518548419970-286c1f58a3dd?auto=format&fit=crop&w=800&q=80',
                'description' => 'Quần thể lò gạch truyền thống khổng lồ, điểm check-in nghệ thuật độc đáo.',
                'opening_hours' => '24/7',
                'latitude' => 10.169123,
                'longitude' => 106.071720,
            ],
        ];
    
        foreach ($places as $place) {
            Place::updateOrCreate(
                ['slug' => Str::slug($place['name'])],
                array_merge($place, [
                    'city_id'    => $vinhLong->id,
                    'view_count' => rand(500, 3000),
                ])
            );
        }

        // --- CHỢ TRUYỀN THỐNG (nhiều tỉnh) ---
        $shopCat = Category::where('slug', 'mua-sam')->first();
        $shopImg = 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80';

        $markets = [
            ['name' => 'Chợ Bến Thành',  'city' => 'tp-ho-chi-minh', 'address' => 'Quận 1, TP. Hồ Chí Minh',               'lat' => 10.762622, 'lng' => 106.685882, 'hours' => '06:00 - 18:00', 'desc' => 'Biểu tượng lịch sử và trung tâm mua sắm sầm uất nhất Sài Gòn — nơi hội tụ hàng trăm gian hàng đặc sản, thời trang và ẩm thực.'],
            ['name' => 'Chợ Đồng Xuân',  'city' => 'tp-ha-noi',      'address' => 'Hoàn Kiếm, Hà Nội',                      'lat' => 21.029497, 'lng' => 105.858144, 'hours' => '06:00 - 18:00', 'desc' => 'Chợ đầu mối lớn nhất Hà Nội, nổi tiếng với hàng hóa đa dạng từ quần áo, giày dép đến đặc sản vùng miền.'],
            ['name' => 'Chợ Hàn',        'city' => 'tp-da-nang',     'address' => 'Quận Sơn Trà, Đà Nẵng',                  'lat' => 16.067778, 'lng' => 108.220833, 'hours' => '06:00 - 19:00', 'desc' => 'Chợ truyền thống nổi tiếng của Đà Nẵng, nơi bán hải sản tươi sống, đặc sản địa phương và hàng lưu niệm phong phú.'],
            ['name' => 'Chợ Cồn',        'city' => 'tp-da-nang',     'address' => 'Quận Hải Châu, Đà Nẵng',                 'lat' => 16.066667, 'lng' => 108.220833, 'hours' => '06:00 - 19:00', 'desc' => 'Chợ lớn nhất Đà Nẵng với hàng nghìn gian hàng — thiên đường mua sắm vải vóc, thời trang và ẩm thực đường phố.'],
            ['name' => 'Chợ An Đông',    'city' => 'tp-ho-chi-minh', 'address' => 'Quận 5, TP. Hồ Chí Minh',               'lat' => 10.755833, 'lng' => 106.664444, 'hours' => '06:00 - 18:00', 'desc' => 'Chợ sỉ lẻ lớn ở Chợ Lớn, chuyên về quần áo, vải và hàng gia dụng — điểm đến quen thuộc của người buôn bán.'],
            ['name' => 'Chợ Bà Chiểu',   'city' => 'tp-ho-chi-minh', 'address' => 'Quận Bình Thạnh, TP. Hồ Chí Minh',      'lat' => 10.799444, 'lng' => 106.694444, 'hours' => '05:00 - 18:00', 'desc' => 'Chợ dân sinh lớn và sầm uất tại Bình Thạnh — nơi mua sắm thực phẩm tươi, quần áo và đồ dùng hàng ngày.'],
            ['name' => 'Chợ Ninh Hiệp',  'city' => 'tp-ha-noi',      'address' => 'Gia Lâm, Hà Nội',                        'lat' => 21.137222, 'lng' => 105.973611, 'hours' => '06:00 - 18:00', 'desc' => 'Thiên đường vải và quần áo sỉ lớn nhất miền Bắc — điểm buôn hàng thời trang giá rẻ của hàng nghìn tiểu thương.'],
            ['name' => 'Chợ Đà Lạt',     'city' => 'lam-dong',       'address' => 'TP. Đà Lạt, Lâm Đồng',                  'lat' => 11.940833, 'lng' => 108.441389, 'hours' => '05:00 - 21:00', 'desc' => 'Chợ trung tâm thành phố ngàn hoa, nổi tiếng với hoa tươi, rau củ cao nguyên, đặc sản và hàng thủ công mỹ nghệ.'],
            ['name' => 'Chợ Sapa',        'city' => 'lao-cai',        'address' => 'Thị trấn Sapa, Lào Cai',                 'lat' => 22.325833, 'lng' => 103.844444, 'hours' => '06:00 - 18:00', 'desc' => "Chợ phiên độc đáo nơi các dân tộc H'Mông, Dao, Tày về giao thương — nổi bật với thổ cẩm và đặc sản núi rừng."],
            ['name' => 'Chợ Bảo Lộc',    'city' => 'lam-dong',       'address' => 'TP. Bảo Lộc, Lâm Đồng',                 'lat' => 11.801389, 'lng' => 107.818611, 'hours' => '06:00 - 18:00', 'desc' => "Chợ trung tâm thành phố trà Bảo Lộc — nơi mua sắm trà B'Lao, tơ lụa và đặc sản cao nguyên nổi tiếng."],
            ['name' => 'Chợ Phú Nhuận',  'city' => 'tp-ho-chi-minh', 'address' => 'Quận Phú Nhuận, TP. Hồ Chí Minh',       'lat' => 10.799444, 'lng' => 106.684444, 'hours' => '05:00 - 18:00', 'desc' => 'Chợ dân sinh sôi động tại quận Phú Nhuận — đầy đủ thực phẩm tươi sống, quần áo thời trang và hàng gia dụng.'],
            ['name' => 'Chợ Tân Bình',   'city' => 'tp-ho-chi-minh', 'address' => 'Quận Tân Bình, TP. Hồ Chí Minh',        'lat' => 10.801389, 'lng' => 106.629444, 'hours' => '05:00 - 18:00', 'desc' => 'Một trong những chợ sỉ quần áo và phụ kiện thời trang lớn nhất TP.HCM — buôn bán tấp nập từ tờ mờ sáng.'],
            ['name' => 'Chợ Bạc Liêu',   'city' => 'ca-mau',         'address' => 'TP. Bạc Liêu, Bạc Liêu',                'lat' => 9.290833,  'lng' => 105.717222, 'hours' => '05:00 - 18:00', 'desc' => 'Chợ trung tâm tỉnh Bạc Liêu — nơi giao thương đặc sản miền Tây như muối, tôm khô, mắm và nông sản.'],
            ['name' => 'Chợ Cái Răng',   'city' => 'tp-can-tho',     'address' => 'Quận Cái Răng, Cần Thơ',                 'lat' => 10.062222, 'lng' => 105.746389, 'hours' => '05:00 - 09:00', 'desc' => 'Chợ nổi Cái Răng — điểm du lịch đặc sắc miền Tây nơi thương hồ mua bán trái cây và nông sản ngay trên sông.'],
            ['name' => 'Chợ Hạ Long',    'city' => 'quang-ninh',     'address' => 'TP. Hạ Long, Quảng Ninh',                'lat' => 20.960833, 'lng' => 107.085833, 'hours' => '05:00 - 19:00', 'desc' => 'Chợ lớn nhất Quảng Ninh, nổi bật với hải sản tươi vùng vịnh, than đá và đặc sản di sản thiên nhiên thế giới.'],
        ];

        foreach ($markets as $m) {
            $cId = City::where('slug', $m['city'])->value('id');
            if (!$cId) continue;
            Place::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($m['name'])],
                [
                    'name'          => $m['name'],
                    'category_id'   => $shopCat->id,
                    'city_id'       => $cId,
                    'address'       => $m['address'],
                    'description'   => $m['desc'],
                    'image'         => $shopImg,
                    'opening_hours' => $m['hours'],
                    'latitude'      => $m['lat'],
                    'longitude'     => $m['lng'],
                    'view_count'    => rand(500, 5000),
                    'avg_rating'    => 0,
                ]
            );
        }

        // --- SIÊU THỊ ---
        $superCat = Category::where('slug', 'sieu-thi')->first();
        $superImg = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';

        $supermarkets = [
            ['name' => 'AEON Việt Nam',           'city' => 'tp-ho-chi-minh', 'address' => 'Số 30 Đường Tân Thắng, Phường Sơn Kỳ, Quận Tân Phú, TP. Hồ Chí Minh',                            'lat' => 10.7594, 'lng' => 106.6291, 'hours' => '08:00 - 22:00', 'desc' => 'Đại siêu thị Nhật Bản AEON — cung cấp đa dạng hàng hóa chất lượng cao từ thực phẩm, thời trang đến đồ gia dụng trong không gian mua sắm hiện đại.'],
            ['name' => 'Co.opmart',                'city' => 'tp-ho-chi-minh', 'address' => '189C Cống Quỳnh, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh',                               'lat' => 10.7583, 'lng' => 106.6944, 'hours' => '07:00 - 22:00', 'desc' => 'Chuỗi siêu thị Việt Nam Co.opmart — nổi tiếng với hàng hóa đa dạng, giá cả hợp lý và hệ thống phân phối rộng khắp cả nước.'],
            ['name' => 'GO! (Big C)',               'city' => 'tp-ho-chi-minh', 'address' => '469 Nguyễn Hữu Thọ, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh',                                   'lat' => 10.7483, 'lng' => 106.7111, 'hours' => '08:00 - 22:00', 'desc' => 'Đại siêu thị GO! (tiền thân là Big C) — cung cấp đầy đủ thực phẩm tươi sống, hàng tiêu dùng và khu vui chơi giải trí cho gia đình.'],
            ['name' => 'Lotte Mart',                'city' => 'tp-ho-chi-minh', 'address' => '469 Nguyễn Hữu Thọ, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh',                                   'lat' => 10.7483, 'lng' => 106.7111, 'hours' => '08:00 - 22:00', 'desc' => 'Chuỗi đại siêu thị Hàn Quốc Lotte Mart — tập hợp hàng nghìn sản phẩm chất lượng cao, khu ẩm thực và giải trí tiện ích.'],
            ['name' => 'MM Mega Market Việt Nam',   'city' => 'tp-ho-chi-minh', 'address' => 'Khu B, Khu đô thị mới An Phú – An Khánh, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh',          'lat' => 10.7778, 'lng' => 106.7236, 'hours' => '06:00 - 22:00', 'desc' => 'MM Mega Market (tiền thân Metro Cash & Carry) — chuyên cung cấp hàng hóa bán sỉ và lẻ quy mô lớn cho doanh nghiệp và cá nhân.'],
            ['name' => 'Winmart',                   'city' => 'tp-ho-chi-minh', 'address' => '72 Đ. Lê Thánh Tôn, Bến Nghé, Quận 1, TP. Hồ Chí Minh',                                          'lat' => 10.7683, 'lng' => 106.6986, 'hours' => '07:00 - 22:00', 'desc' => 'Winmart thuộc Masan Group — chuỗi siêu thị tiện lợi hiện đại với đa dạng sản phẩm tiêu dùng, thực phẩm tươi sạch và hàng gia dụng.'],
            ['name' => 'Emart',                     'city' => 'tp-ho-chi-minh', 'address' => 'Số 1 Đường số 17A, Khu phố 11, Phường Bình Trị Đông B, Quận Bình Tân, TP. Hồ Chí Minh',          'lat' => 10.7483, 'lng' => 106.6014, 'hours' => '08:00 - 22:00', 'desc' => 'Emart — đại siêu thị Hàn Quốc đầu tiên tại Việt Nam, nổi bật với mô hình one-stop shopping và các sản phẩm nhập khẩu chất lượng cao.'],
            ['name' => 'Fivimart',                  'city' => 'tp-ha-noi',      'address' => 'Số 1 Đường Lê Đức Thọ, Phường Mỹ Đình 2, Quận Nam Từ Liêm, Hà Nội',                               'lat' => 21.0278, 'lng' => 105.7742, 'hours' => '07:30 - 21:30', 'desc' => 'Chuỗi siêu thị Việt Nam Fivimart — phục vụ nhu cầu mua sắm hàng ngày với đa dạng thực phẩm, đồ gia dụng và hàng tiêu dùng.'],
            ['name' => 'SatraMart',                 'city' => 'tp-ho-chi-minh', 'address' => '460 Đường 3 Tháng 2, Phường 12, Quận 10, TP. Hồ Chí Minh',                                        'lat' => 10.7583, 'lng' => 106.6819, 'hours' => '07:00 - 21:00', 'desc' => 'SatraMart thuộc Tổng Công ty Thương mại Sài Gòn — cung cấp đa dạng sản phẩm tiêu dùng, thực phẩm và hàng gia dụng tại trung tâm TP.HCM.'],
            ['name' => 'Điện Máy Xanh',             'city' => 'tp-ho-chi-minh', 'address' => '558 Trần Hưng Đạo, Phường 2, Quận 5, TP. Hồ Chí Minh',                                           'lat' => 10.7556, 'lng' => 106.6819, 'hours' => '08:00 - 21:00', 'desc' => 'Chuỗi bán lẻ điện máy và điện tử lớn nhất Việt Nam — chuyên thiết bị gia dụng, điện thoại, laptop với giá cạnh tranh và bảo hành uy tín.'],
            ['name' => 'Điện Máy Chợ Lớn',          'city' => 'tp-ho-chi-minh', 'address' => 'Lô G, Chung Cư Hùng Vương, Phường 11, Quận 5, TP. Hồ Chí Minh',                                  'lat' => 10.7556, 'lng' => 106.6814, 'hours' => '08:00 - 21:00', 'desc' => 'Điện Máy Chợ Lớn — thương hiệu điện máy lâu đời tại TP.HCM, nổi tiếng với đa dạng mặt hàng điện tử, gia dụng và chính sách giá tốt.'],
            ['name' => 'VinMart',                   'city' => 'tp-ha-noi',      'address' => 'Vincom Center Bà Triệu, 191 Bà Triệu, Hai Bà Trưng, Hà Nội',                                      'lat' => 21.0044, 'lng' => 105.8581, 'hours' => '08:00 - 22:00', 'desc' => 'VinMart (nay là Winmart) thuộc Masan Group — chuỗi siêu thị hiện đại tích hợp trong các trung tâm thương mại Vincom, đa dạng hàng hóa cao cấp.'],
        ];

        foreach ($supermarkets as $s) {
            $cId = City::where('slug', $s['city'])->value('id');
            if (!$cId) continue;
            Place::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($s['name'])],
                [
                    'name'          => $s['name'],
                    'category_id'   => $superCat->id,
                    'city_id'       => $cId,
                    'address'       => $s['address'],
                    'description'   => $s['desc'],
                    'image'         => $superImg,
                    'opening_hours' => $s['hours'],
                    'latitude'      => $s['lat'],
                    'longitude'     => $s['lng'],
                    'view_count'    => rand(500, 6000),
                    'avg_rating'    => 0,
                ]
            );
        }
    }
}
