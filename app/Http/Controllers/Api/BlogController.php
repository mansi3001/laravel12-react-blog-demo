<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\StoreBlogRequest;
use App\Http\Requests\Blog\UpdateBlogRequest;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use App\Models\City;
use App\Models\Country;
use App\Models\State;
use App\Services\BlogService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function __construct(private BlogService $blogService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $blogs = $this->blogService->getBlogs($request->all());
        $countries = \App\Models\Country::orderBy('name')->get();
        
        return response()->json([
            'data' => BlogResource::collection($blogs->items()),
            'countries' => $countries,
            'meta' => [
                'current_page' => $blogs->currentPage(),
                'last_page' => $blogs->lastPage(),
                'per_page' => $blogs->perPage(),
                'total' => $blogs->total(),
            ]
        ]);
    }

    public function getStates(Request $request, $countryId)
    {
        $states = State::where('country_id', $countryId)
                      ->orderBy('name')
                      ->get();
        
        return response()->json($states);
    }

    public function getCities(Request $request, $stateId)
    {
        $cities = City::where('state_id', $stateId)
                     ->orderBy('name')
                     ->get();
        
        return response()->json($cities);
    }

    public function getSubjects(Request $request, $courseId)
    {
        $subjects = \App\Models\Subject::where('course_id', $courseId)
                      ->orderBy('name')
                      ->get();
        
        return response()->json($subjects);
    }

    public function store(StoreBlogRequest $request): RedirectResponse
    {
        $blog = $this->blogService->createBlog($request->validated());
        
        return redirect()->route('blogs.index')->with('success', 'Blog created successfully');
    }

    public function show(Blog $blog): JsonResponse
    {
        return response()->json([
            'data' => new BlogResource($blog->load(['category', 'user']))
        ]);
    }

    public function update(UpdateBlogRequest $request, Blog $blog): RedirectResponse
    {
        $blog = $this->blogService->updateBlog($blog, $request->validated());
        
        return redirect()->route('blogs.index')->with('success', 'Blog updated successfully');
    }

    public function destroy(Blog $blog): RedirectResponse
    {
        $this->blogService->deleteBlog($blog);
        
        return redirect()->route('blogs.index')->with('success', 'Blog deleted successfully');
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        $request->validate(['ids' => 'required|array']);
        
        $this->blogService->bulkDelete($request->ids);
        
        return redirect()->route('blogs.index')->with('success', 'Blogs deleted successfully');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ordered_ids' => 'required|array',
            'ordered_ids.*' => 'required|exists:blogs,id',
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->input('ordered_ids') as $index => $id) {
                Blog::where('id', $id)->update(['sort_order' => $index + 1]);
            }
        });

        return back()->with('success', 'Order updated successfully.');
    }

    public function webIndex(Request $request)
    {
        $blogs = $this->blogService->getBlogs($request->all());
        $categories = \App\Models\Category::active()->get();
        $countries = \App\Models\Country::orderBy('name')->get();
        $courses = \App\Models\Course::orderBy('name')->get();
        
        return \Inertia\Inertia::render('Blog/Index', [
            'blogs' => [
                'data' => $blogs->items(),
                'meta' => [
                    'current_page' => $blogs->currentPage(),
                    'last_page' => $blogs->lastPage(),
                    'per_page' => $blogs->perPage(),
                    'total' => $blogs->total(),
                ]
            ],
            'categories' => $categories,
            'countries' => $countries,
            'courses' => $courses,
            'auth' => [
                'user' => [
                    'permissions' => auth()->user()->isSuperAdmin() 
                        ? \App\Models\Permission::pluck('slug')->values()
                        : auth()->user()->roles()->with('permissions')->get()
                            ->pluck('permissions')->flatten()->pluck('slug')->unique()->values()
                ]
            ]
        ]);
    }


}