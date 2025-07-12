<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'image' => $this->image,
            'status' => $this->status,
            'tags' => $this->tags,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category'),
            'user' => $this->whenLoaded('user'),
            'country' => $this->country,
            'state' => $this->state,
            'city' => $this->city,
            'priority' => $this->priority,
            'is_featured' => $this->is_featured,
            'skills' => $this->skills,
            'publish_date' => $this->publish_date,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}