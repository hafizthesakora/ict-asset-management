/**
 * Utilities Index
 * Central export point for all utility functions
 */

// API Helpers
export * from './apiHelpers';

// Formatting
export * from './formatting';

// Date utilities
export * from './dateUtils';

// Validation
export * from './validation';

// Re-export commonly used functions for convenience
export {
  // API
  get,
  post,
  put,
  patch,
  del,
  buildUrl,
  buildQueryString,
  handleApiError,
} from './apiHelpers';

export {
  // Formatting
  formatCurrency,
  formatNumber,
  formatPercentage,
  titleCase,
  capitalize,
  truncate,
  getInitials,
} from './formatting';

export {
  // Date
  formatDate,
  formatDateTime,
  formatRelativeTime,
  getDaysUntil,
  isPast,
  isFuture,
  isToday,
} from './dateUtils';

export {
  // Validation
  isRequired,
  isValidEmail,
  isValidPhone,
  validateForm,
  validationRules,
} from './validation';
