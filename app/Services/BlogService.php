<?php

namespace App\Services;

use App\Models\Blog;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogService
{
    public function getBlogs(array $filters): LengthAwarePaginator
    {
        $query = Blog::with(['category', 'user']);

        // Search
        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        // Status filter
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Category filter
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Date range filter
        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        // Sorting - Always order by sort_order first, then by other criteria
        $query->orderBy('sort_order', 'asc');
        
        // Additional sorting if specified
        if (!empty($filters['sort_by']) && $filters['sort_by'] !== 'sort_order') {
            $sortOrder = $filters['sort_order'] ?? 'desc';
            $query->orderBy($filters['sort_by'], $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($filters['per_page'] ?? 10);
    }

    public function createBlog(array $data): Blog
    {
        $data['slug'] = Str::slug($data['title']);
        $data['user_id'] = auth()->id();

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $this->uploadImage($data['image']);
        }

        return Blog::create($data);
    }

    public function updateBlog(Blog $blog, array $data): Blog
    {
        $data['slug'] = Str::slug($data['title']);

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }
            $data['image'] = $this->uploadImage($data['image']);
        }

        $blog->update($data);
        return $blog->fresh(['category', 'user']);
    }

    public function deleteBlog(Blog $blog): void
    {
        if ($blog->image) {
            Storage::disk('public')->delete($blog->image);
        }
        $blog->delete();
    }

    public function bulkDelete(array $ids): void
    {
        $blogs = Blog::whereIn('id', $ids)->get();
        
        foreach ($blogs as $blog) {
            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }
        }
        
        Blog::whereIn('id', $ids)->delete();
    }

    public function reorderBlogs(array $items): void
    {
        foreach ($items as $item) {
            Blog::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }
    }

    private function uploadImage(UploadedFile $image): string
    {
        return $image->store('blogs', 'public');
    }
}