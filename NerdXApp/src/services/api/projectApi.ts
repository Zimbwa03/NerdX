// Project Assistant API services
import api from './config';

export interface ProjectSession {
  session_id: string;
  project_title: string;
  subject: string;
  initial_message: string;
}

export interface ProjectMessageResponse {
  response: string;
  session_id: string;
  session_ended?: boolean;
}

export const projectApi = {
  startSession: async (
    projectTitle: string,
    subject: string
  ): Promise<ProjectSession | null> => {
    try {
      const response = await api.post('/api/mobile/project/start', {
        project_title: projectTitle,
        subject,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Start project session error:', error);
      throw error;
    }
  },

  sendMessage: async (
    sessionId: string,
    message: string
  ): Promise<ProjectMessageResponse | null> => {
    try {
      const response = await api.post('/api/mobile/project/message', {
        session_id: sessionId,
        message,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Send project message error:', error);
      throw error;
    }
  },
};
