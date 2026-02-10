#!/usr/bin/env python3
"""
NerdX Live - Real-Time Voice AI Tutor
Optimized Architecture: TURN BUFFERING for smooth, gap-free audio

DESIGN PRINCIPLES:
- Server handles security (API key), format conversion
- Audio chunks from Gemini are buffered per turn into one smooth WAV
- Client plays audio chunks in sequence for real-time conversation
- Provides gap-free playback (higher latency per response)

STREAMING STRATEGY:
- Receive PCM chunks from Gemini Live API (~100-200ms each)
- Buffer the full turn before sending audio
- Convert combined PCM to WAV and send once per turn
- Client queues and plays chunks sequentially
- Flush audio at turnComplete
"""

import os
import json
import base64
import asyncio
import logging
import struct
import io
import time
import tempfile
from typing import Optional
from contextlib import asynccontextmanager

# Add parent directory to sys.path to allow importing database modules
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.external_db import get_user_credits, deduct_credits, get_user_stats
from config import Config

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from aiortc import RTCPeerConnection, RTCSessionDescription
except Exception:  # pragma: no cover
    RTCPeerConnection = None
    RTCSessionDescription = None

try:
    from dotenv import load_dotenv
    import os
    # Load .env from project root (parent directory of services/)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env_path = os.path.join(base_dir, '.env')
    if os.path.exists(env_path):
        load_dotenv(env_path)
    else:
        # Fallback: try current directory
        load_dotenv()
except ImportError:
    pass

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# VERTEX AI / GEMINI CONFIGURATION
# ============================================================================

def _looks_like_json(s: Optional[str]) -> bool:
    if not s:
        return False
    s = s.strip()
    return s.startswith("{") and s.endswith("}")


def _parse_json_safely(raw: str) -> Optional[dict]:
    try:
        return json.loads(raw)
    except Exception:
        return None


def _write_service_account_json_to_temp(service_account_json: str) -> Optional[str]:
    """
    Persist service account JSON from env into a temp file and return its path.
    This is required for google-auth / service_account_file loading.
    """
    try:
        f = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False)
        with f:
            f.write(service_account_json)
        return f.name
    except Exception as e:
        logger.error(f"❌ Failed to write service account JSON to temp file: {e}")
        return None


def _get_first_env(*names: str) -> Optional[str]:
    for name in names:
        value = os.getenv(name)
        if value and value.strip():
            return value.strip()
    return None


def _looks_like_placeholder(value: Optional[str]) -> bool:
    if not value:
        return True
    lowered = value.strip().lower()
    return any(token in lowered for token in ["your-", "replace", "changeme", "placeholder"])


def _bool_env(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in ["1", "true", "yes", "on"]


def _build_live_setup_message(
    model_path: str,
    *,
    use_snake_case: bool,
    system_text: Optional[str],
    session_handle: Optional[str],
) -> dict:
    """Build a Live API setup message with correct field casing."""
    if use_snake_case:
        gen_key = "generation_config"
        response_key = "response_modalities"
        speech_key = "speech_config"
        voice_key = "voice_config"
        prebuilt_key = "prebuilt_voice_config"
        system_key = "system_instruction"
        context_key = "context_window_compression"
        session_key = "session_resumption"
        input_trans_key = "input_audio_transcription"
        output_trans_key = "output_audio_transcription"
        audio_modality = "audio"
        text_modality = "text"
    else:
        gen_key = "generationConfig"
        response_key = "responseModalities"
        speech_key = "speechConfig"
        voice_key = "voiceConfig"
        prebuilt_key = "prebuiltVoiceConfig"
        system_key = "systemInstruction"
        context_key = "contextWindowCompression"
        session_key = "sessionResumption"
        input_trans_key = "inputAudioTranscription"
        output_trans_key = "outputAudioTranscription"
        audio_modality = "AUDIO"
        text_modality = "TEXT"

    response_modalities = [audio_modality]
    if ENABLE_TRANSCRIPTION:
        response_modalities = [audio_modality, text_modality]

    setup = {
        "model": model_path,
        gen_key: {
            response_key: response_modalities,
            speech_key: {
                voice_key: {
                    prebuilt_key: {"voiceName": "Aoede"}
                }
            },
        },
        context_key: {
            "triggerTokens": 100000,
            "slidingWindow": {"targetTokens": 50000},
        },
        session_key: {},
        "tools": [],
    }

    # Keep turns short for teacher cadence, if configured
    if LIVE_MAX_OUTPUT_TOKENS and LIVE_MAX_OUTPUT_TOKENS > 0:
        max_key = "max_output_tokens" if use_snake_case else "maxOutputTokens"
        setup[gen_key][max_key] = LIVE_MAX_OUTPUT_TOKENS

    if ENABLE_TRANSPARENT_RESUMPTION:
        setup[session_key]["transparent"] = True
    if session_handle:
        setup[session_key]["handle"] = session_handle

    if system_text:
        setup[system_key] = {"parts": [{"text": system_text}]}

    if ENABLE_TRANSCRIPTION:
        setup[input_trans_key] = {}
        setup[output_trans_key] = {}

    return {"setup": setup}


def _init_vertex_env() -> dict:
    """
    Normalize Vertex/Gemini Live configuration from environment variables.

    Common misconfiguration we handle:
    - `GOOGLE_CLOUD_PROJECT` accidentally contains the full service-account JSON.
    - `GOOGLE_CLOUD_LOCATION` set to 'global' (invalid for Vertex WS endpoint).
    - Credentials provided inline (env) instead of file path.

    Returns a small, safe-to-log context dict (no secrets).
    """
    global USE_VERTEX_AI, GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION, GOOGLE_APPLICATION_CREDENTIALS, GEMINI_API_KEY

    # Defaults
    USE_VERTEX_AI = os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "True").lower() == "true"
    GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT", "gen-lang-client-0303273462")
    GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv(
        "GOOGLE_APPLICATION_CREDENTIALS", "credentials/vertex_ai_service_account.json"
    )
    GEMINI_API_KEY = _get_first_env(
        "GEMINI_API_KEY",
        "GOOGLE_AI_API_KEY",
        "GOOGLE_GENAI_API_KEY",
        "GENAI_API_KEY",
        "GOOGLE_API_KEY",
    )

    # Candidate env vars that may contain service account JSON
    sa_json_raw = (
        os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
        or os.getenv("VERTEX_AI_SERVICE_ACCOUNT_JSON")
        or os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    )

    # Some deploy setups accidentally put the full JSON in GOOGLE_CLOUD_PROJECT.
    project_was_json = False
    project_json = None
    if _looks_like_json(GOOGLE_CLOUD_PROJECT):
        project_json = _parse_json_safely(GOOGLE_CLOUD_PROJECT)
        if isinstance(project_json, dict) and project_json.get("type") == "service_account":
            project_was_json = True
            sa_json_raw = sa_json_raw or GOOGLE_CLOUD_PROJECT
            GOOGLE_CLOUD_PROJECT = project_json.get("project_id") or GOOGLE_CLOUD_PROJECT

    # If we have service account JSON, set project and credentials path reliably.
    creds_source = "file"
    client_email = None
    if sa_json_raw and _looks_like_json(sa_json_raw):
        sa = _parse_json_safely(sa_json_raw) or {}
        if isinstance(sa, dict) and sa.get("type") == "service_account":
            client_email = sa.get("client_email")
            project_id = sa.get("project_id")
            if project_id:
                GOOGLE_CLOUD_PROJECT = project_id
                os.environ["GOOGLE_CLOUD_PROJECT"] = project_id

            # If a credentials file path is set and exists, keep it; otherwise write temp.
            creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            if not (creds_path and os.path.exists(creds_path)):
                temp_path = _write_service_account_json_to_temp(sa_json_raw)
                if temp_path:
                    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_path
                    GOOGLE_APPLICATION_CREDENTIALS = temp_path
                    creds_source = "env_json"
                    USE_VERTEX_AI = True  # If creds exist, prefer Vertex

    # Vertex WS endpoint requires a real region, NOT "global"
    if GOOGLE_CLOUD_LOCATION.strip().lower() == "global":
        GOOGLE_CLOUD_LOCATION = "us-central1"
        os.environ["GOOGLE_CLOUD_LOCATION"] = GOOGLE_CLOUD_LOCATION

    return {
        "use_vertex_ai": USE_VERTEX_AI,
        "project_id": GOOGLE_CLOUD_PROJECT if not project_was_json else "(derived from service account JSON)",
        "location": GOOGLE_CLOUD_LOCATION,
        "credentials_source": creds_source,
        "credentials_path_set": bool(os.getenv("GOOGLE_APPLICATION_CREDENTIALS")),
        "credentials_path_exists": bool(os.getenv("GOOGLE_APPLICATION_CREDENTIALS") and os.path.exists(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))),
        "client_email": client_email,
        "has_gemini_api_key": bool(GEMINI_API_KEY and not _looks_like_placeholder(GEMINI_API_KEY)),
    }


