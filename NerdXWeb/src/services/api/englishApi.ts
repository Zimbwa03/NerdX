// English API services for NerdX Web (parity with mobile app)
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
  type: string;
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
  pdf_report: string;
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

export interface EssaySubmission {
  id: string;
  user_id: string;
  essay_type: 'free_response' | 'guided';
  topic_title: string;
  original_essay: string;
  corrected_essay: string;
  teacher_comment: string;
  detailed_feedback: unknown;
  score: number;
  max_score: number;
  created_at: string;
}

export const englishApi = {
  generateComprehension: async (): Promise<ComprehensionData | null> => {
    const response = await api.post<{ data?: ComprehensionData; credits_remaining?: number }>(
      '/api/mobile/english/comprehension',
      {}
    );
    const data = response.data?.data ?? null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },

  getFreeResponseTopics: async (): Promise<FreeResponseTopic[]> => {
    const response = await api.get<{ data?: FreeResponseTopic[] }>('/api/mobile/english/essay/free-response-topics');
    return response.data?.data ?? [];
  },

  getGuidedComposition: async (): Promise<GuidedCompositionPrompt | null> => {
    const response = await api.get<{ data?: GuidedCompositionPrompt }>('/api/mobile/english/essay/guided-composition');
    return response.data?.data ?? null;
  },

  submitEssayForMarking: async (
    essayType: 'free_response' | 'guided',
    studentName: string,
    studentSurname: string,
    essayText: string,
    topic?: FreeResponseTopic,
    prompt?: GuidedCompositionPrompt
  ): Promise<EssayMarkingResult | null> => {
    const response = await api.post<{ data?: EssayMarkingResult; credits_remaining?: number }>(
      '/api/mobile/english/essay/submit',
      {
        essay_type: essayType,
        student_name: studentName,
        student_surname: studentSurname,
        essay_text: essayText,
        topic: topic ?? undefined,
        prompt: prompt ?? undefined,
      }
    );
    const data = response.data?.data ?? null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },

  generateEssayPrompts: async (): Promise<EssayPrompt[] | null> => {
    const response = await api.get<{ data?: EssayPrompt[] }>('/api/mobile/english/essay/prompts');
    return response.data?.data ?? null;
  },

  getEssayHistory: async (): Promise<EssaySubmission[]> => {
    const response = await api.get<{ data?: EssaySubmission[] }>('/api/mobile/english/essay/history');
    return response.data?.data ?? [];
  },

  getEssaySubmission: async (essayId: string): Promise<EssaySubmission | null> => {
    const response = await api.get<{ data?: EssaySubmission }>(`/api/mobile/english/essay/submission/${essayId}`);
    return response.data?.data ?? null;
  },

  getEssayReport: async (essayId: string): Promise<{ report_url: string } | null> => {
    const response = await api.get<{ data?: { report_url: string } }>(`/api/mobile/english/essay/${essayId}/report`);
    return response.data?.data ?? null;
  },

  extractEssayTextFromImages: async (
    images: Array<{ base64: string; mime_type?: string }>
  ): Promise<string> => {
    const response = await api.post<{ success: boolean; data?: { extracted_text: string } }>(
      '/api/mobile/english/essay/extract-from-images',
      { images }
    );
    const data = response.data?.data;
    return (data?.extracted_text ?? '').trim();
  },

  gradeComprehension: async (
    passage: string,
    questions: unknown[],
    answers: Record<string, string>
  ): Promise<GradingResult | null> => {
    const response = await api.post<{ data?: GradingResult; credits_remaining?: number }>(
      '/api/mobile/english/comprehension/grade',
      { passage, questions, answers }
    );
    const data = response.data?.data ?? null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },

  gradeSummary: async (
    passage: string,
    prompt: string,
    summary: string
  ): Promise<SummaryGradingResult | null> => {
    const response = await api.post<{ data?: SummaryGradingResult; credits_remaining?: number }>(
      '/api/mobile/english/summary/grade',
      { passage, prompt, summary }
    );
    const data = response.data?.data ?? null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },
};
