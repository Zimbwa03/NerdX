// English API services
import api from './config';

export interface ComprehensionData {
  passage: string;
  questions: Array<{
    question: string;
    answer: string;
    type: string;
    order: number;
    marks: number;
  }>;
}

export interface EssayResult {
  essay_id: string;
  score: number;
  feedback: string;
  report_url?: string;
}

export const englishApi = {
  generateComprehension: async (): Promise<ComprehensionData | null> => {
    try {
      const response = await api.post('/api/mobile/english/comprehension');
      return response.data.data || null;
    } catch (error: any) {
      console.error('Generate comprehension error:', error);
      throw error;
    }
  },

  submitEssay: async (
    prompt: string,
    essayText: string
  ): Promise<EssayResult | null> => {
    try {
      const response = await api.post('/api/mobile/english/essay', {
        prompt,
        essay_text: essayText,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Submit essay error:', error);
      throw error;
    }
  },

  getEssayReport: async (essayId: string): Promise<{ report_url: string } | null> => {
    try {
      const response = await api.get(`/api/mobile/english/essay/${essayId}/report`);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Get essay report error:', error);
      return null;
    }
  },
};
