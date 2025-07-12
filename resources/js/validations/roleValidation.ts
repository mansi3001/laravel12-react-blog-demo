import { RoleFormData, PermissionFormData } from '@/types/role';

export const validateRoleForm = (data: RoleFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
        errors.name = 'Role name is required';
    }

    if (!data.slug?.trim()) {
        errors.slug = 'Role slug is required';
    }

    if (data.permissions.length === 0) {
        errors.permissions = 'At least one permission is required';
    }

    return errors;
};

export const validatePermissionForm = (data: PermissionFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
        errors.name = 'Permission name is required';
    }

    if (!data.slug?.trim()) {
        errors.slug = 'Permission slug is required';
    }

    if (!data.module?.trim()) {
        errors.module = 'Module is required';
    }

    return errors;
};