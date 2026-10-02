<?php

namespace App\Models\Guide;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourService extends Model
{
    protected $fillable = [
        'guide_profile_id', 'title', 'description', 'location', 'tour_type',
        'price', 'duration', 'max_travelers', 'image',
    ];

    protected $casts = [
        'price' => 'float',
        'max_travelers' => 'integer',
    ];

    public function guideProfile(): BelongsTo
    {
        return $this->belongsTo(GuideProfile::class);
    }
}
