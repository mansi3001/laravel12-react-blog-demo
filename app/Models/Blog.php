<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'image',
        'status',
        'tags',
        'category_id',
        'user_id',
        'sort_order',
        'country_id',
        'state_id',
        'city_id',
        'priority',
        'is_featured',
        'skills',
        'publish_date',
        'is_active'
    ];

    protected $casts = [
        'tags' => 'array',
        'skills' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'publish_date' => 'date',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }
}