import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing filter state
 *
 * @param {object} initialFilters - Initial filter values
 *
 * @returns {object} Filter state and controls
 *
 * @example
 * const {
 *   filters,
 *   setFilter,
 *   clearFilter,
 *   clearAllFilters,
 *   hasActiveFilters,
 *   activeFilterCount
 * } = useFilters({
 *   status: '',
 *   category: '',
 *   search: ''
 * });
 */
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  // Set a single filter
  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Set multiple filters at once
  const setMultipleFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Clear a single filter
  const clearFilter = useCallback((key) => {
    setFilters(prev => ({
      ...prev,
      [key]: initialFilters[key] || '',
    }));
  }, [initialFilters]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      const initialValue = initialFilters[key];
      return value !== initialValue && value !== '' && value !== null && value !== undefined;
    });
  }, [filters, initialFilters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      const initialValue = initialFilters[key];
      return value !== initialValue && value !== '' && value !== null && value !== undefined;
    }).length;
  }, [filters, initialFilters]);

  // Get clean filters (removes empty values)
  const cleanFilters = useMemo(() => {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }, [filters]);

  return {
    filters,
    setFilter,
    setMultipleFilters,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
    cleanFilters,
  };
};

/**
 * Hook for managing filters with URL sync
 * Syncs filter state with URL search params
 *
 * @example
 * const { filters, setFilter } = useUrlFilters({
 *   status: '',
 *   category: ''
 * });
 *
 * // URL will update to: ?status=active&category=electronics
 */
export const useUrlFilters = (initialFilters = {}) => {
  const filterHook = useFilters(initialFilters);

  // Sync with URL (if running in browser)
  const syncWithUrl = useCallback((filters) => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.set(key, value);
      }
    });

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
  }, []);

  // Override setFilter to sync with URL
  const setFilter = useCallback((key, value) => {
    filterHook.setFilter(key, value);
    syncWithUrl({ ...filterHook.filters, [key]: value });
  }, [filterHook, syncWithUrl]);

  return {
    ...filterHook,
    setFilter,
  };
};

/**
 * Hook for search functionality with filters
 * Combines search term with additional filters
 *
 * @example
 * const {
 *   searchTerm,
 *   setSearchTerm,
 *   filters,
 *   setFilter,
 *   allFilters
 * } = useSearch({
 *   status: '',
 *   category: ''
 * });
 */
export const useSearch = (initialFilters = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filterHook = useFilters(initialFilters);

  // Combine search term with filters
  const allFilters = useMemo(() => {
    return {
      search: searchTerm,
      ...filterHook.filters,
    };
  }, [searchTerm, filterHook.filters]);

  // Clean combined filters
  const cleanAllFilters = useMemo(() => {
    return Object.entries(allFilters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }, [allFilters]);

  // Clear everything
  const clearAll = useCallback(() => {
    setSearchTerm('');
    filterHook.clearAllFilters();
  }, [filterHook]);

  return {
    searchTerm,
    setSearchTerm,
    ...filterHook,
    allFilters,
    cleanAllFilters,
    clearAll,
  };
};
