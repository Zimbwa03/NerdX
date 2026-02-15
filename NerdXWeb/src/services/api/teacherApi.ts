// Teacher Mode API for NerdX Web (parity with mobile)
import api from './config';

export interface TeacherSession {
  session_id: string;
  subject: string;
  grade_level: string;
  topic?: string;
  initial_message: string;
  updated_at?: string;
  credits_remaining?: number;
}

export interface TeacherHistoryItem {
  session_id: string;
  subject: string;
  grade_level: string;
  topic?: string;
  last_message?: string;
  updated_at: string;
}

export interface TeacherMessageResponse {
  response: string;
  session_id: string;
  session_ended?: boolean;
  graph_url?: string;
  video_url?: string;
  context_pack_id?: string;
  credits_remaining?: number;
}

export interface DocumentAnalysis {
  analysis: string;
}

export interface WebSearchResult {
  response: string;
}

export interface TranscriptionResult {
  success: boolean;
  text?: string;
  language?: string;
  message?: string;
}

export const teacherApi = {
  startSession: async (
    subject: string,
    grade_level: string,
    topic?: string
  ): Promise<TeacherSession | null> => {
    const response = await api.post('/api/mobile/teacher/start', {
      subject,
      grade_level,
      topic,
    });
    const data = (response.data?.data ?? null) as TeacherSession | null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },

  sendMessage: async (
    sessionId: string,
    message: string,
    contextPackId?: string
  ): Promise<TeacherMessageResponse | null> => {
    const response = await api.post('/api/mobile/teacher/message', {
      session_id: sessionId,
      message,
      ...(contextPackId != null && { context_pack_id: contextPackId }),
    });
    const data = (response.data?.data ?? null) as TeacherMessageResponse | null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },

  getHistory: async (): Promise<TeacherHistoryItem[]> => {
    try {
      const response = await api.get('/api/mobile/teacher/history');
      if (response.data?.data) return response.data.data;
      return [];
    } catch {
      return [];
    }
  },

  deleteSession: async (sessionId: string): Promise<boolean> => {
    const response = await api.delete(`/api/mobile/teacher/session/${sessionId}`);
    return response.data?.success !== false;
  },

  analyzeDocument: async (
    documentBase64: string,
    mimeType: string = 'application/pdf',
    prompt?: string
  ): Promise<DocumentAnalysis | null> => {
    const response = await api.post('/api/mobile/teacher/analyze-document', {
      document: documentBase64,
      mime_type: mimeType,
      ...(prompt != null && { prompt }),
    });
    return (response.data?.data ?? null) as DocumentAnalysis | null;
  },

  searchWeb: async (query: string): Promise<WebSearchResult | null> => {
    const response = await api.post('/api/mobile/teacher/search', { query });
    return (response.data?.data ?? null) as WebSearchResult | null;
  },

  transcribeAudio: async (audioFile: File): Promise<TranscriptionResult> => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    const response = await api.post<TranscriptionResult>('/api/mobile/voice/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
