<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('travel_requests', function (Blueprint $table) {
            $table->foreignId('tour_service_id')
                ->nullable()
                ->after('guide_experience_id')
                ->constrained('tour_services')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('travel_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('tour_service_id');
        });
    }
};
