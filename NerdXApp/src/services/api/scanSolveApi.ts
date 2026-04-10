import api from './config';
import type { ScanSolveApiResponse } from '../../types/scanSolve';

export interface ScanSolveRequest {
  text?: string;
  imageUri?: string;
  subjectHint?: string;
  level?: 'O-Level' | 'A-Level';
}

async function buildImagePart(imageUri: string) {
  const filename = imageUri.split('/').pop() || `scan-${Date.now()}.jpg`;
  const extension = filename.split('.').pop()?.toLowerCase();
  const type = extension === 'png' ? 'image/png' : 'image/jpeg';
  return {
    uri: imageUri,
    name: filename,
    type,
  } as any;
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
    if (request.level?.trim()) {
      formData.append('level', request.level.trim());
    }
    if (request.imageUri) {
      formData.append('image', await buildImagePart(request.imageUri));
    }

    const response = await api.post('/api/solve', formData, {
      timeout: 180000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return response.data as ScanSolveApiResponse;
  },
};
