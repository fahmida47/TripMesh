<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminChatNotificationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guide_and_tourist_chat_messages_notify_the_admin(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'phone' => '+8801700000021',
            'role' => 'admin',
        ]);

        $guide = User::create([
            'name' => 'Guide User',
            'phone' => '+8801700000022',
            'role' => 'guide',
        ]);

        $tourist = User::create([
            'name' => 'Tourist User',
            'phone' => '+8801700000023',
            'role' => 'tourist',
        ]);

        $guideConversationId = $this->sendMessageToAdmin($guide, $admin, 'Guide question');
        $touristConversationId = $this->sendMessageToAdmin($tourist, $admin, 'Tourist question');

        $this->actingAs($admin, 'api')
            ->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonFragment([
                'title' => 'New chat message',
                'message' => 'Guide User (guide) sent you a message.',
                'action_url' => '/admin/chat',
            ])
            ->assertJsonFragment([
                'title' => 'New chat message',
                'message' => 'Tourist User (tourist) sent you a message.',
                'action_url' => '/admin/chat',
            ]);

        $this->actingAs($guide, 'api')
            ->getJson('/api/notifications')
            ->assertOk()
            ->assertExactJson([]);

        $this->actingAs($admin, 'api')
            ->postJson("/api/chat/conversations/{$guideConversationId}/messages", [
                'message' => 'Guide reply',
            ])
            ->assertCreated();

        $this->postJson("/api/chat/conversations/{$touristConversationId}/messages", [
            'message' => 'Tourist reply',
        ])->assertCreated();

        $this->actingAs($guide, 'api')
            ->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'title' => 'New chat message',
                'message' => 'Admin User (admin) sent you a message.',
                'action_url' => '/guide-dashboard/chat',
            ]);

        $this->actingAs($tourist, 'api')
            ->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'title' => 'New chat message',
                'message' => 'Admin User (admin) sent you a message.',
                'action_url' => '/tourist-dashboard/chat',
            ]);
    }

    private function sendMessageToAdmin(User $sender, User $admin, string $message): int
    {
        $conversation = $this->actingAs($sender, 'api')
            ->postJson('/api/chat/conversations', ['user_id' => $admin->id])
            ->assertOk()
            ->json('data.id');

        $this->postJson("/api/chat/conversations/{$conversation}/messages", [
            'message' => $message,
        ])->assertCreated();

        return $conversation;
    }
}