import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants';

/**
 * Custom hook for managing localStorage with React state
 *
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 *
 * @returns {[any, function, function]} [value, setValue, removeValue]
 *
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 *
 * setTheme('dark'); // Saves to localStorage and updates state
 * removeTheme(); // Removes from localStorage and resets to initial value
 */
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function for same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for managing session storage
 * Same API as useLocalStorage but uses sessionStorage
 *
 * @example
 * const [filters, setFilters] = useSessionStorage('filters', {});
 */
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);

      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for managing user preferences in localStorage
 * Uses predefined keys from constants
 *
 * @example
 * const { theme, setTheme, pageSize, setPageSize } = usePreferences();
 */
export const usePreferences = () => {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'light');
  const [pageSize, setPageSize] = useLocalStorage(STORAGE_KEYS.PAGE_SIZE, 20);
  const [sidebarOpen, setSidebarOpen] = useLocalStorage(STORAGE_KEYS.SIDEBAR_STATE, true);

  return {
    theme,
    setTheme,
    pageSize,
    setPageSize,
    sidebarOpen,
    setSidebarOpen,
  };
};
