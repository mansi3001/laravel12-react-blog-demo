import { ValidationRule, validator } from '@/lib/validation';

// Add custom validation rules for blog
validator.addCustomRule('slug', (value) => {
  if (!value) return true;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
});

validator.addCustomRule('tags', (value) => {
  if (!value || !Array.isArray(value)) return true;
  return value.length <= 10; // Max 10 tags
});

validator.addCustomRule('contentLength', (value, params) => {
  if (!value) return true;
  const minWords = params?.[0] || 50;
  const wordCount = value.trim().split(/\s+/).length;
  return wordCount >= minWords;
});

validator.addCustomRule('skills', (value) => {
  if (!value || !Array.isArray(value)) return false;
  return value.length > 0; // At least one skill required
});

validator.addCustomRule('futureDate', (value) => {
  if (!value) return true;
  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
});

validator.addCustomRule('imageFile', (value) => {
  if (!value) return false;
  if (typeof value === 'string') return true; // Existing image URL
  if (value instanceof File) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(value.type);
  }
  return false;
});

// Blog validation rules
export const blogValidationRules: Record<string, ValidationRule[]> = {
  title: [
    { rule: 'required', message: 'Title is required' },
    { rule: 'min', message: 'Title must be at least 5 characters', params: [5] },
    { rule: 'max', message: 'Title must not exceed 100 characters', params: [100] }
  ],
  content: [
    { rule: 'required', message: 'Content is required' },
  ],
  category_id: [
    { rule: 'required', message: 'Category is required' }
  ],
  status: [
    { rule: 'required', message: 'Status is required' }
  ],
  priority: [
    { rule: 'required', message: 'Priority is required' }
  ],
  country_id: [
    { rule: 'required', message: 'Country is required' }
  ],
  state_id: [
    { rule: 'required', message: 'State is required' }
  ],
  city_id: [
    { rule: 'required', message: 'City is required' }
  ],
  skills: [
    { rule: 'skills', message: 'At least one skill is required' }
  ],
  publish_date: [
    { rule: 'required', message: 'Publish date is required' },
    { rule: 'futureDate', message: 'Publish date cannot be in the past' }
  ],
  tags: [
    { rule: 'tags', message: 'Maximum 10 tags allowed' }
  ],
  slug: [
    { rule: 'slug', message: 'Slug must contain only lowercase letters, numbers and hyphens' }
  ],
  image: [
    { rule: 'imageFile', message: 'Please select a valid image file (JPEG, PNG, GIF, WebP)' }
  ]
};

export const validateBlogForm = (data: Record<string, any>) => {
  return validator.validate(data, blogValidationRules);
};