export interface Role {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
}

export interface Permission {
    id: number;
    name: string;
    slug: string;
    description: string;
    module: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface RoleFormData {
    name: string;
    slug: string;
    description: string;
    permissions: number[];
    is_active: boolean;
}

export interface PermissionFormData {
    name: string;
    slug: string;
    description: string;
    module: string;
    is_active: boolean;
}

export interface RoleFilters {
    status: string;
    module: string;
    date_from: string;
    date_to: string;
}