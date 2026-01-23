// Quiz API services
import api, { API_BASE_URL, getAuthToken } from './config';

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Topic {
  id: string;
  name: string;
  subject: string;
  parent_subject?: string;
  is_parent?: boolean;
}

// Structured question part interface for Paper 2 style questions
export interface StructuredQuestionPart {
  label: string;         // e.g., "(a)(i)", "(b)"
  question: string;      // The part question text
  marks: number;         // Mark allocation for this part
  command_word?: string; // e.g., "state", "explain", "describe"
  model_answer?: string; // Expected answer for marking
  expected_points?: string[]; // Key marking points
}

// Full structured question interface
export interface StructuredQuestion {
  question_type: 'structured';
  subject: string;
  topic: string;
  difficulty: string;
  stem: string;          // Main question context/stem
  parts: StructuredQuestionPart[];
  total_marks: number;
  marking_rubric?: Record<string, any>;
}

export interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options?: string[];
  correct_answer: string;
  solution: string;
  hint?: string;
  explanation?: string;
  points: number;
  topic: string;
  difficulty: string;
  allows_text_input?: boolean;
  allows_image_upload?: boolean;

  // AI Tutor Fields
  concept_explanation?: string;
  worked_example?: {
    problem: string;
    solution_steps: string[];
    key_concept: string;
  };
  hint_level_1?: string;
  hint_level_2?: string;
  hint_level_3?: string;
  common_mistakes?: string[];
  learning_objective?: string;

  // Exam Mode Fields
  question_image_url?: string;
  answer_image_urls?: string[];
  subject_id?: string;
  topic_id?: string;

  // Structured Question Fields (Paper 2 style)
  structured_question?: StructuredQuestion;
}

export interface StreamingThinkingUpdate {
  content: string;
  stage?: number;
  total_stages?: number;
}

export interface StreamHandlers {
  onThinking?: (update: StreamingThinkingUpdate) => void;
  onQuestion?: (question: Question) => void;
  onError?: (message: string) => void;
}

export interface AnswerResult {
  correct: boolean;
  feedback: string;
  solution: string;
  hint?: string;
  points_earned: number;
  credits_used: number;

  // Enhanced Feedback
  what_went_right?: string;
  what_went_wrong?: string;
  improvement_tips?: string;
  encouragement?: string;
  related_topic?: string;
}

