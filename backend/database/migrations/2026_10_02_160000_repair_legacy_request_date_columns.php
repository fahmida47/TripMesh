<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['travel_requests', 'bookings'] as $tableName) {
            if (!Schema::hasColumn($tableName, 'from_date')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->date('from_date')->nullable();
                });
            }

            if (!Schema::hasColumn($tableName, 'to_date')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->date('to_date')->nullable();
                });
            }

            if (Schema::hasColumn($tableName, 'travel_date')) {
                DB::table($tableName)->whereNull('from_date')->update([
                    'from_date' => DB::raw('travel_date'),
                ]);
                DB::table($tableName)->whereNull('to_date')->update([
                    'to_date' => DB::raw('travel_date'),
                ]);
            }
        }
    }

    public function down(): void
    {
        // Keep the repaired date columns so rolling back this migration cannot
        // discard date values needed by existing requests and bookings.
    }
};
