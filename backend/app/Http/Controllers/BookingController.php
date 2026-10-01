<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Services\BookingService;



class BookingController extends Controller
{


    protected $bookingService;



    public function __construct(
        BookingService $bookingService
    )
    {

        $this->bookingService =
            $bookingService;

    }




    /**
     * Get all bookings
     */
    public function index(Request $request)
    {


        $user = auth('api')->user();



        if(!$user){

            return response()->json([

                'message'=>'Unauthenticated.'

            ],401);

        }



        if($user->role !== 'tourist'){


            return response()->json([

                'message'=>
                'Only tourists can view bookings.'

            ],403);


        }



        $touristProfile =
            $user->touristProfile;



        if(!$touristProfile){


            return response()->json([

                'message'=>
                'Tourist profile not found.'

            ],404);


        }




        $bookings =
            $this->bookingService
            ->getTouristBookings(
                $touristProfile
            );




        return response()->json([

            'message'=>
            'Bookings retrieved successfully.',


            'bookings'=>
            $bookings


        ],200);


    }

    public function guideIndex(Request $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->role !== 'guide') {
            return response()->json(['message' => 'Only guides can view their bookings.'], 403);
        }

        if (!$user->guideProfile) {
            return response()->json(['message' => 'Guide profile not found.'], 404);
        }

        return response()->json([
            'message' => 'Guide bookings retrieved successfully.',
            'bookings' => $this->bookingService->getGuideBookings($user->guideProfile),
        ]);
    }

    public function completeGuideBooking(Request $request, $id)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->role !== 'guide') {
            return response()->json(['message' => 'Only guides can complete their bookings.'], 403);
        }

        if (!$user->guideProfile) {
            return response()->json(['message' => 'Guide profile not found.'], 404);
        }

        $booking = $this->bookingService->completeGuideBooking($user->guideProfile, $id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found or is not eligible for completion.'], 422);
        }

        return response()->json([
            'message' => 'Booking marked as completed.',
            'booking' => $booking,
        ]);
    }







    /**
     * Get single booking
     */
    public function show(
        Request $request,
        $id
    )
    {


        $user = auth('api')->user();



        if(!$user){


            return response()->json([

                'message'=>'Unauthenticated.'

            ],401);


        }





        if($user->role !== 'tourist'){


            return response()->json([

                'message'=>
                'Only tourists can view bookings.'

            ],403);


        }





        $touristProfile =
            $user->touristProfile;




        if(!$touristProfile){


            return response()->json([

                'message'=>
                'Tourist profile not found.'

            ],404);


        }





        $booking =
            $this->bookingService
            ->getTouristBooking(

                $touristProfile,

                $id

            );





        if(!$booking){


            return response()->json([

                'message'=>
                'Booking not found.'

            ],404);


        }





        return response()->json([


            'message'=>
            'Booking retrieved successfully.',



            'booking'=>
            $booking



        ],200);


    }
}