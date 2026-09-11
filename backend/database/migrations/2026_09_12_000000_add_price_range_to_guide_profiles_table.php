<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guide_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('guide_profiles', 'min_price')) {
                $table->decimal('min_price', 10, 2)->nullable()->after('price');
            }

            if (!Schema::hasColumn('guide_profiles', 'max_price')) {
                $table->decimal('max_price', 10, 2)->nullable()->after('min_price');
            }
        });
    }

    public function down(): void
    {
        Schema::table('guide_profiles', function (Blueprint $table) {
            $columns = [];

            foreach (['min_price', 'max_price'] as $column) {
                if (Schema::hasColumn('guide_profiles', $column)) {
                    $columns[] = $column;
                }
            }

            if ($columns) {
                $table->dropColumn($columns);
            }
        });
    }
};
