<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Canbo extends Authenticatable implements JWTSubject
{
    use HasFactory;
    protected $table = 'tb_canbots';
    public $timestamps = false;
    protected $hidden = [
        'Password'
    ];
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function canBoTsHoSo()
    {
        return $this->hasMany(CanBoTSHoSo::class, 'id');
    }
}