# Initialize config once at import time (lifespan will re-run for safety)
_VERTEX_CTX = _init_vertex_env()

# Model selection (Gemini Live API)
# Use official Live model IDs per Vertex AI documentation.
GEMINI_MODEL = os.getenv('GEMINI_LIVE_MODEL', 'gemini-live-2.5-flash-native-audio')

# Fallback model if the primary isn't available in region/project.
GEMINI_MODEL_FALLBACK = os.getenv('GEMINI_LIVE_MODEL_FALLBACK', 'gemini-live-2.5-flash-preview-native-audio-09-2025')

# Live session controls
ENABLE_TRANSCRIPTION = _bool_env("GEMINI_LIVE_TRANSCRIPTION", False)
ENABLE_TRANSPARENT_RESUMPTION = _bool_env("GEMINI_LIVE_TRANSPARENT_RESUMPTION", False)
FORCE_VERTEX_AI = _bool_env("GOOGLE_GENAI_FORCE_VERTEXAI", False)
ENABLE_TEACHER_CADENCE = _bool_env("NERDX_LIVE_TEACHER_CADENCE", True)
# Optional hard cap on response length; set explicitly if needed.
LIVE_MAX_OUTPUT_TOKENS = int(os.getenv("NERDX_LIVE_MAX_OUTPUT_TOKENS", "0") or "0")

# NerdX System Instruction - Optimized for Gemini Live API (Native Audio)
# Following Google's best practices for system instructions
NERDX_SYSTEM_INSTRUCTION = """
## AGENT IDENTITY & PERSONA

**Name:** NerdX AI Tutor
**Role:** Voice-based academic tutor for O-Level and A-Level students
**Primary Users:** Secondary school students (O-Level & A-Level)
**Subjects Covered:** Mathematics, English, Biology, Chemistry, Physics, Combined Science, and related subjects
**Education Standards:** ZIMSEC-aligned, Cambridge-friendly explanations

You are NerdX AI Tutor, a calm, confident, and highly skilled academic tutor.
You explain complex ideas clearly, step-by-step, and in a student-friendly way.
Your goal is not just to give answers — your goal is to teach, build understanding, and improve exam performance.

---

## VOICE, TONE & LANGUAGE RULES

* Speak in clear, natural English
* Sound fresh, encouraging, and human, never robotic
* Neutral African/Zimbabwean-friendly tone (no slang, no forced accent)
* Confident but warm — like a great teacher sitting next to the student
* Never sound judgmental, rushed, or dismissive
* If the student speaks Shona or struggles with English, switch to Shona immediately to help them understand better

**Default Output Language:** English
**Speech Style:** Conversational, calm, educational
**Response Length (Voice):** Short explanations first, then ask if the student wants more depth

---

## CORE TEACHING PHILOSOPHY

You follow the principle: "Understand first, memorize later."

You:
* Break concepts into simple building blocks
* Use examples, analogies, and real-life applications
* Adjust difficulty based on student responses
* Encourage curiosity and questions
* Never just dump answers without explanation unless explicitly asked

---

## ACADEMIC LEVEL HANDLING

### O-Level Students
* Use simpler language
* Explain terms before using them
* Show clear worked examples
* Focus on fundamentals and exam-style questions

### A-Level Students
* Use precise academic language
* Introduce deeper reasoning and theory
* Show derivations, mechanisms, and cause–effect relationships
* Link concepts across topics

If the level is unclear, ask once: "Is this O-Level or A-Level?"

---

## CONVERSATIONAL FLOW (LOOP-BASED)

### 1. Greeting (One-time per session)
Warmly greet the student and introduce yourself as NerdX AI Tutor.
Example: "Hi, I'm NerdX, your AI tutor. What subject would you like to study today?"

### 2. Topic Discovery
Ask what subject, topic, and level (O or A Level). Keep it brief.

### 3. Teaching Loop (Main Loop – may repeat indefinitely)
In this loop, the student may:
* Ask for explanations
* Ask questions
* Request revision
* Say they don't understand
* Ask exam-style questions

You must:
* Explain step-by-step
* Pause naturally
* Ask short check-in questions like: "Does that make sense so far?"

### 4. Handling Confusion
If the student says "I don't understand", "Explain again", or "I'm lost":
* Re-explain more simply
* Use a different example
* Slow down your explanation
* Never blame the student

### 5. Revision Mode
If the student asks for revision:
* Summarize key points
* Highlight common exam mistakes
* Provide short practice questions (spoken)

---

## SUBJECT-SPECIFIC RULES

### Mathematics
* Define symbols clearly
* Show steps one at a time
* Explain WHY each step is done

### Sciences (Biology, Chemistry, Physics)
* Start with definitions
* Explain processes in logical order
* Link structure → function → application
* Mention exam keywords naturally

### English
* Explain grammar rules clearly
* Use examples in sentences
* For essays: structure first, then content

---

## EXAM & ACCURACY GUARDRAILS

* Do NOT guess answers
* If unsure, say: "Let me explain what is known clearly."
* Correct mistakes gently
* Avoid misinformation at all costs
* Stay aligned with secondary school syllabi (ZIMSEC, Cambridge)

---

## VOICE & REAL-TIME BEHAVIOR (CRITICAL)

* Keep responses short enough for audio
* Stop speaking immediately if interrupted
* Never talk over the student
* Always wait for user input before continuing
* Send audio in natural chunks, not long monologues

---

## GENERAL GUARDRAILS

* Never discourage a student
* Never shame or mock
* Never use complex jargon without explanation
* Stay focused on education
* If asked about non-educational topics (relationships, violence, inappropriate content), gently steer back to schoolwork: "Let's get back to your studies - what subject are you working on?"

---

## STARTING COMMAND (MANDATORY)

When the session begins, greet the student and ask what they want to study.
Example: "Hi! I'm NerdX, your AI tutor for O-Level and A-Level subjects. What subject would you like help with today?"
"""

TEACHER_CADENCE_INSTRUCTION = """
## TEACHER CADENCE MODE (MANDATORY)

Your goal is short, high-value turns that feel like a professional teacher.

RULES:
- Keep each spoken turn 10-20 seconds max (1-3 short sentences).
- Deliver one idea per turn: definition OR step OR example OR common mistake.
- End every turn with a short check-in question.
- If the explanation needs more depth, ask permission to continue.
- Do not chain multiple steps in one turn.
- Avoid filler and repetition.

TURN TEMPLATE (follow strictly):
1) Name the step or idea.
2) Explain briefly.
3) Ask a check-in question.
"""


def _get_system_instruction() -> str:
    if ENABLE_TEACHER_CADENCE:
        return NERDX_SYSTEM_INSTRUCTION + "\n\n" + TEACHER_CADENCE_INSTRUCTION
    return NERDX_SYSTEM_INSTRUCTION

# Audio buffering configuration. Default is full-turn buffering for gap-free audio.
# Tunable via env vars for production tuning.
LIVE_AUDIO_BATCH_MS = int(os.getenv("NERDX_LIVE_AUDIO_BATCH_MS", "400"))
LIVE_AUDIO_MAX_LATENCY_MS = int(os.getenv("NERDX_LIVE_AUDIO_MAX_LATENCY_MS", "700"))
LIVE_AUDIO_SAMPLE_RATE = 24000
LIVE_AUDIO_BYTES_PER_SECOND = LIVE_AUDIO_SAMPLE_RATE * 2  # 16-bit mono PCM
LIVE_AUDIO_MODE = os.getenv("NERDX_LIVE_AUDIO_MODE", "turn").strip().lower()

if LIVE_AUDIO_MODE not in {"turn", "stream", "micro"}:
    LIVE_AUDIO_MODE = "turn"



def convert_pcm_to_wav(pcm_data: bytes, sample_rate: int = 24000, channels: int = 1, sample_width: int = 2) -> bytes:
    """
    Convert raw PCM bytes to WAV format.
    FAST: No base64 encoding/decoding, works directly with bytes.
    """
    wav_buffer = io.BytesIO()
    byte_rate = sample_rate * channels * sample_width
    block_align = channels * sample_width
    data_size = len(pcm_data)
    
    # Write WAV header (44 bytes)
    wav_buffer.write(b'RIFF')
    wav_buffer.write(struct.pack('<I', 36 + data_size))
    wav_buffer.write(b'WAVE')
    wav_buffer.write(b'fmt ')
    wav_buffer.write(struct.pack('<I', 16))
    wav_buffer.write(struct.pack('<H', 1))
    wav_buffer.write(struct.pack('<H', channels))
    wav_buffer.write(struct.pack('<I', sample_rate))
    wav_buffer.write(struct.pack('<I', byte_rate))
    wav_buffer.write(struct.pack('<H', block_align))
    wav_buffer.write(struct.pack('<H', sample_width * 8))
    wav_buffer.write(b'data')
    wav_buffer.write(struct.pack('<I', data_size))
    wav_buffer.write(pcm_data)
    
    return wav_buffer.getvalue()


