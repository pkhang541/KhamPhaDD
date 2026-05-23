<?php
// app/Http/Controllers/ReviewController.php
// Controller: tạo, cập nhật, xóa review

namespace App\Http\Controllers;

use App\Models\Place;
use App\Models\Review;
use App\Http\Requests\StoreReviewRequest;
use App\Services\ReviewService;

class ReviewController extends Controller
{
    public function __construct(protected ReviewService $reviewService)
    {
    }

    /**
     * Tạo review cho place
     */
    public function store(StoreReviewRequest $request, Place $place)
    {
        try {
            $this->reviewService->createReview(
                auth()->user(),
                $place->id,
                $request->input('rating'),
                $request->input('comment'),
            );

            return redirect()
                ->route('places.show', $place->slug)
                ->with('success', 'Cảm ơn bạn đã đánh giá!');
        } catch (\Exception $e) {
            if ($e->getMessage() === 'Bạn đã đánh giá địa điểm này rồi') {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'review' => $e->getMessage(),
                ]);
            }

            return redirect()
                ->route('places.show', $place->slug)
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Cập nhật review
     */
    public function update(StoreReviewRequest $request, Review $review)
    {
        try {
            $this->reviewService->updateReview(
                $review,
                $request->input('rating'),
                $request->input('comment'),
                auth()->user(),
            );

            return redirect()
                ->route('places.show', $review->place->slug)
                ->with('success', 'Cập nhật đánh giá thành công!');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Xóa review
     */
    public function destroy(Review $review)
    {
        try {
            $place = $review->place;
            $this->reviewService->deleteReview($review, auth()->user());

            return redirect()
                ->route('places.show', $place->slug)
                ->with('success', 'Xóa đánh giá thành công!');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}
