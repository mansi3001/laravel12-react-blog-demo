import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Key, Copy } from 'lucide-react';
import CrudTable from '@/components/Common/CrudTable';
import CrudForm from '@/components/Common/CrudForm';
import ConfirmDialog from '@/components/Common/ConfirmDialog';
import PermissionGridView from '@/components/Common/RolePermission/PermissionGridView';
import { Permission, PermissionFormData } from '@/types/role';
import { TableColumn, FormField } from '@/types/common';
import useCrudTable from '@/hooks/useCrudTable';
import { validatePermissionForm } from '@/validations/roleValidation';
import { getUniqueModules, filterPermissionsByModule } from '@/utils/rolePermissionUtils';

interface PermissionIndexProps {
    permissions: {
        data: Permission[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    auth: {
        user: {
            permissions: string[];
        };
    };
}

export default function PermissionIndex({ permissions, auth }: PermissionIndexProps) {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'bulk', id?: number, ids?: number[] } | null>(null);
    const [moduleFilter, setModuleFilter] = useState('all');

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
    } = useCrudTable({ routeName: 'permissions.index', viewMode });

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm<PermissionFormData>({
        name: '',
        slug: '',
        description: '',
        module: '',
        is_active: true
    });

    // Permission checks
    const canCreate = auth.user.permissions.includes('permissions.create');
    const canEdit = auth.user.permissions.includes('permissions.edit');
    const canDelete = auth.user.permissions.includes('permissions.delete');
    const canView = auth.user.permissions.includes('permissions.view');

    // Get unique modules and filter permissions
    const modules = getUniqueModules(permissions.data);
    const filteredPermissions = filterPermissionsByModule(permissions.data, moduleFilter);

    const handleViewToggle = (mode: 'table' | 'grid') => {
        setViewMode(mode);
        handleViewModeChange(mode);
    };

    const handleCreate = () => {
        if (!canCreate) return;
        setModalMode('create');
        setEditingPermission(null);
        reset();
        setShowModal(true);
    };

    const handleEdit = (permission: Permission) => {
        if (!canEdit) return;
        setModalMode('edit');
        setEditingPermission(permission);
        setShowModal(true);
    };

    const handleView = (permission: Permission) => {
        if (!canView) return;
        setModalMode('view');
        setEditingPermission(permission);
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
            router.delete(`/permissions/${deleteTarget.id}`);
        } else if (deleteTarget?.type === 'bulk' && deleteTarget.ids) {
            router.post('/permissions/bulk-delete', { ids: deleteTarget.ids }, {
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
            module: formData.module || '',
            is_active: formData.is_active !== undefined ? formData.is_active : true
        };
        
        if (modalMode === 'create') {
            router.post('/permissions', submitData, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    clearErrors();
                    setIsSubmitting(false);
                },
                onError: () => setIsSubmitting(false)
            });
        } else if (editingPermission) {
            router.put(`/permissions/${editingPermission.id}`, submitData, {
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
            label: 'Permission Name',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-green-500" />
                    <div>
                        <div className="font-medium">{value}</div>
                        <div className="text-sm text-gray-500">{row.slug}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'module',
            label: 'Module',
            sortable: true,
            render: (value) => (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {value || 'General'}
                </Badge>
            )
        },
        {
            key: 'description',
            label: 'Description',
            render: (value) => value || 'No description'
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
            label: 'Permission Name',
            type: 'text',
            required: true,
            placeholder: 'Enter permission name',
            column: 2
        },
        {
            name: 'slug',
            label: 'Permission Slug',
            type: 'text',
            required: true,
            placeholder: 'Enter permission slug'
        },
        {
            name: 'module',
            label: 'Module',
            type: 'select',
            required: true,
            options: [
                { value: 'Users', label: 'Users' },
                { value: 'Blogs', label: 'Blogs' },
                { value: 'Roles', label: 'Roles' },
                { value: 'Settings', label: 'Settings' },
                { value: 'Reports', label: 'Reports' }
            ],
            placeholder: 'Select module'
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Enter permission description',
            column: 2
        },
        {
            name: 'is_active',
            label: 'Active Status',
            type: 'switch'
        }
    ];

    return (
        <AppLayout>
            <Head title="Permissions" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Permissions</h1>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => handleViewToggle(viewMode === 'table' ? 'grid' : 'table')}>
                            {viewMode === 'table' ? 'Grid View' : 'Table View'}
                        </Button>
                        {canCreate && (
                            <Button onClick={handleCreate}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Permission
                            </Button>
                        )}
                    </div>
                </div>

                {/* Module Filter */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Select value={moduleFilter} onValueChange={setModuleFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by Module" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Modules</SelectItem>
                            {modules.map(module => (
                                <SelectItem key={module} value={module}>{module}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {viewMode === 'table' ? (
                    <CrudTable
                        data={filteredPermissions || []}
                        columns={columns}
                        config={{
                            search: true,
                            export: canView,
                            bulkActions: canDelete,
                            pagination: true,
                            sorting: true
                        }}
                        customActions={[
                            {
                                label: 'Duplicate',
                                icon: <Copy className="h-4 w-4" />,
                                onClick: (permission) => {
                                    if (canCreate) {
                                        router.post('/permissions', {
                                            ...permission,
                                            name: `${permission.name} (Copy)`,
                                            slug: `${permission.slug}-copy`
                                        });
                                    }
                                },
                                variant: 'outline',
                                show: () => canCreate
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
                        pagination={{
                            current: permissions.meta?.current_page || 1,
                            total: permissions.meta?.total || 0,
                            perPage: currentPerPage,
                            lastPage: permissions.meta?.last_page || 1,
                            onPageChange: handlePageChange,
                            onPerPageChange: handlePerPageChange,
                            perPageOptions: getPerPageOptions()
                        }}
                    />
                ) : (
                    <PermissionGridView
                        permissions={filteredPermissions}
                        onEdit={canEdit ? handleEdit : () => {}}
                    />
                )}

                <CrudForm
                    isOpen={showModal}
                    onClose={() => {
                        if (!isSubmitting) {
                            setShowModal(false);
                            setEditingPermission(null);
                            reset();
                            clearErrors();
                        }
                        setIsSubmitting(false);
                    }}
                    title={modalMode === 'create' ? 'Create Permission' : modalMode === 'edit' ? 'Edit Permission' : 'View Permission'}
                    fields={formFields}
                    data={(modalMode === 'edit' || modalMode === 'view') && editingPermission ? {
                        name: editingPermission.name || '',
                        slug: editingPermission.slug || '',
                        description: editingPermission.description || '',
                        module: editingPermission.module || '',
                        is_active: editingPermission.is_active !== undefined ? Boolean(editingPermission.is_active) : true
                    } : undefined}
                    errors={errors}
                    onSubmit={handleSubmit}
                    layout="grid"
                    modalSize="3xl"
                    columns={2}
                    mode={modalMode}
                    customValidator={validatePermissionForm}
                    loading={isSubmitting}
                />

                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => {
                        setShowDeleteDialog(false);
                        setDeleteTarget(null);
                    }}
                    onConfirm={confirmDelete}
                    title={deleteTarget?.type === 'bulk' ? 'Delete Multiple Permissions' : 'Delete Permission'}
                    description={
                        deleteTarget?.type === 'bulk'
                            ? `Are you sure you want to delete ${deleteTarget.ids?.length} permissions? This action cannot be undone.`
                            : 'Are you sure you want to delete this permission? This action cannot be undone.'
                    }
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </div>
        </AppLayout>
    );
}