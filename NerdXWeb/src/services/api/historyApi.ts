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
  breakdown?: Record<string, string>;
  credits_remaining?: number;
  credits_deducted?: number;
  error?: string;
}

export const historyApi = {
  generateQuestion: async (topic: string | { id: string; name: string }, difficulty = 'medium'): Promise<{ success: boolean; data?: HistoryEssayQuestion; credits_remaining?: number; message?: string }> => {
    const topicParam = typeof topic === 'string' ? topic : topic?.name ?? topic?.id ?? '';
    const response = await api.post<{ success: boolean; data?: HistoryEssayQuestion; credits_remaining?: number; message?: string }>(
      '/api/mobile/history/essay/generate',
      { topic: topicParam, difficulty }
    );
    return response.data;
  },

  submitEssay: async (
    question: HistoryEssayQuestion,
    answers: { part_a: string; part_b: string; part_c: string }
  ): Promise<{ success: boolean; data?: HistoryMarkingResult; message?: string }> => {
    const response = await api.post<{ success: boolean; data?: HistoryMarkingResult; message?: string }>(
      '/api/mobile/history/essay/submit',
      { question, answers }
    );
    return response.data;
  },
};
