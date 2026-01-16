#!/usr/bin/env python3
"""
NerdX Live - Real-Time Voice AI Tutor
Optimized Architecture: Server as TRANSPARENT PIPE (Control Plane)

DESIGN PRINCIPLES:
- Server handles security (API key) and format conversion ONLY
- NO buffering, batching, or artificial delays
- Audio flows through as fast as possible
- All jitter handling happens on the client
"""

import os
import json
import base64
import asyncio
import logging
import struct
import io
import time
from typing import Optional
from contextlib import asynccontextmanager

# Add parent directory to sys.path to allow importing database modules
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.external_db import get_user_credits, deduct_credits, get_user_stats
from config import Config

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

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

# Prefer Vertex AI (better quality, your service account has access)
USE_VERTEX_AI = os.getenv('GOOGLE_GENAI_USE_VERTEXAI', 'True').lower() == 'true'
GOOGLE_CLOUD_PROJECT = os.getenv('GOOGLE_CLOUD_PROJECT', 'gen-lang-client-0303273462')
GOOGLE_CLOUD_LOCATION = os.getenv('GOOGLE_CLOUD_LOCATION', 'us-central1')
GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 'credentials/vertex_ai_service_account.json')

# Gemini API fallback
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Model selection - Gemini 2.5 Flash is best for real-time audio
# gemini-2.5-flash supports native audio processing
GEMINI_MODEL = os.getenv('GEMINI_LIVE_MODEL', 'gemini-2.5-flash-preview-native-audio-dialog')

# Fallback model if native audio dialog is not available
GEMINI_MODEL_FALLBACK = 'gemini-2.0-flash-exp'

# NerdX System Instruction
NERDX_SYSTEM_INSTRUCTION = """
You are NerdX, a friendly, encouraging O-Level and A-Level tutor in Zimbabwe.

1. Language: Speak English by default. If the student speaks Shona or struggles with English, switch to Shona immediately to help them understand better.

2. Tone: Be patient, energetic, and supportive. Celebrate small wins. Use phrases like "Well done!", "Great thinking!", "You're getting it!".

3. Method: Don't lecture. Ask guiding questions to help students discover answers themselves. When they make mistakes, gently redirect with hints rather than giving the answer.

4. Safety: If asked about non-educational topics (relationships, violence, inappropriate content), gently steer back to schoolwork. Say something like "Let's get back to your studies - what subject are you working on?"

5. Expertise: You specialize in ZIMSEC curriculum subjects including:
   - Mathematics (O-Level and A-Level)
   - Combined Science (Biology, Chemistry, Physics)
   - English Language and Literature
   - History, Geography, and other humanities

6. Interaction Style: Keep responses conversational and brief. Ask one question at a time. Wait for the student to respond before continuing.
"""


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


