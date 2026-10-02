<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Guide\GuideProfile;
use App\Models\Payment;
use App\Models\Review;
use App\Models\TouristProfile;
use App\Models\TravelRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminReviewApprovalUpdatesGuideRatingTest extends TestCase
{
    use RefreshDatabase;

    public function test_approved_review_updates_guide_profile_rating_and_review_count(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'phone' => '+8801700000001',
            'role' => 'admin',
        ]);

        $guideUser = User::create([
            'name' => 'Guide User',
            'phone' => '+8801700000002',
            'role' => 'guide',
        ]);

        $touristUser = User::create([
            'name' => 'Tourist User',
            'phone' => '+8801700000003',
            'role' => 'tourist',
        ]);

        $guideProfile = GuideProfile::create([
            'user_id' => $guideUser->id,
            'company_name' => 'Blue Lake Adventures',
            'contact_person' => 'Nadia',
            'bio' => 'Great local guide',
            'address' => 'Sundarbans',
            'price' => 5000,
            'min_price' => 4000,
            'max_price' => 6000,
            'rating' => 0,
            'reviews' => 0,
            'popularity' => 0,
            'tour_types' => ['Nature'],
        ]);

        $touristProfile = TouristProfile::create([
            'user_id' => $touristUser->id,
            'full_name' => 'Tourist Name',
            'phone' => '+8801700000004',
            'email' => 'tourist@example.com',
            'city' => 'Dhaka',
            'country' => 'Bangladesh',
        ]);

        $travelRequest = TravelRequest::create([
            'tourist_profile_id' => $touristProfile->id,
            'guide_profile_id' => $guideProfile->id,
            'destination' => 'Sundarbans',
            'travelers' => 2,
            'from_date' => now()->toDateString(),
            'to_date' => now()->addDay()->toDateString(),
            'amount' => 5000,
            'status' => 'accepted',
        ]);

        $booking = Booking::create([
            'travel_request_id' => $travelRequest->id,
            'tourist_profile_id' => $touristProfile->id,
            'guide_profile_id' => $guideProfile->id,
            'from_date' => now()->toDateString(),
            'to_date' => now()->addDay()->toDateString(),
            'amount' => 5000,
            'status' => 'completed',
        ]);

        Payment::create([
            'booking_id' => $booking->id,
            'method' => 'bKash',
            'account_number' => '01700000001',
            'payment_date_time' => now(),
            'amount' => 5000,
            'status' => 'paid',
            'transaction_reference' => 'TXN-1001',
        ]);

        $review = Review::create([
            'booking_id' => $booking->id,
            'tourist_profile_id' => $touristProfile->id,
            'guide_profile_id' => $guideProfile->id,
            'rating' => 5,
            'review' => 'Excellent experience',
            'submitted_at' => now(),
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'api')
            ->patchJson("/api/admin/reviews/{$review->id}", [
                'status' => 'approved',
            ]);

        $response->assertOk();

        $guideProfile->refresh();

        $this->assertSame(5.0, (float) $guideProfile->rating);
        $this->assertSame(1, $guideProfile->reviews);
    }

    public function test_explore_returns_approved_review_rating_and_count(): void
    {
        $guideUser = User::create([
            'name' => 'Guide User',
            'phone' => '+8801700000005',
            'role' => 'guide',
        ]);

        $touristUser = User::create([
            'name' => 'Tourist User',
            'phone' => '+8801700000006',
            'role' => 'tourist',
        ]);

        $guideProfile = GuideProfile::create([
            'user_id' => $guideUser->id,
            'company_name' => 'Forest Trails',
            'bio' => 'Nature guide',
            'address' => 'Khagrachari',
            'price' => 4000,
            'min_price' => 3000,
            'max_price' => 5000,
            'rating' => 0,
            'reviews' => 0,
            'popularity' => 0,
            'tour_types' => ['Forest'],
        ]);

        $touristProfile = TouristProfile::create([
            'user_id' => $touristUser->id,
            'full_name' => 'Tourist Name',
            'phone' => '+8801700000007',
            'email' => 'tourist2@example.com',
            'city' => 'Dhaka',
            'country' => 'Bangladesh',
        ]);

        $travelRequest = TravelRequest::create([
            'tourist_profile_id' => $touristProfile->id,
            'guide_profile_id' => $guideProfile->id,
            'destination' => 'Khagrachari',
            'travelers' => 2,
            'from_date' => now()->toDateString(),
            'to_date' => now()->addDay()->toDateString(),
            'amount' => 4000,
            'status' => 'accepted',
        ]);

        $booking = Booking::create([
            'travel_request_id' => $travelRequest->id,
            'tourist_profile_id' => $touristProfile->id,
            'guide_profile_id' => $guideProfile->id,
            'from_date' => now()->toDateString(),
            'to_date' => now()->addDay()->toDateString(),
            'amount' => 4000,
            'status' => 'completed',
        ]);

        Payment::create([
            'booking_id' => $booking->id,
            'method' => 'Nagad',
            'account_number' => '01700000002',
            'payment_date_time' => now(),
            'amount' => 4000,
            'status' => 'paid',
            'transaction_reference' => 'TXN-1002',
        ]);

        Review::create([
            'booking_id' => $booking->id,
            'tourist_profile_id' => $touristProfile->id,
            'guide_profile_id' => $guideProfile->id,
            'rating' => 4,
            'review' => 'Loved the trip',
            'submitted_at' => now(),
            'status' => 'approved',
        ]);

        $response = $this->getJson('/api/guides/explore?sort=rating');

        $response->assertOk();
        $this->assertSame(4.0, (float) $response->json('data.0.rating'));
        $this->assertSame(1, $response->json('data.0.reviews'));
    }
}
