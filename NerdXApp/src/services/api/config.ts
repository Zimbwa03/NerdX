// API configuration for NerdX App
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';
import { logger } from '../utils/logger';

// IMPORTANT: For APK builds, update this to your actual backend URL
// For development: use localhost (Android emulator uses 10.0.2.2 to access host machine's localhost)
// For production: use your deployed backend URL on Render
// NOTE: Changed to always use Render server for testing NerdX Live feature
export const API_BASE_URL = 'https://nerdx.onrender.com';

logger.info(`API Base URL: ${API_BASE_URL}`);
logger.debug(`Platform: ${Platform.OS}, Dev Mode: ${__DEV__}`);


const AUTH_TOKEN_KEY = '@auth_token';

// Create axios instance with default config
// Increased timeout to 60 seconds for AI-generated content
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,  // 60 seconds - AI question generation can take 20-30 seconds
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
