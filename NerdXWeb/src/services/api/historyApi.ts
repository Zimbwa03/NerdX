// History Essay API – ZIMSEC 3-part essay generate and submit
import api from './config';

export interface HistoryEssayPart {
  label: string;
  question_text: string;
  marks: number;
}

export interface HistoryEssayQuestion {
  id: string;
  topic: string;
  question_text: string;
  parts: HistoryEssayPart[];
  total_marks: number;
  marking_notes?: string;
  difficulty?: string;
  source?: string;
}

export interface HistoryMarkingResult {
  success: boolean;
  part_a_score: number;
  part_b_score: number;
  part_c_score: number;
  total: number;
  part_a_feedback?: string;
  part_b_feedback?: string;
  part_c_feedback?: string;
  constructive_feedback?: string;
  teacher_feedback?: string;
  part_a_expected_points?: string[];
  part_b_expected_points?: string[];
  part_c_expected_points?: string[];
  part_a_model_answer?: string;
  part_b_model_answer?: string;
  part_c_model_answer?: string;
  breakdown?: Record<string, string>;
  credits_remaining?: number;
  credits_deducted?: number;
  error?: string;
}

export interface HistoryImageInput {
  base64: string;
  mime_type?: string;
}

export type HistoryFormLevel = 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';

export const historyApi = {
  generateQuestion: async (
    topic: string | { id: string; name: string },
    difficulty = 'medium',
    formLevel: HistoryFormLevel = 'Form 1'
  ): Promise<{ success: boolean; data?: HistoryEssayQuestion; credits_remaining?: number; message?: string }> => {
    const topicParam = typeof topic === 'string' ? topic : topic?.name ?? topic?.id ?? '';
    const response = await api.post<{ success: boolean; data?: HistoryEssayQuestion; credits_remaining?: number; message?: string }>(
      '/api/mobile/history/essay/generate',
      { topic: topicParam, difficulty, form_level: formLevel }
    );
    return response.data;
  },

  submitEssay: async (
    question: HistoryEssayQuestion,
    answers: { part_a: string; part_b: string; part_c: string },
    formLevel: HistoryFormLevel = 'Form 1'
  ): Promise<{ success: boolean; data?: HistoryMarkingResult; message?: string }> => {
    const response = await api.post<{ success: boolean; data?: HistoryMarkingResult; message?: string }>(
      '/api/mobile/history/essay/submit',
      { question, answers, form_level: formLevel }
    );
    return response.data;
  },

  extractEssayFromImages: async (
    images: HistoryImageInput[]
  ): Promise<{ success: boolean; data?: { extracted_text: string }; message?: string }> => {
    const response = await api.post<{ success: boolean; data?: { extracted_text: string }; message?: string }>(
      '/api/mobile/english/essay/extract-from-images',
      { images }
    );
    return response.data;
  },

  transcribeAudio: async (
    audioFile: File
  ): Promise<{ success: boolean; text?: string; language?: string; message?: string }> => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    const response = await api.post<{ success: boolean; text?: string; language?: string; message?: string }>(
      '/api/mobile/voice/transcribe',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
};
