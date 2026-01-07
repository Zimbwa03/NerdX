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
from typing import Optional
from contextlib import asynccontextmanager

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

# Gemini API configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
# Gemini Live API model - try multiple options
# gemini-2.0-flash-live-001 is for real-time voice/video
# gemini-2.0-flash-exp is experimental multimodal
GEMINI_MODEL = os.getenv('GEMINI_LIVE_MODEL', 'gemini-2.0-flash-exp')

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
    logger.info("🚀 NerdX Live Voice Agent starting (TRANSPARENT PIPE mode)...")
    if not GEMINI_API_KEY:
        logger.error("❌ GEMINI_API_KEY not set!")
    else:
        logger.info("✅ Gemini API key configured")
    yield
    logger.info("👋 NerdX Live shutting down...")


# Create FastAPI app
app = FastAPI(
    title="NerdX Live Voice Agent",
    description="Transparent pipe to Gemini Live API - minimal latency",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TransparentGeminiPipe:
    """
    TRANSPARENT PIPE: Forwards messages with zero buffering.
    Only converts audio formats at the boundary - no processing in between.
    """
    
    def __init__(self, client_ws: WebSocket):
        self.client_ws = client_ws
        self.gemini_ws: Optional[any] = None
        self.is_active = False
        
    async def connect_to_gemini(self) -> bool:
        """Connect to Gemini Live API"""
        if not GEMINI_API_KEY:
            logger.error("❌ GEMINI_API_KEY not set in environment!")
            return False
            
        try:
            import websockets
            
            gemini_url = (
                f"wss://generativelanguage.googleapis.com/ws/"
                f"google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent"
                f"?key={GEMINI_API_KEY}"
            )
            
            logger.info(f"🔗 Connecting to Gemini Live API (model: {GEMINI_MODEL})...")
            logger.info(f"🔗 URL: wss://generativelanguage.googleapis.com/ws/...")
            
            self.gemini_ws = await websockets.connect(
                gemini_url,
                additional_headers={"Content-Type": "application/json"},
                ping_interval=30,
                ping_timeout=10,
            )
            
            # Send setup message
            setup_message = {
                "setup": {
                    "model": f"models/{GEMINI_MODEL}",
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
            
            logger.info(f"📤 Sending setup message for model: models/{GEMINI_MODEL}")
            await self.gemini_ws.send(json.dumps(setup_message))
            
            # Wait for setup response with timeout
            setup_response = await asyncio.wait_for(
                self.gemini_ws.recv(),
                timeout=30.0
            )
            setup_data = json.loads(setup_response)
            
            logger.info(f"📥 Setup response: {json.dumps(setup_data)[:500]}")
            
            if "setupComplete" in setup_data:
                logger.info("✅ Gemini Live session established successfully")
                self.is_active = True
                return True
            elif "error" in setup_data:
                error_info = setup_data.get("error", {})
                error_msg = error_info.get("message", str(setup_data))
                logger.error(f"❌ Gemini setup error: {error_msg}")
                return False
            else:
                logger.error(f"❌ Unexpected setup response: {setup_data}")
                return False
                
        except asyncio.TimeoutError:
            logger.error("❌ Timeout waiting for Gemini setup response")
            return False
        except Exception as e:
            logger.error(f"❌ Connection error: {type(e).__name__}: {e}")
            import traceback
            logger.error(traceback.format_exc())
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
    """
    
    def __init__(self, client_ws: WebSocket):
        self.client_ws = client_ws
        self.gemini_ws: Optional[any] = None
        self.is_active = False
        
    async def connect_to_gemini(self) -> bool:
        """Connect to Gemini Live API with video support"""
        if not GEMINI_API_KEY:
            logger.error("❌ GEMINI_API_KEY not set in environment!")
            return False
            
        try:
            import websockets
            
            gemini_url = (
                f"wss://generativelanguage.googleapis.com/ws/"
                f"google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent"
                f"?key={GEMINI_API_KEY}"
            )
            
            logger.info(f"🔗 Connecting to Gemini Live API VIDEO (model: {GEMINI_MODEL})...")
            self.gemini_ws = await websockets.connect(
                gemini_url,
                additional_headers={"Content-Type": "application/json"},
                ping_interval=30,
                ping_timeout=10,
            )
            
            # Setup with video + audio capabilities
            setup_message = {
                "setup": {
                    "model": f"models/{GEMINI_MODEL}",
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
            
            logger.info(f"📤 Sending VIDEO setup for model: models/{GEMINI_MODEL}")
            await self.gemini_ws.send(json.dumps(setup_message))
            
            setup_response = await asyncio.wait_for(
                self.gemini_ws.recv(),
                timeout=30.0
            )
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
async def websocket_nerdx_live_video(websocket: WebSocket):
    """
    WebSocket endpoint for VIDEO + AUDIO tutoring.
    
    Tutor can SEE what the student is showing (homework, equations, diagrams).
    
    Protocol:
    - Client sends: {"type": "video", "data": "<base64 jpeg>", "mimeType": "image/jpeg"}
    - Client sends: {"type": "audio", "data": "<base64 m4a audio>"}
    - Server sends: {"type": "audio", "data": "<base64 wav audio>"}
    - Server sends: {"type": "turnComplete"}
    """
    await websocket.accept()
    logger.info("🎥 Video client connected")
    
    pipe = TransparentGeminiVideoPipe(websocket)
    
    if not await pipe.connect_to_gemini():
        await websocket.send_json({
            "type": "error",
            "message": "Failed to connect to AI"
        })
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
        receive_task.cancel()
        await pipe.close()


@app.websocket("/ws/nerdx-live")
async def websocket_nerdx_live(websocket: WebSocket):
    """
    WebSocket endpoint - TRANSPARENT PIPE to Gemini.
    
    Architecture:
    - Client ←→ This Server ←→ Gemini
    - Server ONLY converts formats at boundaries
    - NO buffering, batching, or processing delays
    - All jitter handling is client-side
    """
    await websocket.accept()
    logger.info("🎧 Client connected")
    
    pipe = TransparentGeminiPipe(websocket)
    
    if not await pipe.connect_to_gemini():
        await websocket.send_json({
            "type": "error",
            "message": "Failed to connect to AI"
        })
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
        receive_task.cancel()
        await pipe.close()


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", os.getenv("VOICE_AGENT_PORT", "8001")))
    logger.info(f"🚀 Starting NerdX Live on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
