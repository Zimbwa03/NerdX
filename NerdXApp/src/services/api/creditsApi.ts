// Credits API services
import api from './config';

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  description: string;
}

export interface CreditTransaction {
  id: string;
  transaction_type: string;
  credits_change: number;
  balance_before: number;
  balance_after: number;
  description: string;
  transaction_date: string;
}

export const creditsApi = {
  getBalance: async (): Promise<number> => {
    try {
      const response = await api.get('/api/mobile/credits/balance');
      return response.data.data?.credits || 0;
    } catch (error: any) {
      console.error('Get balance error:', error);
      return 0;
    }
  },

  getPackages: async (): Promise<CreditPackage[]> => {
    try {
      const response = await api.get('/api/mobile/credits/packages');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Get packages error:', error);
      return [];
    }
  },

  getTransactions: async (limit: number = 20): Promise<CreditTransaction[]> => {
    try {
      const response = await api.get(`/api/mobile/credits/transactions?limit=${limit}`);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Get transactions error:', error);
      return [];
    }
  },

  purchaseCredits: async (packageId: string): Promise<{ reference: string; payment_url?: string; amount: number } | null> => {
    try {
      const response = await api.post('/api/mobile/credits/purchase', {
        package_id: packageId,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Purchase credits error:', error);
      throw error;
    }
  },
};
