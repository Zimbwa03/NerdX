// User API services
import api from './config';

export interface UserProfile {
  id: string;
  nerdx_id: string;
  name: string;
  surname: string;
  email?: string;
  phone_number?: string;
  credits: number;
  date_of_birth?: string;
}

export interface UserStats {
  credits: number;
  total_points: number;
  streak_count: number;
  accuracy: number;
  questions_answered: number;
  last_activity?: string;
}

export const userApi = {
  getProfile: async (): Promise<UserProfile | null> => {
    try {
      const response = await api.get('/api/mobile/user/profile');
      return response.data.data || null;
    } catch (error: any) {
      console.error('Get profile error:', error);
      return null;
    }
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      const response = await api.put('/api/mobile/user/profile', data);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  getStats: async (): Promise<UserStats | null> => {
    try {
      const response = await api.get('/api/mobile/user/stats');
      return response.data.data || null;
    } catch (error: any) {
      console.error('Get stats error:', error);
      return null;
    }
  },
};
