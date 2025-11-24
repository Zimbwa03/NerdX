// Science Notes API service
import api from './config';

export interface NotesSection {
    title: string;
    content: string; // Markdown formatted
    diagrams: string[]; // Image URLs
    subsections?: NotesSection[];
}

export interface TopicNotes {
    topic: string;
    subject: string;
    sections: NotesSection[];
    key_points: string[];
    exam_tips: string[];
    summary: string;
}

export const scienceNotesApi = {
    getTopics: async (subject: 'Biology' | 'Chemistry' | 'Physics'): Promise<string[]> => {
        try {
            const response = await api.get('/api/mobile/science/notes/topics', {
                params: { subject }
            });
            return response.data.data.topics || [];
        } catch (error: any) {
            console.error('Get topics error:', error);
            throw error;
        }
    },

    getTopicNotes: async (
        subject: 'Biology' | 'Chemistry' | 'Physics',
        topic: string
    ): Promise<TopicNotes | null> => {
        try {
            const response = await api.get(`/api/mobile/science/notes/${subject}/${topic}`);
            return response.data.data || null;
        } catch (error: any) {
            console.error('Get topic notes error:', error);
            if (error.response?.status === 404) {
                return null; // Notes not yet available
            }
            throw error;
        }
    },
};
