// Offline AI Service using ONNX Runtime React Native
// Implements proper InferenceSession API for Phi-3 model text generation
// Note: ONNX Runtime is only available in EAS development builds, not Expo Go

// Conditionally import ONNX Runtime to prevent crashes in Expo Go
let InferenceSession: any = null;
let Tensor: any = null;
let isONNXAvailable = false;

try {
    const onnx = require('onnxruntime-react-native');
    InferenceSession = onnx.InferenceSession;
    Tensor = onnx.Tensor;
    isONNXAvailable = true;
    console.log('✅ ONNX Runtime loaded successfully');
} catch (error) {
    console.warn('⚠️ ONNX Runtime not available (Expo Go). Offline AI features disabled.');
    console.warn('To enable offline AI, build with EAS: eas build --profile development --platform android');
}

import ModelDownloadService, { ModelInfo } from './ModelDownloadService';
import { phi3Tokenizer } from './Phi3Tokenizer';

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

// Default generation configuration for Phi-3
const DEFAULT_GENERATION_CONFIG = {
    maxTokens: 256,
    temperature: 0.7,
    topP: 0.9,
    repetitionPenalty: 1.1,
};

class OfflineAIService {
    private session: InferenceSession | null = null;
    private isInitializing: boolean = false;
    private initializationError: string | null = null;
    private isReady: boolean = false;

