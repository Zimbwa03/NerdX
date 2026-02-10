// Exam API for CBT exam sessions - matches mobile
import api from './config';

export type QuestionMode = 'MCQ_ONLY' | 'STRUCTURED_ONLY' | 'MIXED';
export type Level = 'O_LEVEL' | 'A_LEVEL';
export type Difficulty = 'easy' | 'standard' | 'hard';

export interface ExamConfig {
  subject: string;
  level: Level;
  question_mode: QuestionMode;
  difficulty: Difficulty;
  total_questions: number;
  paper_style?: string;
  topics?: string[];
}

export interface TimeInfo {
  total_seconds: number;
  total_minutes: number;
  per_question_seconds?: number;
  buffer_seconds?: number;
}

export interface ExamSession {
  session_id: string;
  total_questions: number;
  total_time_seconds: number;
  total_time_minutes: number;
  status: string;
  message: string;
}

export interface ExamQuestion {
  id: string;
  question_type: 'MCQ' | 'STRUCTURED' | 'essay';
  topic: string;
  stem: string;
  options?: Array<{ label: string; text: string }>;
  correct_option?: string;
  parts?: Array<{ part: string; marks: number; prompt: string }>;
  total_marks?: number;
  explanation?: string;
  prompt_to_student?: string;
}

export interface QuestionResponse {
  question: ExamQuestion;
  question_index: number;
  total_questions: number;
  remaining_seconds: number | null;
  prompt: string;
  credits_remaining?: number;
}

export interface MarkResult {
  is_correct: boolean;
  marks_awarded: number;
  marks_total: number;
  correct_answer?: string;
  explanation?: string;
  feedback: string;
}

export interface ExamResults {
  session_id: string;
  status: string;
  score: {
    marks_awarded: number;
    marks_total: number;
    correct_count: number;
    total_questions: number;
    answered_count?: number;
    unanswered_count?: number;
    percentage: number;
    grade: string;
  };
  time?: { used_formatted: string; allowed_seconds?: number; used_seconds?: number };
  encouragement?: string;
  revision_suggestions?: string[];
  weak_areas?: string[];
  topic_breakdown?: Record<string, { correct: number; total: number }>;
  performance_signals?: Record<string, unknown>;
}

export const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100] as const;

export const QUESTION_MODES: { id: QuestionMode; name: string }[] = [
  { id: 'MCQ_ONLY', name: 'MCQ Only' },
  { id: 'STRUCTURED_ONLY', name: 'Structured Only' },
  { id: 'MIXED', name: 'Mixed' },
];

export const DIFFICULTIES: { id: Difficulty; name: string }[] = [
  { id: 'easy', name: 'Easy' },
  { id: 'standard', name: 'Standard' },
  { id: 'hard', name: 'Hard' },
];

export function getDefaultTimeInfo(
  questionCount: number,
  questionMode: QuestionMode,
  difficulty: Difficulty
): TimeInfo {
  const mult = { easy: 0.9, standard: 1.0, hard: 1.2 }[difficulty];
  const baseMcq = 90;
  const baseStruct = 180;
  let perQ: number;
  if (questionMode === 'MCQ_ONLY') perQ = baseMcq * mult;
  else if (questionMode === 'STRUCTURED_ONLY') perQ = baseStruct * mult;
  else perQ = ((baseMcq + baseStruct) / 2) * mult;
  const total = Math.round(questionCount * perQ);
  const buffer = Math.round(total * 0.1);
  return {
    total_seconds: total + buffer,
    total_minutes: (total + buffer) / 60,
  };
}

export const examApi = {
  calculateTime: async (
    subject: string,
    questionCount: number,
    questionMode: QuestionMode = 'MCQ_ONLY',
    difficulty: Difficulty = 'standard'
  ): Promise<TimeInfo> => {
    try {
      const res = await api.post('/api/mobile/exam/calculate-time', {
        subject,
        question_count: questionCount,
        question_mode: questionMode,
        difficulty,
      });
      return res.data?.data ?? getDefaultTimeInfo(questionCount, questionMode, difficulty);
    } catch {
      return getDefaultTimeInfo(questionCount, questionMode, difficulty);
    }
  },

  createSession: async (config: ExamConfig): Promise<ExamSession | null> => {
    const res = await api.post('/api/mobile/exam/create', {
      subject: config.subject,
      level: config.level,
      question_mode: config.question_mode,
      difficulty: config.difficulty,
      total_questions: config.total_questions,
      paper_style: config.paper_style ?? 'ZIMSEC',
      topics: config.topics,
    });
    return res.data?.data ?? null;
  },

  getNextQuestion: async (
    sessionId: string,
    questionIndex?: number
  ): Promise<QuestionResponse | null> => {
    const res = await api.post(
      '/api/mobile/exam/next',
      { session_id: sessionId, question_index: questionIndex },
      { timeout: 60000 }
    );
    return res.data?.data ?? null;
  },

  submitAnswer: async (
    sessionId: string,
    questionId: string,
    answer: string,
    timeSpentSeconds: number = 0,
    isFlagged: boolean = false,
    imageUrl?: string
  ): Promise<MarkResult | null> => {
    const payload: Record<string, unknown> = {
      session_id: sessionId,
      question_id: questionId,
      answer,
      time_spent_seconds: timeSpentSeconds,
      is_flagged: isFlagged,
    };
    if (imageUrl) payload.image_url = imageUrl;
    const res = await api.post('/api/mobile/exam/submit', payload);
    return res.data?.data ?? null;
  },

  uploadExamImage: async (imageFile: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('use_for_exam', 'true');
    const res = await api.post('/api/mobile/image/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data?.image_url ?? null;
  },

  completeExam: async (sessionId: string): Promise<ExamResults | null> => {
    const res = await api.post('/api/mobile/exam/complete', { session_id: sessionId });
    return res.data?.data ?? null;
  },
};
