<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\DataResource;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class KelasController extends Controller
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
        ->select('users.is_active','users.email_verified_at','users.created_at','data.id','data.niss','data.namalengkap','data.namapanggilan', 'data.email', 'data.alamat','data.nohp','data.nowa')
        ->orderBy('data.id', 'desc')
        ->get();
        // return DataResource::collection(data->orderBy('data.id', 'desc')
        return DataResource::collection($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        Log::info('Kelas insert');
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


        return response(new DataResource($users,$data) , 201);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function show(Data $data)
    {
        $user = User::join('data', 'users.dataid', '=', 'data.id')
                        ->where('users.dataid', $data->id)
                        ->select('users.is_active','users.email_verified_at','users.created_at','data.id','data.niss','data.namalengkap','data.namapanggilan', 'data.email', 'data.alamat','data.nohp','data.nowa')
                        ->first();
        
        return new DataResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateUserRequest $request
     * @param \App\Models\Data                     $user
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, Data $data)
    {
        $validated = $request->validated();

        Log::info('Kelas update');
        // Retrieve the user model instance based on the user id stored in the $data model
        $user = User::join('data', 'users.dataid', '=', 'data.id')
        ->where('users.dataid', $data->id)
        ->select('users.*')
        ->firstOrFail();
        // Check if the password needs to be updated
        if (isset($validated['password'])) {

            // Update the password for the user
            $user->password = Hash::make($validated['password']);

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
        return new DataResource($data);
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
