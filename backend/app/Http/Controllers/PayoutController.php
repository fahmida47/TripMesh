<?php

namespace App\Http\Controllers;

use App\Models\Payout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PayoutController extends Controller
{
    public function adminIndex(Request $request): JsonResponse
    {
        if ($request->user('api')?->role !== 'admin') {
            return response()->json(['message' => 'Only admins can view payouts.'], 403);
        }

        $payouts = Payout::with(['payment.booking.experience', 'guide.user', 'processedBy'])
            ->latest()
            ->get();

        return response()->json(['payouts' => $payouts]);
    }

    public function release(Request $request, Payout $payout): JsonResponse
    {
        $admin = $request->user('api');

        if ($admin?->role !== 'admin') {
            return response()->json(['message' => 'Only admins can release payouts.'], 403);
        }

        $validated = $request->validate([
            'payout_reference' => ['nullable', 'string', 'max:100', 'unique:payouts,payout_reference'],
        ]);

        $payout = DB::transaction(function () use ($payout, $validated, $admin) {
            $lockedPayout = Payout::whereKey($payout->id)->lockForUpdate()->firstOrFail();

            if ($lockedPayout->status !== 'pending') {
                abort(422, 'This payout has already been processed.');
            }

            $lockedPayout->update([
                'status' => 'paid',
                'payout_reference' => $validated['payout_reference']
                    ?? 'PAYOUT-' . strtoupper(Str::random(12)),
                'processed_by_user_id' => $admin->id,
                'paid_at' => now(),
            ]);

            return $lockedPayout->fresh(['payment.booking.experience', 'guide.user', 'processedBy']);
        });

        return response()->json([
            'message' => 'Guide payout released successfully.',
            'payout' => $payout,
        ]);
    }

    public function guideIndex(Request $request): JsonResponse
    {
        $user = $request->user('api');

        if ($user?->role !== 'guide') {
            return response()->json(['message' => 'Only guides can view their payouts.'], 403);
        }

        if (!$user->guideProfile) {
            return response()->json(['message' => 'Guide profile not found.'], 404);
        }

        $payouts = Payout::with(['payment.booking.experience'])
            ->where('guide_profile_id', $user->guideProfile->id)
            ->latest()
            ->get();

        return response()->json(['payouts' => $payouts]);
    }
}
