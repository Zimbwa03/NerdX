// Math API for Scan & Solve - matches mobile
import api from './config';

export interface ScanResult {
  success: boolean;
  latex: string;
  detected_text?: string;
  confidence: number;
  method: string;
}

export interface MathSolution {
  success: boolean;
  steps: Array<{
    step: number;
    description: string;
    latex: string;
    explanation?: string;
  }>;
  latex_solutions: string[];
  explanation: string;
  solvedOffline?: boolean;
}

export const mathApi = {
  scanImage: async (imageBase64: string, mimeType: string = 'image/png'): Promise<ScanResult> => {
    const response = await api.post('/api/mobile/math/scan-gemini', {
      image_base64: imageBase64,
      mime_type: mimeType,
    });
    const data = response.data?.data;
    if (!data) {
      return { success: false, latex: '', confidence: 0, method: 'api-error' };
    }
    return {
      success: true,
      latex: data.latex || data.detected_text || '',
      detected_text: data.detected_text,
      confidence: data.confidence ?? 0.9,
      method: data.method || 'vertex-vision',
    };
  },

  solveProblem: async (problem: string): Promise<MathSolution | null> => {
    try {
      const response = await api.post('/api/mobile/math/solve', { problem });
      const data = response.data?.data;
      if (!data) return null;
      return {
        success: data.success !== false,
        steps: data.steps ?? [],
        latex_solutions: data.latex_solutions ?? [],
        explanation: data.explanation ?? '',
        solvedOffline: data.solvedOffline ?? false,
      };
    } catch (err) {
      console.error('Math solve error:', err);
      throw err;
    }
  },
};
