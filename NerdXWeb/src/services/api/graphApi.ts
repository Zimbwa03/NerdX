// Graph Practice API for NerdX Web - matches mobile
import api, { API_BASE_URL } from './config';

export interface GraphRange {
  min: number;
  max: number;
  step?: number;
}

export interface GraphSpec {
  equation?: string;
  clean_expression?: string;
  graph_type?: string;
  x_range?: GraphRange;
  y_range?: GraphRange;
  coefficients?: { m?: number; c?: number; a?: number; b?: number };
}

export interface GraphData {
  graph_url?: string | null;
  image_url?: string | null;
  equation?: string | null;
  equation_display?: string | null;
  question: string;
  solution: string;
  constraints?: string[];
  objective?: string;
  corner_points?: Array<[number, number]>;
  graph_spec?: GraphSpec;
  credits_remaining?: number;
  no_plot?: boolean;
  graph_type?: string;
}

export const graphApi = {
  generateGraph: async (
    graphType: string,
    equation?: string,
    level: 'o_level' | 'a_level' = 'o_level'
  ): Promise<GraphData | null> => {
    const response = await api.post('/api/mobile/math/graph/generate', {
      graph_type: graphType,
      equation,
      level,
    });
    const payload = response.data?.data ?? response.data;
    const data = payload && typeof payload === 'object' ? (payload as GraphData) : null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },

  generateCustomGraph: async (equation: string): Promise<GraphData | null> => {
    const response = await api.post('/api/mobile/math/graph/custom', { equation });
    const data = (response.data?.data ?? null) as GraphData | null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },

  generateLinearProgramming: async (
    constraints: string[],
    objective?: string
  ): Promise<GraphData | null> => {
    const response = await api.post('/api/mobile/math/graph/linear-programming', {
      constraints,
      objective,
    });
    const data = (response.data?.data ?? null) as GraphData | null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },

  solveGraphFromImage: async (
    imageFile: File
  ): Promise<{ processed_text: string; solution: string; analysis?: string; credits_remaining?: number } | null> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.post('/api/mobile/math/graph/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const data = (response.data?.data ?? null) as { processed_text: string; solution: string; analysis?: string; credits_remaining?: number } | null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },

  submitAnswerImages: async (
    questionText: string,
    imageFiles: File[]
  ): Promise<{ processed_text?: string; solution?: string; feedback?: string; analysis?: string; credits_remaining?: number } | null> => {
    const formData = new FormData();
    formData.append('question', questionText);
    imageFiles.forEach((f) => formData.append('images', f));
    const response = await api.post('/api/mobile/math/graph/answer-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return (response.data?.data ?? null) as { processed_text?: string; solution?: string; feedback?: string; analysis?: string; credits_remaining?: number } | null;
  },

  generateQuadraticAnimation: async (
    a: number,
    b: number,
    c: number,
    x_range?: GraphRange,
    y_range?: GraphRange
  ): Promise<{ video_path: string } | null> => {
    try {
      const res = await api.post('/api/mobile/math/animate/quadratic', { a, b, c, x_range, y_range });
      return res.data?.data ?? null;
    } catch {
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
      const res = await api.post('/api/mobile/math/animate/linear', { m, c, x_range, y_range });
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  generateExpressionAnimation: async (
    expression: string,
    x_range?: GraphRange,
    y_range?: GraphRange
  ): Promise<{ video_path: string } | null> => {
    try {
      const res = await api.post('/api/mobile/math/animate/expression', { expression, x_range, y_range });
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },
};

export function getGraphImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}
