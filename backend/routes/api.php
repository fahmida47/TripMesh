<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Guide\GuideExperienceController;
use App\Http\Controllers\Guide\GuideProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/send-code', [AuthController::class, 'sendCode']);

Route::post('/auth/verify-code', [AuthController::class, 'verifyCode']);

Route::post('/auth/register', [AuthController::class, 'register']);

/*
|--------------------------------------------------------------------------
| Protected Authentication Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')->group(function () {

    Route::get('/auth/user', [AuthController::class, 'user']);

    Route::post('/auth/logout', [AuthController::class, 'logout']);

});

/*
|--------------------------------------------------------------------------
| Guide Profile Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
    ->prefix('guide/profile')
    ->group(function () {

        // Get guide profile
        Route::get('/', [
            GuideProfileController::class,
            'show'
        ]);

        // Update guide profile
        Route::put('/', [
            GuideProfileController::class,
            'update'
        ]);

        // Upload profile picture
        Route::post('/profile-picture', [
            GuideProfileController::class,
            'uploadProfilePicture'
        ]);

        // Upload cover photo
        Route::post('/cover-photo', [
            GuideProfileController::class,
            'uploadCoverPhoto'
        ]);

        // Add experience
        Route::post('/experiences', [
            GuideExperienceController::class,
            'store'
        ]);

        // Update experience
        Route::put('/experiences/{id}', [
            GuideExperienceController::class,
            'update'
        ]);

        // Delete experience
        Route::delete('/experiences/{id}', [
            GuideExperienceController::class,
            'destroy'
        ]);
    });