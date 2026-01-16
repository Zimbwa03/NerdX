#!/usr/bin/env python3
"""
Audio Chat Service - Multi-Modal AI Assistant with Audio Responses
Integrated for WhatsApp Bot with DeepSeek AI and Gemini AI TTS
"""

import os
import json
import uuid
import threading
import time
import tempfile
import requests
from datetime import datetime
from typing import Dict, Optional
import logging

# Import processing libraries
try:
    import pytesseract
    from PIL import Image
except ImportError:
    pytesseract = None
    Image = None

try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

try:
    import speech_recognition as sr
except ImportError:
    sr = None

logger = logging.getLogger(__name__)

# Import Google GenAI SDK for audio generation (Vertex AI)
try:
    from google import genai
    from google.genai.types import HttpOptions
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    HttpOptions = None
    GENAI_AVAILABLE = False

# Environment variables
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')

# Vertex AI configuration
GOOGLE_CLOUD_PROJECT = os.getenv('GOOGLE_CLOUD_PROJECT', 'gen-lang-client-0303273462')
USE_VERTEX_AI = os.getenv('GOOGLE_GENAI_USE_VERTEXAI', 'True').lower() == 'true'

# Task storage (in production, use Redis or database)
audio_tasks = {}

class AudioChatService:
    """Audio Chat service for WhatsApp bot with multi-modal support"""

    def __init__(self):
        # Initialize threading lock for single audio generation
        self.audio_generation_lock = threading.Lock()
        self.is_generating_audio = False

        # Initialize Gemini AI client for audio generation
        self.gemini_client = None
        if GENAI_AVAILABLE:
            self._init_gemini_client()

    def _init_gemini_client(self):
        """Initialize Gemini client with Vertex AI or API key."""
        try:
            # Try Vertex AI first (higher rate limits)
            if USE_VERTEX_AI:
                os.environ['GOOGLE_GENAI_USE_VERTEXAI'] = 'True'
                credentials_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
                service_account_json = os.environ.get('GOOGLE_SERVICE_ACCOUNT_JSON')
                
                if credentials_path and os.path.exists(credentials_path):
                    self.gemini_client = genai.Client(http_options=HttpOptions(api_version="v1"))
                    logger.info(f"AudioChatService: Gemini via Vertex AI configured (project: {GOOGLE_CLOUD_PROJECT})")
                    return
                elif service_account_json:
                    import tempfile
                    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
                        f.write(service_account_json)
                        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = f.name
                    self.gemini_client = genai.Client(http_options=HttpOptions(api_version="v1"))
                    logger.info("AudioChatService: Gemini via Vertex AI configured (inline credentials)")
                    return
                else:
                    # Try ADC
                    try:
                        self.gemini_client = genai.Client(http_options=HttpOptions(api_version="v1"))
                        logger.info("AudioChatService: Gemini via Vertex AI configured (ADC)")
                        return
                    except Exception:
                        logger.warning("Vertex AI ADC failed, trying API key...")
            
            # Fallback to API key
            if GEMINI_API_KEY:
                self.gemini_client = genai.Client(api_key=GEMINI_API_KEY)
                logger.info("Gemini AI client initialized for audio generation (API key fallback)")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini AI client: {e}")

        # Gemini TTS voice configurations (using valid voice names)
        self.gemini_voices = {
            'female': 'kore',      # Female voice (confirmed available)
            'male': 'fenrir'       # Male voice (confirmed available)
        }

        # Create temp directory for audio files
        self.audio_dir = "temp_audio"
        try:
            os.makedirs(self.audio_dir, exist_ok=True)
        except (OSError, PermissionError) as e:
            logger.error(f"Error creating audio directory {self.audio_dir}: {e}")
            # Fall back to current directory if temp_audio creation fails
            self.audio_dir = "."

    def create_task(self, task_type: str, data: Dict) -> str:
        """Create a new processing task"""
        task_id = str(uuid.uuid4())
        audio_tasks[task_id] = {
            'id': task_id,
            'type': task_type,
            'status': 'processing',
            'data': data,
            'created_at': datetime.now().isoformat(),
            'ai_response': None,
            'audio_url': None,
            'error': None
        }
        return task_id

    def update_task(self, task_id: str, updates: Dict):
        """Update task status and data"""
        if task_id in audio_tasks:
            audio_tasks[task_id].update(updates)

    def get_task(self, task_id: str) -> Optional[Dict]:
        """Get task by ID"""
        return audio_tasks.get(task_id)

    def clean_text_for_audio(self, text: str, max_duration_seconds: int = 30) -> str:
        """Clean text by removing markdown formatting and limit length for maximum 30 seconds of audio"""
        import re

        # Remove markdown bold/italic formatting
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # **bold** -> bold
        text = re.sub(r'\*(.*?)\*', r'\1', text)      # *italic* -> italic

        # Remove markdown headers
        text = re.sub(r'#{1,6}\s*', '', text)         # ### Header -> Header

        # Remove code blocks
        text = re.sub(r'```[\s\S]*?```', 'code block', text)  # ```code``` -> code block
        text = re.sub(r'`(.*?)`', r'\1', text)        # `code` -> code

        # Remove bullet points and list formatting
        text = re.sub(r'^\s*[-*+]\s+', '', text, flags=re.MULTILINE)  # - item -> item
        text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)  # 1. item -> item

        # Remove excessive whitespace and newlines
        text = re.sub(r'\n{3,}', '\n\n', text)        # Multiple newlines -> double newline
        text = re.sub(r'\s{2,}', ' ', text)           # Multiple spaces -> single space

        # Remove special characters that might confuse TTS but keep essential punctuation
        text = re.sub(r'[#@$%^&*()_+=\[\]{}|\\";\'<>`~]', ' ', text)

        # Ensure proper sentence endings for natural speech
        text = re.sub(r'([.!?])\s*([A-Z])', r'\1 \2', text)

        # Clean up and normalize
        text = text.strip()
        text = ' '.join(text.split())  # Normalize whitespace

        # Limit text length for maximum audio duration (approximately 150 words per minute)
        # For 30 seconds max: 30/60 * 150 = ~75 words maximum (reduced for faster generation)
        words = text.split()
        max_words = int(max_duration_seconds / 60 * 150)  # Dynamic calculation

        if len(words) > max_words:
            text = ' '.join(words[:max_words])
            # Ensure we end on a complete sentence
            if not text.endswith(('.', '!', '?')):
                # Find the last sentence ending
                last_sentence_end = max(
                    text.rfind('.'),
                    text.rfind('!'),
                    text.rfind('?')
                )
                if last_sentence_end > len(text) * 0.7:  # If we can keep at least 70% of text
                    text = text[:last_sentence_end + 1]
                else:
                    text += '.'  # Add period if no good sentence ending found

        return text

    def generate_ai_response(self, content: str, content_type: str = "text", user_query: str = "", user_name: str = "") -> str:
        """Generate AI response using DeepSeek API"""
        try:
            if not DEEPSEEK_API_KEY:
                return "AI service is currently unavailable. Please ensure your DeepSeek API key is configured."

            # Add user name personalization if available
            name_intro = f"Hi {user_name}, " if user_name else ""

            # Construct prompt based on content type
            if content_type == "image":
                prompt = f"User uploaded an image. Extracted text: '{content}'. User's question: {user_query}. Please analyze this image content and provide helpful educational insights. Start your response with '{name_intro}' to personalize it."
            elif content_type == "pdf":
                prompt = f"User uploaded a PDF document. Extracted text: '{content[:2000]}...'. User's question: {user_query}. Please summarize this document and answer any educational questions. Start your response with '{name_intro}' to personalize it."
            elif content_type == "audio":
                prompt = f"User sent an audio message. Transcribed text: '{content}'. Please respond to this audio message in a conversational educational manner. Start your response with '{name_intro}' to personalize it."
            else:
                prompt = f"As an educational assistant for ZIMSEC students, please provide a helpful response to: {content}. Start your response with '{name_intro}' to personalize it."

            headers = {
                'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
                'Content-Type': 'application/json'
            }

            data = {
                'model': 'deepseek-chat',
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are NerdX, an educational AI assistant for ZIMSEC students in Zimbabwe. Provide clear, concise, and informative responses that help students learn. When analyzing content from images, PDFs, or audio, provide educational insights and answer questions based on the content. Always maintain context and provide relevant, actionable educational information. IMPORTANT: Use plain text only - no markdown formatting, asterisks, hashtags, or special characters. Write in a natural speaking style that sounds good when read aloud. Keep responses under 300 words for audio clarity.'
                    },
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'max_tokens': 800,
                'temperature': 0.7
            }

            response = requests.post(
                'https://api.deepseek.com/chat/completions',
                headers=headers,
                json=data,
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                return "I'm having trouble processing your request right now. Please try again later."

        except Exception as e:
            logger.error(f"Error generating AI response: {e}")
            return "I encountered an error while processing your request. Please try again."

    def generate_audio_with_elevenlabs(self, text: str, voice_type: str = 'female') -> Optional[str]:
        """Generate audio using ElevenLabs as fallback"""
        try:
            if not ELEVENLABS_API_KEY:
                logger.error("ElevenLabs API key not configured")
                return None

            # ElevenLabs voice IDs
            elevenlabs_voices = {
                'female': 'pNInz6obpgDQGcFmaJgB',  # Adam (female-like voice)
                'male': 'ErXwobaYiN019PkySvjV'     # Antoni (male voice)
            }

            voice_id = elevenlabs_voices.get(voice_type, elevenlabs_voices['female'])
            
            headers = {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            }

            data = {
                'text': text,
                'model_id': 'eleven_monolingual_v1',
                'voice_settings': {
                    'stability': 0.5,
                    'similarity_boost': 0.5
                }
            }

            url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
            
            response = requests.post(url, json=data, headers=headers, timeout=30)
            
            if response.status_code == 200:
                # Save the audio file
                audio_filename = f"audio_elevenlabs_{uuid.uuid4().hex}.mp3"
                audio_path = os.path.join(self.audio_dir, audio_filename)
                
                with open(audio_path, 'wb') as f:
                    f.write(response.content)
                
                # Convert to M4A for better WhatsApp compatibility
                try:
                    import subprocess
                    
                    m4a_filename = f"audio_elevenlabs_{uuid.uuid4().hex}.m4a"
                    m4a_path = os.path.join(self.audio_dir, m4a_filename)
                    
                    process = subprocess.run([
                        'ffmpeg', '-y',
                        '-i', audio_path,
                        '-c:a', 'aac',
                        '-b:a', '64k',
                        '-ar', '16000',
                        m4a_path
                    ], capture_output=True, timeout=15)
                    
                    if process.returncode == 0 and os.path.exists(m4a_path):
                        # Remove the original MP3 file
                        os.remove(audio_path)
                        logger.info(f"ElevenLabs audio generated successfully: {m4a_filename}")
                        return m4a_path
                    else:
                        logger.warning("FFmpeg conversion failed, using original MP3")
                        return audio_path
                        
                except Exception as e:
                    logger.warning(f"Audio conversion failed, using original: {e}")
                    return audio_path
            else:
                logger.error(f"ElevenLabs API error: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            logger.error(f"Error generating audio with ElevenLabs: {e}")
            return None

    def generate_audio(self, text: str, voice_type: str = 'female') -> Optional[str]:
        """Generate audio from text using Gemini AI TTS with ElevenLabs fallback"""
        # Check if audio generation is already in progress
        with self.audio_generation_lock:
            if self.is_generating_audio:
                logger.info("Audio generation in progress - waiting for completion...")
                # Wait for current generation to complete instead of skipping
                import time
                wait_count = 0
                while self.is_generating_audio and wait_count < 30:  # Wait up to 30 seconds
                    time.sleep(1)
                    wait_count += 1

                if self.is_generating_audio:
                    logger.error("Audio generation timeout - proceeding anyway")
                    self.is_generating_audio = False

            self.is_generating_audio = True

        try:
            # Try Gemini AI first
            if self.gemini_client:
                logger.info(f"Trying Gemini AI for audio generation: {text[:50]}...")

                # Get voice name for Gemini TTS
                voice_name = self.gemini_voices.get(voice_type, self.gemini_voices['female'])

                # Generate audio with thread-based timeout protection
                try:
                    import threading
                    import queue
                    
                    # Use thread-based timeout instead of signal (safer with gunicorn)
                    result_queue = queue.Queue()
                    exception_queue = queue.Queue()
                    
                    def generate_audio_thread():
                        try:
                            response = self.gemini_client.models.generate_content(
                                model="gemini-2.5-flash-preview-tts",
                                contents=text,
                                config={
                                    "response_modalities": ["AUDIO"],
                                    "speech_config": {
                                        "voice_config": {
                                            "prebuilt_voice_config": {
                                                "voice_name": voice_name
                                            }
                                        }
                                    }
                                }
                            )
                            result_queue.put(response)
                        except Exception as e:
                            exception_queue.put(e)
                    
                    # Start the generation in a separate thread
                    thread = threading.Thread(target=generate_audio_thread)
                    thread.daemon = True
                    thread.start()
                    
                    # Wait for result with timeout
                    thread.join(timeout=25)  # 25 second timeout
                    
                    if thread.is_alive():
                        logger.warning("Gemini audio generation timed out after 25 seconds")
                        raise TimeoutError("Gemini AI audio generation timed out")
                    
                    # Check for exceptions
                    if not exception_queue.empty():
                        raise exception_queue.get()
                    
                    # Get the result
                    if not result_queue.empty():
                        response = result_queue.get()
                    else:
                        raise Exception("No response received from Gemini")

                    # Extract audio data from response
                    if response.candidates and response.candidates[0].content.parts:
                        for part in response.candidates[0].content.parts:
                            if part.inline_data and part.inline_data.data:
                                # Convert Gemini's raw PCM audio to M4A/AAC format for better WhatsApp compatibility
                                try:
                                    import subprocess

                                    # Use MP4 with AAC codec for better WhatsApp compatibility
                                    audio_filename = f"audio_gemini_{uuid.uuid4().hex}.m4a"
                                    audio_path = os.path.join(self.audio_dir, audio_filename)

                                    # Use ffmpeg to convert raw PCM data to M4A/AAC format
                                    # Gemini outputs: 24kHz, 16-bit, mono PCM
                                    process = subprocess.Popen([
                                        'ffmpeg', '-y',
                                        '-f', 's16le',           # 16-bit signed little-endian PCM
                                        '-ar', '24000',          # 24kHz sample rate
                                        '-ac', '1',              # 1 channel (mono)
                                        '-i', 'pipe:0',          # Read from stdin
                                        '-c:a', 'aac',           # Use AAC codec for M4A
                                        '-b:a', '64k',           # 64kbps bitrate (good for voice)
                                        '-ar', '16000',          # Downsample to 16kHz for WhatsApp
                                        '-ac', '1',              # Ensure mono output
                                        audio_path
                                    ], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

                                    # Send PCM data to ffmpeg with timeout
                                    try:
                                        stdout, stderr = process.communicate(input=part.inline_data.data, timeout=10)
                                    except subprocess.TimeoutExpired:
                                        process.kill()
                                        logger.error("FFmpeg conversion timed out")
                                        continue

                                    if process.returncode == 0:
                                        # Verify the file was created and has content
                                        if os.path.exists(audio_path) and os.path.getsize(audio_path) > 0:
                                            logger.info(f"✅ Gemini audio generated successfully: {audio_filename} (size: {os.path.getsize(audio_path)} bytes)")
                                            return audio_path
                                        else:
                                            logger.error(f"Gemini audio file not created or empty: {audio_path}")
                                    else:
                                        logger.error(f"FFmpeg conversion failed: {stderr.decode()}")

                                except Exception as e:
                                    logger.error(f"Error converting Gemini audio with FFmpeg: {e}")

                    logger.warning("No audio data received from Gemini AI - trying ElevenLabs fallback")

                except (TimeoutError, Exception) as e:
                    logger.warning(f"Gemini audio generation failed: {e} - trying ElevenLabs fallback")
                    # Continue to try ElevenLabs fallback
                    logger.info("🔄 Switching to ElevenLabs due to Gemini timeout/error")
                    elevenlabs_result = self.generate_audio_with_elevenlabs(text, voice_type)
                    if elevenlabs_result:
                        logger.info(f"✅ ElevenLabs fallback successful: {elevenlabs_result}")
                        return elevenlabs_result
                        logger.info("✅ ElevenLabs emergency fallback succeeded")
                        return elevenlabs_result
            else:
                logger.warning("Gemini AI client not configured - trying ElevenLabs fallback")

            # Fallback to ElevenLabs
            logger.info("🔄 Falling back to ElevenLabs for audio generation...")
            elevenlabs_result = self.generate_audio_with_elevenlabs(text, voice_type)
            
            if elevenlabs_result:
                logger.info("✅ ElevenLabs fallback succeeded")
                return elevenlabs_result
            else:
                logger.error("❌ Both Gemini and ElevenLabs failed to generate audio")
                return None


        except Exception as e:
            logger.error(f"Error generating audio with Gemini AI: {e}")
            logger.error(f"Text being converted: {text[:100]}...")
            return None

        finally:
            # Always release the lock
            with self.audio_generation_lock:
                self.is_generating_audio = False
                logger.info("Audio generation completed - ready for next request")

    def process_image(self, file_path: str) -> str:
        """Extract text from image using OCR"""
        try:
            if not pytesseract or not Image:
                return "Image processing not available. Please send text instead."

            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)

            if not text.strip():
                return "No text detected in the image"

            return text.strip()
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            return "Error processing image"

    def process_pdf(self, file_path: str) -> str:
        """Extract text from PDF"""
        try:
            if not PyPDF2:
                return "PDF processing not available. Please send text instead."

            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)

                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text()

            if not text.strip():
                return "No text detected in the PDF"

            return text.strip()
        except Exception as e:
            logger.error(f"Error processing PDF: {e}")
            return "Error processing PDF"

    def process_audio(self, file_path: str) -> str:
        """Transcribe audio to text"""
        try:
            if not sr:
                return "Audio processing not available. Please send text instead."

            r = sr.Recognizer()

            with sr.AudioFile(file_path) as source:
                audio = r.record(source)

            try:
                text = r.recognize_google(audio)
                if text.strip():
                    return text
                else:
                    return "Please speak clearly and try again. I couldn't detect clear speech in your audio."
            except sr.UnknownValueError:
                return "I couldn't understand the audio clearly. Please speak slowly and clearly, or try sending a text message instead."
            except sr.RequestError as e:
                logger.error(f"Google Speech Recognition service error: {e}")
                return "Audio processing is temporarily unavailable. Please send a text message instead."

        except Exception as e:
            logger.error(f"Error processing audio: {e}")
            return "Error processing audio file"

    def process_text_chat(self, user_id: str, text: str, voice_type: str = 'female') -> str:
        """Process text input and return audio response path"""
        try:
            # Generate AI response
            ai_response = self.generate_ai_response(text, 'text')

            # Clean the response for audio
            clean_response = self.clean_text_for_audio(ai_response)

            # Generate audio
            audio_path = self.generate_audio(clean_response, voice_type)

            if audio_path:
                return audio_path
            else:
                # Fallback to text response
                return str(ai_response)

        except Exception as e:
            logger.error(f"Error processing text chat: {e}")
            return "I'm sorry, I encountered an error processing your request."

    def handle_audio_chat_command(self, user_id: str):
        """Handle audio chat command from WhatsApp with gamification"""
        try:
            from services.whatsapp_service import WhatsAppService
            from database.external_db import get_user_registration, get_user_credits, get_user_stats

            whatsapp_service = WhatsAppService()

            # Get user info and stats for gamified display
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            current_credits = get_user_credits(user_id)
            user_stats = get_user_stats(user_id) or {'level': 1, 'xp_points': 0, 'streak': 0}
            current_level = user_stats.get('level', 1)
            current_xp = user_stats.get('xp_points', 0)
            current_streak = user_stats.get('streak', 0)

            # Calculate XP needed for next level
            xp_for_next_level = (current_level * 100) - current_xp
            if xp_for_next_level <= 0:
                xp_for_next_level = 100  # Base XP for next level

            welcome_message = f"""🎧 *Hey {user_name}! Welcome to AudioMentor* 🎧

🎵 *{user_name}, I'm your personal AI Audio Assistant!*

📊 **Your Audio Learning Journey:**
💳 Credits: **{current_credits}**
⭐ Level: **{current_level}** (XP: {current_xp})
🔥 Streak: **{current_streak} days**
🎯 Next Level: **{xp_for_next_level} XP needed**

I'm here to help you learn, {user_name}, with:

🗣️ **Text to Speech:** Get audio explanations (15 XP)
📸 **Image Analysis:** Audio explanations of problems (20 XP)
📄 **PDF Reading:** Audio summaries of documents (25 XP)
🎵 **Voice Messages:** Conversational audio learning (15 XP)
🔥 **Daily Streaks:** Maintain consistent learning

💰 **Cost:** 10 credits per audio response
⏱️ **Audio Duration:** Limited to 30 seconds maximum
💡 **Tip:** Send shorter questions for better audio quality

🚀 *{user_name}, choose your voice and start earning XP:*"""

            # Send voice preference buttons
            buttons = [
                {'id': 'audio_female_voice', 'title': '👩 Female Voice'},
                {'id': 'audio_male_voice', 'title': '👨 Male Voice'},
                {'id': 'end_audio_chat', 'title': '❌ End Audio Chat'}
            ]

            whatsapp_service.send_interactive_message(user_id, welcome_message, buttons)

            # Set session state
            from utils.session_manager import session_manager
            session_manager.save_audio_chat_session(user_id, 'audio_chat', 'female')

        except Exception as e:
            logger.error(f"Error handling audio chat command: {e}")
            return "Error starting audio chat mode. Please try again."

    def handle_voice_selection(self, user_id: str, voice_type: str):
        """Handle voice type selection with gamified response"""
        try:
            from services.whatsapp_service import WhatsAppService
            from utils.session_manager import session_manager
            from database.external_db import get_user_registration, get_user_credits, get_user_stats

            whatsapp_service = WhatsAppService()

            # Update session with voice preference
            session_manager.save_audio_chat_session(user_id, 'audio_chat', voice_type)

            # Get user info for personalized message
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            current_credits = get_user_credits(user_id)
            user_stats = get_user_stats(user_id) or {'level': 1, 'xp_points': 0, 'streak': 0}
            current_level = user_stats.get('level', 1)
            current_xp = user_stats.get('xp_points', 0)
            current_streak = user_stats.get('streak', 0)

            voice_name = "Female" if voice_type == 'female' else "Male"
            response_message = f"""✅ **{voice_name} voice selected, {user_name}!** ✅

🎧 **Ready for Audio Learning!**

📊 **Current Progress:**
💳 Credits: {current_credits}
⭐ Level: {current_level} (XP: {current_xp})
🔥 Streak: {current_streak} days

🎵 **Send me any of these for audio responses:**
• Any question for audio explanation (15 XP)
• Images of problems or notes (20 XP) 
• PDF documents to summarize (25 XP)
• Voice messages to chat (15 XP)

💰 **Cost:** 10 credits per audio response
⏱️ **Duration:** Up to 30 seconds of audio
🎯 **Earn XP** and level up with each interaction!

Type 'end audio' to exit audio chat mode."""

            # Add end audio chat button
            buttons = [
                {'id': 'end_audio_chat', 'title': '❌ End Audio Chat'}
            ]

            whatsapp_service.send_interactive_message(user_id, response_message, buttons)

        except Exception as e:
            logger.error(f"Error handling voice selection: {e}")

    def handle_audio_input(self, user_id: str, message_text: str = None, file_path: str = None, file_type: str = 'text'):
        """Handle various types of input in audio chat mode with credit system and gamification"""
        try:
            from services.whatsapp_service import WhatsAppService
            from utils.session_manager import session_manager
            from database.external_db import get_user_registration, get_user_stats, add_xp, update_streak, update_user_stats
            from services.advanced_credit_service import advanced_credit_service

            whatsapp_service = WhatsAppService()

            # Get user's voice preference
            session_data = session_manager.get_audio_chat_session(user_id)
            voice_type = session_data.get('voice_type', 'female') if session_data else 'female'

            # Check for end audio chat command
            if message_text and message_text.lower().strip() in ['end audio', 'end audio chat', 'exit audio', 'stop audio']:
                self.end_audio_chat(user_id)
                return

            # Get user's name for personalization
            user_name = ""
            try:
                user_data = get_user_registration(user_id)
                if user_data:
                    user_name = user_data.get('name', '')
            except:
                pass

            # Check if audio generation is already in progress - block concurrent requests
            if self.is_generating_audio:
                whatsapp_service.send_message(user_id, "⏳ Audio generation in progress, please wait...")
                return

            # Check and deduct credits using advanced credit service
            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id, 
                'audio_feature',  # 10 credits as per config
                None
            )

            if not credit_result['success']:
                if credit_result.get('insufficient'):
                    # Show insufficient credits message
                    current_credits = credit_result['current_credits']
                    required_credits = credit_result['required_credits']
                    shortage = credit_result['shortage']

                    insufficient_msg = f"""💰 **Need More Credits for Audio!** 💰

🎧 **Audio Chat Feature**

💳 **Credit Status:**
• Current Credits: {current_credits}
• Required Credits: {required_credits}
• Need: {shortage} more credits

💎 **Get More Credits:**"""

                    buttons = [
                        {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                        {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                        {"text": "🔙 Back to Menu", "callback_data": "main_menu"}
                    ]

                    whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                    return
                else:
                    error_message = credit_result.get('message', '❌ Credit processing error. Please try again.')
                    whatsapp_service.send_message(user_id, error_message)
                    return

            # Show processing message
            whatsapp_service.send_message(user_id, "🎵 Generating your personalized audio response... Please wait, this may take up to 30 seconds for best quality! 🎧")

            content = ""
            ai_response = ""

            # Determine XP points based on file type
            if file_type == 'image' and file_path:
                content = self.process_image(file_path)
                ai_response = self.generate_ai_response(content, 'image', message_text or "", user_name)
                xp_points = 20  # Image analysis XP
            elif file_type == 'pdf' and file_path:
                content = self.process_pdf(file_path)
                ai_response = self.generate_ai_response(content, 'pdf', message_text or "", user_name)
                xp_points = 25  # PDF reading XP
            elif file_type == 'audio' and file_path:
                content = self.process_audio(file_path)
                ai_response = self.generate_ai_response(content, 'audio', "", user_name)
                xp_points = 15  # Voice message XP
            else:
                ai_response = self.generate_ai_response(message_text or "", 'text', "", user_name)
                xp_points = 15  # Text to speech XP

            # Generate audio response with 45-second limit and fallback to text
            clean_response = self.clean_text_for_audio(ai_response, max_duration_seconds=45)
            audio_path = None

            # Generate audio with timeout protection
            try:
                logger.info("Starting audio generation...")
                # Use threading to prevent worker timeout issues
                import threading
                import queue
                
                audio_result_queue = queue.Queue()
                audio_exception_queue = queue.Queue()
                
                def audio_generation_thread():
                    try:
                        result = self.generate_audio(clean_response, voice_type)
                        audio_result_queue.put(result)
                    except Exception as e:
                        audio_exception_queue.put(e)
                
                # Start audio generation in separate thread - NO BLOCKING
                audio_thread = threading.Thread(target=audio_generation_thread)
                audio_thread.daemon = True
                audio_thread.start()
                
                # QUICK non-blocking check for immediate results
                import time
                time.sleep(0.5)  # Quick 500ms check for fast responses
                
                # Check if we got a quick result
                if not audio_result_queue.empty():
                    audio_path = audio_result_queue.get()
                    logger.info(f"Fast audio generation completed: {audio_path}")
                elif not audio_exception_queue.empty():
                    error = audio_exception_queue.get()
                    logger.error(f"Fast audio generation error: {error}")
                    audio_path = None
                else:
                    # No immediate result - send processing message and continue in background
                    logger.info("Audio generation taking longer - will send when ready")
                    
                    # Send immediate response to avoid user waiting
                    whatsapp_service.send_message(
                        user_id, 
                        "⏳ Processing your request... Your audio response will arrive shortly!"
                    )
                    
                    # Start background processing
                    def background_audio_handler():
                        try:
                            # Wait for background generation to complete
                            audio_thread.join(timeout=30)
                            
                            final_audio_path = None
                            if not audio_exception_queue.empty():
                                error = audio_exception_queue.get()
                                logger.error(f"Background audio generation error: {error}")
                            elif not audio_result_queue.empty():
                                final_audio_path = audio_result_queue.get()
                                
                            if final_audio_path and os.path.exists(final_audio_path):
                                # Send the audio file
                                success = whatsapp_service.send_audio_message(user_id, final_audio_path)
                                if success:
                                    logger.info(f"🎵 Background audio delivered to {user_id}")
                                    # Send gamified buttons after audio
                                    self.send_gamified_audio_response_buttons(user_id, xp_points, new_level > current_level, current_level, new_level)
                                else:
                                    # Audio failed - send text fallback
                                    whatsapp_service.send_message(user_id, f"💬 {ai_response}")
                            else:
                                # No audio - send text fallback
                                logger.warning("Background audio generation failed - sending text response")
                                whatsapp_service.send_message(user_id, f"💬 {ai_response}")
                                
                        except Exception as e:
                            logger.error(f"Background audio handler error: {e}")
                            # Fallback to text response
                            whatsapp_service.send_message(user_id, f"💬 {ai_response}")
                    
                    # Start background handler in separate thread
                    bg_thread = threading.Thread(target=background_audio_handler)
                    bg_thread.daemon = True
                    bg_thread.start()
                    
                    # Skip the normal audio processing and return early
                    return  # Exit early - background thread will handle completion

            except Exception as e:
                logger.error(f"Audio generation wrapper error: {e}")
                audio_path = None

            # Award XP and update stats regardless of audio success
            current_stats = get_user_stats(user_id) or {}
            current_xp = current_stats.get('xp_points', 0)
            current_level = current_stats.get('level', 1)
            current_streak = current_stats.get('streak', 0)

            # Award XP and update streak
            add_xp(user_id, xp_points, 'audio_feature')
            update_streak(user_id)

            # Check for level up
            new_xp = current_xp + xp_points
            new_level = max(1, (new_xp // 100) + 1)
            new_streak = current_streak + 1

            # Update total attempts and user stats - moved here to avoid duplication
            if not hasattr(self, '_stats_updated'):
                update_user_stats(user_id, {
                    'total_attempts': current_stats.get('total_attempts', 0) + 1,
                    'xp_points': new_xp,
                    'level': new_level,
                    'streak': new_streak
                })
                self._stats_updated = True

            if audio_path and os.path.exists(audio_path):
                logger.info(f"✅ AUDIO READY: {audio_path}, size: {os.path.getsize(audio_path)} bytes")

                # Send ONLY audio file via WhatsApp (no text)
                try:
                    success = whatsapp_service.send_audio_message(user_id, audio_path)

                    if success:
                        logger.info(f"🎵 Audio successfully delivered to {user_id}")
                        # Send gamified buttons after audio response
                        self.send_gamified_audio_response_buttons(user_id, xp_points, new_level > current_level, current_level, new_level)
                    else:
                        logger.error(f"❌ WhatsApp audio delivery failed for {user_id} - retrying...")
                        # Retry audio sending once
                        import time
                        time.sleep(2)
                        retry_success = whatsapp_service.send_audio_message(user_id, audio_path)
                        if retry_success:
                            logger.info(f"🎵 Audio delivered on retry to {user_id}")
                            self.send_gamified_audio_response_buttons(user_id, xp_points, new_level > current_level, current_level, new_level)
                        else:
                            # Only as last resort, show error message
                            whatsapp_service.send_message(user_id, "🎵 Audio generated but delivery failed. Please try asking your question again.")
                            self.send_gamified_audio_response_buttons(user_id, xp_points, new_level > current_level, current_level, new_level)

                except Exception as e:
                    logger.error(f"Exception during audio sending for {user_id}: {e}")
                    whatsapp_service.send_message(user_id, "🎵 Audio processing complete. Please try asking your question again for audio delivery.")
                    self.send_gamified_audio_response_buttons(user_id, xp_points, new_level > current_level, current_level, new_level)

                # Clean up temporary file after a delay to ensure upload completes
                import threading
                def cleanup_file():
                    import time
                    time.sleep(15)  # Wait 15 seconds before cleanup
                    try:
                        if os.path.exists(audio_path):
                            os.remove(audio_path)
                            logger.info(f"Cleaned up audio file: {audio_path}")
                    except Exception as e:
                        logger.error(f"Error cleaning up audio file: {e}")

                threading.Thread(target=cleanup_file, daemon=True).start()
            else:
                logger.error(f"❌ Audio generation completely failed - no file created")
                # Try one more time with a shorter text
                short_text = clean_response[:200] + "..." if len(clean_response) > 200 else clean_response
                logger.info("Attempting emergency audio generation with shorter text...")

                try:
                    emergency_audio = self.generate_audio(short_text, voice_type)
                    if emergency_audio and os.path.exists(emergency_audio):
                        logger.info("Emergency audio generation successful!")
                        success = whatsapp_service.send_audio_message(user_id, emergency_audio)
                        if success:
                            logger.info(f"🎵 Emergency audio delivered to {user_id}")
                            self.send_gamified_audio_response_buttons(user_id, xp_points, new_level > current_level, current_level, new_level)
                            return
                except Exception as e:
                    logger.error(f"Emergency audio generation failed: {e}")

                # Absolute last resort - inform user
                whatsapp_service.send_message(user_id, "🎵 Audio system temporarily busy. Your question was processed! Please try again in a moment for audio response.")
                self.send_gamified_audio_response_buttons(user_id, xp_points, new_level > current_level, current_level, new_level)

        except Exception as e:
            logger.error(f"Error handling audio input: {e}")
            from services.whatsapp_service import WhatsAppService
            whatsapp_service = WhatsAppService()
            whatsapp_service.send_message(user_id, "❌ Error processing your audio request. Please try again or type 'end audio' to exit audio chat.")

    def end_audio_chat(self, user_id: str):
        """End audio chat session and return to main menu with gamified summary"""
        try:
            from services.whatsapp_service import WhatsAppService
            from utils.session_manager import session_manager
            from database.external_db import get_user_registration, get_user_stats, get_user_credits

            whatsapp_service = WhatsAppService()

            # Get user info for personalized goodbye
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            # Get final stats
            final_stats = get_user_stats(user_id) or {}
            final_credits = get_user_credits(user_id)
            final_xp = final_stats.get('xp_points', 0)
            final_streak = final_stats.get('streak', 0)
            final_level = final_stats.get('level', 1)
            audio_completed = final_stats.get('audio_completed', 0)

            # Clear audio chat session
            session_manager.clear_audio_chat_session(user_id)

            # Send gamified exit message
            exit_message = f"""✅ **Audio Chat Session Complete!** ✅

👋 Thanks for learning with AudioMentor, {user_name}!

📊 **Your Final Audio Stats:**
💳 Credits: {final_credits}
⭐ Level: {final_level} (XP: {final_xp})
🔥 Streak: {final_streak} days
🎧 Audio Sessions Completed: {audio_completed}

🎯 **Keep Learning:** Use audio chat again to:
• Earn more XP and level up
• Maintain your learning streak
• Get instant audio explanations

🚀 Ready to continue your learning journey?"""

            whatsapp_service.send_message(user_id, exit_message)

            # Show main menu
            from api.webhook import send_main_menu
            send_main_menu(user_id)

        except Exception as e:
            logger.error(f"Error ending audio chat: {e}")
            from services.whatsapp_service import WhatsAppService
            whatsapp_service = WhatsAppService()
            whatsapp_service.send_message(user_id, "Audio chat ended. Type 'menu' to return to main menu.")

    def send_audio_response_buttons(self, user_id: str):
        """Send buttons after audio response (legacy method)"""
        try:
            from services.whatsapp_service import WhatsAppService

            whatsapp_service = WhatsAppService()

            # Send buttons for user to choose next action
            buttons = [
                {'id': 'end_audio_chat', 'title': '❌ End Audio Chat'},
                {'id': 'continue_audio_chat', 'title': '🔄 Continue'}
            ]

            message = "What would you like to do next?"
            whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error sending audio response buttons: {e}")

    def send_gamified_audio_response_buttons(self, user_id: str, xp_earned: int, leveled_up: bool, old_level: int, new_level: int):
        """Send gamified buttons after audio response with XP tracking"""
        try:
            from services.whatsapp_service import WhatsAppService
            from database.external_db import get_user_stats, get_user_credits

            whatsapp_service = WhatsAppService()

            # Get updated user stats
            updated_stats = get_user_stats(user_id) or {}
            final_credits = get_user_credits(user_id)
            final_xp = updated_stats.get('xp_points', 0)
            final_streak = updated_stats.get('streak', 0)
            final_level = updated_stats.get('level', 1)

            # Calculate XP for next level
            xp_for_next_level = (final_level * 100) - final_xp
            if xp_for_next_level <= 0:
                xp_for_next_level = 100

            # Build gamified message
            level_up_bonus = ""
            if leveled_up:
                level_up_bonus = f"\n🎉 **LEVEL UP!** Level {old_level} → Level {new_level}!"

            message = f"""🎧 **Audio Response Complete!** 🎧

✨ **XP Earned:** +{xp_earned} XP
📊 **Your Progress:**
💳 Credits: {final_credits}
⭐ Level: {final_level} (XP: {final_xp})
🔥 Streak: {final_streak} days
🎯 Next Level: {xp_for_next_level} XP needed

{level_up_bonus}

🎵 Ready for your next audio learning session?"""

            # Send buttons for user to choose next action
            buttons = [
                {'id': 'continue_audio_chat', 'title': '🎵 Ask Another Question'},
                {'id': 'end_audio_chat', 'title': '❌ End Audio Chat'}
            ]

            whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error sending gamified audio response buttons: {e}")
            # Fallback to regular buttons
            self.send_audio_response_buttons(user_id)