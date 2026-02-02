// Graph Practice API services
import api from './config';

export interface GraphData {
  graph_url?: string | null;
  image_url?: string | null;
  equation?: string | null;
  /** Display form of the equation (e.g. "2x^2 - 4x + 3") — same as in question and graph. */
  equation_display?: string | null;
  question: string;
  solution: string;
  constraints?: string[];
  objective?: string;
  corner_points?: Array<[number, number]>;
  graph_spec?: GraphSpec;
  credits_remaining?: number;
  /** When true, no graph image was generated (e.g. Statistics: draw on paper / upload image). */
  no_plot?: boolean;
}

export interface GraphRange {
  min: number;
  max: number;
  step?: number;
}

export interface GraphSpec {
  equation: string;
  clean_expression?: string;
  graph_type?: 'linear' | 'quadratic' | string;
  x_range?: GraphRange;
  y_range?: GraphRange;
  coefficients?: {
    // linear
    m?: number;
    c?: number;
    // quadratic
    a?: number;
    b?: number;
  };
}

export const graphApi = {
  generateGraph: async (
    graphType: string,
    equation?: string,
    level?: 'o_level' | 'a_level'
  ): Promise<GraphData | null> => {
    try {
      const response = await api.post('/api/mobile/math/graph/generate', {
        graph_type: graphType,
        equation,
        level: level || 'o_level',
      });
      const payload = response.data?.data ?? response.data;
      const data = payload && typeof payload === 'object' ? payload : null;
      // Include credits_remaining from server response
      if (data && response.data?.credits_remaining !== undefined) {
        data.credits_remaining = response.data.credits_remaining;
      }
      // Ensure question/solution exist so UI is never empty
      if (data && !data.question && (response.data?.data?.question ?? response.data?.question)) {
        data.question = (response.data?.data?.question ?? response.data?.question) as string;
      }
      if (data && !data.solution && (response.data?.data?.solution ?? response.data?.solution)) {
        data.solution = (response.data?.data?.solution ?? response.data?.solution) as string;
      }
      return data;
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
      const data = response.data.data || null;
      // Include credits_remaining from server response
      if (data && response.data.credits_remaining !== undefined) {
        data.credits_remaining = response.data.credits_remaining;
      }
      return data;
    } catch (error: any) {
      console.error('Generate custom graph error:', error);
      throw error;
    }
  },

  solveGraphFromImage: async (
    imageUri: string
  ): Promise<{ processed_text: string; solution: string; analysis?: string; credits_remaining?: number } | null> => {
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
      const data = response.data.data || null;
      // Include credits_remaining from server response
      if (data && response.data.credits_remaining !== undefined) {
        data.credits_remaining = response.data.credits_remaining;
      }
      return data;
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
      const data = response.data.data || null;
      // Include credits_remaining from server response
      if (data && response.data.credits_remaining !== undefined) {
        data.credits_remaining = response.data.credits_remaining;
      }
      return data;
    } catch (error: any) {
      console.error('Generate linear programming graph error:', error);
      throw error;
    }
  },

  // Manim Animations
  generateQuadraticAnimation: async (
    a: number,
    b: number,
    c: number,
    x_range?: GraphRange,
    y_range?: GraphRange
  ): Promise<{ video_path: string } | null> => {
    try {
      const response = await api.post('/api/mobile/math/animate/quadratic', { a, b, c, x_range, y_range });
      return response.data.data;
    } catch (error) {
      console.error('Quadratic animation error:', error);
      return null;
    }
  },

  generateLinearAnimation: async (
    m: number,
    c: number,
    x_range?: GraphRange,
    y_range?: GraphRange
  ): Promise<{ video_path: string } | null> => {
    try {
      const response = await api.post('/api/mobile/math/animate/linear', { m, c, x_range, y_range });
      return response.data.data;
    } catch (error) {
      console.error('Linear animation error:', error);
      return null;
    }
  },

  generateExpressionAnimation: async (
    expression: string,
    x_range?: GraphRange,
    y_range?: GraphRange
  ): Promise<{ video_path: string } | null> => {
    try {
      const response = await api.post('/api/mobile/math/animate/expression', { expression, x_range, y_range });
      return response.data.data;
    } catch (error) {
      console.error('Expression animation error:', error);
      return null;
    }
  },

  /** Submit one or more images as the student's answer for Vertex AI analysis (graph practice). */
  submitAnswerImages: async (
    questionText: string,
    imageUris: string[]
  ): Promise<{ processed_text?: string; solution?: string; feedback?: string; analysis?: string } | null> => {
    try {
      const formData = new FormData();
      formData.append('question', questionText);
      imageUris.forEach((uri, i) => {
        formData.append('images', {
          uri,
          type: 'image/jpeg',
          name: `answer_${i}.jpg`,
        } as any);
      });
      const response = await api.post('/api/mobile/math/graph/answer-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Submit answer images error:', error);
      throw error;
    }
  },
};
