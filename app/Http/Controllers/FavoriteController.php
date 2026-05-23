<?php
// app/Http/Controllers/FavoriteController.php
// Controller: toggle favorite

namespace App\Http\Controllers;

use App\Models\Place;
use App\Services\FavoriteService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function __construct(protected FavoriteService $favoriteService)
    {
    }

    /**
     * Toggle favorite
     */
    public function toggle(Place $place)
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        try {
            $isFavorited = $this->favoriteService->toggleFavorite($place->id);

            if (request()->wantsJson() || request()->header('X-Inertia')) {
                return back()->with('success', $isFavorited ? 'Added to collection' : 'Removed from collection');
            }

            return back();
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Danh sách yêu thích của user
     */
    public function index()
    {
        $places = auth()->user()
            ->favorites()
            ->with('place.category', 'place.reviews')
            ->get()
            ->pluck('place')
            ->filter()
            ->map(function ($place) {
                $place->is_favorited = true;
                return $place;
            })
            ->values();

        return Inertia::render('Places/Favorites', compact('places'));
    }
}
