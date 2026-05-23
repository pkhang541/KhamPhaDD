<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('uid', 10)->nullable()->unique()->after('id');
        });

        DB::table('users')
            ->whereNull('uid')
            ->orderBy('id')
            ->each(function (object $user): void {
                do {
                    $uid = (string) random_int(1000000000, 9999999999);
                } while (DB::table('users')->where('uid', $uid)->exists());

                DB::table('users')->where('id', $user->id)->update(['uid' => $uid]);
            });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['uid']);
            $table->dropColumn('uid');
        });
    }
};
