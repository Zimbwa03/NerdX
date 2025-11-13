// User Types
export interface User {
  id: string;
  nerdx_id: string;
  name: string;
  surname: string;
  phone_number?: string;
  email?: string;
  credits: number;
  total_points: number;
  streak_count: number;
  referred_by?: string;
  created_at: string;
}

export interface UserStats {
  credits: number;
  total_points: number;
  streak_count: number;
  accuracy: number;
  questions_answered: number;
  last_activity: string;
}

// Auth Types
export interface LoginCredentials {
  phone_number?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  name: string;
  surname: string;
  phone_number?: string;
  email?: string;
  password: string;
  date_of_birth?: string;
  referred_by?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// Quiz Types
export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Topic {
  id: string;
  name: string;
  subject: string;
}

export interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'short_answer' | 'essay';
  options?: string[];
  correct_answer: string;
  solution?: string;
  points: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizSession {
  id: string;
  subject: string;
  topic?: string;
  session_type: 'topical' | 'exam';
  current_question?: Question;
  questions_answered: number;
  correct_answers: number;
  started_at: string;
}

// Credit Types
export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  description?: string;
}

export interface CreditTransaction {
  id: string;
  type: 'earned' | 'spent' | 'purchased';
  amount: number;
  description: string;
  created_at: string;
}

// Payment Types
export interface PaymentRequest {
  package_id: string;
  payment_method: 'paynow' | 'ecocash';
}

export interface PaymentStatus {
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  credits: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  OTPVerification: {phone_number: string};
  Main: undefined;
  Dashboard: undefined;
  Subjects: undefined;
  Topics: {subject: string};
  Quiz: {subject: string; topic?: string; type: 'topical' | 'exam'};
  Credits: undefined;
  Packages: undefined;
  Payment: {package_id: string};
  Profile: undefined;
  Settings: undefined;
  MathGraph: undefined;
  EnglishComprehension: undefined;
  EnglishEssay: undefined;
};

