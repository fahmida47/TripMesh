<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Submit payment for a booking.
     */
    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== 'tourist') {
            return response()->json([
                'message' => 'Only tourists can make payments.',
            ], 403);
        }

        $touristProfile = $user->touristProfile;

        if (!$touristProfile) {
            return response()->json([
                'message' => 'Tourist profile not found.',
            ], 404);
        }

        $validated = $request->validate([
            'booking_id' => [
                'required',
                'integer',
                'exists:bookings,id',
            ],

            'method' => [
                'required',
                'string',
                'max:50',
            ],

            'account_number' => [
                'required',
                'string',
                'max:50',
            ],

            'payment_date_time' => [
                'required',
                'date',
            ],
        ]);

        $booking = Booking::where('id', $validated['booking_id'])
            ->where(
                'tourist_profile_id',
                $touristProfile->id
            )
            ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Booking not found.',
            ], 404);
        }

        if ($booking->status !== 'pending_payment') {
            return response()->json([
                'message' =>
                    'This booking is not waiting for payment.',
            ], 422);
        }

        $payment = Payment::where(
            'booking_id',
            $booking->id
        )->first();

        if (!$payment) {
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'amount' => $booking->amount,
                'status' => 'pending',
            ]);
        }

        if ($payment->status === 'paid') {
            return response()->json([
                'message' => 'Payment has already been completed.',
                'payment' => $payment,
                'booking' => $booking,
            ], 422);
        }

        $payment->update([
            'method' =>
                $validated['method'],

            'account_number' =>
                $validated['account_number'],

            'payment_date_time' =>
                $validated['payment_date_time'],

            // Demo/manual payment submission
            'status' => 'paid',

            'transaction_reference' =>
                'TRX-' . strtoupper(Str::random(12)),

            'paid_at' => now(),
        ]);

        $booking->update([
            'status' => 'confirmed',
        ]);

        $booking->load([
            'guide.user',
            'experience',
            'payment',
            'travelRequest',
        ]);

        return response()->json([
            'message' =>
                'Payment completed and booking confirmed successfully.',

            'payment' => $payment,

            'booking' => $booking,
        ]);
    }

    /**
     * Get payment for a booking.
     */
    public function showByBooking($bookingId): JsonResponse
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== 'tourist') {
            return response()->json([
                'message' => 'Only tourists can view payments.',
            ], 403);
        }

        $touristProfile = $user->touristProfile;

        if (!$touristProfile) {
            return response()->json([
                'message' => 'Tourist profile not found.',
            ], 404);
        }

        $booking = Booking::where('id', $bookingId)
            ->where(
                'tourist_profile_id',
                $touristProfile->id
            )
            ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Booking not found.',
            ], 404);
        }

        $payment = Payment::where(
            'booking_id',
            $booking->id
        )->first();

        if (!$payment) {
            return response()->json([
                'message' => 'Payment not found.',
            ], 404);
        }

        return response()->json([
            'message' => 'Payment fetched successfully.',
            'payment' => $payment,
        ]);
    }
}