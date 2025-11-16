// Graph Practice API services
import api from './config';

export interface GraphData {
  graph_url: string;
  equation: string;
  question: string;
  solution: string;
}

export const graphApi = {
  generateGraph: async (
    graphType: string,
    equation?: string
  ): Promise<GraphData | null> => {
    try {
      const response = await api.post('/api/mobile/math/graph/generate', {
        graph_type: graphType,
        equation,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Generate graph error:', error);
      throw error;
    }
  },
};
