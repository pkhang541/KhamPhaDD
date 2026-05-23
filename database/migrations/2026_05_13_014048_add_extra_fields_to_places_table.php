<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('places', function (Blueprint $table) {
            $table->string('opening_hours')->nullable()->after('address');
            $table->string('price_range')->nullable()->after('opening_hours');
            $table->json('tags')->nullable()->after('price_range');
            $table->boolean('is_featured')->default(false)->after('avg_rating');
        });
    }

    public function down(): void
    {
        Schema::table('places', function (Blueprint $table) {
            $table->dropColumn(['opening_hours', 'price_range', 'tags', 'is_featured']);
        });
    }
};
