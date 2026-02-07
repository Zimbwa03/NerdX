// Flashcard API Service for Web
import api from './config';

export interface Flashcard {
    question: string;
    answer: string;
}

export const flashcardApi = {
    /**
     * Generate a batch of flashcards for a topic
     */
    generateFlashcards: async (
        subject: string,
        topic: string,
        count: number,
        notesContent: string = ''
    ): Promise<Flashcard[]> => {
        try {
            // Use the axios instance which handles auth tokens automatically
            const response = await api.post('/api/mobile/flashcards/generate', {
                subject,
                topic,
                count: Math.min(count, 50), // Cap at 50 for web to be safe
                notes_content: notesContent,
            });

            if (response.data.success && response.data.data?.flashcards) {
                return response.data.data.flashcards;
            }

            console.error('Flashcard generation failed:', response.data?.message);
            return [];
        } catch (error) {
            console.error('Flashcard generation error:', error);
            throw error;
        }
    },

    /**
     * Generate a single flashcard (for potential future streaming use)
     */
    generateSingleFlashcard: async (
        subject: string,
        topic: string,
        index: number,
        notesContent: string = '',
        previousQuestions: string[] = []
    ): Promise<Flashcard | null> => {
        try {
            const response = await api.post('/api/mobile/flashcards/generate-single', {
                subject,
                topic,
                index,
                notes_content: notesContent,
                previous_questions: previousQuestions,
            });

            if (response.data.success && response.data.data?.flashcard) {
                return response.data.data.flashcard;
            }
            return null;
        } catch (error) {
            console.error('Single flashcard generation error:', error);
            return null;
        }
    }
};

export default flashcardApi;
