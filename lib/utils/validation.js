import { VALIDATION } from '../constants';

/**
 * Validation Utility Functions
 * Reusable validation rules for forms
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Check if it's 10 digits (can be adjusted for different countries)
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate minimum length
 */
export const hasMinLength = (value, minLength) => {
  if (!value) return false;
  return value.toString().length >= minLength;
};

/**
 * Validate maximum length
 */
export const hasMaxLength = (value, maxLength) => {
  if (!value) return true; // Empty values are valid for max length
  return value.toString().length <= maxLength;
};

/**
 * Validate number range
 */
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

/**
 * Validate positive number
 */
export const isPositive = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validate non-negative number
 */
export const isNonNegative = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
};

/**
 * Validate integer
 */
export const isInteger = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && Number.isInteger(num);
};

/**
 * Validate decimal places
 */
export const hasValidDecimals = (value, maxDecimals) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;

  const decimals = (value.toString().split('.')[1] || '').length;
  return decimals <= maxDecimals;
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Validate date is in the past
 */
export const isDateInPast = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;

  return date < new Date();
};

/**
 * Validate date is in the future
 */
export const isDateInFuture = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;

  return date > new Date();
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password) => {
  if (!password) return false;

  const minLength = VALIDATION.PASSWORD_MIN_LENGTH;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar
  );
};

/**
 * Validate passwords match
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validate file size
 */
export const isValidFileSize = (file, maxSizeInMB) => {
  if (!file) return false;

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Validate file type
 */
export const isValidFileType = (file, allowedTypes) => {
  if (!file) return false;

  const fileType = file.type;
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop().toLowerCase();

  return allowedTypes.some(type => {
    // Check MIME type
    if (fileType === type) return true;

    // Check file extension
    if (type.startsWith('.') && `.${fileExtension}` === type) return true;

    // Check wildcard (e.g., "image/*")
    if (type.includes('*')) {
      const regex = new RegExp(type.replace('*', '.*'));
      return regex.test(fileType);
    }

    return false;
  });
};

/**
 * Validate unique value in array
 */
export const isUnique = (value, array, key = null) => {
  if (!array || !Array.isArray(array)) return true;

  if (key) {
    return !array.some(item => item[key] === value);
  }

  return !array.includes(value);
};

/**
 * Validate alphanumeric
 */
export const isAlphanumeric = (value) => {
  if (!value) return false;
  return /^[a-zA-Z0-9]+$/.test(value);
};

/**
 * Validate alphabetic only
 */
export const isAlphabetic = (value) => {
  if (!value) return false;
  return /^[a-zA-Z\s]+$/.test(value);
};

/**
 * Validate numeric only
 */
export const isNumeric = (value) => {
  if (!value) return false;
  return /^[0-9]+$/.test(value);
};

/**
 * Validate Ghana card number format
 */
export const isValidGhanaCard = (cardNumber) => {
  if (!cardNumber) return false;

  // Ghana card format: GHA-XXXXXXXXX-X
  const ghanaCardRegex = /^GHA-\d{9}-\d{1}$/;
  return ghanaCardRegex.test(cardNumber);
};

/**
 * Validate serial number format
 */
export const isValidSerialNumber = (serial) => {
  if (!serial) return false;

  // Serial number should be alphanumeric and between 4-50 characters
  return /^[A-Z0-9]{4,50}$/i.test(serial);
};

/**
 * Validate amount format
 */
export const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return false;

  // Check if it has maximum 2 decimal places
  return hasValidDecimals(amount, 2);
};

/**
 * Validate array is not empty
 */
export const isNotEmptyArray = (arr) => {
  return Array.isArray(arr) && arr.length > 0;
};

/**
 * Validate object is not empty
 */
export const isNotEmptyObject = (obj) => {
  return obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0;
};

/**
 * Comprehensive form validator
 * Returns an object with field errors
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = data[field];

    fieldRules.forEach(rule => {
      // Skip if field already has an error
      if (errors[field]) return;

      const { validator, message } = rule;

      if (!validator(value, data)) {
        errors[field] = message;
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Common validation rules for reuse
 */
export const validationRules = {
  required: (message = 'This field is required') => ({
    validator: (value) => isRequired(value),
    message,
  }),

  email: (message = 'Please enter a valid email address') => ({
    validator: (value) => !value || isValidEmail(value),
    message,
  }),

  phone: (message = 'Please enter a valid phone number') => ({
    validator: (value) => !value || isValidPhone(value),
    message,
  }),

  minLength: (length, message = `Must be at least ${length} characters`) => ({
    validator: (value) => !value || hasMinLength(value, length),
    message,
  }),

  maxLength: (length, message = `Must be no more than ${length} characters`) => ({
    validator: (value) => !value || hasMaxLength(value, length),
    message,
  }),

  positive: (message = 'Must be a positive number') => ({
    validator: (value) => !value || isPositive(value),
    message,
  }),

  nonNegative: (message = 'Must be a non-negative number') => ({
    validator: (value) => !value || isNonNegative(value),
    message,
  }),

  integer: (message = 'Must be a whole number') => ({
    validator: (value) => !value || isInteger(value),
    message,
  }),

  validAmount: (message = 'Please enter a valid amount') => ({
    validator: (value) => !value || isValidAmount(value),
    message,
  }),

  dateInFuture: (message = 'Date must be in the future') => ({
    validator: (value) => !value || isDateInFuture(value),
    message,
  }),

  dateInPast: (message = 'Date must be in the past') => ({
    validator: (value) => !value || isDateInPast(value),
    message,
  }),

  strongPassword: (message = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character') => ({
    validator: (value) => !value || isStrongPassword(value),
    message,
  }),

  passwordMatch: (passwordField, message = 'Passwords do not match') => ({
    validator: (value, formData) => {
      return !value || value === formData[passwordField];
    },
    message,
  }),
};

/**
 * Example usage of validation
 *
 * @example
 * const formData = {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   age: 25,
 *   password: 'Test123!',
 *   confirmPassword: 'Test123!'
 * };
 *
 * const rules = {
 *   name: [
 *     validationRules.required(),
 *     validationRules.minLength(2),
 *   ],
 *   email: [
 *     validationRules.required(),
 *     validationRules.email(),
 *   ],
 *   age: [
 *     validationRules.required(),
 *     validationRules.positive(),
 *     validationRules.integer(),
 *   ],
 *   password: [
 *     validationRules.required(),
 *     validationRules.strongPassword(),
 *   ],
 *   confirmPassword: [
 *     validationRules.required(),
 *     validationRules.passwordMatch('password'),
 *   ],
 * };
 *
 * const { isValid, errors } = validateForm(formData, rules);
 *
 * if (!isValid) {
 *   console.log('Validation errors:', errors);
 * }
 */
