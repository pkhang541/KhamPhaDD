<?php
// database/migrations/2024_01_01_000005_create_favorites_table.php
// Bảng lưu trữ địa điểm yêu thích của user

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade')
                ->comment('User sở hữu yêu thích');
            
            $table->foreignId('place_id')
                ->constrained('places')
                ->onDelete('cascade')
                ->comment('Địa điểm được yêu thích');
            
            // Mỗi user chỉ favorite 1 lần/địa điểm
            $table->unique(['user_id', 'place_id']);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