export const quizApi = {
  generateQuestionStream: async (
    subject: string,
    topic: string,
    difficulty: string = 'medium',
    handlers: StreamHandlers = {}
  ): Promise<Question | null> => {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/mobile/quiz/generate-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        subject,
        topic,
        difficulty,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const message = errorText || `Server error: ${response.status}`;
      handlers.onError?.(message);
      throw new Error(message);
    }

    const reader = (response as any).body?.getReader?.();
    if (!reader) {
      // Streaming not supported in this environment; fall back to standard generation.
      return await quizApi.generateQuestion(subject, topic, difficulty);
    }

    const decoder = typeof (globalThis as any).TextDecoder !== 'undefined'
      ? new (globalThis as any).TextDecoder('utf-8')
      : null;
    const decodeChunk = (chunk: Uint8Array) => {
      if (decoder) {
        return decoder.decode(chunk, { stream: true });
      }
      let result = '';
      for (let i = 0; i < chunk.length; i += 1) {
        result += String.fromCharCode(chunk[i]);
      }
      return result;
    };

    let buffer = '';
    let resolvedQuestion: Question | null = null;
    let shouldStop = false;

    while (!shouldStop) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;

      buffer += decodeChunk(value);

      let boundaryIndex = buffer.indexOf('\n\n');
      while (boundaryIndex >= 0) {
        const rawEvent = buffer.slice(0, boundaryIndex).trim();
        buffer = buffer.slice(boundaryIndex + 2);

        if (rawEvent) {
          const lines = rawEvent.split('\n');
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const dataStr = line.slice(5).trim();
            if (!dataStr) continue;

            try {
              const eventData = JSON.parse(dataStr);
              if (eventData.type === 'thinking') {
                handlers.onThinking?.({
                  content: eventData.content || '',
                  stage: eventData.stage,
                  total_stages: eventData.total_stages,
                });
              } else if (eventData.type === 'question') {
                resolvedQuestion = eventData.data as Question;
                handlers.onQuestion?.(resolvedQuestion);
                shouldStop = true;
                break;
              } else if (eventData.type === 'error') {
                const message = eventData.message || 'Streaming error';
                handlers.onError?.(message);
                throw new Error(message);
              } else if (eventData.type === 'done') {
                shouldStop = true;
                break;
              }
            } catch (err) {
              console.warn('Failed to parse streaming event', err);
            }
          }
        }

        if (shouldStop) break;
        boundaryIndex = buffer.indexOf('\n\n');
      }
    }

    if (shouldStop && typeof reader.cancel === 'function') {
      try {
        await reader.cancel();
      } catch {
        // Ignore cancellation errors.
      }
    }

    return resolvedQuestion;
  },

  getSubjects: async (): Promise<Subject[]> => {
    try {
      const response = await api.get('/api/mobile/quiz/subjects');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Get subjects error:', error);
      return [];
    }
  },

  getTopics: async (subject: string, parentSubject?: string): Promise<Topic[]> => {
    try {
      let url = `/api/mobile/quiz/topics?subject=${subject}`;
      if (parentSubject) {
        url += `&parent_subject=${parentSubject}`;
      }
      const response = await api.get(url);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Get topics error:', error);
      return [];
    }
  },

  generateQuestion: async (
    subject: string,
    topic?: string,
    difficulty: string = 'medium',
    type: string = 'topical',
    parent_subject?: string,
    questionType?: string,  // For A-Level Biology: 'mcq', 'structured', 'essay'
    questionFormat?: 'mcq' | 'structured',  // For O-Level Paper 2 style structured questions
    question_type?: string,  // Alternative key for backend compatibility
    mixImages?: boolean,  // NEW: Enable visual questions with Vertex AI
    questionCount?: number  // NEW: Current question number in session
  ): Promise<Question | null> => {
    try {
      const payload: any = {
        subject,
        difficulty,
        type,
      };
      if (topic) {
        payload.topic = topic;
      }
      if (parent_subject) {
        payload.parent_subject = parent_subject;
      }
      if (questionType) {
        payload.question_type = questionType;
      }
      // Also set question_type if provided separately (for backend compatibility)
      if (question_type && !questionType) {
        payload.question_type = question_type;
      }
      // For Combined Science structured questions (Paper 2 style)
      if (questionFormat) {
        payload.question_format = questionFormat;
      }
      // NEW: Image mixing parameters for Vertex AI visual questions
      if (mixImages !== undefined) {
        payload.mix_images = mixImages;
      }
      if (questionCount !== undefined) {
        payload.question_count = questionCount;
      }
      // Use extended timeout for AI question generation
      // Essay and structured questions can take longer (up to 90 seconds)
      const timeout = payload.question_type === 'essay' || payload.question_type === 'structured' 
        ? 120000  // 120 seconds for essay/structured (more complex)
        : 90000;  // 90 seconds for MCQ
      
      const response = await api.post('/api/mobile/quiz/generate', payload, {
        timeout: timeout,
      });
      // Include credits_remaining from server response for UI updates
      const questionData = response.data.data || null;
      if (questionData && response.data.credits_remaining !== undefined) {
        questionData.credits_remaining = response.data.credits_remaining;
      }
      return questionData;
    } catch (error: any) {
      // Provide better error messages for network/timeout issues
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        const questionType = payload.question_type || 'question';
        console.error(`Generate ${questionType} timeout:`, error);
        throw new Error(
          questionType === 'essay' || questionType === 'structured'
            ? 'Question generation is taking longer than expected. Essay and structured questions may take up to 2 minutes. Please try again.'
            : 'Question generation timed out. Please try again.'
        );
      } else if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        console.error('Network error generating question:', error);
        throw new Error('Network error. Please check your internet connection and try again.');
      } else {
        console.error('Generate question error:', error);
        // Use server error message if available, otherwise generic message
        const errorMessage = error.response?.data?.message || error.message || 'Failed to generate question';
        throw new Error(errorMessage);
      }
    }
  },

  submitAnswer: async (
    questionId: string,
    answer: string,
    imageUrl?: string,
    subject?: string,
    correctAnswer?: string,
    solution?: string,
    hint?: string,
    questionText?: string,
    options?: string[],  // Added: options array for proper MCQ validation
    structuredQuestion?: StructuredQuestion  // For Paper 2 structured question marking
  ): Promise<AnswerResult | null> => {
    try {
      const payload: any = {
        question_id: questionId,
        answer,
      };
      if (imageUrl) {
        payload.image_url = imageUrl;
      }
      if (subject) {
        payload.subject = subject;
        payload.correct_answer = correctAnswer;
        payload.solution = solution;
        payload.hint = hint;
        payload.question_text = questionText;
      }
      // Include options for MCQ answer validation
      if (options && options.length > 0) {
        payload.options = options;
      }
      // Include structured question for Paper 2 style marking
      if (structuredQuestion) {
        payload.structured_question = structuredQuestion;
        payload.question_type = 'structured';
      }
      const response = await api.post('/api/mobile/quiz/submit-answer', payload);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Submit answer error:', error);
      throw error;
    }
  },

  getNextExamQuestion: async (
    questionCount: number,
    year?: string,
    paper?: string
  ): Promise<Question | null> => {
    try {
      const payload = {
        question_count: questionCount,
        year,
        paper
      };
      const response = await api.post('/api/mobile/quiz/exam/next', payload);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Get exam question error:', error);
      throw error;
    }
  },
};
