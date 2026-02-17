/**
 * HTTP Client for API calls
 * Centralized client with token management and error handling
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000;

// Token storage keys
const TOKEN_KEY = 'auth_token';

/**
 * Get stored auth token
 */
export const getToken = async () => {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

/**
 * Set auth token
 */
export const setToken = async (token) => {
    try {
        if (token) {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } else {
            await AsyncStorage.removeItem(TOKEN_KEY);
        }
    } catch (error) {
        console.error('Error setting token:', error);
    }
};

/**
 * Remove auth token (logout)
 */
export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

/**
 * Create a timeout promise
 */
const createTimeout = (ms) => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), ms);
    });
};

/**
 * Make an HTTP request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - Response data
 */
export const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get auth token
    const token = await getToken();

    // Build headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Build fetch options
    const fetchOptions = {
        ...options,
        headers,
    };

    // If body is an object, stringify it
    if (options.body && typeof options.body === 'object') {
        fetchOptions.body = JSON.stringify(options.body);
    }

    try {
        // Race between fetch and timeout
        const response = await Promise.race([
            fetch(url, fetchOptions),
            createTimeout(API_TIMEOUT),
        ]);

        // Parse JSON response
        const data = await response.json();

        // Check for HTTP errors
        if (!response.ok) {
            return {
                success: false,
                error: data.error || data.message || 'Request failed',
                status: response.status,
                ...data,
            };
        }

        return {
            success: true,
            ...data,
        };
    } catch (error) {
        console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);

        // Network or timeout error
        return {
            success: false,
            error: error.message || 'Network error',
            isNetworkError: true,
        };
    }
};

/**
 * HTTP method shortcuts
 */
export const httpClient = {
    get: (endpoint, options = {}) =>
        request(endpoint, { ...options, method: 'GET' }),

    post: (endpoint, body, options = {}) =>
        request(endpoint, { ...options, method: 'POST', body }),

    put: (endpoint, body, options = {}) =>
        request(endpoint, { ...options, method: 'PUT', body }),

    patch: (endpoint, body, options = {}) =>
        request(endpoint, { ...options, method: 'PATCH', body }),

    delete: (endpoint, options = {}) =>
        request(endpoint, { ...options, method: 'DELETE' }),
};

export default httpClient;
