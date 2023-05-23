<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('banksoalid', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Banksoal::class,'banksoalid')->nullable();
            $table->integer('sequence')->nullable();
            $table->string('deskripsi')->nullable();
            $table->string('usercreated');
            $table->string('userupdated');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
