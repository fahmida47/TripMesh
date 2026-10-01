<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


class PaymentService
{

    public function findTouristBooking(
        int $bookingId,
        $touristProfile
    )
    {

        return Booking::where(
            'id',
            $bookingId
        )
        ->where(
            'tourist_profile_id',
            $touristProfile->id
        )
        ->first();

    }





    public function initiatePayment(
        $booking
    )
    {

        if($booking->status !== 'pending_payment'){

            return false;

        }


        $payment = Payment::where(
            'booking_id',
            $booking->id
        )->first();



        $payment ??= Payment::create([

            'booking_id'=>$booking->id,

            'amount'=>$booking->amount,

            'status'=>'pending'

        ]);



        return $payment;

    }





    public function completePayment(
        $validated,
        $touristProfile
    )
    {


        return DB::transaction(function() use(
            $validated,
            $touristProfile
        ){


            $booking = Booking::where(
                'id',
                $validated['booking_id']
            )
            ->where(
                'tourist_profile_id',
                $touristProfile->id
            )
            ->lockForUpdate()
            ->first();



            if(!$booking){

                return [
                    'error'=>'Booking not found.',
                    'status'=>404
                ];

            }




            $payment = Payment::where(
                'booking_id',
                $booking->id
            )
            ->lockForUpdate()
            ->first();




            if(
                $payment?->status === 'paid'
                || $payment?->status === 'pending_review'
                ||
                $booking->status === 'confirmed'
            ){

                return [
                    'error'=>'Payment already completed.',
                    'status'=>422
                ];

            }




            if($booking->status !== 'pending_payment'){

                return [
                    'error'=>'This booking is not waiting for payment.',
                    'status'=>422
                ];

            }




            $payment ??= Payment::create([

                'booking_id'=>$booking->id,

                'amount'=>$booking->amount,

                'status'=>'pending'

            ]);





            $payment->update([

                'method'=>$validated['method'],

                'account_number'=>$validated['account_number'],

                'payment_date_time'=>$validated['payment_date_time'],

                'transaction_reference'=>
                    $validated['transaction_reference']
                    ??
                    'TRX-'.strtoupper(Str::random(12)),


                'status'=>'pending_review',

                'paid_at'=>null

            ]);





            $booking->load([
                'guide.user',
                'experience',
                'payment.payout',
                'travelRequest'
            ]);


            $payment->load('payout');



            return [

                'payment'=>$payment,

                'booking'=>$booking

            ];


        });


    }





    public function getPayment(
        $booking
    )
    {

        return Payment::where(
            'booking_id',
            $booking->id
        )->first();

    }
    
}
