// Authentication API services
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';

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
      const credentials: any = { password: data.password };
      if (data.identifier.includes('@')) {
        credentials.email = data.identifier;
      } else {
        credentials.phone = data.identifier;
      }

      const { data: sessionData, error } = await supabase.auth.signInWithPassword(credentials);

      if (error) throw error;

      if (sessionData.session?.access_token) {
        // Store token for axios interceptor
        await AsyncStorage.setItem('@auth_token', sessionData.session.access_token);
      }

      return {
        success: true,
        token: sessionData.session?.access_token,
        user: sessionData.user,
      };
    } catch (error: any) {
      console.error('Supabase Login Error:', error);
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const credentials: any = {
        password: data.password,
        options: {
          data: {
            first_name: data.name,
            last_name: data.surname,
            phone: data.phone_number,
            date_of_birth: data.date_of_birth,
            referred_by: data.referred_by,
          },
        },
      };

      if (data.email) {
        credentials.email = data.email;
      } else if (data.phone_number) {
        credentials.phone = data.phone_number;
      } else {
        return { success: false, message: 'Email or Phone Number is required' };
      }

      const { data: sessionData, error } = await supabase.auth.signUp(credentials);

      if (error) throw error;

      if (sessionData.session?.access_token) {
        await AsyncStorage.setItem('@auth_token', sessionData.session.access_token);
      }

      return {
        success: true,
        token: sessionData.session?.access_token,
        user: sessionData.user,
        message: !sessionData.session ? 'Please check your email to verify your account.' : undefined,
      };
    } catch (error: any) {
      console.error('Supabase Registration Error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  },

  verifyOTP: async (phoneNumber: string, otp: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      if (data.session?.access_token) {
        await AsyncStorage.setItem('@auth_token', data.session.access_token);
      }

      return {
        success: true,
        token: data.session?.access_token,
        user: data.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'OTP verification failed',
      };
    }
  },

  socialLogin: async (provider: string, userInfo: any): Promise<AuthResponse> => {
    // Note: Proper social login usually requires the Supabase native flow or an ID token.
    // For now, returning error as this requires more setup (Google Auth provider config in Supabase).
    return {
      success: false,
      message: 'Social login requires additional Supabase configuration.',
    };
  },
};
