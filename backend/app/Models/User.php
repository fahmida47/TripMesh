<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    protected $fillable = [
        'name',
        'phone',
        'role',
    ];

    protected $hidden = [
        'remember_token',
    ];

    public function touristProfile()
    {
        return $this->hasOne(TouristProfile::class);
    }
    public function guideProfile()
{
    return $this->hasOne(
        \App\Models\Guide\GuideProfile::class,
        'user_id'
    );
}

    /**
     * JWT identifier.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * JWT custom claims.
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
        ];
    }
}
