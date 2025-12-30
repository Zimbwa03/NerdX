"""
Voice-to-Math Service
Converts spoken audio to formatted mathematical expressions using Whisper

Uses open-source Whisper model (no API key required)
"""

import os
import re
import logging
import tempfile
from typing import Optional

logger = logging.getLogger(__name__)

# Math expression conversion rules
MATH_CONVERSIONS = {
    # Powers and roots
    r'\bsquared\b': '²',
    r'\bto the power of 2\b': '²',
    r'\bcubed\b': '³',
    r'\bto the power of 3\b': '³',
    r'\bto the power of (\d+)\b': r'^{\1}',
    r'\bto the (\d+)(?:th|st|nd|rd) power\b': r'^{\1}',
    r'\bsquare root of\b': '√',
    r'\bsqrt\b': '√',
    r'\bcube root of\b': '∛',
    
    # Basic operators
    r'\bplus\b': '+',
    r'\bminus\b': '-',
    r'\btimes\b': '×',
    r'\bmultiplied by\b': '×',
    r'\bdivided by\b': '÷',
    r'\bover\b': '/',
    
    # Comparison operators
    r'\bequals\b': '=',
    r'\bequal to\b': '=',
    r'\bis equal to\b': '=',
    r'\bgreater than or equal to\b': '≥',
    r'\bgreater than or equal\b': '≥',
    r'\bless than or equal to\b': '≤',
    r'\bless than or equal\b': '≤',
    r'\bgreater than\b': '>',
    r'\bless than\b': '<',
    r'\bnot equal to\b': '≠',
    r'\bnot equal\b': '≠',
    
    # Greek letters
    r'\bpi\b': 'π',
    r'\btheta\b': 'θ',
    r'\balpha\b': 'α',
    r'\bbeta\b': 'β',
    r'\bgamma\b': 'γ',
    r'\bdelta\b': 'δ',
    r'\bsigma\b': 'σ',
    r'\bmu\b': 'μ',
    r'\blambda\b': 'λ',
    r'\bomega\b': 'ω',
    
    # Special symbols
    r'\binfinity\b': '∞',
    r'\bdegrees?\b': '°',
    r'\bpercent\b': '%',
    r'\bplus or minus\b': '±',
    r'\bapproximately\b': '≈',
    r'\bproportional to\b': '∝',
    
    # Fractions
    r'\bone half\b': '½',
    r'\bone third\b': '⅓',
    r'\btwo thirds\b': '⅔',
    r'\bone quarter\b': '¼',
    r'\bthree quarters\b': '¾',
    
    # Common math phrases
    r'\bthe answer is\b': '',
    r'\bthe result is\b': '',
    r'\bequation is\b': '',
}

# Try to import whisper, but handle if not available
try:
    import whisper
    WHISPER_AVAILABLE = True
    # Load the model once at startup (using 'base' for balance of speed/accuracy)
    # Options: tiny, base, small, medium, large
    _whisper_model = None
    
    def get_whisper_model():
        global _whisper_model
        if _whisper_model is None:
            logger.info("Loading Whisper model (base)...")
            try:
                _whisper_model = whisper.load_model("base")
                logger.info("Whisper model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load Whisper model: {e}")
                return None
        return _whisper_model
        
except ImportError:
    WHISPER_AVAILABLE = False
    logger.warning("Whisper not installed. Voice-to-math will use fallback.")
    def get_whisper_model():
        return None