    /**
     * Initialize the ONNX model and tokenizer
     */
    public async initializeModel(): Promise<boolean> {
        if (this.isReady) {
            console.log('Model already initialized');
            return true;
        }

        if (this.isInitializing) {
            console.log('Model initialization already in progress');
            return false;
        }

        // Check if ONNX Runtime is available (not in Expo Go)
        if (!isONNXAvailable) {
            const errorMsg = 'ONNX Runtime not available. Please build with EAS to enable offline AI.';
            console.warn(errorMsg);
            this.initializationError = errorMsg;
            return false;
        }

        try {
            this.isInitializing = true;
            this.initializationError = null;

            // Check if model is downloaded
            const isDownloaded = await ModelDownloadService.isModelDownloaded();
            if (!isDownloaded) {
                throw new Error('Model not downloaded. Please download the model first.');
            }

            // Get model info and path
            const modelInfo = await ModelDownloadService.getModelInfo();
            if (!modelInfo) {
                throw new Error('Model info not found');
            }

            console.log('Loading ONNX model from:', modelInfo.modelPath);

            // Initialize tokenizer first
            const tokenizerReady = await phi3Tokenizer.initialize();
            if (!tokenizerReady) {
                throw new Error('Failed to initialize tokenizer');
            }
            console.log('Tokenizer initialized successfully');

            // Create ONNX InferenceSession
            // Note: onnxruntime-react-native requires native build (EAS)
            this.session = await InferenceSession.create(modelInfo.modelPath, {
                executionProviders: ['cpu'], // React Native mobile uses CPU
                graphOptimizationLevel: 'all',
            });

            console.log('ONNX InferenceSession created successfully');
            console.log('Input names:', this.session.inputNames);
            console.log('Output names:', this.session.outputNames);

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

    /**
     * Generate a response using the Phi-3 model
     * Implements autoregressive text generation with sampling
     */
    public async generateResponse(
        prompt: string,
        options: GenerationOptions = {}
    ): Promise<string> {
        if (!this.isReady || !this.session) {
            // Auto-initialize if not ready
            const success = await this.initializeModel();
            if (!success) {
                throw new Error('Model initialization failed. Cannot generate response.');
            }
        }

        try {
            console.log('Generating offline response...');
            const config = { ...DEFAULT_GENERATION_CONFIG, ...options };

            // Format prompt in ChatML format for Phi-3
            const formattedPrompt = phi3Tokenizer.formatUserPrompt(prompt);
            console.log('Formatted prompt:', formattedPrompt.substring(0, 100) + '...');

            // Encode the prompt to token IDs
            let inputIds = phi3Tokenizer.encode(formattedPrompt);
            console.log('Input token count:', inputIds.length);

            // Get end token IDs for stopping generation
            const endTokenIds = phi3Tokenizer.getEndTokenIds();

            // Autoregressive generation loop
            const generatedTokens: number[] = [];
            const maxNewTokens = config.maxTokens || DEFAULT_GENERATION_CONFIG.maxTokens;

            for (let i = 0; i < maxNewTokens; i++) {
                // Create input tensor
                const inputTensor = new Tensor(
                    'int64',
                    BigInt64Array.from(inputIds.map(id => BigInt(id))),
                    [1, inputIds.length]
                );

                // Create attention mask (all 1s for the input)
                const attentionMask = new Tensor(
                    'int64',
                    BigInt64Array.from(inputIds.map(() => BigInt(1))),
                    [1, inputIds.length]
                );

                // Run inference
                const feeds: Record<string, Tensor> = {
                    input_ids: inputTensor,
                    attention_mask: attentionMask,
                };

                const results = await this.session!.run(feeds);

                // Get logits from output (shape: [batch, seq_len, vocab_size])
                const logits = results.logits as Tensor;
                const logitsData = logits.data as Float32Array;

                // Get logits for the last token position
                const vocabSize = logitsData.length / inputIds.length;
                const lastTokenLogits = logitsData.slice(-vocabSize);

                // Apply temperature and sample next token
                const nextTokenId = this.sampleToken(
                    lastTokenLogits,
                    config.temperature || DEFAULT_GENERATION_CONFIG.temperature,
                    config.topP || DEFAULT_GENERATION_CONFIG.topP
                );

                // Check for end of generation
                if (endTokenIds.includes(nextTokenId)) {
                    console.log('End token detected, stopping generation');
                    break;
                }

                // Add the new token
                generatedTokens.push(nextTokenId);
                inputIds = [...inputIds, nextTokenId];

                // Log progress every 10 tokens
                if ((i + 1) % 10 === 0) {
                    console.log(`Generated ${i + 1}/${maxNewTokens} tokens...`);
                }
            }

            // Decode generated tokens to text
            const generatedText = phi3Tokenizer.decode(generatedTokens);
            console.log('Generation complete. Output length:', generatedText.length);

            return generatedText.trim();
        } catch (error) {
            console.error('Error generating response:', error);
            throw error;
        }
    }

    /**
     * Sample a token from logits using temperature and top-p sampling
     */
    private sampleToken(logits: Float32Array, temperature: number, topP: number): number {
        // Apply temperature
        const scaledLogits = new Float32Array(logits.length);
        for (let i = 0; i < logits.length; i++) {
            scaledLogits[i] = logits[i] / temperature;
        }

        // Compute softmax probabilities
        const maxLogit = Math.max(...scaledLogits);
        const expLogits = scaledLogits.map(x => Math.exp(x - maxLogit));
        const sumExp = expLogits.reduce((a, b) => a + b, 0);
        const probs = expLogits.map(x => x / sumExp);

        // Top-p (nucleus) sampling
        const sortedIndices = Array.from(probs.keys()).sort((a, b) => probs[b] - probs[a]);
        let cumProb = 0;
        const nucleusIndices: number[] = [];

        for (const idx of sortedIndices) {
            nucleusIndices.push(idx);
            cumProb += probs[idx];
            if (cumProb >= topP) {
                break;
            }
        }

        // Sample from nucleus
        const nucleusProbs = nucleusIndices.map(idx => probs[idx]);
        const nucleusSum = nucleusProbs.reduce((a, b) => a + b, 0);
        const normalizedProbs = nucleusProbs.map(p => p / nucleusSum);

        // Random sampling
        const random = Math.random();
        let cumulative = 0;
        for (let i = 0; i < nucleusIndices.length; i++) {
            cumulative += normalizedProbs[i];
            if (random < cumulative) {
                return nucleusIndices[i];
            }
        }

        // Fallback to most likely token
        return nucleusIndices[0];
    }

    /**
     * Get the current model status
     */
    public async getModelStatus(): Promise<ModelStatus> {
        const modelInfo = await ModelDownloadService.getModelInfo();
        return {
            isReady: this.isReady,
            isLoading: this.isInitializing,
            error: this.initializationError,
            modelInfo: modelInfo,
        };
    }

    /**
     * Dispose of the ONNX session to free memory
     */
    public async dispose(): Promise<void> {
        if (this.session) {
            console.log('Disposing ONNX Runtime session...');
            // Release the session - note: InferenceSession may not have explicit dispose
            this.session = null;
            this.isReady = false;
            console.log('Session disposed');
        }
    }

    /**
     * Check if the model is ready for inference
     */
    public isModelReady(): boolean {
        return this.isReady && this.session !== null;
    }
}

export default new OfflineAIService();
