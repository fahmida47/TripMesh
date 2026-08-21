<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VerificationCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Send verification code to phone number.
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

        // Generate a random 6-digit verification code.
        $code = (string) random_int(100000, 999999);

        /*
        |--------------------------------------------------------------------------
        | DEVELOPMENT ONLY
        |--------------------------------------------------------------------------
        | OTP will be shown in the Laravel terminal.
        | Later, when SMS service is connected, remove this section.
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

        // Remove previous codes for this phone number.
        VerificationCode::where('phone', $phone)->delete();

        // Store new verification code.
        VerificationCode::create([
            'phone' => $phone,
            'code' => $code,
            'expires_at' => now()->addMinutes(5),
        ]);

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

        $verification = VerificationCode::where('phone', $phone)
            ->where('code', $code)
            ->latest()
            ->first();

        if (!$verification) {
            return response()->json([
                'message' => 'Invalid verification code.',
            ], 401);
        }

        if ($verification->expires_at->isPast()) {
            $verification->delete();

            return response()->json([
                'message' => 'Verification code has expired.',
            ], 401);
        }

        // Verification successful.
        $verification->delete();

        // Check whether this phone number already belongs to a user.
        $user = User::where('phone', $phone)->first();

        // Existing user.
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

        // New user.
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
            'phone' => ['required', 'string', 'min:10', 'max:20', 'unique:users,phone'],
            'role' => ['required', 'in:tourist,guide'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Registration failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'name' => trim($request->name),
            'phone' => trim($request->phone),
            'role' => $request->role,
        ]);

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