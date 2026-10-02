<?php

namespace Tests\Feature;

use App\Models\Guide\GuideProfile;
use App\Models\TouristProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserNotificationsTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $guide;
    private User $tourist;
    private GuideProfile $guideProfile;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Admin User',
            'phone' => '+8801700000011',
            'role' => 'admin',
        ]);

        $this->guide = User::create([
            'name' => 'Guide User',
            'phone' => '+8801700000012',
            'role' => 'guide',
        ]);

        $this->tourist = User::create([
            'name' => 'Tourist User',
            'phone' => '+8801700000013',
            'role' => 'tourist',
        ]);

        $this->guideProfile = GuideProfile::create([
            'user_id' => $this->guide->id,
            'company_name' => 'River Routes',
            'price' => 5000,
            'min_price' => 4000,
            'max_price' => 6000,
            'payout_bkash_number' => '01700000000',
            'rating' => 0,
            'reviews' => 0,
            'popularity' => 0,
            'tour_types' => ['Nature'],
        ]);

        TouristProfile::create([
            'user_id' => $this->tourist->id,
            'full_name' => 'Tourist User',
            'phone' => '+8801700000013',
            'email' => 'tourist@example.com',
        ]);
    }

    public function test_request_payment_and_payout_events_notify_the_affected_users(): void
    {
        $requestId = $this->sendTravelRequest();

        $guideNotifications = $this->actingAs($this->guide, 'api')
            ->getJson('/api/notifications')
            ->assertOk('Guide notification list failed.')
            ->assertJsonFragment([
                'title' => 'New travel request',
                'action_url' => '/guide-dashboard/requests',
            ]);

        $this->putJson("/api/travel-requests/guide/{$requestId}/accept")
            ->assertOk('Guide accept failed.');

        $touristNotifications = $this->actingAs($this->tourist, 'api')
            ->getJson('/api/notifications')
            ->assertOk('Tourist notification list failed after acceptance.')
            ->assertJsonFragment([
                'title' => 'Request accepted',
                'action_url' => '/tourist-dashboard/bookings',
            ]);

        $guideNotificationId = $guideNotifications->json('0.id');
        $this->actingAs($this->tourist, 'api')
            ->patchJson("/api/notifications/{$guideNotificationId}/read")
            ->assertNotFound();

        $bookingId = $this->getJson('/api/bookings')
            ->assertOk('Tourist bookings list failed.')
            ->json('bookings.0.id');

        $this->postJson('/api/payments/complete', [
            'booking_id' => $bookingId,
            'method' => 'bkash',
            'account_number' => '01700000000',
            'payment_date_time' => now()->toDateTimeString(),
            'transaction_reference' => 'TXN-NOTIFICATION-1',
        ])->assertOk();

        $adminNotifications = $this->actingAs($this->admin, 'api')
            ->getJson('/api/notifications')
            ->assertOk('Admin notification list failed.')
            ->assertJsonFragment([
                'title' => 'Tourist payment submitted',
                'action_url' => '/admin/payments',
            ]);

        $paymentId = $this->getJson('/api/admin/payments')
            ->assertOk('Admin payment list failed.')
            ->json('data.data.0.id');

        $this->patchJson("/api/admin/payments/{$paymentId}", [
            'status' => 'paid',
        ])->assertOk();

        $payoutId = $this->getJson('/api/admin/payouts')
            ->assertOk('Admin payout list failed.')
            ->json('data.data.0.id');

        $this->postJson("/api/admin/payouts/{$payoutId}/release")
            ->assertOk('Admin payout release failed.');

        $this->actingAs($this->guide, 'api')
            ->getJson('/api/notifications')
            ->assertOk('Guide notification list failed after payout.')
            ->assertJsonFragment([
                'title' => 'Guide payout sent',
                'action_url' => '/guide-dashboard/payouts',
            ]);

        $touristNotificationId = $touristNotifications->json('0.id');
        $this->actingAs($this->tourist, 'api')
            ->patchJson("/api/notifications/{$touristNotificationId}/read")
            ->assertOk();

        $this->patchJson('/api/notifications/read-all')
            ->assertOk();

        $this->assertNotNull($adminNotifications->json('0.id'));
    }

    public function test_rejected_request_notifies_its_tourist(): void
    {
        $requestId = $this->sendTravelRequest();

        $this->actingAs($this->guide, 'api')
            ->putJson("/api/travel-requests/guide/{$requestId}/reject")
            ->assertOk();

        $this->actingAs($this->tourist, 'api')
            ->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonFragment([
                'title' => 'Request declined',
                'action_url' => '/tourist-dashboard/bookings',
            ]);
    }

    private function sendTravelRequest(): int
    {
        $response = $this->actingAs($this->tourist, 'api')
            ->postJson('/api/travel-requests', [
                'guide_profile_id' => $this->guideProfile->id,
                'destination' => 'Sundarbans',
                'travelers' => 2,
                'from_date' => now()->addDays(2)->toDateString(),
                'to_date' => now()->addDays(3)->toDateString(),
                'amount' => 5000,
            ]);

        $response->assertCreated();

        return $response->json('request.id');
    }
}