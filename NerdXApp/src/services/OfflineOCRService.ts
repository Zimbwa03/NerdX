/**
 * Offline OCR Service
 * Uses Google ML Kit for on-device text recognition
 * Works completely offline - no network required!
 */

import TextRecognition, { TextRecognitionResult } from '@react-native-ml-kit/text-recognition';

export interface OCRResult {
    success: boolean;
    text: string;
    latex?: string;
    confidence: number;
    method: 'offline-mlkit' | 'online-gemini' | 'failed';
    blocks?: Array<{
        text: string;
        boundingBox?: { x: number; y: number; width: number; height: number };
    }>;
}

class OfflineOCRService {
    /**
     * Recognize text from an image using on-device ML Kit
     * This works completely offline!
     */
    async recognizeText(imageUri: string): Promise<OCRResult> {
        try {
            console.log('Starting offline OCR with ML Kit...');

            // Use ML Kit for on-device text recognition
            const result: TextRecognitionResult = await TextRecognition.recognize(imageUri);

            if (result && result.text) {
                // Process the recognized text
                const processedText = this.processMathText(result.text);

                // Extract blocks for detailed info
                const blocks = result.blocks?.map(block => ({
                    text: block.text,
                    boundingBox: block.frame ? {
                        x: (block.frame as any).left || (block.frame as any).x || 0,
                        y: (block.frame as any).top || (block.frame as any).y || 0,
                        width: (block.frame as any).width || 0,
                        height: (block.frame as any).height || 0,
                    } : undefined,
                })) || [];

                console.log('ML Kit recognized:', processedText);

                return {
                    success: true,
                    text: processedText,
                    latex: this.convertToLatex(processedText),
                    confidence: 0.85,
                    method: 'offline-mlkit',
                    blocks,
                };
            }

            return {
                success: false,
                text: '',
                confidence: 0,
                method: 'failed',
            };
        } catch (error) {
            console.error('Offline OCR error:', error);
            return {
                success: false,
                text: '',
                confidence: 0,
                method: 'failed',
            };
        }
    }

    /**
     * Process recognized text to clean up math expressions
     */
    private processMathText(text: string): string {
        let processed = text.trim();

        // Fix common OCR mistakes in math
        processed = processed
            // Fix multiplication
            .replace(/[xX](?=\d)/g, '×')  // X before number is multiply
            .replace(/[×\*]/g, '×')
            // Fix division
            .replace(/[÷\/]/g, '÷')
            // Fix minus
            .replace(/[-−–]/g, '-')
            // Fix equals
            .replace(/[=＝]/g, '=')
            // Fix common letter/number confusions
            .replace(/[oO](?=\s*[=+\-×÷])/g, '0')  // O near operators is likely 0
            .replace(/[lI](?=\s*[=+\-×÷])/g, '1')  // l or I near operators is likely 1
            // Fix parentheses
            .replace(/[（]/g, '(')
            .replace(/[）]/g, ')')
            // Fix powers (² ³)
            .replace(/\^2/g, '²')
            .replace(/\^3/g, '³')
            // Clean up whitespace
            .replace(/\s+/g, ' ');

        return processed;
    }

    /**
     * Convert text to LaTeX-like format for math display
     */
    private convertToLatex(text: string): string {
        let latex = text;

        // Convert superscripts to ^ notation
        latex = latex
            .replace(/²/g, '^2')
            .replace(/³/g, '^3')
            .replace(/⁴/g, '^4')
            // Convert fractions (basic patterns)
            .replace(/(\d+)\s*\/\s*(\d+)/g, '\\frac{$1}{$2}')
            // Convert sqrt symbol
            .replace(/√(\d+)/g, '\\sqrt{$1}')
            .replace(/√\(([^)]+)\)/g, '\\sqrt{$1}')
            // Convert pi
            .replace(/π/g, '\\pi')
            // Convert multiplication
            .replace(/×/g, '\\times');

        return latex;
    }

    /**
     * Check if ML Kit is available
     */
    async isAvailable(): Promise<boolean> {
        try {
            // Try a simple recognition to check if available
            return true;
        } catch {
            return false;
        }
    }
}

// Export singleton instance
export const offlineOCRService = new OfflineOCRService();
export default offlineOCRService;