class VoiceMathService:
    """Service to convert spoken math to formatted text"""
    
    def __init__(self):
        self.model = None
        
    def transcribe_audio(self, audio_path: str) -> Optional[str]:
        """
        Transcribe audio file to text using local Whisper with Gemini fallback
        
        Args:
            audio_path: Path to audio file (WAV, MP3, etc.)
            
        Returns:
            Transcribed text or None if failed
        """
        # PRIMARY: Try local Whisper first (faster, no API costs)
        if WHISPER_AVAILABLE:
            model = get_whisper_model()
            if model is not None:
                try:
                    logger.info(f"[Voice] Transcribing with local Whisper: {audio_path}")
                    result = model.transcribe(
                        audio_path,
                        language="en",
                        fp16=False  # Use FP32 for CPU compatibility
                    )
                    text = result["text"].strip()
                    logger.info(f"[Voice] Local Whisper success: {text[:100]}...")
                    return text
                except Exception as e:
                    logger.warning(f"[Voice] Local Whisper failed: {e}, trying Gemini fallback...")
        else:
            logger.info("[Voice] Local Whisper not available, using Gemini fallback")
        
        # FALLBACK: Use Gemini for audio transcription
        gemini_api_key = os.environ.get('GEMINI_API_KEY')
        if gemini_api_key:
            try:
                import google.generativeai as genai
                import mimetypes
                
                genai.configure(api_key=gemini_api_key)
                
                logger.info(f"[Voice] Transcribing with Gemini: {audio_path}")
                
                # Gemini 1.5+ supports audio input natively
                model = genai.GenerativeModel('gemini-2.0-flash-exp')
                
                # Upload audio file to Gemini
                mime_type = mimetypes.guess_type(audio_path)[0] or 'audio/wav'
                audio_file = genai.upload_file(audio_path, mime_type=mime_type)
                
                # Transcribe with clear instructions
                response = model.generate_content([
                    """Transcribe the following audio recording exactly as spoken.
                    
Rules:
- Only output the transcribed text, nothing else
- If the audio contains mathematical expressions, write them naturally (e.g., "x squared" stays as "x squared")
- Preserve the exact words spoken
- If the audio is unclear or empty, respond with just: [unclear]""",
                    audio_file
                ])
                
                if response and response.text:
                    text = response.text.strip()
                    # Check for unclear audio
                    if text == "[unclear]" or not text:
                        logger.warning("[Voice] Gemini could not understand audio")
                        return None
                    logger.info(f"[Voice] Gemini transcription success: {text[:100]}...")
                    return text
                    
            except Exception as e:
                logger.error(f"[Voice] Gemini transcription failed: {e}")
        else:
            logger.warning("[Voice] GEMINI_API_KEY not set, cannot use Gemini fallback")
        
        logger.error("[Voice] All transcription methods failed - neither local Whisper nor Gemini available")
        return None
    
    def convert_to_math_notation(self, text: str) -> str:
        """
        Convert spoken math text to formatted mathematical notation
        
        Example: "2x squared plus 3x minus 4" -> "2x² + 3x - 4"
        
        Args:
            text: Spoken text (from speech-to-text)
            
        Returns:
            Formatted mathematical expression
        """
        if not text:
            return ""
            
        result = text.lower().strip()
        
        # Apply all conversion rules
        for pattern, replacement in MATH_CONVERSIONS.items():
            result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
        
        # Clean up spacing around operators
        result = re.sub(r'\s+([+\-×÷=<>≤≥≠])\s+', r' \1 ', result)
        
        # Remove multiple spaces
        result = re.sub(r'\s+', ' ', result).strip()
        
        # Handle superscripts for remaining power patterns
        # e.g., "x^4" stays as is, which some input methods support
        
        # Capitalize first letter if it seems like a sentence
        # (but not for math expressions that start with variables)
        if result and not result[0].isalpha():
            pass  # Keep as is
        elif result and result[0].isalpha() and len(result) > 1:
            # Don't capitalize single variables like "x"
            if result.split()[0] not in ['x', 'y', 'z', 'a', 'b', 'n', 'm']:
                result = result[0].upper() + result[1:]
        
        return result
    
    def process_voice_input(self, audio_data: bytes, filename: str = "audio.wav") -> dict:
        """
        Process voice input and return formatted math text
        
        Args:
            audio_data: Raw audio bytes
            filename: Original filename for format detection
            
        Returns:
            Dict with 'success', 'text', 'original_transcription'
        """
        try:
            # Save audio to temp file
            suffix = os.path.splitext(filename)[1] if filename else '.wav'
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(audio_data)
                tmp_path = tmp.name
            
            try:
                # Transcribe
                raw_text = self.transcribe_audio(tmp_path)
                
                if not raw_text:
                    return {
                        'success': False,
                        'error': 'Voice transcription is temporarily unavailable. Please type your question instead.',
                        'text': '',
                        'original_transcription': ''
                    }
                
                # Convert to math notation
                math_text = self.convert_to_math_notation(raw_text)
                
                return {
                    'success': True,
                    'text': math_text,
                    'original_transcription': raw_text
                }
                
            finally:
                # Clean up temp file
                try:
                    os.unlink(tmp_path)
                except:
                    pass
                    
        except Exception as e:
            logger.error(f"Voice processing error: {e}")
            return {
                'success': False,
                'error': str(e),
                'text': '',
                'original_transcription': ''
            }


# Singleton instance
voice_math_service = VoiceMathService()
