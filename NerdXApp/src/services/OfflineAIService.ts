// Offline AI Service using Native ONNX Runtime Module
import { NativeModules, Platform } from 'react-native';
import ModelDownloadService, { ModelInfo } from './ModelDownloadService';

const { OnnxModule } = NativeModules;

export interface GenerationOptions {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    stopSequences?: string[];
}

export interface ModelStatus {
    isReady: boolean;
    isLoading: boolean;
    error: string | null;
    modelInfo: ModelInfo | null;
}

class OfflineAIService {
    private isInitializing: boolean = false;
    private initializationError: string | null = null;
    private isReady: boolean = false;

    public async initializeModel(): Promise<boolean> {
        if (this.isReady) {
            console.log('Model already initialized');
            return true;
        }

        if (this.isInitializing) {
            console.log('Model initialization already in progress');
            return false;
        }

        try {
            this.isInitializing = true;
            this.initializationError = null;

            const isDownloaded = await ModelDownloadService.isModelDownloaded();
            if (!isDownloaded) {
                throw new Error('Model not downloaded. Please download the model first.');
            }

            const modelInfo = await ModelDownloadService.getModelInfo();
            if (!modelInfo) {
                throw new Error('Model info not found');
            }

            console.log('Loading ONNX model from:', modelInfo.modelPath);

            if (!OnnxModule) {
                throw new Error('Native OnnxModule not found. Ensure the native module is linked.');
            }

            await OnnxModule.loadModel(modelInfo.modelPath);
            console.log('✅ Phi-3 model loaded successfully via Native Module');

            this.isReady = true;
            this.isInitializing = false;
            return true;
        } catch (error) {
            console.error('Error initializing model:', error);
            this.initializationError = error instanceof Error ? error.message : 'Unknown error';
            this.isInitializing = false;
            return false;
        }
    }

    public async generateResponse(
        prompt: string,
        options: GenerationOptions = {}
    ): Promise<string> {
        if (!this.isReady) {
            // Auto-initialize if not ready
            const success = await this.initializeModel();
            if (!success) {
                throw new Error('Model initialization failed. Cannot generate response.');
            }
        }

        try {
            console.log('Generating offline response via Native Module...');

            // Format prompt for Phi-3 (ChatML)
            const formattedPrompt = `<|user|>\n${prompt}<|end|>\n<|assistant|>\n`;

            const response = await OnnxModule.generate(formattedPrompt, options);
            return response;
        } catch (error) {
            console.error('Error generating response:', error);
            throw error;
        }
    }

    public async getModelStatus(): Promise<ModelStatus> {
        const modelInfo = await ModelDownloadService.getModelInfo();
        return {
            isReady: this.isReady,
            isLoading: this.isInitializing,
            error: this.initializationError,
            modelInfo: modelInfo,
        };
    }

    public async dispose(): Promise<void> {
        if (this.isReady && OnnxModule) {
            console.log('Disposing Native ONNX Runtime session...');
            await OnnxModule.unload();
            this.isReady = false;
            console.log('✅ Session disposed');
        }
    }
}

export default new OfflineAIService();
