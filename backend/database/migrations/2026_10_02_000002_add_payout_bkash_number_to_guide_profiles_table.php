<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guide_profiles', function (Blueprint $table) {
            $table->string('payout_bkash_number', 20)
                ->nullable()
                ->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('guide_profiles', function (Blueprint $table) {
            $table->dropColumn('payout_bkash_number');
        });
    }
};