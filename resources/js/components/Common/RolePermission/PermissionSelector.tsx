import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
}

interface PermissionSelectorProps {
    permissions: Permission[];
    selectedPermissions: number[];
    onPermissionChange: (permissionId: number, checked: boolean) => void;
    onSelectAllModule: (module: string, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
}

export default function PermissionSelector({
    permissions,
    selectedPermissions,
    onPermissionChange,
    onSelectAllModule,
    onSelectAll
}: PermissionSelectorProps) {
    // Group permissions by module
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const module = permission.module || 'General';
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    const isModuleSelected = (module: string) => {
        const modulePermissions = groupedPermissions[module].map(p => p.id);
        return modulePermissions.every(id => selectedPermissions.includes(id));
    };

    const isModulePartiallySelected = (module: string) => {
        const modulePermissions = groupedPermissions[module].map(p => p.id);
        return modulePermissions.some(id => selectedPermissions.includes(id)) && !isModuleSelected(module);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold">Permissions</Label>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="select-all"
                        checked={selectedPermissions.length === permissions.length}
                        onCheckedChange={onSelectAll}
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium">
                        Select All Permissions
                    </Label>
                </div>
            </div>
            
            <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                    <Card key={module}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium">{module}</CardTitle>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`module-${module}`}
                                        checked={isModuleSelected(module)}
                                        ref={(el) => {
                                            if (el) {
                                                el.indeterminate = isModulePartiallySelected(module);
                                            }
                                        }}
                                        onCheckedChange={(checked) => onSelectAllModule(module, checked as boolean)}
                                    />
                                    <Label htmlFor={`module-${module}`} className="text-xs">
                                        Select All {module}
                                    </Label>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                {modulePermissions.map(permission => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={selectedPermissions.includes(permission.id)}
                                            onCheckedChange={(checked) => onPermissionChange(permission.id, checked as boolean)}
                                        />
                                        <Label htmlFor={`permission-${permission.id}`} className="text-sm">
                                            {permission.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}