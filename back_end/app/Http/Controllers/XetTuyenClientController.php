<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\HoSo;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use App\Traits\ValidationTrait;


class XetTuyenClientController extends Controller
{
    use ValidationTrait;

    public function traCuuHoSo(Request $request)
    {

        $id = $request->input('VALUES');
        $result = HoSo::with(['xetTuyen', 'minhChung'])
            ->where('CCCD', $id)
            ->orWhere('SDT', $id)
            ->orWhere('Email', $id)
            ->orWhere('MaHoSo', $id)
            ->first();

        if (!$result) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ'], 404);
        }
        $result->minhChung->BangKQ12 = json_decode($result->minhChung->BangKQ12);

        return response()->json(['data' => $result], 200);
    }


    public function nopHoSoXetTuyenClient(Request $request)
    {
        try {
            $this->validateHoSo($request);

            $hoSo = HoSo::create($request->all());
            $hoSo->save();

            if ($hoSo) {
                $xetTuyenData = [
                    'HoSo_ID' => $hoSo->id,
                    'HinhThuc' => $request->input('HinhThuc'),
                    'DiemTB10' => $request->input('DiemTB10'),
                    'DiemTB11' => $request->input('DiemTB11'),
                    'DiemHKI12' => $request->input('DiemHKI12'),
                ];

                // Xử lý và lưu trữ các hình ảnh từ yêu cầu gửi
                $imagePaths = [];
                $SDT = $hoSo->SDT;

                // Process and store the images from the request
                foreach ($request->file('BangKQ12', []) as $image) {
                    $path = $image->store("images/{$SDT}/BangKQ12", "public");
                    $imagePaths[] = 'http://localhost:8000/' . 'storage/' . $path;
                }

                $HocBaBiaPath = $request->file('HocBaBia') ? $request->file('HocBaBia')->store("images/{$SDT}/HocBaBia", "public") : null;
                $ChungNhanTNPath = $request->file('ChungNhanTN') ? $request->file('ChungNhanTN')->store("images/{$SDT}/ChungNhanTN", "public") : null;
                $ChungNhanUTPath = $request->file('ChungNhanUT') ? $request->file('ChungNhanUT')->store("images/{$SDT}/ChungNhanUT", "public") : null;

                // Convert image paths to JSON
                $imagePathsJson = json_encode($imagePaths);

                // Save the image paths to the database as JSON
                $minhChungData = [
                    'HoSo_ID' => $hoSo->id,
                    'BangKQ12' => $imagePathsJson,
                    'HocBaBia' => $HocBaBiaPath ? 'http://localhost:8000/' . 'storage/' . $HocBaBiaPath : null,
                    'ChungNhanTN' => $ChungNhanTNPath ? 'http://localhost:8000/' . 'storage/' . $ChungNhanTNPath : null,
                    'ChungNhanUT' => $ChungNhanUTPath ? 'http://localhost:8000/' . 'storage/' . $ChungNhanUTPath : null,
                ];

                $hoSo->xetTuyen()->create($xetTuyenData);
                $hoSo->minhChung()->create($minhChungData);

                return response()->json([
                    'success' => true,
                    'code' => $hoSo['MaHoSo']
                ], 201);
            }

            return response()->json(['message' => 'Từ chối truy cập'], 403);
        } catch (ValidationException $e) {

            $errors = $e->validator->errors();

            $flattenedErrors = [];
            foreach ($errors->getMessages() as $field => $messages) {
                $flattenedErrors[$field] = $messages[0];
            }

            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $flattenedErrors
            ], 422);
        }
    }
}
