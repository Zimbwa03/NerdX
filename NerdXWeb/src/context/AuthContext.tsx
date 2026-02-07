// Authentication context provider for NerdX Web App
import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { User } from '../types';
import { creditsApi } from '../services/api/creditsApi';
import { setAuthToken, clearAuthToken } from '../services/api/config';
import { signInToSupabaseAuth, signOutFromSupabaseAuth } from '../services/supabase';

const USER_DATA_KEY = '@user_data';

export interface SupabaseAuthCredentials {
  email: string;
  password: string;
}

export interface CreditNotificationData {
  type: 'welcome_bonus';
  title: string;
  message: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSupabaseAuthReady: boolean;
  login: (userData: User, token: string, notifications?: Record<string, unknown>, supabaseCredentials?: SupabaseAuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshCredits: (includeBreakdown?: boolean) => Promise<void>;
  creditNotification: CreditNotificationData | null;
  clearCreditNotification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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
      const token = localStorage.getItem('@auth_token');
      const userData = localStorage.getItem(USER_DATA_KEY);

      if (token && userData) {
        const parsedUser = JSON.parse(userData) as User;
        setUser(parsedUser);

        // Try to restore Supabase session with a timeout to prevent infinite loading
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Supabase session check timeout')), 5000)
          );

          const supabasePromise = (async () => {
            const { supabase } = await import('../services/supabase');
            const { data } = await supabase.auth.getSession();
            if (data?.session?.user) {
              setIsSupabaseAuthReady(true);
            }
          })();

          await Promise.race([supabasePromise, timeoutPromise]);
        } catch (supabaseError) {
          console.warn('Supabase session restoration failed or timed out:', supabaseError);
          // Continue anyway - user can still use the app, just won't have Supabase features
        }
      }
    } catch (error) {
      console.error('Failed to load auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User, token: string, notifications?: Record<string, unknown>, supabaseCredentials?: SupabaseAuthCredentials) => {
    setAuthToken(token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    setUser(userData);

    if (supabaseCredentials?.email && supabaseCredentials?.password) {
      const success = await signInToSupabaseAuth(supabaseCredentials.email, supabaseCredentials.password);
      setIsSupabaseAuthReady(success);
    }

    if (notifications?.welcome_bonus) {
      setCreditNotification({
        type: 'welcome_bonus',
        title: 'Welcome Bonus!',
        message: (notifications.welcome_message as string) || 'Here are your exclusive starter credits.',
        credits: 150
      });
    }
  };

  const logout = async () => {
    await signOutFromSupabaseAuth();
    setIsSupabaseAuthReady(false);
    clearAuthToken();
    localStorage.removeItem(USER_DATA_KEY);
    setUser(null);
    setCreditNotification(null);
  };

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...userData };
      try {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      } catch (e) {
        console.error('Failed to update user data:', e);
      }
      return updatedUser;
    });
  }, []);

  const refreshCredits = useCallback(async (includeBreakdown = false) => {
    if (!user || creditSyncInFlight.current) return;
    creditSyncInFlight.current = true;
    try {
      if (includeBreakdown) {
        const info = await creditsApi.getCreditInfo();
        if (info) {
          const total = typeof info.total === 'number' ? info.total : ((info.balance ?? user.credits ?? 0) as number);
          updateUser({ credits: total, credit_breakdown: info as User['credit_breakdown'] | undefined });
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
    const intervalId = setInterval(() => refreshCredits(false), 30000);
    return () => clearInterval(intervalId);
  }, [user?.id, refreshCredits]);

  const clearCreditNotification = () => setCreditNotification(null);

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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
