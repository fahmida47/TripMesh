<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('travel_requests', function (Blueprint $table) {
            $table->date('from_date')->nullable()->change();
            $table->date('to_date')->nullable()->change();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->date('from_date')->nullable()->change();
            $table->date('to_date')->nullable()->change();
        });
    }

    public function down(): void
    {
        $today = now()->toDateString();

        DB::table('travel_requests')->whereNull('from_date')->update(['from_date' => $today]);
        DB::table('travel_requests')->whereNull('to_date')->update(['to_date' => $today]);
        DB::table('bookings')->whereNull('from_date')->update(['from_date' => $today]);
        DB::table('bookings')->whereNull('to_date')->update(['to_date' => $today]);

        Schema::table('travel_requests', function (Blueprint $table) {
            $table->date('from_date')->nullable(false)->change();
            $table->date('to_date')->nullable(false)->change();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->date('from_date')->nullable(false)->change();
            $table->date('to_date')->nullable(false)->change();
        });
    }
};
