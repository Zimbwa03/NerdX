import api from './config';
import type { ScanSolveApiResponse } from '../../types/scanSolve';

export interface ScanSolveRequest {
  text?: string;
  image?: File | null;
  subjectHint?: string;
  level?: 'O-Level' | 'A-Level';
}

export const scanSolveApi = {
  async solve(request: ScanSolveRequest): Promise<ScanSolveApiResponse> {
    const formData = new FormData();
    if (request.text?.trim()) {
      formData.append('text', request.text.trim());
    }
    if (request.subjectHint?.trim()) {
      formData.append('subject_hint', request.subjectHint.trim());
    }
    if (request.level) {
      formData.append('level', request.level);
    }
    if (request.image) {
      formData.append('image', request.image);
    }

    // Long timeout: Vertex AI (Gemini) + lesson audio often exceeds 30s. Do not set Content-Type — axios + FormData need the boundary.
    const response = await api.post('/api/solve', formData, {
      timeout: 180000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return response.data as ScanSolveApiResponse;
  },
};
