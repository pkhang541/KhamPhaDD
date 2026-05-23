<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Qa extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'qas';

    protected $fillable = [
        'place_id', 'user_id', 'parent_id', 'content', 'likes', 'is_verified',
    ];

    protected $casts = [
        'likes'       => 'integer',
        'is_verified' => 'boolean',
    ];

    /** Câu hỏi gốc (không có parent) */
    public function scopeQuestions($query)
    {
        return $query->whereNull('parent_id');
    }

    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Qa::class, 'parent_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Qa::class, 'parent_id')->with('user')->latest();
    }
}
