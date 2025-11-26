// Teacher Mode API services
import api from './config';
import HybridAIService from '../HybridAIService';

export interface TeacherSession {
  session_id: string;
  subject: string;
  grade_level: string;
  topic?: string;
  initial_message: string;
}

export interface TeacherMessageResponse {
  response: string;
  session_id: string;
  session_ended?: boolean;
}

export interface TeacherNotes {
  notes: any;
  pdf_url?: string;
}

export const teacherApi = {
  startSession: async (
    subject: string,
    grade_level: string,
    topic?: string
  ): Promise<TeacherSession | null> => {
    try {
      const response = await api.post('/api/mobile/teacher/start', {
        subject,
        grade_level,
        topic,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Start teacher session error:', error);
      throw error;
    }
  },

  sendMessage: async (
    sessionId: string,
    message: string
  ): Promise<TeacherMessageResponse | null> => {
    try {
      const response = await api.post('/api/mobile/teacher/message', {
        session_id: sessionId,
        message,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Send teacher message error:', error);
      throw error;
    }
  },

  generateNotes: async (sessionId: string): Promise<TeacherNotes | null> => {
    try {
      const response = await api.post('/api/mobile/teacher/generate-notes', {
        session_id: sessionId,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Generate notes error:', error);
      throw error;
    }
  },

  // AI Help (Hybrid Online/Offline)
  getAIHelp: async (question: string, subject: string = 'general'): Promise<string> => {
    try {
      const response = await HybridAIService.generateResponse(
        question,
        subject === 'mathematics' || subject === 'english' || subject === 'science' ? subject : 'general',
        { maxTokens: 512 }
      );
      return response.text;
    } catch (error) {
      console.error('Teacher AI help error:', error);
      throw error;
    }
  },
};
