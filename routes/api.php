<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\KelasController;
use App\Http\Controllers\Api\UserActivityController;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Data;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::apiResource('/users', UserController::class);
    Route::apiResource('/kelas', KelasController::class);
});

Route::post('/update-activity', [UserActivityController::class, 'updateActivity']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/check-activity', function (Request $request) {
    Log::info('Check user activity starts');
    Log::info('User NISS', ['NISS' => $request->niss]);
    $data = Data::where('niss', $request->niss)->firstorfail();
    Log::info('Data id', ['Data id' => $data->id]);
    $user = User::where('dataid', $data->id)->firstorfail();
    Log::info('Last activity', ['Last activity' => $user->last_activity]);
    return $user ? $user->last_activity : null;
});
