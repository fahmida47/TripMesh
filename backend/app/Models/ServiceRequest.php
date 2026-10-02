<?php

namespace App\Models;

use App\Models\Guide\GuideProfile;
use App\Models\Guide\TourService;
use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    protected $fillable = [
        'tourist_profile_id', 'guide_profile_id', 'tour_service_id',
        'experience_name', 'destination', 'travelers', 'amount', 'status',
    ];

    protected $casts = ['travelers' => 'integer', 'amount' => 'float'];

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
}
