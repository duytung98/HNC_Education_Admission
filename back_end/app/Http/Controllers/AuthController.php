<?php

// AuthController.php
namespace App\Http\Controllers;

use App\models\Auth;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    // API LOGIN
    public function login()
    {
        $credentials = request(['username', 'password']);
        $auth = Auth::query()->where('username', $credentials['username'])->first();
        if ($auth) {
            $password = Hash::make($auth->Password);
        }
        if (!$auth || !Hash::check($credentials['password'], $password)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $token = auth('api')->login($auth);
        $username = $auth->UserName;
        $refreshToken = $this->createRefreshToken();
        return $this->respondWithToken($token, $refreshToken, $username);
    }


    // PROFILE
    public function profile()
    {
        try {
            return response()->json(auth()->user());
        } catch (\Exception $th) {
            return response()->json(['message' => 'token not found'], 404);
        }
    }

    // LOGOUT

    public function logout()
    {
        try {
            $user = auth('api')->user();
            if ($user) {
                auth('api')->logout();
                return response()->json(['message' => 'Successfully logged out']);
            } else {
                return response()->json(['message' => 'chưa đăng nhập'], 404);
            }
        } catch (\Exception $e) {
            // Xử lý lỗi JWT (nếu cần)
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    //REFRESH
    public function refresh()
    {
        $refreshToken = request()->refresh_token;

        try {
            $decode = JwtAuth::getJWTProvider()->decode($refreshToken);
            $auth = auth::find($decode['auth_id']);
            if (!$auth) {
                return response()->json(['message' => 'refresh khong dung hoac chua dang nhap']);
            }
            $token = auth('api')->login($auth);
            $refreshToken = $this->createRefreshToken();
            $username = $auth->UserName;
            return $this->respondWithToken($token, $refreshToken, $username);
        } catch (\Exception $th) {
            return response()->json(['error' => 'Refresh Token invalid'], 404);
        }
    }

    private function createRefreshToken()
    {
        $data = [
            'auth_id' => auth('api')->user()->id,
            'random' => rand() . time(),
            'exp' => time() + config('jwt.refresh_ttl'),
        ];
        $refreshToken = JwtAuth::getJWTProvider()->encode($data);
        return $refreshToken;
    }


    private function respondWithToken($token, $refreshToken, $username)
    {
        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'username' => $username,
        ]);
    }
}
