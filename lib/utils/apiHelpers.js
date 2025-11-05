import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '../constants';

/**
 * API Helper Functions
 * Centralized fetch utilities with error handling
 */

/**
 * Create fetch options with default headers
 */
const createFetchOptions = (method = 'GET', body = null, customHeaders = {}) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  return options;
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  // Get response body
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Handle errors
  if (!response.ok) {
    const error = new Error(data.message || ERROR_MESSAGES.GENERIC);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Base fetch function with timeout and retry
 */
const fetchWithTimeout = async (url, options, timeout = API_CONFIG.TIMEOUT) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(ERROR_MESSAGES.TIMEOUT);
    }
    throw error;
  }
};

/**
 * Retry failed requests
 */
const fetchWithRetry = async (
  url,
  options,
  retries = API_CONFIG.RETRY_ATTEMPTS,
  delay = API_CONFIG.RETRY_DELAY
) => {
  try {
    const response = await fetchWithTimeout(url, options);
    return response;
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      await sleep(delay);
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
};

/**
 * Check if error should be retried
 */
const shouldRetry = (error) => {
  // Retry on network errors or 5xx server errors
  return (
    !error.status ||
    error.status >= 500 ||
    error.message === ERROR_MESSAGES.NETWORK ||
    error.message === ERROR_MESSAGES.TIMEOUT
  );
};

/**
 * Sleep utility for retry delay
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Main API function
 */
export const apiRequest = async (endpoint, method = 'GET', body = null, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;

  const fetchOptions = createFetchOptions(method, body, options.headers);

  try {
    const response = options.noRetry
      ? await fetchWithTimeout(url, fetchOptions)
      : await fetchWithRetry(url, fetchOptions);

    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * GET request
 */
export const get = (endpoint, options = {}) => {
  return apiRequest(endpoint, 'GET', null, options);
};

/**
 * POST request
 */
export const post = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, 'POST', body, options);
};

/**
 * PUT request
 */
export const put = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, 'PUT', body, options);
};

/**
 * PATCH request
 */
export const patch = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, 'PATCH', body, options);
};

/**
 * DELETE request
 */
export const del = (endpoint, options = {}) => {
  return apiRequest(endpoint, 'DELETE', null, options);
};

/**
 * Build query string from object
 */
export const buildQueryString = (params) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Build URL with query params
 */
export const buildUrl = (endpoint, params = {}) => {
  const queryString = buildQueryString(params);
  return `${endpoint}${queryString}`;
};

/**
 * Upload file
 */
export const uploadFile = async (endpoint, file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', (e) => {
      if (onProgress && e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr.statusText));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error(ERROR_MESSAGES.NETWORK));
    });

    xhr.open('POST', `${API_CONFIG.BASE_URL}${endpoint}`);
    xhr.send(formData);
  });
};

/**
 * Download file
 */
export const downloadFile = async (endpoint, filename) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error, customMessages = {}) => {
  let message = ERROR_MESSAGES.GENERIC;

  if (error.status) {
    switch (error.status) {
      case HTTP_STATUS.BAD_REQUEST:
        message = customMessages.badRequest || error.message || ERROR_MESSAGES.VALIDATION;
        break;
      case HTTP_STATUS.UNAUTHORIZED:
        message = customMessages.unauthorized || ERROR_MESSAGES.UNAUTHORIZED;
        break;
      case HTTP_STATUS.FORBIDDEN:
        message = customMessages.forbidden || ERROR_MESSAGES.UNAUTHORIZED;
        break;
      case HTTP_STATUS.NOT_FOUND:
        message = customMessages.notFound || ERROR_MESSAGES.NOT_FOUND;
        break;
      case HTTP_STATUS.CONFLICT:
        message = customMessages.conflict || error.message;
        break;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        message = customMessages.serverError || ERROR_MESSAGES.SERVER_ERROR;
        break;
      default:
        message = error.message || ERROR_MESSAGES.GENERIC;
    }
  } else if (error.message === ERROR_MESSAGES.NETWORK) {
    message = ERROR_MESSAGES.NETWORK;
  } else if (error.message === ERROR_MESSAGES.TIMEOUT) {
    message = ERROR_MESSAGES.TIMEOUT;
  } else {
    message = error.message || ERROR_MESSAGES.GENERIC;
  }

  return {
    message,
    status: error.status,
    data: error.data,
  };
};
