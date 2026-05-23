<?php

namespace App\Services;

use App\Repositories\Contracts\PlaceRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class PlaceService
{
    public function __construct(
        protected PlaceRepositoryInterface $placeRepository,
        protected RecommendationService $recommendationService
    ) {}

    /**
     * Lấy danh sách địa điểm với cache.
     */
    public function getPlaces(array $filters): LengthAwarePaginator
    {
        $limit = min($filters['limit'] ?? 10, 50);

        // Không cache cho user đã đăng nhập để trạng thái yêu thích (is_favorited) luôn chính xác và cập nhật tức thì
        if (auth()->check()) {
            return $this->placeRepository->getPaginated($filters, $limit);
        }

        // Không cache khi có bộ lọc để kết quả luôn chính xác
        $hasFilter = !empty($filters['search'])
            || !empty($filters['category_id'])
            || !empty($filters['city_id'])
            || !empty($filters['min_rating'])
            || !empty($filters['max_rating'])
            || !empty($filters['amenities']);

        if ($hasFilter) {
            return $this->placeRepository->getPaginated($filters, $limit);
        }

        $page = request()->get('page', 1);
        $cacheKey = 'places.' . md5(json_encode($filters) . $limit . 'page' . $page);

        return Cache::remember($cacheKey, 600, function () use ($filters, $limit) {
            return $this->placeRepository->getPaginated($filters, $limit);
        });
    }

    /**
     * Lấy chi tiết địa điểm.
     */
    public function getPlaceBySlug(string $slug)
    {
        return $this->placeRepository->findBySlug($slug);
    }

    /**
     * Tăng view count.
     */
    public function incrementView(int $id): void
    {
        $this->placeRepository->incrementViewCount($id);
        
        // Cứ 50 views thì bust cache 1 lần để tránh quá tải
        if (rand(1, 50) === 1) {
            $this->recommendationService->bustCache();
        }
    }

    /**
     * Lấy tất cả địa điểm cho bản đồ (có cache).
     */
    public function getPlacesForMap(): Collection
    {
        return Cache::remember('places.map', 3600, function () {
            return $this->placeRepository->getAllForMap();
        });
    }

    /**
     * Lấy các địa điểm tương tự (Cùng danh mục, cùng thành phố).
     */
    public function getSimilarPlaces($place, $limit = 3)
    {
        return $this->placeRepository->getSimilar($place, $limit);
    }

    /**
     * Lấy tất cả danh mục.
     */
    public function getCategories(): Collection
    {
        return Cache::remember('categories.all', 3600, function () {
            return $this->placeRepository->getAllCategories();
        });
    }

    /**
     * Lấy tất cả thành phố.
     */
    public function getCities(): Collection
    {
        return Cache::remember('cities.all', 3600, function () {
            return $this->placeRepository->getAllCities();
        });
    }
}
