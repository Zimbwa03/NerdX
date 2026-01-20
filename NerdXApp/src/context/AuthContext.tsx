// Authentication context provider
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { creditsApi } from '../services/api/creditsApi';
import { signInToSupabaseAuth, signOutFromSupabaseAuth } from '../services/supabase';

// Credentials for Supabase Auth (used for notifications RLS)
export interface SupabaseAuthCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSupabaseAuthReady: boolean; // Indicates if Supabase Auth session is established
  login: (user: User, token: string, notifications?: any, supabaseCredentials?: SupabaseAuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  refreshCredits: (includeBreakdown?: boolean) => Promise<void>;
  creditNotification: CreditNotificationData | null;
  clearCreditNotification: () => void;
}

export interface CreditNotificationData {
  type: 'welcome_bonus';
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
  const [isSupabaseAuthReady, setIsSupabaseAuthReady] = useState(false);
  const [creditNotification, setCreditNotification] = useState<CreditNotificationData | null>(null);
  const creditSyncInFlight = useRef(false);

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
        
        // Check if Supabase Auth session exists (persisted from previous login)
        const { supabase } = await import('../services/supabase');
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setIsSupabaseAuthReady(true);
          console.log('[AuthContext] Restored Supabase Auth session');
        }
      }
    } catch (error) {
      console.error('Failed to load auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User, token: string, notifications?: any, supabaseCredentials?: SupabaseAuthCredentials) => {
    try {
      const { setAuthToken } = await import('../services/api/config');
      await Promise.all([
        setAuthToken(token),
        AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData)),
      ]);
      setUser(userData);

      // Dual-auth: Sign in to Supabase Auth for notifications RLS (non-blocking)
      if (supabaseCredentials?.email && supabaseCredentials?.password) {
        const supabaseSuccess = await signInToSupabaseAuth(
          supabaseCredentials.email,
          supabaseCredentials.password
        );
        setIsSupabaseAuthReady(supabaseSuccess);
        if (!supabaseSuccess) {
          console.warn('[AuthContext] Supabase Auth failed - notifications may not work');
        }
      } else if (userData.email) {
        // If no explicit credentials but we have email, user might need to re-login for notifications
        console.log('[AuthContext] No Supabase credentials provided - notifications require email login');
      }

      // Handle notifications
      if (notifications) {
        if (notifications.welcome_bonus) {
          setCreditNotification({
            type: 'welcome_bonus',
            title: 'Welcome Bonus!',
            message: notifications.welcome_message || 'Here are your exclusive starter credits.',
            credits: 150
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
      
      // Sign out from Supabase Auth first
      await signOutFromSupabaseAuth();
      setIsSupabaseAuthReady(false);
      
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

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...userData };
      AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser)).catch(error => {
        console.error('Failed to update user data:', error);
      });
      return updatedUser;
    });
  }, []);

  const refreshCredits = useCallback(async (includeBreakdown: boolean = false) => {
    if (!user || creditSyncInFlight.current) return;
    creditSyncInFlight.current = true;
    try {
      if (includeBreakdown) {
        const info = await creditsApi.getCreditInfo();
        if (info) {
          const total = typeof info.total === 'number' ? info.total : (info.balance ?? user.credits ?? 0);
          updateUser({ credits: total, credit_breakdown: info });
          return;
        }
      }

      const balance = await creditsApi.getBalance();
      if (typeof balance === 'number') {
        updateUser({ credits: balance });
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    } finally {
      creditSyncInFlight.current = false;
    }
  }, [user, updateUser]);

  useEffect(() => {
    if (!user) return;

    refreshCredits(true);

    const intervalId = setInterval(() => {
      refreshCredits(false);
    }, 30000);

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshCredits(true);
      }
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [user?.id, refreshCredits]);

  const clearCreditNotification = () => {
    setCreditNotification(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSupabaseAuthReady,
    login,
    logout,
    updateUser,
    refreshCredits,
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
