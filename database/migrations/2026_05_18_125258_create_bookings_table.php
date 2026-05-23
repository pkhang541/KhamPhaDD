<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('bookings')) {
            return;
        }

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('place_id')->constrained()->cascadeOnDelete();
            $table->string('booking_code')->unique();
            $table->string('type')->default('visit'); // visit, tour, room, flight
            $table->date('check_in');
            $table->date('check_out')->nullable();
            $table->unsignedSmallInteger('guests')->default(1);
            $table->decimal('total_price', 15, 2)->default(0);
            $table->string('currency', 10)->default('VND');
            $table->decimal('original_price', 15, 2)->nullable();
            $table->string('coupon_code')->nullable();
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->string('status')->default('pending'); // pending, confirmed, cancelled, completed
            $table->string('payment_status')->default('unpaid'); // unpaid, paid, refunded
            $table->string('payment_method')->nullable(); // cash, card, momo, vnpay
            $table->text('notes')->nullable();
            $table->json('extras')->nullable(); // dịch vụ thêm
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