def convert_m4a_to_pcm(m4a_base64: str) -> Optional[str]:
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
        return pcm_base64
        
    except Exception as e:
        logger.error(f"❌ Audio conversion failed: {e}", exc_info=True)
        return None  # Don't send invalid audio to Gemini


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    logger.info("🚀 NerdX Live Voice Agent starting (VERTEX AI + TRANSPARENT PIPE mode)...")
    logger.info(f"📍 Vertex AI Enabled: {USE_VERTEX_AI}")
    logger.info(f"📍 Project: {GOOGLE_CLOUD_PROJECT}")
    logger.info(f"📍 Location: {GOOGLE_CLOUD_LOCATION}")
    logger.info(f"📍 Model: {GEMINI_MODEL}")
    
    if USE_VERTEX_AI:
        creds_path = GOOGLE_APPLICATION_CREDENTIALS
        if os.path.exists(creds_path):
            logger.info(f"✅ Vertex AI credentials found: {creds_path}")
        else:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            full_path = os.path.join(base_dir, creds_path)
            if os.path.exists(full_path):
                logger.info(f"✅ Vertex AI credentials found: {full_path}")
            else:
                logger.warning(f"⚠️ Vertex AI credentials not found at {creds_path} or {full_path}")
    
    if GEMINI_API_KEY:
        logger.info("✅ Gemini API key configured (fallback)")
    else:
        logger.warning("⚠️ No Gemini API key (fallback unavailable)")
    
    yield
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
    Handles real-time credit deduction for voice sessions.
    Charges user every minute.
    """
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.cost_per_minute = 3  # 3 credits per minute
        self.is_active = True
        
    async def verify_balance(self) -> bool:
        """Check if user has enough credits to start"""
        try:
            # Run blocking DB call in thread
            current_credits = await asyncio.to_thread(get_user_credits, self.user_id)
            logger.info(f"💰 Checking balance for {self.user_id}: {current_credits} (Required: {self.cost_per_minute})")
            return current_credits >= self.cost_per_minute
        except Exception as e:
            logger.error(f"❌ Balance check failed: {e}")
            return False  # Fail safe

    async def deduct_for_minute(self) -> bool:
        """Deduct credits for the next minute of usage"""
        try:
            success = await asyncio.to_thread(
                deduct_credits, 
                self.user_id, 
                self.cost_per_minute, 
                'voice_chat', 
                'Voice Chat (1 min)'
            )
            if success:
                logger.info(f"💸 Deducted {self.cost_per_minute} credits from {self.user_id} for voice chat")
            else:
                logger.warning(f"⚠️ Failed to deduct credits for {self.user_id}")
            return success
        except Exception as e:
            logger.error(f"❌ Deduction error: {e}")
            return False

async def run_billing_scheduler(billing: BillingManager, websocket: WebSocket):
    """Run periodic billing every 60 seconds"""
    try:
        logger.info(f"⏱️ Starting billing scheduler for {billing.user_id}")
        while True:
            # Charge immediately for the upcoming minute (pre-paid for the minute)
            if not await billing.deduct_for_minute():
                logger.warning(f"🛑 Insufficient credits for {billing.user_id}, closing session.")
                try:
                    await websocket.send_json({
                        "type": "error", 
                        "message": "Session ended: Insufficient credits to continue (3 credits/min required)"
                    })
                    await websocket.close()
                except:
                    pass
                break
            
            # Wait 60 seconds before next charge
            await asyncio.sleep(60)
            
    except asyncio.CancelledError:
        logger.info(f"Billing scheduler cancelled for {billing.user_id}")
    except Exception as e:
        logger.error(f"Billing scheduler error: {e}")


class TransparentGeminiPipe:
    """
    TRANSPARENT PIPE: Forwards messages with zero buffering.
    Supports both Vertex AI (preferred) and regular Gemini API.
    """
    
    def __init__(self, client_ws: WebSocket):
        self.client_ws = client_ws
        self.gemini_ws: Optional[any] = None
        self.is_active = False
        self.using_vertex_ai = False
    
    async def _get_vertex_ai_token(self) -> Optional[str]:
        """Get OAuth2 access token for Vertex AI using service account."""
        try:
            from google.oauth2 import service_account
            from google.auth.transport import requests as google_requests
            
            # Check for credentials file
            creds_path = GOOGLE_APPLICATION_CREDENTIALS
            if not os.path.exists(creds_path):
                # Try relative to script directory
                base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                creds_path = os.path.join(base_dir, GOOGLE_APPLICATION_CREDENTIALS)
            
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
            logger.warning("⚠️ Vertex AI connection failed, falling back to regular Gemini API")
        
        # Fallback to regular Gemini API
        if GEMINI_API_KEY:
            connected = await self._connect_gemini_api()
            if connected:
                return True
        
        logger.error("❌ All connection methods failed")
        return False
    
    async def _connect_vertex_ai(self) -> bool:
        """Connect to Vertex AI Gemini Live API with OAuth2."""
        try:
            import websockets
            
            # Get access token
            token = await asyncio.to_thread(self._get_vertex_ai_token_sync)
            if not token:
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
            
            # Send setup message for Vertex AI
            setup_message = {
                "setup": {
                    "model": f"projects/{GOOGLE_CLOUD_PROJECT}/locations/{GOOGLE_CLOUD_LOCATION}/publishers/google/models/{GEMINI_MODEL}",
                    "generationConfig": {
                        "responseModalities": ["AUDIO"],
                        "speechConfig": {
                            "voiceConfig": {
                                "prebuiltVoiceConfig": {
                                    "voiceName": "Aoede"  # Natural HD voice
                                }
                            }
                        }
                    },
                    "systemInstruction": {
                        "parts": [{"text": NERDX_SYSTEM_INSTRUCTION}]
                    },
                    "tools": []
                }
            }
            
            logger.info(f"📤 Sending Vertex AI setup...")
            await self.gemini_ws.send(json.dumps(setup_message))
            
            # Wait for setup response
            setup_response = await asyncio.wait_for(
                self.gemini_ws.recv(),
                timeout=30.0
            )
            setup_data = json.loads(setup_response)
            
            logger.info(f"📥 Vertex AI setup response: {json.dumps(setup_data)[:500]}")
            
            if "setupComplete" in setup_data:
                logger.info("✅ Vertex AI Live session established successfully")
                self.is_active = True
                return True
            elif "error" in setup_data:
                error_info = setup_data.get("error", {})
                error_msg = error_info.get("message", str(setup_data))
                logger.error(f"❌ Vertex AI setup error: {error_msg}")
                return False
            else:
                logger.error(f"❌ Unexpected Vertex AI response: {setup_data}")
                return False
                
        except asyncio.TimeoutError:
            logger.error("❌ Timeout waiting for Vertex AI setup")
            return False
        except Exception as e:
            logger.error(f"❌ Vertex AI connection error: {type(e).__name__}: {e}")
            return False
    
    def _get_vertex_ai_token_sync(self) -> Optional[str]:
        """Synchronous version for use with asyncio.to_thread."""
        try:
            from google.oauth2 import service_account
            from google.auth.transport import requests as google_requests
            
            creds_path = GOOGLE_APPLICATION_CREDENTIALS
            if not os.path.exists(creds_path):
                base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                creds_path = os.path.join(base_dir, GOOGLE_APPLICATION_CREDENTIALS)
            
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
        if not GEMINI_API_KEY:
            logger.error("❌ GEMINI_API_KEY not set!")
            return False
            
        try:
            import websockets
            
            gemini_url = (
                f"wss://generativelanguage.googleapis.com/ws/"
                f"google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent"
                f"?key={GEMINI_API_KEY}"
            )
            
            # Use fallback model for regular API
            model_name = GEMINI_MODEL_FALLBACK
            logger.info(f"🔗 Connecting to Gemini API (model: {model_name})...")
            
            self.gemini_ws = await websockets.connect(
                gemini_url,
                additional_headers={"Content-Type": "application/json"},
                ping_interval=30,
                ping_timeout=10,
            )
            
            # Send setup message
            setup_message = {
                "setup": {
                    "model": f"models/{model_name}",
                    "generationConfig": {
                        "responseModalities": ["AUDIO"],
                        "speechConfig": {
                            "voiceConfig": {
                                "prebuiltVoiceConfig": {
                                    "voiceName": "Aoede"
                                }
                            }
                        }
                    },
                    "systemInstruction": {
                        "parts": [{"text": NERDX_SYSTEM_INSTRUCTION}]
                    },
                    "tools": []
                }
            }
            
            logger.info(f"📤 Sending Gemini API setup...")
            await self.gemini_ws.send(json.dumps(setup_message))
            
            setup_response = await asyncio.wait_for(
                self.gemini_ws.recv(),
                timeout=30.0
            )
            setup_data = json.loads(setup_response)
            
            logger.info(f"📥 Gemini API setup response: {json.dumps(setup_data)[:500]}")
            
            if "setupComplete" in setup_data:
                logger.info("✅ Gemini API session established")
                self.is_active = True
                return True
            elif "error" in setup_data:
                error_info = setup_data.get("error", {})
                error_msg = error_info.get("message", str(setup_data))
                logger.error(f"❌ Gemini API setup error: {error_msg}")
                return False
            else:
                logger.error(f"❌ Unexpected response: {setup_data}")
                return False
                
        except asyncio.TimeoutError:
            logger.error("❌ Timeout waiting for Gemini API setup")
            return False
        except Exception as e:
            logger.error(f"❌ Gemini API connection error: {type(e).__name__}: {e}")
            return False
    
    async def forward_audio_to_gemini(self, audio_base64: str):
        """
        Forward audio to Gemini IMMEDIATELY - no buffering.
        Only converts format, then sends right away.
        """
        if not self.gemini_ws or not self.is_active:
            logger.warning("⚠️ Cannot forward audio: WebSocket not ready or inactive")
            return
            
        try:
            logger.info(f"🔄 Converting audio: {len(audio_base64)} chars base64")
            # Convert M4A to PCM (boundary conversion)
            pcm_base64 = convert_m4a_to_pcm(audio_base64)
            if not pcm_base64:
                logger.error("❌ Audio conversion returned empty - cannot send to Gemini")
                # Notify client of conversion failure
                try:
                    await self.client_ws.send_json({
                        "type": "error",
                        "message": "Audio conversion failed"
                    })
                except:
                    pass
                return
            
            logger.info(f"✅ Audio converted: {len(pcm_base64)} chars PCM base64")
            
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
    
    async def receive_and_forward(self):
        """
        Receive from Gemini and forward to client IMMEDIATELY.
        No batching, no buffering - pure pipe.
        """
        if not self.gemini_ws:
            logger.warning("⚠️ Cannot receive: Gemini WebSocket not connected")
            return
            
        try:
            logger.info("👂 Starting to listen for Gemini responses...")
            while self.is_active:
                response = await self.gemini_ws.recv()
                data = json.loads(response)
                
                logger.debug(f"📥 Received from Gemini: {list(data.keys())}")
                
                if "serverContent" in data:
                    content = data["serverContent"]
                    
                    # Forward audio immediately
                    if "modelTurn" in content:
                        model_turn = content["modelTurn"]
                        logger.info("🎤 Model turn received - processing audio response")
                        if "parts" in model_turn:
                            for part in model_turn["parts"]:
                                if "inlineData" in part:
                                    inline_data = part["inlineData"]
                                    mime_type = inline_data.get("mimeType", "")
                                    
                                    if mime_type.startswith("audio/") and "pcm" in mime_type.lower():
                                        audio_b64 = inline_data.get("data", "")
                                        if audio_b64:
                                            logger.info(f"🔄 Converting PCM to WAV: {len(audio_b64)} chars")
                                            # Convert PCM to WAV (boundary conversion)
                                            pcm_bytes = base64.b64decode(audio_b64)
                                            wav_bytes = convert_pcm_to_wav(pcm_bytes, sample_rate=24000)
                                            wav_b64 = base64.b64encode(wav_bytes).decode('utf-8')
                                            
                                            # Forward IMMEDIATELY - no delay
                                            await self.client_ws.send_json({
                                                "type": "audio",
                                                "data": wav_b64
                                            })
                                            logger.info(f"📢 Audio forwarded to client: {len(wav_b64)} chars WAV base64")
                    
                    # Forward control messages immediately
                    if content.get("turnComplete"):
                        await self.client_ws.send_json({"type": "turnComplete"})
                        logger.info("✅ Turn complete - sent to client")
                        
                    if content.get("interrupted"):
                        await self.client_ws.send_json({"type": "interrupted"})
                        logger.info("🎤 Interrupted - sent to client")
                else:
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
            except:
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
        "api_configured": bool(GEMINI_API_KEY)
    }


@app.get("/health")
async def health():
    """Health check for monitoring"""
    return {"status": "healthy", "mode": "transparent_pipe"}


class TransparentGeminiVideoPipe:
    """
    TRANSPARENT PIPE for Video + Audio.
    Handles both video frames and audio - tutor can SEE what student is working on.
    Supports both Vertex AI (preferred) and regular Gemini API.
    """
    
    def __init__(self, client_ws: WebSocket):
        self.client_ws = client_ws
        self.gemini_ws: Optional[any] = None
        self.is_active = False
        self.using_vertex_ai = False
        
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
            logger.warning("⚠️ Vertex AI video connection failed, falling back to regular Gemini API")
        
        # Fallback to regular Gemini API
        if GEMINI_API_KEY:
            connected = await self._connect_gemini_api_video()
            if connected:
                return True
        
        logger.error("❌ All video connection methods failed")
        return False
    
    async def _connect_vertex_ai_video(self) -> bool:
        """Connect to Vertex AI Gemini Live API with OAuth2 for video."""
        try:
            import websockets
            
            # Get access token
            token = await asyncio.to_thread(self._get_vertex_ai_token_sync)
            if not token:
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
                model_path=f"projects/{GOOGLE_CLOUD_PROJECT}/locations/{GOOGLE_CLOUD_LOCATION}/publishers/google/models/{GEMINI_MODEL}"
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
            logger.error("❌ Timeout waiting for Vertex AI video setup")
            return False
        except Exception as e:
            logger.error(f"❌ Vertex AI video connection error: {type(e).__name__}: {e}")
            return False
    
    def _get_vertex_ai_token_sync(self) -> Optional[str]:
        """Synchronous version for use with asyncio.to_thread."""
        try:
            from google.oauth2 import service_account
            from google.auth.transport import requests as google_requests
            
            creds_path = GOOGLE_APPLICATION_CREDENTIALS
            if not os.path.exists(creds_path):
                base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                creds_path = os.path.join(base_dir, GOOGLE_APPLICATION_CREDENTIALS)
            
            if not os.path.exists(creds_path):
                # Try inline credentials
                service_account_json = os.environ.get('GOOGLE_SERVICE_ACCOUNT_JSON')
                if service_account_json:
                    import tempfile
                    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
                        f.write(service_account_json)
                        creds_path = f.name
                else:
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
            setup_message = self._build_video_setup_message(model_path=f"models/{GEMINI_MODEL}")
            
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
    
    def _build_video_setup_message(self, model_path: str) -> dict:
        """Build the setup message for video mode."""
        return {
            "setup": {
                "model": model_path,
                "generationConfig": {
                    "responseModalities": ["AUDIO"],
                    "speechConfig": {
                        "voiceConfig": {
                            "prebuiltVoiceConfig": {
                                "voiceName": "Aoede"
                            }
                        }
                    }
                },
                "systemInstruction": {
                    "parts": [{
                        "text": NERDX_SYSTEM_INSTRUCTION + """

