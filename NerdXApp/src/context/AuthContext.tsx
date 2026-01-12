// Authentication context provider
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string, notifications?: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  creditNotification: CreditNotificationData | null;
  clearCreditNotification: () => void;
}

export interface CreditNotificationData {
  type: 'welcome_bonus' | 'daily_refresh';
  title: string;
  message: string;
  credits: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = '@auth_token';
const USER_DATA_KEY = '@user_data';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [creditNotification, setCreditNotification] = useState<CreditNotificationData | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_DATA_KEY),
      ]);

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to load auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User, token: string, notifications?: any) => {
    try {
      const { setAuthToken } = await import('../services/api/config');
      await Promise.all([
        setAuthToken(token),
        AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData)),
      ]);
      setUser(userData);

      // Handle notifications
      if (notifications) {
        if (notifications.welcome_bonus) {
          setCreditNotification({
            type: 'welcome_bonus',
            title: 'Welcome Bonus!',
            message: notifications.welcome_message || 'Here are your exclusive starter credits.',
            credits: 75
          });
        } else if (notifications.daily_refresh) {
          setCreditNotification({
            type: 'daily_refresh',
            title: 'Daily Credits Refreshed',
            message: notifications.daily_message || 'Your daily credits are ready.',
            credits: 10
          });
        }
      }
    } catch (error) {
      console.error('Failed to save auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { clearAuthToken } = await import('../services/api/config');
      await Promise.all([
        clearAuthToken(),
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);
      setUser(null);
      setCreditNotification(null);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser)).catch(error => {
        console.error('Failed to update user data:', error);
      });
    }
  };

  const clearCreditNotification = () => {
    setCreditNotification(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    creditNotification,
    clearCreditNotification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
