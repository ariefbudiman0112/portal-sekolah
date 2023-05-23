<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Data;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
   /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $data = DB::table('users')
        ->join('data', 'users.dataid', '=', 'data.id')
        ->select('users.is_active','users.email_verified_at','users.created_at','users.updated_at','data.id','data.niss','data.namalengkap','data.namapanggilan', 'data.email', 'data.alamat','data.nohp','data.nowa')
        ->orderBy('data.id', 'desc')
        ->get();
        // return DataResource::collection(data->orderBy('data.id', 'desc')
        return UserResource::collection($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        Log::info('Data insert');
        $validatedData = $request->validated();

        $data = Data::create([
            'niss' => random_int(1, 100000),
            'namalengkap' => $validatedData['namalengkap'],
            'email' => $validatedData['email'],
            'usercreated' => $validatedData['namalengkap'],
        ]);

        $users = User::create([
            'password' => Hash::make($validatedData['password']),
            'is_active' => $validatedData['is_active'],
            'dataid' => $data->id,
            // 'usercreated' => $validatedData['usercreated'],
        ]);


        return response(new UserResource($users,$data) , 201);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $user = Data::join('users', 'users.dataid', '=', 'data.id')
                        ->where('users.dataid', $user->id)
                        ->select('users.is_active','users.email_verified_at','users.created_at','users.updated_at','data.id','data.niss','data.namalengkap','data.namapanggilan', 'data.email', 'data.alamat','data.nohp','data.nowa')
                        ->first();
        
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateUserRequest $request
     * @param \App\Models\Data                     $user
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        // try{
            $validated = $request->validated();

            Log::info('Data update');
            Log::info('data id', ['Data ID' => $user->id]);
            // Retrieve the user model instance based on the user id stored in the $data model
            $data = User::join('data', 'users.dataid', '=', 'data.id')
            ->where('users.dataid', $user->id)
            ->firstOrFail();
            // $user = User::where('dataid', $data->id)->firstOrFail();
            // Check if the password needs to be updated
            if (isset($validated['password'])) {

                // Update other data
                $user->password = Hash::make($validated['password']);
                // $user->userupdated = 

                // Save the updated user model instance
                $user->save();
                
                // Remove the password from the $validated array as it has already been updated
                unset($validated['password']);
            }
            $user->is_active = $validated['is_active'];
            $user->save();
            // Update the remaining data in the $data model instance
            $data->update($validated);

            // Return the updated $data model instance as a resource
            return new UserResource($data);
        // } catch (\Exception $e) {
        //     return response([
        //         'message' => 'Try again!'
        //     ], 422);
        // }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Data $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(Data $data, User $user)
    {
        // Retrieve the user model instance based on the user id stored in the $data model
        $user = User::where('dataid', $data->id)->firstOrFail();
        // Delete the user model instance
        $user->delete();
        // Delete the $data model instance
        $data->delete();
        // Return a success message
        return response("", 204);
    }
}
