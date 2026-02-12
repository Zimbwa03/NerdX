// Flashcard API Service for Web
import api from './config';

export interface Flashcard {
    question: string;
    answer: string;
    /** easy | medium | difficult - from API when available */
    difficulty?: 'easy' | 'medium' | 'difficult';
    /** Section of the topic - from API when available */
    category?: string;
    /** Optional hint - from API when available */
    hint?: string | null;
    /** Optional id - API may not return; we use index as fallback */
    id?: number;
}

export interface GenerateFlashcardsResult {
    flashcards: Flashcard[];
    creditsRemaining?: number;
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
    ): Promise<GenerateFlashcardsResult> => {
        try {
            // Use the axios instance which handles auth tokens automatically
            const response = await api.post('/api/mobile/flashcards/generate', {
                subject,
                topic,
                count: Math.min(count, 100),
                notes_content: notesContent,
            });

            const flashcards = response.data?.data?.flashcards ?? response.data?.flashcards ?? [];
            const creditsRemaining =
                response.data?.data?.credits_remaining ??
                response.data?.data?.creditsRemaining ??
                response.data?.credits_remaining ??
                response.data?.creditsRemaining;

            if (Array.isArray(flashcards) && flashcards.length > 0) {
                return { flashcards, creditsRemaining };
            }

            console.error('Flashcard generation failed:', response.data?.message);
            return { flashcards: [], creditsRemaining };
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
