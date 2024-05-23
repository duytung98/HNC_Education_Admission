<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Nganh;


class NganhController extends Controller
{
    public function getNganh()
    {
        try {
            $data = Nganh::all();
            return response()->json([
                "data" => $data
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Đã xảy ra lỗi'], 500);
        }
    }
}

