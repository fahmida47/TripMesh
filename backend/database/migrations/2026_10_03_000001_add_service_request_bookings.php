<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['travel_request_id']);
            $table->dropUnique(['travel_request_id']);
            $table->foreignId('travel_request_id')->nullable()->change();
            $table->date('from_date')->nullable()->change();
            $table->date('to_date')->nullable()->change();
            $table->foreignId('service_request_id')
                ->nullable()
                ->unique()
                ->constrained('service_requests')
                ->cascadeOnDelete();
            $table->unique('travel_request_id');
            $table->foreign('travel_request_id')
                ->references('id')
                ->on('travel_requests')
                ->cascadeOnDelete();
        });

        if (Schema::hasColumn('bookings', 'travel_date')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->date('travel_date')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        if (DB::table('bookings')->whereNotNull('service_request_id')->exists()) {
            throw new RuntimeException(
                'Cannot roll back service request bookings while accepted service requests have bookings.'
            );
        }

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['service_request_id']);
            $table->dropUnique(['service_request_id']);
            $table->dropColumn('service_request_id');
            $table->dropForeign(['travel_request_id']);
            $table->dropUnique(['travel_request_id']);
            $table->foreignId('travel_request_id')->nullable(false)->change();
            $table->date('from_date')->nullable(false)->change();
            $table->date('to_date')->nullable(false)->change();
            $table->unique('travel_request_id');
            $table->foreign('travel_request_id')
                ->references('id')
                ->on('travel_requests')
                ->cascadeOnDelete();
        });

        if (Schema::hasColumn('bookings', 'travel_date')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->date('travel_date')->nullable(false)->change();
            });
        }
    }
};
