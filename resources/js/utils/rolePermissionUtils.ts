import { TableColumn } from '@/types/common';

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
    is_active: boolean;
}

interface Role {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    permissions: Permission[];
}

export const getRoleColumns = (): TableColumn[] => [
    {
        key: 'name',
        label: 'Role Name',
        sortable: true
    },
    {
        key: 'description',
        label: 'Description'
    },
    {
        key: 'permissions',
        label: 'Permissions'
    },
    {
        key: 'is_active',
        label: 'Status',
        sortable: true
    }
];

export const getPermissionColumns = (): TableColumn[] => [
    {
        key: 'name',
        label: 'Permission Name',
        sortable: true
    },
    {
        key: 'module',
        label: 'Module',
        sortable: true
    },
    {
        key: 'description',
        label: 'Description'
    },
    {
        key: 'is_active',
        label: 'Status',
        sortable: true
    }
];

export const getUniqueModules = (permissions: Permission[]): string[] => {
    return [...new Set(permissions.map(p => p.module).filter(Boolean))];
};

export const filterPermissionsByModule = (permissions: Permission[], module: string): Permission[] => {
    return module === 'all' ? permissions : permissions.filter(p => p.module === module);
};

export const groupPermissionsByModule = (permissions: Permission[]): Record<string, Permission[]> => {
    return permissions.reduce((acc, permission) => {
        const module = permission.module || 'General';
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);
};