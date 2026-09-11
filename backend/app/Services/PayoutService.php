<?php

namespace App\Services;

use App\Models\Payout;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


class PayoutService
{


    public function getAdminPayouts()
    {

        return Payout::with([
            'payment.booking.experience',
            'guide.user',
            'processedBy'
        ])
        ->latest()
        ->get();

    }




    public function release(
        $payout,
        $validated,
        $admin
    )
    {


        return DB::transaction(function() use(
            $payout,
            $validated,
            $admin
        ){


            $locked =
            Payout::whereKey(
                $payout->id
            )
            ->lockForUpdate()
            ->firstOrFail();



            if($locked->status !== 'pending'){

                return false;

            }




            $locked->update([

                'status'=>'paid',

                'payout_reference'=>
                $validated['payout_reference']
                ??
                'PAYOUT-'.strtoupper(Str::random(12)),


                'processed_by_user_id'=>
                $admin->id,


                'paid_at'=>now()

            ]);



            return $locked->fresh([

                'payment.booking.experience',

                'guide.user',

                'processedBy'

            ]);

        });

    }




    public function getGuidePayouts($guideProfile)
    {

        return Payout::with([
            'payment.booking.experience'
        ])
        ->where(
            'guide_profile_id',
            $guideProfile->id
        )
        ->latest()
        ->get();

    }
}