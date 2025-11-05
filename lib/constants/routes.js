/**
 * Application Routes
 * Centralized route definitions
 */

// API Routes
export const API_ROUTES = {
  // Items
  ITEMS: '/api/items',
  ITEM_BY_ID: (id) => `/api/items/${id}`,

  // People
  PEOPLE: '/api/people',
  PERSON_BY_ID: (id) => `/api/people/${id}`,

  // Warehouses
  WAREHOUSES: '/api/warehouse',
  WAREHOUSE_BY_ID: (id) => `/api/warehouse/${id}`,

  // Categories
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id) => `/api/categories/${id}`,

  // Brands
  BRANDS: '/api/brands',
  BRAND_BY_ID: (id) => `/api/brands/${id}`,

  // Units
  UNITS: '/api/units',
  UNIT_BY_ID: (id) => `/api/units/${id}`,

  // Suppliers
  SUPPLIERS: '/api/suppliers',
  SUPPLIER_BY_ID: (id) => `/api/suppliers/${id}`,

  // Purchases
  PURCHASES: '/api/purchases',
  PURCHASE_BY_ID: (id) => `/api/purchases/${id}`,

  // Stock Adjustments
  ADD_STOCK: '/api/adjustments/add',
  TRANSFER_STOCK: '/api/adjustments/transfer',

  // Warehouse Adjustments
  ADD_WAREHOUSE: '/api/tradjustments/add',
  TRANSFER_WAREHOUSE: '/api/tradjustments/transfer',

  // Access Management
  ACCESS_CATEGORIES: '/api/access-categories',
  ACCESS_ITEMS: '/api/access-items',
  EMPLOYEE_ACCESSES: '/api/employee-accesses',

  // Demobilization
  DEMOB_DOCUMENTS: '/api/demob-documents',
  DEMOB_PDF: (id) => `/api/demob-documents/pdf?id=${id}`,

  // Audit Trail
  AUDIT_LOGS: '/api/audit-logs',
  AUDIT_EXPORT: '/api/audit-logs/export',

  // Analytics
  ANALYTICS: '/api/analytics',

  // Auth
  AUTH: '/api/auth',
  LOGIN: '/api/auth/signin',
  LOGOUT: '/api/auth/signout',
  REGISTER: '/api/auth/signup',

  // User
  USER: '/api/user',

  // Upload
  UPLOAD: '/api/uploadthing',
};

// Dashboard Routes
export const DASHBOARD_ROUTES = {
  HOME: '/dashboard/home/overview',

  // Inventory
  INVENTORY: '/dashboard/inventory',
  ITEMS: '/dashboard/inventory/items',
  ITEM_NEW: '/dashboard/inventory/items/new',
  ITEM_DETAIL: (id) => `/dashboard/inventory/items/${id}`,

  PEOPLE: '/dashboard/inventory/people',
  PERSON_NEW: '/dashboard/inventory/people/new',
  PERSON_PROFILE: (id) => `/dashboard/inventory/people/${id}`,

  WAREHOUSES: '/dashboard/inventory/warehouse',
  WAREHOUSE_NEW: '/dashboard/inventory/warehouse/new',

  CATEGORIES: '/dashboard/inventory/categories',
  CATEGORY_NEW: '/dashboard/inventory/categories/new',

  BRANDS: '/dashboard/inventory/brands',
  BRAND_NEW: '/dashboard/inventory/brands/new',

  UNITS: '/dashboard/inventory/units',
  UNIT_NEW: '/dashboard/inventory/units/new',

  SUPPLIERS: '/dashboard/inventory/suppliers',
  SUPPLIER_NEW: '/dashboard/inventory/suppliers/new',

  ADJUSTMENTS: '/dashboard/inventory/adjustments',
  TRADJUSTMENTS: '/dashboard/inventory/tradjustments',

  // ICT Services
  ICT_SERVICES: '/dashboard/ict-services',
  ICT_ACCESS_CATEGORIES: '/dashboard/ict-services/access-categories',
  ICT_ASSIGN_ACCESS: (id) => `/dashboard/ict-services/assign/${id}`,
  ICT_MANAGE_ACCESS: (id) => `/dashboard/ict-services/manage/${id}`,

  // Demobilization
  DEMOB_USER: '/dashboard/demob-user',

  // Audit Trail
  AUDIT_TRAIL: '/dashboard/audit-trail',

  // Purchases
  PURCHASES: '/dashboard/inventory/purchases',

  // Other
  SALES: '/dashboard/sales',
  INTEGRATIONS: '/dashboard/integrations',
  DOCUMENTS: '/dashboard/documents',
};

// Auth Routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
};

// Public Routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
};

/**
 * Check if route is protected
 */
export const isProtectedRoute = (pathname) => {
  return pathname.startsWith('/dashboard');
};

/**
 * Check if route is auth route
 */
export const isAuthRoute = (pathname) => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

/**
 * Get redirect after login
 */
export const getLoginRedirect = () => {
  return DASHBOARD_ROUTES.HOME;
};

/**
 * Get redirect after logout
 */
export const getLogoutRedirect = () => {
  return AUTH_ROUTES.LOGIN;
};
