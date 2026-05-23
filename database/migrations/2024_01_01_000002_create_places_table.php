<?php
// database/migrations/2024_01_01_000001_create_places_table.php
// Bảng địa điểm TP.HCM: quán cà phê, thư viện, công viên, quán karaoke, v.v.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Tên địa điểm');
            $table->string('slug')->unique()->index()->comment('URL slug để SEO');
            $table->text('description')->comment('Mô tả chi tiết về địa điểm');
            $table->string('address')->comment('Địa chỉ chi tiết');
            $table->string('image')->nullable()->comment('URL ảnh đại diện');
            
            // Foreign key
            $table->foreignId('category_id')
                ->constrained('categories')
                ->onDelete('cascade')
                ->comment('FK đến bảng categories');
            
            // Metrics
            $table->unsignedBigInteger('view_count')->default(0)->index()->comment('Số lần xem');
            $table->decimal('avg_rating', 3, 2)->default(0.00)->index()->comment('Điểm trung bình (1-5)');
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('places');
    }
};
