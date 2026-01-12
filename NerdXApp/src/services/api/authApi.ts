// Authentication API services
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './config';
import { User } from '../../types';

export interface LoginData {
  identifier: string; // email or phone
  password: string;
}

export interface RegisterData {
  name: string;
  surname: string;
  email?: string;
  phone_number?: string;
  password: string;
  date_of_birth?: string;
  referred_by?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User; // Updated to match User type directly
  message?: string;
  notifications?: any;
}

// Helper function to get auth token
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('@auth_token');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/mobile/auth/login', data);

      if (response.data.success && response.data.token) {
        // Store token for axios interceptor (handled by useAuth usually, but good to ensure)
        await AsyncStorage.setItem('@auth_token', response.data.token);
      }

      return response.data;
    } catch (error: any) {
      console.error('Login Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your connection.',
      };
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/mobile/auth/register', data);

      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('@auth_token', response.data.token);
      }

      return response.data;
    } catch (error: any) {
      console.error('Registration Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    }
  },

  verifyOTP: async (phoneNumber: string, otp: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/mobile/auth/verify-otp', {
        phone_number: phoneNumber,
        otp
      });

      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('@auth_token', response.data.token);
      }

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed',
      };
    }
  },

  socialLogin: async (provider: string, userInfo: any): Promise<AuthResponse> => {
    try {
      // Send the social user info to backend to create/sync account
      const response = await api.post('/api/mobile/auth/social-login', {
        provider,
        user: userInfo
      });

      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('@auth_token', response.data.token);
      }

      return response.data;
    } catch (error: any) {
      console.error('Social Login Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Social login failed.',
      };
    }
  },
};

