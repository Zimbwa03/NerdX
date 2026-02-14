// Credits API services for NerdX Web App
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
  amount?: number;
}

export type PaymentMethod = 'ecocash' | 'visa_mastercard';

export interface PurchaseResult {
  reference: string;
  poll_url: string;
  instructions: string;
  amount: number;
  credits: number;
  payment_method: PaymentMethod;
  redirect_url?: string;
}

export interface PaymentStatus {
  reference: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'approved';
  amount: number;
  credits: number;
  paid: boolean;
}

export const creditsApi = {
  getBalance: async (): Promise<number | null> => {
    try {
      const response = await api.get('/api/mobile/credits/balance');
      const balance = response.data.data?.balance ?? response.data.data?.credits;
      return typeof balance === 'number' ? balance : 0;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        // Auth failure - return null so caller doesn't overwrite cached credits with 0
        console.warn('Credits balance: auth token expired or invalid');
        return null;
      }
      console.error('Get balance error:', error);
      return null;
    }
  },

  getCreditInfo: async (): Promise<Record<string, unknown> | null> => {
    try {
      const response = await api.get('/api/mobile/credits/info');
      return response.data.data || null;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        console.warn('Credits info: auth token expired or invalid');
      } else {
        console.error('Get credit info error:', error);
      }
      return null;
    }
  },

  getPackages: async (): Promise<CreditPackage[]> => {
    try {
      const response = await api.get('/api/mobile/credits/packages');
      return response.data.data || [];
    } catch (error) {
      console.error('Get packages error:', error);
      return [];
    }
  },

  getTransactions: async (limit: number = 20): Promise<CreditTransaction[]> => {
    try {
      const response = await api.get(`/api/mobile/credits/transactions?limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Get transactions error:', error);
      return [];
    }
  },

  purchaseCredits: async (
    packageId: string,
    paymentMethod: PaymentMethod = 'ecocash',
    phoneNumber?: string,
    email?: string
  ): Promise<PurchaseResult | null> => {
    try {
      if (!packageId) throw new Error('Package ID is required');

      const response = await api.post('/api/mobile/credits/purchase', {
        package_id: packageId,
        payment_method: paymentMethod,
        phone_number: phoneNumber,
        email: email,
      }, {
        timeout: 45000,
      });
      return response.data.data || null;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err.response?.data?.message || err.message || '';
      const isDatabaseError = errorMessage.toLowerCase().includes('save') ||
        errorMessage.toLowerCase().includes('transaction') ||
        errorMessage.toLowerCase().includes('database');

      if (!isDatabaseError) {
        console.error('Purchase credits error:', error);
      } else {
        console.warn('⚠️ Database save warning (payment prompt was sent successfully):', errorMessage);
      }

      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw error;
    }
  },

  checkPaymentStatus: async (reference: string): Promise<PaymentStatus | null> => {
    try {
      const response = await api.get(`/api/mobile/payment/status/${reference}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Check payment status error:', error);
      return null;
    }
  },

  getLatestPayment: async (): Promise<PurchaseResult | null> => {
    try {
      const response = await api.get('/api/mobile/payment/latest');
      return response.data.data || null;
    } catch (error) {
      console.error('Get latest payment error:', error);
      return null;
    }
  },
};
