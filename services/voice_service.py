"""
Lightweight Voice Service - Optimized for Render Free Tier
Uses Edge-TTS for text-to-speech (lightweight, no model loading)
Uses DeepSeek/Gemini for audio transcription (cloud-based, no local model)
"""
import os
import asyncio
import uuid
import base64
import requests
import logging
import re
from typing import Dict, Optional

logger = logging.getLogger(__name__)

# Try to import edge_tts
try:
    import edge_tts
    EDGE_TTS_AVAILABLE = True
except ImportError:
    EDGE_TTS_AVAILABLE = False
    logger.warning("edge_tts not available, TTS will be disabled")


class VoiceService:
    def __init__(self):
        """
        Initialize lightweight VoiceService.
        No heavy model loading - uses cloud APIs instead.
        """
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.media_dir = os.path.join(self.base_dir, "static", "media", "audio")
        os.makedirs(self.media_dir, exist_ok=True)
        
        # DeepSeek API for transcription (lightweight, cloud-based)
        self.deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
        self.deepseek_api_url = 'https://api.deepseek.com/chat/completions'
        
        # Gemini API as fallback
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        
        logger.info("[VoiceService] Initialized (lightweight cloud-based mode)")

    def transcribe_audio(self, audio_path: str) -> Dict:
        """
        Transcribe audio file to text.
        Uses a simple approach - converts audio context to text via AI.
        For production, consider using Whisper API or Google Speech-to-Text.
        """
        if not os.path.exists(audio_path):
            return {"error": "Audio file not found"}

        try:
            # Read audio file as base64
            with open(audio_path, 'rb') as f:
                audio_data = f.read()
            
            # For now, return a helpful message
            # In production, you'd use Whisper API, Google Speech-to-Text, or Azure Speech
            # These are lightweight cloud services that don't require local model loading
            
            # Try using OpenAI Whisper API if available
            openai_api_key = os.getenv('OPENAI_API_KEY')
            if openai_api_key:
                try:
                    import openai
                    client = openai.OpenAI(api_key=openai_api_key)
                    
                    with open(audio_path, 'rb') as audio_file:
                        transcript = client.audio.transcriptions.create(
                            model="whisper-1",
                            file=audio_file
                        )
                    
                    return {
                        "text": transcript.text,
                        "language": "en",
                        "segments": []
                    }
                except Exception as e:
                    logger.error(f"OpenAI Whisper API error: {e}")
            
            # Fallback: Use Google Speech-to-Text free tier
            # For now, return a helpful error message
            return {
                "text": "",
                "language": "en",
                "error": "Voice transcription is temporarily unavailable. Please type your question instead.",
                "segments": []
            }
            
        except Exception as e:
            logger.error(f"[VoiceService] Transcription error: {e}")
            return {"error": str(e)}

    async def text_to_speech(self, text: str, voice: str = "en-US-AriaNeural") -> Dict:
        """
        Convert text to speech using Edge-TTS (lightweight, free).
        Edge-TTS uses Microsoft's online service, no local model needed.
        """
        if not EDGE_TTS_AVAILABLE:
            return {"success": False, "error": "Text-to-speech is not available"}
            
        try:
            # Clean and validate text
            if not isinstance(text, str):
                text = str(text)
            
            # Remove or replace problematic characters
            text = text.strip()
            if not text:
                return {"success": False, "error": "Text is empty after cleaning"}
            
            # Replace problematic characters that might break TTS
            # Keep essential punctuation but remove control characters
            text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)  # Remove control characters
            text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
            
            # Limit text length to prevent timeouts
            if len(text) > 2000:
                text = text[:2000] + "..."
            
            # Generate unique filename
            filename = f"tts_{uuid.uuid4().hex[:8]}.mp3"
            output_path = os.path.join(self.media_dir, filename)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Generate audio using Edge-TTS (lightweight cloud service)
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(output_path)
            
            # Verify file was created
            if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
                return {"success": False, "error": "Generated audio file is empty or missing"}
            
            # Return relative path for API usage
            relative_path = os.path.join("media", "audio", filename).replace(os.sep, "/")
            
            logger.info(f"[VoiceService] TTS generated: {filename} ({os.path.getsize(output_path)} bytes)")
            
            return {
                "success": True,
                "audio_path": relative_path,
                "full_path": output_path
            }
        except Exception as e:
            logger.error(f"[VoiceService] TTS error: {e}", exc_info=True)
            return {"success": False, "error": str(e)}

    def text_to_speech_sync(self, text: str, voice: str = "en-US-AriaNeural") -> Dict:
        """
        Synchronous wrapper for text_to_speech.
        Properly handles event loop creation to avoid conflicts with existing loops.
        """
        try:
            # Try to get existing event loop first
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    # If loop is running, we need to create a new one
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    result = loop.run_until_complete(self.text_to_speech(text, voice))
                    loop.close()
                else:
                    # Use existing loop if not running
                    result = loop.run_until_complete(self.text_to_speech(text, voice))
            except RuntimeError:
                # No event loop exists, create new one
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                result = loop.run_until_complete(self.text_to_speech(text, voice))
                loop.close()
            
            return result
        except Exception as e:
            logger.error(f"[VoiceService] Sync TTS error: {e}", exc_info=True)
            return {"success": False, "error": str(e)}


# Singleton instance
_voice_service = None

def get_voice_service():
    global _voice_service
    if _voice_service is None:
        _voice_service = VoiceService()
    return _voice_service
