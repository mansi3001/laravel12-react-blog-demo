<?php

use App\Http\Controllers\Api\BlogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Blog API Routes
Route::apiResource('blogs', BlogController::class);
Route::post('blogs/bulk-delete', [BlogController::class, 'bulkDelete']);
Route::post('blogs/reorder', [BlogController::class, 'reorder']);
Route::get('blogs/export', [BlogController::class, 'export']);

// Categories API Routes
Route::get('categories', function () {
    return \App\Models\Category::active()->get();
});