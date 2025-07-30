<?php

use App\Http\Controllers\Api\LocationController;
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

Route::get('/slider', function () {
    return Inertia::render('Slider/Index');
})->middleware(['auth', 'verified'])->name('slider');

// Add these routes for each slider variant
Route::get('/slider/classic', function () {
    return Inertia::render('Slider/Classic');
})->middleware(['auth', 'verified']);

Route::get('/slider/fade', function () {
    return Inertia::render('Slider/Fade');
})->middleware(['auth', 'verified']);

Route::get('/slider/thumbnails', function () {
    return Inertia::render('Slider/Thumbnails');
})->middleware(['auth', 'verified']);

// Blog Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/blogs', [\App\Http\Controllers\Api\BlogController::class, 'webIndex'])->name('blogs.index');

    Route::post('/blogs', [\App\Http\Controllers\Api\BlogController::class, 'store'])->name('blogs.store');
    Route::put('/blogs/{blog}', [\App\Http\Controllers\Api\BlogController::class, 'update'])->name('blogs.update');
    Route::delete('/blogs/{blog}', [\App\Http\Controllers\Api\BlogController::class, 'destroy'])->name('blogs.destroy');
    Route::post('/blogs/bulk-delete', [\App\Http\Controllers\Api\BlogController::class, 'bulkDelete'])->name('blogs.bulk-delete');
    Route::post('/blogs/reorder', [\App\Http\Controllers\Api\BlogController::class, 'reorder'])->name('blogs.reorder');
    Route::get('/blogs/states/{country}', [\App\Http\Controllers\Api\BlogController::class, 'getStates'])->name('blogs.states.get');
    Route::get('/blogs/cities/{state}', [\App\Http\Controllers\Api\BlogController::class, 'getCities'])->name('blogs.cities.get');
    Route::get('/blogs/subjects/{course}', [\App\Http\Controllers\Api\BlogController::class, 'getSubjects'])->name('blogs.subjects.get');
});

// Role & Permission Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/roles', [\App\Http\Controllers\Api\RoleController::class, 'webIndex'])->name('roles.index');
    Route::post('/roles', [\App\Http\Controllers\Api\RoleController::class, 'store'])->name('roles.store');
    Route::put('/roles/{role}', [\App\Http\Controllers\Api\RoleController::class, 'update'])->name('roles.update');
    Route::delete('/roles/{role}', [\App\Http\Controllers\Api\RoleController::class, 'destroy'])->name('roles.destroy');
    Route::post('/roles/bulk-delete', [\App\Http\Controllers\Api\RoleController::class, 'bulkDelete'])->name('roles.bulk-delete');

    Route::get('/permissions', [\App\Http\Controllers\Api\PermissionController::class, 'webIndex'])->name('permissions.index');
    Route::post('/permissions', [\App\Http\Controllers\Api\PermissionController::class, 'store'])->name('permissions.store');
    Route::put('/permissions/{permission}', [\App\Http\Controllers\Api\PermissionController::class, 'update'])->name('permissions.update');
    Route::delete('/permissions/{permission}', [\App\Http\Controllers\Api\PermissionController::class, 'destroy'])->name('permissions.destroy');
    Route::post('/permissions/bulk-delete', [\App\Http\Controllers\Api\PermissionController::class, 'bulkDelete'])->name('permissions.bulk-delete');
});

Route::get('/location-form', [\App\Http\Controllers\Api\LocationController::class, 'index'])->name('location.form');
    Route::get('/states/{country}', [LocationController::class, 'getStates'])->name('states.get');
    Route::get('/cities/{state}', [LocationController::class, 'getCities'])->name('cities.get');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';