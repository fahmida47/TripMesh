<?php

namespace App\Http\Controllers;

use App\Services\PayoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class PayoutController extends Controller
{

    protected $payoutService;


    public function __construct(
        PayoutService $payoutService
    )
    {
        $this->payoutService = $payoutService;
    }



    /**
     * Admin view all payouts
     */
    public function adminIndex(Request $request): JsonResponse
    {

        $user = $request->user('api');


        if(!$user || $user->role !== 'admin'){

            return response()->json([

                'message'=>'Only admins can view payouts.'

            ],403);

        }



        $payouts =
            $this->payoutService
            ->getAdminPayouts();



        return response()->json([

            'payouts'=>$payouts

        ]);

    }





    /**
     * Admin release payout
     */
    public function release(
        Request $request,
        $payout
    ): JsonResponse
    {


        $admin = $request->user('api');


        if(!$admin || $admin->role !== 'admin'){

            return response()->json([

                'message'=>'Only admins can release payouts.'

            ],403);

        }



        $validated =
        $request->validate([

            'payout_reference'=>[
                'nullable',
                'string',
                'max:100',
                'unique:payouts,payout_reference'
            ]

        ]);



        $result =
            $this->payoutService
            ->release(
                $payout,
                $validated,
                $admin
            );



        if(!$result){

            return response()->json([

                'message'=>
                'This payout has already been processed.'

            ],422);

        }




        return response()->json([

            'message'=>
            'Guide payout released successfully.',


            'payout'=>$result

        ]);

    }





    /**
     * Guide view own payouts
     */
    public function guideIndex(Request $request): JsonResponse
    {

        $user =
            $request->user('api');



        if(!$user || $user->role !== 'guide'){

            return response()->json([

                'message'=>
                'Only guides can view their payouts.'

            ],403);

        }



        if(!$user->guideProfile){

            return response()->json([

                'message'=>
                'Guide profile not found.'

            ],404);

        }



        $payouts =
            $this->payoutService
            ->getGuidePayouts(
                $user->guideProfile
            );



        return response()->json([

            'payouts'=>$payouts

        ]);
    }
}