def convert_m4a_to_pcm(m4a_base64: str) -> Optional[tuple[str, int]]:
    """
    Convert M4A/AAC audio to raw PCM for Gemini Live API.
    Returns base64-encoded 16-bit little-endian PCM at 16kHz mono.
    """
    try:
        from pydub import AudioSegment
        
        # Set ffmpeg path from imageio-ffmpeg if available
        try:
            import imageio_ffmpeg
            ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
            AudioSegment.converter = ffmpeg_path
        except ImportError:
            pass
        except Exception:
            pass
        
        logger.debug(f"🔄 Converting M4A to PCM: {len(m4a_base64)} chars input")
        m4a_bytes = base64.b64decode(m4a_base64)
        logger.debug(f"📦 Decoded M4A: {len(m4a_bytes)} bytes")
        
        audio = AudioSegment.from_file(io.BytesIO(m4a_bytes), format="m4a")
        logger.debug(f"🎵 Loaded audio: {len(audio)}ms, {audio.frame_rate}Hz, {audio.channels}ch")
        
        audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
        pcm_bytes = audio.raw_data
        pcm_base64 = base64.b64encode(pcm_bytes).decode('utf-8')
        
        logger.debug(f"✅ Converted to PCM: {len(pcm_bytes)} bytes, {len(pcm_base64)} chars base64")
        return pcm_base64, len(pcm_bytes)
        
    except Exception as e:
        logger.error(f"❌ Audio conversion failed: {e}", exc_info=True)
        return None  # Don't send invalid audio to Gemini


def _normalize_audio_format(mime_type: Optional[str]) -> str:
    """
    Map an HTTP mime-type into a pydub/ffmpeg format hint.

    Default is "m4a" for backward compatibility with existing mobile clients.
    """
    if not mime_type:
        return "m4a"

    raw = str(mime_type).strip().lower()
    base = raw.split(";")[0].strip()

    if base in ("audio/mp4", "video/mp4", "audio/m4a", "audio/x-m4a"):
        return "m4a"
    if base in ("audio/webm", "video/webm"):
        return "webm"
    if base in ("audio/ogg", "application/ogg"):
        return "ogg"
    if base in ("audio/wav", "audio/x-wav", "audio/wave"):
        return "wav"
    if base in ("audio/mpeg", "audio/mp3"):
        return "mp3"
    if base in ("audio/aac",):
        return "aac"

    return "m4a"


def convert_audio_to_pcm(audio_base64: str, mime_type: Optional[str] = None) -> Optional[tuple[str, int]]:
    """
    Convert common audio formats to raw PCM for Gemini Live API.
    Returns base64-encoded 16-bit little-endian PCM at 16kHz mono.

    Supported inputs (best-effort): m4a/mp4, webm, ogg, wav, mp3, aac.
    """
    if not mime_type:
        # Preserve existing behavior for mobile clients that send m4a without mimeType.
        return convert_m4a_to_pcm(audio_base64)

    fmt = _normalize_audio_format(mime_type)
    if fmt == "m4a":
        return convert_m4a_to_pcm(audio_base64)

    try:
        from pydub import AudioSegment

        # Set ffmpeg path from imageio-ffmpeg if available
        try:
            import imageio_ffmpeg
            ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
            AudioSegment.converter = ffmpeg_path
        except ImportError:
            pass
        except Exception:
            pass

        logger.debug(f"Converting audio to PCM: fmt={fmt}, mime={mime_type}, chars={len(audio_base64)}")
        audio_bytes = base64.b64decode(audio_base64)
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format=fmt)
        audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)

        pcm_bytes = audio.raw_data
        pcm_base64 = base64.b64encode(pcm_bytes).decode('utf-8')
        return pcm_base64, len(pcm_bytes)

    except Exception as e:
        logger.error(f"Audio conversion failed (fmt={fmt}): {e}", exc_info=True)
        return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    # Re-normalize in case env vars were injected after import (common on some platforms)
    global _VERTEX_CTX
    _VERTEX_CTX = _init_vertex_env()
    logger.info("🚀 NerdX Live Voice Agent starting (VERTEX AI + TRANSPARENT PIPE mode)...")
    logger.info(f"📍 Vertex AI Enabled: {_VERTEX_CTX.get('use_vertex_ai')}")
    logger.info(f"📍 Project: {GOOGLE_CLOUD_PROJECT}")
    logger.info(f"📍 Location: {GOOGLE_CLOUD_LOCATION}")
    logger.info(f"📍 Model: {GEMINI_MODEL}")
    if _VERTEX_CTX.get("client_email"):
        logger.info(f"📍 Vertex SA: {_VERTEX_CTX.get('client_email')}")
    
    if USE_VERTEX_AI:
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or GOOGLE_APPLICATION_CREDENTIALS
        if creds_path and os.path.exists(creds_path):
            logger.info(f"✅ Vertex AI credentials ready ({_VERTEX_CTX.get('credentials_source')}): {creds_path}")
        else:
            logger.warning("⚠️ Vertex AI enabled but credentials file not found; Live API will fail until credentials are provided")
    
    if GEMINI_API_KEY and not _looks_like_placeholder(GEMINI_API_KEY):
        logger.info("✅ Gemini API key configured (fallback)")
    else:
        logger.warning("⚠️ No Gemini API key (fallback unavailable)")
    
    yield

    # Best-effort close any active WebRTC peer connections.
    try:
        peers = list(_RTC_PEERS)
    except Exception:
        peers = []
    for pc in peers:
        try:
            await pc.close()
        except Exception:
            pass
    try:
        _RTC_PEERS.clear()
    except Exception:
        pass

    logger.info("👋 NerdX Live shutting down...")


