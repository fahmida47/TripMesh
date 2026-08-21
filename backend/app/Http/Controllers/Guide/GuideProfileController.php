<?php

namespace App\Http\Controllers\Guide;

use App\Http\Controllers\Controller;
use App\Models\Guide\GuideProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GuideProfileController extends Controller
{
    /**
     * Get logged-in guide profile
     */
    public function show(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can access this profile.'
            ], 403);
        }

        $profile = GuideProfile::with('experiences')
            ->where('user_id', $user->id)
            ->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Guide profile not found.'
            ], 404);
        }

        return response()->json([
            'message' => 'Guide profile retrieved successfully.',
            'profile' => $profile
        ], 200);
    }

    /**
     * Create or update guide profile
     */
    public function update(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can update this profile.'
            ], 403);
        }

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Create profile if it doesn't exist
        | Update profile if it already exists
        |--------------------------------------------------------------------------
        */

        $profile = GuideProfile::updateOrCreate(
            [
                'user_id' => $user->id,
            ],
            [
                'company_name' => $validated['company_name'],
                'contact_person' => $validated['contact_person'] ?? null,
                'bio' => $validated['bio'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'address' => $validated['address'] ?? null,
            ]
        );

        $profile->load('experiences');

        return response()->json([
            'message' => 'Guide profile saved successfully.',
            'profile' => $profile,
        ], 200);
    }

    /**
     * Upload profile picture
     */
    public function uploadProfilePicture(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can upload a profile picture.'
            ], 403);
        }

        $request->validate([
            'profile_picture' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Get existing profile
        |--------------------------------------------------------------------------
        */

        $profile = GuideProfile::where('user_id', $user->id)->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Please save your guide profile first.'
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Delete old profile picture
        |--------------------------------------------------------------------------
        */

        if ($profile->profile_picture) {
            Storage::disk('public')->delete(
                $profile->profile_picture
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Store new profile picture
        |--------------------------------------------------------------------------
        */

        $path = $request
            ->file('profile_picture')
            ->store('guide-profiles/profile', 'public');

        $profile->update([
            'profile_picture' => $path,
        ]);

        return response()->json([
            'message' => 'Profile picture uploaded successfully.',
            'profile_picture' => $path,
            'url' => asset('storage/' . $path),
        ], 200);
    }

    /**
     * Upload cover photo
     */
    public function uploadCoverPhoto(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can upload a cover photo.'
            ], 403);
        }

        $request->validate([
            'cover_photo' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Get existing profile
        |--------------------------------------------------------------------------
        */

        $profile = GuideProfile::where('user_id', $user->id)->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Please save your guide profile first.'
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Delete old cover photo
        |--------------------------------------------------------------------------
        */

        if ($profile->cover_photo) {
            Storage::disk('public')->delete(
                $profile->cover_photo
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Store new cover photo
        |--------------------------------------------------------------------------
        */

        $path = $request
            ->file('cover_photo')
            ->store('guide-profiles/covers', 'public');

        $profile->update([
            'cover_photo' => $path,
        ]);

        return response()->json([
            'message' => 'Cover photo uploaded successfully.',
            'cover_photo' => $path,
            'url' => asset('storage/' . $path),
        ], 200);
    }
}