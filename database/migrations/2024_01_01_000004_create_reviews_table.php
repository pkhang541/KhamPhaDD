<?php
// database/migrations/2024_01_01_000003_create_reviews_table.php
// Bảng đánh giá: mỗi user chỉ có 1 review/địa điểm

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade')
                ->comment('Người viết review');
            
            $table->foreignId('place_id')
                ->constrained('places')
                ->onDelete('cascade')
                ->comment('Địa điểm được đánh giá');
            
            $table->unsignedTinyInteger('rating')->comment('Điểm từ 1 đến 5');
            $table->text('comment')->nullable()->comment('Bình luận chi tiết');
            
            // Mỗi user chỉ review 1 lần/địa điểm
            $table->unique(['user_id', 'place_id']);
            
            // Index để tìm reviews của địa điểm
            $table->index('place_id');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
