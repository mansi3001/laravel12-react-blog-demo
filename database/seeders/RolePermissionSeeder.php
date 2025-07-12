<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create Permissions
        $permissions = [
            ['name' => 'View Users', 'slug' => 'users.view', 'module' => 'Users'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'module' => 'Users'],
            ['name' => 'Edit Users', 'slug' => 'users.edit', 'module' => 'Users'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'module' => 'Users'],
            
            ['name' => 'View Blogs', 'slug' => 'blogs.view', 'module' => 'Blogs'],
            ['name' => 'Create Blogs', 'slug' => 'blogs.create', 'module' => 'Blogs'],
            ['name' => 'Edit Blogs', 'slug' => 'blogs.edit', 'module' => 'Blogs'],
            ['name' => 'Delete Blogs', 'slug' => 'blogs.delete', 'module' => 'Blogs'],
            
            ['name' => 'View Roles', 'slug' => 'roles.view', 'module' => 'Roles'],
            ['name' => 'Create Roles', 'slug' => 'roles.create', 'module' => 'Roles'],
            ['name' => 'Edit Roles', 'slug' => 'roles.edit', 'module' => 'Roles'],
            ['name' => 'Delete Roles', 'slug' => 'roles.delete', 'module' => 'Roles'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['slug' => $permission['slug']], $permission);
        }

        // Create Roles
        $superAdminRole = Role::firstOrCreate(
            ['slug' => 'superadmin'],
            ['name' => 'Super Administrator', 'description' => 'Complete system control with all permissions']
        );

        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrator', 'description' => 'Full system access']
        );

        $editorRole = Role::firstOrCreate(
            ['slug' => 'editor'],
            ['name' => 'Editor', 'description' => 'Content management access']
        );

        $userRole = Role::firstOrCreate(
            ['slug' => 'user'],
            ['name' => 'User', 'description' => 'Basic user access']
        );

        // Assign permissions to roles
        $superAdminRole->permissions()->sync(Permission::all()->pluck('id'));
        $adminRole->permissions()->sync(Permission::whereNotIn('module', ['Roles'])->pluck('id'));
        $editorRole->permissions()->sync(Permission::whereIn('module', ['Blogs'])->pluck('id'));
        $userRole->permissions()->sync(Permission::where('slug', 'blogs.view')->pluck('id'));
    }
}