// Lesson Wallet API services for NerdX Web App
import api from './config';

export interface WalletBalance {
  balance: number;
  total_deposited: number;
  total_spent: number;
  lessons_available: number;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: 'top_up' | 'lesson_payment' | 'refund';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference: string;
  description: string;
  created_at: string;
}

export interface TopUpResult {
  success: boolean;
  reference?: string;
  poll_url?: string;
  redirect_url?: string;
  instructions?: string;
  amount?: number;
  payment_method?: string;
  message?: string;
}

export interface LessonPaymentResult {
  success: boolean;
  message: string;
  balance?: number;
  lesson_fee?: number;
  teacher_earning?: number;
  commission?: number;
  insufficient_funds?: boolean;
  already_paid?: boolean;
}

export interface TeacherEarningsSummary {
  pending: number;
  available: number;
  total_earned: number;
  total_paid: number;
}

export interface TeacherEarning {
  id: string;
  teacher_id: string;
  booking_id: string;
  lesson_fee: number;
  commission: number;
  teacher_amount: number;
  num_students: number;
  status: 'pending' | 'available' | 'paid' | 'cancelled';
  available_at: string;
  paid_at: string | null;
  payout_id: string | null;
  created_at: string;
}

export interface TeacherPayout {
  id: string;
  teacher_id: string;
  amount: number;
  earnings_count: number;
  payment_method: string;
  phone_number: string;
  status: 'processing' | 'completed' | 'failed';
  reference: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface EarningsDashboard {
  summary: TeacherEarningsSummary;
  recent_earnings: TeacherEarning[];
  recent_payouts: TeacherPayout[];
  lesson_fee: number;
  commission_rate: string;
  teacher_rate: number;
  minimum_payout: number;
  hold_days: number;
}

export type WalletPaymentMethod = 'ecocash' | 'visa_mastercard';

export const walletApi = {
  // ─── Student Wallet ─────────────────────────────────────────────────

  getBalance: async (): Promise<WalletBalance | null> => {
    try {
      const response = await api.get('/api/mobile/wallet/balance');
      return response.data.data || null;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        console.warn('Wallet balance: auth expired');
        return null;
      }
      console.error('Get wallet balance error:', error);
      return null;
    }
  },

  topUp: async (
    amount: number,
    paymentMethod: WalletPaymentMethod = 'ecocash',
    phoneNumber?: string,
    email?: string
  ): Promise<TopUpResult> => {
    try {
      const response = await api.post('/api/mobile/wallet/topup', {
        amount,
        payment_method: paymentMethod,
        phone_number: phoneNumber,
        email,
      }, { timeout: 45000 });
      return response.data.data || { success: false, message: 'No response data' };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err.response?.data?.message || err.message || 'Top-up failed';
      console.error('Wallet top-up error:', error);
      return { success: false, message: msg };
    }
  },

  completeTopUp: async (reference: string): Promise<{ success: boolean; balance?: number; message?: string }> => {
    try {
      const response = await api.post('/api/mobile/wallet/topup/complete', { reference });
      return response.data.data || { success: false };
    } catch (error) {
      console.error('Complete top-up error:', error);
      return { success: false, message: 'Failed to complete top-up' };
    }
  },

  getTransactions: async (limit: number = 20): Promise<WalletTransaction[]> => {
    try {
      const response = await api.get(`/api/mobile/wallet/transactions?limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Get wallet transactions error:', error);
      return [];
    }
  },

  // ─── Lesson Payment ─────────────────────────────────────────────────

  payForLesson: async (bookingId: string): Promise<LessonPaymentResult> => {
    try {
      const response = await api.post('/api/mobile/lesson/pay', {
        booking_id: bookingId,
      });
      return response.data.data || { success: false, message: 'No response' };
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string; data?: LessonPaymentResult } } };
      if (err.response?.status === 402) {
        return {
          success: false,
          message: err.response.data?.message || 'Insufficient funds',
          insufficient_funds: true,
          ...err.response.data?.data,
        };
      }
      console.error('Lesson pay error:', error);
      return { success: false, message: err.response?.data?.message || 'Payment failed' };
    }
  },

  refundLesson: async (bookingId: string, reason?: string): Promise<{ success: boolean; message: string; balance?: number }> => {
    try {
      const response = await api.post('/api/mobile/lesson/refund', {
        booking_id: bookingId,
        reason: reason || 'Lesson cancelled',
      });
      return response.data.data || { success: false, message: 'No response' };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error('Lesson refund error:', error);
      return { success: false, message: err.response?.data?.message || 'Refund failed' };
    }
  },

  // ─── Teacher Earnings ───────────────────────────────────────────────

  getEarningsDashboard: async (): Promise<EarningsDashboard | null> => {
    try {
      const response = await api.get('/api/mobile/teacher/earnings');
      return response.data.data || null;
    } catch (error) {
      console.error('Get earnings dashboard error:', error);
      return null;
    }
  },

  getEarningsHistory: async (limit: number = 50): Promise<TeacherEarning[]> => {
    try {
      const response = await api.get(`/api/mobile/teacher/earnings/history?limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Get earnings history error:', error);
      return [];
    }
  },

  requestPayout: async (phoneNumber: string): Promise<{ success: boolean; message: string; payout?: TeacherPayout }> => {
    try {
      const response = await api.post('/api/mobile/teacher/payout/request', {
        phone_number: phoneNumber,
      });
      return response.data.data || { success: false, message: 'No response' };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error('Request payout error:', error);
      return { success: false, message: err.response?.data?.message || 'Payout request failed' };
    }
  },

  completePayout: async (payoutId: string, reference: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/api/mobile/teacher/payout/complete', {
        payout_id: payoutId,
        reference,
      });
      return response.data.data || { success: false, message: 'No response' };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error('Complete payout error:', error);
      return { success: false, message: err.response?.data?.message || 'Payout completion failed' };
    }
  },

  getPayouts: async (limit: number = 20): Promise<TeacherPayout[]> => {
    try {
      const response = await api.get(`/api/mobile/teacher/payouts?limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Get payouts error:', error);
      return [];
    }
  },

  // ─── Lesson Cancellation ─────────────────────────────────────────

  cancelLesson: async (
    bookingId: string,
    cancelledBy: 'student' | 'teacher' | 'system',
    scheduledTime?: string,
    studentId?: string,
  ): Promise<{ success: boolean; refund_eligible?: boolean; reason?: string; refund?: { success: boolean; balance?: number } }> => {
    try {
      const response = await api.post('/api/mobile/lesson/cancel', {
        booking_id: bookingId,
        cancelled_by: cancelledBy,
        scheduled_time: scheduledTime || '',
        student_id: studentId,
      });
      return response.data.data || { success: false };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error('Cancel lesson error:', error);
      return { success: false, reason: err.response?.data?.message || 'Cancellation failed' };
    }
  },

  // ─── Payment Status (reuses existing endpoint) ─────────────────────

  checkPaymentStatus: async (reference: string): Promise<{ status: string; paid: boolean } | null> => {
    try {
      const response = await api.get(`/api/mobile/payment/status/${reference}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Check payment status error:', error);
      return null;
    }
  },
};
