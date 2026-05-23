<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\TripPlace;
use App\Models\Place;
use App\Models\City;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TripController extends Controller
{
    use AuthorizesRequests;
    /** Danh sách chuyến đi của user */
    public function index()
    {
        $trips = auth()->user()->trips()
            ->withCount('tripPlaces')
            ->latest()
            ->get();

        // Truyền sẵn danh sách địa điểm để chọn ngay khi tạo
        $places = Place::with(['category', 'city'])
            ->select(['id', 'name', 'slug', 'image', 'address', 'category_id', 'city_id', 'avg_rating', 'latitude', 'longitude'])
            ->orderByDesc('is_featured')
            ->orderByDesc('created_at')
            ->limit(500)
            ->get();

        $cities = City::orderBy('name')->select('id', 'name')->get();

        return Inertia::render('Trips/Index', compact('trips', 'places', 'cities'));
    }

    /** Tạo chuyến đi mới (kèm địa điểm nếu chọn) */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:150',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'departure_time' => 'nullable|date_format:H:i',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'cover_image_url' => 'nullable|url|max:2048',
            'currency'    => 'nullable|string|max:10',
            'budget'      => 'nullable|numeric|min:0',
            'members'     => 'nullable|integer|min:1|max:200',
            'return_time' => 'nullable|date_format:H:i',
            'is_public'   => 'boolean',
            'place_ids'   => 'nullable|array',
            'place_ids.*' => 'integer|distinct|exists:places,id',
            'invited_emails' => 'nullable|array|max:199',
            'invited_emails.*' => [
                'required',
                'email',
                'distinct',
                'exists:users,email',
                Rule::notIn([auth()->user()->email]),
            ],
            'trip_places' => 'nullable|array',
            'trip_places.*.place_id' => 'required|integer|exists:places,id',
            'trip_places.*.day_number' => 'required|integer|min:1',
            'trip_places.*.order' => 'required|integer|min:0',
            'trip_places.*.visit_time' => 'nullable|string',
            'trip_places.*.duration_minutes' => 'nullable|integer',
            'trip_places.*.note' => 'nullable|string',
        ]);

        $this->validateDepartureTime($data);

        $placeIds = $data['place_ids'] ?? [];
        $tripPlacesData = $data['trip_places'] ?? [];
        if (empty($placeIds) && empty($tripPlacesData)) {
            throw ValidationException::withMessages([
                'place_ids' => 'Vui lòng chọn ít nhất một địa điểm trước khi lưu chuyến đi.',
            ]);
        }

        $invitedEmails = $data['invited_emails'] ?? [];
        $coverImageUrl = $data['cover_image_url'] ?? null;
        unset($data['place_ids'], $data['trip_places'], $data['invited_emails'], $data['cover_image_url']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('trips/covers', 'public');
        } elseif ($coverImageUrl) {
            $data['cover_image'] = $coverImageUrl;
        }

        $data['status'] = 'planned';
        $data['members'] = max((int) ($data['members'] ?? 1), count($invitedEmails) + 1);
        $trip = auth()->user()->trips()->create($data);

        if (!empty($tripPlacesData)) {
            foreach ($tripPlacesData as $tp) {
                $trip->tripPlaces()->create([
                    'place_id'   => $tp['place_id'],
                    'day_number' => $tp['day_number'],
                    'order'      => $tp['order'],
                    'visit_time' => $tp['visit_time'] ?? null,
                    'duration_minutes' => $tp['duration_minutes'] ?? 60,
                    'note'       => $tp['note'] ?? null,
                ]);
            }
        } else {
            // Tạo trip_places cho các địa điểm đã chọn (mặc định ngày 1)
            foreach ($placeIds as $order => $placeId) {
                $trip->tripPlaces()->create([
                    'place_id'   => $placeId,
                    'day_number' => 1,
                    'order'      => $order,
                ]);
            }
        }

        return redirect()->route('trips.show', $trip)->with('success', 'Đã tạo chuyến đi!');
    }

    /** Chi tiết + builder */
    public function show(Trip $trip)
    {
        if ($trip->user_id !== auth()->id() && !$trip->is_public) {
            abort(403, 'Bạn không có quyền xem chuyến đi này.');
        }

        $trip->load(['tripPlaces.place.category', 'user']);

        $places = Place::with(['category'])
            ->select(['id', 'name', 'slug', 'image', 'address', 'category_id', 'avg_rating'])
            ->limit(200)
            ->get();

        return Inertia::render('Trips/Show', compact('trip', 'places'));
    }

    /** Trang chỉnh sửa toàn bộ chuyến đi */
    public function edit(Trip $trip)
    {
        if ($trip->user_id !== auth()->id()) abort(403);
        $trip->load(['tripPlaces.place.category', 'tripPlaces.place.city']);

        $places = Place::with(['category', 'city'])
            ->select(['id', 'name', 'slug', 'image', 'address', 'category_id', 'city_id', 'avg_rating'])
            ->limit(200)
            ->get();

        return Inertia::render('Trips/Edit', compact('trip', 'places'));
    }

    /** Cập nhật thông tin chuyến đi */
    public function update(Request $request, Trip $trip)
    {
        if ($trip->user_id !== auth()->id()) abort(403);

        $data = $request->validate([
            'title'       => 'sometimes|string|max:150',
            'description' => 'nullable|string',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'departure_time' => 'nullable|date_format:H:i',
            'currency'    => 'nullable|string|max:10',
            'budget'      => 'nullable|numeric|min:0',
            'members'     => 'nullable|integer|min:1|max:200',
            'return_time' => 'nullable|date_format:H:i',
            'is_public'   => 'boolean',
            'status'      => 'nullable|in:draft,planned,completed',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $this->validateDepartureTime($data);

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('trips/covers', 'public');
            $data['cover_image'] = $path;
        }

        $trip->update($data);

        return back()->with('success', 'Đã cập nhật chuyến đi!');
    }

    /** Xóa chuyến đi */
    public function destroy(Trip $trip)
    {
        if ($trip->user_id !== auth()->id()) abort(403);
        $trip->delete();
        return redirect()->route('trips.index')->with('success', 'Đã xóa chuyến đi.');
    }

    /** Xóa nhiều chuyến đi cùng lúc */
    public function batchDestroy(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:trips,id',
        ]);

        $count = auth()->user()->trips()
            ->whereIn('id', $request->ids)
            ->delete();

        return redirect()->route('trips.index')->with('success', "Đã xóa {$count} chuyến đi.");
    }

    /** Thêm địa điểm vào chuyến đi */
    public function addPlace(Request $request, Trip $trip)
    {
        if ($trip->user_id !== auth()->id()) abort(403);

        $data = $request->validate([
            'place_id'         => 'required|exists:places,id',
            'day_number'       => 'required|integer|min:1|max:30',
            'order'            => 'nullable|integer|min:0',
            'note'             => 'nullable|string|max:500',
            'visit_time'       => 'nullable|date_format:H:i',
            'duration_minutes' => 'nullable|integer|min:10|max:1440',
        ]);

        if (!isset($data['order'])) {
            $data['order'] = $trip->tripPlaces()
                ->where('day_number', $data['day_number'])
                ->count();
        }

        $tp = $trip->tripPlaces()->create($data);
        $tp->load('place.category', 'place.city');

        return back()->with('success', 'Đã thêm địa điểm!');
    }

    /** Xóa địa điểm khỏi chuyến đi */
    public function removePlace(Trip $trip, TripPlace $tripPlace)
    {
        if ($trip->user_id !== auth()->id()) abort(403);
        $tripPlace->delete();
        return back()->with('success', 'Đã xóa địa điểm.');
    }

    /** Cập nhật giờ ghé thăm và thời gian ở lại */
    public function updatePlaceTime(Request $request, Trip $trip, TripPlace $tripPlace)
    {
        if ($trip->user_id !== auth()->id()) abort(403);

        $data = $request->validate([
            'visit_time'       => 'nullable|date_format:H:i',
            'duration_minutes' => 'nullable|integer|min:5|max:1440',
        ]);

        $tripPlace->update($data);

        return back()->with('success', 'Đã cập nhật giờ ghé thăm.');
    }

    /** Reorder địa điểm (drag-drop / move up-down) */
    public function reorderPlaces(Request $request, Trip $trip)
    {
        if ($trip->user_id !== auth()->id()) abort(403);

        $request->validate([
            'items'              => 'required|array',
            'items.*.id'         => 'required|integer',
            'items.*.day_number' => 'required|integer|min:1',
            'items.*.order'      => 'required|integer|min:0',
        ]);

        foreach ($request->items as $item) {
            TripPlace::where('id', $item['id'])
                ->where('trip_id', $trip->id)
                ->update([
                    'day_number' => $item['day_number'],
                    'order'      => $item['order'],
                ]);
        }

        return response()->json(['ok' => true]);
    }

    private function validateDepartureTime(array $data): void
    {
        if (empty($data['start_date']) || empty($data['departure_time'])) {
            return;
        }

        $today = Carbon::today(config('app.timezone'))->toDateString();
        if ($data['start_date'] !== $today) {
            return;
        }

        $now = Carbon::now(config('app.timezone'))->format('H:i');
        if ($data['departure_time'] < $now) {
            throw ValidationException::withMessages([
                'departure_time' => 'Giờ xuất phát không được nhỏ hơn giờ hiện tại.',
            ]);
        }
    }
}
