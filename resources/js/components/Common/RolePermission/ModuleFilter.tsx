import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface ModuleFilterProps {
    modules: string[];
    selectedModule: string;
    onModuleChange: (module: string) => void;
}

export default function ModuleFilter({ modules, selectedModule, onModuleChange }: ModuleFilterProps) {
    return (
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedModule} onValueChange={onModuleChange}>
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
    );
}