import { DATE_FORMATS } from '../constants';

/**
 * Date Utility Functions
 * Consistent date formatting and manipulation
 */

/**
 * Format date to string
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return 'N/A';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  switch (format) {
    case DATE_FORMATS.ISO:
      return d.toISOString();
    case DATE_FORMATS.DATE_ONLY:
      return `${year}-${month}-${day}`;
    case DATE_FORMATS.TIME_ONLY:
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    case DATE_FORMATS.DISPLAY:
    default:
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const now = new Date();
  const diffMs = now - d;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  }
};

/**
 * Get days until date
 */
export const getDaysUntil = (date) => {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  const now = new Date();
  const diffMs = d - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Get days since date
 */
export const getDaysSince = (date) => {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Check if date is in the past
 */
export const isPast = (date) => {
  if (!date) return false;

  const d = new Date(date);
  if (isNaN(d.getTime())) return false;

  return d < new Date();
};

/**
 * Check if date is in the future
 */
export const isFuture = (date) => {
  if (!date) return false;

  const d = new Date(date);
  if (isNaN(d.getTime())) return false;

  return d > new Date();
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  if (!date) return false;

  const d = new Date(date);
  if (isNaN(d.getTime())) return false;

  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is within range
 */
export const isWithinRange = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) return false;

  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(d.getTime()) || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }

  return d >= start && d <= end;
};

/**
 * Add days to date
 */
export const addDays = (date, days) => {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Add months to date
 */
export const addMonths = (date, months) => {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  d.setMonth(d.getMonth() + months);
  return d;
};

/**
 * Add years to date
 */
export const addYears = (date, years) => {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  d.setFullYear(d.getFullYear() + years);
  return d;
};

/**
 * Get start of day
 */
export const startOfDay = (date) => {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 */
export const endOfDay = (date) => {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of month
 */
export const startOfMonth = (date) => {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of month
 */
export const endOfMonth = (date) => {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Parse date string
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;

  const d = new Date(dateString);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Get date range between two dates
 */
export const getDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];

  const dates = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

/**
 * Get month name
 */
export const getMonthName = (date, short = false) => {
  if (!date) return 'N/A';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  return d.toLocaleString('en-US', {
    month: short ? 'short' : 'long',
  });
};

/**
 * Get day name
 */
export const getDayName = (date, short = false) => {
  if (!date) return 'N/A';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  return d.toLocaleString('en-US', {
    weekday: short ? 'short' : 'long',
  });
};

/**
 * Compare dates (returns -1 if a < b, 0 if equal, 1 if a > b)
 */
export const compareDates = (dateA, dateB) => {
  const a = new Date(dateA);
  const b = new Date(dateB);

  if (isNaN(a.getTime()) || isNaN(b.getTime())) return 0;

  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

/**
 * Sort dates (ascending)
 */
export const sortDates = (dates, descending = false) => {
  return dates.sort((a, b) => {
    const comparison = compareDates(a, b);
    return descending ? -comparison : comparison;
  });
};

/**
 * Get age from birthdate
 */
export const getAge = (birthdate) => {
  if (!birthdate) return null;

  const birth = new Date(birthdate);
  if (isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Format date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return 'N/A';
  if (!startDate) return `Until ${formatDate(endDate)}`;
  if (!endDate) return `From ${formatDate(startDate)}`;

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  return `${start} - ${end}`;
};

/**
 * Get business days between dates (excludes weekends)
 */
export const getBusinessDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  let count = 0;
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
};
