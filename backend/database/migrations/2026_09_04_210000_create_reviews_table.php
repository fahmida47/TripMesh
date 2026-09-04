<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('tourist_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('guide_profile_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->text('review');
            $table->timestamp('submitted_at');
            $table->timestamps();

            $table->index(['tourist_profile_id', 'submitted_at']);
            $table->index(['guide_profile_id', 'submitted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
