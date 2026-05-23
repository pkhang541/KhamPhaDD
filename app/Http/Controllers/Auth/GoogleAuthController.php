<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'credential' => 'required|string',
        ]);

        $token = $request->credential;

        // Xác thực token thông qua Google API
        $response = Http::get("https://oauth2.googleapis.com/tokeninfo?id_token={$token}");

        if ($response->failed()) {
            return response()->json(['message' => 'Token không hợp lệ'], 401);
        }

        $data = $response->json();

        // Kiểm tra xem token có hợp lệ và có email không
        if (!isset($data['email'])) {
            return response()->json(['message' => 'Không thể lấy thông tin email từ Google'], 401);
        }

        // Tìm user theo email, nếu chưa có thì tạo mới
        $user = User::firstOrCreate(
            ['email' => $data['email']],
            [
                'name' => $data['name'] ?? 'Google User',
                'password' => bcrypt(Str::random(24)),
                'email_verified_at' => now(),
            ]
        );

        // Đăng nhập user vào hệ thống
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'redirect' => route('home')
        ]);
    }

    public function storeFacebook(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
        ]);

        try {
            $facebookUser = Socialite::driver('facebook')->userFromToken($request->access_token);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Facebook Login Error: ' . $e->getMessage());
            return response()->json(['message' => 'Token Facebook không hợp lệ: ' . $e->getMessage()], 401);
        }

        $email = $facebookUser->getEmail();
        if (!$email) {
            $email = $facebookUser->getId() . '@facebook.com';
        }

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $facebookUser->getName() ?? 'Facebook User',
                'password' => bcrypt(Str::random(24)),
                'email_verified_at' => now(),
            ]
        );

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'redirect' => route('home')
        ]);
    }
}
