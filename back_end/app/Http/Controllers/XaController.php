<?php

namespace App\Http\Controllers;

use App\Models\Xa;
use Illuminate\Http\Request;

class XaController extends Controller
{
    public function getXa($id) {
        try {
           $data =  Xa::select('code as ma', 'full_name as tenDonVi')
            ->where('province_code', $id)->get();
            
            return response()->json([
                "data" => $data,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Đã xảy ra lỗi'], 500);
        }
    }
}
