<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Guide\GuideExperienceController;
use App\Http\Controllers\Guide\GuideProfileController;
use App\Http\Controllers\Guide\GuideReviewController;
use App\Http\Controllers\TouristProfileController;
use App\Http\Controllers\TravelRequestController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PayoutController;
use App\Http\Controllers\ReviewController;

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
| Travel Request Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
    ->prefix('travel-requests')
    ->group(function () {

        // Tourist sends a travel request
        Route::post('/', [
            TravelRequestController::class,
            'store'
        ]);

        // Guide views received requests
        Route::get('/guide', [
            TravelRequestController::class,
            'guideRequests'
        ]);

        // Guide accepts a request
        Route::put('/guide/{id}/accept', [
            TravelRequestController::class,
            'accept'
        ]);

        // Guide rejects a request
        Route::put('/guide/{id}/reject', [
            TravelRequestController::class,
            'reject'
        ]);

        // Guide cancels a request
        Route::put('/guide/{id}/cancel', [
            TravelRequestController::class,
            'cancel'
        ]);
    });


/*
|--------------------------------------------------------------------------
| Booking Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
    ->prefix('bookings')
    ->group(function () {

        // Tourist sees their own bookings
        Route::get('/', [
            BookingController::class,
            'index'
        ]);

        // Tourist sees one specific booking
        Route::get('/{id}', [
            BookingController::class,
            'show'
        ]);
    });

/*
|--------------------------------------------------------------------------
| Tourist Review Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
    ->prefix('reviews')
    ->group(function () {
        Route::get('/eligible', [ReviewController::class, 'eligible']);
        Route::post('/', [ReviewController::class, 'store']);
        Route::get('/', [ReviewController::class, 'index']);
    });

/*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
    ->prefix('payments')
    ->group(function () {
        // Fetch (or initialise) the pending payment for a tourist booking.
        Route::post('/initiate', [PaymentController::class, 'initiate']);

        // Complete a bKash or Nagad payment.
        Route::post('/complete', [PaymentController::class, 'complete']);

        // Kept as the direct submit endpoint for the current Payment page.
        Route::post('/', [PaymentController::class, 'complete']);

        Route::get('/booking/{bookingId}', [
            PaymentController::class,
            'showByBooking',
        ]);
    });

/*
|--------------------------------------------------------------------------
| Payout Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')->group(function () {
    Route::get('/guide/reviews', [GuideReviewController::class, 'index']);
    Route::get('/guide/payouts', [PayoutController::class, 'guideIndex']);
    Route::get('/admin/payouts', [PayoutController::class, 'adminIndex']);
    Route::post('/admin/payouts/{payout}/release', [PayoutController::class, 'release']);
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
