<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Review;
use App\Models\Qa;
use App\Models\Place;
use App\Services\FavoriteService;
use App\Services\PlaceService;
use App\Services\RecommendationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlaceController extends Controller
{
    public function __construct(
        protected PlaceService $placeService,
        protected RecommendationService $recommendationService,
        protected FavoriteService $favoriteService
    ) {}

    /**
     * Trang chủ.
     */
    public function home()
    {
        $featuredPlaces = $this->placeService->getPlaces(['sort' => 'rating', 'limit' => 3])->items();
        $recentPlaces = $this->placeService->getPlaces(['sort' => 'newest', 'limit' => 3])->items();
        $categories = $this->placeService->getCategories();
        $cities = $this->placeService->getCities();

        return Inertia::render('Home', compact('featuredPlaces', 'recentPlaces', 'categories', 'cities'));
    }

    /**
     * Tìm kiếm địa điểm.
     */
    public function search(Request $request)
    {
        $search = $request->get('search', $request->get('q', ''));
        $filters = [
            'search'      => $search,
            'city_id'     => $request->get('city_id'),
            'category_id' => $request->get('category_id'),
            'min_rating'  => $request->get('min_rating'),
            'max_rating'  => $request->get('max_rating'),
            'amenities'   => $request->get('amenities', []),
            'sort'        => $request->get('sort', 'newest'),
        ];

        $places     = $this->placeService->getPlaces($filters);
        $cities     = $this->placeService->getCities();
        $categories = $this->placeService->getCategories();

        $activeTrip = null;
        if ($request->has('trip_id')) {
            $activeTrip = \App\Models\Trip::with('tripPlaces')->find($request->get('trip_id'));
        }

        return Inertia::render('Places/Search', compact('places', 'search', 'cities', 'categories', 'activeTrip'));
    }

    /**
     * Danh sách theo Category.
     */
    public function category(string $slug, Request $request)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $filters = $request->only(['search', 'sort']);
        $filters['category_id'] = $category->id;

        $places = $this->placeService->getPlaces($filters);

        return Inertia::render('Places/Index', compact('category', 'places'));
    }

    /**
     * Chi tiết địa điểm (kèm Q&A).
     */
    public function show(string $slug)
    {
        $place = $this->placeService->getPlaceBySlug($slug);

        if (!$place) abort(404);

        $this->placeService->incrementView($place->id);

        $isFavorite = $this->favoriteService->isFavorite($place->id);
        $userReview = auth()->check()
            ? Review::where('user_id', auth()->id())->where('place_id', $place->id)->first()
            : null;

        $similarPlaces = $this->placeService->getSimilarPlaces($place);

        // Q&A – chỉ lấy câu hỏi gốc kèm câu trả lời
        $qas = Qa::where('place_id', $place->id)
            ->whereNull('parent_id')
            ->with(['user:id,name', 'answers.user:id,name'])
            ->latest()
            ->get();
        
        return Inertia::render('Places/Show', compact('place', 'isFavorite', 'userReview', 'similarPlaces', 'qas'));
    }

    /**
     * Hiển thị bản đồ.
     */
    public function map()
    {
        $places = $this->placeService->getPlacesForMap();
        $categories = $this->placeService->getCategories();
        
        return Inertia::render('Places/Map', compact('places', 'categories'));
    }

    /**
     * Lưu địa điểm mới do người dùng khám phá.
     */
    public function storeDiscovery(\App\Http\Requests\StoreDiscoveryRequest $request)
    {
        if (!auth()->user()?->isAdmin()) {
            abort(403, 'Chỉ tài khoản Admin mới có quyền thêm địa điểm.');
        }

        $data = $request->validated();

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $uploadPath = public_path('uploads');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }
            $file->move($uploadPath, $filename);
            $data['image'] = '/uploads/' . $filename;
        } else {
            $data['image'] = $data['image_url'] ?? $data['image'] ?? null;
        }

        // Gallery
        $gallery = $data['gallery'] ?? [];
        if ($request->hasFile('gallery_files')) {
            $uploadPath = public_path('uploads');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }
            foreach ($request->file('gallery_files') as $gFile) {
                $gFilename = time() . '_' . uniqid() . '_' . $gFile->getClientOriginalName();
                $gFile->move($uploadPath, $gFilename);
                $gallery[] = '/uploads/' . $gFilename;
            }
        }
        $data['gallery'] = $gallery;

        unset($data['image_url']);
        unset($data['image_file']);
        unset($data['gallery']);
        unset($data['gallery_files']);

        $slug = \Illuminate\Support\Str::slug($request->name) . '-' . uniqid();
        $data['slug'] = $slug;
        $data['category_id'] = (int) ($data['category_ids'][0] ?? null);
        $data['avg_rating'] = 0;
        $data['view_count'] = 0;

        $place = \App\Models\Place::create($data);
        $place->gallery = $gallery;
        $place->save();

        \Illuminate\Support\Facades\Cache::flush();
        $this->recommendationService->bustCache();

        return back()->with('success', 'Cảm ơn bạn đã đóng góp địa điểm mới!');
    }

    /**
     * Predictive search (typeahead) – trả về JSON.
     */
    public function autocomplete(Request $request)
    {
        $q = $request->get('q', '');
        if (strlen(trim($q)) < 2) {
            return response()->json([]);
        }

        $results = Place::query()
            ->select(['id', 'name', 'slug', 'image', 'address', 'category_id'])
            ->with('category:id,name,icon')
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('address', 'like', "%{$q}%");
            })
            ->whereNull('deleted_at')
            ->limit(8)
            ->get()
            ->map(fn($p) => [
                'id'       => $p->id,
                'name'     => $p->name,
                'slug'     => $p->slug,
                'image'    => $p->image,
                'address'  => $p->address,
                'category' => $p->category?->name,
                'icon'     => $p->category?->icon,
            ]);

        return response()->json($results);
    }

    /**
     * Cập nhật tọa độ của một địa điểm.
     */
    public function updateCoordinates(\Illuminate\Http\Request $request, Place $place)
    {
        if (!auth()->user()?->isAdmin()) {
            abort(403, 'Chỉ tài khoản Admin mới có quyền cập nhật tọa độ.');
        }

        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $place->update([
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return back()->with('success', 'Đã cập nhật tọa độ địa điểm thành công!');
    }
}
