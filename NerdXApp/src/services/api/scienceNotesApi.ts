// Science Notes API service - OFFLINE VERSION
// Notes are bundled with the app for instant, offline access

import { getTopics, getTopicNotes, TopicNotes, NotesSection } from '../../data/scienceNotes';

// Re-export types for backwards compatibility
export type { TopicNotes, NotesSection };

export const scienceNotesApi = {
    /**
     * Get all topics for a subject
     * Returns immediately from local data - no network required
     */
    getTopics: async (subject: 'Biology' | 'Chemistry' | 'Physics'): Promise<string[]> => {
        try {
            // Return topics from local bundled data
            return getTopics(subject);
        } catch (error: any) {
            console.error('Get topics error:', error);
            throw error;
        }
    },

    /**
     * Get detailed notes for a specific topic
     * Returns immediately from local data - no network required
     */
    getTopicNotes: async (
        subject: 'Biology' | 'Chemistry' | 'Physics',
        topic: string
    ): Promise<TopicNotes | null> => {
        try {
            // Return notes from local bundled data
            return getTopicNotes(subject, topic);
        } catch (error: any) {
            console.error('Get topic notes error:', error);
            throw error;
        }
    },
};
