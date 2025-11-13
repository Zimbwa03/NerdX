import apiClient from './config';
import {User, UserStats} from '../../types';

export const userApi = {
  // Get user stats
  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get('/user/stats');
    return response.data.data;
  },

  // Get question history
  getHistory: async (limit = 50): Promise<any[]> => {
    const response = await apiClient.get(`/user/history?limit=${limit}`);
    return response.data.data || [];
  },

  // Get referral code
  getReferralCode: async (): Promise<string> => {
    const response = await apiClient.get('/referral/code');
    return response.data.data?.code || '';
  },

  // Apply referral code
  applyReferralCode: async (code: string): Promise<{
    success: boolean;
    credits_earned: number;
  }> => {
    const response = await apiClient.post('/referral/apply', {code});
    return response.data.data;
  },

  // Get referral stats
  getReferralStats: async (): Promise<{
    total_referrals: number;
    credits_earned: number;
  }> => {
    const response = await apiClient.get('/referral/stats');
    return response.data.data;
  },
};

