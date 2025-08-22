#!/usr/bin/env python3
"""
Audio Chat Service - Multi-Modal AI Assistant with Audio Responses
Integrated for WhatsApp Bot with DeepSeek AI and ElevenLabs TTS
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

# Environment variables
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')

# Task storage (in production, use Redis or database)
audio_tasks = {}

class AudioChatService:
    """Audio Chat service for WhatsApp bot with multi-modal support"""
    
    def __init__(self):
        self.voice_ids = {
            'female': 'EXAVITQu4vr4xnSDxMaL',  # Bella
            'male': 'ErXwobaYiN019PkySvjV'     # Antoni
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

    def clean_text_for_audio(self, text: str) -> str:
        """Clean text by removing markdown formatting and other characters that interfere with audio"""
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
        
        return text

    def generate_ai_response(self, content: str, content_type: str = "text", user_query: str = "") -> str:
        """Generate AI response using DeepSeek API"""
        try:
            if not DEEPSEEK_API_KEY:
                return "AI service is currently unavailable. Please ensure your DeepSeek API key is configured."

            # Construct prompt based on content type
            if content_type == "image":
                prompt = f"User uploaded an image. Extracted text: '{content}'. User's question: {user_query}. Please analyze this image content and provide helpful educational insights."
            elif content_type == "pdf":
                prompt = f"User uploaded a PDF document. Extracted text: '{content[:2000]}...'. User's question: {user_query}. Please summarize this document and answer any educational questions."
            elif content_type == "audio":
                prompt = f"User sent an audio message. Transcribed text: '{content}'. Please respond to this audio message in a conversational educational manner."
            else:
                prompt = f"As an educational assistant for ZIMSEC students, please provide a helpful response to: {content}"

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
        """Generate audio from text using ElevenLabs"""
        try:
            if not ELEVENLABS_API_KEY:
                logger.error("ElevenLabs API key not configured")
                return None

            voice_id = self.voice_ids.get(voice_type, self.voice_ids['female'])

            url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

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

            response = requests.post(url, json=data, headers=headers, timeout=30)

            if response.status_code == 200:
                # Save audio to temporary file
                audio_filename = f"audio_{uuid.uuid4().hex}.mp3"
                audio_path = os.path.join(self.audio_dir, audio_filename)

                with open(audio_path, 'wb') as f:
                    f.write(response.content)

                return audio_path
            else:
                logger.error(f"ElevenLabs API error: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            logger.error(f"Error generating audio: {e}")
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
                return ai_response
                
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

*Note: Audio features require API keys to be configured*

Type 'menu' to return to the main menu."""

            # Send voice preference buttons
            buttons = [
                {'id': 'audio_female_voice', 'title': '👩 Female Voice'},
                {'id': 'audio_male_voice', 'title': '👨 Male Voice'},
                {'id': 'menu', 'title': '🔙 Main Menu'}
            ]
            
            whatsapp_service.send_interactive_message(user_id, welcome_message, buttons)
            
            # Set session state
            from utils.session_manager import session_manager
            session_manager.set_session_data(user_id, {
                'mode': 'audio_chat',
                'voice_type': 'female',
                'step': 'waiting_for_input'
            })
            
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
            session_manager.set_session_data(user_id, {
                'mode': 'audio_chat',
                'voice_type': voice_type,
                'step': 'ready'
            })
            
            voice_name = "Female" if voice_type == 'female' else "Male"
            response_message = f"✅ **{voice_name} voice selected!**\n\n"
            response_message += "Now send me:\n"
            response_message += "• Any question for audio explanation\n"
            response_message += "• Images of problems or notes\n"
            response_message += "• PDF documents to summarize\n"
            response_message += "• Voice messages to chat\n\n"
            response_message += "I'll respond with helpful audio explanations!"
            
            whatsapp_service.send_message(user_id, response_message)
            
        except Exception as e:
            logger.error(f"Error handling voice selection: {e}")

    def handle_audio_input(self, user_id: str, message_text: str = None, file_path: str = None, file_type: str = 'text'):
        """Handle various types of input in audio chat mode"""
        try:
            from services.whatsapp_service import WhatsAppService
            from utils.session_manager import session_manager
            
            whatsapp_service = WhatsAppService()
            
            # Get user's voice preference
            session_data = session_manager.get_session_data(user_id)
            voice_type = session_data.get('voice_type', 'female') if session_data else 'female'
            
            # Show processing message
            whatsapp_service.send_message(user_id, "🎵 Processing your request and generating audio response...")
            
            content = ""
            ai_response = ""
            
            if file_type == 'image' and file_path:
                content = self.process_image(file_path)
                ai_response = self.generate_ai_response(content, 'image', message_text or "")
            elif file_type == 'pdf' and file_path:
                content = self.process_pdf(file_path)
                ai_response = self.generate_ai_response(content, 'pdf', message_text or "")
            elif file_type == 'audio' and file_path:
                content = self.process_audio(file_path)
                ai_response = self.generate_ai_response(content, 'audio')
            else:
                ai_response = self.generate_ai_response(message_text or "", 'text')
            
            # Generate audio response
            clean_response = self.clean_text_for_audio(ai_response)
            audio_path = self.generate_audio(clean_response, voice_type)
            
            if audio_path and os.path.exists(audio_path):
                # Send audio file via WhatsApp
                try:
                    whatsapp_service.send_audio_message(user_id, audio_path)
                except:
                    # Fallback to text if audio sending fails
                    whatsapp_service.send_message(user_id, f"🎧 **Audio Response:**\n\n{ai_response}")
                
                # Clean up temporary file
                try:
                    os.remove(audio_path)
                except:
                    pass
            else:
                # Send text response as fallback
                whatsapp_service.send_message(user_id, f"🎧 **Audio Response (Text Fallback):**\n\n{ai_response}")
            
        except Exception as e:
            logger.error(f"Error handling audio input: {e}")
            from services.whatsapp_service import WhatsAppService
            whatsapp_service = WhatsAppService()
            whatsapp_service.send_message(user_id, "❌ Error processing your audio request. Please try again or type 'menu' to return to main menu.")