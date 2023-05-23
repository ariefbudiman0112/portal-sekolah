<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Data;

class UserActivityController extends Controller
{
    public function updateActivity(Request $request)
    {

        Log::info('Update activity starts');
        $data = Data::where('niss', $request->niss)->firstorfail();
        Log::info('Data ID', ['Data ID' => $data->id]);
        // Find the user in the database
        $user = User::where('dataid', $data->id)->firstorfail();
        Log::info('Last activity', ['Last activity' => $user->last_activity]);
        // Update the user's last activity time
        $user->last_activity = Carbon::now();
        $user->update();

        return response()->json(['success' => true]);
    }

}
