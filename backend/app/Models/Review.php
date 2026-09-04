<?php

namespace App\Models;

use App\Models\Guide\GuideProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'booking_id',
        'tourist_profile_id',
        'guide_profile_id',
        'rating',
        'review',
        'submitted_at',
    ];

    protected $casts = [
        'rating' => 'integer',
        'submitted_at' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function tourist(): BelongsTo
    {
        return $this->belongsTo(TouristProfile::class, 'tourist_profile_id');
    }

    public function guide(): BelongsTo
    {
        return $this->belongsTo(GuideProfile::class, 'guide_profile_id');
    }
}
