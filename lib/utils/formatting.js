/**
 * Formatting Utilities
 * Common formatting functions for consistent display
 */

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'GHS') => {
  if (amount === null || amount === undefined) return 'N/A';

  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return 'N/A';

  return `${formatNumber(value, decimals)}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return 'N/A';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Return as-is if not 10 digits
  return phone;
};

/**
 * Truncate text
 */
export const truncate = (text, length = 50, suffix = '...') => {
  if (!text) return '';
  if (text.length <= length) return text;

  return text.substring(0, length) + suffix;
};

/**
 * Capitalize first letter
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Title case
 */
export const titleCase = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Snake case to title case
 */
export const snakeToTitle = (text) => {
  if (!text) return '';
  return text
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Camel case to title case
 */
export const camelToTitle = (text) => {
  if (!text) return '';
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

/**
 * Pluralize word
 */
export const pluralize = (word, count, plural = null) => {
  if (count === 1) return word;
  return plural || `${word}s`;
};

/**
 * Format list to string
 */
export const formatList = (items, conjunction = 'and') => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const last = items[items.length - 1];
  const rest = items.slice(0, -1).join(', ');
  return `${rest}, ${conjunction} ${last}`;
};

/**
 * Format serial number
 */
export const formatSerialNumber = (serial) => {
  if (!serial) return 'N/A';

  // Add dashes every 4 characters for readability
  return serial.match(/.{1,4}/g)?.join('-') || serial;
};

/**
 * Format asset tag
 */
export const formatAssetTag = (tag) => {
  if (!tag) return 'N/A';
  return tag.toUpperCase();
};

/**
 * Mask sensitive data
 */
export const maskString = (str, visibleStart = 3, visibleEnd = 3, maskChar = '*') => {
  if (!str || str.length <= visibleStart + visibleEnd) return str;

  const start = str.substring(0, visibleStart);
  const end = str.substring(str.length - visibleEnd);
  const masked = maskChar.repeat(str.length - visibleStart - visibleEnd);

  return `${start}${masked}${end}`;
};

/**
 * Format email for display (mask part of it)
 */
export const formatEmailDisplay = (email) => {
  if (!email) return 'N/A';

  const [name, domain] = email.split('@');
  if (!domain) return email;

  const maskedName = name.length > 3
    ? `${name.substring(0, 2)}${'*'.repeat(name.length - 2)}`
    : name;

  return `${maskedName}@${domain}`;
};

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';

  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Format address
 */
export const formatAddress = (address) => {
  if (!address) return 'N/A';

  const parts = [
    address.street,
    address.city,
    address.state,
    address.zip,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
};

/**
 * Convert to slug (URL-friendly string)
 */
export const slugify = (text) => {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

/**
 * Highlight search term in text
 */
export const highlightText = (text, searchTerm) => {
  if (!text || !searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Format boolean for display
 */
export const formatBoolean = (value, trueText = 'Yes', falseText = 'No') => {
  return value ? trueText : falseText;
};

/**
 * Format array to comma-separated string
 */
export const arrayToString = (arr, separator = ', ') => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return 'None';
  return arr.join(separator);
};

/**
 * Clean and format input
 */
export const cleanInput = (input) => {
  if (!input) return '';
  return input.toString().trim();
};

/**
 * Format reference number
 */
export const formatReferenceNumber = (prefix, number, length = 6) => {
  const paddedNumber = String(number).padStart(length, '0');
  return `${prefix}-${paddedNumber}`;
};
