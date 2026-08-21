<?php

namespace App\Models\Guide;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuideExperience extends Model
{
    use HasFactory;

    protected $table = 'guide_experiences';

    protected $fillable = [
        'guide_profile_id',
        'title',
        'description',
        'photo',
    ];

    public function guideProfile()
    {
        return $this->belongsTo(
            GuideProfile::class,
            'guide_profile_id'
        );
    }
}