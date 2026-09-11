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

        'from_date',

        'to_date',

        'amount',

        'status',

    ];



    protected $casts = [

        'from_date' => 'date',

        'to_date' => 'date',

        'amount' => 'float',

    ];

    protected $appends = [
        'guide_company_name',
        'tour_type',
    ];

    public function getGuideCompanyNameAttribute(): ?string
    {
        return $this->guide?->company_name;
    }

    public function getTourTypeAttribute(): ?string
    {
        return $this->experience?->title
            ?: $this->travelRequest?->experience_name;
    }




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

        return $this->hasOne(

            Review::class

        );

    }

}