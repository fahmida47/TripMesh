<?php

namespace App\Models\Guide;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuideProfile extends Model
{
    use HasFactory;

    protected $table = 'guide_profiles';

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
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function experiences()
    {
        return $this->hasMany(
            GuideExperience::class,
            'guide_profile_id'
        );
    }
}