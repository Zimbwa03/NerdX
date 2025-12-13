// Flashcard API Service
// Handles communication with backend flashcard generation endpoints

import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flashcard } from '../../components/FlashcardPlayer';

const getAuthToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('authToken');
    } catch {
        return null;
    }
};

export const flashcardApi = {
    /**
     * Generate a batch of flashcards for a topic (max 100)
     */
    generateFlashcards: async (
        subject: string,
        topic: string,
        count: number,
        notesContent: string = ''
    ): Promise<Flashcard[]> => {
        try {
            const token = await getAuthToken();

            const response = await fetch(`${API_BASE_URL}/flashcards/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({
                    subject,
                    topic,
                    count: Math.min(count, 100),
                    notes_content: notesContent,
                }),
            });

            const data = await response.json();

            if (data.success && data.data?.flashcards) {
                return data.data.flashcards;
            }

            console.error('Flashcard generation failed:', data.message);
            return [];
        } catch (error) {
            console.error('Flashcard API error:', error);
            throw error;
        }
    },

    /**
     * Generate a single flashcard (for streaming mode with >100 cards)
     */
    generateSingleFlashcard: async (
        subject: string,
        topic: string,
        index: number,
        notesContent: string = '',
        previousQuestions: string[] = []
    ): Promise<Flashcard | null> => {
        try {
            const token = await getAuthToken();

            const response = await fetch(`${API_BASE_URL}/flashcards/generate-single`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({
                    subject,
                    topic,
                    index,
                    notes_content: notesContent,
                    previous_questions: previousQuestions,
                }),
            });

            const data = await response.json();

            if (data.success && data.data?.flashcard) {
                return data.data.flashcard;
            }

            console.error('Single flashcard generation failed:', data.message);
            return null;
        } catch (error) {
            console.error('Flashcard API error:', error);
            return null;
        }
    },
};

export default flashcardApi;
