<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Services\TravelRequestService;
use App\Models\TravelRequest;
use App\Models\ServiceRequest;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Guide\TourService;
use Illuminate\Support\Facades\DB;


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
                'errors' => ['amount' => ['Choose an amount between '.$minimumAmount.' and '.$maximumAmount.'.']],
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

        $guideProfile->user->notifications()->create([
            'type' => 'booking',
            'title' => 'New travel request',
            'message' => $user->name.' sent a travel request for '.$validated['destination'].'.',
            'action_url' => '/guide-dashboard/requests',
        ]);

        $user->notifications()->create([
            'type' => 'booking',
            'title' => 'Travel request sent',
            'message' => 'Your travel request for '.$validated['destination'].' was sent to '.$guideProfile->company_name.'.',
            'action_url' => '/tourist-dashboard/bookings',
        ]);






        $travelRequest->load(['tourist', 'guide', 'tourService']);
        if ($travelRequest instanceof TravelRequest) {
            $travelRequest->load('experience');
        }





        return response()->json([

            'message'=>
            'Travel request sent successfully.',


            'request'=>
            $travelRequest

        ],201);

    }

    /** Store a service request independently from a dated travel request. */
    public function storeService(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        if (!$user || $user->role !== 'tourist') {
            return response()->json(['message' => 'Only tourists can send service requests.'], 403);
        }

        $validated = $request->validate([
            'guide_profile_id' => ['required', 'integer', 'exists:guide_profiles,id'],
            'tour_service_id' => ['required', 'integer', 'exists:tour_services,id'],
            'travelers' => ['required', 'integer', 'min:1'],
            'from_date' => ['required', 'date', 'after_or_equal:today'],
            'to_date' => ['required', 'date', 'after_or_equal:from_date'],
        ]);

        $service = TourService::where('id', $validated['tour_service_id'])
            ->where('guide_profile_id', $validated['guide_profile_id'])->first();
        if (!$service) return response()->json(['message' => 'Selected service does not belong to this guide.'], 422);
        if ($validated['travelers'] > $service->max_travelers) {
            return response()->json(['message' => 'Traveler count exceeds this service limit.'], 422);
        }

        $touristProfile = $user->touristProfile;
        if (!$touristProfile) return response()->json(['message' => 'Tourist profile not found.'], 404);

        $serviceRequest = ServiceRequest::create([
            'tourist_profile_id' => $touristProfile->id,
            'guide_profile_id' => $service->guide_profile_id,
            'tour_service_id' => $service->id,
            'experience_name' => $service->title,
            'destination' => $service->location,
            'travelers' => $validated['travelers'],
            'from_date' => $validated['from_date'],
            'to_date' => $validated['to_date'],
            'amount' => $service->price,
            'status' => 'pending',
        ])->load(['tourist', 'guide', 'tourService']);

        $service->guideProfile->user->notifications()->create([
            'type' => 'booking',
            'title' => 'New tour package request',
            'message' => $user->name.' requested '.$service->title.' for '.$validated['travelers'].' traveler(s).',
            'action_url' => '/guide-dashboard/requests',
        ]);

        $user->notifications()->create([
            'type' => 'booking',
            'title' => 'Tour package request sent',
            'message' => 'Your request for '.$service->title.' was sent to '.$service->guideProfile->company_name.'.',
            'action_url' => '/tourist-dashboard/bookings',
        ]);

        return response()->json(['message' => 'Service request sent successfully.', 'request' => $serviceRequest], 201);
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




        if (request()->query('type') === 'service') {
            if (!$guideProfile) {
                return response()->json(['message' => 'Guide profile not found.'], 404);
            }

            $result = DB::transaction(function () use ($id, $guideProfile) {
                $serviceRequest = ServiceRequest::where('id', $id)
                    ->where('guide_profile_id', $guideProfile->id)
                    ->lockForUpdate()
                    ->first();

                if (!$serviceRequest) {
                    return null;
                }

                if ($serviceRequest->status !== 'pending') {
                    return false;
                }

                $serviceRequest->update(['status' => 'accepted']);

                $booking = Booking::create([
                    'travel_request_id' => null,
                    'service_request_id' => $serviceRequest->id,
                    'tourist_profile_id' => $serviceRequest->tourist_profile_id,
                    'guide_profile_id' => $serviceRequest->guide_profile_id,
                    'guide_experience_id' => null,
                    'from_date' => $serviceRequest->from_date,
                    'to_date' => $serviceRequest->to_date,
                    'amount' => $serviceRequest->amount,
                    'status' => 'pending_payment',
                ]);

                $payment = Payment::create([
                    'booking_id' => $booking->id,
                    'amount' => $booking->amount,
                    'status' => 'pending',
                ]);

                return compact('serviceRequest', 'booking', 'payment');
            });

            if ($result === null) {
                return response()->json(['message' => 'Service request not found.'], 404);
            }

            if ($result === false) {
                return response()->json(['message' => 'This request has already been handled.'], 422);
            }

            $result['serviceRequest']->tourist->user->notifications()->create([
                'type' => 'message',
                'title' => 'Tour package request accepted',
                'message' => 'Guide '.$user->name.' accepted your request for '.$result['serviceRequest']->experience_name.'.',
                'action_url' => '/tourist-dashboard/bookings',
            ]);

            $result['booking']->load([
                'guide',
                'experience',
                'payment',
                'serviceRequest.tourService',
            ]);

            return response()->json([
                'message' => 'Service request accepted.',
                'request' => $result['serviceRequest'],
                'booking' => $result['booking'],
                'payment' => $result['payment'],
            ]);
        }

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

        if ($travelRequest->status !== 'pending') {
            return response()->json(['message' => 'This request has already been handled.'], 422);
        }





        $result =
            $this->travelRequestService
            ->acceptRequest(

                $travelRequest,

                $guideProfile

            );

        $travelRequest->tourist->user->notifications()->create([
            'type' => 'message',
            'title' => 'Request accepted',
            'message' => 'Guide '.$user->name.' accepted your travel request.',
            'action_url' => '/tourist-dashboard/bookings',
        ]);





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
        $user = auth('api')->user();
        $guideProfile = $user?->guideProfile;
        if (request()->query('type') === 'service') {
            $serviceRequest = ServiceRequest::where('id', $id)
                ->where('guide_profile_id', $guideProfile?->id)->first();
            if (!$serviceRequest) return response()->json(['message' => 'Service request not found.'], 404);
            $serviceRequest->update(['status' => 'rejected']);
            return response()->json(['message' => 'Service request rejected successfully.']);
        }

        $user = auth('api')->user();

        if (!$user || $user->role !== 'guide') {
            return response()->json(['message' => 'Only guides can reject requests.'], 403);
        }

        $guideProfile = $user->guideProfile;
        if (!$guideProfile) {
            return response()->json(['message' => 'Guide profile not found.'], 404);
        }

        $travelRequest =
            TravelRequest::where('id', $id)
                ->where('guide_profile_id', $guideProfile->id)
                ->first();




        if(!$travelRequest){

            return response()->json([

                'message'=>'Request not found.'

            ],404);

        }

        if ($travelRequest->status !== 'pending') {
            return response()->json(['message' => 'This request has already been handled.'], 422);
        }




        $this->travelRequestService

        ->updateStatus(

            $travelRequest,

            'rejected'

        );

        $travelRequest->tourist->user->notifications()->create([
            'type' => 'message',
            'title' => 'Request declined',
            'message' => 'Guide '.$user->name.' declined your travel request.',
            'action_url' => '/tourist-dashboard/bookings',
        ]);





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
        if (request()->query('type') === 'service') {
            $user = auth('api')->user();
            $serviceRequest = ServiceRequest::where('id', $id)
                ->where('guide_profile_id', $user?->guideProfile?->id)->first();
            if (!$serviceRequest) return response()->json(['message' => 'Service request not found.'], 404);
            $serviceRequest->update(['status' => 'cancelled']);
            return response()->json(['message' => 'Service request cancelled successfully.']);
        }

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
