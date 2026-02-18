import axios from 'axios';
import { API_BASE_URL } from './config';

const BASE = `${API_BASE_URL}/api/school-portal`;

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    return err.response?.data?.error || err.message || fallback;
  }
  return fallback;
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SchoolProfile {
  id: number;
  school_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  contact_person: string | null;
  subscription_type?: string;
  subscription_expires_at: string | null;
  subscription_started_at?: string | null;
}

export interface SchoolLoginResponse {
  token: string;
  school: SchoolProfile;
}

export interface RevenueInfo {
  per_student: number;
  total_monthly: number;
  school_share: number;
  school_share_percent: number;
  nerdx_share: number;
  nerdx_share_percent: number;
  total_paid: number;
  total_pending: number;
  amount_due: number;
}

export interface DailyActivity {
  date: string;
  sessions: number;
  questions: number;
  time_minutes: number;
}

export interface SubjectDistribution {
  subject: string;
  count: number;
}

export interface SchoolOverview {
  total_students: number;
  active_students: number;
  subscription_active: boolean;
  subscription_expires_at: string | null;
  days_remaining: number;
  revenue: RevenueInfo;
  daily_activity: DailyActivity[];
  subject_distribution: SubjectDistribution[];
}

export interface SchoolStudent {
  id: number;
  name: string;
  level: string;
  xp: number;
  app_level: number;
  streak: number;
  credits: number;
  daily_credits_used: number;
  last_active: string | null;
  is_active: boolean;
  joined_at: string | null;
}

export interface StudentActivity {
  date: string;
  sessions: number;
  questions: number;
  time_minutes: number;
  subjects: string[];
}

export interface StudentSummary {
  total_sessions: number;
  total_questions: number;
  total_time_minutes: number;
  subjects_used: string[];
  days_active: number;
}

export interface SchoolStudentDetail {
  student: SchoolStudent;
  summary: StudentSummary;
  activity: StudentActivity[];
}

export interface SchoolPayment {
  id: number;
  school_id: string;
  amount: number;
  num_students: number;
  period_start: string | null;
  period_end: string | null;
  payment_method: string;
  paynow_reference: string | null;
  paynow_poll_url: string | null;
  status: string;
  receipt_url: string | null;
  notes: string | null;
  admin_notes: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinanceSummary {
  num_students: number;
  per_student_fee: number;
  total_monthly_revenue: number;
  school_earnings: number;
  school_share_percent: number;
  nerdx_share: number;
  nerdx_share_percent: number;
  total_paid: number;
  total_pending: number;
  amount_due: number;
  payments: SchoolPayment[];
}

export interface SchoolPublicInfo {
  name: string;
  slug: string;
  logo_url: string | null;
}

// ─── API Calls ──────────────────────────────────────────────────────────────────

export const schoolApi = {
  async getSchoolBySlug(slug: string): Promise<SchoolPublicInfo | null> {
    try {
      const { data } = await axios.get(`${BASE}/school-by-slug/${slug}`);
      return data;
    } catch {
      return null;
    }
  },

  async loginBySlug(slug: string, schoolId: string): Promise<SchoolLoginResponse> {
    const { data } = await axios.post(`${BASE}/login-by-slug`, { slug, school_id: schoolId });
    return data;
  },

  async login(schoolName: string, schoolId: string): Promise<SchoolLoginResponse> {
    const { data } = await axios.post(`${BASE}/login`, { school_name: schoolName, school_id: schoolId });
    return data;
  },

  async getMe(token: string): Promise<SchoolProfile | null> {
    try {
      const { data } = await axios.get(`${BASE}/me`, { headers: authHeaders(token) });
      return data;
    } catch {
      return null;
    }
  },

  async logout(token: string): Promise<void> {
    try {
      await axios.post(`${BASE}/logout`, {}, { headers: authHeaders(token) });
    } catch {
      // silent
    }
  },

  async getOverview(token: string): Promise<SchoolOverview | null> {
    try {
      const { data } = await axios.get(`${BASE}/overview`, { headers: authHeaders(token) });
      return data;
    } catch {
      return null;
    }
  },

  async getStudents(token: string): Promise<{ students: SchoolStudent[]; total: number }> {
    try {
      const { data } = await axios.get(`${BASE}/students`, { headers: authHeaders(token) });
      return data;
    } catch {
      return { students: [], total: 0 };
    }
  },

  async getStudentDetail(token: string, studentId: number): Promise<SchoolStudentDetail | null> {
    try {
      const { data } = await axios.get(`${BASE}/students/${studentId}`, { headers: authHeaders(token) });
      return data;
    } catch {
      return null;
    }
  },

  async getFinanceSummary(token: string): Promise<FinanceSummary | null> {
    try {
      const { data } = await axios.get(`${BASE}/finance/summary`, { headers: authHeaders(token) });
      return data;
    } catch {
      return null;
    }
  },

  async getPayments(token: string): Promise<SchoolPayment[]> {
    try {
      const { data } = await axios.get(`${BASE}/finance/payments`, { headers: authHeaders(token) });
      return data.payments || [];
    } catch {
      return [];
    }
  },

  async payEcocash(token: string, phoneNumber: string, amount: number, email?: string): Promise<{ success: boolean; reference?: string; poll_url?: string; instructions?: string; error?: string }> {
    try {
      const { data } = await axios.post(`${BASE}/finance/pay-ecocash`, { phone_number: phoneNumber, amount, email }, { headers: authHeaders(token) });
      return data;
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage(error, 'Payment failed') };
    }
  },

  async checkPaymentStatus(token: string, reference: string): Promise<{ status: string; paid: boolean }> {
    try {
      const { data } = await axios.get(`${BASE}/finance/payment-status/${reference}`, { headers: authHeaders(token) });
      return data;
    } catch {
      return { status: 'unknown', paid: false };
    }
  },

  async uploadReceipt(token: string, receiptData: string, amount: number, notes?: string): Promise<{ success: boolean; reference?: string; error?: string }> {
    try {
      const { data } = await axios.post(`${BASE}/finance/upload-receipt`, { receipt_data: receiptData, amount, notes }, { headers: authHeaders(token) });
      return data;
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage(error, 'Upload failed') };
    }
  },
};