ADDITIONAL CONTEXT FOR REAL-TIME VIDEO MODE:
You are receiving CONTINUOUS VIDEO STREAM (10 frames per second) from the student's camera.
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
                },
                "tools": []
            }
        }
    
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
    
    async def forward_audio_to_gemini(self, audio_base64: str):
        """Forward audio to Gemini IMMEDIATELY"""
        if not self.gemini_ws or not self.is_active:
            return
            
        try:
            pcm_base64 = convert_m4a_to_pcm(audio_base64)
            if not pcm_base64:
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
        """Receive from Gemini and forward to client"""
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
                                            pcm_bytes = base64.b64decode(audio_b64)
                                            wav_bytes = convert_pcm_to_wav(pcm_bytes, sample_rate=24000)
                                            wav_b64 = base64.b64encode(wav_bytes).decode('utf-8')
                                            
                                            await self.client_ws.send_json({
                                                "type": "audio",
                                                "data": wav_b64
                                            })
                    
                    if content.get("turnComplete"):
                        await self.client_ws.send_json({"type": "turnComplete"})
                        logger.info("✅ Turn complete")
                        
                    if content.get("interrupted"):
                        await self.client_ws.send_json({"type": "interrupted"})
                        logger.info("🎤 Interrupted")
                        
        except Exception as e:
            if self.is_active:
                logger.error(f"Receive error: {e}")
    
    async def close(self):
        """Close session"""
        self.is_active = False
        if self.gemini_ws:
            try:
                await self.gemini_ws.close()
            except:
                pass
        logger.info("👋 Video session closed")


