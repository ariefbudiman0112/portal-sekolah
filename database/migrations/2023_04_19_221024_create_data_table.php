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
        Schema::create('data', function (Blueprint $table) {
            $table->id();
            $table->integer('niss')->unique()->nullable();
            $table->string('namalengkap');
            $table->string('namapanggilan');
            $table->foreignIdFor(\App\Models\Kategori::class,'kategoriid')->nullable();
            $table->foreignIdFor(\App\Models\Kelas::class,'kelasid')->nullable();
            $table->string('Alamat');
            $table->biginteger('nohp');
            $table->biginteger('nowa');
            $table->string('email');
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
        Schema::dropIfExists('data');
    }
};
