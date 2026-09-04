<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // The payments table is defined by 2026_09_04_032917.
        // Keep this historical migration as a no-op so fresh migrations do
        // not attempt to create the same table twice.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // See up().
    }
};
