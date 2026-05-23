<?php

namespace App\Jobs;

use App\Models\Place;
use App\Models\Review;
use App\Services\RecommendationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

class UpdatePlaceRating implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected int $placeId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(RecommendationService $recommendationService): void
    {
        $place = Place::find($this->placeId);
        if (!$place) return;

        // Tính lại avg_rating từ bảng reviews
        $avgRating = Review::where('place_id', $this->placeId)->avg('rating') ?: 0;
        
        $place->update([
            'avg_rating' => $avgRating
        ]);

        // Bust cache cụ thể, không flush toàn bộ
        Cache::forget('recommendations.' . $place->category_id);
        Cache::forget('recommendations.all');
        Cache::forget('places.category.' . $place->category_id);
    }
}
