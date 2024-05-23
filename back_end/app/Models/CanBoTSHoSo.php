<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CanBoTSHoSo extends Model
{
    use HasFactory;
    public $timestamps = false;


    protected $table = 'tb_canbots_hoso';

    protected $fillable = ['HoSo_ID', 'NgayXet', 'CanBoTS_ID', 'GhiChu'];

    public function hoSoTsCanBo()
    {
        return $this->belongsTo(HoSo::class, 'HoSo_ID');
    }
    public function canBoTsHoSo()
    {
        return $this->belongsTo(Canbo::class, 'CanBoTS_ID');
    }
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->NgayXet = now()->setTimezone('Asia/Ho_Chi_Minh');
            $model->CanBoTS_ID = auth('api/canbo')->user()->id;
        });
    }
}
