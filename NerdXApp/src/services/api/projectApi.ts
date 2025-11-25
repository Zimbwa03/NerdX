// Project Assistant API services - Database-backed
import api from './config';

export interface Project {
  id: number;
  title: string;
  subject: string;
  current_stage: string;
  completed: boolean;
  updated_at: string;
}

export interface ProjectDetails extends Project {
  project_data: any;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  project_id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CreateProjectRequest {
  title: string;
  subject: string;
  student_name: string;
  student_surname: string;
  school: string;
  form: string;
}

export interface ChatResponse {
  response: string;
  project_id: number;
  credits_remaining?: number;
}

export const projectApi = {
  // Create a new project
  createProject: async (data: CreateProjectRequest): Promise<Project | null> => {
    try {
      const response = await api.post('/api/mobile/project/create', data);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Create project error:', error);
      throw error;
    }
  },

  // Get all user projects
  listProjects: async (): Promise<Project[]> => {
    try {
      const response = await api.get('/api/mobile/project/list');
      return response.data.data?.projects || [];
    } catch (error: any) {
      console.error('List projects error:', error);
      throw error;
    }
  },

  // Get specific project details
  getProject: async (projectId: number): Promise<ProjectDetails | null> => {
    try {
      const response = await api.get(`/api/mobile/project/${projectId}`);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Get project error:', error);
      throw error;
    }
  },

  // Send chat message
  sendMessage: async (
    projectId: number,
    message: string
  ): Promise<ChatResponse | null> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/chat`, {
        message,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Send project message error:', error);
      throw error;
    }
  },

  // Get chat history
  getChatHistory: async (projectId: number): Promise<ChatMessage[]> => {
    try {
      const response = await api.get(`/api/mobile/project/${projectId}/history`);
      return response.data.data?.history || [];
    } catch (error: any) {
      console.error('Get chat history error:', error);
      throw error;
    }
  },

  // Generate project document
  generateDocument: async (projectId: number): Promise<string | null> => {
    try {
      const response = await api.get(`/api/mobile/project/${projectId}/document`);
      return response.data.data?.document_url || null;
    } catch (error: any) {
      console.error('Generate document error:', error);
      throw error;
    }
  },
};
