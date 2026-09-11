<?php

namespace App\Services;

use App\Models\TravelRequest;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Guide\GuideProfile;
use App\Models\Guide\GuideExperience;
use Illuminate\Support\Facades\DB;

class TravelRequestService
{

    /**
     * Create travel request
     */
    public function createRequest($user, $validated)
    {
        $touristProfile = $user->touristProfile;

        if (!$touristProfile) {
            return null;
        }


        $guideProfile = GuideProfile::find(
            $validated['guide_profile_id']
        );


        if (!$guideProfile) {
            return false;
        }


        // Check experience belongs to guide
        if (!empty($validated['guide_experience_id'])) {

            $experience = GuideExperience::where(
                'id',
                $validated['guide_experience_id']
            )
            ->where(
                'guide_profile_id',
                $guideProfile->id
            )
            ->first();


            if (!$experience) {
                return false;
            }
        }



        return TravelRequest::create([

            'tourist_profile_id' =>
                $touristProfile->id,

            'guide_profile_id' =>
                $guideProfile->id,

            'guide_experience_id' =>
                $validated['guide_experience_id'] ?? null,

            'experience_name' =>
                $validated['experience_name'] ?? null,


            'destination' =>
                $validated['destination'],


            'travelers' =>
                $validated['travelers'],


            'from_date' =>
                $validated['from_date'],


            'to_date' =>
                $validated['to_date'],


            'amount' =>
                $validated['amount'],


            'request_details' =>
                $validated['request_details'] ?? null,


            'status' =>
                'pending'

        ]);
    }



    /**
     * Get guide requests
     */
    public function getGuideRequests($guideProfile)
    {

        return TravelRequest::with([
            'tourist',
            'guide',
            'experience'
        ])

        ->where(
            'guide_profile_id',
            $guideProfile->id
        )

        ->latest()

        ->get();

    }




    /**
     * Accept request
     * Create booking + payment
     */
    public function acceptRequest(
        $travelRequest,
        $guideProfile
    ){

        return DB::transaction(function () use (
            $travelRequest,
            $guideProfile
        ){


            $travelRequest->update([

                'status' => 'accepted'

            ]);



            $booking = Booking::create([


                'travel_request_id' =>
                    $travelRequest->id,


                'tourist_profile_id' =>
                    $travelRequest->tourist_profile_id,


                'guide_profile_id' =>
                    $guideProfile->id,


                'guide_experience_id' =>
                    $travelRequest->guide_experience_id,


                'from_date' =>
                    $travelRequest->from_date,


                'to_date' =>
                    $travelRequest->to_date,


                'amount' =>
                    $travelRequest->amount,


                'status' =>
                    'pending_payment'

            ]);




            $payment = Payment::create([


                'booking_id' =>
                    $booking->id,


                'amount' =>
                    $booking->amount,


                'status' =>
                    'pending'

            ]);




            return [

                'booking' => $booking,

                'payment' => $payment

            ];

        });

    }





    /**
     * Update status
     */
    public function updateStatus(
        $travelRequest,
        $status
    ){

        $travelRequest->update([

            'status' => $status

        ]);


        return $travelRequest;

    }

}