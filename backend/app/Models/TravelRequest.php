<?php

namespace App\Models;

use App\Models\Guide\GuideExperience;
use App\Models\Guide\GuideProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TravelRequest extends Model
{
    protected $fillable = [
        'tourist_profile_id',
        'guide_profile_id',
        'guide_experience_id',
        'travel_date',
        'amount',
        'request_details',
        'status',
    ];

    protected $casts = [
        'travel_date' => 'date',
        'amount' => 'float',
    ];

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
}