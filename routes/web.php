<?php

use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Blog Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/blogs', [\App\Http\Controllers\Api\BlogController::class, 'webIndex'])->name('blogs.index');
    
    Route::post('/blogs', [\App\Http\Controllers\Api\BlogController::class, 'store'])->name('blogs.store');
    Route::put('/blogs/{blog}', [\App\Http\Controllers\Api\BlogController::class, 'update'])->name('blogs.update');
    Route::delete('/blogs/{blog}', [\App\Http\Controllers\Api\BlogController::class, 'destroy'])->name('blogs.destroy');
    Route::post('/blogs/bulk-delete', [\App\Http\Controllers\Api\BlogController::class, 'bulkDelete'])->name('blogs.bulk-delete');
    Route::post('/blogs/reorder', [\App\Http\Controllers\Api\BlogController::class, 'reorder'])->name('blogs.reorder');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';