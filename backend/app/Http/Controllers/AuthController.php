<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Guide\GuideProfile;
use App\Models\TouristProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Send verification code to phone number.
     *
     * DEVELOPMENT ONLY:
     * OTP is returned in the API response for testing.
     * OTP is also written to Laravel logs.
     * OTP is NOT stored in the database.
     */
    public function sendCode(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => ['required', 'string', 'min:10', 'max:20'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid phone number.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $phone = trim($request->phone);

        // Generate random 6-digit OTP
        $code = (string) random_int(100000, 999999);

        /*
        |--------------------------------------------------------------------------
        | DEVELOPMENT ONLY
        |--------------------------------------------------------------------------
        | OTP is returned in the API response for testing.
        | It is also written to Laravel logs.
        | It is NOT stored in the database.
        |--------------------------------------------------------------------------
        */

        $otpLog = implode(PHP_EOL, [
            '',
            '========================================',
            '       TripMesh Verification OTP',
            '========================================',
            'Phone: ' . $phone,
            'OTP:   ' . $code,
            'Expires: 2 minutes',
            '========================================',
            '',
        ]);

        error_log($otpLog);

        Log::info('TripMesh verification OTP generated', [
            'phone' => $phone,
            'otp' => $code,
            'expires_in_minutes' => 2,
        ]);

        Log::channel('stderr')->info('TripMesh verification OTP generated', [
            'phone' => $phone,
            'otp' => $code,
            'expires_in_minutes' => 2,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Store OTP temporarily in Laravel Cache
        |--------------------------------------------------------------------------
        | OTP automatically expires after 2 minutes.
        | This does NOT create a database record.
        |--------------------------------------------------------------------------
        */

        Cache::put(
            'verification_code_' . $phone,
            $code,
            now()->addMinutes(2)
        );

        /*
        |--------------------------------------------------------------------------
        | Return OTP for Development / Testing
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'message' => 'Verification code sent successfully.',
            'phone' => $phone,
            'otp' => $code,
            'expires_in_minutes' => 2,
        ], 200);
    }

    /**
     * Verify phone verification code.
     */
    public function verifyCode(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => ['required', 'string', 'min:10', 'max:20'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid verification request.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $phone = trim($request->phone);
        $code = trim($request->code);

        $cacheKey = 'verification_code_' . $phone;

        $storedCode = Cache::get($cacheKey);

        if (!$storedCode) {
            return response()->json([
                'message' => 'Verification code is invalid or expired.',
            ], 401);
        }

        if ($storedCode !== $code) {
            return response()->json([
                'message' => 'Invalid verification code.',
            ], 401);
        }

        // Delete OTP immediately after successful verification.
        Cache::forget($cacheKey);

        /*
        |--------------------------------------------------------------------------
        | Check whether this phone already belongs to a user
        |--------------------------------------------------------------------------
        */

        $user = User::where('phone', $phone)->first();

        /*
        |--------------------------------------------------------------------------
        | Existing User
        |--------------------------------------------------------------------------
        */

        if ($user) {
            $token = auth('api')->login($user);

            return response()->json([
                'verified' => true,
                'is_new_user' => false,
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'phone' => $user->phone,
                    'role' => $user->role,
                ],
            ], 200);
        }

        /*
        |--------------------------------------------------------------------------
        | New User
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'verified' => true,
            'is_new_user' => true,
            'phone' => $phone,
        ], 200);
    }

    /**
     * Register a new user.
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],

            'phone' => [
                'required',
                'string',
                'min:10',
                'max:20',
                'unique:users,phone',
            ],

            'role' => [
                'required',
                'in:tourist,guide',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Registration failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Create User
        |--------------------------------------------------------------------------
        */

        $user = User::create([
            'name' => trim($request->name),
            'phone' => trim($request->phone),
            'role' => $request->role,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Automatically Create Guide Profile
        |--------------------------------------------------------------------------
        */

        if ($user->role === 'guide') {
            GuideProfile::create([
                'user_id' => $user->id,
                'company_name' => $user->name,
                'contact_person' => $user->name,
                'phone' => $user->phone,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Automatically Create Tourist Profile
        |--------------------------------------------------------------------------
        */

        if ($user->role === 'tourist') {
            TouristProfile::create([
                'user_id' => $user->id,
                'full_name' => $user->name,
                'phone' => $user->phone,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Generate JWT Token
        |--------------------------------------------------------------------------
        */

        $token = auth('api')->login($user);

        return response()->json([
            'message' => 'Registration successful.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'role' => $user->role,
            ],
        ], 201);
    }

    /**
     * Get authenticated user.
     */
    public function user(): JsonResponse
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'role' => $user->role,
            ],
        ], 200);
    }

    /**
     * Logout and invalidate JWT token.
     */
    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return response()->json([
            'message' => 'Logged out successfully.',
        ], 200);
    }
}