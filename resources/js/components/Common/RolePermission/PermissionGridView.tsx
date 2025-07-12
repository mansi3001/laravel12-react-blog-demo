import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
    slug: string;
    module: string;
    is_active: boolean;
}

interface PermissionGridViewProps {
    permissions: Permission[];
    onEdit: (permission: Permission) => void;
}

export default function PermissionGridView({ permissions, onEdit }: PermissionGridViewProps) {
    // Group permissions by module
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const module = permission.module || 'General';
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                <Card key={module}>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Key className="h-5 w-5 text-green-500" />
                            <span>{module}</span>
                            <Badge variant="secondary" className="ml-auto">
                                {modulePermissions.length}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {modulePermissions.map(permission => (
                                <div key={permission.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
                                    <div>
                                        <div className="font-medium text-sm">{permission.name}</div>
                                        <div className="text-xs text-gray-500">{permission.slug}</div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Badge variant={permission.is_active ? 'default' : 'secondary'} className="text-xs">
                                            {permission.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                        <Button size="sm" variant="ghost" onClick={() => onEdit(permission)}>
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}