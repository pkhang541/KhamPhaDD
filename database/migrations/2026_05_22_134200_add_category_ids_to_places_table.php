<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('places', function (Blueprint $table) {
            $table->json('category_ids')->nullable()->after('category_id')->comment('Danh sách nhiều danh mục');
        });

        // Di chuyển category_id hiện tại vào category_ids dưới dạng mảng
        \App\Models\Place::all()->each(function ($place) {
            if ($place->category_id) {
                $place->category_ids = [$place->category_id];
                $place->save();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('places', function (Blueprint $table) {
            $table->dropColumn('category_ids');
        });
    }
};
