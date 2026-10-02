<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Guide\GuideExperienceController;
use App\Http\Controllers\Guide\GuideProfileController;
use App\Http\Controllers\Guide\GuideReviewController;
use App\Http\Controllers\Guide\TourServiceController;
use App\Http\Controllers\TouristProfileController;
use App\Http\Controllers\TravelRequestController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PayoutController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ChatController;
use App\Http\Middleware\EnsureAdmin;


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

Route::middleware('auth:api')->prefix('chat')->group(function () {
    Route::get('/conversations', [ChatController::class, 'conversations']);
    Route::post('/conversations', [ChatController::class, 'createConversation']);
    Route::get('/conversations/{conversationId}/messages', [ChatController::class, 'messages'])
        ->whereNumber('conversationId');
    Route::post('/conversations/{conversationId}/messages', [ChatController::class, 'sendMessage'])
        ->whereNumber('conversationId');
    Route::patch('/conversations/{conversationId}/read', [ChatController::class, 'markRead'])
        ->whereNumber('conversationId');
});

Route::prefix('admin/auth')->group(function () {
    Route::post('/send-code', [AdminController::class, 'sendCode']);
    Route::post('/verify-code', [AdminController::class, 'verifyCode']);
});

Route::middleware(['auth:api', EnsureAdmin::class])->prefix('admin')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [AdminController::class, 'overview']);
    Route::get('/payments', [AdminController::class, 'payments']);
    Route::get('/commissions', [AdminController::class, 'commissions']);
    Route::put('/commission', [AdminController::class, 'updateCommission']);
    Route::get('/payouts', [AdminController::class, 'payouts']);
    Route::post('/payouts/{payout}/release', [AdminController::class, 'releasePayout']);
    Route::patch('/payments/{payment}', [AdminController::class, 'updatePayment']);
    Route::get('/bookings', [AdminController::class, 'bookings']);
    Route::get('/guides', fn () => app(AdminController::class)->people('guide'));
    Route::get('/tourists', fn () => app(AdminController::class)->people('tourist'));
    Route::get('/reviews', [AdminController::class, 'reviews']);
    Route::patch('/reviews/{review}', [AdminController::class, 'updateReview']);
    Route::get('/profile', [AdminController::class, 'profile']);
    Route::put('/profile', [AdminController::class, 'updateProfile']);
    Route::post('/admins', [AdminController::class, 'createAdmin']);
});



/*
|--------------------------------------------------------------------------
| Explore Guide Services
|--------------------------------------------------------------------------
*/

Route::get('/guides/explore', [
    GuideProfileController::class,
    'explore'
]);

// Public for Explore and tourist service listings; writes require guide auth.
Route::get('/tour-services', [TourServiceController::class, 'index']);
Route::get('/tour-services/{tourService}', [TourServiceController::class, 'show'])->whereNumber('tourService');
Route::middleware('auth:api')->prefix('guide/tour-services')->group(function () {
    Route::get('/', [TourServiceController::class, 'mine']);
    Route::post('/', [TourServiceController::class, 'store']);
    Route::put('/{tourService}', [TourServiceController::class, 'update'])->whereNumber('tourService');
    Route::delete('/{tourService}', [TourServiceController::class, 'destroy'])->whereNumber('tourService');
});



/*
|--------------------------------------------------------------------------
| Protected Auth Routes
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
| Travel Requests
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
->prefix('travel-requests')
->group(function () {


    Route::post('/', [
        TravelRequestController::class,
        'store'
    ]);


    Route::get('/guide', [
        TravelRequestController::class,
        'guideRequests'
    ]);


    Route::put('/guide/{id}/accept', [
        TravelRequestController::class,
        'accept'
    ]);


    Route::put('/guide/{id}/reject', [
        TravelRequestController::class,
        'reject'
    ]);


    Route::put('/guide/{id}/cancel', [
        TravelRequestController::class,
        'cancel'
    ]);

});

Route::middleware('auth:api')->post('/service-requests', [
    TravelRequestController::class,
    'storeService',
]);



/*
|--------------------------------------------------------------------------
| Booking Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
->prefix('bookings')
->group(function () {


    Route::get('/guide', [
        BookingController::class,
        'guideIndex'
    ]);


    Route::put('/guide/{id}/complete', [
        BookingController::class,
        'completeGuideBooking'
    ]);


    Route::get('/', [
        BookingController::class,
        'index'
    ]);


    Route::get('/{id}', [
        BookingController::class,
        'show'
    ]);

});



/*
|--------------------------------------------------------------------------
| Review Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
->prefix('reviews')
->group(function () {


    Route::get('/eligible', [
        ReviewController::class,
        'eligible'
    ]);


    Route::post('/', [
        ReviewController::class,
        'store'
    ]);


    Route::get('/', [
        ReviewController::class,
        'index'
    ]);

});



/*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
->prefix('payments')
->group(function () {


    Route::post('/initiate', [
        PaymentController::class,
        'initiate'
    ]);


    Route::post('/complete', [
        PaymentController::class,
        'complete'
    ]);


    Route::post('/', [
        PaymentController::class,
        'complete'
    ]);


    Route::get('/booking/{bookingId}', [
        PaymentController::class,
        'showByBooking'
    ]);

});



/*
|--------------------------------------------------------------------------
| Payout Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')
->group(function () {


    Route::get('/guide/reviews', [
        GuideReviewController::class,
        'index'
    ]);


    Route::get('/guide/payouts', [
        PayoutController::class,
        'guideIndex'
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
