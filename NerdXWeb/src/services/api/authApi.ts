// Authentication API services for NerdX Web App
import api, { setAuthToken } from './config';
import type { User } from '../../types';

export interface LoginData {
  identifier: string; // email or phone
  password: string;
  role?: 'student' | 'teacher';
}

export interface RegisterData {
  name: string;
  surname: string;
  email?: string;
  phone_number?: string;
  password: string;
  date_of_birth?: string;
  referred_by?: string;
  role?: 'student' | 'teacher';
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  notifications?: Record<string, unknown>;
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/mobile/auth/login', data);

      if (response.data.success && response.data.token) {
        setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error('Login Error:', err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your connection.',
      };
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/mobile/auth/register', data);

      if (response.data.success && response.data.token) {
        setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error('Registration Error:', err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.',
      };
    }
  },

  socialLogin: async (provider: string, userInfo: Record<string, unknown>): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/mobile/auth/social-login', {
        provider,
        user: {
          id: userInfo.id || userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
          picture: userInfo.picture,
          sub: userInfo.sub || userInfo.id,
        }
      });

      if (response.data.success && response.data.token) {
        setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error('Social Login Error:', err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Social login failed.',
      };
    }
  },

  resetPassword: async (data: { email?: string; token?: string; new_password: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.post('/api/mobile/auth/reset-password', data);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error('Reset Password Error:', err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Password reset failed.',
      };
    }
  },
};
