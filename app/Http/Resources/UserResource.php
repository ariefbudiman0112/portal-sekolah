<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
// use Carbon\Carbon;

class UserResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'niss' => $this->niss,
            'namalengkap' => $this->namalengkap,
            'namapanggilan' => $this->namapanggilan,
            'alamat' => $this->alamat,
            'nohp' => $this->nohp,
            'nowa' => $this->nowa,
            'email' => $this->email,
            'created_at' => date('Y-m-d H:i:s', strtotime($this->created_at)),
            'updated_at' => date('Y-m-d H:i:s', strtotime($this->updated_at)),
            'usercreated' => $this->namalengkap,
            'userupdated' => $this->namalengkap,
            'is_active' => $this->is_active,
        ];
    }
}
