#!/usr/bin/env python3
"""
NerdX Live - Real-Time Voice AI Tutor
Uses Gemini Multimodal Live API via WebSockets for voice-to-voice interaction.
"""

import os
import json
import base64
import asyncio
import logging
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

import struct
import io

def convert_pcm_to_wav(pcm_base64: str, sample_rate: int = 24000, channels: int = 1, sample_width: int = 2) -> str:
    """
    Convert raw PCM audio to WAV format for mobile playback.
    Gemini returns audio/pcm at 24kHz (output) or 16kHz (input) mono 16-bit.
    Returns base64-encoded WAV data.
    """
    try:
        pcm_data = base64.b64decode(pcm_base64)
        
        # Create WAV file in memory
        wav_buffer = io.BytesIO()
        
        # WAV header parameters
        byte_rate = sample_rate * channels * sample_width
        block_align = channels * sample_width
        data_size = len(pcm_data)
        
        # Write WAV header (44 bytes)
        wav_buffer.write(b'RIFF')
        wav_buffer.write(struct.pack('<I', 36 + data_size))  # File size - 8
        wav_buffer.write(b'WAVE')
        wav_buffer.write(b'fmt ')
        wav_buffer.write(struct.pack('<I', 16))  # Subchunk1 size (PCM)
        wav_buffer.write(struct.pack('<H', 1))   # Audio format (1 = PCM)
        wav_buffer.write(struct.pack('<H', channels))
        wav_buffer.write(struct.pack('<I', sample_rate))
        wav_buffer.write(struct.pack('<I', byte_rate))
        wav_buffer.write(struct.pack('<H', block_align))
        wav_buffer.write(struct.pack('<H', sample_width * 8))  # Bits per sample
        wav_buffer.write(b'data')
        wav_buffer.write(struct.pack('<I', data_size))
        wav_buffer.write(pcm_data)
        
        # Get WAV bytes and encode to base64
        wav_bytes = wav_buffer.getvalue()
        wav_base64 = base64.b64encode(wav_bytes).decode('utf-8')
        
        return wav_base64
    except Exception as e:
        logger.error(f"PCM to WAV conversion failed: {e}")
        return pcm_base64  # Return original on error

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Gemini API configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
# Use the Gemini 2.0 Flash model which supports the Live API
GEMINI_MODEL = "gemini-2.0-flash-exp"

# NerdX System Instruction - Zimbabwe O-Level/A-Level Tutor
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    logger.info("🚀 NerdX Live Voice Agent starting up...")
    if not GEMINI_API_KEY:
        logger.error("❌ GEMINI_API_KEY not set in environment!")
    else:
        logger.info("✅ Gemini API key configured")
    yield
    logger.info("👋 NerdX Live Voice Agent shutting down...")


def convert_m4a_to_pcm(m4a_base64: str) -> str:
    """
    Convert M4A/AAC audio to raw PCM for Gemini Live API.
    Returns base64-encoded 16-bit little-endian PCM at 16kHz mono.
    """
    try:
        from pydub import AudioSegment
        import io
        
        # Try to set ffmpeg path from imageio-ffmpeg (bundled binary for cloud deployments)
        try:
            import imageio_ffmpeg
            ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
            AudioSegment.converter = ffmpeg_path
            logger.info(f"✅ Using ffmpeg from imageio: {ffmpeg_path}")
        except ImportError:
            logger.info("imageio-ffmpeg not available, using system ffmpeg")
        except Exception as e:
            logger.warning(f"imageio-ffmpeg error: {e}, using system ffmpeg")
        
        # Decode base64 to bytes
        m4a_bytes = base64.b64decode(m4a_base64)
        
        # Load M4A audio
        audio = AudioSegment.from_file(io.BytesIO(m4a_bytes), format="m4a")
        
        # Convert to 16kHz mono 16-bit PCM
        audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
        
        # Export as raw PCM
        pcm_bytes = audio.raw_data
        
        # Encode back to base64
        pcm_base64 = base64.b64encode(pcm_bytes).decode('utf-8')
        logger.info(f"🔄 Converted M4A ({len(m4a_base64)} chars) to PCM ({len(pcm_base64)} chars)")
        return pcm_base64
        
    except ImportError as e:
        logger.warning(f"pydub not installed: {e}")
        return m4a_base64
    except Exception as e:
        logger.error(f"Audio conversion failed: {e}")
        return m4a_base64


