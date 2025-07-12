<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            // 'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:draft,published,archived',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'category_id' => 'required|exists:categories,id',
            'country' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'priority' => 'required|in:low,medium,high',
            'is_featured' => 'boolean',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:50',
            'publish_date' => 'nullable|date',
            'is_active' => 'boolean',
        ];
    }
}