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
        Schema::create('historikelas', function (Blueprint $table) {
            $table->id();
            $table->integer('tahunajaran');
            $table->foreignIdFor(\App\Models\Kelas::class,'kelasid')->nullable();
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
        Schema::dropIfExists('historikelas');
    }
};
