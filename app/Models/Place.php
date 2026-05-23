<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Place extends Model
{
    use HasFactory, SoftDeletes;

    protected static function booted()
    {
        static::saved(function ($place) {
            \Illuminate\Support\Facades\Cache::flush();
        });

        static::deleted(function ($place) {
            \Illuminate\Support\Facades\Cache::flush();
        });
    }
    
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected $fillable = [
        'name',
        'slug',
        'description',
        'address',
        'image',
        'gallery',
        'amenities',
        'category_id',
        'category_ids',
        'city_id',
        'view_count',
        'avg_rating',
        'opening_hours',
        'price_range',
        'tags',
        'is_featured',
        'latitude',
        'longitude',
        'phone',
        'website',
        'google_maps_url',
    ];

    protected $casts = [
        'view_count' => 'integer',
        'avg_rating' => 'decimal:2',
        'tags' => 'array',
        'gallery' => 'array',
        'amenities' => 'array',
        'category_ids' => 'array',
        'is_featured' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    /**
     * Địa điểm thuộc về một danh mục.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Địa điểm thuộc về một thành phố.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    /**
     * Địa điểm có nhiều đánh giá.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Địa điểm có thể được nhiều user yêu thích.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Kiểm tra xem user đã đánh giá địa điểm này chưa.
     */
    public function isReviewedBy(int $userId): bool
    {
        return $this->reviews()->where('user_id', $userId)->exists();
    }

    /**
     * Kiểm tra xem user đã yêu thích địa điểm này chưa.
     */
    public function isFavoritedBy(?int $userId): bool
    {
        if (!$userId) return false;
        return $this->favorites()->where('user_id', $userId)->exists();
    }
}
