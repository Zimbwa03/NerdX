// Project Assistant API for NerdX Web (ZIMSEC projects)
import api from './config';

export type ProjectLevel = 'O-Level' | 'A-Level';

export interface ProjectListItem {
  id: number;
  title?: string | null;
  subject?: string | null;
  current_stage?: string | number | null;
  updated_at?: string | null;
  completed?: boolean | null;
}

export interface ProjectDetail {
  id: number;
  title?: string | null;
  subject?: string | null;
  current_stage?: string | number | null;
  completed?: boolean | null;
  updated_at?: string | null;
  created_at?: string | null;
  project_data?: unknown;
}

export interface CreateProjectPayload {
  subject: string;
  level: ProjectLevel;
  title?: string;
  school?: string;
  form?: string;
}

export interface ProjectHistoryItem {
  id: number;
  project_id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string | null;
}

export interface ProjectChatResponse {
  response: string;
  project_id: number;
  context_pack_id?: string;
  credits_remaining?: number;
}

export interface ProjectDocumentAnalysis {
  analysis: string;
  interaction_id?: string;
}

function normalizeProjectTitle(title: unknown): string {
  if (typeof title !== 'string') return '';
  return title.trim();
}

export const projectAssistantApi = {
  listProjects: async (): Promise<ProjectListItem[]> => {
    const response = await api.get('/api/mobile/project/list');
    const projects = (response.data?.data?.projects ?? []) as ProjectListItem[];
    return Array.isArray(projects) ? projects : [];
  },

  createProject: async (payload: CreateProjectPayload): Promise<ProjectDetail | null> => {
    const response = await api.post('/api/mobile/project/create', {
      ...payload,
      title: normalizeProjectTitle(payload.title),
    });
    return (response.data?.data ?? null) as ProjectDetail | null;
  },

  getProject: async (projectId: number): Promise<ProjectDetail | null> => {
    const response = await api.get(`/api/mobile/project/${projectId}`);
    return (response.data?.data ?? null) as ProjectDetail | null;
  },

  getHistory: async (projectId: number): Promise<ProjectHistoryItem[]> => {
    const response = await api.get(`/api/mobile/project/${projectId}/history`);
    const history = (response.data?.data?.history ?? []) as ProjectHistoryItem[];
    return Array.isArray(history) ? history : [];
  },

  sendMessage: async (
    projectId: number,
    message: string,
    contextPackId?: string
  ): Promise<ProjectChatResponse | null> => {
    const response = await api.post(`/api/mobile/project/${projectId}/chat`, {
      message,
      ...(contextPackId != null && { context_pack_id: contextPackId }),
    });
    const data = (response.data?.data ?? null) as ProjectChatResponse | null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },

  deleteProject: async (projectId: number): Promise<boolean> => {
    const response = await api.delete(`/api/mobile/project/${projectId}`);
    return response.data?.success !== false;
  },

  analyzeDocument: async (
    projectId: number,
    documentBase64: string,
    mimeType: string = 'application/pdf',
    prompt?: string
  ): Promise<ProjectDocumentAnalysis | null> => {
    const response = await api.post(`/api/mobile/project/${projectId}/analyze-document`, {
      document: documentBase64,
      mime_type: mimeType,
      ...(prompt != null && { prompt }),
    });
    return (response.data?.data ?? null) as ProjectDocumentAnalysis | null;
  },
};

