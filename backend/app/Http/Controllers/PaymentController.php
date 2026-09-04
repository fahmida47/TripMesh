<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Payout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    private const COMMISSION_RATE = 10.00;

    /**
     * Submit payment for a booking.
     */
    public function initiate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_id' => [
                'required',
                'integer',
                'exists:bookings,id',
            ],

        ]);

        $booking = $this->findTouristBooking($validated['booking_id']);

        if (!$booking) {
            return response()->json([
                'message' => 'Booking not found.',
            ], 404);
        }

        if ($booking->status !== 'pending_payment') {
            return response()->json([
                'message' => 'This booking is not waiting for payment.',
            ], 422);
        }

        $payment = Payment::where(
            'booking_id',
            $booking->id
        )->first();

        $payment ??= Payment::create([
            'booking_id' => $booking->id,
            'amount' => $booking->amount,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Payment initiated successfully.',
            'payment' => $payment,
            'booking' => $booking,
        ]);
    }

    /**
     * Record a completed mobile-wallet payment and confirm its booking.
     */
    public function complete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_id' => ['required', 'integer', 'exists:bookings,id'],
            'method' => ['required', 'in:bkash,nagad'],
            'account_number' => ['required', 'string', 'max:50'],
            'payment_date_time' => ['required', 'date'],
            'transaction_reference' => [
                'nullable',
                'string',
                'max:100',
                'unique:payments,transaction_reference',
            ],
        ]);

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

        $result = DB::transaction(function () use ($validated, $touristProfile) {
            $booking = Booking::where('id', $validated['booking_id'])
                ->where('tourist_profile_id', $touristProfile->id)
                ->lockForUpdate()
                ->first();

            if (!$booking) {
                return ['error' => 'Booking not found.', 'status' => 404];
            }

            $payment = Payment::where('booking_id', $booking->id)
                ->lockForUpdate()
                ->first();

            if ($payment?->status === 'paid' || $booking->status === 'confirmed') {
                return [
                    'error' => 'Payment has already been completed for this booking.',
                    'status' => 422,
                ];
            }

            if ($booking->status !== 'pending_payment') {
                return ['error' => 'This booking is not waiting for payment.', 'status' => 422];
            }

            $payment ??= Payment::create([
                'booking_id' => $booking->id,
                'amount' => $booking->amount,
                'status' => 'pending',
            ]);

            $payment->update([
                'method' => $validated['method'],
                'account_number' => $validated['account_number'],
                'payment_date_time' => $validated['payment_date_time'],
                'transaction_reference' => $validated['transaction_reference']
                    ?? 'TRX-' . strtoupper(Str::random(12)),
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            $commissionAmount = round($payment->amount * (self::COMMISSION_RATE / 100), 2);

            Payout::create([
                'payment_id' => $payment->id,
                'guide_profile_id' => $booking->guide_profile_id,
                'gross_amount' => $payment->amount,
                'commission_rate' => self::COMMISSION_RATE,
                'commission_amount' => $commissionAmount,
                'net_amount' => round($payment->amount - $commissionAmount, 2),
                'status' => 'pending',
            ]);

            $booking->update(['status' => 'confirmed']);

            $booking->load(['guide.user', 'experience', 'payment.payout', 'travelRequest']);
            $payment->load('payout');

            return compact('payment', 'booking');
        });

        if (isset($result['error'])) {
            return response()->json([
                'message' => $result['error'],
            ], $result['status']);
        }

        return response()->json([
            'message' => 'Payment completed and booking confirmed successfully.',
            'payment' => $result['payment'],
            'booking' => $result['booking'],
        ], 200);
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

    private function findTouristBooking(int $bookingId): ?Booking
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== 'tourist' || !$user->touristProfile) {
            return null;
        }

        return Booking::where('id', $bookingId)
            ->where('tourist_profile_id', $user->touristProfile->id)
            ->first();
    }
}
