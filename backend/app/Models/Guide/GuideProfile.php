<?php

namespace App\Models\Guide;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GuideProfile extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'contact_person',
        'bio',
        'phone',
        'email',
        'address',
        'profile_picture',
        'cover_photo',
        'price',
        'rating',
        'reviews',
        'popularity',
        'tour_types',
    ];

    protected $casts = [
        'price' => 'float',
        'rating' => 'float',
        'reviews' => 'integer',
        'popularity' => 'integer',
        'tour_types' => 'array',
    ];

    public function experiences(): HasMany
    {
        return $this->hasMany(
            GuideExperience::class,
            'guide_profile_id'
        );
    }
}