@app.websocket("/ws/nerdx-live-video")
async def websocket_nerdx_live_video(websocket: WebSocket, user_id: str = "guest_video"):
    """
    WebSocket endpoint for VIDEO + AUDIO tutoring.
    """
    await websocket.accept()
    logger.info(f"🎥 Video client connected: {user_id}")
    
    # --- Billing Check ---
    billing = BillingManager(user_id)
    if not await billing.verify_balance():
        await websocket.send_json({
            "type": "error", 
            "message": "Insufficient credits to start video session (3 credits/min)"
        })
        await websocket.close()
        return

    # Start billing schedule
    billing_task = asyncio.create_task(run_billing_scheduler(billing, websocket))
    # ---------------------
    
    pipe = TransparentGeminiVideoPipe(websocket)
    
    if not await pipe.connect_to_gemini():
        await websocket.send_json({
            "type": "error",
            "message": "Failed to connect to AI"
        })
        billing_task.cancel()
        await websocket.close()
        return
    
    await websocket.send_json({
        "type": "ready",
        "message": "Connected to NerdX Live Video!"
    })
    
    receive_task = asyncio.create_task(pipe.receive_and_forward())
    
    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type", "")
            
            if msg_type == "video":
                # Forward video frame immediately for real-time processing
                frame_data = data.get("data", "")
                mime_type = data.get("mimeType", "image/jpeg")
                timestamp = data.get("timestamp")
                if frame_data:
                    # Send immediately - no batching for real-time video
                    await pipe.forward_video_frame(frame_data, mime_type, timestamp)
                    
            elif msg_type == "audio":
                # Forward audio
                audio_data = data.get("data", "")
                if audio_data:
                    await pipe.forward_audio_to_gemini(audio_data)
                    
            elif msg_type == "end":
                logger.info("📴 Client ended video session")
                break
                
    except WebSocketDisconnect:
        logger.info("📴 Video client disconnected")
    except Exception as e:
        logger.error(f"Video WebSocket error: {e}")
    finally:
        billing_task.cancel()
        receive_task.cancel()
        await pipe.close()


