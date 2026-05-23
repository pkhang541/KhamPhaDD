<?php

use App\Http\Controllers\Api\V1\PlaceApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware(['throttle:60,1'])->group(function () {
    // Public routes
    Route::get('/places', [PlaceApiController::class, 'index']);
    Route::get('/places/{slug}', [PlaceApiController::class, 'show']);
    Route::get('/categories', [PlaceApiController::class, 'categories']);

    // Protected routes
    Route::middleware('auth')->group(function () {
        Route::post('/places/{slug}/reviews', [PlaceApiController::class, 'storeReview']);
    });
});
