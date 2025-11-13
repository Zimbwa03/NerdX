import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this with your backend API URL
export const API_BASE_URL = __DEV__
  ? 'http://localhost:5000' // Development (use your local IP for physical device: http://192.168.1.XXX:5000)
  : 'https://nerdx.onrender.com'; // Production

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/mobile`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      // Navigate to login - handled by AuthContext
    }
    return Promise.reject(error);
  },
);

export default apiClient;

