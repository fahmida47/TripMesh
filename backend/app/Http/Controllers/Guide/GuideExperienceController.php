<?php

namespace App\Http\Controllers\Guide;

use App\Http\Controllers\Controller;
use App\Models\Guide\GuideExperience;
use App\Models\Guide\GuideProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GuideExperienceController extends Controller
{
    /**
     * Add a completed tour experience.
     */
    public function store(Request $request)
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can manage experiences.'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:300',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $profile = GuideProfile::where(
            'user_id',
            $user->id
        )->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Guide profile not found.'
            ], 404);
        }

        $path = null;

        if ($request->hasFile('photo')) {
            $path = $request
                ->file('photo')
                ->store('guide-profiles/experiences', 'public');
        }

        $experience = GuideExperience::create([
            'guide_profile_id' => $profile->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'photo' => $path,
        ]);

        return response()->json([
            'message' => 'Experience added successfully.',
            'experience' => $experience,
        ], 201);
    }

    /**
     * Update a completed tour experience.
     */
    public function update(Request $request, $id)
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can manage experiences.'
            ], 403);
        }

        $profile = GuideProfile::where(
            'user_id',
            $user->id
        )->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Guide profile not found.'
            ], 404);
        }

        $experience = GuideExperience::where(
            'id',
            $id
        )->where(
            'guide_profile_id',
            $profile->id
        )->first();

        if (!$experience) {
            return response()->json([
                'message' => 'Experience not found.'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:300',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('photo')) {

            if ($experience->photo) {
                Storage::disk('public')->delete(
                    $experience->photo
                );
            }

            $path = $request
                ->file('photo')
                ->store('guide-profiles/experiences', 'public');

            $experience->photo = $path;
        }

        $experience->title = $validated['title'];
        $experience->description = $validated['description'];

        $experience->save();

        return response()->json([
            'message' => 'Experience updated successfully.',
            'experience' => $experience,
        ]);
    }

    /**
     * Delete a completed tour experience.
     */
    public function destroy($id)
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can manage experiences.'
            ], 403);
        }

        $profile = GuideProfile::where(
            'user_id',
            $user->id
        )->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Guide profile not found.'
            ], 404);
        }

        $experience = GuideExperience::where(
            'id',
            $id
        )->where(
            'guide_profile_id',
            $profile->id
        )->first();

        if (!$experience) {
            return response()->json([
                'message' => 'Experience not found.'
            ], 404);
        }

        if ($experience->photo) {
            Storage::disk('public')->delete(
                $experience->photo
            );
        }

        $experience->delete();

        return response()->json([
            'message' => 'Experience deleted successfully.'
        ]);
    }
}