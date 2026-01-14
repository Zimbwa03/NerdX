/**
 * Offline OCR Service
 * Uses Google ML Kit for on-device text recognition
 * Works completely offline - no network required!
 */

// import TextRecognition, { TextRecognitionResult } from '@react-native-ml-kit/text-recognition';

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
     * 
     * NOTE: Offline OCR module disabled due to build issues. 
     * Prioritizing Online Gemini OCR.
     */
    async recognizeText(imageUri: string): Promise<OCRResult> {
        console.log('Offline OCR currently disabled. Skipping to Online OCR...');

        return {
            success: false,
            text: '',
            confidence: 0,
            method: 'failed',
        };
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
        return false;
    }
}

// Export singleton instance
export const offlineOCRService = new OfflineOCRService();
export default offlineOCRService;
