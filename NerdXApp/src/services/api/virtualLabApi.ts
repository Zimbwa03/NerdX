// Virtual Lab API services
import api from './config';

export type VirtualLabSubject = 'biology' | 'chemistry' | 'physics' | 'mathematics';
export type VirtualLabDifficulty = 'easy' | 'medium' | 'hard';

export interface VirtualLabKnowledgeCheckQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface GenerateKnowledgeCheckPayload {
  simulation_id?: string;
  subject: VirtualLabSubject;
  topic: string;
  difficulty?: VirtualLabDifficulty;
  count: number;
}

// Geography Maps Lab – map_actions for AI feedback (DeepSeek)
export interface GeoMapsFeedbackPayload {
  level?: 'O' | 'A';
  topic?: string;
  task_type?: string;
  map_actions: {
    markers?: Array<{ name: string; lat: number; lon: number; student_label?: string }>;
    lines?: Array<{ points: Array<{ lat: number; lon: number }>; label?: string }>;
    measurements?: { distance_km?: number; bearing_deg?: number };
    selected_place?: { name: string; lat: number; lon: number };
  };
  student_answer_text?: string;
}

export interface GeoMapsFeedbackResult {
  response: string;
}

export const virtualLabApi = {
  generateKnowledgeCheck: async (
    payload: GenerateKnowledgeCheckPayload
  ): Promise<{ questions: VirtualLabKnowledgeCheckQuestion[]; credits_remaining?: number }> => {
    const response = await api.post('/api/mobile/virtual-lab/knowledge-check', payload, {
      timeout: 120000, // Increase timeout to 120s for AI generation
    });
    const data = response.data.data || [];
    const credits_remaining = response.data.credits_remaining;
    return { questions: Array.isArray(data) ? data : [], credits_remaining };
  },

  getGeoMapsFeedback: async (
    payload: GeoMapsFeedbackPayload
  ): Promise<{ response: string; credits_remaining?: string }> => {
    const res = await api.post<{
      success: boolean;
      data: GeoMapsFeedbackResult;
      credits_remaining?: string;
    }>('/api/mobile/virtual-lab/geo-maps-feedback', payload, {
      timeout: 90000,
    });
    if (!res.data.success || !res.data.data) {
      throw new Error((res.data as any)?.message || 'Failed to get feedback');
    }
    return {
      response: res.data.data.response,
      credits_remaining: res.data.credits_remaining,
    };
  },
};

