<?php

namespace App\Http\Controllers;

use App\Models\UserNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user('api')
            ->notifications()
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn (UserNotification $notification) => [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'message' => $notification->message,
                'action_url' => $notification->action_url,
                'created_at' => $notification->created_at,
                'read_at' => $notification->read_at,
                'read' => $notification->read_at !== null,
            ]);

        return response()->json($notifications->values());
    }

    public function markRead(Request $request, int $id): JsonResponse
    {
        $notification = $request->user('api')
            ->notifications()
            ->whereKey($id)
            ->firstOrFail();

        $notification->update(['read_at' => $notification->read_at ?? now()]);

        return response()->json(['message' => 'Notification marked as read.']);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user('api')
            ->notifications()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Notifications marked as read.']);
    }
}