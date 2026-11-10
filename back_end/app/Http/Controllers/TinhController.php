<?php

namespace App\Http\Controllers;

use App\Models\Tinh;
use Illuminate\Http\Request;

class TinhController extends Controller
{
    public function getTinh() {
        try {
           $data =  Tinh::select(
            'administrative_unit_id as cap', 
            'code as ma',
            'full_name as  tenDonVi')->get();
            
            return response()->json([
                "data" => $data,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Đã xảy ra lỗi'], 500);
        }
    }
}
