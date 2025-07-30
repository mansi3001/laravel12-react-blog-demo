export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

export interface CrudTableConfig {
  search?: boolean;
  filters?: boolean;
  export?: boolean;
  bulkActions?: boolean;
  viewToggle?: boolean;
  columnSettings?: boolean;
  pagination?: boolean;
  sorting?: boolean;
  reorder?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'multi-select' | 'checkbox' | 'radio' | 'file' | 'date' | 'datetime' | 'dependent-dropdown' | 'switch' | 'url' | 'custom';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  validation?: string;
  multiple?: boolean;
  accept?: string;
  dependencies?: string[];
  column?: number; // Column span (1-4)
  minLength?: number;
  maxLength?: number;
  render?: (value: any, onChange: (value: any) => void, mode?: string) => React.ReactNode; // for custom fields
  dependentConfig?: Array<{
    name: string;
    label: string;
    options?: { value: string | number; label: string }[];
    dependencies?: Record<string, { value: string | number; label: string }[]>;
    apiEndpoint?: string;
  }>;
  onDependentChange?: (fieldName: string, value: string, formData: Record<string, any>) => void;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface FilterConfig {
  type: 'text' | 'select' | 'date-range' | 'multi-select';
  name: string;
  label: string;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
}