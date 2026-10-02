<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tour_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guide_profile_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->string('tour_type');
            $table->decimal('price', 10, 2);
            $table->string('duration');
            $table->unsignedSmallInteger('max_travelers');
            $table->string('image')->nullable();
            $table->timestamps();
            $table->index(['location', 'tour_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tour_services');
    }
};
