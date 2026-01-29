import api from './config';

export type ProgrammingLanguage = 'python' | 'vbnet' | 'java' | 'html' | 'sql';

export type AIRequestType =
  | 'code-help'
  | 'debug'
  | 'explain'
  | 'suggest-test'
  | 'fix-error'
  | 'general-question';

export interface AIRequestPayload {
  type: AIRequestType;
  code?: string;
  language?: ProgrammingLanguage;
  error?: string;
  userQuestion?: string;
    context?: {
    exerciseId?: string;
    courseId?: string;
    userLevel?: 'o-level' | 'a-level';
    selectedCode?: string;
    board?: 'zimsec' | 'cambridge';
    lab?: 'programming' | 'web-design' | 'database';
  };
  conversationHistory?: {
    sender: 'user' | 'ai';
    text: string;
  }[];
}

export interface AIResponsePayload {
  type: string;
  content: string;
  codeSnippet?: string;
  explanation?: string;
  suggestions?: string[];
  followUpQuestions?: string[];
  confidence?: number;
  /** Credits remaining after this request (from server when credits are deducted). */
  credits_remaining?: number;
  /** Credit cost of this request (display). */
  credit_cost?: number;
}

export const programmingLabAiApi = {
  ask: async (payload: AIRequestPayload): Promise<AIResponsePayload> => {
    const response = await api.post('/api/mobile/virtual-programming-lab/ai', payload, {
      timeout: 60000,
    });
    return response.data.data as AIResponsePayload;
  },
};

