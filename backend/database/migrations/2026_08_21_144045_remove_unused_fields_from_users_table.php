<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite cannot drop an indexed column until the index is removed.
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_email_unique');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'email',
                'email_verified_at',
                'password',
                'remember_token',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->rememberToken();
        });
    }
};
