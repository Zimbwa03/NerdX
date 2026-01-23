// Project Assistant API services - Database-backed
import api from './config';
import HybridAIService from '../HybridAIService';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

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
  image_url?: string;
}

export interface CreateProjectRequest {
  subject: string;
  level: string; // 'O-Level' or 'A-Level'
  school: string;
  form: string;
  // Note: title is NOT required - will be developed in chat
  // Note: student_name and student_surname are fetched from database
}

export interface ChatResponse {
  response: string;
  project_id: number;
  credits_remaining?: number;
  image_url?: string;
  context_pack_id?: string;
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
    message: string,
    contextPackId?: string
  ): Promise<ChatResponse | null> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/chat`, {
        message,
        context_pack_id: contextPackId,
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

  // Generate and download project document as PDF
  generateDocument: async (projectId: number): Promise<string | null> => {
    try {
      const config = await api.get(`/api/mobile/project/${projectId}/document`, {
        responseType: 'blob',
      });

      // Get the blob data
      const blob = config.data;

      // Convert blob to base64 for React Native
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64data = (reader.result as string).split(',')[1];

            // Use expo-file-system to save the file (already imported at top)
            const filename = `Project_${projectId}_${Date.now()}.pdf`;
            const fileUri = `${FileSystem.documentDirectory}${filename}`;

            // Write file
            await FileSystem.writeAsStringAsync(fileUri, base64data, {
              encoding: FileSystem.EncodingType.Base64,
            });

            // Share/download the file
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(fileUri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Download Project Document',
                UTI: 'com.adobe.pdf'
              });
            }

            resolve(fileUri);
          } catch (error) {
            console.error('Error saving PDF:', error);
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error: any) {
      console.error('Generate document error:', error);
      throw error;
    }
  },

  // AI Help (Hybrid Online/Offline)
  getAIHelp: async (question: string): Promise<string> => {
    try {
      const response = await HybridAIService.generateResponse(
        question,
        'general',
        { maxTokens: 512 }
      );
      return response.text;
    } catch (error) {
      console.error('Project AI help error:', error);
      throw error;
    }
  },

  // Delete a project
  deleteProject: async (projectId: number): Promise<boolean> => {
    try {
      const response = await api.delete(`/api/mobile/project/${projectId}`);
      console.log('Delete project response:', response.data);
      // Check both success field and status code
      if (response.status === 200 && response.data.success === true) {
        return true;
      }
      console.warn('Delete project returned non-success:', response.data);
      return false;
    } catch (error: any) {
      console.error('Delete project error:', error);
      // Log the full error for debugging
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },

  // ==================== Deep Research & Multimodal Features ====================

  // Start Deep Research for a project topic
  startResearch: async (
    projectId: number,
    query: string
  ): Promise<ResearchSession | null> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/research`, {
        query,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Start research error:', error);
      throw error;
    }
  },

  // Check Deep Research status
  checkResearchStatus: async (
    projectId: number,
    interactionId: string
  ): Promise<ResearchStatus | null> => {
    try {
      const response = await api.get(
        `/api/mobile/project/${projectId}/research/status/${interactionId}`
      );
      return response.data.data || null;
    } catch (error: any) {
      console.error('Check research status error:', error);
      throw error;
    }
  },

  // Analyze a document (PDF, etc.) for the project
  analyzeDocument: async (
    projectId: number,
    documentBase64: string,
    mimeType: string = 'application/pdf',
    prompt?: string
  ): Promise<DocumentAnalysis | null> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/analyze-document`, {
        document: documentBase64,
        mime_type: mimeType,
        prompt,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Analyze document error:', error);
      throw error;
    }
  },

  // Send multimodal message (with images, audio, video, documents)
  sendMultimodalMessage: async (
    projectId: number,
    message: string,
    attachments: Attachment[]
  ): Promise<ChatResponse | null> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/multimodal-chat`, {
        message,
        attachments,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Multimodal message error:', error);
      throw error;
    }
  },

  // Web search with Google grounding
  searchWeb: async (
    projectId: number,
    query: string
  ): Promise<WebSearchResult | null> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/web-search`, {
        query,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Web search error:', error);
      throw error;
    }
  },

  // Transcribe audio using Vertex AI Speech-to-Text
  transcribeAudio: async (
    projectId: number,
    audioBase64: string,
    mimeType: string = 'audio/m4a'
  ): Promise<TranscriptionResult | null> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/transcribe`, {
        audio: audioBase64,
        mime_type: mimeType,
      });
      return response.data.data || null;
    } catch (error: any) {
      console.error('Transcribe audio error:', error);
      throw error;
    }
  },

  // Generate educational image using Vertex AI (Gemini + Imagen)
  generateImage: async (
    projectId: number,
    prompt: string,
    aspectRatio?: string
  ): Promise<ImageGenerationResult | null> => {
    try {
      const payload: any = { prompt };
      if (aspectRatio) {
        payload.aspect_ratio = aspectRatio;
      }
      const response = await api.post(`/api/mobile/project/${projectId}/generate-image`, payload);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Generate image error:', error);
      throw error;
    }
  },

  // ==================== Export / Submission Pack Features ====================

  // Generate submission pack PDF
  generateSubmissionPack: async (projectId: number): Promise<ExportResult | null> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/export/generate`, {
        file_type: 'pdf',
      });
      if (response.data.success) {
        return {
          export_id: response.data.export_id,
          filename: response.data.filename,
          download_url: response.data.download_url,
        };
      }
      return null;
    } catch (error: any) {
      console.error('Generate submission pack error:', error);
      throw error;
    }
  },

  // Download the submission pack
  downloadSubmissionPack: async (projectId: number): Promise<string | null> => {
    try {
      // First generate the pack
      const exportResult = await projectApi.generateSubmissionPack(projectId);
      if (!exportResult) {
        throw new Error('Failed to generate submission pack');
      }

      // Download the file
      const downloadUrl = exportResult.download_url;
      const filename = exportResult.filename || `ZIMSEC_Project_${projectId}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      // Download from server
      const downloadResult = await FileSystem.downloadAsync(
        `${api.defaults.baseURL}${downloadUrl}`,
        fileUri
      );

      if (downloadResult.status === 200) {
        // Share/download the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Download Submission Pack',
            UTI: 'com.adobe.pdf',
          });
        }
        return fileUri;
      }
      return null;
    } catch (error: any) {
      console.error('Download submission pack error:', error);
      throw error;
    }
  },

  // Get submission checklist
  getSubmissionChecklist: async (projectId: number): Promise<SubmissionChecklist | null> => {
    try {
      const response = await api.get(`/api/mobile/project/${projectId}/export/checklist`);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Get submission checklist error:', error);
      throw error;
    }
  },

  // Get export preview (what's missing)
  getExportPreview: async (projectId: number): Promise<SubmissionChecklist | null> => {
    try {
      const response = await api.get(`/api/mobile/project/${projectId}/export/preview`);
      return response.data.checklist || null;
    } catch (error: any) {
      console.error('Get export preview error:', error);
      throw error;
    }
  },

  // ==================== Section Management ====================

  // Get all sections for a project
  getSections: async (projectId: number): Promise<ProjectSection[]> => {
    try {
      const response = await api.get(`/api/mobile/project/${projectId}/sections`);
      return response.data.sections || [];
    } catch (error: any) {
      console.error('Get sections error:', error);
      throw error;
    }
  },

  // Save a project section
  saveSection: async (
    projectId: number,
    stageNumber: number,
    sectionKey: string,
    sectionTitle: string,
    content: string
  ): Promise<boolean> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/sections`, {
        stage_number: stageNumber,
        section_key: sectionKey,
        section_title: sectionTitle,
        content,
      });
      return response.data.success || false;
    } catch (error: any) {
      console.error('Save section error:', error);
      throw error;
    }
  },

  // ==================== Evidence Management ====================

  // Add evidence to a project
  addEvidence: async (
    projectId: number,
    stageNumber: number,
    evidenceType: string,
    description: string,
    fileUrl?: string
  ): Promise<number | null> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/evidence`, {
        stage_number: stageNumber,
        evidence_type: evidenceType,
        description,
        file_url: fileUrl,
      });
      return response.data.evidence_id || null;
    } catch (error: any) {
      console.error('Add evidence error:', error);
      throw error;
    }
  },

  // ==================== Reference Management ====================

  // Add a reference to a project
  addReference: async (
    projectId: number,
    citationText: string,
    link?: string
  ): Promise<number | null> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/references`, {
        citation_text: citationText,
        link,
      });
      return response.data.reference_id || null;
    } catch (error: any) {
      console.error('Add reference error:', error);
      throw error;
    }
  },

  // ==================== Logbook Management ====================

  // Add a logbook entry
  addLogbookEntry: async (
    projectId: number,
    entryDate: string,
    stageNumber: number | null,
    activities: string,
    challenges?: string,
    nextSteps?: string,
    evidenceNote?: string
  ): Promise<number | null> => {
    try {
      const response = await api.post(`/api/mobile/project/${projectId}/logbook`, {
        entry_date: entryDate,
        stage_number: stageNumber,
        activities,
        challenges,
        next_steps: nextSteps,
        evidence_note: evidenceNote,
      });
      return response.data.entry_id || null;
    } catch (error: any) {
      console.error('Add logbook entry error:', error);
      throw error;
    }
  },

  // Get logbook entries
  getLogbook: async (projectId: number): Promise<LogbookEntry[]> => {
    try {
      const response = await api.get(`/api/mobile/project/${projectId}/logbook`);
      return response.data.entries || [];
    } catch (error: any) {
      console.error('Get logbook error:', error);
      throw error;
    }
  },
};

// ==================== Additional Interfaces ====================

export interface ResearchSession {
  interaction_id: string;
  status: 'in_progress' | 'completed' | 'failed';
  message: string;
}

export interface ResearchStatus {
  status: 'in_progress' | 'completed' | 'failed' | 'unknown';
  result?: string;
  message: string;
}

export interface DocumentAnalysis {
  analysis: string;
  interaction_id?: string;
}

export interface Attachment {
  type: 'image' | 'audio' | 'video' | 'document';
  data: string; // Base64-encoded data
  mime_type: string;
}

export interface WebSearchResult {
  response: string;
  interaction_id?: string;
}

export interface TranscriptionResult {
  transcription: string;
  language?: string;
  confidence?: number;
}

export interface ImageGenerationResult {
  response: string;
  image_url: string;
  aspect_ratio?: string;
  credits_remaining?: number;
}

export interface ExportResult {
  export_id: number;
  filename: string;
  download_url: string;
}

export interface SubmissionChecklist {
  project_id: number;
  stages: {
    [key: number]: {
      title: string;
      items: Array<{
        key: string;
        title: string;
        completed: boolean;
      }>;
      completed: number;
      total: number;
    };
  };
  evidence_count: number;
  references_count: number;
  logbook_entries_count: number;
  overall_completion: number;
}

export interface ProjectSection {
  id: number;
  project_id: number;
  stage_number: number;
  section_key: string;
  section_title: string;
  content_json: any;
  last_updated: string;
}

export interface LogbookEntry {
  id: number;
  project_id: number;
  entry_date: string;
  stage_number: number | null;
  activities_text: string;
  challenges: string | null;
  next_steps: string | null;
  evidence_note: string | null;
}
