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
        Schema::create('banksoal', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Matapelajaran::class,'matapelajaranid')->nullable();
            $table->string('namafile')->nullable();
            $table->string('deskripsi')->nullable();
            $table->string('usercreated');
            $table->string('userupdated');
            $table->datetime('tanggaljamupload')->nullable();
            $table->datetime('tanggaljammulai')->nullable();
            $table->datetime('tanggaljamselesai')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banksoal');
    }
};
