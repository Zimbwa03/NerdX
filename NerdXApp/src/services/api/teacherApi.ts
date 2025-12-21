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
  graph_url?: string;
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
      console.log('teacherApi.startSession called with:', { subject, grade_level, topic });
      const response = await api.post('/api/mobile/teacher/start', {
        subject,
        grade_level,
        topic,
      });
      console.log('teacherApi.startSession response:', response.data);
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

  // ==================== Multimodal Features ====================

  // Send multimodal message (with images, audio, video, documents)
  sendMultimodalMessage: async (
    message: string,
    attachments: Attachment[]
  ): Promise<TeacherMessageResponse | null> => {
    try {
      const response = await api.post('/api/mobile/teacher/multimodal', {
        message,
        attachments,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Multimodal message error:', error);
      throw error;
    }
  },

  // Analyze a science image (diagrams, lab results)
  analyzeImage: async (
    imageBase64: string,
    mimeType: string = 'image/png',
    prompt?: string
  ): Promise<ImageAnalysis | null> => {
    try {
      const response = await api.post('/api/mobile/teacher/analyze-image', {
        image: imageBase64,
        mime_type: mimeType,
        prompt,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Analyze image error:', error);
      throw error;
    }
  },

  // Analyze a study document (textbook pages, past papers)
  analyzeDocument: async (
    documentBase64: string,
    mimeType: string = 'application/pdf',
    prompt?: string
  ): Promise<DocumentAnalysis | null> => {
    try {
      const response = await api.post('/api/mobile/teacher/analyze-document', {
        document: documentBase64,
        mime_type: mimeType,
        prompt,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Analyze document error:', error);
      throw error;
    }
  },

  // Web search with Google grounding for science topics
  searchWeb: async (query: string): Promise<WebSearchResult | null> => {
    try {
      const response = await api.post('/api/mobile/teacher/search', {
        query,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Web search error:', error);
      throw error;
    }
  },

  // Deep Research using Gemini Deep Research agent
  deepResearch: async (query: string): Promise<DeepResearchResult | null> => {
    try {
      console.log('teacherApi.deepResearch called with:', query);
      const response = await api.post('/api/mobile/teacher/deep-research', {
        query,
      });
      console.log('teacherApi.deepResearch response:', response.data);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Deep research error:', error);
      throw error;
    }
  },
};

// ==================== Additional Interfaces ====================

export interface Attachment {
  type: 'image' | 'audio' | 'video' | 'document';
  data: string; // Base64-encoded data
  mime_type: string;
}

export interface ImageAnalysis {
  analysis: string;
}

export interface DocumentAnalysis {
  analysis: string;
}

export interface WebSearchResult {
  response: string;
}

export interface DeepResearchResult {
  response: string;
  status?: string;
}
