<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

// Send OTP
Route::post('/auth/send-code', [AuthController::class, 'sendCode']);

// Verify OTP
Route::post('/auth/verify-code', [AuthController::class, 'verifyCode']);

// Register new user
Route::post('/auth/register', [AuthController::class, 'register']);


/*
|--------------------------------------------------------------------------
| Protected Authentication Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')->group(function () {

    // Get authenticated user
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Logout
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});