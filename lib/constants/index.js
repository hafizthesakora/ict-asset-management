/**
 * Constants Index
 * Central export point for all constants
 */

// Export all constants
export * from './appConstants';
export * from './statusConstants';
export * from './routes';
export * from './auditConstants';

// Re-export commonly used constants for convenience
export {
  APP_INFO,
  API_CONFIG,
  PAGINATION,
  STATUS,
  LOCATION_TYPES,
  USER_ROLES,
  TOAST_TYPES,
  UPLOAD_CONFIG,
  CACHE_TTL,
  DEBOUNCE,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from './appConstants';

export {
  ITEM_STATUS,
  EMPLOYEE_STATUS,
  TRANSFER_STATUS,
  ACCESS_STATUS,
  PURCHASE_STATUS,
  CONTRACT_STATUS,
  PRIORITY_LEVELS,
  getStatusColor,
  getStatusIcon,
  formatStatus,
  isContractExpiringSoon,
  isContractExpired,
  getContractStatus,
} from './statusConstants';

export {
  API_ROUTES,
  DASHBOARD_ROUTES,
  AUTH_ROUTES,
  PUBLIC_ROUTES,
  isProtectedRoute,
  isAuthRoute,
  getLoginRedirect,
  getLogoutRedirect,
} from './routes';

export {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  getActionColor,
  getActionIcon,
  getActionTextColor,
  getActionDescription,
  validateAuditData,
} from './auditConstants';
