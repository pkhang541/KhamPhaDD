<?php

namespace App\Repositories;

use App\Models\Category;
use App\Models\Place;
use App\Repositories\Contracts\PlaceRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PlaceRepository implements PlaceRepositoryInterface
{
    /**
     * @inheritDoc
     */
    public function getPaginated(array $filters, int $limit = 10): LengthAwarePaginator
    {
        $query = Place::query()
            ->with(['category', 'city'])
            ->withExists(['favorites as is_favorited' => function ($q) {
                $q->where('user_id', auth()->id());
            }])
            ->select(['id', 'name', 'slug', 'address', 'image', 'avg_rating', 'view_count', 'category_id', 'city_id', 'opening_hours', 'tags', 'is_featured', 'created_at', 'updated_at']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('address', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['category_id'])) {
            if (is_array($filters['category_id'])) {
                $categoryIds = array_filter($filters['category_id'], function ($val) {
                    return trim($val) !== '';
                });
            } elseif (is_string($filters['category_id'])) {
                $categoryIds = array_filter(explode(',', $filters['category_id']), function ($val) {
                    return trim($val) !== '';
                });
            } else {
                $categoryIds = [$filters['category_id']];
            }

            if (!empty($categoryIds)) {
                $query->where(function ($q) use ($categoryIds) {
                    $q->whereIn('category_id', $categoryIds);
                    foreach ($categoryIds as $catId) {
                        $q->orWhereJsonContains('category_ids', (int) $catId)
                          ->orWhereJsonContains('category_ids', (string) $catId);
                    }
                });
            }
        }

        if (!empty($filters['city_id'])) {
            if (is_array($filters['city_id'])) {
                $cityIds = array_filter($filters['city_id'], function ($val) {
                    return trim($val) !== '';
                });
                if (!empty($cityIds)) {
                    $query->whereIn('city_id', $cityIds);
                }
            } elseif (is_string($filters['city_id'])) {
                $cityIds = array_filter(explode(',', $filters['city_id']), function ($val) {
                    return trim($val) !== '';
                });
                if (!empty($cityIds)) {
                    $query->whereIn('city_id', $cityIds);
                }
            }
        }

        if (!empty($filters['amenities']) && is_array($filters['amenities'])) {
            foreach ($filters['amenities'] as $amenity) {
                $query->whereJsonContains('amenities', $amenity);
            }
        }

        if (!empty($filters['min_rating']) && is_numeric($filters['min_rating'])) {
            $query->where('avg_rating', '>=', (float) $filters['min_rating']);
        }

        if (!empty($filters['max_rating']) && is_numeric($filters['max_rating'])) {
            $query->where('avg_rating', '<=', (float) $filters['max_rating']);
        }

        // Sorting
        $sort = $filters['sort'] ?? 'newest';
        switch ($sort) {
            case 'popular':
                $query->orderBy('view_count', 'desc');
                break;
            case 'rating':
                $query->orderBy('avg_rating', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        return $query->paginate($limit)->withQueryString();
    }

    /**
     * @inheritDoc
     */
    public function findBySlug(string $slug): ?Place
    {
        return Place::with(['category', 'reviews.user'])
            ->where('slug', $slug)
            ->first();
    }

    /**
     * @inheritDoc
     */
    public function getRecommended(?int $categoryId = null, int $limit = 6): Collection
    {
        $query = Place::query()
            ->with(['category'])
            ->select(['id', 'name', 'slug', 'address', 'image', 'avg_rating', 'view_count', 'category_id', 'opening_hours', 'tags', 'is_featured', 'created_at', 'updated_at']);

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        // Score logic: (view_count * 0.3) + (avg_rating * 20 * 0.7)
        return $query->orderByRaw('(view_count * 0.3) + (avg_rating * 20 * 0.7) DESC')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function incrementViewCount(int $id): void
    {
        // Sử dụng DB::statement để tránh race condition
        DB::table('places')->where('id', $id)->increment('view_count');
    }

    /**
     * @inheritDoc
     */
    public function getAllForMap(): Collection
    {
        return Place::query()
            ->with(['category'])
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select(['id', 'name', 'slug', 'address', 'latitude', 'longitude', 'category_id'])
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function getAllCategories(): Collection
    {
        return Category::withCount('places')->get();
    }

    /**
     * @inheritDoc
     */
    public function getAllCities(): Collection
    {
        return \App\Models\City::has('places')
            ->withCount('places')
            ->orderBy('name')
            ->get();
    }

    public function getSimilar($place, int $limit): Collection
    {
        return Place::where('category_id', $place->category_id)
            ->where('city_id', $place->city_id)
            ->where('id', '!=', $place->id)
            ->with(['category', 'city'])
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    public function getRecommendedForUser(array $categoryIds, int $limit): Collection
    {
        return Place::whereIn('category_id', $categoryIds)
            ->with(['category', 'city'])
            ->orderBy('avg_rating', 'desc')
            ->orderBy('view_count', 'desc')
            ->limit($limit)
            ->get();
    }
}
