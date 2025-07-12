import { ValidationRule, validator } from '@/lib/validation';

// Add common custom validation rules
validator.addCustomRule('password', (value) => {
  if (!value) return true;
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value);
});

validator.addCustomRule('confirmPassword', (value, params) => {
  if (!value) return true;
  const originalPassword = params?.[0];
  return value === originalPassword;
});

validator.addCustomRule('indianPhone', (value) => {
  if (!value) return true;
  return /^[6-9]\d{9}$/.test(value.replace(/\s/g, ''));
});

validator.addCustomRule('pincode', (value) => {
  if (!value) return true;
  return /^[1-9][0-9]{5}$/.test(value);
});

// Common validation rule sets
export const userValidationRules: Record<string, ValidationRule[]> = {
  name: [
    { rule: 'required', message: 'Name is required' },
    { rule: 'min', message: 'Name must be at least 2 characters', params: [2] },
    { rule: 'max', message: 'Name must not exceed 50 characters', params: [50] }
  ],
  email: [
    { rule: 'required', message: 'Email is required' },
    { rule: 'email', message: 'Please enter a valid email address' }
  ],
  password: [
    { rule: 'required', message: 'Password is required' },
    { rule: 'password', message: 'Password must be at least 8 characters with uppercase, lowercase and number' }
  ],
  phone: [
    { rule: 'indianPhone', message: 'Please enter a valid 10-digit mobile number' }
  ],
  pincode: [
    { rule: 'pincode', message: 'Please enter a valid 6-digit pincode' }
  ]
};

export const validateUserForm = (data: Record<string, any>) => {
  return validator.validate(data, userValidationRules);
};

export const validateLoginForm = (data: Record<string, any>) => {
  const loginRules = {
    email: userValidationRules.email,
    password: [{ rule: 'required', message: 'Password is required' }]
  };
  return validator.validate(data, loginRules);
};