<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')
            ->select('id', 'uid')
            ->orderBy('id')
            ->each(function (object $user): void {
                if (is_string($user->uid) && preg_match('/^[0-9]{10}$/', $user->uid) === 1) {
                    return;
                }

                do {
                    $uid = (string) random_int(1000000000, 9999999999);
                } while (DB::table('users')->where('uid', $uid)->exists());

                DB::table('users')->where('id', $user->id)->update(['uid' => $uid]);
            });
    }

    public function down(): void
    {
        //
    }
};
