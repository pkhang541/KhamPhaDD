<?php

namespace App\Services;

use App\Repositories\Contracts\PlaceRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class RecommendationService
{
    public function __construct(
        protected PlaceRepositoryInterface $placeRepository
    ) {}

    /**
     * Gợi ý địa điểm dựa trên công thức score.
     * score = (view_count * 0.3) + (avg_rating * 20 * 0.7)
     */
    public function getRecommendations(?int $categoryId = null, int $limit = 6): Collection
    {
        $user = auth()->user();
        $cacheKey = 'recommendations.' . ($categoryId ?? 'all') . ($user ? '.u' . $user->id : '');

        return Cache::remember($cacheKey, 1800, function () use ($categoryId, $limit, $user) {
            if ($user && !$categoryId) {
                // Lấy các category id từ favorite của user
                $favoriteCategoryIds = $user->favorites()
                    ->with('place')
                    ->get()
                    ->pluck('place.category_id')
                    ->unique()
                    ->toArray();

                if (!empty($favoriteCategoryIds)) {
                    // Ưu tiên các địa điểm trong category yêu thích
                    return $this->placeRepository->getRecommendedForUser($favoriteCategoryIds, $limit);
                }
            }

            return $this->placeRepository->getRecommended($categoryId, $limit);
        });
    }

    /**
     * Xóa cache recommendation.
     */
    public function bustCache(?int $categoryId = null): void
    {
        Cache::forget('recommendations.' . ($categoryId ?? 'all'));
        Cache::forget('recommendations.all');
    }
}
