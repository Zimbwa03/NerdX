// Credits API services for NerdX Web App
import api from './config';

export const creditsApi = {
  getBalance: async (): Promise<number> => {
    try {
      const response = await api.get('/api/mobile/credits/balance');
      return response.data.data?.balance || response.data.data?.credits || 0;
    } catch (error) {
      console.error('Get balance error:', error);
      return 0;
    }
  },

  getCreditInfo: async (): Promise<Record<string, unknown> | null> => {
    try {
      const response = await api.get('/api/mobile/credits/info');
      return response.data.data || null;
    } catch (error) {
      console.error('Get credit info error:', error);
      return null;
    }
  },
};
