<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('blogs', function (Blueprint $table) {
            if (!Schema::hasColumn('blogs', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('user_id');
            }
        });
    }

    public function down()
    {
        Schema::table('blogs', function (Blueprint $table) {
            if (Schema::hasColumn('blogs', 'sort_order')) {
                $table->dropColumn('sort_order');
            }
        });
    }
};