"""
Voice Service
- Speech-to-text fallback utilities for /voice/transcribe
- Text-to-speech for /voice/speak with Vertex Gemini TTS primary
  and Edge-TTS fallback
"""
import asyncio
import base64
import logging
import os
import re
import tempfile
import uuid
import wave
from typing import Dict, Optional

logger = logging.getLogger(__name__)

try:
    import edge_tts
    EDGE_TTS_AVAILABLE = True
except ImportError:
    edge_tts = None
    EDGE_TTS_AVAILABLE = False
    logger.warning("edge_tts not available, Edge fallback TTS is disabled")

try:
    from google import genai
    from google.genai.types import HttpOptions

    GENAI_AVAILABLE = True
except Exception:
    genai = None
    HttpOptions = None
    GENAI_AVAILABLE = False
    logger.warning("google-genai not available, Vertex Gemini TTS is disabled")


class VoiceService:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.media_dir = os.path.join(self.base_dir, "static", "media", "audio")
        os.makedirs(self.media_dir, exist_ok=True)

        # Transcription provider keys (transcription route typically uses Vertex first)
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")

        # Gemini TTS runtime config
        self.use_vertex = os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "True").lower() == "true"
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "")
        self.location = os.getenv("GOOGLE_CLOUD_LOCATION", "global")
        self.default_voice = os.getenv("GEMINI_TTS_DEFAULT_VOICE", "Kore")
        self.edge_default_voice = os.getenv("EDGE_TTS_DEFAULT_VOICE", "en-US-AriaNeural")
        self.gemini_tts_models = [
            m.strip()
            for m in os.getenv(
                "GEMINI_TTS_MODELS",
                # Ordered best quality first, with compatibility fallbacks.
                "gemini-2.5-pro-tts,gemini-2.5-flash-tts,gemini-2.5-flash-lite-preview-tts,gemini-2.5-flash-preview-tts,gemini-2.5-pro-preview-tts",
            ).split(",")
            if m.strip()
        ]

        # Friendly aliases for frontend/backend callers.
        self.voice_aliases = {
            "teacher": "Kore",
            "female": "Kore",
            "male": "Puck",
            "warm": "Aoede",
            "bright": "Zephyr",
            "deep": "Charon",
        }

        self.gemini_client = self._init_gemini_client()
        logger.info(
            "[VoiceService] Ready (gemini=%s, edge=%s, vertex=%s, location=%s)",
            bool(self.gemini_client),
            EDGE_TTS_AVAILABLE,
            self.use_vertex,
            self.location,
        )

    def _init_gemini_client(self):
        if not GENAI_AVAILABLE:
            return None

        try:
            if self.use_vertex:
                os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "True"

                credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")
                service_account_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
                if not credentials_path and service_account_json:
                    with tempfile.NamedTemporaryFile(
                        mode="w", suffix=".json", delete=False, encoding="utf-8"
                    ) as tmp:
                        tmp.write(service_account_json)
                        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = tmp.name
                        credentials_path = tmp.name
                    logger.info(
                        "[VoiceService] Loaded inline service account JSON for Vertex TTS"
                    )

                if credentials_path:
                    logger.info(
                        "[VoiceService] Using Vertex credentials file for TTS: %s",
                        credentials_path,
                    )
                else:
                    logger.info(
                        "[VoiceService] Using ADC credentials for Vertex TTS client"
                    )

                return genai.Client(http_options=HttpOptions(api_version="v1"))

            if self.gemini_api_key:
                logger.info("[VoiceService] Using Gemini API key client for TTS fallback")
                return genai.Client(api_key=self.gemini_api_key)
        except Exception as e:
            logger.error("[VoiceService] Failed to initialize Gemini client: %s", e, exc_info=True)

        return None

    def _resolve_voice_name(self, voice: Optional[str]) -> str:
        raw = (voice or "").strip()
        if not raw:
            return self.default_voice
        lower = raw.lower()
        if lower in self.voice_aliases:
            return self.voice_aliases[lower]
        return raw[0].upper() + raw[1:] if raw else self.default_voice

    @staticmethod
    def _sanitize_text(text: str) -> str:
        clean = text.strip()
        clean = re.sub(r"[\x00-\x1f\x7f-\x9f]", "", clean)
        clean = re.sub(r"\s+", " ", clean)
        if len(clean) > 2000:
            clean = clean[:2000].rstrip() + "..."
        return clean

    @staticmethod
    def _extract_audio_bytes(response) -> Optional[bytes]:
        candidates = getattr(response, "candidates", None) or []
        for candidate in candidates:
            content = getattr(candidate, "content", None)
            parts = getattr(content, "parts", None) or []
            for part in parts:
                inline_data = getattr(part, "inline_data", None)
                data = getattr(inline_data, "data", None) if inline_data else None
                if not data:
                    continue
                if isinstance(data, bytes):
                    return data
                if isinstance(data, bytearray):
                    return bytes(data)
                if isinstance(data, str):
                    try:
                        return base64.b64decode(data)
                    except Exception:
                        logger.warning(
                            "[VoiceService] Unexpected string audio payload; could not base64 decode"
                        )
        return None

    @staticmethod
    def _write_pcm_wav(output_path: str, pcm_bytes: bytes) -> None:
        with wave.open(output_path, "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)  # 16-bit PCM
            wav_file.setframerate(24000)  # Gemini TTS PCM output rate
            wav_file.writeframes(pcm_bytes)

    async def _text_to_speech_gemini(self, text: str, voice_name: str) -> Dict:
        if not self.gemini_client:
            return {"success": False, "error": "Gemini client is not configured"}

        config = {
            "response_modalities": ["AUDIO"],
            "speech_config": {
                "voice_config": {
                    "prebuilt_voice_config": {
                        "voice_name": voice_name
                    }
                }
            },
        }

        last_error = ""
        for model in self.gemini_tts_models:
            try:
                response = await asyncio.to_thread(
                    self.gemini_client.models.generate_content,
                    model=model,
                    contents=text,
                    config=config,
                )

                audio_bytes = self._extract_audio_bytes(response)
                if not audio_bytes:
                    raise RuntimeError("No audio payload found in Gemini response")

                filename = f"tts_gemini_{uuid.uuid4().hex[:10]}.wav"
                output_path = os.path.join(self.media_dir, filename)
                self._write_pcm_wav(output_path, audio_bytes)
                if not os.path.exists(output_path) or os.path.getsize(output_path) <= 44:
                    raise RuntimeError("Generated Gemini WAV is empty")

                relative_path = os.path.join("media", "audio", filename).replace(os.sep, "/")
                logger.info(
                    "[VoiceService] Gemini TTS generated (%s, voice=%s, size=%s bytes)",
                    model,
                    voice_name,
                    os.path.getsize(output_path),
                )
                return {
                    "success": True,
                    "audio_path": relative_path,
                    "full_path": output_path,
                    "provider": "gemini_tts",
                    "model": model,
                    "voice": voice_name,
                }
            except Exception as e:
                last_error = str(e)
                logger.warning(
                    "[VoiceService] Gemini TTS failed for model %s (voice=%s): %s",
                    model,
                    voice_name,
                    e,
                )

        return {
            "success": False,
            "error": f"Gemini TTS failed on all configured models: {last_error or 'unknown'}",
        }

    def transcribe_audio(self, audio_path: str) -> Dict:
        """
        Transcribe audio file to text.
        This is only used when the /voice/transcribe route cannot use Vertex STT.
        """
        if not os.path.exists(audio_path):
            return {"error": "Audio file not found"}

        try:
            openai_api_key = os.getenv("OPENAI_API_KEY")
            if openai_api_key:
                try:
                    import openai

                    client = openai.OpenAI(api_key=openai_api_key)
                    with open(audio_path, "rb") as audio_file:
                        transcript = client.audio.transcriptions.create(
                            model="whisper-1",
                            file=audio_file,
                        )
                    return {
                        "text": transcript.text,
                        "language": "en",
                        "segments": [],
                    }
                except Exception as e:
                    logger.error("OpenAI Whisper API error: %s", e)

            return {
                "text": "",
                "language": "en",
                "error": "Voice transcription is temporarily unavailable. Please type your question instead.",
                "segments": [],
            }
        except Exception as e:
            logger.error("[VoiceService] Transcription error: %s", e, exc_info=True)
            return {"error": str(e)}

    async def text_to_speech(self, text: str, voice: str = "teacher") -> Dict:
        """
        Convert text to speech.
        Primary: Vertex Gemini TTS
        Fallback: Edge TTS
        """
        try:
            if not isinstance(text, str):
                text = str(text)

            clean = self._sanitize_text(text)
            if not clean:
                return {"success": False, "error": "Text is empty after cleaning"}

            voice_name = self._resolve_voice_name(voice)

            gemini_result = await self._text_to_speech_gemini(clean, voice_name)
            if gemini_result.get("success"):
                return gemini_result

            if EDGE_TTS_AVAILABLE:
                filename = f"tts_edge_{uuid.uuid4().hex[:10]}.mp3"
                output_path = os.path.join(self.media_dir, filename)
                os.makedirs(os.path.dirname(output_path), exist_ok=True)

                edge_voice = (
                    voice
                    if isinstance(voice, str) and voice.startswith("en-")
                    else self.edge_default_voice
                )
                communicate = edge_tts.Communicate(clean, edge_voice)
                await communicate.save(output_path)

                if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
                    return {"success": False, "error": "Generated Edge audio file is empty or missing"}

                relative_path = os.path.join("media", "audio", filename).replace(os.sep, "/")
                logger.info(
                    "[VoiceService] Edge fallback TTS generated (%s bytes)",
                    os.path.getsize(output_path),
                )
                return {
                    "success": True,
                    "audio_path": relative_path,
                    "full_path": output_path,
                    "provider": "edge_tts",
                    "voice": edge_voice,
                }

            return {
                "success": False,
                "error": gemini_result.get(
                    "error",
                    "Text-to-speech is not available. Configure Vertex Gemini TTS or Edge-TTS.",
                ),
            }
        except Exception as e:
            logger.error("[VoiceService] TTS error: %s", e, exc_info=True)
            return {"success": False, "error": str(e)}

    def text_to_speech_sync(self, text: str, voice: str = "teacher") -> Dict:
        """
        Synchronous wrapper for text_to_speech.
        """
        try:
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    result = loop.run_until_complete(self.text_to_speech(text, voice))
                    loop.close()
                else:
                    result = loop.run_until_complete(self.text_to_speech(text, voice))
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                result = loop.run_until_complete(self.text_to_speech(text, voice))
                loop.close()
            return result
        except Exception as e:
            logger.error("[VoiceService] Sync TTS error: %s", e, exc_info=True)
            return {"success": False, "error": str(e)}


_voice_service = None


def get_voice_service():
    global _voice_service
    if _voice_service is None:
        _voice_service = VoiceService()
    return _voice_service
