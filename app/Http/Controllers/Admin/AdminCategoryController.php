<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::withCount('places')->latest()->get();
        return Inertia::render('Admin/Categories/Index', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255|unique:categories,name',
            'icon'        => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ], [
            'name.required' => 'Vui lòng nhập tên danh mục.',
            'name.unique'   => 'Tên danh mục này đã tồn tại.',
        ]);

        $data['slug'] = Str::slug($data['name']);

        Category::create($data);

        return redirect()->route('admin.categories.index')
            ->with('success', "✅ Đã thêm danh mục \"{$data['name']}\" thành công!");
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Edit', compact('category'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255|unique:categories,name,' . $category->id,
            'icon'        => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ], [
            'name.required' => 'Vui lòng nhập tên danh mục.',
            'name.unique'   => 'Tên danh mục này đã tồn tại.',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $category->update($data);

        return redirect()->route('admin.categories.index')
            ->with('success', "✅ Đã cập nhật danh mục \"{$data['name']}\" thành công!");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Kiểm tra nếu danh mục có địa điểm liên kết
        if ($category->places()->exists()) {
            return back()->with('error', "❌ Không thể xóa danh mục \"{$category->name}\" vì vẫn còn địa điểm trực thuộc danh mục này.");
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', "✅ Đã xóa danh mục thành công!");
    }
}