@app.websocket("/ws/nerdx-live")
async def websocket_nerdx_live(websocket: WebSocket, user_id: str = "guest_voice"):
    """
    WebSocket endpoint - TRANSPARENT PIPE to Gemini.
    """
    await websocket.accept()
    logger.info(f"🎧 Client connected: {user_id}")
    
    # --- Billing Check ---
    billing = BillingManager(user_id)
    if not await billing.verify_balance():
        await websocket.send_json({
            "type": "error", 
            "message": "Insufficient credits to start voice session (3 credits/min)"
        })
        await websocket.close()
        return

    # Start billing schedule
    billing_task = asyncio.create_task(run_billing_scheduler(billing, websocket))
    # ---------------------
    
    pipe = TransparentGeminiPipe(websocket)
    
    if not await pipe.connect_to_gemini():
        await websocket.send_json({
            "type": "error",
            "message": "Failed to connect to AI"
        })
        billing_task.cancel()
        await websocket.close()
        return
    
    await websocket.send_json({
        "type": "ready",
        "message": "Connected to NerdX Live!"
    })
    
    # Start receiving from Gemini
    receive_task = asyncio.create_task(pipe.receive_and_forward())
    
    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type", "")
            
            if msg_type == "audio":
                audio_data = data.get("data", "")
                if audio_data:
                    logger.info(f"📥 Received audio from client: {len(audio_data)} chars base64")
                    # Forward immediately
                    await pipe.forward_audio_to_gemini(audio_data)
                else:
                    logger.warning("⚠️ Received audio message with empty data")
                    
            elif msg_type == "end":
                logger.info("📴 Client ended session")
                break
                
    except WebSocketDisconnect:
        logger.info("📴 Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        billing_task.cancel()
        receive_task.cancel()
        await pipe.close()


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", os.getenv("VOICE_AGENT_PORT", "8001")))
    logger.info(f"🚀 Starting NerdX Live on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
