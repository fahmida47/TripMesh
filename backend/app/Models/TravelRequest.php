<?php

namespace App\Models;

use App\Models\Guide\GuideExperience;
use App\Models\Guide\GuideProfile;
use App\Models\Guide\TourService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TravelRequest extends Model
{

    protected $appends = ['request_type'];

    public function getRequestTypeAttribute(): string
    {
        return 'travel';
    }

    protected $fillable = [

        'tourist_profile_id',

        'guide_profile_id',

        'guide_experience_id',

        'tour_service_id',

        'experience_name',

        'destination',

        'travelers',

        'from_date',

        'to_date',

        'travel_date',

        'amount',

        'request_details',

        'status',

    ];


    protected $casts = [

        'from_date' => 'date',

        'to_date' => 'date',

        'amount' => 'float',

        'travelers' => 'integer',

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

    public function tourService(): BelongsTo
    {
        return $this->belongsTo(TourService::class, 'tour_service_id');
    }



    public function booking(): HasOne
    {

        return $this->hasOne(

            Booking::class,

            'travel_request_id'

        );

    }

}
