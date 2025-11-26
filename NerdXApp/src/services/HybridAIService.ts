// Hybrid AI Service - Intelligent routing between offline and online AI
import NetworkService from './NetworkService';
import OfflineAIService, { GenerationOptions } from './OfflineAIService';
import api from './api/config';

export interface AIResponse {
    text: string;
    source: 'offline' | 'online';
    timestamp: string;
}

export interface AIServiceConfig {
    preferOffline?: boolean; // Default: false (prefer online when available)
    offlineOnly?: boolean; // Force offline mode
    onlineOnly?: boolean; // Force online mode
}

class HybridAIService {
    private config: AIServiceConfig = {
        preferOffline: false,
        offlineOnly: false,
        onlineOnly: false,
    };

    // Update configuration
    public setConfig(config: Partial<AIServiceConfig>): void {
        this.config = { ...this.config, ...config };
        console.log('HybridAIService config updated:', this.config);
    }

    // Get current configuration
    public getConfig(): AIServiceConfig {
        return { ...this.config };
    }

    // Generate AI response with automatic routing
    public async generateResponse(
        prompt: string,
        subject?: 'mathematics' | 'english' | 'science' | 'general',
        options: GenerationOptions = {}
    ): Promise<AIResponse> {
        // Determine which service to use
        const useOffline = await this.shouldUseOffline();

        if (useOffline) {
            return await this.generateOfflineResponse(prompt, options);
        } else {
            return await this.generateOnlineResponse(prompt, subject, options);
        }
    }

    // Determine whether to use offline or online AI
    private async shouldUseOffline(): Promise<boolean> {
        // Force offline if configured
        if (this.config.offlineOnly) {
            return true;
        }

        // Force online if configured
        if (this.config.onlineOnly) {
            return false;
        }

        // Check if offline model is ready
        const modelStatus = await OfflineAIService.getModelStatus();
        const isOfflineReady = modelStatus.isReady;

        // Check network connectivity
        const isOnline = NetworkService.isOnline();

        // Decision logic:
        // 1. If prefer offline and model is ready, use offline
        // 2. If online and not preferring offline, use online
        // 3. If offline and model ready, use offline
        // 4. Otherwise, try online with fallback

        if (this.config.preferOffline && isOfflineReady) {
            console.log('Using offline AI (preferred)');
            return true;
        }

        if (!isOnline && isOfflineReady) {
            console.log('Using offline AI (no network)');
            return true;
        }

        if (isOnline) {
            console.log('Using online AI (network available)');
            return false;
        }

        // Fallback to offline if available
        if (isOfflineReady) {
            console.log('Using offline AI (fallback)');
            return true;
        }

        // No AI available
        throw new Error('No AI service available. Please check network connection or download offline model.');
    }

    // Generate response using offline AI
    private async generateOfflineResponse(
        prompt: string,
        options: GenerationOptions
    ): Promise<AIResponse> {
        try {
            const textResponse = await OfflineAIService.generateResponse(prompt, options);
            return {
                text: textResponse,
                source: 'offline',
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            console.error('Offline AI generation failed:', error);

            // Try online fallback if available
            const isOnline = NetworkService.isOnline();
            if (isOnline && !this.config.offlineOnly) {
                console.log('Falling back to online AI');
                return await this.generateOnlineResponse(prompt, undefined, options);
            }

            throw error;
        }
    }

    // Generate response using online API
    private async generateOnlineResponse(
        prompt: string,
        subject?: 'mathematics' | 'english' | 'science' | 'general',
        options: GenerationOptions = {}
    ): Promise<AIResponse> {
        try {
            // Route to appropriate API based on subject
            let endpoint = '/api/teacher/ask';
            let payload: any = {
                question: prompt,
                maxTokens: options.maxTokens || 512,
            };

            if (subject === 'mathematics') {
                endpoint = '/api/math/help';
                payload = { question: prompt };
            } else if (subject === 'english') {
                endpoint = '/api/english/help';
                payload = { question: prompt };
            } else if (subject === 'science') {
                endpoint = '/api/teacher/ask';
                payload = { question: prompt, subject: 'science' };
            }

            const response = await api.post(endpoint, payload);

            return {
                text: response.data.response || response.data.answer || response.data.explanation || '',
                source: 'online',
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            console.error('Online AI generation failed:', error);

            // Try offline fallback if available
            const modelStatus = await OfflineAIService.getModelStatus();
            if (modelStatus.isReady && !this.config.onlineOnly) {
                console.log('Falling back to offline AI');
                return await this.generateOfflineResponse(prompt, options);
            }

            throw error;
        }
    }

    // Initialize offline model if not already initialized
    public async initializeOfflineModel(): Promise<boolean> {
        return await OfflineAIService.initializeModel();
    }

    // Get AI service status
    public async getStatus(): Promise<{
        offline: { available: boolean; ready: boolean };
        online: { available: boolean };
        currentMode: 'offline' | 'online' | 'unavailable';
    }> {
        const modelStatus = await OfflineAIService.getModelStatus();
        const isOnline = NetworkService.isOnline();
        const useOffline = await this.shouldUseOffline();

        let currentMode: 'offline' | 'online' | 'unavailable' = 'unavailable';
        if (modelStatus.isReady && useOffline) {
            currentMode = 'offline';
        } else if (isOnline) {
            currentMode = 'online';
        }

        return {
            offline: {
                available: modelStatus.modelInfo !== null,
                ready: modelStatus.isReady,
            },
            online: {
                available: isOnline,
            },
            currentMode,
        };
    }
}

export default new HybridAIService();
