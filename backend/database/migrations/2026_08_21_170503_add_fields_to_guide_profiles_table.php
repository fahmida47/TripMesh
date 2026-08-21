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
        Schema::table('guide_experiences', function (Blueprint $table) {
            $table->foreignId('guide_profile_id')
                ->after('id')
                ->constrained('guide_profiles')
                ->cascadeOnDelete();

            $table->string('title')->after('guide_profile_id');

            $table->text('description')->nullable()->after('title');

            $table->string('photo')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guide_experiences', function (Blueprint $table) {
            $table->dropForeign(['guide_profile_id']);
            $table->dropColumn([
                'guide_profile_id',
                'title',
                'description',
                'photo',
            ]);
        });
    }
};