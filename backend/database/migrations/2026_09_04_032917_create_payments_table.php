<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('booking_id')
                ->unique()
                ->constrained('bookings')
                ->cascadeOnDelete();

            $table->string('method')
                ->nullable();

            $table->string('account_number')
                ->nullable();

            $table->dateTime('payment_date_time')
                ->nullable();

            $table->decimal('amount', 10, 2)
                ->default(0);

            $table->string('status')
                ->default('pending');

            $table->string('transaction_reference')
                ->nullable();

            $table->dateTime('paid_at')
                ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};