# Create FastAPI app
app = FastAPI(
    title="NerdX Live Voice Agent",
    description="Real-time voice-to-voice AI tutor using Gemini Multimodal Live API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GeminiLiveSession:
    """Manages a real-time voice session with Gemini"""
    
    def __init__(self, websocket: WebSocket):
        self.client_ws = websocket
        self.gemini_ws: Optional[any] = None
        self.is_active = False
        
    async def connect_to_gemini(self):
        """Establish connection to Gemini Live API"""
        try:
            import websockets
            
            # Gemini Multimodal Live WebSocket endpoint
            gemini_url = (
                f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent"
                f"?key={GEMINI_API_KEY}"
            )
            
            logger.info("🔗 Connecting to Gemini Live API...")
            self.gemini_ws = await websockets.connect(
                gemini_url,
                additional_headers={
                    "Content-Type": "application/json"
                }
            )
            
            # Send initial setup message
            setup_message = {
                "setup": {
                    "model": f"models/{GEMINI_MODEL}",
                    "generationConfig": {
                        "responseModalities": ["AUDIO"],
                        "speechConfig": {
                            "voiceConfig": {
                                "prebuiltVoiceConfig": {
                                    "voiceName": "Aoede"  # Warm, friendly voice
                                }
                            }
                        }
                    },
                    "systemInstruction": {
                        "parts": [
                            {"text": NERDX_SYSTEM_INSTRUCTION}
                        ]
                    },
                    "tools": []
                }
            }
            
            await self.gemini_ws.send(json.dumps(setup_message))
            
            # Wait for setup complete response
            setup_response = await self.gemini_ws.recv()
            setup_data = json.loads(setup_response)
            
            if "setupComplete" in setup_data:
                logger.info("✅ Gemini Live session established")
                self.is_active = True
                return True
            else:
                logger.error(f"❌ Setup failed: {setup_data}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Failed to connect to Gemini: {e}")
            return False
    
    async def send_audio_chunk(self, audio_base64: str):
        """Send audio chunk to Gemini (converts M4A to PCM first)"""
        if not self.gemini_ws or not self.is_active:
            return
        
        if not audio_base64:
            logger.warning("Empty audio chunk received, skipping")
            return
            
        try:
            # Convert M4A to PCM (Gemini Live API only accepts raw PCM)
            pcm_base64 = convert_m4a_to_pcm(audio_base64)
            
            logger.info(f"📤 Sending PCM audio to Gemini, size: {len(pcm_base64)} chars")
            message = {
                "realtimeInput": {
                    "mediaChunks": [
                        {
                            "mimeType": "audio/pcm;rate=16000",  # Raw PCM 16kHz mono
                            "data": pcm_base64
                        }
                    ]
                }
            }
            await self.gemini_ws.send(json.dumps(message))
            logger.info("✅ Audio sent to Gemini")
        except Exception as e:
            logger.error(f"Error sending audio to Gemini: {e}")
    
    async def receive_from_gemini(self):
        """Receive and forward responses from Gemini to client"""
        if not self.gemini_ws:
            return
            
        try:
            while self.is_active:
                response = await self.gemini_ws.recv()
                data = json.loads(response)
                
                # Extract audio data from response
                if "serverContent" in data:
                    content = data["serverContent"]
                    
                    # Check for model turn with audio
                    if "modelTurn" in content:
                        model_turn = content["modelTurn"]
                        if "parts" in model_turn:
                            for part in model_turn["parts"]:
                                if "inlineData" in part:
                                    inline_data = part["inlineData"]
                                    if inline_data.get("mimeType", "").startswith("audio/"):
                                        # Convert PCM to WAV for mobile playback
                                        audio_data = inline_data.get("data", "")
                                        mime_type = inline_data.get("mimeType", "audio/pcm")
                                        
                                        # If it's PCM audio, convert to WAV
                                        if "pcm" in mime_type.lower() and audio_data:
                                            # Gemini outputs 24kHz audio
                                            wav_data = convert_pcm_to_wav(audio_data, sample_rate=24000)
                                            await self.client_ws.send_json({
                                                "type": "audio",
                                                "data": wav_data,
                                                "mimeType": "audio/wav"
                                            })
                                        else:
                                            # Forward as-is for other formats
                                            await self.client_ws.send_json({
                                                "type": "audio",
                                                "data": audio_data,
                                                "mimeType": mime_type
                                            })
                    
                    # Check for turn complete
                    if content.get("turnComplete"):
                        await self.client_ws.send_json({
                            "type": "turnComplete"
                        })
                        
                    # Check for interrupted (barge-in)
                    if content.get("interrupted"):
                        await self.client_ws.send_json({
                            "type": "interrupted"
                        })
                        logger.info("🎤 User interrupted (barge-in)")
                        
        except Exception as e:
            if self.is_active:
                logger.error(f"Error receiving from Gemini: {e}")
    
    async def close(self):
        """Close the session"""
        self.is_active = False
        if self.gemini_ws:
            try:
                await self.gemini_ws.close()
            except:
                pass
        logger.info("👋 Session closed")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "NerdX Live Voice Agent",
        "status": "running",
        "model": GEMINI_MODEL,
        "api_configured": bool(GEMINI_API_KEY)
    }


@app.get("/health")
async def health():
    """Health check for monitoring"""
    return {"status": "healthy"}


@app.websocket("/ws/nerdx-live")
async def websocket_nerdx_live(websocket: WebSocket):
    """
    WebSocket endpoint for real-time voice interaction with NerdX AI tutor.
    
    Protocol:
    - Client sends: {"type": "audio", "data": "<base64 PCM audio>"}
    - Server sends: {"type": "audio", "data": "<base64 PCM audio>", "mimeType": "audio/pcm"}
    - Server sends: {"type": "turnComplete"} when AI finishes speaking
    - Server sends: {"type": "interrupted"} when barge-in detected
    - Client sends: {"type": "end"} to close session
    """
    await websocket.accept()
    logger.info("🎧 New client connected")
    
    session = GeminiLiveSession(websocket)
    
    # Connect to Gemini
    if not await session.connect_to_gemini():
        await websocket.send_json({
            "type": "error",
            "message": "Failed to connect to AI service"
        })
        await websocket.close()
        return
    
    # Send ready signal to client
    await websocket.send_json({
        "type": "ready",
        "message": "Connected to NerdX Live!"
    })
    
    # Start receiving from Gemini in background
    receive_task = asyncio.create_task(session.receive_from_gemini())
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            msg_type = data.get("type", "")
            
            if msg_type == "audio":
                # Forward audio to Gemini
                audio_data = data.get("data", "")
                if audio_data:
                    await session.send_audio_chunk(audio_data)
                    
            elif msg_type == "end":
                # Client wants to end session
                logger.info("📴 Client requested session end")
                break
                
    except WebSocketDisconnect:
        logger.info("📴 Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        receive_task.cancel()
        await session.close()


# Entry point for running directly
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("VOICE_AGENT_PORT", "8001"))
    logger.info(f"🚀 Starting NerdX Live Voice Agent on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
