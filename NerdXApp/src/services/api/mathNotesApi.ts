/**
 * Math Notes API Service
 * Uses local notes directly for offline access - no server calls needed.
 */

import type { MathTopicNotes } from '../../data/mathNotes/types';
import { getALevelPureMathNotes, getAvailableALevelPureMathTopics } from '../../data/aLevelPureMath';
import { getOLevelMathNotes, getAvailableOLevelMathTopics } from '../../data/oLevelMath/notes';
import { getMathFormTopicNotes } from '../../data/mathematics';

export const mathNotesApi = {
    /**
     * Get available topics for Mathematics
     * Uses local data directly - works offline
     */
    getTopics: async (gradeLevel: string = 'O-Level'): Promise<string[]> => {
        if (gradeLevel === 'A-Level' || gradeLevel === 'A Level') {
            return getAvailableALevelPureMathTopics();
        }
        return getAvailableOLevelMathTopics();
    },

    /**
     * Get notes for a specific topic
     * Uses local data directly - works offline
     * Checks O-Level, A-Level Pure Math notes
     */
    getTopicNotes: async (
        topic: string,
        gradeLevel: string = 'O-Level',
        formLevel?: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4'
    ): Promise<MathTopicNotes | null> => {
        // For A-Level, check A-Level Pure Math notes first
        if (gradeLevel === 'A-Level' || gradeLevel === 'A Level') {
            const aLevelNotes = getALevelPureMathNotes(topic);
            if (aLevelNotes) {
                return aLevelNotes;
            }
        }

        // Form-specific O-Level notes (new structure)
        if (formLevel) {
            const formScopedNotes = getMathFormTopicNotes(topic, formLevel);
            if (formScopedNotes) {
                return formScopedNotes;
            }
        }

        // Try comprehensive O-Level notes first (new file with detailed notes)
        const comprehensiveNotes = getOLevelMathNotes(topic);
        if (comprehensiveNotes) {
            return comprehensiveNotes;
        }

        return null;
    }
};
