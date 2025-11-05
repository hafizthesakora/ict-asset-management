import { useState, useEffect } from 'react';
import { DEBOUNCE } from '../constants';

/**
 * Custom hook for debouncing a value
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: DEBOUNCE.SEARCH from constants)
 *
 * @returns {any} The debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // This will only run 500ms after user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export const useDebounce = (value, delay = DEBOUNCE.SEARCH) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for debouncing a callback function
 *
 * @param {function} callback - The callback to debounce
 * @param {number} delay - Delay in milliseconds
 *
 * @returns {function} The debounced callback
 *
 * @example
 * const handleSearch = (term) => {
 *   console.log('Searching for:', term);
 * };
 *
 * const debouncedSearch = useDebouncedCallback(handleSearch, 500);
 *
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export const useDebouncedCallback = (callback, delay = DEBOUNCE.SEARCH) => {
  const [timeoutId, setTimeoutId] = useState(null);

  const debouncedCallback = (...args) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
};
