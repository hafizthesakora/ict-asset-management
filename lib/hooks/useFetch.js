import { useState, useEffect, useCallback } from 'react';
import { get } from '../utils/apiHelpers';
import { handleApiError } from '../utils/apiHelpers';

/**
 * Custom hook for data fetching with loading/error states
 *
 * @param {string} url - The API endpoint to fetch from
 * @param {object} options - Fetch options
 * @param {boolean} options.enabled - Whether to automatically fetch on mount (default: true)
 * @param {number} options.refreshInterval - Auto-refresh interval in ms (optional)
 * @param {function} options.onSuccess - Callback on successful fetch
 * @param {function} options.onError - Callback on error
 * @param {any} options.initialData - Initial data value
 * @param {array} options.deps - Dependencies array for refetching
 *
 * @returns {object} { data, loading, error, refetch, setData }
 *
 * @example
 * const { data, loading, error, refetch } = useFetch('/api/items');
 *
 * @example
 * // With options
 * const { data, loading, error } = useFetch('/api/items', {
 *   enabled: true,
 *   refreshInterval: 30000,
 *   onSuccess: (data) => console.log('Fetched:', data),
 *   deps: [categoryFilter]
 * });
 */
export const useFetch = (url, options = {}) => {
  const {
    enabled = true,
    refreshInterval = null,
    onSuccess = null,
    onError = null,
    initialData = null,
    deps = [],
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError(null);

      const result = await get(url);
      setData(result);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);

      if (onError) {
        onError(errorInfo);
      }
    } finally {
      setLoading(false);
    }
  }, [url, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData, ...deps]);

  // Auto-refresh
  useEffect(() => {
    if (!refreshInterval || !enabled) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, enabled, fetchData]);

  // Manual refetch function
  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    setData,
  };
};

/**
 * Hook for fetching data with manual trigger
 * Doesn't fetch automatically on mount
 *
 * @example
 * const { data, loading, fetch } = useLazyFetch();
 *
 * const handleClick = () => {
 *   fetch('/api/items/123');
 * };
 */
export const useLazyFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (url, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await get(url, options);
      setData(result);

      return result;
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetch,
    setData,
  };
};
