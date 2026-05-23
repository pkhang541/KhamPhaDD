<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TripPlace extends Model
{
    protected $fillable = [
        'trip_id', 'place_id', 'day_number', 'order', 'note', 'visit_time', 'duration_minutes',
    ];

    protected $casts = [
        'day_number'       => 'integer',
        'order'            => 'integer',
        'duration_minutes' => 'integer',
    ];

    public function trip(): BelongsTo
    {
        return $this->belongsTo(Trip::class);
    }

    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class);
    }
}
