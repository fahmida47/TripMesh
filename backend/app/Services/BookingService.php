<?php

namespace App\Services;

use App\Models\Booking;

class BookingService
{

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