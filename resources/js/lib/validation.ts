export interface ValidationRule {
  rule: string;
  message: string;
  params?: any[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class Validator {
  private rules: Record<string, (value: any, params?: any[]) => boolean> = {
    required: (value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim() !== '';
      return value !== null && value !== undefined && value !== '';
    },
    
    email: (value) => {
      if (!value) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    
    min: (value, params) => {
      if (!value) return true;
      const min = params?.[0] || 0;
      if (typeof value === 'string') return value.length >= min;
      if (typeof value === 'number') return value >= min;
      return true;
    },
    
    max: (value, params) => {
      if (!value) return true;
      const max = params?.[0] || 0;
      if (typeof value === 'string') return value.length <= max;
      if (typeof value === 'number') return value <= max;
      return true;
    },
    
    url: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    
    numeric: (value) => {
      if (!value) return true;
      return !isNaN(Number(value));
    },
    
    alpha: (value) => {
      if (!value) return true;
      return /^[a-zA-Z]+$/.test(value);
    },
    
    alphaNumeric: (value) => {
      if (!value) return true;
      return /^[a-zA-Z0-9]+$/.test(value);
    },
    
    phone: (value) => {
      if (!value) return true;
      return /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''));
    }
  };

  private customRules: Record<string, (value: any, params?: any[]) => boolean> = {};

  addCustomRule(name: string, validator: (value: any, params?: any[]) => boolean) {
    this.customRules[name] = validator;
  }

  validate(data: Record<string, any>, rules: Record<string, ValidationRule[]>): ValidationResult {
    const errors: Record<string, string> = {};

    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = data[field];

      for (const rule of fieldRules) {
        const validator = this.rules[rule.rule] || this.customRules[rule.rule];
        
        if (!validator) {
          console.warn(`Validation rule '${rule.rule}' not found`);
          continue;
        }

        if (!validator(value, rule.params)) {
          errors[field] = rule.message;
          break; // Stop at first error for this field
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export const validator = new Validator();