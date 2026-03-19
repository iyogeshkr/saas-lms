export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    fieldRules.forEach((rule) => {
      if (rule.required && !validateRequired(value)) {
        errors[field] = rule.message || 'This field is required';
      } else if (rule.email && !validateEmail(value)) {
        errors[field] = rule.message || 'Invalid email format';
      } else if (rule.phone && !validatePhone(value)) {
        errors[field] = rule.message || 'Invalid phone number (10 digits required)';
      } else if (rule.minLength && value.length < rule.minLength) {
        errors[field] = rule.message || `Minimum ${rule.minLength} characters required`;
      } else if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = rule.message || `Maximum ${rule.maxLength} characters allowed`;
      }
    });
  });
  
  return errors;
};

// Example usage in form:
export const teacherValidationRules = {
  name: [
    { required: true, message: 'Name is required' },
    { minLength: 2, message: 'Name must be at least 2 characters' },
  ],
  email: [
    { required: true, message: 'Email is required' },
    { email: true, message: 'Invalid email format' },
  ],
  phone: [
    { required: true, message: 'Phone is required' },
    { phone: true, message: '10 digit phone number required' },
  ],
};

export const studentValidationRules = {
  name: [
    { required: true, message: 'Name is required' },
    { minLength: 2, message: 'Name must be at least 2 characters' },
  ],
  email: [
    { required: true, message: 'Email is required' },
    { email: true, message: 'Invalid email format' },
  ],
  rollNumber: [
    { required: true, message: 'Roll number is required' },
  ],
};