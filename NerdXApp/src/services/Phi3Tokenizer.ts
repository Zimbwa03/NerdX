// Phi-3 Tokenizer Service using js-tiktoken
// Phi-3 uses cl100k_base encoding with additional special tokens for ChatML format
import { getEncoding, Tiktoken } from 'js-tiktoken';

// Phi-3 ChatML special token strings (constructed to avoid XML parsing issues)
const USER_TOKEN = '<' + '|user|' + '>';
const ASSISTANT_TOKEN = '<' + '|assistant|' + '>';
const END_TOKEN = '<' + '|end|' + '>';
const SYSTEM_TOKEN = '<' + '|system|' + '>';

class Phi3Tokenizer {
    private encoder: Tiktoken | null = null;
    private isInitialized: boolean = false;

    /**
     * Initialize the tokenizer
     */
    public async initialize(): Promise<boolean> {
        if (this.isInitialized) {
            return true;
        }

        try {
            // Phi-3 uses cl100k_base encoding (same base as GPT-4)
            this.encoder = getEncoding('cl100k_base');
            this.isInitialized = true;
            console.log('Phi3Tokenizer initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Phi3Tokenizer:', error);
            return false;
        }
    }

    /**
     * Check if tokenizer is ready
     */
    public isReady(): boolean {
        return this.isInitialized && this.encoder !== null;
    }

    /**
     * Encode text to token IDs
     */
    public encode(text: string): number[] {
        if (!this.encoder) {
            throw new Error('Tokenizer not initialized. Call initialize() first.');
        }
        return Array.from(this.encoder.encode(text));
    }

    /**
     * Decode token IDs back to text
     */
    public decode(tokenIds: number[]): string {
        if (!this.encoder) {
            throw new Error('Tokenizer not initialized. Call initialize() first.');
        }
        return this.encoder.decode(new Uint32Array(tokenIds));
    }

    /**
     * Format a user prompt in Phi-3 ChatML format
     */
    public formatUserPrompt(userMessage: string): string {
        return `${USER_TOKEN}\n${userMessage}${END_TOKEN}\n${ASSISTANT_TOKEN}\n`;
    }

    /**
     * Format a system + user prompt in Phi-3 ChatML format
     */
    public formatPromptWithSystem(systemMessage: string, userMessage: string): string {
        return `${SYSTEM_TOKEN}\n${systemMessage}${END_TOKEN}\n${USER_TOKEN}\n${userMessage}${END_TOKEN}\n${ASSISTANT_TOKEN}\n`;
    }

    /**
     * Get the end token for detecting generation end
     */
    public getEndToken(): string {
        return END_TOKEN;
    }

    /**
     * Get end token IDs for checking generation termination
     */
    public getEndTokenIds(): number[] {
        return this.encode(END_TOKEN);
    }

    /**
     * Count tokens in a text
     */
    public countTokens(text: string): number {
        return this.encode(text).length;
    }

    /**
     * Truncate text to fit within max tokens
     */
    public truncateToMaxTokens(text: string, maxTokens: number): string {
        const tokens = this.encode(text);
        if (tokens.length <= maxTokens) {
            return text;
        }
        return this.decode(tokens.slice(0, maxTokens));
    }
}

// Export singleton instance
export const phi3Tokenizer = new Phi3Tokenizer();

export default Phi3Tokenizer;
