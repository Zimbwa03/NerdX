// TypeScript type definitions for NerdX Web App

export interface User {
  id: string;
  nerdx_id?: string;
  name: string;
  surname: string;
  email?: string;
  phone_number?: string;
  credits: number;
  credit_breakdown?: {
    total: number;
    free_credits: number;
    purchased_credits: number;
    welcome_bonus_claimed: boolean;
  };
}
