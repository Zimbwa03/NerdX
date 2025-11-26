// Graph Practice API services
import api from './config';

export interface GraphData {
  graph_url: string;
  equation: string;
  question: string;
  solution: string;
  constraints?: string[];
  objective?: string;
  corner_points?: Array<[number, number]>;
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

  generateCustomGraph: async (
    equation: string
  ): Promise<GraphData | null> => {
    try {
      const response = await api.post('/api/mobile/math/graph/custom', {
        equation,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Generate custom graph error:', error);
      throw error;
    }
  },

  solveGraphFromImage: async (
    imageUri: string
  ): Promise<{ processed_text: string; solution: string; analysis?: string } | null> => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'graph.jpg',
      } as any);

      const response = await api.post('/api/mobile/math/graph/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Solve graph from image error:', error);
      throw error;
    }
  },

  generateLinearProgrammingGraph: async (
    constraints: string[],
    objective?: string
  ): Promise<GraphData | null> => {
    try {
      const response = await api.post('/api/mobile/math/graph/linear-programming', {
        constraints,
        objective,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Generate linear programming graph error:', error);
      throw error;
    }
  },

  // Manim Animations
  generateQuadraticAnimation: async (a: number, b: number, c: number): Promise<{ video_path: string } | null> => {
    try {
      const response = await api.post('/mobile/math/animate/quadratic', { a, b, c });
      return response.data.data;
    } catch (error) {
      console.error('Quadratic animation error:', error);
      return null;
    }
  },

  generateLinearAnimation: async (m: number, c: number): Promise<{ video_path: string } | null> => {
    try {
      const response = await api.post('/mobile/math/animate/linear', { m, c });
      return response.data.data;
    } catch (error) {
      console.error('Linear animation error:', error);
      return null;
    }
  },
};
