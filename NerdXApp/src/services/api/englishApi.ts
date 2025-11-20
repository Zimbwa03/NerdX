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
  summary_question?: {
    question: string;
    max_words: number;
    marks: number;
    required_points: string[];
  };
}

export interface GradingResult {
  question_grades: Array<{
    question_index: number;
    marks_awarded: number;
    max_marks: number;
    feedback: string;
  }>;
  total_score: number;
  total_possible: number;
  overall_feedback: string;
}

export interface SummaryGradingResult {
  content_points: number;
  language_mark: number;
  total_score: number;
  max_score: number;
  word_count: number;
  feedback: string;
  key_points_missed: string[];
}

export interface EssayPrompt {
  title: string;
  description: string;
  type: string;
  suggested_length: string;
  context_notes?: string;
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

  generateEssayPrompts: async (): Promise<EssayPrompt[] | null> => {
    try {
      const response = await api.get('/api/mobile/english/essay/prompts');
      return response.data.data || null;
    } catch (error: any) {
      console.error('Generate essay prompts error:', error);
      return null;
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

  gradeComprehension: async (
    passage: string,
    questions: any[],
    answers: Record<string, string>
  ): Promise<GradingResult | null> => {
    try {
      const response = await api.post('/api/mobile/english/comprehension/grade', {
        passage,
        questions,
        answers,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Grade comprehension error:', error);
      throw error;
    }
  },

  gradeSummary: async (
    passage: string,
    prompt: string,
    summary: string
  ): Promise<SummaryGradingResult | null> => {
    try {
      const response = await api.post('/api/mobile/english/summary/grade', {
        passage,
        prompt,
        summary,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Grade summary error:', error);
      throw error;
    }
  },
};
