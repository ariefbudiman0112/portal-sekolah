<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\Data;
use App\Models\User;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $validatedinput = $request->validated();
        /** @var \App\Models\Data $user */
        $data = Data::create([
            'niss' => random_int(1, 100000),
            'namalengkap' => $validatedinput['namalengkap'],
            'email' => $validatedinput['email'],
            'usercreated' => $validatedinput['namalengkap'],
            'userupdated' => $validatedinput['namalengkap'],
        ]);

        $user = User::create([
            'dataid' => $data->id,
            'password' => Hash::make($validatedinput['password']),
            'usercreated' => $validatedinput['namalengkap'],
            'userupdated' => $validatedinput['namalengkap'],
            'is_active' => false,
        ]);
        $token = $user->createToken($data->namalengkap)->plainTextToken;
        
        return response(compact('user','data','token'));
    }

    public function login(LoginRequest $request)
    {
        // try {
            $credentials = $request->validated();

            $data = Data::join('users', 'users.dataid', '=', 'data.id')
                ->where('data.niss', $credentials['niss'])
                ->select('users.*', 'data.*')
                ->firstOrFail();
            // $data = Data::where('niss', $credentials['niss'])->firstOrFail();
            $user = User::where('dataid', $data->id)->firstOrFail();
            $currenttime = Carbon::now();
            

            Log::info('User id', ['id' => $data->id]);
            Log::info('User niss', ['niss' => $data->niss]);
            Log::info('User password input', ['input password' => $credentials['password']]);
            Log::info('User password current', ['current password' => $data->password]);
            Log::info('User namalengkap', ['namalengkap' => $data->namalengkap]);
            Log::info('User last activity', ['last activity' => $data->last_activity]);

            if ($data && Hash::check($credentials['password'], $data->password)) {
                Log::info('Berhasil masuk');
                $user->last_activity = $currenttime;
                $user->update();
                $data->tokens()->delete();
                $token = $data->createToken($data->email)->plainTextToken;

                // $rememberMe = $request->input('remember_me');
                // if ($rememberMe) {
                //     $cookieValue = [
                //         'niss' => $data->niss,
                //         'password' => $credentials['password']
                //     ];
                //     $cookieName = 'remember_me';
                //     $cookieExpire = time() + 604800; // 1 week
                //     Cookie::queue($cookieName, json_encode($cookieValue), $cookieExpire);
                // }

                return response(compact('user','data','token'));

            } else {
                return response([
                    'message' => 'Provided niss or password is incorrect'
                ], 422);
            }
        // } catch (\Exception $e) {
        //     return response([
        //         'message' => 'Error'
        //     ], 422);
        // }
    }

    public function logout(Request $request)
    { 
        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        // check if remember_me cookie exists
        // if (Cookie::has('remember_me')) {
        //     // delete the remember_me cookie
        //     Cookie::queue(Cookie::forget('remember_me'));
        // }
        // Show flash message to user
        return response('', 204);
    }
}
