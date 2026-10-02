<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $requests = DB::table('service_requests')
            ->leftJoin('bookings', 'bookings.service_request_id', '=', 'service_requests.id')
            ->join('tourist_profiles', 'tourist_profiles.id', '=', 'service_requests.tourist_profile_id')
            ->join('guide_profiles', 'guide_profiles.id', '=', 'service_requests.guide_profile_id')
            ->join('users as guide_users', 'guide_users.id', '=', 'guide_profiles.user_id')
            ->where('service_requests.status', 'accepted')
            ->whereNull('bookings.id')
            ->select([
                'service_requests.id',
                'service_requests.tourist_profile_id',
                'service_requests.guide_profile_id',
                'service_requests.experience_name',
                'service_requests.amount',
                'tourist_profiles.user_id as tourist_user_id',
                'guide_users.name as guide_name',
            ])
            ->orderBy('service_requests.id')
            ->get();

        foreach ($requests as $request) {
            DB::transaction(function () use ($request) {
                $now = now();
                $bookingId = DB::table('bookings')->insertGetId([
                    'travel_request_id' => null,
                    'service_request_id' => $request->id,
                    'tourist_profile_id' => $request->tourist_profile_id,
                    'guide_profile_id' => $request->guide_profile_id,
                    'guide_experience_id' => null,
                    'from_date' => null,
                    'to_date' => null,
                    'amount' => $request->amount,
                    'status' => 'pending_payment',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                DB::table('payments')->insert([
                    'booking_id' => $bookingId,
                    'amount' => $request->amount,
                    'status' => 'pending',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                DB::table('user_notifications')->insert([
                    'user_id' => $request->tourist_user_id,
                    'type' => 'message',
                    'title' => 'Tour package request accepted',
                    'message' => 'Guide '.$request->guide_name.' accepted your request for '.$request->experience_name.'.',
                    'action_url' => '/tourist-dashboard/bookings',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            });
        }
    }

    public function down(): void
    {
    }
};
