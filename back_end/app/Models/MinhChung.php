<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MinhChung extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'tb_minhchung';

    protected $guarded = [];

    protected $visible = ['BangKQ12','HocBaBia','ChungNhanTN','ChungNhanUT'];

    public function hoSo() {
        return $this->belongsTo(HoSo::class, 'HoSo_ID');
    }
}
