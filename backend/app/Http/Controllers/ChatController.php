<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ChatController extends Controller
{
    public function conversations(Request $request): JsonResponse
    {
        $user = $request->user('api');

        // Make the admin inbox available to every tourist and guide as soon as
        // they open chat, even before either side has sent the first message.
        if (in_array($user->role, ['tourist', 'guide'], true)) {
            User::where('role', 'admin')->pluck('id')->each(
                fn (int $adminId) => $this->findOrCreateConversation($user->id, $adminId),
            );
        }

        $conversations = ChatConversation::query()
            ->where(fn ($query) => $query->where('user_one_id', $user->id)->orWhere('user_two_id', $user->id))
            ->with(['userOne', 'userTwo'])
            ->withMax('messages', 'created_at')
            ->orderByDesc('messages_max_created_at')
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (ChatConversation $conversation) => $this->conversationPayload($conversation, $user));

        return response()->json(['data' => $conversations]);
    }

    public function createConversation(Request $request): JsonResponse
    {
        $user = $request->user('api');
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);
        $other = User::findOrFail($data['user_id']);

        $allowed = $user->role === 'admin'
            ? in_array($other->role, ['tourist', 'guide'], true)
            : in_array($user->role, ['tourist', 'guide'], true) && $other->role === 'admin';

        if (!$allowed || $other->is($user)) {
            throw ValidationException::withMessages([
                'user_id' => ['Chat is only allowed between an admin and a tourist or guide.'],
            ]);
        }

        $conversation = $this->findOrCreateConversation($user->id, $other->id);
        $conversation->load(['userOne', 'userTwo']);

        return response()->json(['data' => $this->conversationPayload($conversation, $user)], 200);
    }

    public function messages(Request $request, int $conversationId): JsonResponse
    {
        $user = $request->user('api');
        $conversation = $this->authorizedConversation($conversationId, $user);

        ChatMessage::where('conversation_id', $conversation->id)
            ->where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = $conversation->messages()
            ->with('sender:id,name,role')
            ->orderBy('id')
            ->get()
            ->map(fn (ChatMessage $message) => $this->messagePayload($message, $user));

        return response()->json(['data' => $messages]);
    }

    public function sendMessage(Request $request, int $conversationId): JsonResponse
    {
        $user = $request->user('api');
        $conversation = $this->authorizedConversation($conversationId, $user);
        $data = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);
        $body = trim($data['message']);
        if ($body === '') {
            throw ValidationException::withMessages(['message' => ['A message cannot be empty.']]);
        }

        $recipient = $conversation->otherUser($user->id);
        abort_if(!$recipient, 404, 'Conversation not found.');

        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'recipient_id' => $recipient->id,
            'message' => $body,
        ]);
        $message->setRelation('sender', $user);

        return response()->json(['data' => $this->messagePayload($message, $user)], 201);
    }

    public function markRead(Request $request, int $conversationId): JsonResponse
    {
        $user = $request->user('api');
        $conversation = $this->authorizedConversation($conversationId, $user);
        $updated = ChatMessage::where('conversation_id', $conversation->id)
            ->where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Conversation marked as read.', 'updated' => $updated]);
    }

    private function authorizedConversation(int $conversationId, User $user): ChatConversation
    {
        return ChatConversation::query()
            ->whereKey($conversationId)
            ->where(fn ($query) => $query->where('user_one_id', $user->id)->orWhere('user_two_id', $user->id))
            ->with(['userOne', 'userTwo'])
            ->firstOrFail();
    }

    private function findOrCreateConversation(int $firstId, int $secondId): ChatConversation
    {
        [$one, $two] = $firstId < $secondId ? [$firstId, $secondId] : [$secondId, $firstId];
        return ChatConversation::firstOrCreate(['user_one_id' => $one, 'user_two_id' => $two]);
    }

    private function conversationPayload(ChatConversation $conversation, User $user): array
    {
        $other = $conversation->otherUser($user->id);
        $last = $conversation->messages()->latest('id')->first();
        $unread = $conversation->messages()
            ->where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return [
            'id' => $conversation->id,
            'name' => $other?->name,
            'role' => $other?->role,
            'user' => $other ? ['id' => $other->id, 'name' => $other->name, 'role' => $other->role] : null,
            'lastMessage' => $last?->message,
            'time' => $last?->created_at?->format('M j, H:i'),
            'last_message_at' => $last?->created_at,
            'unread_count' => $unread,
        ];
    }

    private function messagePayload(ChatMessage $message, User $user): array
    {
        return [
            'id' => $message->id,
            'message' => $message->message,
            'sender' => (int) $message->sender_id === (int) $user->id ? 'me' : 'other',
            'sender_id' => $message->sender_id,
            'sender_name' => $message->sender?->name,
            'sender_role' => $message->sender?->role,
            'time' => $message->created_at?->format('M j, H:i'),
            'created_at' => $message->created_at,
            'read_at' => $message->read_at,
        ];
    }
}
