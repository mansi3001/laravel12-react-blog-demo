<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function webIndex()
    {
        // Check permission
        if (!auth()->user()->hasPermission('permissions.view')) {
            return Inertia::render('Errors/403');
        }

        $permissions = Permission::paginate(10);
        
        return Inertia::render('Permission/Index', [
            'permissions' => $permissions,
            'auth' => [
                'user' => [
                    'permissions' => auth()->user()->isSuperAdmin() 
                        ? Permission::pluck('slug')->values()
                        : auth()->user()->roles()->with('permissions')->get()
                            ->pluck('permissions')->flatten()->pluck('slug')->unique()->values()
                ]
            ]
        ]);
    }

    public function store(Request $request)
    {
        // Check permission
        if (!auth()->user()->hasPermission('permissions.create')) {
            return Inertia::render('Errors/403');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:permissions',
            'description' => 'nullable|string',
            'module' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        Permission::create($validated);

        return redirect()->back()->with('success', 'Permission created successfully');
    }

    public function update(Request $request, Permission $permission)
    {
        // Check permission
        if (!auth()->user()->hasPermission('permissions.edit')) {
            return Inertia::render('Errors/403');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:permissions,slug,' . $permission->id,
            'description' => 'nullable|string',
            'module' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        $permission->update($validated);

        return redirect()->back()->with('success', 'Permission updated successfully');
    }

    public function destroy(Permission $permission)
    {
        // Check permission
        if (!auth()->user()->hasPermission('permissions.delete')) {
            return Inertia::render('Errors/403');
        }

        $permission->delete();
        return redirect()->back()->with('success', 'Permission deleted successfully');
    }

    public function bulkDelete(Request $request)
    {
        // Check permission
        if (!auth()->user()->hasPermission('permissions.delete')) {
            return Inertia::render('Errors/403');
        }

        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:permissions,id'
        ]);

        Permission::whereIn('id', $validated['ids'])->delete();
        
        return redirect()->back()->with('success', 'Permissions deleted successfully');
    }
}