<?php

namespace App\Http\Controllers;

use App\Models\Place;
use App\Models\Qa;
use Illuminate\Http\Request;

class QaController extends Controller
{
    /** Đăng câu hỏi hoặc câu trả lời */
    public function store(Request $request, Place $place)
    {
        $data = $request->validate([
            'content'   => 'required|string|min:5|max:2000',
            'parent_id' => 'nullable|exists:qas,id',
        ]);

        // Nếu là câu trả lời, xác nhận parent thuộc đúng địa điểm
        if (!empty($data['parent_id'])) {
            $parent = Qa::findOrFail($data['parent_id']);
            if ($parent->place_id !== $place->id) {
                return back()->withErrors(['content' => 'Câu hỏi không hợp lệ.']);
            }
        }

        Qa::create([
            'place_id'  => $place->id,
            'user_id'   => auth()->id(),
            'parent_id' => $data['parent_id'] ?? null,
            'content'   => $data['content'],
        ]);

        return back()->with('success', empty($data['parent_id']) ? 'Đã đăng câu hỏi!' : 'Đã đăng câu trả lời!');
    }

    /** Like câu hỏi/trả lời */
    public function like(Qa $qa)
    {
        $qa->increment('likes');
        return response()->json(['likes' => $qa->fresh()->likes]);
    }

    /** Xóa (chỉ chủ sở hữu hoặc admin) */
    public function destroy(Qa $qa)
    {
        $this->authorize('delete', $qa);
        $qa->delete();
        return back()->with('success', 'Đã xóa.');
    }
}
