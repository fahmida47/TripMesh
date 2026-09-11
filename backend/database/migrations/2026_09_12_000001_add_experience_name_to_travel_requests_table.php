<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('travel_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('travel_requests', 'experience_name')) {
                $table->string('experience_name')->nullable()->after('guide_experience_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('travel_requests', function (Blueprint $table) {
            if (Schema::hasColumn('travel_requests', 'experience_name')) {
                $table->dropColumn('experience_name');
            }
        });
    }
};
