<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\PaymentService;


class PaymentController extends Controller
{


    protected $paymentService;



    public function __construct(
        PaymentService $paymentService
    )
    {

        $this->paymentService =
            $paymentService;

    }



    public function initiate(Request $request): JsonResponse
    {

        $validated =
        $request->validate([

            'booking_id'=>[
                'required',
                'integer',
                'exists:bookings,id'
            ]

        ]);



        $user = auth('api')->user();


        if(!$user || $user->role !== 'tourist'){

            return response()->json([
                'message'=>'Only tourists can pay.'
            ],403);

        }



        $booking =
        $this->paymentService
        ->findTouristBooking(
            $validated['booking_id'],
            $user->touristProfile
        );



        if(!$booking){

            return response()->json([
                'message'=>'Booking not found.'
            ],404);

        }



        $payment =
        $this->paymentService
        ->initiatePayment(
            $booking
        );



        return response()->json([

            'message'=>'Payment initiated successfully.',

            'payment'=>$payment,

            'booking'=>$booking

        ]);

    }







    public function complete(Request $request): JsonResponse
    {


        $validated =
        $request->validate([

            'booking_id'=>[
                'required',
                'exists:bookings,id'
            ],

            'method'=>[
                'required',
                'in:bkash,nagad'
            ],

            'account_number'=>[
                'required'
            ],

            'payment_date_time'=>[
                'required',
                'date'
            ],

            'transaction_reference'=>[
                'nullable'
            ]

        ]);



        $user=auth('api')->user();



        $result =
        $this->paymentService
        ->completePayment(
            $validated,
            $user->touristProfile
        );



        if(isset($result['error'])){

            return response()->json([

                'message'=>$result['error']

            ],$result['status']);

        }




        return response()->json([

            'message'=>
            'Payment completed successfully.',

            'payment'=>$result['payment'],

            'booking'=>$result['booking']

        ]);

    }
}