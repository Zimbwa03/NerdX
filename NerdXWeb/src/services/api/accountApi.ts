// Account API services for NerdX Web
// Ported from NerdXApp to keep feature parity (referrals, billing, security, preferences, AI insights).

import api from './config';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ReferredUser {
  name: string;
  surname: string;
  joined_date: string;
  nerdx_id: string;
}

export interface ReferralStats {
  referral_code: string;
  total_referrals: number;
  successful_referrals: number;
  total_bonus_earned: number;
  last_referral_date: string | null;
  referred_users: ReferredUser[];
}

export interface ReferralShareLink {
  referral_code: string;
  whatsapp_link: string;
  share_message: string;
  bonus_per_referral: number;
}

export interface SubscriptionInfo {
  subscription_started_at: string | null;
  subscription_expires_at: string | null;
  is_active: boolean;
}

export interface CreditBalance {
  total: number;
  purchased: number;
  free: number;
}

export interface PaymentRecord {
  id: number;
  reference: string;
  amount: number;
  credits: number;
  status: string;
  payment_method: string;
  date: string;
  type: 'payment';
}

export interface CreditTransaction {
  id: number;
  action: string;
  type: string;
  credits_change: number;
  description: string;
  date: string;
}

export interface BillingHistory {
  subscription: SubscriptionInfo;
  credit_balance: CreditBalance;
  payments: PaymentRecord[];
  credit_transactions: CreditTransaction[];
}

export interface InvoiceCustomer {
  name: string;
  email: string;
  nerdx_id: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  invoice_number: string;
  reference: string;
  date: string;
  status: string;
  customer: InvoiceCustomer;
  items: InvoiceItem[];
  payment_method: string;
  subtotal: number;
  total: number;
  currency: string;
}

export interface DeviceInfo {
  platform?: string;
  model?: string;
  os_version?: string;
  app_version?: string;
}

export interface LoginSession {
  id: number;
  device_info: DeviceInfo;
  ip_address: string;
  login_at: string;
  logout_at?: string;
  is_active: boolean;
  is_current?: boolean;
}

export interface UserPreferences {
  preferred_subjects: string[];
  exam_level: 'O Level' | 'A Level';
  target_exam_date: string | null;
  daily_question_goal: number;
  study_time_goal_minutes: number;
  difficulty_preference: 'easy' | 'medium' | 'hard' | 'adaptive';
  notification_reminders: boolean;
  notification_achievements: boolean;
  notification_tips: boolean;
  theme_preference: 'light' | 'dark' | 'system';
  school_name: string | null;
  grade_level: string | null;
}

export interface SkillInsight {
  skill_name: string;
  subject: string;
  topic: string;
  mastery: number;
  status: 'mastered' | 'proficient' | 'learning' | 'struggling';
  recommendation?: string;
}

export interface DailyBreakdown {
  date: string;
  count: number;
}

export interface WeeklyTrend {
  total_questions: number;
  correct_answers: number;
  accuracy: number;
  active_days: number;
  daily_breakdown: DailyBreakdown[];
}

export interface StudyPlanItem {
  priority: 'high' | 'medium' | 'low';
  action: string;
  description: string;
  estimated_time: string;
}

export interface FailedArea {
  skill_id: string;
  skill_name: string;
  subject: string;
  topic: string;
  fail_count: number;
}

export interface AIInsights {
  health_score: number;
  total_skills: number;
  mastered_count: number;
  learning_count: number;
  struggling_count: number;
  strengths: SkillInsight[];
  focus_areas: SkillInsight[];
  weekly_trend: WeeklyTrend;
  study_plan: StudyPlanItem[];
  personalized_message: string;
  failed_areas?: FailedArea[];
  net_decks_message?: string;
  last_updated: string;
}

// ============================================================================
// API METHODS
// ============================================================================

export const accountApi = {
  // REFERRALS
  getReferralStats: async (): Promise<ReferralStats | null> => {
    try {
      const response = await api.get('/api/mobile/user/referral-stats');
      return response.data?.data || null;
    } catch (error) {
      console.error('Get referral stats error:', error);
      return null;
    }
  },

  getReferralShareLink: async (): Promise<ReferralShareLink | null> => {
    try {
      const response = await api.get('/api/mobile/user/referral-share');
      return response.data?.data || null;
    } catch (error) {
      console.error('Get referral share link error:', error);
      return null;
    }
  },

  // BILLING
  getBillingHistory: async (limit: number = 50): Promise<BillingHistory | null> => {
    try {
      const response = await api.get('/api/mobile/user/billing-history', { params: { limit } });
      return response.data?.data || null;
    } catch (error) {
      console.error('Get billing history error:', error);
      return null;
    }
  },

  getInvoice: async (paymentId: number): Promise<Invoice | null> => {
    try {
      const response = await api.get(`/api/mobile/user/invoice/${paymentId}`);
      return response.data?.data || null;
    } catch (error) {
      console.error('Get invoice error:', error);
      return null;
    }
  },

  // SECURITY
  getLoginHistory: async (limit: number = 20): Promise<LoginSession[]> => {
    try {
      const response = await api.get('/api/mobile/user/login-history', { params: { limit } });
      return response.data?.data?.sessions || [];
    } catch (error) {
      console.error('Get login history error:', error);
      return [];
    }
  },

  getActiveSessions: async (): Promise<LoginSession[]> => {
    try {
      const response = await api.get('/api/mobile/user/sessions');
      return response.data?.data?.sessions || [];
    } catch (error) {
      console.error('Get active sessions error:', error);
      return [];
    }
  },

  logoutSession: async (sessionId: number): Promise<boolean> => {
    try {
      await api.delete(`/api/mobile/user/sessions/${sessionId}`);
      return true;
    } catch (error) {
      console.error('Logout session error:', error);
      return false;
    }
  },

  changePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/api/mobile/user/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return {
        success: !!response.data?.success,
        message: response.data?.message || 'Password changed successfully',
      };
    } catch (error: any) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Failed to change password',
      };
    }
  },

  // PREFERENCES
  getPreferences: async (): Promise<UserPreferences | null> => {
    try {
      const response = await api.get('/api/mobile/user/preferences');
      return response.data?.data || null;
    } catch (error) {
      console.error('Get preferences error:', error);
      return null;
    }
  },

  updatePreferences: async (prefs: Partial<UserPreferences>): Promise<UserPreferences | null> => {
    const response = await api.put('/api/mobile/user/preferences', prefs);
    return response.data?.data || null;
  },

  // AI INSIGHTS
  getAIInsights: async (): Promise<AIInsights | null> => {
    try {
      const response = await api.get('/api/mobile/dkt/ai-insights');
      return response.data?.data || null;
    } catch (error) {
      console.error('Get AI insights error:', error);
      return null;
    }
  },
};

export default accountApi;

