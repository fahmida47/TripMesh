<?php

namespace App\Http\Controllers;

use App\Models\Guide\GuideExperience;
use App\Models\Guide\GuideProfile;
use App\Models\TravelRequest;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TravelRequestController extends Controller
{
    /**
     * Create a new travel request.
     *
     * Only authenticated tourists can send requests.
     */
    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        // Check authentication and tourist role
        if (!$user || $user->role !== 'tourist') {
            return response()->json([
                'message' => 'Only tourists can send travel requests.',
            ], 403);
        }

        // Validate request data
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

            'destination' => [
                'required',
                'string',
                'max:255',
            ],

            'travelers' => [
                'required',
                'integer',
                'min:1',
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

        // Get the authenticated tourist profile
        $touristProfile = $user->touristProfile;

        if (!$touristProfile) {
            return response()->json([
                'message' => 'Tourist profile not found.',
            ], 404);
        }

        // Make sure the selected guide exists
        $guideProfile = GuideProfile::find(
            $validated['guide_profile_id']
        );

        if (!$guideProfile) {
            return response()->json([
                'message' => 'Guide profile not found.',
            ], 404);
        }

        // If an experience is provided,
        // make sure it belongs to the selected guide.
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

        // Create the travel request
        $travelRequest = TravelRequest::create([
            'tourist_profile_id' =>
                $touristProfile->id,

            'guide_profile_id' =>
                $guideProfile->id,

            'guide_experience_id' =>
                $validated['guide_experience_id'] ?? null,

            'destination' =>
                $validated['destination'],

            'travelers' =>
                $validated['travelers'],

            'travel_date' =>
                $validated['travel_date'],

            'amount' =>
                $validated['amount'],

            'request_details' =>
                $validated['request_details'] ?? null,

            'status' => 'pending',
        ]);

        // Return the newly created request
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
     * Get all travel requests received by the authenticated guide.
     */
    public function guideRequests(): JsonResponse
    {
        $user = auth('api')->user();

        // Check authentication and guide role
        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can view travel requests.',
            ], 403);
        }

        // Get the authenticated guide profile
        $guideProfile = $user->guideProfile;

        if (!$guideProfile) {
            return response()->json([
                'message' => 'Guide profile not found.',
            ], 404);
        }

        // Fetch only requests belonging to this guide
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

        // Calculate request counts
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

        return response()->json([
            'message' => 'Guide requests fetched successfully.',
            'counts' => $counts,
            'requests' => $requests,
        ]);
    }

    /**
     * Accept a travel request.
     *
     * When the guide accepts:
     *
     * 1. Travel request becomes accepted
     * 2. Booking is automatically created
     * 3. Pending payment is automatically created
     */
    public function accept($id): JsonResponse
    {
        $user = auth('api')->user();

        // Only guides can accept requests
        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can accept travel requests.',
            ], 403);
        }

        // Get authenticated guide profile
        $guideProfile = $user->guideProfile;

        if (!$guideProfile) {
            return response()->json([
                'message' => 'Guide profile not found.',
            ], 404);
        }

        // Make sure this request belongs to this guide
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

        // Only pending requests can be accepted
        if ($travelRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending requests can be accepted.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Create Booking + Payment
        |--------------------------------------------------------------------------
        */

        try {
            $result = DB::transaction(function () use (
                $travelRequest,
                $guideProfile
            ) {
                /*
                |--------------------------------------------------------------------------
                | 1. Update Travel Request
                |--------------------------------------------------------------------------
                */

                $travelRequest->update([
                    'status' => 'accepted',
                ]);

                /*
                |--------------------------------------------------------------------------
                | 2. Create Booking
                |--------------------------------------------------------------------------
                */

                $booking = Booking::create([
                    'travel_request_id' =>
                        $travelRequest->id,

                    'tourist_profile_id' =>
                        $travelRequest->tourist_profile_id,

                    'guide_profile_id' =>
                        $guideProfile->id,

                    'guide_experience_id' =>
                        $travelRequest->guide_experience_id,

                    'travel_date' =>
                        $travelRequest->travel_date,

                    'amount' =>
                        $travelRequest->amount,

                    'status' =>
                        'pending_payment',
                ]);

                /*
                |--------------------------------------------------------------------------
                | 3. Create Pending Payment
                |--------------------------------------------------------------------------
                */

                $payment = Payment::create([
                    'booking_id' =>
                        $booking->id,

                    'amount' =>
                        $booking->amount,

                    'status' =>
                        'pending',
                ]);

                return [
                    'booking' => $booking,
                    'payment' => $payment,
                ];
            });

            /*
            |--------------------------------------------------------------------------
            | Load Related Data
            |--------------------------------------------------------------------------
            */

            $travelRequest->load([
                'tourist',
                'guide',
                'experience',
                'booking',
            ]);

            $result['booking']->load([
                'tourist',
                'guide',
                'experience',
                'payment',
                'travelRequest',
            ]);

            /*
            |--------------------------------------------------------------------------
            | Success Response
            |--------------------------------------------------------------------------
            */

            return response()->json([
                'message' =>
                    'Travel request accepted and booking created successfully.',

                'request' =>
                    $travelRequest,

                'booking' =>
                    $result['booking'],

                'payment' =>
                    $result['payment'],
            ], 200);
        } catch (\Throwable $e) {
            /*
            |--------------------------------------------------------------------------
            | Error Response
            |--------------------------------------------------------------------------
            */

            return response()->json([
                'message' =>
                    'Failed to accept travel request.',

                'error' =>
                    $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reject a travel request.
     */
    public function reject($id): JsonResponse
    {
        $user = auth('api')->user();

        // Only guides can reject requests
        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can reject travel requests.',
            ], 403);
        }

        $guideProfile = $user->guideProfile;

        if (!$guideProfile) {
            return response()->json([
                'message' => 'Guide profile not found.',
            ], 404);
        }

        // Make sure this request belongs to the authenticated guide
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

        // Only pending requests can be rejected
        if ($travelRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending requests can be rejected.',
            ], 422);
        }

        // Update status
        $travelRequest->update([
            'status' => 'rejected',
        ]);

        // Return updated request
        $travelRequest->load([
            'tourist',
            'guide',
            'experience',
        ]);

        return response()->json([
            'message' => 'Travel request rejected successfully.',
            'request' => $travelRequest,
        ]);
    }

    /**
     * Cancel a travel request.
     */
    public function cancel($id): JsonResponse
    {
        $user = auth('api')->user();

        // Only guides can cancel requests
        if (!$user || $user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can cancel travel requests.',
            ], 403);
        }

        $guideProfile = $user->guideProfile;

        if (!$guideProfile) {
            return response()->json([
                'message' => 'Guide profile not found.',
            ], 404);
        }

        // Make sure this request belongs to the authenticated guide
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

        // Pending or accepted requests can be cancelled
        if (!in_array($travelRequest->status, [
            'pending',
            'accepted',
        ])) {
            return response()->json([
                'message' => 'This travel request cannot be cancelled.',
            ], 422);
        }

        // Update status
        $travelRequest->update([
            'status' => 'cancelled',
        ]);

        // Return updated request
        $travelRequest->load([
            'tourist',
            'guide',
            'experience',
        ]);

        return response()->json([
            'message' => 'Travel request cancelled successfully.',
            'request' => $travelRequest,
        ]);
    }
}