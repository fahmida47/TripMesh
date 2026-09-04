<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Get all bookings of the logged-in tourist.
     */
    public function index(Request $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        if ($user->role !== 'tourist') {
            return response()->json([
                'message' => 'Only tourists can view bookings.'
            ], 403);
        }

        $touristProfile = $user->touristProfile;

        if (!$touristProfile) {
            return response()->json([
                'message' => 'Tourist profile not found.'
            ], 404);
        }

        $bookings = Booking::with([
            'guide',
            'experience',
            'payment',
            'travelRequest'
        ])
        ->where(
            'tourist_profile_id',
            $touristProfile->id
        )
        ->latest()
        ->get();

        return response()->json([
            'message' => 'Bookings retrieved successfully.',
            'bookings' => $bookings
        ], 200);
    }

    /**
     * Get one booking of the logged-in tourist.
     */
    public function show(Request $request, $id)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        if ($user->role !== 'tourist') {
            return response()->json([
                'message' => 'Only tourists can view bookings.'
            ], 403);
        }

        $touristProfile = $user->touristProfile;

        if (!$touristProfile) {
            return response()->json([
                'message' => 'Tourist profile not found.'
            ], 404);
        }

        $booking = Booking::with([
            'guide',
            'experience',
            'payment',
            'travelRequest'
        ])
        ->where('id', $id)
        ->where(
            'tourist_profile_id',
            $touristProfile->id
        )
        ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Booking not found.'
            ], 404);
        }

        return response()->json([
            'message' => 'Booking retrieved successfully.',
            'booking' => $booking
        ], 200);
    }
}