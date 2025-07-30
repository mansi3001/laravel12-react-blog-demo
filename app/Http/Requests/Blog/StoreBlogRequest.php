<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|min:5|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:draft,published,archived',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'category_id' => 'required|exists:categories,id',
            'country_id' => 'nullable',
            'state_id' => 'nullable',
            'city_id' => 'nullable',
            'priority' => 'required|in:low,medium,high',
            'is_featured' => 'boolean',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:50',
            'publish_date' => 'nullable|date',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required',
            'content.required' => 'Content is required',
            'category_id.required' => 'Category is required',
            'category_id.exists' => 'Selected category does not exist',
            'image.image' => 'File must be an image',
            'image.max' => 'Image size should not exceed 2MB',
        ];
    }
}