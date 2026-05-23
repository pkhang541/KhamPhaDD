<?php

namespace Database\Seeders;

use App\Models\Place;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $places = Place::all();

        // Các mẫu bình luận
        $comments = [
            'Rất tuyệt vời, tôi sẽ quay lại!',
            'Không gian đẹp, phục vụ tốt.',
            'Giá cả hợp lý, đáng để trải nghiệm.',
            'Cũng bình thường, không có gì đặc sắc lắm.',
            'Địa điểm đẹp nhưng hơi đông vào cuối tuần.',
            'Tuyệt cú mèo!',
            'Đồ ăn ngon, view xuất sắc.',
            'Hơi thất vọng một chút về dịch vụ.',
            'Chỗ này chill phết, hợp đi hẹn hò.',
            'Rất đáng tiền!',
        ];

        foreach ($places as $place) {
            // Random 3-8 reviews cho mỗi place
            $numReviews = rand(3, 8);
            $randomUsers = $users->random(min($numReviews, $users->count()));

            $totalRating = 0;
            $count = 0;

            foreach ($randomUsers as $user) {
                // Random rating từ 3 đến 5 để điểm số đẹp
                $rating = rand(3, 5);
                
                Review::updateOrCreate(
                    ['user_id' => $user->id, 'place_id' => $place->id],
                    [
                        'rating'  => $rating,
                        'comment' => $comments[array_rand($comments)],
                        'created_at' => now()->subDays(rand(1, 60)),
                    ]
                );

                $totalRating += $rating;
                $count++;
            }

            // Tính toán avg_rating THẬT và lưu vào place
            $avgRating = $count > 0 ? round($totalRating / $count, 1) : 0;
            $place->update([
                'avg_rating' => $avgRating,
                'is_featured' => $avgRating >= 4.5
            ]);
        }
    }
}
