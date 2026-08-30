<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guide_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('guide_profiles', 'price')) {
                $table->decimal('price', 10, 2)->default(0);
            }

            if (!Schema::hasColumn('guide_profiles', 'rating')) {
                $table->decimal('rating', 3, 2)->default(0);
            }

            if (!Schema::hasColumn('guide_profiles', 'reviews')) {
                $table->unsignedInteger('reviews')->default(0);
            }

            if (!Schema::hasColumn('guide_profiles', 'popularity')) {
                $table->unsignedInteger('popularity')->default(0);
            }

            if (!Schema::hasColumn('guide_profiles', 'tour_types')) {
                $table->json('tour_types')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('guide_profiles', function (Blueprint $table) {
            $columns = [];

            foreach ([
                'price',
                'rating',
                'reviews',
                'popularity',
                'tour_types',
            ] as $column) {
                if (Schema::hasColumn('guide_profiles', $column)) {
                    $columns[] = $column;
                }
            }

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};