// Flashcard API Service
// Handles communication with backend flashcard generation endpoints

import { API_BASE_URL, getAuthToken, setAuthToken } from './config';
import api from './config';
import { Flashcard } from '../../components/FlashcardPlayer';

/** Thrown when the server returns 401 (missing or invalid token). Use to show "Sign in" in UI. */
export class FlashcardAuthError extends Error {
    constructor(message: string = 'Please sign in to generate flashcards.') {
        super(message);
        this.name = 'FlashcardAuthError';
    }
}

/** Try to refresh JWT and return new token or null. */
async function tryRefreshToken(): Promise<string | null> {
    try {
        const response = await api.post<{ success: boolean; token?: string }>('/api/mobile/auth/refresh-token');
        if (response.data?.success && response.data?.token) {
            await setAuthToken(response.data.token);
            return response.data.token;
        }
    } catch {
        // ignore
    }
    return null;
}

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
        let token = await getAuthToken();

        const doRequest = async (authToken: string | null) => {
            const response = await fetch(`${API_BASE_URL}/api/mobile/flashcards/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
                },
                body: JSON.stringify({
                    subject,
                    topic,
                    count: Math.min(count, 100),
                    notes_content: notesContent,
                }),
            });

            if (response.status === 401) {
                throw new FlashcardAuthError();
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Flashcard API HTTP error:', response.status, errorText.substring(0, 200));
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            if (data.success && data.data?.flashcards) {
                return data.data.flashcards;
            }
            console.error('Flashcard generation failed:', data.message);
            return [];
        };

        try {
            return await doRequest(token);
        } catch (err) {
            if (err instanceof FlashcardAuthError && token) {
                const newToken = await tryRefreshToken();
                if (newToken) {
                    try {
                        return await doRequest(newToken);
                    } catch (retryErr) {
                        if (retryErr instanceof FlashcardAuthError) throw retryErr;
                        throw retryErr;
                    }
                }
            }
            if (err instanceof FlashcardAuthError) throw err;
            throw err;
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
        let token = await getAuthToken();

        const doRequest = async (authToken: string | null) => {
            const response = await fetch(`${API_BASE_URL}/api/mobile/flashcards/generate-single`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
                },
                body: JSON.stringify({
                    subject,
                    topic,
                    index,
                    notes_content: notesContent,
                    previous_questions: previousQuestions,
                }),
            });

            if (response.status === 401) {
                throw new FlashcardAuthError();
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Flashcard API HTTP error:', response.status, errorText.substring(0, 200));
                return null;
            }

            const data = await response.json();
            if (data.success && data.data?.flashcard) {
                return data.data.flashcard;
            }
            console.error('Single flashcard generation failed:', data.message);
            return null;
        };

        try {
            return await doRequest(token);
        } catch (err) {
            if (err instanceof FlashcardAuthError) throw err;
            if (token) {
                const newToken = await tryRefreshToken();
                if (newToken) {
                    try {
                        return await doRequest(newToken);
                    } catch (retryErr) {
                        if (retryErr instanceof FlashcardAuthError) throw retryErr;
                        return null;
                    }
                }
            }
            throw err;
        }
    },
};

export default flashcardApi;
