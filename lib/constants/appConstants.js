/**
 * Application-wide Constants
 * Centralized configuration for the entire application
 */

// Application Info
export const APP_INFO = {
  NAME: 'EGH Asset Manager',
  VERSION: '1.0.0',
  COMPANY: 'Eni Ghana',
  DESCRIPTION: 'ICT Asset Management System',
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 200,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  ISO_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
  TIME_ONLY: 'HH:mm:ss',
};

// Status Values
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
};

// Location Types
export const LOCATION_TYPES = {
  WAREHOUSE: 'warehouse',
  PERSON: 'person',
  IN_TRANSIT: 'in-transit',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  VIEWER: 'viewer',
};

// Toast/Notification Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_SPREADSHEET_TYPES: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
};

// Cache TTL (Time To Live) in milliseconds
export const CACHE_TTL = {
  SHORT: 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
};

// Debounce Delays (ms)
export const DEBOUNCE = {
  SEARCH: 500,
  INPUT: 300,
  SCROLL: 100,
  RESIZE: 200,
};

// Modal/Dialog Sizes
export const MODAL_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
  EXTRA_LARGE: 'xl',
  FULL: 'full',
};

// Table/List Empty States
export const EMPTY_STATES = {
  NO_DATA: 'No data available',
  NO_RESULTS: 'No results found',
  NO_ITEMS: 'No items to display',
  LOADING: 'Loading...',
  ERROR: 'An error occurred',
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TEXT_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_NOTES_LENGTH: 2000,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
};

// Color Schemes
export const COLORS = {
  PRIMARY: '#3B82F6', // blue-600
  SECONDARY: '#10B981', // green-600
  SUCCESS: '#10B981', // green-600
  WARNING: '#F59E0B', // yellow-600
  ERROR: '#EF4444', // red-600
  INFO: '#3B82F6', // blue-600
};

// Export File Names
export const EXPORT_FILENAMES = {
  ITEMS: 'items-export',
  PEOPLE: 'employees-export',
  WAREHOUSES: 'warehouses-export',
  AUDIT_LOGS: 'audit-logs-export',
  PURCHASES: 'purchases-export',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state',
  TABLE_SETTINGS: 'table_settings',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please contact support.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SAVED: 'Saved successfully!',
  SUBMITTED: 'Submitted successfully!',
};
