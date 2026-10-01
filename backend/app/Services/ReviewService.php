<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Review;

class ReviewService
{

    public function getEligibleBookings($touristProfile)
    {
        return Booking::with(['guide', 'experience'])
            ->where('tourist_profile_id', $touristProfile->id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->whereHas('payment', function ($query) {
                $query->where('status', 'paid');
            })
            ->whereDoesntHave('review')
            ->latest()
            ->get();
    }

    public function createReview($touristProfile, array $validated)
    {
        $booking = Booking::with('payment')
            ->where('id', $validated['booking_id'])
            ->where('tourist_profile_id', $touristProfile->id)
            ->first();

        if (!$booking) {
            return null;
        }

        if (
            !in_array($booking->status, ['confirmed', 'completed'], true)
            || $booking->payment?->status !== 'paid'
        ) {
            return false;
        }

        if ($booking->review()->exists()) {
            return 'duplicate';
        }

        return Review::create([
            'booking_id' => $booking->id,
            'tourist_profile_id' => $touristProfile->id,
            'guide_profile_id' => $booking->guide_profile_id,
            'rating' => $validated['rating'],
            'review' => $validated['review'],
            'submitted_at' => now(),
        ]);
    }

    public function getReviews($touristProfile)
    {
        return Review::with(['guide', 'booking.guide'])
            ->where('tourist_profile_id', $touristProfile->id)
            ->latest('submitted_at')
            ->get();
    }

    /**
     * Get guide review summary and reviews
     */
    public function getGuideReviews($guideProfile)
    {

        $reviewQuery = Review::query()

            ->where(
                'guide_profile_id',
                $guideProfile->id
            )

            ->whereHas('booking', function ($query) {

                $query->whereIn('status', [
                    'confirmed',
                    'completed'
                ])

                ->whereHas('payment', function ($paymentQuery) {

                    $paymentQuery->where(
                        'status',
                        'paid'
                    );

                });

            });



        $totalReviews = (clone $reviewQuery)->count();



        $overallRating = $totalReviews > 0

            ? round(
                (float)(clone $reviewQuery)
                ->avg('rating'),
                1
            )

            : null;



        $reviews = $reviewQuery

            ->with([
                'tourist',
                'booking.experience'
            ])

            ->latest('submitted_at')

            ->get()

            ->map(function ($review) {


                return [

                    'id' => $review->id,

                    'booking_id' =>
                        $review->booking_id,

                    'rating' =>
                        $review->rating,

                    'review' =>
                        $review->review,

                    'submitted_at' =>
                        $review->submitted_at,


                    'tourist' => [

                        'id' =>
                            $review->tourist?->id,

                        'full_name' =>
                            $review->tourist?->full_name,

                        'profile_picture' =>
                            $review->tourist?->profile_picture,

                    ],


                    'experience' => [

                        'id' =>
                            $review->booking?->experience?->id,

                        'title' =>
                            $review->booking?->experience?->title,

                    ]

                ];

            });



        return [

            'overall_rating' =>
                $overallRating,

            'total_reviews' =>
                $totalReviews,

            'reviews' =>
                $reviews

        ];

    }

}