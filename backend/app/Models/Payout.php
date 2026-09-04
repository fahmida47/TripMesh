<?php

namespace App\Models;

use App\Models\Guide\GuideProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payout extends Model
{
    protected $fillable = [
        'payment_id',
        'guide_profile_id',
        'gross_amount',
        'commission_rate',
        'commission_amount',
        'net_amount',
        'status',
        'payout_reference',
        'processed_by_user_id',
        'paid_at',
    ];

    protected $casts = [
        'gross_amount' => 'float',
        'commission_rate' => 'float',
        'commission_amount' => 'float',
        'net_amount' => 'float',
        'paid_at' => 'datetime',
    ];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function guide(): BelongsTo
    {
        return $this->belongsTo(GuideProfile::class, 'guide_profile_id');
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by_user_id');
    }
}
