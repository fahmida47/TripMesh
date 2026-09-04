<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Review;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function eligible(Request $request): JsonResponse
    {
        $touristProfile = $this->touristProfile();

        if ($touristProfile instanceof JsonResponse) {
            return $touristProfile;
        }

        $bookings = Booking::with(['guide.user', 'experience', 'payment'])
            ->where('tourist_profile_id', $touristProfile->id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->whereHas('payment', fn ($query) => $query->where('status', 'paid'))
            ->whereDoesntHave('review')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Eligible bookings retrieved successfully.',
            'bookings' => $bookings,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_id' => ['required', 'integer', 'exists:bookings,id'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'review' => ['required', 'string', 'min:3', 'max:2000'],
        ]);

        $touristProfile = $this->touristProfile();

        if ($touristProfile instanceof JsonResponse) {
            return $touristProfile;
        }

        $booking = Booking::with('payment')
            ->where('id', $validated['booking_id'])
            ->where('tourist_profile_id', $touristProfile->id)
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'Booking not found.'], 404);
        }

        if (!in_array($booking->status, ['confirmed', 'completed'], true)
            || $booking->payment?->status !== 'paid') {
            return response()->json([
                'message' => 'Reviews can only be submitted for completed, paid bookings.',
            ], 422);
        }

        if (Review::where('booking_id', $booking->id)->exists()) {
            return response()->json([
                'message' => 'A review has already been submitted for this booking.',
            ], 409);
        }

        try {
            $review = Review::create([
                'booking_id' => $booking->id,
                'tourist_profile_id' => $touristProfile->id,
                'guide_profile_id' => $booking->guide_profile_id,
                'rating' => $validated['rating'],
                'review' => trim($validated['review']),
                'submitted_at' => now(),
            ]);
        } catch (QueryException $exception) {
            if ($this->isDuplicateBookingReview($exception)) {
                return response()->json([
                    'message' => 'A review has already been submitted for this booking.',
                ], 409);
            }

            throw $exception;
        }

        $review->load(['booking.experience', 'guide.user']);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $review,
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $touristProfile = $this->touristProfile();

        if ($touristProfile instanceof JsonResponse) {
            return $touristProfile;
        }

        $reviews = Review::with(['booking.experience', 'guide.user'])
            ->where('tourist_profile_id', $touristProfile->id)
            ->latest('submitted_at')
            ->get();

        return response()->json([
            'message' => 'Reviews retrieved successfully.',
            'reviews' => $reviews,
        ]);
    }

    private function touristProfile()
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->role !== 'tourist') {
            return response()->json(['message' => 'Only tourists can manage reviews.'], 403);
        }

        if (!$user->touristProfile) {
            return response()->json(['message' => 'Tourist profile not found.'], 404);
        }

        return $user->touristProfile;
    }

    private function isDuplicateBookingReview(QueryException $exception): bool
    {
        return in_array((string) $exception->getCode(), ['23000', '23505'], true);
    }
}
