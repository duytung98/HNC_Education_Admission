<?php

namespace App\Http\Controllers;

use App\Models\Canbo;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cookie;

class CanboController extends Controller
{
    //login
    public function login()
    {
        try {
            $credentials = request(['maCBTS', 'password']);
            $canbo = Canbo::query()->where('MaCBTS',$credentials['maCBTS'])->first();
            if($canbo){
                $password = Hash::make($canbo->Password);
            }
            if(!$canbo){
                return response()->json(['message'=>'Tài khoản hoặc mật khẩu không đúng!'], 401);
            }
            if (!Hash::check($credentials['password'],$password)) {
                return response()->json(['message' => 'Tài khoản hoặc mật khẩu không đúng!'], 401);
            }
            $token = auth('api/canbo')->login($canbo);
            $refreshToken = $this->createRefreshToken();
            $fullname = $canbo->HoDem . ' '.$canbo -> Ten;
            return $this->respondWithToken($token,$refreshToken,$fullname);
        } catch (\Throwable $th) {
            return response()->json(['message'=>'Lỗi server!'], 500);
        }

    }


    public function profile(){
      try {
        return response()->json(auth('api/canbo')->user());
      } catch (\Exception $th) {
        return response()->json(['error'=>'Không tồn tại'],401);
      }
    }

    // logout

    public function logout()
    {
        try {
            $canbo = auth('api/canbo')->user();
            if ($canbo) {
                auth('api/canbo')->logout();
                return response()->json(['message' => 'Đăng xuất thành công'])
                ->cookie(Cookie::forget('refresh_token'));
            }
            else{
                return response()->json(['message' => 'Chưa đăng nhập'],401);
            }
        }catch(\exception $e){
            return response()->json(['error' => 'Không tồn tại'], 404);
        }
    }

    // refresh

    public function refresh(Request $request){
        $refreshToken = $request->header('Authorization');
        $fruits = explode(" ", $refreshToken);
        try {
            $decode = JwtAuth::getJWTProvider()->decode($fruits[1]);

            $canbo = Canbo::find($decode['canbo_id']);
            // return $decode;
            if(!$canbo){
                return response()->json(['message'=>'Refresh không đúng hoặc chưa đăng nhập']);
            }
            $token = auth('api/canbo')->login($canbo);
            $refreshToken = $this->createRefreshToken();
            $fullname = $canbo->HoDem . ' ' . $canbo->Ten;
            return $this->respondWithToken($token, $refreshToken, $fullname);
        } catch (\Exception $th) {
            return response()->json(['error' => 'Làm mới token không hợp lệ'], 404);
        }
    }

    private function createRefreshToken(){
        $data = [
            'canbo_id' => auth('api/canbo')->user()->id,
            'random' => rand() . time(),
            'exp' => time() + config('jwt.refresh_ttl',525600),
        ];
        $refreshToken = JwtAuth::getJWTProvider()->encode($data);
        return $refreshToken;
    }


    private function respondWithToken($token,$refreshToken,$fullname)
    {
        return response()->json([
            'access_token' => $token,
            'fullname' => $fullname,
            'refresh_token' => $refreshToken
        ],200);
    }
}
