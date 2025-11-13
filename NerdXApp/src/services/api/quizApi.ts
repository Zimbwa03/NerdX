import apiClient from './config';
import {Subject, Topic, Question, QuizSession} from '../../types';

export const quizApi = {
  // Get all subjects
  getSubjects: async (): Promise<Subject[]> => {
    const response = await apiClient.get('/quiz/subjects');
    return response.data.data || [];
  },

  // Get topics for a subject
  getTopics: async (subject: string): Promise<Topic[]> => {
    const response = await apiClient.get(`/quiz/topics?subject=${subject}`);
    return response.data.data || [];
  },

  // Generate a question
  generateQuestion: async (data: {
    subject: string;
    topic?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    type: 'topical' | 'exam';
  }): Promise<Question> => {
    const response = await apiClient.post('/quiz/generate', data);
    return response.data.data;
  },

  // Submit answer
  submitAnswer: async (data: {
    question_id: string;
    answer: string;
    session_id?: string;
  }): Promise<{
    correct: boolean;
    feedback: string;
    solution?: string;
    points_earned: number;
    credits_used: number;
  }> => {
    const response = await apiClient.post('/quiz/submit-answer', data);
    return response.data.data;
  },

  // Get current session
  getSession: async (session_id: string): Promise<QuizSession> => {
    const response = await apiClient.get(`/quiz/session/${session_id}`);
    return response.data.data;
  },

  // Start new session
  startSession: async (data: {
    subject: string;
    topic?: string;
    type: 'topical' | 'exam';
  }): Promise<QuizSession> => {
    const response = await apiClient.post('/quiz/start-session', data);
    return response.data.data;
  },
};

