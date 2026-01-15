/**
 * Math Notes API Service
 * Handles fetching math notes from the backend with a local fallback.
 */

import api from './config';
import { getMathTopicNotes, getMathTopics, MathTopicNotes } from '../../data/mathNotes';
import { getALevelPureMathNotes } from '../../data/aLevelPureMath';

export const mathNotesApi = {
    /**
     * Get available topics for Mathematics
     */
    getTopics: async (): Promise<string[]> => {
        try {
            const response = await api.get('/api/mobile/math/notes/topics');
            if (response.data.success) {
                return response.data.data.topics;
            }
            return getMathTopics();
        } catch (error) {
            console.log('Fetching math topics from server failed, using local fallback');
            return getMathTopics();
        }
    },

    /**
     * Get notes for a specific topic
     * Now checks both O-Level and A-Level Pure Math notes
     */
    getTopicNotes: async (topic: string, gradeLevel: string = 'O-Level'): Promise<MathTopicNotes | null> => {
        try {
            const response = await api.post('/api/mobile/math/notes/generate', {
                topic,
                grade_level: gradeLevel
            });

            if (response.data.success) {
                // Ensure the subject is set correctly for the frontend
                const notes = response.data.data;
                notes.subject = 'Mathematics';
                return notes;
            }
            // Fallback to local notes
            return getMathTopicNotes(topic) || getALevelPureMathNotes(topic);
        } catch (error) {
            console.log('Generating math notes from server failed, using local fallback', error);
            // First try O-Level notes, then A-Level Pure Math notes
            const oLevelNotes = getMathTopicNotes(topic);
            if (oLevelNotes) return oLevelNotes;

            // Check A-Level Pure Math notes
            const aLevelNotes = getALevelPureMathNotes(topic);
            return aLevelNotes;
        }
    }
};

