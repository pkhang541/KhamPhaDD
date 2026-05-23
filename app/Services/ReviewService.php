<?php
// app/Services/ReviewService.php
// Service quản lý reviews + dispatch job để update rating

namespace App\Services;

use App\Models\Review;
use App\Models\Place;
use App\Models\User;
use App\Jobs\UpdatePlaceRating;

class ReviewService
{
    public function __construct(
        protected RecommendationService $recommendationService
    ) {}
    /**
     * Tạo review mới
     * Side effect: dispatch job để update avg_rating
     */
    public function createReview(User $user, int $placeId, int $rating, ?string $comment): Review
    {
        $place = Place::findOrFail($placeId);

        // Kiểm tra user đã review chưa
        if ($place->isReviewedBy($user->id)) {
            throw new \Exception('Bạn đã đánh giá địa điểm này rồi');
        }

        // Kiểm tra rating hợp lệ
        if ($rating < 1 || $rating > 5) {
            throw new \Exception('Rating phải từ 1 đến 5');
        }

        // Tạo review
        $review = Review::create([
            'user_id' => $user->id,
            'place_id' => $placeId,
            'rating' => $rating,
            'comment' => $comment,
        ]);

        // Dispatch job để tính lại avg_rating (async)
        dispatch(new UpdatePlaceRating($placeId));

        // Bust cache recommendation
        $this->recommendationService->bustCache($place->category_id);

        return $review;
    }

    /**
     * Cập nhật review
     * Chỉ owner hoặc admin mới được cập nhật
     */
    public function updateReview(Review $review, int $rating, ?string $comment, User $user): Review
    {
        // Kiểm tra quyền
        if ($review->user_id !== $user->id && !$user->isAdmin()) {
            throw new \Exception('Bạn không có quyền cập nhật review này');
        }

        // Kiểm tra rating hợp lệ
        if ($rating < 1 || $rating > 5) {
            throw new \Exception('Rating phải từ 1 đến 5');
        }

        $review->update([
            'rating' => $rating,
            'comment' => $comment,
        ]);

        // Dispatch job để tính lại avg_rating
        dispatch(new UpdatePlaceRating($review->place_id));

        // Bust cache recommendation
        $this->recommendationService->bustCache($review->place->category_id);

        return $review;
    }

    /**
     * Xóa review
     */
    public function deleteReview(Review $review, User $user): void
    {
        // Kiểm tra quyền
        if ($review->user_id !== $user->id && !$user->isAdmin()) {
            throw new \Exception('Bạn không có quyền xóa review này');
        }

        $placeId = $review->place_id;
        $review->delete();

        // Dispatch job để tính lại avg_rating
        dispatch(new UpdatePlaceRating($placeId));

        // Bust cache recommendation
        $this->recommendationService->bustCache();
    }

    /**
     * Lấy reviews của 1 địa điểm
     */
    public function getReviewsByPlace(int $placeId, int $perPage = 10)
    {
        return Review::where('place_id', $placeId)
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    /**
     * Lấy reviews của 1 user
     */
    public function getReviewsByUser(int $userId, int $perPage = 10)
    {
        return Review::where('user_id', $userId)
            ->with('place:id,name,slug')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }
}