# Create FastAPI app
app = FastAPI(
    title="NerdX Live Voice Agent",
    description="Vertex AI Live API with transparent pipe - minimal latency, HD voice",
    version="3.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BillingManager:
    """
    Handles real-time credit deduction for live sessions.
    Charges user every 5 seconds (voice/video).
    """
    def __init__(self, user_id: str, mode: str = "voice"):
        self.user_id = user_id
        self.mode = mode
        self.tick_seconds = 5
        # Dynamic cost - getting it in the loop or init? 
        # Standardize on init but refreshes could be better. For now simple.
        # Avoid circular import at module level by importing inside methods or using a safe import
        try:
            from services.advanced_credit_service import advanced_credit_service
            base_cost = advanced_credit_service.get_credit_cost('voice_chat')
            self.cost_per_tick = base_cost if mode == "voice" else base_cost * 2
        except Exception as e:
            logger.warning(f"Using fallback cost due to import error: {e}")
            self.cost_per_tick = 1 if mode == "voice" else 2  # Fallback
            
        self.is_active = True
        self.bytes_per_second = 16000 * 2  # 16kHz * 2 bytes per sample
        self.bytes_per_tick = self.bytes_per_second * self.tick_seconds
        self.audio_bytes_accumulated = 0
        self.charge_lock = asyncio.Lock()
        
    async def verify_balance(self) -> bool:
        """Check if user has enough credits to start"""
        try:
            # Refresh cost in case it changed
            try:
                from services.advanced_credit_service import advanced_credit_service
                base_cost = advanced_credit_service.get_credit_cost('voice_chat')
                self.cost_per_tick = base_cost if self.mode == "voice" else base_cost * 2
            except Exception:
                pass

            # Run blocking DB call in thread
            current_credits = await asyncio.to_thread(get_user_credits, self.user_id)
            logger.info(f"💰 Checking balance for {self.user_id}: {current_credits} (Required: {self.cost_per_tick})")
            return current_credits >= self.cost_per_tick
        except Exception as e:
            logger.error(f"❌ Balance check failed: {e}")
            return False  # Fail safe

    async def deduct_for_tick(self) -> bool:
        """Deduct credits for the next 5-second tick"""
        try:
            # Use atomic deduction via external_db directly (as advanced_credit_service wrappers might be sync)
            # But the plan urged to use advanced_credit_service or external_db. 
            # external_db.deduct_credits is now atomic so it's safe.
            
            success = await asyncio.to_thread(
                deduct_credits, 
                self.user_id, 
                self.cost_per_tick, 
                'voice_chat', 
                f"Live {self.mode.title()} ({self.tick_seconds}s)"
            )
            if success:
                logger.info(f"💸 Deducted {self.cost_per_tick} units from {self.user_id} for {self.mode} live")
            else:
                logger.warning(f"⚠️ Failed to deduct credits for {self.user_id}")
            return success
        except Exception as e:
            logger.error(f"❌ Deduction error: {e}")
            return False

    async def charge_for_audio_bytes(self, pcm_bytes_len: int) -> bool:
        """
        Charge ONLY for active user audio.
        Deducts per 5 seconds of PCM audio received.
        """
        if not self.is_active or pcm_bytes_len <= 0:
            return True

        async with self.charge_lock:
            self.audio_bytes_accumulated += pcm_bytes_len

            while self.audio_bytes_accumulated >= self.bytes_per_tick:
                success = await self.deduct_for_tick()
                if not success:
                    self.is_active = False
                    return False
                self.audio_bytes_accumulated -= self.bytes_per_tick

        return True

async def run_billing_scheduler(billing: BillingManager, websocket: WebSocket):
    """Run periodic billing every 5 seconds"""
    try:
        logger.info(f"⏱️ Starting billing scheduler for {billing.user_id}")
        while True:
            # Charge immediately for the upcoming tick (pre-paid)
            if not await billing.deduct_for_tick():
                logger.warning(f"🛑 Insufficient credits for {billing.user_id}, closing session.")
                try:
                    await websocket.send_json({
                        "type": "error", 
                        "message": "Session ended: Insufficient credits to continue."
                    })
                    await websocket.close()
                except Exception:
                    pass
                break
            
            # Wait 5 seconds before next charge
            await asyncio.sleep(billing.tick_seconds)
            
    except asyncio.CancelledError:
        logger.info(f"Billing scheduler cancelled for {billing.user_id}")
    except Exception as e:
        logger.error(f"Billing scheduler error: {e}")


class TransparentGeminiPipe:
    """
    TURN-BUFFERED PIPE: Buffers PCM for a full turn to avoid gaps.
    Supports both Vertex AI (preferred) and regular Gemini API.
    Includes session resumption and goAway handling per Gemini Live API docs.
    
    STREAMING STRATEGY:
    - PCM chunks are buffered for the full turn and concatenated
    - Combined PCM is converted to WAV and sent at turn end
    - Client queues and plays chunks in sequence
    - Gap-free playback with higher latency per response
    """
    
    def __init__(self, client_ws: WebSocket, session_handle: str = None):
        self.client_ws = client_ws
        self.gemini_ws: Optional[any] = None
        self.is_active = False
        self.using_vertex_ai = False
        self.last_error: Optional[str] = None
        # Session resumption support
        self.session_handle = session_handle  # For resuming previous sessions
        self.session_id = None  # Returned by server during session
        # Audio micro-batch buffer (PCM bytes)
        self.audio_buffer = bytearray()
        self.audio_buffer_lock = asyncio.Lock()
        self.last_flush_time = time.time()
    
    async def _get_vertex_ai_token(self) -> Optional[str]:
        """Get OAuth2 access token for Vertex AI using service account."""
        try:
            from google.oauth2 import service_account
            from google.auth.transport import requests as google_requests
            
            # Check for credentials file
            creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or GOOGLE_APPLICATION_CREDENTIALS
            
            if not os.path.exists(creds_path):
                logger.warning(f"Service account file not found: {creds_path}")
                return None
            
            # Load service account credentials
            credentials = service_account.Credentials.from_service_account_file(
                creds_path,
                scopes=['https://www.googleapis.com/auth/cloud-platform']
            )
            
            # Refresh to get access token
            credentials.refresh(google_requests.Request())
            
            logger.info(f"✅ Got Vertex AI access token (expires: {credentials.expiry})")
            return credentials.token
            
        except Exception as e:
            logger.error(f"❌ Failed to get Vertex AI token: {e}")
            return None
    
    async def connect_to_gemini(self) -> bool:
        """Connect to Gemini Live API - tries Vertex AI first, then regular API."""
        
        # Try Vertex AI first (better quality, service account auth)
        if USE_VERTEX_AI:
            connected = await self._connect_vertex_ai()
            if connected:
                self.using_vertex_ai = True
                return True
            if not self.last_error:
                self.last_error = "Vertex AI connection failed"
            logger.warning("⚠️ Vertex AI connection failed, falling back to regular Gemini API")
            if FORCE_VERTEX_AI:
                logger.error("❌ FORCE_VERTEX_AI is enabled; skipping Gemini API fallback")
                return False
        
        # Fallback to regular Gemini API
        if GEMINI_API_KEY and not _looks_like_placeholder(GEMINI_API_KEY):
            connected = await self._connect_gemini_api()
            if connected:
                return True
        elif not self.last_error:
            self.last_error = "GEMINI_API_KEY not configured (no fallback available)"
        
        logger.error("❌ All connection methods failed")
        return False
    
    async def _connect_vertex_ai(self) -> bool:
        """Connect to Vertex AI Gemini Live API with OAuth2."""
        try:
            import websockets
            
            # Get access token
            token = await asyncio.to_thread(self._get_vertex_ai_token_sync)
            if not token:
                if not self.last_error:
                    self.last_error = "Vertex credentials not available (token fetch failed)"
                return False
            
            # Vertex AI WebSocket endpoint
            # Format: wss://{LOCATION}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent
            vertex_url = (
                f"wss://{GOOGLE_CLOUD_LOCATION}-aiplatform.googleapis.com/ws/"
                f"google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent"
            )
            
            logger.info(f"🔗 Connecting to Vertex AI Live API (project: {GOOGLE_CLOUD_PROJECT})...")
            logger.info(f"🔗 Location: {GOOGLE_CLOUD_LOCATION}, Model: {GEMINI_MODEL}")
            
            self.gemini_ws = await websockets.connect(
                vertex_url,
                additional_headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                    "x-goog-user-project": GOOGLE_CLOUD_PROJECT,
                },
                ping_interval=30,
                ping_timeout=10,
            )
            
            def _is_model_related_error(msg: str) -> bool:
                m = (msg or "").lower()
                return (
                    "model" in m
                    and ("not found" in m or "invalid" in m or "unknown" in m or "resource" in m)
                )

            # Try a small set of Live models (some preview names differ by platform/region).
            model_candidates = []
            for m in [
                GEMINI_MODEL,
                os.getenv("GEMINI_LIVE_MODEL_FALLBACK"),
                GEMINI_MODEL_FALLBACK,
                "gemini-live-2.5-flash-preview-native-audio-09-2025",
                "gemini-2.0-flash-live-001",
            ]:
                if m and m not in model_candidates:
                    model_candidates.append(m)

            for model_name in model_candidates:
                setup_message = _build_live_setup_message(
                    f"projects/{GOOGLE_CLOUD_PROJECT}/locations/{GOOGLE_CLOUD_LOCATION}/publishers/google/models/{model_name}",
                    use_snake_case=True,
                    system_text=_get_system_instruction(),
                    session_handle=self.session_handle,
                )

                logger.info(f"📤 Sending Vertex AI setup (model: {model_name})...")
                await self.gemini_ws.send(json.dumps(setup_message))

                setup_response = await asyncio.wait_for(self.gemini_ws.recv(), timeout=30.0)
                setup_data = json.loads(setup_response)

                logger.info(f"📥 Vertex AI setup response: {json.dumps(setup_data)[:500]}")

                if "setupComplete" in setup_data:
                    logger.info(f"✅ Vertex AI Live session established successfully (model: {model_name})")
                    self.is_active = True
                    return True

                if "error" in setup_data:
                    error_info = setup_data.get("error", {})
                    error_msg = error_info.get("message", str(setup_data))
                    logger.error(f"❌ Vertex AI setup error (model: {model_name}): {error_msg}")
                    if _is_model_related_error(error_msg) and model_name != model_candidates[-1]:
                        logger.warning("↩️ Retrying with fallback Vertex Live model...")
                        continue
                    return False

                logger.error(f"❌ Unexpected Vertex AI response (model: {model_name}): {setup_data}")
                return False
                
        except asyncio.TimeoutError:
            self.last_error = "Timeout waiting for Vertex AI setup"
            logger.error("❌ Timeout waiting for Vertex AI setup")
            return False
        except Exception as e:
            self.last_error = f"Vertex AI connection error: {type(e).__name__}: {e}"
            logger.error(f"❌ Vertex AI connection error: {type(e).__name__}: {e}")
            return False
    
    def _get_vertex_ai_token_sync(self) -> Optional[str]:
        """Synchronous version for use with asyncio.to_thread."""
        try:
            from google.oauth2 import service_account
            from google.auth.transport import requests as google_requests
            
            creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or GOOGLE_APPLICATION_CREDENTIALS
            
            if not os.path.exists(creds_path):
                return None
            
            credentials = service_account.Credentials.from_service_account_file(
                creds_path,
                scopes=['https://www.googleapis.com/auth/cloud-platform']
            )
            credentials.refresh(google_requests.Request())
            return credentials.token
        except Exception as e:
            logger.error(f"Token error: {e}")
            return None
    
    async def _connect_gemini_api(self) -> bool:
        """Connect to regular Gemini API (fallback)."""
        if not GEMINI_API_KEY or _looks_like_placeholder(GEMINI_API_KEY):
            self.last_error = "Gemini API key missing or invalid placeholder"
            logger.error("❌ GEMINI_API_KEY not set!")
            return False
            
        try:
            import websockets
            
            gemini_url = (
                f"wss://generativelanguage.googleapis.com/ws/"
                f"google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent"
                f"?key={GEMINI_API_KEY}"
            )
            
            def _is_model_related_error(msg: str) -> bool:
                m = (msg or "").lower()
                return "model" in m and ("not found" in m or "invalid" in m or "unknown" in m)

            def _is_quota_error(msg: str) -> bool:
                m = (msg or "").lower()
                return "quota" in m or "billing" in m or "exceeded" in m

            # Try Live-capable models for the Gemini API WS endpoint.
            model_candidates = []
            for m in [
                GEMINI_MODEL,
                GEMINI_MODEL_FALLBACK,
                "gemini-2.0-flash-live-001",
            ]:
                if m and m not in model_candidates:
                    model_candidates.append(m)

            for model_name in model_candidates:
                logger.info(f"🔗 Connecting to Gemini API (model: {model_name})...")

                # Reconnect per attempt to avoid stale WS state after setup errors
                if self.gemini_ws:
                    try:
                        await self.gemini_ws.close()
                    except Exception:
                        pass
                    self.gemini_ws = None

                self.gemini_ws = await websockets.connect(
                    gemini_url,
                    additional_headers={"Content-Type": "application/json"},
                    ping_interval=30,
                    ping_timeout=10,
                )

                setup_message = _build_live_setup_message(
                    f"models/{model_name}",
                    use_snake_case=False,
                    system_text=_get_system_instruction(),
                    session_handle=self.session_handle,
                )

                logger.info("📤 Sending Gemini API setup...")
                await self.gemini_ws.send(json.dumps(setup_message))

                setup_response = await asyncio.wait_for(self.gemini_ws.recv(), timeout=30.0)
                setup_data = json.loads(setup_response)

                logger.info(f"📥 Gemini API setup response: {json.dumps(setup_data)[:500]}")

                if "setupComplete" in setup_data:
                    logger.info("✅ Gemini API session established")
                    self.is_active = True
                    return True

                if "error" in setup_data:
                    error_info = setup_data.get("error", {})
                    error_msg = error_info.get("message", str(setup_data))
                    logger.error(f"❌ Gemini API setup error (model: {model_name}): {error_msg}")
                    if _is_quota_error(error_msg):
                        self.last_error = "Gemini API quota/billing exceeded"
                        return False
                    if _is_model_related_error(error_msg) and model_name != model_candidates[-1]:
                        logger.warning("↩️ Retrying with fallback Gemini Live model...")
                        continue
                    return False

                logger.error(f"❌ Unexpected response: {setup_data}")
                return False
                
        except asyncio.TimeoutError:
            self.last_error = "Timeout waiting for Gemini API setup"
            logger.error("❌ Timeout waiting for Gemini API setup")
            return False
        except Exception as e:
            self.last_error = f"Gemini API connection error: {type(e).__name__}: {e}"
            logger.error(f"❌ Gemini API connection error: {type(e).__name__}: {e}")
            return False
    
    async def forward_audio_to_gemini(self, audio_base64: str, billing: Optional[BillingManager] = None, mime_type: Optional[str] = None):
        """
        Forward audio to Gemini IMMEDIATELY - no buffering.
        Only converts format, then sends right away.
        """
        if not self.gemini_ws or not self.is_active:
            logger.warning("⚠️ Cannot forward audio: WebSocket not ready or inactive")
            return
            
        try:
            logger.info(f"🔄 Converting audio: {len(audio_base64)} chars base64")
            pcm_result = convert_audio_to_pcm(audio_base64, mime_type=mime_type)
            if not pcm_result:
                logger.error("❌ Audio conversion returned empty - cannot send to Gemini")
                # Notify client of conversion failure
                try:
                    await self.client_ws.send_json({
                        "type": "error",
                        "message": "Audio conversion failed"
                    })
                except Exception:
                    pass
                return
            
            pcm_base64, pcm_bytes_len = pcm_result
            logger.info(f"✅ Audio converted: {len(pcm_base64)} chars PCM base64")

            if billing:
                charged = await billing.charge_for_audio_bytes(pcm_bytes_len)
                if not charged:
                    logger.warning("🛑 Insufficient credits during live session; closing connection.")
                    try:
                        await self.client_ws.send_json({
                            "type": "error",
                            "message": "Session ended: Insufficient credits to continue."
                        })
                    except Exception:
                        pass
                    await self.client_ws.close()
                    self.is_active = False
                    return
            
            # Send immediately - no batching
            message = {
                "realtimeInput": {
                    "mediaChunks": [{
                        "mimeType": "audio/pcm;rate=16000",
                        "data": pcm_base64
                    }]
                }
            }
            await self.gemini_ws.send(json.dumps(message))
            logger.info("📤 Audio forwarded to Gemini successfully")
            
        except Exception as e:
            logger.error(f"❌ Forward error: {e}", exc_info=True)

    async def _flush_audio_buffer(self):
        """Flush buffered PCM as a single WAV chunk to the client."""
        async with self.audio_buffer_lock:
            if not self.audio_buffer:
                return
            pcm_bytes = bytes(self.audio_buffer)
            self.audio_buffer.clear()

        try:
            wav_bytes = convert_pcm_to_wav(pcm_bytes, sample_rate=LIVE_AUDIO_SAMPLE_RATE)
            wav_b64 = base64.b64encode(wav_bytes).decode('utf-8')
            await self.client_ws.send_json({
                "type": "audio",
                "data": wav_b64
            })
            logger.debug(
                f"Sent buffered audio: {len(pcm_bytes)} bytes PCM (~{len(pcm_bytes) / LIVE_AUDIO_BYTES_PER_SECOND:.2f}s)"
            )
        finally:
            self.last_flush_time = time.time()

    async def _buffer_pcm_turn(self, pcm_bytes: bytes):
        """Buffer PCM for the full turn (no mid-turn flush)."""
        if not pcm_bytes:
            return

        async with self.audio_buffer_lock:
            self.audio_buffer.extend(pcm_bytes)

    async def _clear_audio_buffer(self):
        """Clear any pending buffered PCM (e.g., on interruption)."""
        async with self.audio_buffer_lock:
            self.audio_buffer.clear()

    async def _buffer_pcm_and_maybe_flush(self, pcm_bytes: bytes):
        """Buffer PCM and flush when batch size or latency threshold is reached (stream mode)."""
        if not pcm_bytes:
            return

        async with self.audio_buffer_lock:
            was_empty = len(self.audio_buffer) == 0
            self.audio_buffer.extend(pcm_bytes)
            buffered_len = len(self.audio_buffer)

        if was_empty:
            self.last_flush_time = time.time()

        buffered_ms = (buffered_len / LIVE_AUDIO_BYTES_PER_SECOND) * 1000
        elapsed_ms = (time.time() - self.last_flush_time) * 1000

        if buffered_ms >= LIVE_AUDIO_BATCH_MS or elapsed_ms >= LIVE_AUDIO_MAX_LATENCY_MS:
            await self._flush_audio_buffer()

    
    async def receive_and_forward(self):
        """
        Receive from Gemini and forward to client with configurable buffering.
        
        STREAMING STRATEGY:
        - Default: buffer PCM for the full turn
        - Send WAV once at turn end (turn mode) or micro-batch (stream mode)
        - Client queues and plays chunks in sequence
        - Gap-free playback (higher latency per response)
        """
        if not self.gemini_ws:
            logger.warning("⚠️ Cannot receive: Gemini WebSocket not connected")
            return
            
        try:
            logger.info(f"👂 Starting to listen for Gemini responses (audio_mode={LIVE_AUDIO_MODE})...")
            while self.is_active:
                response = await self.gemini_ws.recv()
                data = json.loads(response)
                
                logger.debug(f"📥 Received from Gemini: {list(data.keys())}")
                
                if "serverContent" in data:
                    content = data["serverContent"]
                    
                    # Stream audio chunks and extract text for transcription
                    if "modelTurn" in content:
                        model_turn = content["modelTurn"]
                        if "parts" in model_turn:
                            for part in model_turn["parts"]:
                                # Extract text for captions/transcription
                                if "text" in part:
                                    text_content = part["text"]
                                    if text_content and text_content.strip():
                                        logger.info(f"📝 Received text from Gemini: {text_content[:100]}...")
                                        # Send text to client for captions
                                        try:
                                            await self.client_ws.send_json({
                                                "type": "text",
                                                "text": text_content,
                                                "speaker": "nerdx"
                                            })
                                        except Exception as e:
                                            logger.warning(f"⚠️ Failed to send text to client: {e}")
                                
                                # BUFFER audio chunks and flush in micro-batches
                                if "inlineData" in part:
                                    inline_data = part["inlineData"]
                                    mime_type = inline_data.get("mimeType", "")
                                    
                                    if mime_type.startswith("audio/") and "pcm" in mime_type.lower():
                                        audio_b64 = inline_data.get("data", "")
                                        if audio_b64:
                                            # Buffer PCM (turn mode) or flush in micro-batches (stream mode)
                                            pcm_bytes = base64.b64decode(audio_b64)
                                            if LIVE_AUDIO_MODE == "turn":
                                                await self._buffer_pcm_turn(pcm_bytes)
                                            else:
                                                await self._buffer_pcm_and_maybe_flush(pcm_bytes)
                    
                    # Notify client when turn is complete
                    if content.get("turnComplete"):
                        await self._flush_audio_buffer()
                        await self.client_ws.send_json({"type": "turnComplete"})
                        logger.info("✅ Turn complete")
                        
                    if content.get("interrupted"):
                        await self._clear_audio_buffer()
                        await self.client_ws.send_json({"type": "interrupted"})
                        logger.info("🎤 Interrupted")
                
                # Handle goAway notification (session about to end)
                if "goAway" in data:
                    go_away = data["goAway"]
                    time_left = go_away.get("timeLeft", "unknown")
                    logger.warning(f"⏳ GoAway received - session ending in {time_left}")
                    # Notify client to reconnect soon
                    await self.client_ws.send_json({
                        "type": "goAway",
                        "timeLeft": time_left,
                        "handle": self.session_handle,
                        "sessionId": self.session_id,
                        "message": "Session ending soon. Please reconnect."
                    })
                
                # Handle session resumption updates
                if "sessionResumptionUpdate" in data:
                    update = data["sessionResumptionUpdate"]
                    if update.get("resumable") and update.get("newHandle"):
                        self.session_handle = update["newHandle"]
                        self.session_id = update.get("sessionId")
                        logger.info(f"📦 Session handle updated: {self.session_handle[:20]}...")
                        # Send handle to client for reconnection
                        await self.client_ws.send_json({
                            "type": "sessionUpdate",
                            "handle": self.session_handle,
                            "sessionId": self.session_id
                        })
                
                if "serverContent" not in data and "goAway" not in data and "sessionResumptionUpdate" not in data:
                    logger.debug(f"📦 Other message from Gemini: {list(data.keys())}")
                        
        except Exception as e:
            if self.is_active:
                logger.error(f"❌ Receive error: {e}", exc_info=True)
    
    async def close(self):
        """Close session"""
        self.is_active = False
        if self.gemini_ws:
            try:
                await self.gemini_ws.close()
            except Exception:
                pass
        logger.info("👋 Session closed")


