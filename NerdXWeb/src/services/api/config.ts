// API configuration for NerdX Web App
import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const AUTH_TOKEN_KEY = '@auth_token';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Track consecutive 401 errors to detect expired sessions (not just transient failures)
let consecutive401Count = 0;
const MAX_401_BEFORE_LOGOUT = 3;

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Reset 401 counter on any successful response
    consecutive401Count = 0;
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      consecutive401Count++;
      // Only trigger session expiry after multiple consecutive 401s
      // This avoids logging out on transient network issues
      if (consecutive401Count >= MAX_401_BEFORE_LOGOUT) {
        consecutive401Count = 0;
        clearAuthToken();
        // Notify the app that the session has expired so AuthContext can properly logout
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth token management (using localStorage for web)
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear auth token:', error);
  }
};

export default api;
