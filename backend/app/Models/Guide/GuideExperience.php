<?php

namespace App\Models\Guide;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuideExperience extends Model
{
    protected $fillable = [
        'guide_profile_id',
        'title',
        'description',
        'photo',
    ];

    public function guideProfile(): BelongsTo
    {
        return $this->belongsTo(
            GuideProfile::class,
            'guide_profile_id'
        );
    }
}