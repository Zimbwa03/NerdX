// English API services
import api from './config';
import HybridAIService from '../HybridAIService';

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
  credits_remaining?: number;
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
  credits_remaining?: number;
}

export interface SummaryGradingResult {
  content_points: number;
  language_mark: number;
  total_score: number;
  max_score: number;
  word_count: number;
  feedback: string;
  key_points_missed: string[];
  credits_remaining?: number;
}

// ZIMSEC Essay Types
export interface FreeResponseTopic {
  title: string;
  description: string;
  type: 'narrative' | 'descriptive' | 'expository' | 'argumentative';
  suggested_length: string;
}

export interface GuidedCompositionPrompt {
  title: string;
  format: 'formal_letter' | 'informal_letter' | 'speech' | 'report' | 'article';
  context: string;
  key_points: string[];
  suggested_length: string;
  format_requirements?: string;
}

export interface EssayCorrection {
  wrong: string;
  correct: string;
  type: string; // 'grammar', 'spelling', 'tense', 'punctuation', 'format'
  explanation: string;
}

export interface EssayMarkingResult {
  essay_type: 'free_response' | 'guided';
  score: number;
  max_score: number;
  breakdown: {
    content?: number;
    language?: number;
    organization?: number;
    content_and_format?: number;
  };
  corrections: EssayCorrection[];
  teacher_comment: string;
  corrected_essay: string;
  detailed_feedback: string;
  pdf_report: string; // Base64-encoded PDF
  credits_deducted?: number;
  credits_remaining?: number;
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

export interface EssaySubmission {
  id: string;
  user_id: string;
  essay_type: 'free_response' | 'guided';
  topic_title: string;
  original_essay: string;
  corrected_essay: string;
  teacher_comment: string;
  detailed_feedback: any;
  score: number;
  max_score: number;
  created_at: string;
}

export const englishApi = {
  generateComprehension: async (): Promise<ComprehensionData | null> => {
    try {
      const response = await api.post('/api/mobile/english/comprehension', {}, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = response.data.data || null;
      // Include credits_remaining from server response for UI updates
      if (data && response.data.credits_remaining !== undefined) {
        data.credits_remaining = response.data.credits_remaining;
      }
      return data;
    } catch (error: any) {
      console.error('Generate comprehension error:', error);
      throw error;
    }
  },

  // ZIMSEC Essay Writing APIs
  getFreeResponseTopics: async (): Promise<FreeResponseTopic[]> => {
    try {
      const response = await api.get('/api/mobile/english/essay/free-response-topics');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Get free response topics error:', error);
      throw error;
    }
  },

  getGuidedComposition: async (): Promise<GuidedCompositionPrompt | null> => {
    try {
      const response = await api.get('/api/mobile/english/essay/guided-composition');
      return response.data.data || null;
    } catch (error: any) {
      console.error('Get guided composition error:', error);
      throw error;
    }
  },

  submitEssayForMarking: async (
    essayType: 'free_response' | 'guided',
    studentName: string,
    studentSurname: string,
    essayText: string,
    topic?: FreeResponseTopic,
    prompt?: GuidedCompositionPrompt
  ): Promise<EssayMarkingResult | null> => {
    try {
      const response = await api.post('/api/mobile/english/essay/submit', {
        essay_type: essayType,
        student_name: studentName,
        student_surname: studentSurname,
        essay_text: essayText,
        topic: topic || undefined,
        prompt: prompt || undefined,
      });
      const data = response.data.data || null;
      // Include credits_remaining from server response for UI updates
      if (data && response.data.credits_remaining !== undefined) {
        data.credits_remaining = response.data.credits_remaining;
      }
      return data;
    } catch (error: any) {
      console.error('Submit essay error:', error);
      throw error;
    }
  },

  // Legacy essay endpoints (keeping for backward compatibility)
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

  getEssayHistory: async (): Promise<EssaySubmission[]> => {
    try {
      const response = await api.get('/api/mobile/english/essay/history');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Get essay history error:', error);
      return [];
    }
  },

  getEssaySubmission: async (essayId: string): Promise<EssaySubmission | null> => {
    try {
      const response = await api.get(`/api/mobile/english/essay/submission/${essayId}`);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Get essay submission error:', error);
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

  /** Extract essay text from one or more images (Vertex AI OCR). Used by Mark Essay flow. */
  extractEssayTextFromImages: async (images: Array<{ base64: string; mime_type?: string }>): Promise<string> => {
    try {
      const response = await api.post<{ success: boolean; data?: { extracted_text: string } }>(
        '/api/mobile/english/essay/extract-from-images',
        { images },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const data = response.data?.data;
      return (data?.extracted_text ?? '').trim();
    } catch (error: any) {
      console.error('Extract essay from images error:', error);
      throw error;
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
      const data = response.data.data || null;
      if (data && response.data.credits_remaining !== undefined) {
        data.credits_remaining = response.data.credits_remaining;
      }
      return data;
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
      const data = response.data.data || null;
      if (data && response.data.credits_remaining !== undefined) {
        data.credits_remaining = response.data.credits_remaining;
      }
      return data;
    } catch (error: any) {
      console.error('Grade summary error:', error);
      throw error;
    }
  },

  // AI Help (Hybrid Online/Offline)
  getAIHelp: async (question: string): Promise<string> => {
    try {
      const response = await HybridAIService.generateResponse(
        question,
        'english',
        { maxTokens: 512 }
      );
      return response.text;
    } catch (error) {
      console.error('English AI help error:', error);
      throw error;
    }
  },
};
