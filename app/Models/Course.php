<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = ['name'];

    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class);
    }
}
