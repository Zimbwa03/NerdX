// Quiz API services for NerdX Web
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

export interface StructuredQuestionPart {
  label: string;
  question: string;
  marks: number;
  command_word?: string;
  model_answer?: string;
  expected_points?: string[];
}

export interface StructuredQuestion {
  question_type: 'structured';
  subject: string;
  topic: string;
  difficulty: string;
  stem: string;
  parts: StructuredQuestionPart[];
  total_marks: number;
  marking_rubric?: Record<string, unknown>;
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
  question_image_url?: string;
  answer_image_urls?: string[];
  subject_id?: string;
  topic_id?: string;
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
  what_went_right?: string;
  what_went_wrong?: string;
  improvement_tips?: string;
  encouragement?: string;
  related_topic?: string;
}

export const quizApi = {
  getTopics: async (
    subject: string,
    parentSubject?: string,
    board?: 'zimsec' | 'cambridge'
  ): Promise<Topic[]> => {
    try {
      let url = `/api/mobile/quiz/topics?subject=${encodeURIComponent(subject)}`;
      if (parentSubject) {
        url += `&parent_subject=${encodeURIComponent(parentSubject)}`;
      }
      if (subject === 'computer_science' && board) {
        url += `&board=${board}`;
      }
      const response = await api.get(url);
      return response.data.data || [];
    } catch (error) {
      console.error('Get topics error:', error);
      return [];
    }
  },

  generateQuestionStream: async (
    subject: string,
    topic: string,
    difficulty: string = 'medium',
    handlers: StreamHandlers = {}
  ): Promise<Question | null> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/mobile/quiz/generate-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ subject, topic, difficulty }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      handlers.onError?.(errorText || `Server error: ${response.status}`);
      throw new Error(errorText || 'Streaming failed');
    }

    const reader = response.body?.getReader?.();
    if (!reader) {
      return quizApi.generateQuestion(subject, topic, difficulty, 'topical');
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let resolvedQuestion: Question | null = null;
    let shouldStop = false;

    while (!shouldStop) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;

      buffer += decoder.decode(value, { stream: true });
      let boundaryIndex = buffer.indexOf('\n\n');

      while (boundaryIndex >= 0) {
        const rawEvent = buffer.slice(0, boundaryIndex).trim();
        buffer = buffer.slice(boundaryIndex + 2);

        if (rawEvent) {
          for (const line of rawEvent.split('\n')) {
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
                handlers.onError?.(eventData.message || 'Error');
                throw new Error(eventData.message);
              } else if (eventData.type === 'done') {
                shouldStop = true;
                break;
              }
            } catch (err) {
              if (err instanceof Error && err.message !== 'Error') {
                console.warn('Parse streaming event', err);
              } else throw err;
            }
          }
        }
        if (shouldStop) break;
        boundaryIndex = buffer.indexOf('\n\n');
      }
    }

    try {
      await reader.cancel?.();
    } catch {
      /* ignore */
    }

    return resolvedQuestion;
  },

  generateQuestion: async (
    subject: string,
    topic?: string,
    difficulty: string = 'medium',
    type: string = 'topical',
    parent_subject?: string,
    questionType?: string,
    questionFormat?: 'mcq' | 'structured' | 'essay',
    mixImages?: boolean,
    questionCount?: number,
    board?: 'zimsec' | 'cambridge'
  ): Promise<Question | null> => {
    const payload: Record<string, unknown> = {
      subject,
      difficulty,
      type,
    };
    if (topic) payload.topic = topic;
    if (parent_subject) payload.parent_subject = parent_subject;
    if (questionType) payload.question_type = questionType;
    if (questionFormat) payload.question_format = questionFormat;
    if (mixImages !== undefined) payload.mix_images = mixImages;
    if (questionCount !== undefined) payload.question_count = questionCount;
    if (board) payload.board = board;

    const timeout = type === 'essay' || questionType === 'structured' ? 120000 : 90000;
    const response = await api.post('/api/mobile/quiz/generate', payload, { timeout });
    const questionData = response.data.data || null;
    if (questionData && response.data.credits_remaining !== undefined) {
      (questionData as Question & { credits_remaining?: number }).credits_remaining =
        response.data.credits_remaining;
    }
    return questionData;
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
    options?: string[],
    structuredQuestion?: StructuredQuestion,
    questionType?: string
  ): Promise<AnswerResult | null> => {
    const payload: Record<string, unknown> = { question_id: questionId, answer };
    if (imageUrl) payload.image_url = imageUrl;
    if (subject) {
      payload.subject = subject;
      payload.correct_answer = correctAnswer;
      payload.solution = solution;
      payload.hint = hint;
      payload.question_text = questionText;
    }
    if (options?.length) payload.options = options;
    if (structuredQuestion) {
      payload.structured_question = structuredQuestion;
      payload.question_type = 'structured';
    } else if (questionType) {
      payload.question_type = questionType;
    }

    const response = await api.post('/api/mobile/quiz/submit-answer', payload);
    const data = response.data.data || null;
    if (data && response.data.credits_remaining !== undefined) {
      (data as AnswerResult & { credits_remaining?: number }).credits_remaining =
        response.data.credits_remaining;
    }
    return data;
  },

  uploadImage: async (imageFile: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('use_for_exam', 'true'); // Host and return URL for submit-answer
    const res = await api.post('/api/mobile/image/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data?.image_url ?? null;
  },
};
