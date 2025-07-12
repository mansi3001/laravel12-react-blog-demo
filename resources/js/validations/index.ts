// Export all validation modules
export * from './blogValidation';
export * from './commonValidation';
export { validator, ValidationRule, ValidationResult } from '@/lib/validation';

// Helper function to create validation rules easily
export const createValidationRules = (rules: Record<string, ValidationRule[]>) => {
  return rules;
};

// Example usage:
// import { createValidationRules, validator } from '@/validations';
// 
// const myRules = createValidationRules({
//   title: [
//     { rule: 'required', message: 'Title is required' },
//     { rule: 'min', message: 'Title too short', params: [5] }
//   ]
// });
//
// const result = validator.validate(formData, myRules);