// API configuration for NerdX App
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = __DEV__
  ? 'http://localhost:5000' // Development (use your local IP for physical device: http://192.168.1.XXX:5000)
  : 'https://nerdx.onrender.com'; // Production

const AUTH_TOKEN_KEY = '@auth_token';

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
  async (config) => {
    const token = await getAuthToken();
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
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      await clearAuthToken();
    }
    return Promise.reject(error);
  }
);

// Auth token management
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return token;
  } catch {
    return null;
  }
};

export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

export const clearAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear auth token:', error);
  }
};

export default api;
