// Exam API services for CBT-style exam sessions
import api from './config';

// =============================================================================
// TYPES
// =============================================================================

export type QuestionMode = 'MCQ_ONLY' | 'STRUCTURED_ONLY' | 'MIXED';
export type Level = 'O_LEVEL' | 'A_LEVEL';
export type Difficulty = 'easy' | 'standard' | 'hard';
export type PaperStyle = 'ZIMSEC' | 'CAMBRIDGE' | 'HYBRID';

export interface ExamConfig {
    subject: string;
    level: Level;
    question_mode: QuestionMode;
    difficulty: Difficulty;
    total_questions: number;
    paper_style?: PaperStyle;
    topics?: string[];  // Optional: specific topics to focus on
}

export interface TimeInfo {
    total_seconds: number;
    total_minutes: number;
    per_question_seconds: number;
    buffer_seconds: number;
    breakdown: {
        base_mcq_seconds: number;
        base_structured_seconds: number;
        difficulty_multiplier: number;
        question_count: number;
        question_mode: QuestionMode;
    };
}

export interface ExamSession {
    session_id: string;
    total_questions: number;
    total_time_seconds: number;
    total_time_minutes: number;
    time_breakdown: TimeInfo;
    status: 'active' | 'submitted' | 'expired';
    message: string;
}

export interface MCQOption {
    label: string;
    text: string;
}

export interface StructuredPart {
    part: string;
    marks: number;
    prompt: string;
    key_points?: string[];
}

export interface ExamQuestion {
    id: string;
    question_type: 'MCQ' | 'STRUCTURED';
    topic: string;
    subtopic?: string;
    stem: string;
    options?: MCQOption[];
    correct_option?: string;
    parts?: StructuredPart[];
    total_marks?: number;
    marking_scheme?: Record<string, any>;
    explanation?: string;
    difficulty: string;
    prompt_to_student?: string;
    question_index?: number;
    generated_at?: string;
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
    percentage?: number;
}

export interface ExamScore {
    marks_awarded: number;
    marks_total: number;
    correct_count: number;
    total_questions: number;
    answered_count: number;
    unanswered_count: number;
    percentage: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'U';
}

export interface ExamResults {
    session_id: string;
    status: 'submitted';
    score: ExamScore;
    time: {
        allowed_seconds: number;
        used_seconds: number;
        used_formatted: string;
    };
    topic_breakdown: Record<string, { correct: number; total: number }>;
    weak_areas: string[];
    performance_signals: {
        weak_topics: string[];
        strong_topics: string[];
    };
    encouragement: string;
    revision_suggestions: string[];
    xp_earned?: number;
}

export interface ExamState {
    session_id: string;
    status: 'active' | 'submitted' | 'expired';
    current_index: number;
    total_questions: number;
    answered_count: number;
    flagged_count: number;
    remaining_seconds: number;
    is_expired: boolean;
}

export interface ReviewQuestion {
    question_number: number;
    question: ExamQuestion;
    user_answer: string | null;
    is_correct: boolean;
    marks_awarded: number;
    marks_total: number;
    was_flagged: boolean;
    time_spent: number;
    correct_answer: string;
    explanation: string;
}

export interface ExamReview {
    session_id: string;
    questions: ReviewQuestion[];
    summary_message: string;
}

// =============================================================================
// API SERVICE
// =============================================================================

/** Client-side fallback when backend calculate-time is unavailable. */
export function getDefaultTimeInfo(
    questionCount: number,
    questionMode: QuestionMode,
    difficulty: Difficulty
): TimeInfo {
    const DIFFICULTY_MULTIPLIER = { easy: 0.9, standard: 1.0, hard: 1.2 };
    const baseMcqSeconds = 90;
    const baseStructuredSeconds = 180;
    const mult = DIFFICULTY_MULTIPLIER[difficulty] ?? 1;
    let perQuestion: number;
    if (questionMode === 'MCQ_ONLY') perQuestion = baseMcqSeconds * mult;
    else if (questionMode === 'STRUCTURED_ONLY') perQuestion = baseStructuredSeconds * mult;
    else perQuestion = ((baseMcqSeconds + baseStructuredSeconds) / 2) * mult;
    const totalSeconds = Math.round(questionCount * perQuestion);
    const bufferSeconds = Math.round(totalSeconds * 0.1);
    return {
        total_seconds: totalSeconds + bufferSeconds,
        total_minutes: (totalSeconds + bufferSeconds) / 60,
        per_question_seconds: perQuestion,
        buffer_seconds: bufferSeconds,
        breakdown: {
            base_mcq_seconds: baseMcqSeconds,
            base_structured_seconds: baseStructuredSeconds,
            difficulty_multiplier: mult,
            question_count: questionCount,
            question_mode: questionMode,
        },
    };
}

