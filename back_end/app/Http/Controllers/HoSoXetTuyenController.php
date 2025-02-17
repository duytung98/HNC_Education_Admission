<?php

namespace App\Http\Controllers;

use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CanBoTSHoSo;
use App\Models\XetTuyen;
use App\Models\Nganh;
use App\Models\HoSo;
use Mail;
use Carbon\Carbon;
use App\Traits\ValidationTrait;

class HoSoXetTuyenController extends Controller
{
    use ValidationTrait;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $canbo = auth('api/canbo')->user();
            $user = auth('api')->user();
            if ($canbo || $user) {
                $currentYear = Carbon::now()->year;
                $result = HoSo::with([
                    'xetTuyen' => function ($query) {
                        $query->select('HoSo_ID', 'TrangThai', 'HinhThuc', 'DiemTB10', 'DiemTB11', 'DiemHKI12', 'GhiChu');
                    },
                    'minhChung' => function ($query) {
                        $query->select('HoSo_ID', 'BangKQ12', 'HocBaBia', 'ChungNhanTN', 'ChungNhanUT');
                    },
                    'nganh'
                ])
                    ->select('*')
                    ->orderBy('NgayNop', 'asc')
                    ->whereHas('xetTuyen', function ($query) {
                        $query->where('TrangThai', '=', null);
                    })
                    ->whereYear('NgayNop', $currentYear)
                    ->get();

                $result->each(function ($item) {
                    $item->minhChung->BangKQ12 = json_decode($item->minhChung->BangKQ12);
                });

                return response()->json(['data' => $result], 200);
            }
            return response()->json(['message' => 'Từ chối truy cập'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $canbo = auth('api/canbo')->user();
            $user = auth('api')->user();
            if ($canbo || $user) {
                $currentYear = Carbon::now()->year;
                $data = HoSo::with([
                    'xetTuyen',
                    'minhChung',
                    'nganh'
                ])
                    ->where(function ($query) use ($id) {
                        $query->where('MaHoSo', $id);
                    })
                    ->whereYear('NgayNop', $currentYear)
                    ->orderBy('NgayNop', 'asc')
                    ->first();

                if (!$data) {
                    return response()->json(['error' => 'Không tìm thấy hồ sơ.'], 404);
                }
                $data->minhChung->BangKQ12 = json_decode($data->minhChung->BangKQ12);
                return response()->json(['data' => $data], 200);
            }
            return response()->json(['message' => 'Từ chối truy cập'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi khi lấy chi tiết hồ sơ.'], 500);
        }
    }

    /**
     * Update the specified resource in storage. Sử dụng $id thay cho MaHoSo
     */
    public function update(Request $request, string $id)
    {
        try {
            $canbo = auth('api/canbo')->user();
            $user = auth('api')->user();
            if ($canbo || $user) {

                $hoSo = HoSo::find($id);

                if (!$hoSo) {
                    return response()->json(['error' => 'Không tìm thấy hồ sơ'], 404);
                } else {

                    $this->validateHoSo($request, $id);

                    $hoSo->update(
                        $request->all()
                    );


                    $minhChung = $hoSo->minhChung;
                    $xetTuyenData = [];
                    if ($request->input('HinhThuc') !== null) {
                        $xetTuyenData['HinhThuc'] = $request->input('HinhThuc');
                    }
                    if ($request->input('DiemTB10') !== null) {
                        $xetTuyenData['DiemTB10'] = $request->input('DiemTB10');
                    }
                    if ($request->input('DiemTB11') !== null) {
                        $xetTuyenData['DiemTB11'] = $request->input('DiemTB11');
                    }
                    if ($request->input('DiemHKI12') !== null) {
                        $xetTuyenData['DiemHKI12'] = $request->input('DiemHKI12');
                    }
                    if ($request->input('TrangThai') !== null) {
                        $xetTuyenData['TrangThai'] = $request->input('TrangThai');
                    }

                    $hoSo->xetTuyen()->update($xetTuyenData);

                    if ($request->has('BangKQ12') && $request->hasFile('BangKQ12')) {
                        // Xóa ảnh cũ trước khi cập nhật
                        $imagePaths = json_decode($minhChung->BangKQ12, true);
                        foreach ($imagePaths as $path) {
                            Storage::delete("public/" . str_replace('http://localhost:8000/' . 'storage/', '', $path));
                        }
                        // Xử lý và lưu trữ các hình ảnh mới từ yêu cầu gửi
                        $newImagePaths = [];
                        foreach ($request->file('BangKQ12', []) as $image) {
                            $path = $image->store("images/{$hoSo->SDT}/BangKQ12", "public");
                            $newImagePaths[] = 'http://localhost:8000/' . 'storage/' . $path;
                        }
                        // Convert image paths to JSON
                        $newImagePathsJson = json_encode($newImagePaths);
                        $minhChung->update([
                            'BangKQ12' => $newImagePathsJson
                        ]);
                    }

                    if ($request->has('HocBaBia') && $request->hasFile('HocBaBia')) {
                        $oldHocBaBiaPath = $minhChung->HocBaBia;

                        if ($oldHocBaBiaPath) {
                            Storage::delete("public/" . str_replace('http://localhost:8000/' . 'storage/', '', $oldHocBaBiaPath));
                        }
                        $HocBaBiaPath = $request->file('HocBaBia')->store("images/{$hoSo->SDT}/HocBaBia", "public");
                        $minhChung->update([
                            'HocBaBia' => 'http://localhost:8000/' . 'storage/' . $HocBaBiaPath,
                        ]);
                    }

                    if ($request->has('ChungNhanTN') && $request->hasFile('ChungNhanTN')) {
                        $oldChungNhanTNPath = $minhChung->ChungNhanTN;
                        if ($oldChungNhanTNPath) {
                            Storage::delete("public/" . str_replace('http://localhost:8000/' . 'storage/', '', $oldChungNhanTNPath));
                        }
                        $ChungNhanTNPath = $request->file('ChungNhanTN')->store("images/{$hoSo->SDT}/ChungNhanTN", "public");
                        $minhChung->update(['ChungNhanTN' => 'http://localhost:8000/' . 'storage/' . $ChungNhanTNPath]);
                    }

                    if ($request->has('ChungNhanUT') && $request->hasFile('ChungNhanUT')) {
                        $oldChungNhanUTPath = $minhChung->ChungNhanUT;
                        if ($oldChungNhanUTPath) {
                            Storage::delete("public/" . str_replace('http://localhost:8000/' . 'storage/', '', $oldChungNhanUTPath));
                        }
                        $ChungNhanUTPath = $request->file('ChungNhanUT')->store("images/{$hoSo->SDT}/ChungNhanUT", "public");
                        $minhChung->update(['ChungNhanUT' => 'http://localhost:8000/' . 'storage/' . $ChungNhanUTPath]);
                    }
                    return response()->json(['success' => true], 200);
                }
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $canbo = auth('api/canbo')->user();
            $user = auth('api')->user();
            if ($canbo || $user) {
                $result = HoSo::with([
                    'xetTuyen',
                    'minhChung'
                ])->where(function ($query) use ($id) {
                    $query->where('MaHoSo', $id);
                })->first();

                if (!$result) {
                    return response()->json(['error' => 'Không tìm thấy hồ sơ'], 404);
                } else {
                    $result->xetTuyen()->delete();
                    $minhChung = $result->minhChung;

                    // Xóa ảnh trong storage
                    $imagePaths = json_decode($minhChung->BangKQ12, true);
                    if ($imagePaths) {
                        foreach ($imagePaths as $path) {
                            Storage::delete("public/" . str_replace('http://localhost:8000/' . 'storage/', '', $path));
                        }
                    }
                    // Xóa ảnh bia hoc ba trong storage
                    if ($minhChung->HocBaBia) {
                        Storage::delete("public/" . str_replace('http://localhost:8000/' . 'storage/', '', $minhChung->HocBaBia));
                    }

                    // Xóa ảnh bang tot nghiep trong storage
                    if ($minhChung->ChungNhanTN) {
                        Storage::delete("public/" . str_replace('http://localhost:8000/' . 'storage/', '', $minhChung->ChungNhanTN));
                    }

                    // Xóa ảnh chung nhan uu tien trong storage
                    if ($minhChung->ChungNhanUT) {
                        Storage::delete("public/" . str_replace('http://localhost:8000/' . 'storage/', '', $minhChung->ChungNhanUT));
                    }

                    $minhChung->delete();
                    $result->delete();
                    return response()->json(['success' => true], 200);
                }
            }
            return response()->json(['message' => 'Từ chối truy cập'], 403);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Đã xảy ra lỗi khi xóa hồ sơ'], 500);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function trungTuyen()
    {
        try {
            $canbo = auth('api/canbo')->user();
            $user = auth('api')->user();
            if ($canbo || $user) {
                $currentYear = Carbon::now()->year;
                $result = HoSo::with([
                    'xetTuyen' => function ($query) {
                        $query->select('HoSo_ID', 'TrangThai', 'HinhThuc', 'DiemTB10', 'DiemTB11', 'DiemHKI12', 'GhiChu');
                    },
                    'minhChung' => function ($query) {
                        $query->select('HoSo_ID', 'BangKQ12', 'HocBaBia', 'ChungNhanTN', 'ChungNhanUT');
                    },
                    'nganh'
                ])
                    ->select('*')
                    ->whereYear('NgayNop', $currentYear)
                    ->orderBy('NgayNop', 'asc')
                    ->whereHas('xetTuyen', function ($query) {
                        $query->where('TrangThai', 1);
                    })
                    ->get();

                $result->each(function ($item) {
                    $item->minhChung->BangKQ12 = json_decode($item->minhChung->BangKQ12);
                });

                return response()->json(['data' => $result], 200);
            }
            return response()->json(['message' => 'Từ chối truy cập'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi khi lấy ds hồ sơ.'], 500);
        }
    }
    public function trangThaiHoSo(Request $request)
    {
        try {
            $canbo = auth('api/canbo')->user();
            $user = auth('api')->user();

            if ($canbo || $user) {
                $trangthai = $request->input('trangthai');
                $idHoSo = $request->input('idHoSo');
                $idCanBo = optional(auth('api/canbo')->user())->id;

                // Check trangthai phải thuộc 0,1 và không được giống
                if (!in_array($trangthai, [0, 1])) {
                    return response()->json(['error' => 'Trạng thái không hợp lệ'], 400);
                }

                // Check if the HoSo_ID exists and is valid
                $hoSo = HoSo::find($idHoSo);
                if (empty($idHoSo) || !$hoSo) {
                    return response()->json(['error' => 'ID hồ sơ không hợp lệ hoặc không tồn tại'], 400);
                }

                // Cập nhật trạng thái cho bảng XetTuyen
                XetTuyen::where('HoSo_ID', $idHoSo)->update([
                    'TrangThai' => $trangthai,
                    'GhiChu' => null,
                ]);

                // Cập nhật hoặc tạo mới trạng thái cho bảng CanBoTSHoSo
                CanBoTSHoSo::updateOrCreate(
                    ['HoSo_ID' => $idHoSo],
                    [
                        'TrangThai' => $trangthai,
                        'CanBoTS_ID' => $idCanBo,
                        'GhiChu' => null,
                    ]
                );

                return response()->json([
                    'message' => 'Cập nhật trạng thái thành công',
                    'id' => $idHoSo,
                ], 201);
            }

            return response()->json(['message' => 'Từ chối truy cập'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi server.'], 500);
        }
    }
    /**
     * send email .
     */
    public function sendEmail(Request $request)
    {
        try {
            $canbo = auth('api/canbo')->user();
            $user = auth('api')->user();

            if ($canbo || $user) {
                $data = $request->input('data');

                Mail::send('email', $data, function ($message) use ($data) {
                    $message->subject('Thư báo trúng tuyển');
                    $message->to($data['email'], $data['fullName']);
                });

                return response()->json(['Message' => 'Gửi thành công!']);
                //encode-passEmail: **** **** **** ****
            }

            return response()->json(['message' => 'Từ chối truy cập'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi server.'], 500);
        }
    }

    public function reportThang($year)
    {
        try {
            $canbo = auth('api/canbo')->user();
            $user = auth('api')->user();
            if ($canbo || $user) {
                $data = HoSo::selectRaw('MONTH(NgayNop) as month, COUNT(*) as total')
                    ->whereYear('NgayNop', $year)
                    ->whereHas('xetTuyen', function ($query) {
                        $query->where('TrangThai', 1);
                    })
                    ->groupBy('month')
                    ->get();

                $months = range(1, 12);
                $data = collect($data)->keyBy('month')->map(function ($item) {
                    return $item->total;
                })->toArray();

                $data = array_replace(array_fill_keys($months, 0), $data);

                return response()->json(['status' => 'success', 'data' => $data], 200);
            }

            return response()->json(['message' => 'Từ chối truy cập'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi server.'], 500);
        }
    }

    public function reportNam()
    {
        try {
            $canbo = auth('api/canbo')->user();
            $user = auth('api')->user();
            if ($canbo || $user) {
                $data = HoSo::selectRaw('YEAR(NgayNop) as year, COUNT(*) as total')
                    ->whereYear('NgayNop', '>=', date('Y') - 4)
                    ->whereHas('xetTuyen', function ($query) {
                        $query->where('TrangThai', 1);
                    })
                    ->groupBy('year')
                    ->get();

                $years = range(date('Y') - 4, date('Y'));
                $data = collect($data)->keyBy('year')->map(function ($item) {
                    return $item->total;
                })->toArray();

                $data = array_replace(array_fill_keys($years, 0), $data);

                return response()->json(['status' => 'success', 'data' => $data], 200);
            }

            return response()->json(['message' => 'Từ chối truy cập'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi server.'], 500);
        }
    }

    public function reportNganh()
    {
        try {
            $canbo = auth('api/canbo')->user();
            $user = auth('api')->user();
            if ($canbo || $user) {
                $data = HoSo::with('nganh')->selectRaw('Nganh_ID, COUNT(*) as total')
                    ->whereYear('NgayNop', date('Y'))
                    ->whereHas('xetTuyen', function ($query) {
                        $query->where('TrangThai', 1);
                    })
                    ->groupBy('Nganh_ID')
                    ->get();

                $nganhData = $data->pluck('total', 'nganh.TenNganh')->toArray();
                $allNganhIDs = Nganh::pluck('TenNganh')->toArray();

                $nganhData = array_replace(array_fill_keys($allNganhIDs, 0), $nganhData);

                return response()->json(['status' => 'success', 'data' => $nganhData], 200);
            }

            return response()->json(['message' => 'Từ chối truy cập'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi server.'], 500);
        }
    }
}
