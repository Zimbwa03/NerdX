import apiClient from './config';
import {LoginCredentials, RegisterData, AuthResponse, User} from '../../types';

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Verify OTP (if using phone-based auth)
  verifyOTP: async (phone_number: string, otp: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-otp', {
      phone_number,
      otp,
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{token: string}> => {
    const response = await apiClient.post('/auth/refresh-token');
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/user/profile');
    return response.data.data;
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put('/user/profile', data);
    return response.data.data;
  },
};

