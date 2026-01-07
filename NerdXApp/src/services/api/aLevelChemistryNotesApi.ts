// A Level Chemistry Notes API service - OFFLINE VERSION
// Notes are bundled with the app for instant, offline access

import { getTopicNotes, TopicNotes, NotesSection } from '../../data/aLevelChemistry';
import { TopicNotes as BaseTopicNotes } from '../../data/scienceNotes/types';

// Re-export types for backwards compatibility
export type { TopicNotes, NotesSection };

export const aLevelChemistryNotesApi = {
    /**
     * Get detailed notes for a specific A Level Chemistry topic
     * Returns immediately from local data - no network required
     */
    getTopicNotes: async (topic: string): Promise<TopicNotes | null> => {
        try {
            // Return notes from local bundled data
            return getTopicNotes(topic);
        } catch (error: any) {
            console.error('Get A Level Chemistry topic notes error:', error);
            throw error;
        }
    },

    /**
     * Check if notes are available for a topic
     */
    hasNotes: (topic: string): boolean => {
        try {
            const notes = getTopicNotes(topic);
            return notes !== null;
        } catch {
            return false;
        }
    },
};

