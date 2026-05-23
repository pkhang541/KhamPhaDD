<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlaceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name'           => 'required|string|max:255',
            'description'    => 'required|string|max:5000',
            'address'        => 'required|string|max:255',
            'image'          => 'nullable',
            'image_url'      => 'nullable',
            'image_file'     => 'nullable|image|max:10240',
            'gallery'        => 'nullable|array',
            'gallery.*'      => 'nullable|string',
            'gallery_files'  => 'nullable|array',
            'gallery_files.*'=> 'nullable|image|max:10240',
            'category_id'    => 'nullable|exists:categories,id',
            'city_id'        => 'required|exists:cities,id',
            'category_ids'   => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
            'avg_rating'     => 'nullable|numeric|min:0|max:5',
            'latitude'       => 'nullable|numeric|between:-90,90',
            'longitude'      => 'nullable|numeric|between:-180,180',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'         => 'Vui lòng nhập tên địa điểm.',
            'description.required'  => 'Vui lòng nhập mô tả.',
            'address.required'      => 'Vui lòng nhập địa chỉ.',
            'image.url'             => 'URL ảnh không hợp lệ.',
            'city_id.required'      => 'Vui lòng chọn thành phố/tỉnh.',
            'category_ids.required' => 'Vui lòng chọn ít nhất một danh mục.',
            'category_ids.min'      => 'Vui lòng chọn ít nhất một danh mục.',
            'avg_rating.min'        => 'Số sao không được nhỏ hơn 0.',
            'avg_rating.max'        => 'Số sao không được lớn hơn 5.',
        ];
    }
}
