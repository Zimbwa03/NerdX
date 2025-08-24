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

# Import Google Gemini AI for audio generation
try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None
    types = None

# Environment variables
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Task storage (in production, use Redis or database)
audio_tasks = {}

class AudioChatService:
    """Audio Chat service for WhatsApp bot with multi-modal support"""
    
    def __init__(self):
        # Initialize Gemini AI client for audio generation
        self.gemini_client = None
        if GEMINI_API_KEY and genai:
            try:
                self.gemini_client = genai.Client(api_key=GEMINI_API_KEY)
                logger.info("Gemini AI client initialized for audio generation")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini AI client: {e}")
        
        # Gemini TTS voice configurations (using valid voice names)
        self.gemini_voices = {
            'female': 'kore',      # Female voice (confirmed available)
            'male': 'fenrir'       # Male voice (confirmed available)
        }
        
        # Create temp directory for audio files
        self.audio_dir = "temp_audio"
        os.makedirs(self.audio_dir, exist_ok=True)
    
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

    def clean_text_for_audio(self, text: str, max_duration_seconds: int = 45) -> str:
        """Clean text by removing markdown formatting and limit length for maximum 45 seconds of audio"""
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
        # For 45 seconds max: 45/60 * 150 = ~112 words maximum
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

    def generate_audio(self, text: str, voice_type: str = 'female') -> Optional[str]:
        """Generate audio from text using Gemini AI TTS"""
        try:
            if not self.gemini_client:
                logger.error("Gemini AI client not configured")
                return None

            # Get voice name for Gemini TTS
            voice_name = self.gemini_voices.get(voice_type, self.gemini_voices['female'])
            
            # Generate audio using Gemini 2.5 Flash TTS
            response = self.gemini_client.models.generate_content(
                model="gemini-2.5-flash-preview-tts",
                contents=text,
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name=voice_name
                            )
                        )
                    )
                )
            )

            # Extract audio data from response
            if response.candidates and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    if part.inline_data and part.inline_data.data:
                        # Save audio as OGG for WhatsApp compatibility (Gemini outputs raw PCM)
                        audio_filename = f"audio_{uuid.uuid4().hex}.ogg"
                        audio_path = os.path.join(self.audio_dir, audio_filename)

                        # Convert Gemini's raw PCM audio (24kHz, 16-bit) directly to OGG using ffmpeg
                        try:
                            import subprocess
                            
                            # Use ffmpeg to convert raw PCM data to OGG format
                            # Gemini outputs: 24kHz, 16-bit, mono PCM
                            process = subprocess.Popen([
                                'ffmpeg', '-y',
                                '-f', 's16le',           # 16-bit signed little-endian PCM
                                '-ar', '24000',          # 24kHz sample rate
                                '-ac', '1',              # 1 channel (mono)
                                '-i', 'pipe:0',          # Read from stdin
                                '-c:a', 'libvorbis',     # Use Vorbis codec for OGG
                                '-q:a', '4',             # Quality level 4 (good quality, small size)
                                audio_path
                            ], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                            
                            # Send PCM data to ffmpeg
                            stdout, stderr = process.communicate(input=part.inline_data.data, timeout=15)
                            
                            if process.returncode == 0:
                                logger.info(f"Audio converted to OGG successfully: {audio_filename}")
                                return audio_path
                            else:
                                logger.error(f"FFmpeg conversion failed: {stderr.decode()}")
                                return None
                                
                        except Exception as e:
                            logger.error(f"Error converting audio with FFmpeg: {e}")
                            return None
            
            logger.error("No audio data received from Gemini AI")
            return None

        except Exception as e:
            logger.error(f"Error generating audio with Gemini AI: {e}")
            return None

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
                return text
            except sr.UnknownValueError:
                return "Could not understand the audio"
            except sr.RequestError as e:
                return f"Speech recognition error: {e}"

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
        """Handle audio chat command from WhatsApp"""
        try:
            from services.whatsapp_service import WhatsAppService
            whatsapp_service = WhatsAppService()
            
            welcome_message = """🎧 **Audio Chat Mode Activated** 

Welcome to NerdX Audio Chat! I can help you with:

🗣️ **Text to Speech**: Send me any question and get an audio response
📸 **Image Analysis**: Send images of problems or notes for audio explanations  
📄 **PDF Reading**: Upload PDFs for audio summaries
🎵 **Voice Messages**: Send voice messages for conversational learning

Just send me your question or content and I'll respond with helpful audio!

⏱️ *Audio responses are limited to 45 seconds maximum*
💡 *Send shorter questions for better audio quality*

Choose your preferred voice and start chatting!"""

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
        """Handle voice type selection"""
        try:
            from services.whatsapp_service import WhatsAppService
            from utils.session_manager import session_manager
            
            whatsapp_service = WhatsAppService()
            
            # Update session with voice preference
            session_manager.save_audio_chat_session(user_id, 'audio_chat', voice_type)
            
            voice_name = "Female" if voice_type == 'female' else "Male"
            response_message = f"✅ **{voice_name} voice selected!**\n\n"
            response_message += "Now send me:\n"
            response_message += "• Any question for audio explanation\n"
            response_message += "• Images of problems or notes\n"
            response_message += "• PDF documents to summarize\n"
            response_message += "• Voice messages to chat\n\n"
            response_message += "🎵 I'll respond with helpful audio explanations!\n"
            response_message += "⏱️ Audio responses limited to 45 seconds\n\n"
            response_message += "Type 'end audio' to exit audio chat mode."
            
            # Add end audio chat button
            buttons = [
                {'id': 'end_audio_chat', 'title': '❌ End Audio Chat'}
            ]
            
            whatsapp_service.send_interactive_message(user_id, response_message, buttons)
            
        except Exception as e:
            logger.error(f"Error handling voice selection: {e}")

    def handle_audio_input(self, user_id: str, message_text: str = None, file_path: str = None, file_type: str = 'text'):
        """Handle various types of input in audio chat mode"""
        try:
            from services.whatsapp_service import WhatsAppService
            from utils.session_manager import session_manager
            from database.external_db import get_user_registration
            
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
            
            # Show processing message
            whatsapp_service.send_message(user_id, "🎵 Generating your audio response...")
            
            content = ""
            ai_response = ""
            
            if file_type == 'image' and file_path:
                content = self.process_image(file_path)
                ai_response = self.generate_ai_response(content, 'image', message_text or "", user_name)
            elif file_type == 'pdf' and file_path:
                content = self.process_pdf(file_path)
                ai_response = self.generate_ai_response(content, 'pdf', message_text or "", user_name)
            elif file_type == 'audio' and file_path:
                content = self.process_audio(file_path)
                ai_response = self.generate_ai_response(content, 'audio', "", user_name)
            else:
                ai_response = self.generate_ai_response(message_text or "", 'text', "", user_name)
            
            # Generate audio response with 45-second limit
            clean_response = self.clean_text_for_audio(ai_response, max_duration_seconds=45)
            audio_path = self.generate_audio(clean_response, voice_type)
            
            if audio_path and os.path.exists(audio_path):
                # Send ONLY audio file via WhatsApp (no text)
                success = whatsapp_service.send_audio_message(user_id, audio_path)
                
                if success:
                    # Send buttons after audio response
                    self.send_audio_response_buttons(user_id)
                else:
                    # If audio sending fails, send error message
                    whatsapp_service.send_message(user_id, "❌ Failed to send audio. Please try again or type 'end audio' to exit.")
                
                # Clean up temporary file
                try:
                    os.remove(audio_path)
                except:
                    pass
            else:
                # If audio generation fails, send error message
                whatsapp_service.send_message(user_id, "❌ Failed to generate audio. Please try again or type 'end audio' to exit.")
            
        except Exception as e:
            logger.error(f"Error handling audio input: {e}")
            from services.whatsapp_service import WhatsAppService
            whatsapp_service = WhatsAppService()
            whatsapp_service.send_message(user_id, "❌ Error processing your audio request. Please try again or type 'end audio' to exit audio chat.")

    def end_audio_chat(self, user_id: str):
        """End audio chat session and return to main menu"""
        try:
            from services.whatsapp_service import WhatsAppService
            from utils.session_manager import session_manager
            
            whatsapp_service = WhatsAppService()
            
            # Clear audio chat session
            session_manager.clear_audio_chat_session(user_id)
            
            # Send confirmation message
            exit_message = "✅ **Audio Chat Ended**\n\n"
            exit_message += "Thanks for using NerdX Audio Chat!\n"
            exit_message += "You've returned to the main menu."
            
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
        """Send buttons after audio response"""
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