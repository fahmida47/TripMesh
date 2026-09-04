<?php

namespace App\Http\Controllers\Guide;

use App\Http\Controllers\Controller;
use App\Models\Guide\GuideProfile;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuideReviewController extends Controller
{
    /**
     * Return the authenticated guide's read-only review summary and reviews.
     */
    public function index(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->role !== 'guide') {
            return response()->json([
                'message' => 'Only guides can view guide reviews.',
            ], 403);
        }

        $guideProfile = GuideProfile::where('user_id', $user->id)->first();

        if (!$guideProfile) {
            return response()->json([
                'message' => 'Guide profile not found.',
            ], 404);
        }

        $reviewQuery = Review::query()
            ->where('guide_profile_id', $guideProfile->id)
            ->whereHas('booking', fn ($query) => $query
                ->whereIn('status', ['confirmed', 'completed'])
                ->whereHas('payment', fn ($paymentQuery) => $paymentQuery->where('status', 'paid')));

        $totalReviews = (clone $reviewQuery)->count();
        $overallRating = $totalReviews > 0
            ? round((float) (clone $reviewQuery)->avg('rating'), 1)
            : null;

        $reviews = $reviewQuery
            ->with(['tourist', 'booking.experience'])
            ->latest('submitted_at')
            ->get()
            ->map(fn (Review $review) => [
                'id' => $review->id,
                'booking_id' => $review->booking_id,
                'rating' => $review->rating,
                'review' => $review->review,
                'submitted_at' => $review->submitted_at,
                'tourist' => [
                    'id' => $review->tourist?->id,
                    'full_name' => $review->tourist?->full_name,
                    'profile_picture' => $review->tourist?->profile_picture,
                ],
                'experience' => [
                    'id' => $review->booking?->experience?->id,
                    'title' => $review->booking?->experience?->title,
                ],
            ]);

        return response()->json([
            'message' => 'Guide reviews retrieved successfully.',
            'overall_rating' => $overallRating,
            'total_reviews' => $totalReviews,
            'reviews' => $reviews,
        ]);
    }
}
