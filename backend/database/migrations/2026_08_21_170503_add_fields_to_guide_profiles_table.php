<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create guide_profiles and guide_experiences tables.
     */
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Guide Profiles
        |--------------------------------------------------------------------------
        */

        if (!Schema::hasTable('guide_profiles')) {
            Schema::create('guide_profiles', function (Blueprint $table) {
                $table->id();

                $table->foreignId('user_id')
                    ->constrained('users')
                    ->cascadeOnDelete();

                $table->string('company_name');
                $table->string('contact_person')->nullable();
                $table->text('bio')->nullable();
                $table->string('phone')->nullable();
                $table->string('email')->nullable();
                $table->string('address')->nullable();
                $table->string('profile_picture')->nullable();
                $table->string('cover_photo')->nullable();

                $table->timestamps();
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Guide Experiences
        |--------------------------------------------------------------------------
        */

        if (!Schema::hasTable('guide_experiences')) {
            Schema::create('guide_experiences', function (Blueprint $table) {
                $table->id();

                $table->foreignId('guide_profile_id')
                    ->constrained('guide_profiles')
                    ->cascadeOnDelete();

                $table->string('title');
                $table->text('description')->nullable();
                $table->string('photo')->nullable();

                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guide_experiences');
        Schema::dropIfExists('guide_profiles');
    }
};