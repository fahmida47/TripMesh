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


    protected $appends = [
        'photo_url',
    ];



    public function guideProfile(): BelongsTo
    {
        return $this->belongsTo(
            GuideProfile::class,
            'guide_profile_id'
        );
    }



    public function getPhotoUrlAttribute()
    {
        if (!$this->photo) {
            return null;
        }


        return asset(
            'storage/' . $this->photo
        );
    }
}