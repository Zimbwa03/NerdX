#!/usr/bin/env python3
"""
Audio Chat Feature - Multi-Modal AI Assistant with Audio Responses
Supports text, image, PDF, and audio inputs with ElevenLabs TTS responses
"""

import os
import json
import uuid
import threading
import time
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
import tempfile
import shutil
from typing import Dict, Optional

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

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins="*")

# Environment variables
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')

# Task storage (in production, use Redis or database)
tasks = {}

class TaskManager:
    """Manage asynchronous tasks for audio chat processing"""

    @staticmethod
    def create_task(task_type: str, data: Dict) -> str:
        """Create a new processing task"""
        task_id = str(uuid.uuid4())
        tasks[task_id] = {
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

    @staticmethod
    def update_task(task_id: str, updates: Dict):
        """Update task status and data"""
        if task_id in tasks:
            tasks[task_id].update(updates)

    @staticmethod
    def get_task(task_id: str) -> Optional[Dict]:
        """Get task by ID"""
        return tasks.get(task_id)

def clean_text_for_audio(text):
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

class DeepSeekService:
    """DeepSeek AI integration for intelligent responses"""

    @staticmethod
    def generate_response(content: str, content_type: str = "text", user_query: str = "") -> str:
        """Generate AI response based on content type"""
        try:
            if not DEEPSEEK_API_KEY:
                return "DeepSeek API key not configured"

            # Construct prompt based on content type
            if content_type == "image":
                prompt = f"User uploaded an image. Extracted text: '{content}'. User's question: {user_query}. Please analyze this image content and provide helpful insights."
            elif content_type == "pdf":
                prompt = f"User uploaded a PDF document. Extracted text: '{content[:2000]}...'. User's question: {user_query}. Please summarize this document and answer any questions."
            elif content_type == "audio":
                prompt = f"User sent an audio message. Transcribed text: '{content}'. Please respond to this audio message in a conversational manner."
            else:
                prompt = content

            headers = {
                'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
                'Content-Type': 'application/json'
            }

            data = {
                'model': 'deepseek-chat',
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a helpful AI assistant that provides clear, concise, and informative responses. When analyzing content from images, PDFs, or audio, provide insights and answer questions based on the extracted content. Always maintain context and provide relevant, actionable information. IMPORTANT: Use plain text only - no markdown formatting, asterisks, hashtags, or special characters. Write in a natural speaking style that sounds good when read aloud.'
                    },
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'max_tokens': 1000,
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

class ElevenLabsService:
    """ElevenLabs text-to-speech integration"""

    VOICE_IDS = {
        'female': 'EXAVITQu4vr4xnSDxMaL',  # Bella
        'male': 'ErXwobaYiN019PkySvjV'     # Antoni
    }

    @staticmethod
    def generate_audio(text: str, voice_type: str = 'female') -> Optional[str]:
        """Generate audio from text using ElevenLabs"""
        try:
            if not ELEVENLABS_API_KEY:
                logger.error("ElevenLabs API key not configured")
                return None

            voice_id = ElevenLabsService.VOICE_IDS.get(voice_type, ElevenLabsService.VOICE_IDS['female'])

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
                audio_path = os.path.join("temp_audio", audio_filename)

                # Create temp directory if it doesn't exist
                os.makedirs("temp_audio", exist_ok=True)

                with open(audio_path, 'wb') as f:
                    f.write(response.content)

                return audio_filename
            else:
                logger.error(f"ElevenLabs API error: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            logger.error(f"Error generating audio: {e}")
            return None

class ContentProcessor:
    """Process different types of content (images, PDFs, audio)"""

    @staticmethod
    def process_image(file_path: str) -> str:
        """Extract text from image using OCR"""
        try:
            if not pytesseract or not Image:
                return "Image processing not available (Tesseract not installed)"

            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)

            if not text.strip():
                return "No text detected in the image"

            return text.strip()
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            return "Error processing image"

    @staticmethod
    def process_pdf(file_path: str) -> str:
        """Extract text from PDF"""
        try:
            if not PyPDF2:
                return "PDF processing not available (PyPDF2 not installed)"

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

    @staticmethod
    def process_audio(file_path: str) -> str:
        """Transcribe audio to text"""
        try:
            if not sr:
                return "Audio processing not available (SpeechRecognition not installed)"

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

def process_chat_request(task_id: str, content: str, content_type: str, voice_type: str, user_query: str = ""):
    """Process chat request asynchronously"""
    try:
        # Generate AI response
        ai_response = DeepSeekService.generate_response(content, content_type, user_query)

        # Update task with AI response
        TaskManager.update_task(task_id, {'ai_response': ai_response})

        # Clean the AI response for audio generation
        clean_response = clean_text_for_audio(ai_response)

        # Generate audio response using cleaned text
        audio_filename = ElevenLabsService.generate_audio(clean_response, voice_type)

        if audio_filename:
            audio_url = f"/api/audio/{audio_filename}"
            TaskManager.update_task(task_id, {
                'status': 'completed',
                'audio_url': audio_url
            })
        else:
            TaskManager.update_task(task_id, {
                'status': 'failed',
                'error': 'Failed to generate audio response'
            })

    except Exception as e:
        logger.error(f"Error processing chat request: {e}")
        TaskManager.update_task(task_id, {
            'status': 'failed',
            'error': str(e)
        })

# API Endpoints

@app.route('/api/chat/text', methods=['POST'])
def chat_text():
    """Handle text input for chat"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        voice_type = data.get('voice_type', 'female')

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        # Create task
        task_id = TaskManager.create_task('text', {'text': text, 'voice_type': voice_type})

        # Process asynchronously
        threading.Thread(
            target=process_chat_request,
            args=(task_id, text, 'text', voice_type)
        ).start()

        return jsonify({'task_id': task_id, 'status': 'processing'})

    except Exception as e:
        logger.error(f"Error in text chat: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/chat/image', methods=['POST'])
def chat_image():
    """Handle image upload for chat"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        voice_type = request.form.get('voice_type', 'female')
        user_query = request.form.get('text', '').strip()

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
        if not ('.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
            return jsonify({'error': 'Invalid file type'}), 400

        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.rsplit('.', 1)[1]}") as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name

        try:
            # Extract text from image
            extracted_text = ContentProcessor.process_image(temp_path)

            # Create task
            task_id = TaskManager.create_task('image', {
                'extracted_text': extracted_text,
                'user_query': user_query,
                'voice_type': voice_type
            })

            # Process asynchronously
            threading.Thread(
                target=process_chat_request,
                args=(task_id, extracted_text, 'image', voice_type, user_query)
            ).start()

            return jsonify({
                'task_id': task_id,
                'status': 'processing',
                'extracted_text': extracted_text
            })

        finally:
            # Clean up temp file
            os.unlink(temp_path)

    except Exception as e:
        logger.error(f"Error in image chat: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/chat/pdf', methods=['POST'])
def chat_pdf():
    """Handle PDF upload for chat"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        voice_type = request.form.get('voice_type', 'female')
        user_query = request.form.get('text', '').strip()

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are allowed'}), 400

        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name

        try:
            # Extract text from PDF
            extracted_text = ContentProcessor.process_pdf(temp_path)

            # Create task
            task_id = TaskManager.create_task('pdf', {
                'extracted_text': extracted_text,
                'user_query': user_query,
                'voice_type': voice_type
            })

            # Process asynchronously
            threading.Thread(
                target=process_chat_request,
                args=(task_id, extracted_text, 'pdf', voice_type, user_query)
            ).start()

            return jsonify({
                'task_id': task_id,
                'status': 'processing',
                'extracted_text': extracted_text[:500] + "..." if len(extracted_text) > 500 else extracted_text
            })

        finally:
            # Clean up temp file
            os.unlink(temp_path)

    except Exception as e:
        logger.error(f"Error in PDF chat: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/chat/audio', methods=['POST'])
def chat_audio():
    """Handle audio upload for chat"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        voice_type = request.form.get('voice_type', 'female')

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Validate file type
        allowed_extensions = {'wav', 'mp3', 'm4a', 'flac'}
        if not ('.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
            return jsonify({'error': 'Invalid audio file type'}), 400

        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.rsplit('.', 1)[1]}") as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name

        try:
            # Transcribe audio
            transcribed_text = ContentProcessor.process_audio(temp_path)

            # Create task
            task_id = TaskManager.create_task('audio', {
                'transcribed_text': transcribed_text,
                'voice_type': voice_type
            })

            # Process asynchronously
            threading.Thread(
                target=process_chat_request,
                args=(task_id, transcribed_text, 'audio', voice_type)
            ).start()

            return jsonify({
                'task_id': task_id,
                'status': 'processing',
                'transcribed_text': transcribed_text
            })

        finally:
            # Clean up temp file
            os.unlink(temp_path)

    except Exception as e:
        logger.error(f"Error in audio chat: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/chat/status/<task_id>', methods=['GET'])
def get_task_status(task_id):
    """Get task status and results"""
    try:
        task = TaskManager.get_task(task_id)

        if not task:
            return jsonify({'error': 'Task not found'}), 404

        return jsonify({
            'task_id': task['id'],
            'status': task['status'],
            'ai_response': task.get('ai_response'),
            'audio_url': task.get('audio_url'),
            'error': task.get('error')
        })

    except Exception as e:
        logger.error(f"Error getting task status: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/audio/<filename>', methods=['GET'])
def serve_audio(filename):
    """Serve generated audio files"""
    try:
        audio_path = os.path.join("temp_audio", filename)

        if not os.path.exists(audio_path):
            return jsonify({'error': 'Audio file not found'}), 404

        return send_file(audio_path, mimetype='audio/mpeg')

    except Exception as e:
        logger.error(f"Error serving audio: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/voices', methods=['GET'])
def get_voices():
    """Get available voice options"""
    return jsonify({
        'voices': [
            {'id': 'female', 'name': 'Female Voice'},
            {'id': 'male', 'name': 'Male Voice'}
        ]
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Audio Chat API',
        'deepseek_configured': bool(DEEPSEEK_API_KEY),
        'elevenlabs_configured': bool(ELEVENLABS_API_KEY)
    })

# The audio chat API server is initialized and started, replacing the original initialization in the file.
if __name__ == '__main__':
    # Create temp directory for audio files
    os.makedirs("temp_audio", exist_ok=True)

    logger.info("Starting Audio Chat API...")
    logger.info(f"DeepSeek configured: {bool(DEEPSEEK_API_KEY)}")
    logger.info(f"ElevenLabs configured: {bool(ELEVENLABS_API_KEY)}")

    logger.info("Starting Audio Chat API server...")
    app.run(host='0.0.0.0', port=5001, debug=True)