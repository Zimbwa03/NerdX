import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { teacherPortalApi, type TeacherProfile } from '../services/api/teacherPortalApi';

const TEACHER_TOKEN_KEY = '@teacher_auth_token';
const TEACHER_DATA_KEY = '@teacher_data';
const TEACHER_SCHOOL_KEY = '@teacher_school_data';

interface TeacherSchoolInfo {
  school_id: string;
  name: string;
  slug: string | null;
  logo_url: string | null;
}

interface TeacherAuthContextType {
  teacher: TeacherProfile | null;
  school: TeacherSchoolInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  login: (schoolId: string, loginCode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshTeacher: () => Promise<void>;
}

const TeacherAuthContext = createContext<TeacherAuthContextType | undefined>(undefined);

function clearStoredTeacherAuth() {
  localStorage.removeItem(TEACHER_TOKEN_KEY);
  localStorage.removeItem(TEACHER_DATA_KEY);
  localStorage.removeItem(TEACHER_SCHOOL_KEY);
}

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TEACHER_TOKEN_KEY);
  } catch {
    return null;
  }
}

function getStoredTeacher(): TeacherProfile | null {
  try {
    const data = localStorage.getItem(TEACHER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function getStoredSchool(): TeacherSchoolInfo | null {
  try {
    const data = localStorage.getItem(TEACHER_SCHOOL_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
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

export function TeacherAuthProvider({ children }: { children: ReactNode }) {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(() => getStoredTeacher());
  const [school, setSchool] = useState<TeacherSchoolInfo | null>(() => getStoredSchool());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const isLoading = false;

  const login = useCallback(async (schoolId: string, loginCode: string) => {
    try {
      const result = await teacherPortalApi.login(schoolId, loginCode);
      if (result.token && result.teacher) {
        setToken(result.token);
        setTeacher(result.teacher as TeacherProfile);
        setSchool(result.school);
        localStorage.setItem(TEACHER_TOKEN_KEY, result.token);
        localStorage.setItem(TEACHER_DATA_KEY, JSON.stringify(result.teacher));
        localStorage.setItem(TEACHER_SCHOOL_KEY, JSON.stringify(result.school));
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage(error, 'Login failed') };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTeacher(null);
    setSchool(null);
    clearStoredTeacherAuth();
  }, []);

  const refreshTeacher = useCallback(async () => {
    if (!token) return;
    try {
      const data = await teacherPortalApi.getMe(token);
      if (data) {
        setTeacher(data);
        localStorage.setItem(TEACHER_DATA_KEY, JSON.stringify(data));
      }
    } catch {
      // silent
    }
  }, [token]);

  return (
    <TeacherAuthContext.Provider
      value={{ teacher, school, isLoading, isAuthenticated: !!token && !!teacher, token, login, logout, refreshTeacher }}
    >
      {children}
    </TeacherAuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTeacherAuth() {
  const ctx = useContext(TeacherAuthContext);
  if (!ctx) throw new Error('useTeacherAuth must be used within TeacherAuthProvider');
  return ctx;
}

export function TeacherProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useTeacherAuth();
  const { schoolId } = useParams();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0A0A0A', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600 }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/school/${schoolId || ''}/teacher-login`} replace />;
  }

  return <>{children}</>;
}
