/**
 * Status Constants
 * All status-related constants and helpers
 */

// Item Status
export const ITEM_STATUS = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  IN_REPAIR: 'in_repair',
  DAMAGED: 'damaged',
  RETIRED: 'retired',
  LOST: 'lost',
};

// Employee/People Status
export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  SUSPENDED: 'suspended',
  TERMINATED: 'terminated',
};

// Transfer/Adjustment Status
export const TRANSFER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  RETURNED: 'returned',
  CANCELLED: 'cancelled',
};

// Access Status
export const ACCESS_STATUS = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
  EXPIRED: 'expired',
  PENDING: 'pending',
};

// Purchase/Order Status
export const PURCHASE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  ORDERED: 'ordered',
  RECEIVED: 'received',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Contract Status
export const CONTRACT_STATUS = {
  ACTIVE: 'active',
  EXPIRING_SOON: 'expiring_soon', // Within 30 days
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  RENEWED: 'renewed',
};

// Document Status
export const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  PENDING_SIGNATURE: 'pending_signature',
  SIGNED: 'signed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
};

// Task/Ticket Status
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical',
};

// Status Colors (Tailwind Classes)
export const STATUS_COLORS = {
  // Item Status
  [ITEM_STATUS.AVAILABLE]: 'bg-green-100 text-green-800 border-green-200',
  [ITEM_STATUS.ASSIGNED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ITEM_STATUS.IN_REPAIR]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ITEM_STATUS.DAMAGED]: 'bg-orange-100 text-orange-800 border-orange-200',
  [ITEM_STATUS.RETIRED]: 'bg-gray-100 text-gray-800 border-gray-200',
  [ITEM_STATUS.LOST]: 'bg-red-100 text-red-800 border-red-200',

  // Employee Status
  [EMPLOYEE_STATUS.ACTIVE]: 'bg-green-100 text-green-800 border-green-200',
  [EMPLOYEE_STATUS.INACTIVE]: 'bg-gray-100 text-gray-800 border-gray-200',
  [EMPLOYEE_STATUS.ON_LEAVE]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [EMPLOYEE_STATUS.SUSPENDED]: 'bg-orange-100 text-orange-800 border-orange-200',
  [EMPLOYEE_STATUS.TERMINATED]: 'bg-red-100 text-red-800 border-red-200',

  // Transfer Status
  [TRANSFER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [TRANSFER_STATUS.ACTIVE]: 'bg-blue-100 text-blue-800 border-blue-200',
  [TRANSFER_STATUS.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
  [TRANSFER_STATUS.RETURNED]: 'bg-purple-100 text-purple-800 border-purple-200',
  [TRANSFER_STATUS.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',

  // Access Status
  [ACCESS_STATUS.ACTIVE]: 'bg-green-100 text-green-800 border-green-200',
  [ACCESS_STATUS.REVOKED]: 'bg-red-100 text-red-800 border-red-200',
  [ACCESS_STATUS.EXPIRED]: 'bg-gray-100 text-gray-800 border-gray-200',
  [ACCESS_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',

  // Purchase Status
  [PURCHASE_STATUS.DRAFT]: 'bg-gray-100 text-gray-800 border-gray-200',
  [PURCHASE_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [PURCHASE_STATUS.APPROVED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [PURCHASE_STATUS.ORDERED]: 'bg-purple-100 text-purple-800 border-purple-200',
  [PURCHASE_STATUS.RECEIVED]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  [PURCHASE_STATUS.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
  [PURCHASE_STATUS.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',

  // Priority Levels
  [PRIORITY_LEVELS.LOW]: 'bg-gray-100 text-gray-800 border-gray-200',
  [PRIORITY_LEVELS.MEDIUM]: 'bg-blue-100 text-blue-800 border-blue-200',
  [PRIORITY_LEVELS.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
  [PRIORITY_LEVELS.URGENT]: 'bg-red-100 text-red-800 border-red-200',
  [PRIORITY_LEVELS.CRITICAL]: 'bg-red-200 text-red-900 border-red-300',
};

// Status Icons
export const STATUS_ICONS = {
  [ITEM_STATUS.AVAILABLE]: '✅',
  [ITEM_STATUS.ASSIGNED]: '👤',
  [ITEM_STATUS.IN_REPAIR]: '🔧',
  [ITEM_STATUS.DAMAGED]: '⚠️',
  [ITEM_STATUS.RETIRED]: '📦',
  [ITEM_STATUS.LOST]: '❌',

  [EMPLOYEE_STATUS.ACTIVE]: '✅',
  [EMPLOYEE_STATUS.INACTIVE]: '⏸️',
  [EMPLOYEE_STATUS.ON_LEAVE]: '🏖️',
  [EMPLOYEE_STATUS.SUSPENDED]: '⚠️',
  [EMPLOYEE_STATUS.TERMINATED]: '❌',

  [TRANSFER_STATUS.PENDING]: '⏳',
  [TRANSFER_STATUS.ACTIVE]: '🔄',
  [TRANSFER_STATUS.COMPLETED]: '✅',
  [TRANSFER_STATUS.RETURNED]: '↩️',
  [TRANSFER_STATUS.CANCELLED]: '❌',

  [ACCESS_STATUS.ACTIVE]: '🔓',
  [ACCESS_STATUS.REVOKED]: '🔒',
  [ACCESS_STATUS.EXPIRED]: '⏰',
  [ACCESS_STATUS.PENDING]: '⏳',

  [PRIORITY_LEVELS.LOW]: '⬇️',
  [PRIORITY_LEVELS.MEDIUM]: '➡️',
  [PRIORITY_LEVELS.HIGH]: '⬆️',
  [PRIORITY_LEVELS.URGENT]: '🔥',
  [PRIORITY_LEVELS.CRITICAL]: '🚨',
};

/**
 * Get status badge class
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Get status icon
 */
export const getStatusIcon = (status) => {
  return STATUS_ICONS[status] || '📋';
};

/**
 * Format status for display
 */
export const formatStatus = (status) => {
  if (!status) return 'N/A';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Check if contract is expiring soon (within days)
 */
export const isContractExpiringSoon = (endDate, days = 30) => {
  if (!endDate) return false;
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= days;
};

/**
 * Check if contract is expired
 */
export const isContractExpired = (endDate) => {
  if (!endDate) return false;
  const end = new Date(endDate);
  const today = new Date();
  return end < today;
};

/**
 * Get contract status based on end date
 */
export const getContractStatus = (endDate, currentStatus = 'active') => {
  if (!endDate) return currentStatus;

  if (isContractExpired(endDate)) {
    return CONTRACT_STATUS.EXPIRED;
  }

  if (isContractExpiringSoon(endDate)) {
    return CONTRACT_STATUS.EXPIRING_SOON;
  }

  return CONTRACT_STATUS.ACTIVE;
};
