<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Guide\GuideExperienceController;
use App\Http\Controllers\Guide\GuideProfileController;
use App\Http\Controllers\TouristProfileController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/send-code', [
    AuthController::class,
    'sendCode'
]);

Route::post('/auth/verify-code', [
    AuthController::class,
    'verifyCode'
]);

Route::post('/auth/register', [
    AuthController::class,
    'register'
]);


/*
|--------------------------------------------------------------------------
| Explore Guide Services
|--------------------------------------------------------------------------
|
| Public route
| Server-side search + filtering + sorting + pagination
|
*/

Route::get('/guides/explore', [
    GuideProfileController::class,
    'explore'
]);


/*
|--------------------------------------------------------------------------
| Protected Authentication Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')->group(function () {

    Route::get('/auth/user', [
        AuthController::class,
        'user'
    ]);

    Route::post('/auth/logout', [
        AuthController::class,
        'logout'
    ]);
});


/*
|--------------------------------------------------------------------------
| Guide Profile Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
    ->prefix('guide/profile')
    ->group(function () {

        Route::get('/', [
            GuideProfileController::class,
            'show'
        ]);

        Route::put('/', [
            GuideProfileController::class,
            'update'
        ]);

        Route::post('/profile-picture', [
            GuideProfileController::class,
            'uploadProfilePicture'
        ]);

        Route::post('/cover-photo', [
            GuideProfileController::class,
            'uploadCoverPhoto'
        ]);

        Route::post('/experiences', [
            GuideExperienceController::class,
            'store'
        ]);

        Route::put('/experiences/{id}', [
            GuideExperienceController::class,
            'update'
        ]);

        Route::delete('/experiences/{id}', [
            GuideExperienceController::class,
            'destroy'
        ]);
    });


/*
|--------------------------------------------------------------------------
| Tourist Profile Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
    ->prefix('tourist/profile')
    ->group(function () {

        Route::get('/', [
            TouristProfileController::class,
            'show'
        ]);

        Route::put('/', [
            TouristProfileController::class,
            'update'
        ]);

        Route::post('/profile-picture', [
            TouristProfileController::class,
            'uploadProfilePicture'
        ]);

        Route::post('/cover-photo', [
            TouristProfileController::class,
            'uploadCoverPhoto'
        ]);
    });