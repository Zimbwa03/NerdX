// A Level Physics Notes API service - OFFLINE VERSION
// Notes are bundled with the app for instant, offline access

import { aLevelPhysicsNotes, getTopicNotes } from '../../data/aLevelPhysics';
import { TopicNotes } from '../../data/scienceNotes/types';

// Re-export type for backwards compatibility
export type { TopicNotes };

export const aLevelPhysicsNotesApi = {
    /**
     * Get detailed notes for a specific A Level Physics topic
     * Returns immediately from local data - no network required
     */
    getTopicNotes: async (topic: string): Promise<TopicNotes | null> => {
        try {
            // Return notes from local bundled data
            const notes = getTopicNotes(topic);
            return notes;
        } catch (error: any) {
            console.error('Get A Level Physics topic notes error:', error);
            return null;
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

    /**
     * Get all available topic names
     */
    getAllTopics: (): string[] => {
        return Object.keys(aLevelPhysicsNotes);
    },
};