export const examApi = {
    /**
     * Calculate exam time without creating a session.
     * Uses backend when available, otherwise client-side fallback so timer and Begin Exam always work.
     */
    calculateTime: async (
        subject: string,
        questionCount: number,
        questionMode: QuestionMode = 'MCQ_ONLY',
        difficulty: Difficulty = 'standard'
    ): Promise<TimeInfo> => {
        try {
            const response = await api.post('/api/mobile/exam/calculate-time', {
                subject,
                question_count: questionCount,
                question_mode: questionMode,
                difficulty,
            });
            const data = response.data?.data ?? null;
            if (data) return data;
        } catch (error: any) {
            console.warn('Calculate time API unavailable, using local estimate:', error?.message);
        }
        return getDefaultTimeInfo(questionCount, questionMode, difficulty);
    },

    /**
     * Create a new exam session.
     */
    createSession: async (config: ExamConfig): Promise<ExamSession | null> => {
        try {
            const response = await api.post('/api/mobile/exam/create', config);
            return response.data.data || null;
        } catch (error: any) {
            console.error('Create exam session error:', error);
            throw error;
        }
    },

    /**
     * Get the next question for an exam session.
     * Questions are generated one at a time using DeepSeek.
     */
    getNextQuestion: async (
        sessionId: string,
        questionIndex?: number
    ): Promise<QuestionResponse | null> => {
        try {
            const response = await api.post('/api/mobile/exam/next', {
                session_id: sessionId,
                question_index: questionIndex,
            }, {
                timeout: 60000, // 60 seconds for AI generation
            });
            return response.data.data || null;
        } catch (error: any) {
            console.error('Get next question error:', error);
            throw error;
        }
    },

    /**
     * Submit answer for a single question and get immediate feedback.
     */
    submitAnswer: async (
        sessionId: string,
        questionId: string,
        answer: string,
        timeSpentSeconds: number = 0,
        isFlagged: boolean = false,
        imageUrl?: string
    ): Promise<MarkResult | null> => {
        try {
            const payload: any = {
                session_id: sessionId,
                question_id: questionId,
                answer,
                time_spent_seconds: timeSpentSeconds,
                is_flagged: isFlagged,
            };
            if (imageUrl) {
                payload.image_url = imageUrl;
            }
            const response = await api.post('/api/mobile/exam/submit', payload);
            return response.data.data || null;
        } catch (error: any) {
            console.error('Submit answer error:', error);
            throw error;
        }
    },

    /**
     * Complete the exam and get final results.
     */
    completeExam: async (sessionId: string): Promise<ExamResults | null> => {
        try {
            const response = await api.post('/api/mobile/exam/complete', {
                session_id: sessionId,
            });
            return response.data.data || null;
        } catch (error: any) {
            console.error('Complete exam error:', error);
            throw error;
        }
    },

    /**
     * Get current exam session state (for resume).
     */
    getExamState: async (sessionId: string): Promise<ExamState | null> => {
        try {
            const response = await api.get(`/api/mobile/exam/state/${sessionId}`);
            return response.data.data || null;
        } catch (error: any) {
            console.error('Get exam state error:', error);
            return null;
        }
    },

    /**
     * Get detailed question-by-question review after exam completion.
     */
    getExamReview: async (sessionId: string): Promise<ExamReview | null> => {
        try {
            const response = await api.get(`/api/mobile/exam/review/${sessionId}`);
            return response.data.data || null;
        } catch (error: any) {
            console.error('Get exam review error:', error);
            return null;
        }
    },
};

// =============================================================================
// CONSTANTS
// =============================================================================

export const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100] as const;

export const SUBJECTS = [
    { id: 'mathematics', name: 'Mathematics', icon: 'calculate', color: '#2196F3' },
    { id: 'pure_math', name: 'A-Level Pure Maths', icon: 'math-integral', color: '#8B5CF6' },
    { id: 'a_level_biology', name: 'A-Level Biology', icon: 'dna', color: '#10B981' },
    { id: 'a_level_chemistry', name: 'A-Level Chemistry', icon: 'flask', color: '#00897B' },
    { id: 'a_level_physics', name: 'A-Level Physics', icon: 'atom', color: '#1976D2' },
    { id: 'a_level_computer_science', name: 'A-Level Computer Science', icon: 'code-working', color: '#0D47A1' },
    { id: 'english', name: 'English', icon: 'book', color: '#FF9800' },
    { id: 'computer_science', name: 'Computer Science', icon: 'hardware-chip', color: '#0288D1' },
    { id: 'biology', name: 'Biology', icon: 'leaf', color: '#4CAF50' },
    { id: 'chemistry', name: 'Chemistry', icon: 'flask', color: '#9C27B0' },
    { id: 'physics', name: 'Physics', icon: 'flash', color: '#F44336' },
    { id: 'accounting', name: 'Principles of Accounting', icon: 'receipt', color: '#B8860B' },
    { id: 'commerce', name: 'Commerce', icon: 'receipt', color: '#B8860B' },
    { id: 'business_enterprise_skills', name: 'Business Enterprise and Skills', icon: 'bulb', color: '#2E7D32' },
    { id: 'geography', name: 'Geography', icon: 'earth', color: '#2E7D32' },
    { id: 'a_level_geography', name: 'A-Level Geography', icon: 'earth', color: '#1B5E20' },
] as const;

export const QUESTION_MODES = [
    { id: 'MCQ_ONLY', name: 'MCQ Only', description: 'Multiple choice questions' },
    { id: 'STRUCTURED_ONLY', name: 'Structured Only', description: 'Written answer questions' },
    { id: 'MIXED', name: 'Mixed', description: 'Both MCQ and structured' },
] as const;

export const DIFFICULTIES = [
    { id: 'easy', name: 'Easy', multiplier: 0.9 },
    { id: 'standard', name: 'Standard', multiplier: 1.0 },
    { id: 'hard', name: 'Hard', multiplier: 1.2 },
] as const;

export const GRADES = ['A', 'B', 'C', 'D', 'E', 'U'] as const;

export const GRADE_BOUNDARIES = {
    A: 80,
    B: 70,
    C: 60,
    D: 50,
    E: 40,
    U: 0,
} as const;
