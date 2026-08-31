<?php

namespace App\Http\Controllers;

use App\Models\Guide\GuideExperience;
use App\Models\Guide\GuideProfile;
use App\Models\TravelRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TravelRequestController extends Controller
{
    /**
     * Tourist sends a new travel request.
     */
    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== 'tourist') {
            return response()->json([
                'message' => 'Only tourists can send travel requests.',
            ], 403);
        }

        $validated = $request->validate([
            'guide_profile_id' => [
                'required',
                'integer',
                'exists:guide_profiles,id',
            ],

            'guide_experience_id' => [
                'nullable',
                'integer',
                'exists:guide_experiences,id',
            ],

            'travel_date' => [
                'required',
                'date',
                'after_or_equal:today',
            ],

            'amount' => [
                'required',
                'numeric',
                'min:0',
            ],

            'request_details' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ]);

        $touristProfile = $user->touristProfile;

        if (!$touristProfile) {
            return response()->json([
                'message' => 'Tourist profile not found.',
            ], 404);
        }

        $guideProfile = GuideProfile::find(
            $validated['guide_profile_id']
        );

        if (!$guideProfile) {
            return response()->json([
                'message' => 'Guide profile not found.',
            ], 404);
        }

        /*
         * Make sure selected experience belongs
         * to the selected guide.
         */
        if (!empty($validated['guide_experience_id'])) {

            $experience = GuideExperience::where(
                'id',
                $validated['guide_experience_id']
            )
                ->where(
                    'guide_profile_id',
                    $guideProfile->id
                )
                ->first();

            if (!$experience) {
                return response()->json([
                    'message' =>
                        'The selected experience does not belong to this guide.',
                ], 422);
            }
        }

        $travelRequest = TravelRequest::create([
            'tourist_profile_id' => $touristProfile->id,
            'guide_profile_id' => $guideProfile->id,
            'guide_experience_id' =>
                $validated['guide_experience_id'] ?? null,
            'travel_date' => $validated['travel_date'],
            'amount' => $validated['amount'],
            'request_details' =>
                $validated['request_details'] ?? null,
            'status' => 'pending',
        ]);

        $travelRequest->load([
            'tourist',
            'guide',
            'experience',
        ]);

        return response()->json([
            'message' => 'Travel request sent successfully.',
            'request' => $travelRequest,
        ], 201);
    }


    /**
     * Get all travel requests received by
     * the authenticated guide.
     */
    public function guideRequests(): JsonResponse
    {
        $user = auth('api')->user();

        /*
         * Only guides can access this endpoint.
         */
        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can view travel requests.',
            ], 403);
        }

        /*
         * Get authenticated guide profile.
         */
        $guideProfile = $user->guideProfile;

        if (!$guideProfile) {
            return response()->json([
                'message' => 'Guide profile not found.',
            ], 404);
        }

        /*
         * Get only requests belonging to
         * the authenticated guide.
         */
        $requests = TravelRequest::with([
            'tourist',
            'guide',
            'experience',
        ])
            ->where(
                'guide_profile_id',
                $guideProfile->id
            )
            ->latest()
            ->get();

        /*
         * Request counts.
         */
        $counts = [
            'all' => $requests->count(),

            'pending' => $requests
                ->where('status', 'pending')
                ->count(),

            'accepted' => $requests
                ->where('status', 'accepted')
                ->count(),

            'rejected' => $requests
                ->where('status', 'rejected')
                ->count(),

            'cancelled' => $requests
                ->where('status', 'cancelled')
                ->count(),
        ];

        /*
         * Empty response.
         */
        if ($requests->isEmpty()) {
            return response()->json([
                'message' => 'No travel requests found.',
                'counts' => $counts,
                'requests' => [],
            ]);
        }

        return response()->json([
            'message' => 'Travel requests retrieved successfully.',
            'counts' => $counts,
            'requests' => $requests,
        ]);
    }


    /**
     * Accept a travel request.
     */
    public function accept($id): JsonResponse
    {
        return $this->updateStatus($id, 'accepted');
    }


    /**
     * Reject a travel request.
     */
    public function reject($id): JsonResponse
    {
        return $this->updateStatus($id, 'rejected');
    }


    /**
     * Cancel a travel request.
     */
    public function cancel($id): JsonResponse
    {
        return $this->updateStatus($id, 'cancelled');
    }


    /**
     * Update request status.
     *
     * A guide can only update requests
     * belonging to their own guide profile.
     */
    private function updateStatus(
        $id,
        string $status
    ): JsonResponse {

        $user = auth('api')->user();

        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can manage travel requests.',
            ], 403);
        }

        $guideProfile = $user->guideProfile;

        if (!$guideProfile) {
            return response()->json([
                'message' => 'Guide profile not found.',
            ], 404);
        }

        /*
         * Important:
         * Search by BOTH request ID and guide_profile_id.
         *
         * This prevents one guide from modifying
         * another guide's request.
         */
        $travelRequest = TravelRequest::where('id', $id)
            ->where(
                'guide_profile_id',
                $guideProfile->id
            )
            ->first();

        if (!$travelRequest) {
            return response()->json([
                'message' => 'Travel request not found.',
            ], 404);
        }

        /*
         * Only pending requests can be changed.
         */
        if ($travelRequest->status !== 'pending') {
            return response()->json([
                'message' =>
                    'Only pending requests can be updated.',
            ], 422);
        }

        $travelRequest->update([
            'status' => $status,
        ]);

        $travelRequest->load([
            'tourist',
            'guide',
            'experience',
        ]);

        return response()->json([
            'message' =>
                'Travel request ' . $status . ' successfully.',
            'request' => $travelRequest,
        ]);
    }
}