import api from './config';
import { Platform } from 'react-native';
import HybridAIService from '../HybridAIService';
import { offlineMathSolver, OfflineMathSolution } from '../OfflineMathSolver';
import NetInfo from '@react-native-community/netinfo';

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
    solvedOffline?: boolean;
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
    // Hybrid Math Solver - tries offline first, then server
    solveProblem: async (problem: string): Promise<MathSolution> => {
        // First, try solving offline with mathjs
        console.log('Attempting offline solve with mathjs...');
        const offlineResult = offlineMathSolver.solve(problem);

        if (offlineResult.success) {
            console.log('Solved offline successfully!');
            return {
                ...offlineResult,
                solvedOffline: true,
            };
        }

        // Check network connectivity
        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
            console.log('No network connection, returning offline failure');
            return {
                success: false,
                steps: [{
                    step: 1,
                    description: 'Offline Mode',
                    latex: problem,
                    explanation: 'Could not solve this problem offline. Please connect to the internet for complex equations.'
                }],
                latex_solutions: [],
                explanation: 'This problem requires server processing. Please check your internet connection.',
                solvedOffline: true,
            };
        }

        // Fallback to server for complex problems
        console.log('Falling back to server for complex solve...');
        try {
            const response = await api.post('/api/mobile/math/solve', { problem });
            return {
                ...response.data.data,
                solvedOffline: false,
            };
        } catch (error) {
            console.error('Math solve error:', error);
            throw error;
        }
    },

    // Hybrid OCR for math equations - offline first, then online
    scanProblem: async (imageUri: string): Promise<ScanResult> => {
        // STEP 1: Try offline OCR with ML Kit first (works without internet!)
        try {
            console.log('Attempting offline OCR with ML Kit...');
            const { offlineOCRService } = await import('../OfflineOCRService');
            const offlineResult = await offlineOCRService.recognizeText(imageUri);

            if (offlineResult.success && offlineResult.text.trim().length > 0) {
                console.log('Offline OCR successful:', offlineResult.text);
                return {
                    success: true,
                    latex: offlineResult.latex || offlineResult.text,
                    confidence: offlineResult.confidence,
                    method: 'offline-mlkit'
                };
            }
            console.log('Offline OCR returned empty result, trying online...');
        } catch (offlineError) {
            console.log('Offline OCR failed, trying online methods:', offlineError);
        }

        // STEP 2: Check network connectivity
        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
            console.log('No network - returning offline failure');
            return {
                success: false,
                latex: '',
                confidence: 0,
                method: 'offline-failed'
            };
        }

        // STEP 3: Try NerdX Cloud OCR (Vertex-backed)
        try {
            console.log('Attempting online OCR with NerdX Cloud OCR...');

            // Convert image to base64
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    const base64Data = base64String.split(',')[1];
                    resolve(base64Data);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            const apiResponse = await api.post('/api/mobile/math/scan-gemini', {
                image_base64: base64,
            });

            if (apiResponse.data?.data) {
                console.log('NerdX Cloud OCR successful');
                return {
                    success: true,
                    latex: apiResponse.data.data.latex || apiResponse.data.data.detected_text || '',
                    confidence: apiResponse.data.data.confidence || 0.9,
                    method: apiResponse.data.data.method || 'vertex-vision'
                };
            }
        } catch (cloudOcrError) {
            console.error('Cloud OCR failed:', cloudOcrError);
        }

        // All methods failed
        return {
            success: false,
            latex: '',
            confidence: 0,
            method: 'all-failed'
        };
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

            const response = await api.post('/api/mobile/voice/transcribe', formData, {
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
            const response = await api.post('/api/mobile/voice/speak', { text });
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
