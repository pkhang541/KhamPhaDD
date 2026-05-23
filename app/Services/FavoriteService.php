<?php

namespace App\Services;

use App\Models\Favorite;
use Illuminate\Support\Facades\Auth;

class FavoriteService
{
    /**
     * Toggle trạng thái yêu thích của user cho 1 địa điểm.
     */
    public function toggleFavorite(int $placeId): bool
    {
        $userId = Auth::id();
        $favorite = Favorite::where('user_id', $userId)
            ->where('place_id', $placeId)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return false; // Đã bỏ thích
        }

        Favorite::create([
            'user_id' => $userId,
            'place_id' => $placeId,
        ]);

        return true; // Đã thích
    }

    /**
     * Kiểm tra xem user đã thích địa điểm chưa.
     */
    public function isFavorite(int $placeId): bool
    {
        if (!Auth::check()) return false;

        return Favorite::where('user_id', Auth::id())
            ->where('place_id', $placeId)
            ->exists();
    }
}
