// Virtual Lab API services
import api from './config';

export type VirtualLabSubject = 'biology' | 'chemistry' | 'physics';
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

export const virtualLabApi = {
  generateKnowledgeCheck: async (
    payload: GenerateKnowledgeCheckPayload
  ): Promise<VirtualLabKnowledgeCheckQuestion[]> => {
    const response = await api.post('/api/mobile/virtual-lab/knowledge-check', payload, {
      timeout: 120000, // Increase timeout to 120s for AI generation
    });
    return response.data.data || [];
  },
};

