import os
import asyncio
import whisper
import edge_tts
import uuid
from typing import Dict, Optional

class VoiceService:
    def __init__(self, model_size: str = "base"):
        """
        Initialize VoiceService with Whisper model.
        model_size: 'tiny', 'base', 'small', 'medium', 'large'
        """
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.media_dir = os.path.join(self.base_dir, "static", "media", "audio")
        os.makedirs(self.media_dir, exist_ok=True)
        
        # Load Whisper model (lazy loading could be better for startup time, but we'll load on init for now)
        print(f"[VoiceService] Loading Whisper model '{model_size}'...")
        self.model = whisper.load_model(model_size)
        print(f"[VoiceService] Whisper model loaded.")

    def transcribe_audio(self, audio_path: str) -> Dict:
        """
        Transcribe audio file to text using Whisper.
        Returns dict with text and language.
        """
        if not os.path.exists(audio_path):
            return {"error": "Audio file not found"}

        try:
            # Transcribe
            result = self.model.transcribe(audio_path)
            return {
                "text": result["text"].strip(),
                "language": result["language"],
                "segments": result["segments"]
            }
        except Exception as e:
            print(f"[VoiceService] Transcription error: {e}")
            return {"error": str(e)}

    async def text_to_speech(self, text: str, voice: str = "en-US-AriaNeural") -> Dict:
        """
        Convert text to speech using Edge-TTS.
        Returns path to generated MP3 file.
        """
        try:
            # Generate unique filename
            filename = f"tts_{uuid.uuid4().hex[:8]}.mp3"
            output_path = os.path.join(self.media_dir, filename)
            
            # Generate audio
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(output_path)
            
            # Return relative path for API usage
            relative_path = os.path.join("media", "audio", filename).replace(os.sep, "/")
            return {
                "success": True,
                "audio_path": relative_path,
                "full_path": output_path
            }
        except Exception as e:
            print(f"[VoiceService] TTS error: {e}")
            return {"success": False, "error": str(e)}

# Singleton instance
_voice_service = None

def get_voice_service():
    global _voice_service
    if _voice_service is None:
        _voice_service = VoiceService()
    return _voice_service
