<?php

namespace App\Models;

use App\Models\Guide\GuideExperience;
use App\Models\Guide\GuideProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    protected $fillable = [
        'travel_request_id',
        'tourist_profile_id',
        'guide_profile_id',
        'guide_experience_id',
        'travel_date',
        'amount',
        'status',
    ];

    protected $casts = [
        'travel_date' => 'date',
        'amount' => 'float',
    ];

    public function travelRequest(): BelongsTo
    {
        return $this->belongsTo(
            TravelRequest::class,
            'travel_request_id'
        );
    }

    public function tourist(): BelongsTo
    {
        return $this->belongsTo(
            TouristProfile::class,
            'tourist_profile_id'
        );
    }

    public function guide(): BelongsTo
    {
        return $this->belongsTo(
            GuideProfile::class,
            'guide_profile_id'
        );
    }

    public function experience(): BelongsTo
    {
        return $this->belongsTo(
            GuideExperience::class,
            'guide_experience_id'
        );
    }

    public function payment(): HasOne
    {
        return $this->hasOne(
            Payment::class,
            'booking_id'
        );
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }
}
