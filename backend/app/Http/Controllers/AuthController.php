<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Guide\GuideProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Send verification code to phone number.
     *
     * OTP is shown ONLY in Laravel terminal.
     * OTP is NOT returned to browser.
     * OTP is NOT stored in database.
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
        | OTP is shown ONLY in Laravel terminal.
        | It is NOT returned in the API response.
        |--------------------------------------------------------------------------
        */

        error_log('');
        error_log('========================================');
        error_log('       TripMesh Verification OTP');
        error_log('========================================');
        error_log('Phone: ' . $phone);
        error_log('OTP:   ' . $code);
        error_log('Expires: 5 minutes');
        error_log('========================================');
        error_log('');

        /*
        |--------------------------------------------------------------------------
        | Store OTP temporarily in Laravel Cache
        |--------------------------------------------------------------------------
        | This does NOT create a database record.
        | OTP automatically expires after 5 minutes.
        |--------------------------------------------------------------------------
        */

        Cache::put(
            'verification_code_' . $phone,
            $code,
            now()->addMinutes(5)
        );

        // IMPORTANT:
        // OTP is NOT included in this response.
        return response()->json([
            'message' => 'Verification code sent successfully.',
            'phone' => $phone,
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

        /*
        |--------------------------------------------------------------------------
        | Get OTP from Laravel Cache
        |--------------------------------------------------------------------------
        */

        $cacheKey = 'verification_code_' . $phone;

        $storedCode = Cache::get($cacheKey);

        // No OTP found
        if (!$storedCode) {
            return response()->json([
                'message' => 'Verification code is invalid or expired.',
            ], 401);
        }

        // OTP does not match
        if ($storedCode !== $code) {
            return response()->json([
                'message' => 'Invalid verification code.',
            ], 401);
        }

        /*
        |--------------------------------------------------------------------------
        | Verification successful
        |--------------------------------------------------------------------------
        */

        // Delete OTP immediately after successful verification
        Cache::forget($cacheKey);

        // Check whether this phone already belongs to a user
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