// Project Assistant API for NerdX Web (ZIMSEC projects)
import api, { API_BASE_URL } from './config';

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
  image_url?: string | null;
}

export interface ProjectChatResponse {
  response: string;
  project_id: number;
  context_pack_id?: string;
  credits_remaining?: number;
  image_url?: string;
  aspect_ratio?: string;
}

export interface ProjectDocumentAnalysis {
  analysis: string;
  interaction_id?: string;
}

export interface SubmissionChecklist {
  project_id: number;
  stages: Record<number, {
    title: string;
    items: Array<{
      key: string;
      title: string;
      completed: boolean;
    }>;
    completed: number;
    total: number;
  }>;
  evidence_count: number;
  references_count: number;
  logbook_entries_count: number;
  overall_completion: number;
  ready_for_submission?: boolean;
  missing_stages?: Array<number | string>;
  message?: string;
}

export interface ProjectExportResult {
  export_id?: number;
  filename?: string;
  download_url: string;
  selected_stages?: number[];
}

function normalizeProjectTitle(title: unknown): string {
  if (typeof title !== 'string') return '';
  return title.trim();
}

function toAbsoluteDownloadUrl(downloadUrl: string): string {
  if (!downloadUrl) return '';
  if (/^https?:\/\//i.test(downloadUrl)) return downloadUrl;
  const base = API_BASE_URL || window.location.origin;
  try {
    return new URL(downloadUrl, base).toString();
  } catch {
    return downloadUrl;
  }
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

  generateImage: async (
    projectId: number,
    prompt: string,
    aspectRatio?: string
  ): Promise<ProjectChatResponse | null> => {
    const response = await api.post(`/api/mobile/project/${projectId}/generate-image`, {
      prompt,
      ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
    });
    const data = (response.data?.data ?? null) as ProjectChatResponse | null;
    if (data && response.data?.credits_remaining !== undefined) {
      data.credits_remaining = response.data.credits_remaining;
    }
    return data;
  },

  getSubmissionChecklist: async (projectId: number): Promise<SubmissionChecklist | null> => {
    const response = await api.get(`/api/mobile/project/${projectId}/export/checklist`);
    return (response.data?.data ?? response.data?.checklist ?? null) as SubmissionChecklist | null;
  },

  getExportPreview: async (projectId: number): Promise<SubmissionChecklist | null> => {
    const response = await api.get(`/api/mobile/project/${projectId}/export/preview`);
    return (response.data?.data ?? response.data?.checklist ?? null) as SubmissionChecklist | null;
  },

  generateSubmissionPack: async (
    projectId: number,
    stageNumber?: number
  ): Promise<ProjectExportResult | null> => {
    const response = await api.post(`/api/mobile/project/${projectId}/export/generate`, {
      file_type: 'pdf',
      ...(typeof stageNumber === 'number' ? { stage_number: stageNumber } : {}),
    });

    const raw = response.data?.data ?? response.data ?? null;
    const downloadUrl = raw?.download_url as string | undefined;
    if (!downloadUrl) return null;

    return {
      export_id: raw?.export_id,
      filename: raw?.filename,
      download_url: toAbsoluteDownloadUrl(downloadUrl),
      selected_stages: Array.isArray(raw?.selected_stages) ? raw.selected_stages : undefined,
    };
  },
};