@app.get("/")
async def root():
    """Health check"""
    return {
        "service": "NerdX Live Voice Agent",
        "mode": "TRANSPARENT_PIPE",
        "status": "running",
        "model": GEMINI_MODEL,
        "vertex_enabled": bool(USE_VERTEX_AI),
        "project_id": GOOGLE_CLOUD_PROJECT,
        "location": GOOGLE_CLOUD_LOCATION,
        # Avoid leaking filesystem paths in a public endpoint.
        "credentials_ready": bool(os.getenv("GOOGLE_APPLICATION_CREDENTIALS") and os.path.exists(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))),
        "credentials_source": (_VERTEX_CTX.get("credentials_source") if isinstance(_VERTEX_CTX, dict) else None),
        "fallback_api_key_configured": bool(GEMINI_API_KEY and not _looks_like_placeholder(GEMINI_API_KEY)),
    }


@app.get("/health")
async def health():
    """Health check for monitoring"""
    return {"status": "healthy", "mode": "transparent_pipe"}


class TransparentGeminiVideoPipe:
    """
    AUDIO BUFFERING PIPE for Video + Audio.
    Handles both video frames and audio - tutor can SEE what student is working on.
    Supports both Vertex AI (preferred) and regular Gemini API.
    Includes session resumption and context window compression per Gemini Live API docs.
    
    AUDIO BUFFERING: Same strategy as audio-only pipe for smooth playback.
    """
    
    def __init__(self, client_ws: WebSocket, session_handle: str = None):
        self.client_ws = client_ws
        self.gemini_ws: Optional[any] = None
        self.is_active = False
        self.using_vertex_ai = False
        self.last_error: Optional[str] = None
        # Session resumption support
        self.session_handle = session_handle
        self.session_id = None
        # Audio buffering for smooth playback
        self.audio_buffer: list[bytes] = []
        self.buffer_lock = asyncio.Lock()
        
    async def connect_to_gemini(self) -> bool:
        """Connect to Gemini Live API with video support.
        Tries Vertex AI first, then falls back to regular Gemini API.
        """
        # Try Vertex AI first (higher rate limits)
        if USE_VERTEX_AI:
            connected = await self._connect_vertex_ai_video()
            if connected:
                self.using_vertex_ai = True
                return True
            if not self.last_error:
                self.last_error = "Vertex AI video connection failed"
            logger.warning("⚠️ Vertex AI video connection failed, falling back to regular Gemini API")
            if FORCE_VERTEX_AI:
                logger.error("❌ FORCE_VERTEX_AI is enabled; skipping Gemini API fallback")
                return False
        
        # Fallback to regular Gemini API
        if GEMINI_API_KEY and not _looks_like_placeholder(GEMINI_API_KEY):
            connected = await self._connect_gemini_api_video()
            if connected:
                return True
        elif not self.last_error:
            self.last_error = "GEMINI_API_KEY not configured (no video fallback available)"
        
        logger.error("❌ All video connection methods failed")
        return False
    
    async def _connect_vertex_ai_video(self) -> bool:
        """Connect to Vertex AI Gemini Live API with OAuth2 for video."""
        try:
            import websockets
            
            # Get access token
            token = await asyncio.to_thread(self._get_vertex_ai_token_sync)
            if not token:
                if not self.last_error:
                    self.last_error = "Vertex credentials not available (video token fetch failed)"
                logger.warning("Failed to get Vertex AI token for video")
                return False
            
            # Vertex AI WebSocket endpoint
            vertex_url = (
                f"wss://{GOOGLE_CLOUD_LOCATION}-aiplatform.googleapis.com/ws/"
                f"google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent"
            )
            
            logger.info(f"🔗 Connecting to Vertex AI VIDEO (project: {GOOGLE_CLOUD_PROJECT})...")
            
            self.gemini_ws = await websockets.connect(
                vertex_url,
                additional_headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                    "x-goog-user-project": GOOGLE_CLOUD_PROJECT,
                },
                ping_interval=30,
                ping_timeout=10,
            )
            
            # Send setup message for Vertex AI video
            setup_message = self._build_video_setup_message(
                model_path=f"projects/{GOOGLE_CLOUD_PROJECT}/locations/{GOOGLE_CLOUD_LOCATION}/publishers/google/models/{GEMINI_MODEL}",
                use_snake_case=True,
            )
            
            logger.info(f"📤 Sending Vertex AI VIDEO setup...")
            await self.gemini_ws.send(json.dumps(setup_message))
            
            setup_response = await asyncio.wait_for(self.gemini_ws.recv(), timeout=30.0)
            setup_data = json.loads(setup_response)
            
            logger.info(f"📥 Vertex AI video setup response: {json.dumps(setup_data)[:500]}")
            
            if "setupComplete" in setup_data:
                logger.info("✅ Vertex AI Video session established")
                self.is_active = True
                return True
            elif "error" in setup_data:
                error_info = setup_data.get("error", {})
                error_msg = error_info.get("message", str(setup_data))
                logger.error(f"❌ Vertex AI video setup error: {error_msg}")
                return False
            else:
                logger.error(f"❌ Unexpected Vertex AI video response: {setup_data}")
                return False
                
        except asyncio.TimeoutError:
            self.last_error = "Timeout waiting for Vertex AI video setup"
            logger.error("❌ Timeout waiting for Vertex AI video setup")
            return False
        except Exception as e:
            self.last_error = f"Vertex AI video connection error: {type(e).__name__}: {e}"
            logger.error(f"❌ Vertex AI video connection error: {type(e).__name__}: {e}")
            return False
    
    def _get_vertex_ai_token_sync(self) -> Optional[str]:
        """Synchronous version for use with asyncio.to_thread."""
        try:
            from google.oauth2 import service_account
            from google.auth.transport import requests as google_requests
            
            creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or GOOGLE_APPLICATION_CREDENTIALS
            
            if not os.path.exists(creds_path):
                return None
            
            credentials = service_account.Credentials.from_service_account_file(
                creds_path,
                scopes=['https://www.googleapis.com/auth/cloud-platform']
            )
            credentials.refresh(google_requests.Request())
            return credentials.token
        except Exception as e:
            logger.error(f"Video token error: {e}")
            return None
    
    async def _connect_gemini_api_video(self) -> bool:
        """Connect to regular Gemini API for video (fallback)."""
        try:
            import websockets

            if not GEMINI_API_KEY or _looks_like_placeholder(GEMINI_API_KEY):
                self.last_error = "Gemini API key missing or invalid placeholder"
                logger.error("❌ GEMINI_API_KEY not set!")
                return False
            
            gemini_url = (
                f"wss://generativelanguage.googleapis.com/ws/"
                f"google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent"
                f"?key={GEMINI_API_KEY}"
            )
            
            logger.info(f"🔗 Connecting to Gemini API VIDEO (model: {GEMINI_MODEL})...")
            self.gemini_ws = await websockets.connect(
                gemini_url,
                additional_headers={"Content-Type": "application/json"},
                ping_interval=30,
                ping_timeout=10,
            )
            
            # Setup with video + audio capabilities
            setup_message = self._build_video_setup_message(
                model_path=f"models/{GEMINI_MODEL}",
                use_snake_case=False,
            )
            
            logger.info(f"📤 Sending Gemini API VIDEO setup...")
            await self.gemini_ws.send(json.dumps(setup_message))
            
            setup_response = await asyncio.wait_for(self.gemini_ws.recv(), timeout=30.0)
            setup_data = json.loads(setup_response)
            
            logger.info(f"📥 Video setup response: {json.dumps(setup_data)[:500]}")
            
            if "setupComplete" in setup_data:
                logger.info("✅ Gemini Video session established")
                self.is_active = True
                return True
            elif "error" in setup_data:
                error_info = setup_data.get("error", {})
                error_msg = error_info.get("message", str(setup_data))
                logger.error(f"❌ Gemini video setup error: {error_msg}")
                return False
            else:
                logger.error(f"❌ Unexpected video setup response: {setup_data}")
                return False
                
        except asyncio.TimeoutError:
            logger.error("❌ Timeout waiting for Gemini video setup")
            return False
        except Exception as e:
            logger.error(f"❌ Video connection error: {type(e).__name__}: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return False
    
    def _build_video_setup_message(self, model_path: str, use_snake_case: bool) -> dict:
        """Build the setup message for video mode."""
        setup_message = _build_live_setup_message(
            model_path,
            use_snake_case=use_snake_case,
            system_text=None,
            session_handle=self.session_handle,
        )
        system_key = "system_instruction" if use_snake_case else "systemInstruction"
        setup_message["setup"][system_key] = {
            "parts": [{
                "text": _get_system_instruction() + """

ADDITIONAL CONTEXT FOR REAL-TIME VIDEO MODE:
You are receiving CONTINUOUS VIDEO STREAM (1 frame per second) from the student's camera.
This is REAL-TIME video, not static pictures - you can see movement, writing, and changes as they happen.

What you might see:
- Student writing math problems or equations in real-time
- Textbook pages or worksheets they're reading
- Diagrams or drawings they're creating
- Science experiments or equipment they're using
- Their hands writing, erasing, or pointing

IMPORTANT - Real-time video understanding:
1. You receive frames continuously - watch for CHANGES and MOVEMENT
2. If you see them writing, acknowledge it immediately ("I see you're writing...")
3. If they erase something, notice it ("I see you erased that - let's try a different approach")
4. If they point at something, respond to what they're pointing at
5. Track their progress as they work - don't just look at static images
6. Respond to what's happening NOW, not just what you saw 5 seconds ago

When you see their work:
1. Acknowledge what you see in real-time ("I can see you're working on...")
2. Watch for mistakes as they happen and guide them immediately
3. Notice when they're stuck and offer help
4. Celebrate when they get something right
5. Ask them to show specific parts if needed

This is REAL-TIME video - you can see them writing, erasing, and working. Use this to provide immediate, contextual help.
"""
            }]
        }
        return setup_message
    
    async def forward_video_frame(self, frame_base64: str, mime_type: str = "image/jpeg", timestamp: int = None):
        """
        Forward video frame to Gemini IMMEDIATELY for real-time processing.
        No batching - each frame is sent as it arrives for continuous video understanding.
        """
        if not self.gemini_ws or not self.is_active:
            return
            
        try:
            # Send frame immediately for real-time video processing
            # Gemini processes frames continuously to understand the video stream
            message = {
                "realtimeInput": {
                    "mediaChunks": [{
                        "mimeType": mime_type,
                        "data": frame_base64
                    }]
                }
            }
            await self.gemini_ws.send(json.dumps(message))
            logger.debug(f"📹 Video frame forwarded (timestamp: {timestamp})")
            
        except Exception as e:
            logger.error(f"Video forward error: {e}")
    
    async def forward_audio_to_gemini(self, audio_base64: str, billing: Optional[BillingManager] = None, mime_type: Optional[str] = None):
        """Forward audio to Gemini IMMEDIATELY"""
        if not self.gemini_ws or not self.is_active:
            return
            
        try:
            pcm_result = convert_audio_to_pcm(audio_base64, mime_type=mime_type)
            if not pcm_result:
                return
            pcm_base64, pcm_bytes_len = pcm_result

            if billing:
                charged = await billing.charge_for_audio_bytes(pcm_bytes_len)
                if not charged:
                    logger.warning("🛑 Insufficient credits during live video session; closing connection.")
                    try:
                        await self.client_ws.send_json({
                            "type": "error",
                            "message": "Session ended: Insufficient credits to continue."
                        })
                    except Exception:
                        pass
                    await self.client_ws.close()
                    self.is_active = False
                    return

            message = {
                "realtimeInput": {
                    "mediaChunks": [{
                        "mimeType": "audio/pcm;rate=16000",
                        "data": pcm_base64
                    }]
                }
            }
            await self.gemini_ws.send(json.dumps(message))
            logger.debug("📤 Audio forwarded")
            
        except Exception as e:
            logger.error(f"Audio forward error: {e}")
    
    async def receive_and_forward(self):
        """Receive from Gemini and forward to client with AUDIO BUFFERING."""
        if not self.gemini_ws:
            return
            
        try:
            while self.is_active:
                response = await self.gemini_ws.recv()
                data = json.loads(response)
                
                if "serverContent" in data:
                    content = data["serverContent"]
                    
                    if "modelTurn" in content:
                        model_turn = content["modelTurn"]
                        if "parts" in model_turn:
                            for part in model_turn["parts"]:
                                if "inlineData" in part:
                                    inline_data = part["inlineData"]
                                    mime_type = inline_data.get("mimeType", "")
                                    
                                    if mime_type.startswith("audio/") and "pcm" in mime_type.lower():
                                        audio_b64 = inline_data.get("data", "")
                                        if audio_b64:
                                            # Buffer PCM bytes (don't convert yet)
                                            pcm_bytes = base64.b64decode(audio_b64)
                                            async with self.buffer_lock:
                                                self.audio_buffer.append(pcm_bytes)
                                            logger.debug(f"📦 Video: Buffered audio chunk: {len(pcm_bytes)} bytes")
                    
                    if content.get("turnComplete"):
                        # Flush buffered audio as one smooth file
                        await self._flush_audio_buffer()
                        await self.client_ws.send_json({"type": "turnComplete"})
                        logger.info("✅ Video: Turn complete")
                        
                    if content.get("interrupted"):
                        # Clear buffer on interruption
                        async with self.buffer_lock:
                            self.audio_buffer.clear()
                        await self.client_ws.send_json({"type": "interrupted"})
                        logger.info("🎤 Video: Interrupted")
                        
        except Exception as e:
            if self.is_active:
                logger.error(f"Receive error: {e}")
    
    async def _flush_audio_buffer(self):
        """Flush the audio buffer - concatenate all PCM chunks and send as one WAV."""
        async with self.buffer_lock:
            if not self.audio_buffer:
                return
            
            total_chunks = len(self.audio_buffer)
            combined_pcm = b''.join(self.audio_buffer)
            self.audio_buffer.clear()
        
        if len(combined_pcm) == 0:
            return
            
        logger.info(f"🔊 Video: Flushing audio buffer: {total_chunks} chunks, {len(combined_pcm)} bytes")
        
        wav_bytes = convert_pcm_to_wav(combined_pcm, sample_rate=24000)
        wav_b64 = base64.b64encode(wav_bytes).decode('utf-8')
        
        await self.client_ws.send_json({
            "type": "audio",
            "data": wav_b64
        })
        logger.info(f"📢 Video: Sent combined audio: {len(combined_pcm) / 24000 / 2:.1f}s")
    
    async def close(self):
        """Close session"""
        self.is_active = False
        if self.gemini_ws:
            try:
                await self.gemini_ws.close()
            except Exception:
                pass
        logger.info("👋 Video session closed")


# ============================================================================
# WEBRTC (DataChannel) SIGNALLING - NerdX Live
# ============================================================================

_RTC_PEERS = set()


async def _wait_for_ice_gathering_complete(pc, timeout_seconds: float = 4.0) -> None:
    """
    Best-effort wait until ICE gathering is complete so SDP includes candidates.
    This keeps signalling simple (non-trickle ICE).
    """
    try:
        if getattr(pc, "iceGatheringState", None) == "complete":
            return

        loop = asyncio.get_running_loop()
        done = loop.create_future()

        def _check_state() -> None:
            if getattr(pc, "iceGatheringState", None) == "complete" and not done.done():
                done.set_result(True)

        pc.on("icegatheringstatechange", _check_state)
        _check_state()
        await asyncio.wait_for(done, timeout=timeout_seconds)
    except Exception:
        # Non-fatal: some networks take longer; we can still return an answer.
        return


class NerdXLiveRtcOffer(BaseModel):
    sdp: str
    type: str
    user_id: str | None = None
    session_handle: str | None = None


class _RtcJsonClient:
    """
    Minimal adapter to look like a FastAPI WebSocket for TransparentGeminiPipe.
    Uses a WebRTC DataChannel to send JSON payloads.
    """

    def __init__(self, channel, close_callback):
        self._channel = channel
        self._close_callback = close_callback
        self._send_lock = asyncio.Lock()

    async def send_json(self, payload: dict) -> None:
        try:
            data = json.dumps(payload, ensure_ascii=False)
        except Exception:
            return

        async with self._send_lock:
            try:
                if getattr(self._channel, "readyState", None) != "open":
                    return
                self._channel.send(data)
            except Exception:
                return

    async def close(self) -> None:
        try:
            if getattr(self._channel, "readyState", None) == "open":
                self._channel.close()
        except Exception:
            pass

        if self._close_callback:
            try:
                await self._close_callback()
            except Exception:
                pass


class _NerdXLiveRtcSession:
    def __init__(self, pc, *, user_id: str, session_handle: Optional[str], billing: BillingManager):
        self.pc = pc
        self.user_id = user_id
        self.session_handle = session_handle
        self.billing = billing

        self.channel = None
        self.client: Optional[_RtcJsonClient] = None
        self.pipe: Optional[TransparentGeminiPipe] = None
        self.receive_task: Optional[asyncio.Task] = None
        self._start_lock = asyncio.Lock()
        self._is_closed = False

    def attach_channel(self, channel) -> None:
        # Ignore unexpected or duplicate channels.
        if self.channel is not None:
            try:
                channel.close()
            except Exception:
                pass
            return

        self.channel = channel
        logger.info(f"🌐 WebRTC DataChannel connected: {self.user_id} (label={getattr(channel, 'label', '')})")

        channel.on("message", lambda message: asyncio.create_task(self._handle_message(message)))
        channel.on("close", lambda: asyncio.create_task(self.close()))

        asyncio.create_task(self._start_pipe())

    async def _start_pipe(self) -> None:
        if not self.channel:
            return

        async with self._start_lock:
            if self.pipe is not None or self._is_closed:
                return

            self.client = _RtcJsonClient(self.channel, self.close)
            self.pipe = TransparentGeminiPipe(self.client, session_handle=self.session_handle)

            if not await self.pipe.connect_to_gemini():
                await self.client.send_json({
                    "type": "error",
                    "message": self.pipe.last_error or "Failed to connect to AI",
                })
                await self.close()
                return

            await self.client.send_json({
                "type": "ready",
                "message": "Connected to NerdX Live!",
                "playSound": "connected",
            })

            self.receive_task = asyncio.create_task(self.pipe.receive_and_forward())

    async def _handle_message(self, message: object) -> None:
        if self._is_closed:
            return

        # aiortc may deliver str/bytes
        if isinstance(message, (bytes, bytearray)):
            try:
                message = message.decode("utf-8", errors="ignore")
            except Exception:
                return

        if not isinstance(message, str) or not message:
            return

        try:
            data = json.loads(message)
        except Exception:
            return

        msg_type = (data.get("type") or "").strip()
        if not msg_type:
            return

        # Ensure the Gemini pipe is started (lazy) before handling payloads.
        if self.pipe is None:
            await self._start_pipe()
            if self.pipe is None:
                return

        if msg_type == "audio":
            audio_data = data.get("data") or ""
            mime_type = data.get("mimeType") or data.get("mime_type")
            if audio_data:
                await self.pipe.forward_audio_to_gemini(audio_data, billing=self.billing, mime_type=mime_type)
            return

        if msg_type == "interrupt":
            try:
                if self.client:
                    await self.client.send_json({"type": "interrupted"})
                if self.pipe and hasattr(self.pipe, "_clear_audio_buffer"):
                    await self.pipe._clear_audio_buffer()
            except Exception:
                pass
            return

        if msg_type == "end":
            await self.close()
            return

    async def close(self) -> None:
        if self._is_closed:
            return
        self._is_closed = True

        try:
            if self.receive_task:
                self.receive_task.cancel()
        except Exception:
            pass

        try:
            if self.pipe:
                await self.pipe.close()
        except Exception:
            pass

        try:
            await self.pc.close()
        except Exception:
            pass

        try:
            _RTC_PEERS.discard(self.pc)
        except Exception:
            pass


@app.post("/rtc/nerdx-live/offer")
async def nerdx_live_rtc_offer(offer: NerdXLiveRtcOffer):
    """
    WebRTC signalling endpoint for NerdX Live (DataChannel transport).
    Uses non-trickle ICE to keep client implementation simple.
    """
    if RTCPeerConnection is None or RTCSessionDescription is None:
        raise HTTPException(status_code=503, detail="WebRTC is not available on this server (aiortc not installed).")

    user_id = (offer.user_id or "guest_voice").strip() or "guest_voice"
    session_handle = offer.session_handle.strip() if offer.session_handle else None

    billing = BillingManager(user_id, mode="voice")
    if not await billing.verify_balance():
        raise HTTPException(status_code=402, detail="Insufficient credits to start voice session.")

    pc = RTCPeerConnection()
    _RTC_PEERS.add(pc)
    session = _NerdXLiveRtcSession(pc, user_id=user_id, session_handle=session_handle, billing=billing)

    @pc.on("datachannel")
    def _on_datachannel(channel):  # pragma: no cover
        # Expect a single channel from the browser named "nerdx".
        if getattr(channel, "label", "") != "nerdx":
            try:
                channel.close()
            except Exception:
                pass
            return
        session.attach_channel(channel)

    @pc.on("connectionstatechange")
    async def _on_state_change():  # pragma: no cover
        state = getattr(pc, "connectionState", None)
        if state in {"failed", "closed", "disconnected"}:
            await session.close()

    await pc.setRemoteDescription(RTCSessionDescription(sdp=offer.sdp, type=offer.type))
    await pc.setLocalDescription(await pc.createAnswer())
    await _wait_for_ice_gathering_complete(pc)

    local = pc.localDescription
    return {"sdp": local.sdp, "type": local.type}


@app.websocket("/ws/nerdx-live-video")
async def websocket_nerdx_live_video(websocket: WebSocket, user_id: str = "guest_video"):
    """
    WebSocket endpoint for VIDEO + AUDIO tutoring.
    """
    await websocket.accept()
    logger.info(f"🎥 Video client connected (disabled): {user_id}")
    await websocket.send_json({
        "type": "error",
        "message": "Video mode is temporarily disabled. Please use NerdX Live (audio)."
    })
    await websocket.close()
    return


@app.websocket("/ws/nerdx-live")
async def websocket_nerdx_live(
    websocket: WebSocket,
    user_id: str = "guest_voice",
    session_handle: Optional[str] = None,
):
    """
    WebSocket endpoint - TRANSPARENT PIPE to Gemini.
    """
    await websocket.accept()
    logger.info(f"🎧 Client connected: {user_id}")
    
    # --- Billing Check ---
    billing = BillingManager(user_id, mode="voice")
    if not await billing.verify_balance():
        await websocket.send_json({
            "type": "error", 
            "message": "Insufficient credits to start voice session"
        })
        await websocket.close()
        return

    pipe = TransparentGeminiPipe(websocket, session_handle=session_handle)
    
    if not await pipe.connect_to_gemini():
        await websocket.send_json({
            "type": "error",
            "message": pipe.last_error or "Failed to connect to AI"
        })
        await websocket.close()
        return

    await websocket.send_json({
        "type": "ready",
        "message": "Connected to NerdX Live!",
        "playSound": "connected"
    })
    
    # Start receiving from Gemini
    receive_task = asyncio.create_task(pipe.receive_and_forward())
    
    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type", "")
            
            if msg_type == "audio":
                audio_data = data.get("data", "")
                mime_type = data.get("mimeType") or data.get("mime_type")
                if audio_data:
                    logger.info(f"📥 Received audio from client: {len(audio_data)} chars base64")
                    # Forward immediately
                    await pipe.forward_audio_to_gemini(audio_data, billing=billing, mime_type=mime_type)
                else:
                    logger.warning("⚠️ Received audio message with empty data")
            
            elif msg_type == "interrupt":
                # Client barge-in: notify client that interrupt was received
                # With streaming mode, there's no buffer to clear - just acknowledge
                try:
                    await websocket.send_json({"type": "interrupted"})
                except Exception:
                    pass
                    
            elif msg_type == "end":
                logger.info("📴 Client ended session")
                break
                
    except WebSocketDisconnect:
        logger.info("📴 Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        receive_task.cancel()
        await pipe.close()


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", os.getenv("VOICE_AGENT_PORT", "8001")))
    logger.info(f"🚀 Starting NerdX Live on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
