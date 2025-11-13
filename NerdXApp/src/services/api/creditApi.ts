import apiClient from './config';
import {CreditPackage, CreditTransaction} from '../../types';

export const creditApi = {
  // Get credit balance
  getBalance: async (): Promise<number> => {
    const response = await apiClient.get('/credits/balance');
    return response.data.data?.balance || 0;
  },

  // Get credit transactions
  getTransactions: async (): Promise<CreditTransaction[]> => {
    const response = await apiClient.get('/credits/transactions');
    return response.data.data || [];
  },

  // Get credit packages
  getPackages: async (): Promise<CreditPackage[]> => {
    const response = await apiClient.get('/credits/packages');
    return response.data.data || [];
  },

  // Initiate credit purchase
  initiatePurchase: async (package_id: string): Promise<{
    reference: string;
    payment_url?: string;
    amount: number;
  }> => {
    const response = await apiClient.post('/credits/purchase', {
      package_id,
    });
    return response.data.data;
  },
};

