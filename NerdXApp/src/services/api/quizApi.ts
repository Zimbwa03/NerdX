// Quiz API services
import api from './config';

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
    questionType?: string
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
      const response = await api.post('/api/mobile/quiz/generate', payload);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Generate question error:', error);
      throw error;
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
    questionText?: string
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
