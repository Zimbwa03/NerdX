// API configuration for NerdX App
import axios from 'axios';

export const API_BASE_URL = __DEV__
  ? 'http://localhost:5000' // Development (use your local IP for physical device: http://192.168.1.XXX:5000)
  : 'https://nerdx.onrender.com'; // Production

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      clearAuthToken();
    }
    return Promise.reject(error);
  }
);

// Auth token management
export const getAuthToken = (): string | null => {
  try {
    // In a real app, this would be stored securely
    return null; // TODO: Implement secure token storage
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  try {
    // TODO: Implement secure token storage
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

export const clearAuthToken = (): void => {
  try {
    // TODO: Clear stored token
  } catch (error) {
    console.error('Failed to clear auth token:', error);
  }
};

export default api;
