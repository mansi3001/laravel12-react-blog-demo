<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShareAuthData
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check()) {
            Inertia::share([
                'auth' => [
                    'user' => [
                        'id' => auth()->user()->id,
                        'name' => auth()->user()->name,
                        'email' => auth()->user()->email,
                        'permissions' => auth()->user()->isSuperAdmin() 
                            ? \App\Models\Permission::pluck('slug')->values()
                            : auth()->user()->roles()->with('permissions')->get()
                                ->pluck('permissions')->flatten()->pluck('slug')->unique()->values()
                    ]
                ]
            ]);
        }

        return $next($request);
    }
}