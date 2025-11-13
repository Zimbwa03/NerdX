import apiClient from './config';
import {PaymentRequest, PaymentStatus} from '../../types';

export const paymentApi = {
  // Initiate payment
  initiatePayment: async (data: PaymentRequest): Promise<{
    reference: string;
    payment_url?: string;
    instructions?: string;
  }> => {
    const response = await apiClient.post('/payment/initiate', data);
    return response.data.data;
  },

  // Check payment status
  checkStatus: async (reference: string): Promise<PaymentStatus> => {
    const response = await apiClient.get(`/payment/status/${reference}`);
    return response.data.data;
  },
};

