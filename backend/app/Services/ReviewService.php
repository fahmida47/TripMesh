<?php

namespace App\Services;

use App\Models\Review;

class ReviewService
{

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