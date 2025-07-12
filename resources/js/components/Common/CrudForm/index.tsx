import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormField } from '@/types/common';
import { Loader2, X, Upload } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import DependentDropdown from './DependentDropdown';
import MultiSelect from '../MultiSelect';
import { ValidationRule, ValidationResult } from '@/lib/validation';

interface CrudFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  data?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  layout?: 'single' | 'double' | 'triple' | 'grid';
  modalSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  columns?: number;
  loading?: boolean;
  mode?: 'create' | 'edit' | 'view';
  validationRules?: Record<string, ValidationRule[]>;
  customValidator?: (data: Record<string, any>) => ValidationResult;
}

function CrudForm({
  isOpen,
  onClose,
  title,
  fields,
  data,
  onSubmit,
  layout = 'single',
  modalSize = 'lg',
  columns = 3,
  loading = false,
  mode = 'create',
  validationRules,
  customValidator
}: CrudFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { errors } = usePage().props as any;

  // Clear form data when dialog closes and hide errors when dialog opens
  useEffect(() => {
    if (!isOpen) {
      // Clear form data when modal closes
      setFormData({});
      setSelectedTags([]);
      setShowErrors(false);
      setValidationErrors({});
    } else if (!Object.keys(formData).length) {
      // Only hide errors when modal opens, don't clear existing form data
      setShowErrors(false);
      setValidationErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    // Use custom validator if provided
    if (customValidator) {
      const result = customValidator(formData);
      return result.errors;
    }
    
    // Use validation rules if provided
    if (validationRules) {
      const { validator } = require('@/lib/validation');
      const result = validator.validate(formData, validationRules);
      return result.errors;
    }
    
    // Fallback to basic validation
    const errors: Record<string, string> = {};
    fields.forEach(field => {
      const value = formData[field.name];
      if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors[field.name] = `${field.label} is required`;
      }
    });
    return errors;
  };

  useEffect(() => {
    if (isOpen && !loading) {
      if (data) {
        setFormData(data);
        if (data.tags) {
          setSelectedTags(Array.isArray(data.tags) ? data.tags : []);
        }
      } else if (!Object.keys(formData).length) {
        const initialData: Record<string, any> = {};
        fields.forEach(field => {
          if (field.type === 'checkbox' || field.type === 'switch') {
            initialData[field.name] = false;
          } else if (field.type === 'multi-select') {
            initialData[field.name] = [];
          } else {
            initialData[field.name] = '';
          }
        });
         
        setFormData(initialData);
        setSelectedTags([]);
      }
    }
  }, [data, fields, isOpen, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    
    // Frontend validation
    const frontendErrors = validateForm();
    if (Object.keys(frontendErrors).length > 0) {
      setValidationErrors(frontendErrors);
      setShowErrors(true);
      return;
    }
    
    const submitData = { ...formData };
    // Always include tags, even if empty
    submitData.tags = selectedTags;

    try {
      await onSubmit(submitData);
    } catch (error) {
      // Show errors after submission attempt
      setShowErrors(true);
      console.log('Form submission error:', error);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(tagInput.trim())) {
        setSelectedTags([...selectedTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = showErrors ? (validationErrors[field.name] || errors[field.name]) : null;
    const isDisabled = mode === 'view';

    const commonProps = {
      id: field.name,
      name: field.name,
      placeholder: field.placeholder,
      disabled: isDisabled,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
            className={error ? 'border-red-500' : ''}
            rows={4}
          />
        );

      case 'select':
        if (mode === 'view') {
          const selectedOption = field.options?.find(opt => String(opt.value) === String(value));
          return (
            <div className="rounded-md border bg-gray-50 p-2">
              {selectedOption?.label || value || '-'}
            </div>
          );
        }
        return (
          <Select
            value={String(value || '')}
            onValueChange={(val) => setFormData(prev => ({ ...prev, [field.name]: val }))}
            disabled={isDisabled}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi-select':
        if (field.name === 'tags') {
          return (
            <div className="space-y-2">
              <Input
                placeholder="Type and press Enter to add tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                disabled={isDisabled}
                className={error ? 'border-red-500' : ''}
              />
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    {!isDisabled && (
                      <button
                        type="button"
                        className="ml-1 h-3 w-3 rounded-full outline-none hover:bg-gray-300"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleTagRemove(tag);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          );
        } else if (field.options) {
          const selectedValues = Array.isArray(value) ? value : [];
          return (
            <MultiSelect
              options={field.options.map(opt => ({ value: String(opt.value), label: opt.label }))}
              value={selectedValues.map(String)}
              onChange={(newValues) => setFormData(prev => ({ ...prev, [field.name]: newValues }))}
              placeholder={field.placeholder || `Select ${field.label.toLowerCase()}...`}
              disabled={isDisabled}
              className={error ? 'border-red-500' : ''}
              maxDisplay={3}
            />
          );
        }
        return null;

      case 'checkbox':
        return (
          <Checkbox
            checked={value}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, [field.name]: checked }))}
            disabled={isDisabled}
          />
        );

      case 'file':
        const isImageFile = field.accept?.includes('image');
        return (
          <div className="space-y-2">
            {mode !== 'view' && (
              <Input
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                disabled={isDisabled}
                type="file"
                accept={field.accept}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fileWithPreview = Object.assign(file, {
                      previewUrl: URL.createObjectURL(file)
                    });
                    setFormData(prev => ({ ...prev, [field.name]: fileWithPreview }));
                  } else {
                    setFormData(prev => ({ ...prev, [field.name]: null }));
                  }
                }}
                className={error ? 'border-red-500' : ''}
              />
            )}
            
            {/* Show newly selected file preview */}
            {value && value instanceof File && isImageFile && (
              <div className="mt-2">
                <p className="mb-1 text-xs text-gray-500">Preview:</p>
                <img
                  src={value.previewUrl}
                  alt="Preview"
                  className="h-24 w-auto rounded-md object-cover shadow-sm border"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/200x150?text=Preview+Error';
                  }}
                />
              </div>
            )}
            
            {/* Show existing file */}
            {value && typeof value === 'string' && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Current: <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View File</a>
                </div>
                {isImageFile && (
                  <div className="mt-2">
                    <p className="mb-1 text-xs text-gray-500">Current image:</p>
                    <img
                      src={value.startsWith('http') ? value : `/storage/${value}`}
                      alt="Current image"
                      className="h-24 w-auto rounded-md object-cover shadow-sm border"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/200x150?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'date':
        if (mode === 'view') {
          return (
            <div className="rounded-md border bg-gray-50 p-2">
              {value ? new Date(value).toLocaleDateString() : '-'}
            </div>
          );
        }
        return (
          <Input
            {...commonProps}
            type="date"
            value={value || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'datetime':
        return (
          <Input
            {...commonProps}
            type="datetime-local"
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'dependent-dropdown':
        // Example: 3-level dependency (Country -> State -> City)
        const dependentFields = [
          {
            name: 'country',
            label: 'Country',
            options: [
              { value: 'india', label: 'India' },
              { value: 'usa', label: 'USA' },
              { value: 'uk', label: 'UK' }
            ]
          },
          {
            name: 'state',
            label: 'State',
            dependencies: {
              india: [
                { value: 'gujarat', label: 'Gujarat' },
                { value: 'maharashtra', label: 'Maharashtra' },
                { value: 'rajasthan', label: 'Rajasthan' }
              ],
              usa: [
                { value: 'california', label: 'California' },
                { value: 'texas', label: 'Texas' },
                { value: 'florida', label: 'Florida' }
              ],
              uk: [
                { value: 'england', label: 'England' },
                { value: 'scotland', label: 'Scotland' },
                { value: 'wales', label: 'Wales' }
              ]
            }
          },
          {
            name: 'city',
            label: 'City',
            dependencies: {
              gujarat: [
                { value: 'ahmedabad', label: 'Ahmedabad' },
                { value: 'surat', label: 'Surat' },
                { value: 'vadodara', label: 'Vadodara' }
              ],
              maharashtra: [
                { value: 'mumbai', label: 'Mumbai' },
                { value: 'pune', label: 'Pune' },
                { value: 'nagpur', label: 'Nagpur' }
              ],
              california: [
                { value: 'los-angeles', label: 'Los Angeles' },
                { value: 'san-francisco', label: 'San Francisco' },
                { value: 'san-diego', label: 'San Diego' }
              ],
              texas: [
                { value: 'houston', label: 'Houston' },
                { value: 'dallas', label: 'Dallas' },
                { value: 'austin', label: 'Austin' }
              ]
            }
          }
        ];
        
        const dependentValues = {
          country: formData.country || '',
          state: formData.state || '',
          city: formData.city || ''
        };
        
        return (
          <DependentDropdown
            fields={dependentFields}
            values={dependentValues}
            onChange={(fieldName, value) => setFormData(prev => ({ ...prev, [fieldName]: value }))}
            disabled={isDisabled}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => setFormData(prev => ({ ...prev, [field.name]: val }))}
            disabled={isDisabled}
            className="flex gap-4"
          >
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={String(option.value)} id={`${field.name}-${option.value}`} />
                <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'switch':
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, [field.name]: checked }))}
            disabled={isDisabled}
          />
        );

      case 'custom':
        if (field.render) {
          return field.render(value, (newValue) => setFormData(prev => ({ ...prev, [field.name]: newValue })), mode);
        }
        return null;

      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
            className={error ? 'border-red-500' : ''}
          />
        );
    }
  };

  const getGridLayout = () => {
    if (layout === 'grid') {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1.5rem'
      };
    }
    
    // Fallback to CSS classes for other layouts
    switch (layout) {
      case 'double': return { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' };
      case 'triple': return { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' };
      default: return { className: 'space-y-6' };
    }
  };

  // Map modal size to appropriate width class (from reference code)
  const getModalSizeClass = () => {
    const sizeMap: Record<string, string> = {
      sm: 'sm:max-w-sm',
      md: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      '2xl': 'sm:max-w-2xl',
      '3xl': 'sm:max-w-3xl',
      '4xl': 'sm:max-w-4xl',
      '5xl': 'sm:max-w-5xl',
      full: 'sm:max-w-full',
    };
    return modalSize ? sizeMap[modalSize] : 'sm:max-w-lg';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className={`${getModalSizeClass()} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Create new record' : mode === 'edit' ? 'Edit existing record' : 'View record details'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {layout === 'grid' ? (
            <div style={getGridLayout()}>
              {fields.map(field => (
                <div
                  key={field.name}
                  className="space-y-3"
                  style={{
                    gridColumn: field.column ? `span ${field.column}` : 'span 1',
                    width: '100%'
                  }}
                >
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && mode !== 'view' && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                  {showErrors && (validationErrors[field.name] || errors[field.name]) && (
                    <p className="text-sm text-red-500">{validationErrors[field.name] || errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={getGridLayout().className}>
              {fields.map(field => {
                const getColumnSpan = () => {
                  if (field.column) {
                    switch (field.column) {
                      case 2: return 'col-span-1 md:col-span-2';
                      case 3: return 'col-span-1 md:col-span-2 lg:col-span-3';
                      case 4: return 'col-span-full';
                      default: return 'col-span-1';
                    }
                  }
                  if (field.type === 'dependent-dropdown') return 'col-span-full';
                  if (field.type === 'textarea') return 'col-span-1 md:col-span-2 lg:col-span-3';
                  return 'col-span-1';
                };
                
                return (
                  <div key={field.name} className={`space-y-3 ${getColumnSpan()}`}>
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && mode !== 'view' && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {renderField(field)}
                    {showErrors && (validationErrors[field.name] || errors[field.name]) && (
                      <p className="text-sm text-red-500">{validationErrors[field.name] || errors[field.name]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode !== 'view' && (
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Create' : 'Update'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CrudForm;