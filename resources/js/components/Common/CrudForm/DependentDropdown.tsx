import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DropdownField {
  name: string;
  label: string;
  options?: { value: string; label: string }[];
  dependencies?: Record<string, { value: string; label: string }[]>;
}

interface DependentDropdownProps {
  fields: DropdownField[];
  values: Record<string, string>;
  onChange: (fieldName: string, value: string) => void;
  disabled?: boolean;
}



export default function DependentDropdown({
  fields,
  values,
  onChange,
  disabled = false
}: DependentDropdownProps) {
  const [availableOptions, setAvailableOptions] = useState<Record<string, { value: string; label: string }[]>>({});

  // Initialize available options for dependent fields
  useEffect(() => {
    const newAvailableOptions: Record<string, { value: string; label: string }[]> = {};
    
    fields.forEach((field, index) => {
      if (index === 0) {
        // First field always has its own options
        newAvailableOptions[field.name] = field.options || [];
      } else {
        // Dependent fields need parent value
        const parentField = fields[index - 1];
        const parentValue = values[parentField.name];
        
        if (parentValue && field.dependencies) {
          newAvailableOptions[field.name] = field.dependencies[parentValue] || [];
        } else {
          newAvailableOptions[field.name] = [];
        }
      }
    });
    
    setAvailableOptions(newAvailableOptions);
  }, [fields, values]);

  const handleFieldChange = (fieldName: string, value: string, fieldIndex: number) => {
    onChange(fieldName, value);
    
    // Clear all dependent fields when parent changes
    fields.slice(fieldIndex + 1).forEach(dependentField => {
      onChange(dependentField.name, '');
    });
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
        
        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Select 
              value={values[field.name] || ''} 
              onValueChange={(value) => handleFieldChange(field.name, value, index)}
              disabled={isDisabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {fieldOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
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