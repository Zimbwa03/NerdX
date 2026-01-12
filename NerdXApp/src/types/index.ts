// TypeScript type definitions for NerdX App

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
    daily_credits_active: boolean;
    next_daily_reset: string;
  };
}

export interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface QuizSession {
  id: string;
  subject: string;
  topic: string;
  questions: QuizQuestion[];
  currentQuestion: number;
  score: number;
  totalQuestions: number;
  timeRemaining: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
}

export interface PaymentData {
  phoneNumber: string;
  amount: number;
  reference: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export type SubjectType = 'mathematics' | 'combined_science' | 'english';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  success: string;
  warning: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}
