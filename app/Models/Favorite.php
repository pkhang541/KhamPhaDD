<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'place_id',
    ];

    /**
     * Yêu thích thuộc về một user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Yêu thích thuộc về một địa điểm.
     */
    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class);
    }
}
