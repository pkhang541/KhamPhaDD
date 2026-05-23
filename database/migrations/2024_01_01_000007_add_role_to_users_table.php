<?php
// database/migrations/2024_01_01_000007_add_role_to_users_table.php
// Thêm cột role để phân biệt admin và user thường

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'user'])->default('user')->after('password')->comment('Vai trò: admin hoặc user thường');
            $table->softDeletes()->comment('Xóa mềm để giữ dữ liệu lịch sử');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'deleted_at']);
        });
    }
};
