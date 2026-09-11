<?php

namespace App\Http\Controllers\Guide;


use App\Http\Controllers\Controller;

use App\Services\ReviewService;

use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;



class GuideReviewController extends Controller
{


    protected $reviewService;



    public function __construct(
        ReviewService $reviewService
    )
    {

        $this->reviewService = $reviewService;

    }





    /**
     * Return authenticated guide reviews
     */
    public function index(Request $request): JsonResponse
    {


        $user = auth('api')->user();



        if (!$user) {

            return response()->json([

                'message' =>
                'Unauthenticated.'

            ],401);

        }



        if ($user->role !== 'guide') {

            return response()->json([

                'message' =>
                'Only guides can view guide reviews.'

            ],403);

        }




        $guideProfile = $user->guideProfile;



        if (!$guideProfile) {

            return response()->json([

                'message' =>
                'Guide profile not found.'

            ],404);

        }




        $data = $this->reviewService

            ->getGuideReviews(
                $guideProfile
            );





        return response()->json([

            'message' =>
            'Guide reviews retrieved successfully.',


            ...$data

        ]);
    }
}