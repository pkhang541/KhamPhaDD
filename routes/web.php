<?php

use App\Http\Controllers\Admin\AdminPlaceController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Trang chủ
Route::get('/', [PlaceController::class, 'home'])->name('home');
Route::post('/chatbot/message', [ChatbotController::class, 'message'])->name('chatbot.message');

// Predictive search (typeahead)
Route::get('/autocomplete', [PlaceController::class, 'autocomplete'])->name('places.autocomplete');

// Danh sách theo danh mục
Route::get('/categories/{slug}', [PlaceController::class, 'category'])->name('categories.show');

// Chi tiết địa điểm
Route::get('/places/{slug}', [PlaceController::class, 'show'])->name('places.show');

// Tìm kiếm & Bản đồ (yêu cầu đăng nhập)
Route::get('/search', [PlaceController::class, 'search'])->name('places.search');
Route::get('/map', [PlaceController::class, 'map'])->middleware('auth')->name('map');

// Dashboard & Profile (Breeze)
Route::get('/dashboard', function () {
    return \Inertia\Inertia::render('Dashboard', [
        'stats' => [
            'favorites_count' => auth()->user()->favorites()->count(),
            'reviews_count'   => auth()->user()->reviews()->count(),
            'trips_count'     => auth()->user()->trips()->count(),
        ]
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::post('/map/discovery', [PlaceController::class, 'storeDiscovery'])->name('map.discovery')->middleware('is_admin');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/places/{place}/reviews', [\App\Http\Controllers\ReviewController::class, 'store'])->name('reviews.store');
    Route::post('/places/{place:id}/favorite', [\App\Http\Controllers\FavoriteController::class, 'toggle'])->name('places.favorite');
    Route::get('/favorites', [\App\Http\Controllers\FavoriteController::class, 'index'])->name('places.favorites');
    Route::patch('/places/{place}/coordinates', [PlaceController::class, 'updateCoordinates'])->name('places.updateCoordinates')->middleware('is_admin');

    // ── Q&A ──
    Route::post('/places/{place}/qa', [\App\Http\Controllers\QaController::class, 'store'])->name('qa.store');
    Route::post('/qa/{qa}/like', [\App\Http\Controllers\QaController::class, 'like'])->name('qa.like');
    Route::delete('/qa/{qa}', [\App\Http\Controllers\QaController::class, 'destroy'])->name('qa.destroy');

    // ── Trip Builder (lịch trình cá nhân) ──
    Route::get('/trips', [\App\Http\Controllers\TripController::class, 'index'])->name('trips.index');
    Route::post('/trips', [\App\Http\Controllers\TripController::class, 'store'])->name('trips.store');
    Route::get('/trips/{trip}', [\App\Http\Controllers\TripController::class, 'show'])->name('trips.show');
    Route::get('/trips/{trip}/edit', [\App\Http\Controllers\TripController::class, 'edit'])->name('trips.edit');
    Route::put('/trips/{trip}', [\App\Http\Controllers\TripController::class, 'update'])->name('trips.update');
    Route::delete('/trips/{trip}', [\App\Http\Controllers\TripController::class, 'destroy'])->name('trips.destroy');
    Route::post('/trips/batch-delete', [\App\Http\Controllers\TripController::class, 'batchDestroy'])->name('trips.batchDestroy');
    Route::post('/trips/{trip}/places', [\App\Http\Controllers\TripController::class, 'addPlace'])->name('trips.addPlace');
    Route::delete('/trips/{trip}/places/{tripPlace}', [\App\Http\Controllers\TripController::class, 'removePlace'])->name('trips.removePlace');
    Route::patch('/trips/{trip}/places/{tripPlace}/time', [\App\Http\Controllers\TripController::class, 'updatePlaceTime'])->name('trips.updatePlaceTime');
    Route::post('/trips/{trip}/reorder', [\App\Http\Controllers\TripController::class, 'reorderPlaces'])->name('trips.reorder');

    // API tìm kiếm user để mời vào chuyến đi
    Route::get('/users/by-email', function (\Illuminate\Http\Request $request) {
        $data = $request->validate([
            'identifier' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'max:255'],
        ]);

        $identifier = trim($data['identifier'] ?? $data['email'] ?? '');
        if ($identifier === '') {
            return response()->json([
                'message' => 'Vui lòng nhập email hoặc UID của người bạn muốn mời.',
            ], 422);
        }

        $normalizedIdentifier = mb_strtolower($identifier);
        if (
            $normalizedIdentifier === mb_strtolower(auth()->user()->email) ||
            $normalizedIdentifier === mb_strtolower((string) auth()->user()->uid)
        ) {
            return response()->json([
                'message' => 'Bạn đã là chủ chuyến đi, không cần mời chính mình.',
            ], 422);
        }

        $user = \App\Models\User::where(function ($query) use ($normalizedIdentifier) {
                $query->whereRaw('LOWER(email) = ?', [$normalizedIdentifier])
                    ->orWhereRaw('LOWER(uid) = ?', [$normalizedIdentifier]);
            })
            ->select('id', 'uid', 'name', 'email')
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email hoặc UID này chưa có tài khoản. Người được mời cần đăng ký trước.',
            ], 404);
        }

        return response()->json($user);
    })->name('users.byEmail');

    Route::get('/users/search', function (\Illuminate\Http\Request $request) {
        $q = $request->get('q', '');
        if (strlen(trim($q)) < 2) return response()->json([]);
        return response()->json(
            \App\Models\User::where(function($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('email', 'like', "%{$q}%")
                      ->orWhere('uid', 'like', "%{$q}%");
            })
            ->select('id', 'uid', 'name', 'email')
            ->limit(8)
            ->get()
        );
    })->name('users.search');
});

// ======================
// Admin Panel Routes
// ======================
Route::prefix('admin')->name('admin.')->middleware(['auth', 'is_admin'])->group(function () {
    Route::redirect('/', '/admin/places');

    Route::get('/places', [AdminPlaceController::class, 'index'])->name('places.index');
    Route::get('/places/create', [AdminPlaceController::class, 'create'])->name('places.create');
    Route::post('/places', [AdminPlaceController::class, 'store'])->name('places.store');
    Route::get('/places/{place:id}/edit', [AdminPlaceController::class, 'edit'])->name('places.edit');
    Route::put('/places/{place:id}', [AdminPlaceController::class, 'update'])->name('places.update');
    Route::delete('/places/{place:id}', [AdminPlaceController::class, 'destroy'])->name('places.destroy');
    Route::patch('/places/{id}/restore', [AdminPlaceController::class, 'restore'])->name('places.restore');

    // Quản lý danh mục
    Route::get('/categories', [\App\Http\Controllers\Admin\AdminCategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [\App\Http\Controllers\Admin\AdminCategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [\App\Http\Controllers\Admin\AdminCategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}/edit', [\App\Http\Controllers\Admin\AdminCategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [\App\Http\Controllers\Admin\AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [\App\Http\Controllers\Admin\AdminCategoryController::class, 'destroy'])->name('categories.destroy');
});

require __DIR__.'/auth.php';
