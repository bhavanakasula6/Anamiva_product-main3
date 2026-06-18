/**
 * Form Validation Utilities
 */

// Phone number validation
export const normalizePhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(normalizePhone(phone));
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
  return null;
};

// OTP validation (6 digits)
export const validateOTP = (otp) => {
  const otpRegex = /^[0-9]{6}$/;
  return otpRegex.test(otp);
};

// Name validation
export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

// Age validation
export const validateAge = (age) => {
  const ageNum = parseInt(age, 10);
  return ageNum > 0 && ageNum < 150;
};

// Registration number validation
export const validateRegistrationNumber = (regNo) => {
  return regNo && regNo.trim().length >= 5;
};

// Required field validation
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Numeric validation
export const validateNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Password strength validation
export const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// ZIP code validation (5 or 9 digits)
export const validateZipCode = (zip) => {
  const zipRegex = /^[0-9]{5}(-[0-9]{4})?$/;
  return zipRegex.test(zip);
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = formData[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = rule.requiredMessage || `${field} is required`;
    } else if (rule.type === 'email' && value && !validateEmail(value)) {
      errors[field] = 'Invalid email address';
    } else if (rule.type === 'phone' && value && !validatePhone(value)) {
      errors[field] = 'Invalid phone number';
    } else if (rule.type === 'numeric' && value && !validateNumeric(value)) {
      errors[field] = 'Must be a number';
    } else if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `Must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `Must be at most ${rule.maxLength} characters`;
    } else if (rule.min && value && parseFloat(value) < rule.min) {
      errors[field] = `Must be at least ${rule.min}`;
    } else if (rule.max && value && parseFloat(value) > rule.max) {
      errors[field] = `Must be at most ${rule.max}`;
    } else if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || 'Invalid format';
    } else if (rule.custom && value) {
      const customError = rule.custom(value, formData);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  normalizePhone,
  validatePhone,
  validateEmail,
  validateOTP,
  validateName,
  validateAge,
  validateRegistrationNumber,
  validateRequired,
  validateNumeric,
  validatePassword,
  validateZipCode,
  validateForm,
};
