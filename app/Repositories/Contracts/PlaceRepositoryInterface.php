<?php

namespace App\Repositories\Contracts;

use App\Models\Place;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PlaceRepositoryInterface
{
    /**
     * Lấy danh sách địa điểm có phân trang và filter.
     */
    public function getPaginated(array $filters, int $limit = 10): LengthAwarePaginator;

    /**
     * Tìm địa điểm theo slug.
     */
    public function findBySlug(string $slug): ?Place;

    /**
     * Lấy top địa điểm theo score (cho recommendation).
     */
    public function getRecommended(?int $categoryId = null, int $limit = 6): Collection;

    /**
     * Tăng số lượt xem của địa điểm.
     */
    public function incrementViewCount(int $id): void;

    /**
     * Lấy tất cả địa điểm để hiển thị trên bản đồ.
     */
    public function getAllForMap(): Collection;

    /**
     * Lấy tất cả categories.
     */
    public function getAllCategories(): Collection;

    /**
     * Lấy tất cả cities.
     */
    public function getAllCities(): Collection;
    
    public function getSimilar($place, int $limit): Collection;
    public function getRecommendedForUser(array $categoryIds, int $limit): Collection;
}
