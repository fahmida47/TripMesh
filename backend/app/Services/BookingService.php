<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class BookingService
{

    public function getGuideBookings($guideProfile)
    {
        return Booking::with([
            'tourist.user',
            'guide',
            'experience',
            'payment',
            'travelRequest',
        ])
            ->where('guide_profile_id', $guideProfile->id)
            ->latest()
            ->get();
    }

    public function completeGuideBooking($guideProfile, $bookingId)
    {
        return DB::transaction(function () use ($guideProfile, $bookingId) {
            $booking = Booking::whereKey($bookingId)
                ->where('guide_profile_id', $guideProfile->id)
                ->lockForUpdate()
                ->first();

            if (!$booking) {
                return null;
            }

            $booking->load('payment');

            if ($booking->status !== 'confirmed' || $booking->payment?->status !== 'paid') {
                return false;
            }

            $booking->update(['status' => 'completed']);

            return $booking->fresh([
                'tourist.user',
                'guide',
                'experience',
                'payment',
                'travelRequest',
            ]);
        });
    }

    /**
     * Get all tourist bookings
     */
    public function getTouristBookings($touristProfile)
    {
        return Booking::with([
            'guide',
            'experience',
            'payment.payout',
            'travelRequest'
        ])
        ->where(
            'tourist_profile_id',
            $touristProfile->id
        )
        ->latest()
        ->get();
    }



    /**
     * Get single tourist booking
     */
    public function getTouristBooking(
        $touristProfile,
        $id
    )
    {

        return Booking::with([
            'guide',
            'experience',
            'payment.payout',
            'travelRequest'
        ])
        ->where(
            'id',
            $id
        )
        ->where(
            'tourist_profile_id',
            $touristProfile->id
        )
        ->first();

    }

}