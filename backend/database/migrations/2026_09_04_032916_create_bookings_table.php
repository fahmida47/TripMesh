<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('travel_request_id')
                ->unique()
                ->constrained('travel_requests')
                ->cascadeOnDelete();

            $table->foreignId('tourist_profile_id')
                ->constrained('tourist_profiles')
                ->cascadeOnDelete();

            $table->foreignId('guide_profile_id')
                ->constrained('guide_profiles')
                ->cascadeOnDelete();

            $table->foreignId('guide_experience_id')
                ->nullable()
                ->constrained('guide_experiences')
                ->nullOnDelete();

            $table->date('travel_date');

            $table->decimal('amount', 10, 2)
                ->default(0);

            $table->string('status')
                ->default('pending_payment');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};