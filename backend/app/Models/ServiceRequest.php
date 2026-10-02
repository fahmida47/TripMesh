<?php

namespace App\Models;

use App\Models\Guide\GuideProfile;
use App\Models\Guide\TourService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ServiceRequest extends Model
{
    protected $fillable = [
        'tourist_profile_id', 'guide_profile_id', 'tour_service_id',
        'experience_name', 'destination', 'travelers', 'from_date', 'to_date',
        'amount', 'status',
    ];

    protected $casts = [
        'travelers' => 'integer',
        'from_date' => 'date',
        'to_date' => 'date',
        'amount' => 'float',
    ];

    protected $appends = ['request_type'];

    public function getRequestTypeAttribute(): string
    {
        return 'service';
    }

    public function tourist()
    {
        return $this->belongsTo(TouristProfile::class, 'tourist_profile_id');
    }

    public function guide()
    {
        return $this->belongsTo(GuideProfile::class, 'guide_profile_id');
    }

    public function tourService()
    {
        return $this->belongsTo(TourService::class, 'tour_service_id');
    }

    public function booking(): HasOne
    {
        return $this->hasOne(Booking::class, 'service_request_id');
    }
}
