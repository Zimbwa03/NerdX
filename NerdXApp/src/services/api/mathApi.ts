import api from './config';
import { Platform } from 'react-native';
import HybridAIService from '../HybridAIService';

// Types
export interface MathSolution {
    success: boolean;
    steps: Array<{
        step: number;
        description: string;
        latex: string;
        explanation?: string;
    }>;
    latex_solutions: string[];
    explanation: string;
}

export interface ScanResult {
    success: boolean;
    latex: string;
    confidence: number;
    method: string;
}

export interface SimilarQuestion {
    id: string;
    question_text: string;
    similarity_score: number;
    year?: number;
    paper?: number;
}

export const mathApi = {
    // SymPy Solver
    solveProblem: async (problem: string): Promise<MathSolution> => {
        try {
            const response = await api.post('/api/mobile/math/solve', { problem });
            return response.data.data;
        } catch (error) {
            console.error('Math solve error:', error);
            throw error;
        }
    },

    // Pix2Text OCR
    scanProblem: async (imageUri: string): Promise<ScanResult> => {
        try {
            const formData = new FormData();

            const filename = imageUri.split('/').pop() || 'scan.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('image', {
                uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
                name: filename,
                type,
            } as any);

            const response = await api.post('/api/mobile/math/scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Math scan error:', error);
            throw error;
        }
    },

    // Vector Search
    findSimilar: async (query: string): Promise<SimilarQuestion[]> => {
        try {
            const response = await api.post('/api/mobile/vector/search-similar', { query_text: query });
            return response.data.data.results;
        } catch (error) {
            console.error('Math search error:', error);
            throw error;
        }
    },

    // Voice - Speech to Text
    transcribeAudio: async (audioUri: string): Promise<{ text: string; language: string }> => {
        try {
            const formData = new FormData();

            const filename = audioUri.split('/').pop() || 'audio.m4a';
            const type = 'audio/m4a'; // Adjust based on recording format

            formData.append('audio', {
                uri: Platform.OS === 'ios' ? audioUri.replace('file://', '') : audioUri,
                name: filename,
                type,
            } as any);

            const response = await api.post('/mobile/voice/transcribe', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return {
                text: response.data.text,
                language: response.data.language
            };
        } catch (error) {
            console.error('Voice transcribe error:', error);
            throw error;
        }
    },

    // Voice - Text to Speech
    speakText: async (text: string): Promise<string> => {
        try {
            const response = await api.post('/mobile/voice/speak', { text });
            // Return full URL by prepending base URL if needed, 
            // but backend returns relative path /static/...
            // api.defaults.baseURL handles the domain part for requests, 
            // but for <Video> source we need the full URL.
            const relativePath = response.data.audio_url;
            const baseURL = api.defaults.baseURL || '';
            return `${baseURL}${relativePath}`;
        } catch (error) {
            console.error('Voice speak error:', error);
            throw error;
        }
    },

    // AI Help (Hybrid Online/Offline)
    getAIHelp: async (question: string): Promise<string> => {
        try {
            const response = await HybridAIService.generateResponse(
                question,
                'mathematics',
                { maxTokens: 512 }
            );
            return response.text;
        } catch (error) {
            console.error('Math AI help error:', error);
            throw error;
        }
    }
};
