<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PlaceResource;
use App\Http\Resources\ReviewResource;
use App\Services\PlaceService;
use App\Services\ReviewService;
use Illuminate\Http\Request;

class PlaceApiController extends Controller
{
    public function __construct(
        protected PlaceService $placeService,
        protected ReviewService $reviewService,
    ) {}

    /**
     * Danh sách địa điểm (có phân trang + meta).
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category_id', 'sort', 'limit']);
        $places = $this->placeService->getPlaces($filters);

        return PlaceResource::collection($places)->additional([
            'meta' => [
                'current_page' => $places->currentPage(),
                'last_page'    => $places->lastPage(),
                'per_page'     => $places->perPage(),
                'total'        => $places->total(),
            ],
        ]);
    }

    /**
     * Chi tiết địa điểm.
     */
    public function show(string $slug)
    {
        $place = $this->placeService->getPlaceBySlug($slug);

        if (!$place) {
            return response()->json(['message' => 'Không tìm thấy địa điểm'], 404);
        }

        $this->placeService->incrementView($place->id);

        return new PlaceResource($place);
    }

    /**
     * Danh sách categories.
     */
    public function categories()
    {
        $categories = $this->placeService->getCategories();
        return CategoryResource::collection($categories);
    }

    /**
     * Tạo review — dùng ReviewService để đảm bảo tính nhất quán.
     */
    public function storeReview(StoreReviewRequest $request, string $slug)
    {
        $place = $this->placeService->getPlaceBySlug($slug);

        if (!$place) {
            return response()->json(['message' => 'Không tìm thấy địa điểm'], 404);
        }

        try {
            $review = $this->reviewService->createReview(
                auth()->user(),
                $place->id,
                $request->rating,
                $request->comment,
            );

            return response()->json([
                'message' => 'Đánh giá thành công!',
                'data'    => new ReviewResource($review),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
