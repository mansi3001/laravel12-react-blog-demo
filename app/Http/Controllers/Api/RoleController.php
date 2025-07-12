<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function webIndex()
    {
        // Check permission
        if (!auth()->user()->hasPermission('roles.view')) {
            return Inertia::render('Errors/403');
        }

        $roles = Role::with('permissions')->paginate(10);
        $permissions = Permission::active()->get();
        
        return Inertia::render('Role/Index', [
            'roles' => $roles,
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
        if (!auth()->user()->hasPermission('roles.create')) {
            return Inertia::render('Errors/403');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:roles',
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
            'is_active' => 'boolean'
        ]);

        $role = Role::create($validated);
        
        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Role created successfully');
    }

    public function update(Request $request, Role $role)
    {
        // Check permission
        if (!auth()->user()->hasPermission('roles.edit')) {
            return Inertia::render('Errors/403');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:roles,slug,' . $role->id,
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
            'is_active' => 'boolean'
        ]);

        $role->update($validated);
        
        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Role updated successfully');
    }

    public function destroy(Role $role)
    {
        // Check permission
        if (!auth()->user()->hasPermission('roles.delete')) {
            return Inertia::render('Errors/403');
        }

        $role->delete();
        return redirect()->back()->with('success', 'Role deleted successfully');
    }

    public function bulkDelete(Request $request)
    {
        // Check permission
        if (!auth()->user()->hasPermission('roles.delete')) {
            return Inertia::render('Errors/403');
        }

        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:roles,id'
        ]);

        Role::whereIn('id', $validated['ids'])->delete();
        
        return redirect()->back()->with('success', 'Roles deleted successfully');
    }
}