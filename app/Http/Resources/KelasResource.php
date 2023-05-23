<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KelasResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'namakelas' => $this->namakelas,
            'deskripsi' => $this->deskripsi,
            'created_at' => date('Y-m-d H:i:s', strtotime($this->created_at)),
            'usercreated' => $this->namalengkap,
            'userupdated' => $this->namalengkap,
        ];
    }
}
