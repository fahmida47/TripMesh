<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\ReviewService;



class ReviewController extends Controller
{


    protected $reviewService;



    public function __construct(
        ReviewService $reviewService
    )
    {

        $this->reviewService =
            $reviewService;

    }





    public function eligible(
        Request $request
    ): JsonResponse
    {


        $touristProfile =
            $this->touristProfile();



        if($touristProfile instanceof JsonResponse){

            return $touristProfile;

        }




        $bookings =
            $this->reviewService
            ->getEligibleBookings(
                $touristProfile
            );




        return response()->json([

            'message'=>
            'Eligible bookings retrieved successfully.',


            'bookings'=>
            $bookings

        ]);

    }







    public function store(
        Request $request
    ): JsonResponse
    {


        $validated =
        $request->validate([


            'booking_id'=>[
                'required',
                'integer',
                'exists:bookings,id'
            ],


            'rating'=>[
                'required',
                'integer',
                'between:1,5'
            ],


            'review'=>[
                'required',
                'string',
                'min:3',
                'max:2000'
            ]


        ]);




        $touristProfile =
            $this->touristProfile();




        if($touristProfile instanceof JsonResponse){

            return $touristProfile;

        }




        $review =
            $this->reviewService
            ->createReview(
                $touristProfile,
                $validated
            );




        if($review === null){

            return response()->json([

                'message'=>
                'Booking not found.'

            ],404);

        }





        if($review === false){

            return response()->json([

                'message'=>
                'Reviews can only be submitted for completed, paid bookings.'

            ],422);

        }





        if($review === "duplicate"){

            return response()->json([

                'message'=>
                'A review has already been submitted for this booking.'

            ],409);

        }





        $review->load([

            'booking.experience',
            'guide.user'

        ]);





        return response()->json([

            'message'=>
            'Review submitted successfully.',

            'review'=>
            $review

        ],201);


    }







    public function index(
        Request $request
    ): JsonResponse
    {


        $touristProfile =
            $this->touristProfile();



        if($touristProfile instanceof JsonResponse){

            return $touristProfile;

        }




        $reviews =
            $this->reviewService
            ->getReviews(
                $touristProfile
            );




        return response()->json([

            'message'=>
            'Reviews retrieved successfully.',

            'reviews'=>
            $reviews

        ]);

    }






    private function touristProfile()
    {

        $user =
            auth('api')->user();



        if(!$user){

            return response()->json([

                'message'=>
                'Unauthenticated.'

            ],401);

        }




        if($user->role !== 'tourist'){


            return response()->json([

                'message'=>
                'Only tourists can manage reviews.'

            ],403);


        }




        if(!$user->touristProfile){


            return response()->json([

                'message'=>
                'Tourist profile not found.'

            ],404);


        }




        return $user->touristProfile;

    }


}