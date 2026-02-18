import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { schoolApi, type SchoolProfile } from '../services/api/schoolDashboardApi';

const SCHOOL_TOKEN_KEY = '@school_auth_token';
const SCHOOL_DATA_KEY = '@school_data';

interface SchoolAuthContextType {
  school: SchoolProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  login: (slug: string, schoolId: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshSchool: () => Promise<void>;
}

const SchoolAuthContext = createContext<SchoolAuthContextType | undefined>(undefined);

function clearStoredSchoolAuth() {
  localStorage.removeItem(SCHOOL_TOKEN_KEY);
  localStorage.removeItem(SCHOOL_DATA_KEY);
}

function getStoredSchoolToken(): string | null {
  try {
    const token = localStorage.getItem(SCHOOL_TOKEN_KEY);
    const data = localStorage.getItem(SCHOOL_DATA_KEY);
    if (!token || !data) {
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

function getStoredSchool(): SchoolProfile | null {
  try {
    const token = localStorage.getItem(SCHOOL_TOKEN_KEY);
    const data = localStorage.getItem(SCHOOL_DATA_KEY);
    if (!token || !data) {
      clearStoredSchoolAuth();
      return null;
    }
    return JSON.parse(data) as SchoolProfile;
  } catch {
    clearStoredSchoolAuth();
    return null;
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    return err.response?.data?.error || err.message || fallback;
  }
  return fallback;
}

export function SchoolAuthProvider({ children }: { children: ReactNode }) {
  const [school, setSchool] = useState<SchoolProfile | null>(() => getStoredSchool());
  const [token, setToken] = useState<string | null>(() => getStoredSchoolToken());
  const isLoading = false;

  const login = useCallback(async (slug: string, schoolId: string) => {
    try {
      const result = await schoolApi.loginBySlug(slug, schoolId);
      if (result.token && result.school) {
        setToken(result.token);
        setSchool(result.school);
        localStorage.setItem(SCHOOL_TOKEN_KEY, result.token);
        localStorage.setItem(SCHOOL_DATA_KEY, JSON.stringify(result.school));
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error: unknown) {
      const msg = getErrorMessage(error, 'Login failed');
      return { success: false, error: msg };
    }
  }, []);

  const logout = useCallback(() => {
    if (token) {
      schoolApi.logout(token).catch(() => {});
    }
    setToken(null);
    setSchool(null);
    clearStoredSchoolAuth();
  }, [token]);

  const refreshSchool = useCallback(async () => {
    if (!token) return;
    try {
      const data = await schoolApi.getMe(token);
      if (data) {
        setSchool(data);
        localStorage.setItem(SCHOOL_DATA_KEY, JSON.stringify(data));
      }
    } catch {
      // silent
    }
  }, [token]);

  return (
    <SchoolAuthContext.Provider
      value={{
        school,
        isLoading,
        isAuthenticated: !!token && !!school,
        token,
        login,
        logout,
        refreshSchool,
      }}
    >
      {children}
    </SchoolAuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSchoolAuth() {
  const ctx = useContext(SchoolAuthContext);
  if (!ctx) throw new Error('useSchoolAuth must be used within SchoolAuthProvider');
  return ctx;
}

export function SchoolProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, school } = useSchoolAuth();
  const { schoolSlug } = useParams();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0f172a', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600 }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/school/${schoolSlug || school?.slug || ''}`} replace />;
  }

  return <>{children}</>;
}
