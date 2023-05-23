<?php
// app/Http/Middleware/CheckUserActivity.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Data;

class CheckUserActivity
{
    public function handle($request, Closure $next)
    {
        Log::info('Start check user');
        // $user = $request->user();
        $credentials = $request->niss;
        $data = Data::join('users', 'users.dataid', '=', 'data.id')
            ->where('data.niss', $credentials)
            ->select('users.*', 'data.*')
            ->firstOrFail();

        $user = User::where('dataid', $data->id)->firstOrFail();
        $lastActivity = $user->last_activity; // assuming you have a `last_activity` column in your `users` table

        if (time() - strtotime($lastActivity) > 60) { // 1800 seconds = 30 minutes
            Auth::guard('web')->logout(); // log out the user using the web guard
            return redirect('/login')->with('message', 'You have been logged out due to inactivity.');
        }

        $user->last_activity = now(); // update the user's last activity timestamp
        $user->save();

        return $next($request);
    }
}
