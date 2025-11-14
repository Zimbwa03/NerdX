// Authentication API services
import api from './config';

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
  user?: any;
  message?: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/mobile/auth/login', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/mobile/auth/register', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  verifyOTP: async (phoneNumber: string, otp: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/mobile/auth/verify-otp', {
        phone_number: phoneNumber,
        otp,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed',
      };
    }
  },
};
