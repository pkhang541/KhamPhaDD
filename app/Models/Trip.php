<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trip extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'title', 'description', 'start_date', 'end_date', 'departure_time',
        'cover_image', 'status', 'currency', 'budget', 'is_public',
        'members', 'return_time',
    ];

    protected $casts = [
        'start_date'  => 'date',
        'end_date'    => 'date',
        'budget'      => 'decimal:2',
        'is_public'   => 'boolean',
        'members'     => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tripPlaces(): HasMany
    {
        return $this->hasMany(TripPlace::class)->orderBy('day_number')->orderBy('order');
    }

    /** Số ngày của chuyến đi */
    public function getDaysCountAttribute(): int
    {
        if (!$this->start_date || !$this->end_date) return 1;
        return $this->start_date->diffInDays($this->end_date) + 1;
    }

    /** Các ngày được group */
    public function getGroupedPlacesAttribute(): array
    {
        $groups = [];
        foreach ($this->tripPlaces as $tp) {
            $groups[$tp->day_number][] = $tp;
        }
        return $groups;
    }
}
