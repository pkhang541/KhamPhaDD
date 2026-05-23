<?php
// database/migrations/2024_01_01_000000_create_categories_table.php
// Bảng danh mục địa điểm: Học bài, Check-in, Chill, Giải trí

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Tên danh mục: Học bài, Check-in, Chill, Giải trí');
            $table->string('slug')->unique()->comment('URL slug, dùng cho route');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
