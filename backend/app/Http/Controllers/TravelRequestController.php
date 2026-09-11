<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Services\TravelRequestService;
use App\Models\TravelRequest;


class TravelRequestController extends Controller
{

    protected $travelRequestService;


    public function __construct(
        TravelRequestService $travelRequestService
    ){
        $this->travelRequestService = $travelRequestService;
    }



    /**
     * Create travel request
     */
    public function store(Request $request): JsonResponse
    {

        $user = auth('api')->user();


        if(!$user || $user->role !== 'tourist'){

            return response()->json([
                'message'=>'Only tourists can send travel requests.'
            ],403);

        }



        $validated = $request->validate([


            'guide_profile_id'=>[
                'required',
                'integer',
                'exists:guide_profiles,id'
            ],


            'guide_experience_id'=>[
                'nullable',
                'integer',
                'exists:guide_experiences,id'
            ],

            'experience_name'=>[
                'nullable',
                'string',
                'max:255'
            ],


            'destination'=>[
                'required',
                'string'
            ],


            'travelers'=>[
                'required',
                'integer',
                'min:1'
            ],



            'from_date'=>[
                'required',
                'date',
                'after_or_equal:today'
            ],



            'to_date'=>[
                'required',
                'date',
                'after_or_equal:from_date'
            ],



            'amount'=>[
                'required',
                'numeric',
                'min:0'
            ],



            'request_details'=>[
                'nullable',
                'string'
            ]


        ]);

        $guideProfile = \App\Models\Guide\GuideProfile::find($validated['guide_profile_id']);
        $minimumAmount = $guideProfile->min_price ?? $guideProfile->price ?? 0;
        $maximumAmount = $guideProfile->max_price ?? $minimumAmount;

        if ($validated['amount'] < $minimumAmount || $validated['amount'] > $maximumAmount) {
            return response()->json([
                'message' => 'Amount must be within the guide price range.',
                'errors' => [
                    'amount' => [
                        'Choose an amount between '.$minimumAmount.' and '.$maximumAmount.'.',
                    ],
                ],
            ], 422);
        }





        $travelRequest =
            $this->travelRequestService
            ->createRequest(
                $user,
                $validated
            );





        if(!$travelRequest){

            return response()->json([
                'message'=>'Failed to create request.'
            ],422);

        }






        $travelRequest->load([

            'tourist',
            'guide',
            'experience'

        ]);





        return response()->json([

            'message'=>
            'Travel request sent successfully.',


            'request'=>
            $travelRequest

        ],201);

    }






    /**
     * Guide requests
     */
    public function guideRequests(): JsonResponse
    {

        $user = auth('api')->user();



        if(!$user || $user->role !== 'guide'){

            return response()->json([

                'message'=>'Only guides can view requests.'

            ],403);

        }




        $guideProfile =
            $user->guideProfile;




        if(!$guideProfile){

            return response()->json([

                'message'=>'Guide profile not found.'

            ],404);

        }





        $requests =
            $this->travelRequestService
            ->getGuideRequests(
                $guideProfile
            );




        return response()->json([

            'message'=>
            'Guide requests fetched successfully.',


            'requests'=>
            $requests

        ]);

    }








    /**
     * Accept request
     */
    public function accept($id): JsonResponse
    {

        $user = auth('api')->user();



        if(!$user || $user->role !== 'guide'){

            return response()->json([

                'message'=>'Only guides can accept requests.'

            ],403);

        }





        $guideProfile =
            $user->guideProfile;




        $travelRequest =
            TravelRequest::where('id',$id)

            ->where(
                'guide_profile_id',
                $guideProfile->id
            )

            ->first();





        if(!$travelRequest){

            return response()->json([

                'message'=>'Travel request not found.'

            ],404);

        }





        $result =
            $this->travelRequestService
            ->acceptRequest(

                $travelRequest,

                $guideProfile

            );





        return response()->json([


            'message'=>
            'Request accepted successfully.',



            'booking'=>
            $result['booking'],



            'payment'=>
            $result['payment']


        ]);

    }







    /**
     * Reject request
     */
    public function reject($id): JsonResponse
    {

        $travelRequest =
            TravelRequest::find($id);




        if(!$travelRequest){

            return response()->json([

                'message'=>'Request not found.'

            ],404);

        }




        $this->travelRequestService

        ->updateStatus(

            $travelRequest,

            'rejected'

        );





        return response()->json([

            'message'=>
            'Request rejected successfully.'

        ]);

    }







    /**
     * Cancel request
     */
    public function cancel($id): JsonResponse
    {

        $travelRequest =
            TravelRequest::find($id);




        if(!$travelRequest){

            return response()->json([

                'message'=>'Request not found.'

            ],404);

        }




        $this->travelRequestService

        ->updateStatus(

            $travelRequest,

            'cancelled'

        );





        return response()->json([

            'message'=>
            'Request cancelled successfully.'

        ]);

    }


}