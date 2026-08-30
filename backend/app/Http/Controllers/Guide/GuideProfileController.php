<?php

namespace App\Http\Controllers\Guide;

use App\Http\Controllers\Controller;
use App\Models\Guide\GuideExperience;
use App\Models\Guide\GuideProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class GuideProfileController extends Controller
{
    /**
     * --------------------------------------------------------------------------
     * Show Guide Profile
     * --------------------------------------------------------------------------
     */
    public function show()
    {
        $user = Auth::user();

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
        ]);
    }

    /**
     * --------------------------------------------------------------------------
     * Update Guide Profile
     * --------------------------------------------------------------------------
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $profile = GuideProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'company_name' => null,
                'contact_person' => null,
                'bio' => null,
                'phone' => null,
                'email' => $user->email ?? null,
                'address' => null,
                'price' => 0,
                'rating' => 0,
                'reviews' => 0,
                'popularity' => 0,
                'tour_types' => [],
            ]
        );

        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:255',

            // Bio limit increased from 300 to 1000 characters
            'bio' => 'nullable|string|max:1000',

            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'price' => 'nullable|numeric|min:0',
            'rating' => 'nullable|numeric|min:0|max:5',
            'reviews' => 'nullable|integer|min:0',
            'popularity' => 'nullable|integer|min:0',

            'tour_types' => 'nullable|array',
            'tour_types.*' => 'string|max:100',
        ]);

        $profile->update($validated);

        return response()->json([
            'message' => 'Guide profile updated successfully.',
            'profile' => $profile->load('experiences')
        ]);
    }

    /**
     * --------------------------------------------------------------------------
     * Upload Profile Picture
     * --------------------------------------------------------------------------
     */
    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $user = Auth::user();

        $profile = GuideProfile::firstOrCreate([
            'user_id' => $user->id
        ]);

        if ($profile->profile_picture) {
            Storage::disk('public')->delete(
                $profile->profile_picture
            );
        }

        $path = $request
            ->file('profile_picture')
            ->store('guide/profile-pictures', 'public');

        $profile->update([
            'profile_picture' => $path
        ]);

        return response()->json([
            'message' => 'Profile picture uploaded successfully.',
            'profile_picture' => $path,
            'profile' => $profile
        ]);
    }

    /**
     * --------------------------------------------------------------------------
     * Upload Cover Photo
     * --------------------------------------------------------------------------
     */
    public function uploadCoverPhoto(Request $request)
    {
        $request->validate([
            'cover_photo' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $user = Auth::user();

        $profile = GuideProfile::firstOrCreate([
            'user_id' => $user->id
        ]);

        if ($profile->cover_photo) {
            Storage::disk('public')->delete(
                $profile->cover_photo
            );
        }

        $path = $request
            ->file('cover_photo')
            ->store('guide/cover-photos', 'public');

        $profile->update([
            'cover_photo' => $path
        ]);

        return response()->json([
            'message' => 'Cover photo uploaded successfully.',
            'cover_photo' => $path,
            'profile' => $profile
        ]);
    }

    /**
     * --------------------------------------------------------------------------
     * Explore Guide Services
     *
     * Server-side:
     * - Search
     * - Tour type filtering
     * - Price filtering
     * - Sorting
     * - Pagination
     * --------------------------------------------------------------------------
     */
    public function explore(Request $request)
    {
        $query = GuideProfile::with('experiences');

        /**
         * ----------------------------------------------------------------------
         * Search
         * ----------------------------------------------------------------------
         */
        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->where(function ($q) use ($search) {
                $q->where(
                    'company_name',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'address',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'bio',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'contact_person',
                    'like',
                    "%{$search}%"
                );
            });
        }

        /**
         * ----------------------------------------------------------------------
         * Tour Type Filter
         * ----------------------------------------------------------------------
         */
        if ($request->filled('tour_type')) {
            $tourType = $request->tour_type;

            $query->whereJsonContains(
                'tour_types',
                $tourType
            );
        }

        /**
         * ----------------------------------------------------------------------
         * Price Range
         * ----------------------------------------------------------------------
         */
        if ($request->filled('price_range')) {
            switch ($request->price_range) {

                case 'low':
                    $query->whereBetween('price', [
                        2000,
                        2500
                    ]);
                    break;

                case 'medium':
                    $query->whereBetween('price', [
                        2501,
                        3000
                    ]);
                    break;

                case 'high':
                    $query->where(
                        'price',
                        '>=',
                        3001
                    );
                    break;
            }
        }

        /**
         * ----------------------------------------------------------------------
         * Sorting
         * ----------------------------------------------------------------------
         */
        switch ($request->get('sort', 'popular')) {

            case 'rating':
                $query->orderByDesc('rating');
                break;

            case 'low-price':
                $query->orderBy('price');
                break;

            case 'high-price':
                $query->orderByDesc('price');
                break;

            default:
                $query->orderByDesc('popularity');
                break;
        }

        /**
         * ----------------------------------------------------------------------
         * Pagination
         * ----------------------------------------------------------------------
         */
        $perPage = min(
            max(
                (int) $request->get('per_page', 6),
                1
            ),
            24
        );

        $guides = $query->paginate($perPage);

        /**
         * ----------------------------------------------------------------------
         * Transform Guide Data
         * ----------------------------------------------------------------------
         */
        $guides->getCollection()->transform(
            function ($guide) {

                return [
                    'id' => $guide->id,

                    'companyName' =>
                        $guide->company_name,

                    'location' =>
                        $guide->address,

                    'description' =>
                        $guide->bio,

                    'image' =>
                        $guide->cover_photo,

                    'profilePicture' =>
                        $guide->profile_picture,

                    'rating' =>
                        (float) ($guide->rating ?? 0),

                    'reviews' =>
                        (int) ($guide->reviews ?? 0),

                    'price' =>
                        (float) ($guide->price ?? 0),

                    'popularity' =>
                        (int) ($guide->popularity ?? 0),

                    'tourTypes' =>
                        $guide->tour_types ?? [],

                    /**
                     * ----------------------------------------------------------
                     * Experiences
                     * ----------------------------------------------------------
                     */
                    'experiences' =>
                        $guide->experiences->map(
                            function ($experience) {

                                return [
                                    'id' =>
                                        $experience->id,

                                    'title' =>
                                        $experience->title,

                                    'description' =>
                                        $experience->description,

                                    'photo' =>
                                        $experience->photo,
                                ];
                            }
                        )->values(),
                ];
            }
        );

        return response()->json($guides);
    }
}