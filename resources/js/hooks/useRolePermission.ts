import { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
}

interface UseRolePermissionProps {
    permissions: Permission[];
}

export function useRolePermission({ permissions }: UseRolePermissionProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Group permissions by module
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const module = permission.module || 'General';
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    // Get unique modules
    const modules = [...new Set(permissions.map(p => p.module).filter(Boolean))];

    const handleSelectAllModule = (module: string, checked: boolean, currentPermissions: number[], setData: any) => {
        const modulePermissions = groupedPermissions[module].map(p => p.id);
        if (checked) {
            setData('permissions', [...new Set([...currentPermissions, ...modulePermissions])]);
        } else {
            setData('permissions', currentPermissions.filter(id => !modulePermissions.includes(id)));
        }
    };

    const handleSelectAllPermissions = (checked: boolean, setData: any) => {
        if (checked) {
            setData('permissions', permissions.map(p => p.id));
        } else {
            setData('permissions', []);
        }
    };

    const handlePermissionChange = (permissionId: number, checked: boolean, currentPermissions: number[], setData: any) => {
        if (checked) {
            setData('permissions', [...currentPermissions, permissionId]);
        } else {
            setData('permissions', currentPermissions.filter(id => id !== permissionId));
        }
    };

    const isModuleSelected = (module: string, currentPermissions: number[]) => {
        const modulePermissions = groupedPermissions[module].map(p => p.id);
        return modulePermissions.every(id => currentPermissions.includes(id));
    };

    const isModulePartiallySelected = (module: string, currentPermissions: number[]) => {
        const modulePermissions = groupedPermissions[module].map(p => p.id);
        return modulePermissions.some(id => currentPermissions.includes(id)) && !isModuleSelected(module, currentPermissions);
    };

    return {
        selectedIds,
        setSelectedIds,
        isOpen,
        setIsOpen,
        editingItem,
        setEditingItem,
        groupedPermissions,
        modules,
        handleSelectAllModule,
        handleSelectAllPermissions,
        handlePermissionChange,
        isModuleSelected,
        isModulePartiallySelected
    };
}