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
        Schema::create('agendakelas', function (Blueprint $table) {
            $table->id();
            $table->string('tanggaljam');
            $table->string('agenda');
            $table->text('deskripsi');
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
        Schema::dropIfExists('agendakelas');
    }
};
