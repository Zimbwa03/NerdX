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

// Response interceptor to handle common errors
// NOTE: We intentionally do NOT clear auth tokens or trigger logout on 401.
// Individual API calls (creditsApi, etc.) handle 401 gracefully by returning null.
// This prevents auto-logout cascades when multiple concurrent requests fail.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Just pass the error through - let callers handle 401 individually
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
