<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CanboController;
use App\Http\Controllers\NganhController;
use App\Http\Controllers\HoSoXetTuyenController;
use App\Http\Controllers\XetTuyenClientController;

/*
        Clients - Public
*/
//Tra cuu
Route::get('tra-cuu/ho-so', [XetTuyenClientController::class, 'traCuuHoSo']);

//Xet tuyen
Route::post('xet-tuyen/ho-so', [XetTuyenClientController::class, 'nopHoSoXetTuyenClient']);

//Ds Nganh
Route::get('nganh', [NganhController::class, 'getNganh']);


/*
        Managers - Private
*/
//Ho so xet tuyen
Route::prefix('ho-so')->group(function () {
    Route::apiResource('xet-tuyen', HoSoXetTuyenController::class)->except('store');
    Route::get('trung-tuyen', [HoSoXetTuyenController::class, 'trungTuyen']);
    Route::get('report-thang/{year}', [HoSoXetTuyenController::class, 'reportThang']);
    Route::get('report-nganh', [HoSoXetTuyenController::class, 'reportNganh']);
    Route::get('report-nam', [HoSoXetTuyenController::class, 'reportNam']);
    Route::put('update-trang-thai', [HoSoXetTuyenController::class, 'trangThaiHoSo']);
    Route::post('gui-email', [HoSoXetTuyenController::class, 'sendEmail']);
});

// Admin
Route::prefix('auth')->middleware('api')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::get('profile', [AuthController::class, 'profile']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
});

// Can bo tuyen sinh
Route::prefix('canbo')->middleware('api')->group(function () {
    Route::post('login', [CanboController::class, 'login']);
    Route::get('profile', [CanboController::class, 'profile']);
    Route::post('logout', [CanboController::class, 'logout']);
    Route::post('refresh', [CanboController::class, 'refresh']);
});
