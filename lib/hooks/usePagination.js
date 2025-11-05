import { useState, useMemo, useCallback } from 'react';
import { PAGINATION } from '../constants';

/**
 * Custom hook for pagination state management
 *
 * @param {object} options - Pagination options
 * @param {number} options.initialPage - Initial page number (default: 1)
 * @param {number} options.initialPageSize - Initial page size (default: PAGINATION.DEFAULT_PAGE_SIZE)
 * @param {number} options.totalItems - Total number of items
 *
 * @returns {object} Pagination state and controls
 *
 * @example
 * const {
 *   page,
 *   pageSize,
 *   totalPages,
 *   hasNextPage,
 *   hasPrevPage,
 *   goToPage,
 *   nextPage,
 *   prevPage,
 *   setPageSize,
 *   reset
 * } = usePagination({ totalItems: 100 });
 */
export const usePagination = (options = {}) => {
  const {
    initialPage = PAGINATION.DEFAULT_PAGE,
    initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    totalItems = 0,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  // Check if has next/prev page
  const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);
  const hasPrevPage = useMemo(() => page > 1, [page]);

  // Calculate current range
  const startIndex = useMemo(() => {
    return (page - 1) * pageSize;
  }, [page, pageSize]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize, totalItems);
  }, [startIndex, pageSize, totalItems]);

  // Navigation functions
  const goToPage = useCallback((newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(p => p + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPage(p => p - 1);
    }
  }, [hasPrevPage]);

  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  return {
    // State
    page,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,

    // Actions
    goToPage,
    nextPage,
    prevPage,
    setPageSize: changePageSize,
    reset,
  };
};

/**
 * Hook for server-side pagination
 * Returns query parameters for API requests
 *
 * @example
 * const { page, pageSize, queryParams, goToPage } = useServerPagination();
 *
 * const url = buildUrl('/api/items', queryParams);
 * const { data } = useFetch(url);
 */
export const useServerPagination = (options = {}) => {
  const pagination = usePagination(options);

  const queryParams = useMemo(() => ({
    page: pagination.page,
    limit: pagination.pageSize,
  }), [pagination.page, pagination.pageSize]);

  return {
    ...pagination,
    queryParams,
  };
};

/**
 * Hook for client-side pagination
 * Slices data array based on current page
 *
 * @example
 * const items = [...]; // All items
 * const { currentPageData, ...pagination } = useClientPagination(items);
 */
export const useClientPagination = (data = [], options = {}) => {
  const pagination = usePagination({
    ...options,
    totalItems: data.length,
  });

  const currentPageData = useMemo(() => {
    return data.slice(pagination.startIndex, pagination.endIndex);
  }, [data, pagination.startIndex, pagination.endIndex]);

  return {
    ...pagination,
    currentPageData,
  };
};
