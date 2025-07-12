import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Shield, Copy } from 'lucide-react';
import CrudTable from '@/components/Common/CrudTable';
import CrudForm from '@/components/Common/CrudForm';
import ConfirmDialog from '@/components/Common/ConfirmDialog';
import { Role, Permission, RoleFormData, RoleFilters } from '@/types/role';
import { TableColumn, FormField } from '@/types/common';
import useCrudTable from '@/hooks/useCrudTable';
import { validateRoleForm } from '@/validations/roleValidation';

interface RoleIndexProps {
    roles: {
        data: Role[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    permissions: Permission[];
    auth: {
        user: {
            permissions: string[];
        };
    };
}

export default function RoleIndex({ roles, permissions, auth }: RoleIndexProps) {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'bulk', id?: number, ids?: number[] } | null>(null);
    const [filters, setFilters] = useState<RoleFilters>({
        status: 'all',
        module: 'all',
        date_from: '',
        date_to: ''
    });

    const {
        selectedIds,
        setSelectedIds,
        currentPerPage,
        handleSearch,
        handleSort,
        handlePageChange,
        handlePerPageChange,
        handleReset,
        handleExport,
        getPerPageOptions,
        handleViewModeChange,
        applyFilter
    } = useCrudTable({ routeName: 'roles.index', viewMode });

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm<RoleFormData>({
        name: '',
        slug: '',
        description: '',
        permissions: [],
        is_active: true
    });

    // Permission checks
    const canCreate = auth.user.permissions.includes('roles.create');
    const canEdit = auth.user.permissions.includes('roles.edit');
    const canDelete = auth.user.permissions.includes('roles.delete');
    const canView = auth.user.permissions.includes('roles.view');

    // Get unique modules for filtering
    const modules = [...new Set(permissions.map(p => p.module).filter(Boolean))];

    const handleViewToggle = (mode: 'table' | 'grid') => {
        setViewMode(mode);
        handleViewModeChange(mode);
    };

    const handleLocalReset = () => {
        setFilters({
            status: 'all',
            module: 'all',
            date_from: '',
            date_to: ''
        });
        handleReset();
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        const filterValue = value === 'all' ? '' : value;
        applyFilter({ [key]: filterValue, page: 1 });
    };

    const handleCreate = () => {
        if (!canCreate) return;
        setModalMode('create');
        setEditingRole(null);
        reset();
        setShowModal(true);
    };

    const handleEdit = (role: Role) => {
        if (!canEdit) return;
        setModalMode('edit');
        setEditingRole(role);
        setShowModal(true);
    };

    const handleView = (role: Role) => {
        if (!canView) return;
        setModalMode('view');
        setEditingRole(role);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (!canDelete) return;
        setDeleteTarget({ type: 'single', id });
        setShowDeleteDialog(true);
    };

    const handleBulkDelete = (ids: number[]) => {
        if (!canDelete) return;
        setDeleteTarget({ type: 'bulk', ids });
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (deleteTarget?.type === 'single' && deleteTarget.id) {
            router.delete(`/roles/${deleteTarget.id}`);
        } else if (deleteTarget?.type === 'bulk' && deleteTarget.ids) {
            router.post('/roles/bulk-delete', { ids: deleteTarget.ids }, {
                onSuccess: () => setSelectedIds([])
            });
        }
        setDeleteTarget(null);
    };

    const handleSubmit = async (formData: Record<string, any>) => {
        setIsSubmitting(true);
        
        const submitData = {
            name: formData.name || '',
            slug: formData.slug || '',
            description: formData.description || '',
            permissions: formData.permissions || [],
            is_active: formData.is_active !== undefined ? formData.is_active : true
        };
        
        if (modalMode === 'create') {
            router.post('/roles', submitData, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    clearErrors();
                    setIsSubmitting(false);
                },
                onError: () => setIsSubmitting(false)
            });
        } else if (editingRole) {
            router.put(`/roles/${editingRole.id}`, submitData, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    clearErrors();
                    setIsSubmitting(false);
                },
                onError: () => setIsSubmitting(false)
            });
        }
    };

    const columns: TableColumn[] = [
        {
            key: 'name',
            label: 'Role Name',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <div>
                        <div className="font-medium">{value}</div>
                        <div className="text-sm text-gray-500">{row.slug}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'description',
            label: 'Description',
            render: (value) => value || 'No description'
        },
        {
            key: 'permissions',
            label: 'Permissions',
            render: (value) => (
                <div className="flex flex-wrap gap-1">
                    {value?.slice(0, 3).map((permission: Permission) => (
                        <Badge key={permission.id} variant="outline" className="text-xs">
                            {permission.name}
                        </Badge>
                    ))}
                    {value?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{value.length - 3} more
                        </Badge>
                    )}
                </div>
            )
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (value) => (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                </Badge>
            )
        },
        {
            key: 'created_at',
            label: 'Created',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString()
        }
    ];

    const formFields: FormField[] = [
        {
            name: 'name',
            label: 'Role Name',
            type: 'text',
            required: true,
            placeholder: 'Enter role name',
            column: 2
        },
        {
            name: 'slug',
            label: 'Role Slug',
            type: 'text',
            required: true,
            placeholder: 'Enter role slug'
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Enter role description',
            column: 2
        },
        {
            name: 'is_active',
            label: 'Active Status',
            type: 'switch'
        },
        {
            name: 'permissions',
            label: 'Permissions',
            type: 'custom',
            column: 2,
            render: (value, onChange, mode) => {
                const groupedPermissions = permissions.reduce((acc, permission) => {
                    const module = permission.module || 'General';
                    if (!acc[module]) acc[module] = [];
                    acc[module].push(permission);
                    return acc;
                }, {} as Record<string, Permission[]>);

                const handleSelectAll = (checked: boolean) => {
                    onChange(checked ? permissions.map(p => p.id) : []);
                };

                const handleSelectModule = (module: string, checked: boolean) => {
                    const modulePermissions = groupedPermissions[module].map(p => p.id);
                    if (checked) {
                        onChange([...new Set([...value, ...modulePermissions])]);
                    } else {
                        onChange(value.filter(id => !modulePermissions.includes(id)));
                    }
                };

                const isModuleSelected = (module: string) => {
                    const modulePermissions = groupedPermissions[module].map(p => p.id);
                    return modulePermissions.every(id => value.includes(id));
                };

                const isModulePartiallySelected = (module: string) => {
                    const modulePermissions = groupedPermissions[module].map(p => p.id);
                    return modulePermissions.some(id => value.includes(id)) && !isModuleSelected(module);
                };

                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <Label className="font-semibold">All Permissions</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={value.length === permissions.length}
                                    onCheckedChange={handleSelectAll}
                                    disabled={mode === 'view'}
                                />
                                <Label className="text-sm">Select All</Label>
                            </div>
                        </div>
                        
                        {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                            <div key={module} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <Label className="font-medium text-blue-700">{module} Module</Label>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={isModuleSelected(module)}
                                            ref={(el) => {
                                                if (el) el.indeterminate = isModulePartiallySelected(module);
                                            }}
                                            onCheckedChange={(checked) => handleSelectModule(module, checked as boolean)}
                                            disabled={mode === 'view'}
                                        />
                                        <Label className="text-sm">Select All {module}</Label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {modulePermissions.map(permission => (
                                        <div key={permission.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={value.includes(permission.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        onChange([...value, permission.id]);
                                                    } else {
                                                        onChange(value.filter(id => id !== permission.id));
                                                    }
                                                }}
                                                disabled={mode === 'view'}
                                            />
                                            <Label className="text-sm">{permission.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            }
        }
    ];

    return (
        <AppLayout>
            <Head title="Roles" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Roles</h1>
                    {canCreate && (
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Role
                        </Button>
                    )}
                </div>

                <CrudTable
                    data={roles.data || []}
                    columns={columns}
                    config={{
                        search: true,
                        filters: true,
                        export: canView,
                        bulkActions: canDelete,
                        viewToggle: true,
                        columnSettings: true,
                        pagination: true,
                        sorting: true
                    }}
                    viewMode={viewMode}
                    onViewModeChange={handleViewToggle}
                    customActions={[
                        {
                            label: 'Duplicate',
                            icon: <Copy className="h-4 w-4" />,
                            onClick: (role) => {
                                if (canCreate) {
                                    router.post('/roles', {
                                        ...role,
                                        name: `${role.name} (Copy)`,
                                        slug: `${role.slug}-copy`
                                    });
                                }
                            },
                            variant: 'outline',
                            show: canCreate
                        }
                    ]}
                    loading={processing}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={canEdit ? handleEdit : undefined}
                    onView={canView ? handleView : undefined}
                    onDelete={canDelete ? handleDelete : undefined}
                    onBulkDelete={canDelete ? handleBulkDelete : undefined}
                    onSearch={handleSearch}
                    onSort={handleSort}
                    onExport={handleExport}
                    onReset={handleLocalReset}
                    filters={
                        <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Select value={filters.module} onValueChange={(value) => handleFilterChange('module', value)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Module" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Modules</SelectItem>
                                    {modules.map(module => (
                                        <SelectItem key={module} value={module}>{module}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            <Input
                                type="date"
                                placeholder="From Date"
                                value={filters.date_from}
                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                className="w-40"
                            />
                            
                            <Input
                                type="date"
                                placeholder="To Date"
                                value={filters.date_to}
                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                className="w-40"
                            />
                        </div>
                    }
                    pagination={{
                        current: roles.meta?.current_page || 1,
                        total: roles.meta?.total || 0,
                        perPage: currentPerPage,
                        lastPage: roles.meta?.last_page || 1,
                        onPageChange: handlePageChange,
                        onPerPageChange: handlePerPageChange,
                        perPageOptions: getPerPageOptions()
                    }}
                />

                <CrudForm
                    isOpen={showModal}
                    onClose={() => {
                        if (!isSubmitting) {
                            setShowModal(false);
                            setEditingRole(null);
                            reset();
                            clearErrors();
                        }
                        setIsSubmitting(false);
                    }}
                    title={modalMode === 'create' ? 'Create Role' : modalMode === 'edit' ? 'Edit Role' : 'View Role'}
                    fields={formFields}
                    data={(modalMode === 'edit' || modalMode === 'view') && editingRole ? {
                        name: editingRole.name || '',
                        slug: editingRole.slug || '',
                        description: editingRole.description || '',
                        permissions: editingRole.permissions?.map(p => p.id) || [],
                        is_active: editingRole.is_active !== undefined ? Boolean(editingRole.is_active) : true
                    } : undefined}
                    errors={errors}
                    onSubmit={handleSubmit}
                    layout="grid"
                    modalSize="5xl"
                    columns={2}
                    mode={modalMode}
                    customValidator={validateRoleForm}
                    loading={isSubmitting}
                />

                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => {
                        setShowDeleteDialog(false);
                        setDeleteTarget(null);
                    }}
                    onConfirm={confirmDelete}
                    title={deleteTarget?.type === 'bulk' ? 'Delete Multiple Roles' : 'Delete Role'}
                    description={
                        deleteTarget?.type === 'bulk'
                            ? `Are you sure you want to delete ${deleteTarget.ids?.length} roles? This action cannot be undone.`
                            : 'Are you sure you want to delete this role? This action cannot be undone.'
                    }
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </div>
        </AppLayout>
    );
}