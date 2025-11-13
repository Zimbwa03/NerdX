import apiClient from './config';

export const englishApi = {
  // Generate comprehension passage
  generateComprehension: async (): Promise<{
    passage: string;
    questions: any[];
  }> => {
    const response = await apiClient.post('/english/comprehension');
    return response.data.data;
  },

  // Submit essay for marking
  submitEssay: async (data: {
    prompt: string;
    essay_text: string;
  }): Promise<{
    essay_id: string;
    score: number;
    feedback: string;
    report_url?: string;
  }> => {
    const response = await apiClient.post('/english/essay', data);
    return response.data.data;
  },

  // Get essay report PDF
  getEssayReport: async (essay_id: string): Promise<string> => {
    const response = await apiClient.get(`/english/essay/${essay_id}/report`);
    return response.data.data?.report_url || '';
  },
};

