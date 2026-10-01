<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Payout;
use App\Models\Review;
use App\Models\User;
use App\Services\PayoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function sendCode(Request $request): JsonResponse
    {
        $data = Validator::make($request->all(), [
            'phone' => ['required', 'string', 'min:10', 'max:20'],
        ])->validate();
        $phone = trim($data['phone']);
        $admin = User::where('phone', $phone)->where('role', 'admin')->first();

        if (!$admin) {
            return response()->json(['message' => 'Admin account not found.'], 403);
        }

        $code = (string) random_int(100000, 999999);
        Cache::put('verification_code_' . $phone, $code, now()->addMinutes(2));
        $entry = "TripMesh Admin OTP | Phone: {$phone} | OTP: {$code} | Expires: 2 minutes";
        error_log($entry);
        Log::channel('stderr')->info($entry);
        Log::info('TripMesh admin verification code generated', ['phone' => $phone, 'otp' => $code]);

        return response()->json(['message' => 'Admin verification code sent.']);
    }

    public function verifyCode(Request $request): JsonResponse
    {
        $data = Validator::make($request->all(), [
            'phone' => ['required', 'string', 'min:10', 'max:20'],
            'code' => ['required', 'string', 'size:6'],
        ])->validate();
        $phone = trim($data['phone']);
        $admin = User::where('phone', $phone)->where('role', 'admin')->first();
        $key = 'verification_code_' . $phone;
        $storedCode = Cache::get($key);

        if (!$admin || !$storedCode || !hash_equals((string) $storedCode, trim($data['code']))) {
            return response()->json(['message' => 'Invalid or expired admin verification code.'], 401);
        }

        Cache::forget($key);
        return response()->json([
            'token' => auth('api')->login($admin),
            'user' => ['id' => $admin->id, 'name' => $admin->name, 'phone' => $admin->phone, 'role' => 'admin'],
        ]);
    }

    public function overview(): JsonResponse
    {
        $paid = Payment::where('status', 'paid');
        return response()->json([
            'stats' => [
                'tourists' => User::where('role', 'tourist')->count(),
                'guides' => User::where('role', 'guide')->count(),
                'bookings' => Booking::count(),
                'pending_reviews' => Review::where('status', 'pending')->count(),
                'pending_payments' => Payment::whereIn('status', ['pending', 'pending_review'])->count(),
                'payment_total' => (float) (clone $paid)->sum('amount'),
                'commission_total' => (float) Payout::sum('commission_amount'),
            ],
        ]);
    }

    public function payments(): JsonResponse
    {
        $payments = Payment::with(['booking.tourist.user', 'booking.guide.user', 'payout'])
            ->latest()->paginate(25);
        return response()->json(['commission_slabs' => $this->commissionSlabs(), 'data' => $payments]);
    }

    public function commissions(): JsonResponse
    {
        return response()->json([
            'commission_slabs' => $this->commissionSlabs(),
            'data' => Payout::with(['payment', 'guide.user', 'processedBy'])->latest()->paginate(25),
        ]);
    }

    public function payouts(): JsonResponse
    {
        return response()->json([
            'data' => Payout::with(['payment.booking.experience', 'guide.user', 'processedBy'])->latest()->paginate(25),
        ]);
    }

    public function releasePayout(Request $request, Payout $payout, PayoutService $payoutService): JsonResponse
    {
        $data = $request->validate([
            'payout_reference' => ['nullable', 'string', 'max:100', 'unique:payouts,payout_reference'],
        ]);

        if (!$payout->guide?->payout_bkash_number) {
            return response()->json(['message' => 'The guide must add a payout bKash number before release.'], 422);
        }

        $result = $payoutService->release($payout, $data, $request->user('api'));
        if (!$result) {
            return response()->json(['message' => 'This payout has already been processed.'], 422);
        }

        return response()->json([
            'message' => 'Payout marked as paid.',
            'payout' => $result,
        ]);
    }

    public function updateCommission(Request $request): JsonResponse
    {
        $data = $request->validate([
            'slabs' => ['required', 'array', 'min:1'],
            'slabs.*.max_amount' => ['nullable', 'numeric', 'gt:0'],
            'slabs.*.rate' => ['required', 'numeric', 'between:0,100'],
        ]);
        $slabs = array_values($data['slabs']);
        foreach ($slabs as $index => $slab) {
            $isLast = $index === array_key_last($slabs);
            $limit = $slab['max_amount'] ?? null;
            if ($isLast && $limit !== null) {
                return response()->json(['message' => 'The final commission tier must have no upper limit.'], 422);
            }
            if (!$isLast && $limit === null) {
                return response()->json(['message' => 'Only the final commission tier can have no upper limit.'], 422);
            }
            if (!$isLast && isset($slabs[$index + 1]['max_amount']) && (float) $slabs[$index + 1]['max_amount'] <= (float) $limit) {
                return response()->json(['message' => 'Commission tier limits must increase from lowest to highest.'], 422);
            }
        }
        if (($slabs[array_key_last($slabs)]['max_amount'] ?? null) !== null) {
            return response()->json(['message' => 'Add a final tier with no upper limit.'], 422);
        }
        DB::transaction(function () use ($slabs) {
            DB::table('admin_settings')->updateOrInsert(
                ['setting_key' => 'commission_slabs'],
                ['setting_value' => json_encode($slabs), 'updated_at' => now(), 'created_at' => now()],
            );

            Payout::where('status', 'pending')->get()->each(function (Payout $payout) {
                $rate = $this->commissionRateFor((float) $payout->gross_amount);
                $commission = round((float) $payout->gross_amount * $rate / 100, 2);
                $payout->update([
                    'commission_rate' => $rate,
                    'commission_amount' => $commission,
                    'net_amount' => round((float) $payout->gross_amount - $commission, 2),
                ]);
            });
        });
        return response()->json(['message' => 'Commission tiers saved. Pending payouts have been recalculated.', 'commission_slabs' => $slabs]);
    }

    public function updatePayment(Request $request, Payment $payment): JsonResponse
    {
        $data = $request->validate(['status' => ['required', 'in:paid,rejected']]);
        return DB::transaction(function () use ($payment, $data, $request) {
            $payment = Payment::whereKey($payment->id)->lockForUpdate()->firstOrFail();
            if (!in_array($payment->status, ['pending', 'pending_review'], true)) {
                return response()->json(['message' => 'Only pending payments can be reviewed.'], 422);
            }
            if ($data['status'] === 'paid' && (!$payment->method || !$payment->account_number || !$payment->payment_date_time)) {
                return response()->json(['message' => 'Payment details are incomplete and cannot be approved.'], 422);
            }
            $payment->status = $data['status'];
            $payment->paid_at = $data['status'] === 'paid' ? ($payment->paid_at ?? now()) : null;
            $payment->save();
            $booking = $payment->booking;

            if ($data['status'] === 'paid') {
                $booking->update(['status' => 'confirmed']);
                $rate = $this->commissionRateFor((float) $payment->amount);
                Payout::updateOrCreate(['payment_id' => $payment->id], [
                    'guide_profile_id' => $booking->guide_profile_id,
                    'gross_amount' => $payment->amount,
                    'commission_rate' => $rate,
                    'commission_amount' => round($payment->amount * $rate / 100, 2),
                    'net_amount' => round($payment->amount * (100 - $rate) / 100, 2),
                    'status' => 'pending',
                ]);
            } else {
                $booking->update(['status' => 'pending_payment']);
                Payout::where('payment_id', $payment->id)->delete();
            }

            return response()->json(['message' => 'Payment status updated.', 'payment' => $payment->load('booking', 'payout')]);
        });
    }

    public function bookings(): JsonResponse
    {
        return response()->json(Booking::with(['tourist.user', 'guide.user', 'payment', 'review'])->latest()->paginate(25));
    }

    public function people(string $role): JsonResponse
    {
        abort_unless(in_array($role, ['tourist', 'guide'], true), 404);
        return response()->json(User::where('role', $role)->with($role === 'guide' ? 'guideProfile' : 'touristProfile')->latest()->paginate(25));
    }

    public function reviews(): JsonResponse
    {
        return response()->json(Review::with(['tourist.user', 'guide.user', 'booking.experience'])
            ->latest('submitted_at')->paginate(25));
    }

    public function updateReview(Request $request, Review $review): JsonResponse
    {
        $data = $request->validate(['status' => ['required', 'in:approved,rejected']]);
        $review->update([
            'status' => $data['status'],
            'moderated_by_user_id' => $request->user('api')->id,
            'moderated_at' => now(),
        ]);
        return response()->json(['message' => 'Review moderation saved.', 'review' => $review]);
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user('api')->only(['id', 'name', 'phone', 'role'])]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $admin = $request->user('api');
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'min:10', 'max:20', 'unique:users,phone,' . $admin->id],
        ]);
        $admin->update(['name' => trim($data['name']), 'phone' => trim($data['phone'])]);
        return response()->json(['message' => 'Profile updated.', 'user' => $admin->only(['id', 'name', 'phone', 'role'])]);
    }

    public function createAdmin(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'min:10', 'max:20', 'unique:users,phone'],
        ]);
        $admin = User::create(['name' => trim($data['name']), 'phone' => trim($data['phone']), 'role' => 'admin']);
        return response()->json(['message' => 'Admin account created.', 'user' => $admin->only(['id', 'name', 'phone', 'role'])], 201);
    }

    private function commissionSlabs(): array
    {
        $value = DB::table('admin_settings')->where('setting_key', 'commission_slabs')->value('setting_value');
        if ($value) {
            $slabs = json_decode($value, true);
            if (is_array($slabs) && count($slabs) > 0) {
                return $slabs;
            }
        }

        return [
            ['max_amount' => 5000, 'rate' => 12],
            ['max_amount' => 20000, 'rate' => 10],
            ['max_amount' => null, 'rate' => 8],
        ];
    }

    private function commissionRateFor(float $amount): float
    {
        foreach ($this->commissionSlabs() as $slab) {
            if ($slab['max_amount'] === null || $amount <= (float) $slab['max_amount']) {
                return (float) $slab['rate'];
            }
        }

        return 8.0;
    }
}
