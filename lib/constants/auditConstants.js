/**
 * Audit Trail Constants
 * Centralized constants for audit logging system
 */

// Action Types
export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ASSIGN_ITEM: 'ASSIGN_ITEM',
  GRANT_ACCESS: 'GRANT_ACCESS',
  REVOKE_ACCESS: 'REVOKE_ACCESS',
  DEMOBILIZE: 'DEMOBILIZE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  EXPORT: 'EXPORT',
};

// Entity Types
export const AUDIT_ENTITIES = {
  ITEM: 'Item',
  PEOPLE: 'People',
  EMPLOYEE_ACCESS: 'EmployeeAccess',
  WAREHOUSE: 'Warehouse',
  DEMOB_DOCUMENT: 'DemobDocument',
  ACCESS_CATEGORY: 'AccessCategory',
  ACCESS_ITEM: 'AccessItem',
  CATEGORY: 'Category',
  BRAND: 'Brand',
  SUPPLIER: 'Supplier',
  UNIT: 'Unit',
  PURCHASE: 'Purchase',
};

// Action Colors for UI
export const ACTION_COLORS = {
  [AUDIT_ACTIONS.CREATE]: 'bg-green-100 text-green-800',
  [AUDIT_ACTIONS.UPDATE]: 'bg-blue-100 text-blue-800',
  [AUDIT_ACTIONS.DELETE]: 'bg-red-100 text-red-800',
  [AUDIT_ACTIONS.ASSIGN_ITEM]: 'bg-purple-100 text-purple-800',
  [AUDIT_ACTIONS.GRANT_ACCESS]: 'bg-cyan-100 text-cyan-800',
  [AUDIT_ACTIONS.REVOKE_ACCESS]: 'bg-orange-100 text-orange-800',
  [AUDIT_ACTIONS.DEMOBILIZE]: 'bg-red-100 text-red-800',
  [AUDIT_ACTIONS.LOGIN]: 'bg-emerald-100 text-emerald-800',
  [AUDIT_ACTIONS.LOGOUT]: 'bg-gray-100 text-gray-800',
  [AUDIT_ACTIONS.EXPORT]: 'bg-indigo-100 text-indigo-800',
};

// Action Icons for UI
export const ACTION_ICONS = {
  [AUDIT_ACTIONS.CREATE]: '➕',
  [AUDIT_ACTIONS.UPDATE]: '✏️',
  [AUDIT_ACTIONS.DELETE]: '🗑️',
  [AUDIT_ACTIONS.ASSIGN_ITEM]: '📦',
  [AUDIT_ACTIONS.GRANT_ACCESS]: '🔓',
  [AUDIT_ACTIONS.REVOKE_ACCESS]: '🔒',
  [AUDIT_ACTIONS.DEMOBILIZE]: '👋',
  [AUDIT_ACTIONS.LOGIN]: '🔑',
  [AUDIT_ACTIONS.LOGOUT]: '🚪',
  [AUDIT_ACTIONS.EXPORT]: '📊',
};

// Action Descriptions
export const ACTION_DESCRIPTIONS = {
  [AUDIT_ACTIONS.CREATE]: 'Created new record',
  [AUDIT_ACTIONS.UPDATE]: 'Updated record',
  [AUDIT_ACTIONS.DELETE]: 'Deleted record',
  [AUDIT_ACTIONS.ASSIGN_ITEM]: 'Assigned item to employee',
  [AUDIT_ACTIONS.GRANT_ACCESS]: 'Granted system access',
  [AUDIT_ACTIONS.REVOKE_ACCESS]: 'Revoked system access',
  [AUDIT_ACTIONS.DEMOBILIZE]: 'Demobilized employee',
  [AUDIT_ACTIONS.LOGIN]: 'User logged in',
  [AUDIT_ACTIONS.LOGOUT]: 'User logged out',
  [AUDIT_ACTIONS.EXPORT]: 'Exported data',
};

// Pagination defaults
export const AUDIT_PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 200,
  MIN_PAGE_SIZE: 10,
};

// Cache TTL (Time To Live) in seconds
export const AUDIT_CACHE = {
  STATS_TTL: 300, // 5 minutes
  RECENT_LOGS_TTL: 60, // 1 minute
};

// Filter defaults
export const AUDIT_FILTERS = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 200,
  DEFAULT_SKIP: 0,
};

// Validation
export const AUDIT_VALIDATION = {
  MAX_ENTITY_NAME_LENGTH: 200,
  MAX_PERFORMED_BY_LENGTH: 100,
  MAX_EMAIL_LENGTH: 100,
  MAX_IP_LENGTH: 45, // IPv6 max length
};

// Action Text Colors (for badges/text only)
export const ACTION_TEXT_COLORS = {
  [AUDIT_ACTIONS.CREATE]: 'text-green-600',
  [AUDIT_ACTIONS.UPDATE]: 'text-blue-600',
  [AUDIT_ACTIONS.DELETE]: 'text-red-600',
  [AUDIT_ACTIONS.ASSIGN_ITEM]: 'text-purple-600',
  [AUDIT_ACTIONS.GRANT_ACCESS]: 'text-cyan-600',
  [AUDIT_ACTIONS.REVOKE_ACCESS]: 'text-orange-600',
  [AUDIT_ACTIONS.DEMOBILIZE]: 'text-red-600',
  [AUDIT_ACTIONS.LOGIN]: 'text-emerald-600',
  [AUDIT_ACTIONS.LOGOUT]: 'text-gray-600',
  [AUDIT_ACTIONS.EXPORT]: 'text-indigo-600',
};

/**
 * Helper function to get action color
 */
export const getActionColor = (action) => {
  return ACTION_COLORS[action] || 'bg-gray-100 text-gray-800';
};

/**
 * Helper function to get action text color
 */
export const getActionTextColor = (action) => {
  return ACTION_TEXT_COLORS[action] || 'text-gray-600';
};

/**
 * Helper function to get action icon
 */
export const getActionIcon = (action) => {
  return ACTION_ICONS[action] || '📝';
};

/**
 * Helper function to get action description
 */
export const getActionDescription = (action) => {
  return ACTION_DESCRIPTIONS[action] || 'Action performed';
};

/**
 * Validate audit log data
 */
export const validateAuditData = (data) => {
  const errors = [];

  if (!data.action || !Object.values(AUDIT_ACTIONS).includes(data.action)) {
    errors.push('Invalid action type');
  }

  if (!data.entityType || !Object.values(AUDIT_ENTITIES).includes(data.entityType)) {
    errors.push('Invalid entity type');
  }

  if (!data.performedBy || data.performedBy.length > AUDIT_VALIDATION.MAX_PERFORMED_BY_LENGTH) {
    errors.push('Invalid performer name');
  }

  if (data.performedByEmail && data.performedByEmail.length > AUDIT_VALIDATION.MAX_EMAIL_LENGTH) {
    errors.push('Email too long');
  }

  if (data.entityName && data.entityName.length > AUDIT_VALIDATION.MAX_ENTITY_NAME_LENGTH) {
    errors.push('Entity name too long');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
