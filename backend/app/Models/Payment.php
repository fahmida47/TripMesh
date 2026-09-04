<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'booking_id',
        'method',
        'account_number',
        'payment_date_time',
        'amount',
        'status',
        'transaction_reference',
        'paid_at',
    ];

    protected $casts = [
        'payment_date_time' => 'datetime',
        'paid_at' => 'datetime',
        'amount' => 'float',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(
            Booking::class,
            'booking_id'
        );
    }
}