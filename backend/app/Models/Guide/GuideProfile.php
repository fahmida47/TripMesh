<?php

namespace App\Models\Guide;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'min_price',
        'max_price',
        'rating',
        'reviews',
        'popularity',
        'tour_types',
    ];


    protected $casts = [
        'tour_types' => 'array',
        'price' => 'float',
        'min_price' => 'float',
        'max_price' => 'float',
        'rating' => 'float',
        'reviews' => 'integer',
        'popularity' => 'integer',
    ];


    protected $appends = [
        'profile_picture_url',
        'cover_photo_url',
    ];



    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }



    public function experiences(): HasMany
    {
        return $this->hasMany(
            GuideExperience::class,
            'guide_profile_id'
        );
    }



    public function getProfilePictureUrlAttribute()
    {
        if (!$this->profile_picture) {
            return null;
        }

        return asset(
            'storage/' . $this->profile_picture
        );
    }



    public function getCoverPhotoUrlAttribute()
    {
        if (!$this->cover_photo) {
            return null;
        }

        return asset(
            'storage/' . $this->cover_photo
        );
    }
}