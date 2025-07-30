import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

interface DropdownField {
    name: string;
    label: string;
    options?: { value: string; label: string }[];
    dependencies?: Record<string, { value: string; label: string }[]>;
    apiEndpoint?: string;
}

interface DependentDropdownProps {
    fields: DropdownField[];
    values: Record<string, string>;
    onChange: (fieldName: string, value: string, additionalData?: any) => void;
    disabled?: boolean;
}

export default function DependentDropdown({ fields, values, onChange, disabled = false }: DependentDropdownProps) {
    const [availableOptions, setAvailableOptions] = useState<Record<string, { value: string; label: string }[]>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    // Load options from API
    const loadOptionsFromAPI = async (field: DropdownField, parentValue?: string) => {
        if (!field.apiEndpoint) return [];

        setLoading((prev) => ({ ...prev, [field.name]: true }));

        try {
            let endpoint = field.apiEndpoint;
            if (parentValue) {
                // Replace placeholder with actual value
                const parentFieldName = fields[fields.indexOf(field) - 1]?.name;
                if (parentFieldName) {
                    endpoint = endpoint.replace(`{${parentFieldName}}`, parentValue);
                }
            }

            console.log(`Loading ${field.name} from:`, endpoint);
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Transform API response to options format
            const options = Array.isArray(data)
                ? data.map((item) => ({
                      value: String(item.id || item.value),
                      label: item.name || item.label,
                  }))
                : [];

            return options;
        } catch (error) {
            console.error(`Error loading options for ${field.name}:`, error);
            return [];
        } finally {
            setLoading((prev) => ({ ...prev, [field.name]: false }));
        }
    };

    // Initialize available options for dependent fields
    useEffect(() => {
        const loadAllOptions = async () => {
            const newAvailableOptions: Record<string, { value: string; label: string }[]> = {};

            for (let index = 0; index < fields.length; index++) {
                const field = fields[index];

                if (index === 0) {
                    // First field - load from API or use static options
                    if (field.apiEndpoint) {
                        newAvailableOptions[field.name] = await loadOptionsFromAPI(field);
                    } else {
                        newAvailableOptions[field.name] = field.options || [];
                    }
                } else {
                    // Dependent fields need parent value
                    const parentField = fields[index - 1];
                    const parentValue = values[parentField.name];

                    if (parentValue) {
                        if (field.apiEndpoint) {
                            newAvailableOptions[field.name] = await loadOptionsFromAPI(field, parentValue);
                        } else if (field.dependencies) {
                            newAvailableOptions[field.name] = field.dependencies[parentValue] || [];
                        } else {
                            newAvailableOptions[field.name] = [];
                        }
                    } else {
                        newAvailableOptions[field.name] = [];
                    }
                }
            }

            setAvailableOptions(newAvailableOptions);
        };

        loadAllOptions();
    }, [fields, JSON.stringify(values)]);

    const handleFieldChange = async (fieldName: string, value: string, fieldIndex: number) => {
        // Clear all dependent fields when parent changes
        fields.slice(fieldIndex + 1).forEach((dependentField) => {
            onChange(dependentField.name, '');
        });

        // Get selected field info for the callback
        const currentField = fields.find((f) => f.name === fieldName);
        const currentFieldOptions = availableOptions[fieldName] || currentField?.options || [];
        const selectedItem = currentFieldOptions.find((opt) => opt.value == value || String(opt.value) === String(value));
        const selectedInfo = selectedItem ? { id: value, name: selectedItem.label } : null;
        console.log({ currentField, currentFieldOptions, selectedItem, selectedInfo, value, valueType: typeof value });
        // Load options for the next dependent field immediately
        const nextField = fields[fieldIndex + 1];
        if (nextField && value) {
            if (nextField.apiEndpoint) {
                const options = await loadOptionsFromAPI(nextField, value);
                setAvailableOptions((prev) => ({
                    ...prev,
                    [nextField.name]: options,
                }));

                // Pass selected info with loaded options
                onChange(fieldName, value, { selectedInfo, loadedOptions: options });
                return;
            } else if (nextField.dependencies) {
                const dependentOptions = nextField.dependencies![value] || [];
                setAvailableOptions((prev) => ({
                    ...prev,
                    [nextField.name]: dependentOptions,
                }));

                // Pass selected info with dependent options
                onChange(fieldName, value, { selectedInfo, loadedOptions: dependentOptions });
                return;
            }
        }

        // Update the field value with selected info (for fields without dependents)
        onChange(fieldName, value, { selectedInfo, loadedOptions: [] });
    };

    const getGridCols = () => {
        const count = fields.length;
        if (count <= 2) return 'grid-cols-2';
        if (count <= 3) return 'grid-cols-3';
        if (count <= 4) return 'grid-cols-4';
        return 'grid-cols-5';
    };

    return (
        <div className={`grid gap-4 ${getGridCols()}`}>
            {fields.map((field, index) => {
                const isFirstField = index === 0;
                const parentField = isFirstField ? null : fields[index - 1];
                const isDisabled = disabled || (!isFirstField && !values[parentField!.name]);
                const fieldOptions = availableOptions[field.name] || [];

                const isLoading = loading[field.name];

                return (
                    <div key={field.name} className="space-y-2">
                        <Label>{field.label}</Label>
                        <Select
                            value={String(values[field.name] || '')}
                            onValueChange={(value) => handleFieldChange(field.name, value, index)}
                            disabled={isDisabled || isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={isLoading ? 'Loading...' : `Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {fieldOptions.map((option) => (
                                    <SelectItem key={option.value} value={String(option.value)}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            })}
        </div>
    );
}
