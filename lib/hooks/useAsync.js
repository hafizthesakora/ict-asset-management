import { useState, useCallback } from 'react';
import { handleApiError } from '../utils/apiHelpers';

/**
 * Custom hook for managing async operations
 * Tracks loading, error states, and provides execute function
 *
 * @param {function} asyncFunction - The async function to execute
 * @param {object} options - Options
 * @param {boolean} options.immediate - Execute immediately on mount (default: false)
 * @param {function} options.onSuccess - Success callback
 * @param {function} options.onError - Error callback
 *
 * @returns {object} { execute, loading, error, data, reset }
 *
 * @example
 * const createItem = async (data) => {
 *   return await post('/api/items', data);
 * };
 *
 * const { execute, loading, error } = useAsync(createItem);
 *
 * const handleSubmit = async (formData) => {
 *   const result = await execute(formData);
 *   if (result) {
 *     toast.success('Item created!');
 *   }
 * };
 */
export const useAsync = (asyncFunction, options = {}) => {
  const {
    immediate = false,
    onSuccess = null,
    onError = null,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);

      const result = await asyncFunction(...args);
      setData(result);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);

      if (onError) {
        onError(errorInfo);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    loading,
    error,
    data,
    reset,
  };
};

/**
 * Hook for form submission with async handling
 *
 * @example
 * const { handleSubmit, submitting, error } = useAsyncSubmit(async (data) => {
 *   return await post('/api/items', data);
 * });
 *
 * <form onSubmit={handleSubmit}>
 *   ...
 * </form>
 */
export const useAsyncSubmit = (submitFunction, options = {}) => {
  const asyncHook = useAsync(submitFunction, options);

  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Get form data if event is provided
    let formData = e;
    if (e && e.target instanceof HTMLFormElement) {
      formData = new FormData(e.target);
      formData = Object.fromEntries(formData);
    }

    return await asyncHook.execute(formData);
  }, [asyncHook]);

  return {
    handleSubmit,
    submitting: asyncHook.loading,
    error: asyncHook.error,
    data: asyncHook.data,
    reset: asyncHook.reset,
  };
};

/**
 * Hook for managing multiple async operations
 * Useful when you need to track multiple API calls
 *
 * @example
 * const operations = useMultipleAsync({
 *   create: createItem,
 *   update: updateItem,
 *   delete: deleteItem
 * });
 *
 * operations.create.execute(data);
 * operations.update.execute(id, data);
 * operations.delete.execute(id);
 */
export const useMultipleAsync = (operations) => {
  const [states, setStates] = useState(() => {
    const initial = {};
    Object.keys(operations).forEach(key => {
      initial[key] = {
        loading: false,
        error: null,
        data: null,
      };
    });
    return initial;
  });

  const execute = useCallback((operationName, ...args) => {
    return new Promise(async (resolve, reject) => {
      if (!operations[operationName]) {
        reject(new Error(`Operation "${operationName}" not found`));
        return;
      }

      try {
        setStates(prev => ({
          ...prev,
          [operationName]: {
            ...prev[operationName],
            loading: true,
            error: null,
          },
        }));

        const result = await operations[operationName](...args);

        setStates(prev => ({
          ...prev,
          [operationName]: {
            loading: false,
            error: null,
            data: result,
          },
        }));

        resolve(result);
      } catch (err) {
        const errorInfo = handleApiError(err);

        setStates(prev => ({
          ...prev,
          [operationName]: {
            loading: false,
            error: errorInfo.message,
            data: null,
          },
        }));

        reject(err);
      }
    });
  }, [operations]);

  // Create individual operation objects
  const operationHooks = {};
  Object.keys(operations).forEach(key => {
    operationHooks[key] = {
      execute: (...args) => execute(key, ...args),
      loading: states[key].loading,
      error: states[key].error,
      data: states[key].data,
    };
  });

  return operationHooks;
};
