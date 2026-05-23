<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->unsignedTinyInteger('members')->default(2)->after('budget');
            $table->time('return_time')->nullable()->after('members'); // Giờ về (chuyến 1 ngày)
        });
    }

    public function down(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->dropColumn(['members', 'return_time']);
        });
    }
};
