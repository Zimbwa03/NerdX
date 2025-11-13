import apiClient from './config';

export const mathApi = {
  // Generate math graph
  generateGraph: async (function_text: string): Promise<{
    graph_url: string;
    image_url: string;
  }> => {
    const response = await apiClient.post('/math/graph', {
      function_text,
    });
    return response.data.data;
  },
};

