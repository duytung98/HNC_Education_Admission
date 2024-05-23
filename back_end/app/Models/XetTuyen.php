<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class XetTuyen extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'tb_xettuyen';

    protected $visible = ['TrangThai','HinhThuc','DiemTB10','DiemTB11','DiemHKI12','GhiChu'];

    protected $guarded = [];

    public function hoSo() {
        return $this->belongsTo(HoSo::class, 'HoSo_ID');
    }
}
