<?php

namespace App\Http\Controllers;

use App\Models\TouristProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TouristProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $this->tourist($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $profile = TouristProfile::firstOrCreate(
            ['user_id' => $user->id],
            ['full_name' => $user->name, 'phone' => $user->phone]
        );

        return response()->json([
            'message' => 'Tourist profile retrieved successfully.',
            'profile' => $this->profileData($profile),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $this->tourist($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $validated = $request->validate([
            'full_name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['sometimes', 'required', 'string', 'min:10', 'max:20', 'unique:users,phone,'.$user->id],
            'email' => ['nullable', 'email', 'max:255'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:30'],
            'country' => ['nullable', 'string', 'max:100'],
        ]);

        $profile = TouristProfile::firstOrCreate(
            ['user_id' => $user->id],
            ['full_name' => $user->name, 'phone' => $user->phone]
        );

        if (array_key_exists('full_name', $validated)) {
            $user->name = trim($validated['full_name']);
            $validated['full_name'] = $user->name;
        }

        if (array_key_exists('phone', $validated)) {
            $user->phone = trim($validated['phone']);
            $validated['phone'] = $user->phone;
        }

        $user->save();
        $profile->update($validated);

        return response()->json([
            'message' => 'Tourist profile saved successfully.',
            'profile' => $this->profileData($profile->fresh()),
        ]);
    }

    public function uploadProfilePicture(Request $request): JsonResponse
    {
        return $this->uploadImage($request, 'profile_picture', 'tourist-profiles/profile', 'Profile picture');
    }

    public function uploadCoverPhoto(Request $request): JsonResponse
    {
        return $this->uploadImage($request, 'cover_photo', 'tourist-profiles/covers', 'Cover photo');
    }

    private function uploadImage(Request $request, string $field, string $directory, string $label): JsonResponse
    {
        $user = $this->tourist($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $request->validate([
            $field => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $profile = TouristProfile::firstOrCreate(
            ['user_id' => $user->id],
            ['full_name' => $user->name, 'phone' => $user->phone]
        );

        if ($profile->{$field}) {
            Storage::disk('public')->delete($profile->{$field});
        }

        $path = $request->file($field)->store($directory, 'public');
        $profile->update([$field => $path]);

        return response()->json([
            'message' => $label.' uploaded successfully.',
            $field => $path,
            'url' => asset('storage/'.$path),
            'profile' => $this->profileData($profile->fresh()),
        ]);
    }

    private function tourist(Request $request)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'tourist') {
            return response()->json(['message' => 'Only tourists can access this profile.'], 403);
        }

        return $user;
    }

    private function profileData(TouristProfile $profile): array
    {
        $data = $profile->toArray();
        $data['profile_picture_url'] = $profile->profile_picture
            ? asset('storage/'.$profile->profile_picture)
            : null;
        $data['cover_photo_url'] = $profile->cover_photo
            ? asset('storage/'.$profile->cover_photo)
            : null;

        return $data;
    }
}
