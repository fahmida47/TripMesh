<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('travel_requests', function (Blueprint $table) {
            $table->id();

            // Tourist who sent the request
            $table->foreignId('tourist_profile_id')
                ->constrained('tourist_profiles')
                ->cascadeOnDelete();

            // Guide who will receive the request
            $table->foreignId('guide_profile_id')
                ->constrained('guide_profiles')
                ->cascadeOnDelete();

            // Optional: selected guide experience/tour
            $table->foreignId('guide_experience_id')
                ->nullable()
                ->constrained('guide_experiences')
                ->nullOnDelete();

            // Requested travel date
            $table->date('travel_date');

            // Requested tour amount
            $table->decimal('amount', 10, 2)->default(0);

            // Additional request information from tourist
            $table->text('request_details')->nullable();

            // pending, accepted, rejected, cancelled
            $table->string('status')->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('travel_requests');
    }
};