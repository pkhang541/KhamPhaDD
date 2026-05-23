<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDiscoveryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['exists:categories,id'],
            'city_id' => ['required', 'exists:cities,id'],
            'address' => ['required', 'string'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'description' => ['nullable', 'string', 'max:1000'],
            'image' => ['nullable', 'string'],
            'image_file' => ['nullable', 'image', 'max:10240'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['nullable', 'string'],
            'gallery_files' => ['nullable', 'array'],
            'gallery_files.*' => ['nullable', 'image', 'max:10240'],
        ];
    }

    /**
     * Tùy chỉnh thông báo lỗi để hiển thị thân thiện trên UI.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập tên địa điểm.',
            'name.max' => 'Tên địa điểm không được vượt quá 255 ký tự.',
            'category_ids.required' => 'Vui lòng chọn ít nhất một danh mục.',
            'city_id.required' => 'Vui lòng chọn Thành phố / Tỉnh thành.',
            'city_id.exists' => 'Thành phố / Tỉnh thành được chọn không hợp lệ.',
            'address.required' => 'Vui lòng cung cấp địa chỉ.',
            'latitude.required' => 'Không xác định được tọa độ (vui lòng chọn trên bản đồ).',
            'longitude.required' => 'Không xác định được tọa độ (vui lòng chọn trên bản đồ).',
            'latitude.between' => 'Tọa độ không hợp lệ.',
            'longitude.between' => 'Tọa độ không hợp lệ.',
            'image_file.image' => 'Ảnh đại diện phải là định dạng hình ảnh.',
            'image_file.max' => 'Ảnh đại diện không được vượt quá 10MB.',
            'gallery_files.*.image' => 'Ảnh trong bộ sưu tập phải là định dạng hình ảnh.',
            'gallery_files.*.max' => 'Ảnh trong bộ sưu tập không được vượt quá 10MB.',
        ];
    }
}
