<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlaceRequest;
use App\Models\Category;
use App\Models\City;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminPlaceController extends Controller
{
    public function __construct(
        protected \App\Services\RecommendationService $recommendationService
    ) {}
    /**
     * Danh sách tất cả địa điểm (kể cả soft-deleted).
     */
    public function index(Request $request)
    {
        $query = Place::withTrashed()->with(['category', 'city'])->latest();

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        $places = $query->paginate(15)->withQueryString();

        $stats = [
            'total' => Place::withTrashed()->count(),
            'active' => Place::count(),
            'archived' => Place::onlyTrashed()->count(),
            'categories' => Category::count(),
        ];

        return Inertia::render('Admin/Places/Index', compact('places', 'stats'));
    }

    /**
     * Form tạo địa điểm mới.
     */
    public function create()
    {
        $categories = Category::all();
        $cities = City::all();
        return Inertia::render('Admin/Places/Create', compact('categories', 'cities'));
    }

    public function store(StorePlaceRequest $request)
    {
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
        
        $data['slug'] = Str::slug($data['name']) . '-' . Str::random(4);
        $data['amenities'] = $request->input('amenities', []);
        
        // Gán category_id chính là phần tử đầu tiên của category_ids để tương thích ngược
        $data['category_id'] = (int) ($data['category_ids'][0] ?? null);

        $place = Place::create($data);
        
        // Laravel array cast update
        $place->gallery = $gallery;
        $place->save();

        Cache::forget('categories.all');
        $this->recommendationService->bustCache();

        return redirect()->route('places.search')
            ->with('success', "✅ Đã thêm địa điểm \"{$data['name']}\" thành công!");
    }

    /**
     * Form chỉnh sửa địa điểm.
     */
    public function edit(Place $place)
    {
        $categories = Category::all();
        $cities = City::all();
        return Inertia::render('Admin/Places/Edit', compact('place', 'categories', 'cities'));
    }

    public function update(StorePlaceRequest $request, Place $place)
    {
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
        
        $data['amenities'] = $request->input('amenities', []);
        
        // Gán category_id chính là phần tử đầu tiên của category_ids để tương thích ngược
        $data['category_id'] = (int) ($data['category_ids'][0] ?? null);
        
        $place->update($data);
        
        // Laravel array cast update
        $place->gallery = $gallery;
        $place->save();

        $this->recommendationService->bustCache($place->category_id);
        Cache::forget('places.map');

        return redirect()->route('places.search')
            ->with('success', "✅ Đã cập nhật \"{$place->name}\" thành công!");
    }

    /**
     * Xóa mềm địa điểm.
     */
    public function destroy(Place $place)
    {
        $name = $place->name;
        $place->delete();

        $this->recommendationService->bustCache($place->category_id);

        return redirect()->route('admin.places.index')
            ->with('success', "🗑️ Đã xóa \"{$name}\".");
    }

    /**
     * Khôi phục địa điểm đã xóa mềm.
     */
    public function restore(int $id)
    {
        $place = Place::withTrashed()->findOrFail($id);
        $place->restore();

        return redirect()->route('admin.places.index')
            ->with('success', "♻️ Đã khôi phục \"{$place->name}\".");
    }
}
