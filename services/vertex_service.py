"""
Vertex AI Service for NerdX
Provides image generation using Imagen and text generation using Gemini via Vertex AI
"""
import os
import json
import base64
import logging
import uuid
from typing import Dict, Optional, Any, List, Tuple

logger = logging.getLogger(__name__)

# Credit costs for image questions (units, 1 credit = 10 units)
IMAGE_QUESTION_CREDIT_COST = 40  # 4 credits
TEXT_QUESTION_CREDIT_COST = 10   # 1 credit


class VertexService:
    """
    Service for generating educational images and text using Google Vertex AI.
    Uses:
    - Imagen 4.0 for image generation
    - Gemini 2.5 Flash for text/question generation
    """
    
    def __init__(self):
        """Initialize the Vertex AI service."""
        self.project_id = os.environ.get('GOOGLE_CLOUD_PROJECT', 'gen-lang-client-0303273462')
        self.location = os.environ.get('GOOGLE_CLOUD_LOCATION', 'global')
        self.client = None
        self._initialized = False
        
        # Check if Vertex AI should be used
        if os.environ.get('GOOGLE_GENAI_USE_VERTEXAI', 'True').lower() == 'true':
            self._init_client()
    
    def _init_client(self):
        """Lazy initialization of the Google GenAI client with proper credentials."""
        try:
            from google import genai
            from google.genai.types import HttpOptions
            
            # Set environment variable to use Vertex AI
            os.environ['GOOGLE_GENAI_USE_VERTEXAI'] = 'True'
            
            # Check for service account credentials
            credentials_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
            service_account_json = os.environ.get('GOOGLE_SERVICE_ACCOUNT_JSON')
            
            if credentials_path and os.path.exists(credentials_path):
                logger.info(f"Using credentials file: {credentials_path}")
                # Credentials file exists, google-genai will use it automatically
                self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
            elif service_account_json:
                # Service account JSON provided as environment variable
                import tempfile
                logger.info("Using inline service account JSON from environment")
                
                # Write JSON to temp file for google-genai to use
                with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
                    f.write(service_account_json)
                    temp_creds_path = f.name
                
                os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = temp_creds_path
                self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
            else:
                # Try default credentials (ADC)
                logger.info("Using Application Default Credentials")
                self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
            
            self._initialized = True
            logger.info(f"✅ Vertex AI client initialized successfully (project: {self.project_id})")
        except ImportError as e:
            logger.error(f"❌ Failed to import google-genai SDK. Install with: pip install google-genai. Error: {e}")
            self._initialized = False
        except Exception as e:
            logger.error(f"❌ Failed to initialize Vertex AI client: {e}")
            self._initialized = False
    
    def is_available(self) -> bool:
        """Check if Vertex AI service is available."""
        return self._initialized and self.client is not None
    
    def generate_image(self, prompt: str, size: str = "1K") -> Optional[Dict[str, Any]]:
        """
        Generate an image using Vertex AI Imagen model.
        
        Args:
            prompt: Text prompt describing the image to generate
            size: Image size - "1K" (1024x1024) or "2K" (2048x2048)
        
        Returns:
            Dict with 'success', 'image_base64', 'image_bytes' or 'error'
        """
        if not self.is_available():
            return {'success': False, 'error': 'Vertex AI service not available'}
        
        try:
            from google.genai.types import GenerateImagesConfig
            
            logger.info(f"🖼️ Generating image with prompt: {prompt[:100]}...")
            
            response = self.client.models.generate_images(
                model="imagen-4.0-generate-001",
                prompt=prompt,
                config=GenerateImagesConfig(
                    number_of_images=1,
                    image_size=size,
                    safety_filter_level="block_few",  # Allow educational content
                    person_generation="dont_allow",   # Safer for education
                ),
            )
            
            if response.generated_images and len(response.generated_images) > 0:
                image_bytes = response.generated_images[0].image.image_bytes
                image_base64 = base64.b64encode(image_bytes).decode('utf-8')
                
                logger.info(f"✅ Image generated successfully ({len(image_bytes)} bytes)")
                
                return {
                    'success': True,
                    'image_base64': image_base64,
                    'image_bytes': image_bytes,
                    'size': size
                }
            else:
                logger.warning("⚠️ No images generated in response")
                return {'success': False, 'error': 'No images generated'}
                
        except Exception as e:
            logger.error(f"❌ Image generation failed: {e}")
            return {'success': False, 'error': str(e)}
    
    def generate_text(self, prompt: str, model: str = "gemini-2.5-flash") -> Optional[Dict[str, Any]]:
        """
        Generate text using Vertex AI Gemini model.
        
        Args:
            prompt: Text prompt for generation
            model: Gemini model to use
        
        Returns:
            Dict with 'success', 'text' or 'error'
        """
        if not self.is_available():
            return {'success': False, 'error': 'Vertex AI service not available'}
        
        try:
            logger.info(f"📝 Generating text with model {model}...")
            
            response = self.client.models.generate_content(
                model=model,
                contents=prompt,
            )
            
            if response and response.text:
                logger.info("✅ Text generated successfully")
                return {
                    'success': True,
                    'text': response.text
                }
            else:
                return {'success': False, 'error': 'No text generated'}
                
        except Exception as e:
            logger.error(f"❌ Text generation failed: {e}")
            return {'success': False, 'error': str(e)}
    
    def analyze_image(
        self, 
        image_base64: str, 
        mime_type: str = "image/png", 
        prompt: str = None
    ) -> Optional[Dict[str, Any]]:
        """
        Analyze an image using Vertex AI Gemini multimodal model.
        
        Args:
            image_base64: Base64-encoded image data
            mime_type: MIME type of the image (image/png, image/jpeg, etc.)
            prompt: Custom prompt for analysis (default: extract math/text)
        
        Returns:
            Dict with 'success', 'text', 'latex', 'confidence' or 'error'
        """
        if not self.is_available():
            return {'success': False, 'error': 'Vertex AI service not available'}
        
        try:
            from google.genai.types import Part, Content
            
            logger.info(f"🔍 Analyzing image with Gemini Vision...")
            
            # Default prompt for math OCR
            if not prompt:
                prompt = """Analyze this image and extract any mathematical equations, expressions, text, or handwritten content.

Please respond in this exact JSON format:
{
    "detected_text": "the exact text/math expression you see",
    "latex": "the LaTeX representation if it's math, or the plain text otherwise",
    "confidence": 0.95,
    "content_type": "math" or "text" or "diagram"
}

If you see handwritten math, interpret it as accurately as possible. Convert fractions, exponents, roots, and special symbols to proper LaTeX notation.
Only respond with the JSON, no other text."""

            # Create the image part
            image_part = Part.from_bytes(
                data=base64.b64decode(image_base64),
                mime_type=mime_type
            )
            
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[image_part, prompt],
            )
            
            if response and response.text:
                # Try to parse JSON response
                result_data = self._parse_json_response(response.text)
                
                if result_data:
                    logger.info(f"✅ Image analyzed successfully")
                    return {
                        'success': True,
                        'text': result_data.get('detected_text', ''),
                        'latex': result_data.get('latex', result_data.get('detected_text', '')),
                        'confidence': result_data.get('confidence', 0.9),
                        'content_type': result_data.get('content_type', 'text'),
                        'raw_response': response.text
                    }
                else:
                    # Return raw text if JSON parsing fails
                    logger.info(f"✅ Image analyzed (raw text)")
                    return {
                        'success': True,
                        'text': response.text,
                        'latex': response.text,
                        'confidence': 0.8,
                        'content_type': 'text'
                    }
            else:
                return {'success': False, 'error': 'No response from model'}
                
        except Exception as e:
            logger.error(f"❌ Image analysis failed: {e}")
            return {'success': False, 'error': str(e)}

    def analyze_images_context_pack(
        self,
        *,
        images: List[Tuple[bytes, str]],
        user_prompt: str,
        model: str = "gemini-2.5-flash",
    ) -> Optional[Dict[str, Any]]:
        """
        Analyze up to 10 images in ONE multimodal prompt and return strict JSON suitable
        for persistence as a "Context Pack".

        Returns (dict):
        {
          "images": [
            { "index": 0, "short_description": "...", "extracted_text": "", "key_concepts": [], "subject_guess": "Math", "confidence_notes": "" }
          ],
          "combined_summary": "...",
          "follow_up_questions_suggestions": ["..."]
        }
        """
        if not self.is_available():
            return {'success': False, 'error': 'Vertex AI service not available'}

        if not images or len(images) < 1:
            return {'success': False, 'error': 'At least one image is required'}
        if len(images) > 10:
            return {'success': False, 'error': 'Too many images (max 10)'}

        try:
            from google.genai.types import Part

            instruction = f"""You are NerdX Visual Context Extractor for education.
The user will attach 1 to {len(images)} images and may include an instruction.

Your job:
1) For each image: describe what you see (1–2 sentences), extract any text, infer key concepts, and guess subject.
2) Provide a combined summary (short paragraph) that can be used for follow-up chat.
3) Provide suggested next actions/questions (3–8 items).

IMPORTANT:
- If an image is unclear, DO NOT answer "I don't know". Instead say what is unclear and how to retake it, and still attempt best-effort extraction.
- Output MUST be valid JSON ONLY (no markdown, no extra words).

Schema (exact keys):
{{
  "images": [
    {{
      "index": 0,
      "short_description": "max 2 sentences",
      "extracted_text": "best-effort OCR text, else empty string",
      "key_concepts": ["3-8 tags"],
      "subject_guess": "Math|Science|Accounting|English|Other",
      "confidence_notes": "why confident/uncertain; if unclear include retake advice"
    }}
  ],
  "combined_summary": "short paragraph",
  "follow_up_questions_suggestions": ["3-8 items"]
}}

User instruction: {user_prompt.strip() if user_prompt else "(none)"}"""

            parts: List[Any] = []
            for data, mime_type in images:
                parts.append(
                    Part.from_bytes(data=data, mime_type=mime_type)
                )
            parts.append(instruction)

            logger.info(f"🖼️ ContextPack: analyzing {len(images)} images with {model} (Vertex)")

            response = self.client.models.generate_content(
                model=model,
                contents=parts,
            )

            if response and response.text:
                parsed = self._parse_json_response(response.text)
                if parsed:
                    return parsed

                # If parsing fails, return a safe failure with raw text for debugging.
                return {
                    "success": False,
                    "error": "Failed to parse model JSON output",
                    "raw_response": response.text,
                }

            return {'success': False, 'error': 'No response from model'}
        except Exception as e:
            logger.error(f"❌ ContextPack image analysis failed: {e}", exc_info=True)
            return {'success': False, 'error': str(e)}
    
    def transcribe_audio(
        self, 
        audio_base64: str, 
        mime_type: str = "audio/mp4"
    ) -> Optional[Dict[str, Any]]:
        """
        Transcribe audio to text using Google Cloud Speech-to-Text API (recommended).
        Falls back to Gemini multimodal if Speech-to-Text API is not available.
        
        Args:
            audio_base64: Base64-encoded audio data
            mime_type: MIME type of the audio (audio/mp4, audio/wav, audio/mp3, etc.)
        
        Returns:
            Dict with 'success', 'text', 'language' or 'error'
        """
        if not self.is_available():
            return {'success': False, 'error': 'Vertex AI service not available'}
        
        # PRIMARY: Try Google Cloud Speech-to-Text API (recommended by Vertex AI docs)
        try:
            from google.cloud import speech_v1
            from google.cloud.speech_v1 import types as speech_types
            import io
            
            logger.info(f"🎤 Transcribing audio with Google Cloud Speech-to-Text API...")
            
            # Initialize Speech-to-Text client
            client = speech_v1.SpeechClient()
            
            # Decode audio data
            audio_data = base64.b64decode(audio_base64)
            
            # Map MIME types to Speech-to-Text encoding
            # Use ENCODING_UNSPECIFIED for compressed formats (API will auto-detect)
            encoding_map = {
                'audio/wav': speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
                'audio/mp3': speech_v1.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
                'audio/mp4': speech_v1.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
                'audio/webm': speech_v1.RecognitionConfig.AudioEncoding.WEBM_OPUS,
                'audio/ogg': speech_v1.RecognitionConfig.AudioEncoding.OGG_OPUS,
            }
            
            # Get encoding (use ENCODING_UNSPECIFIED for unknown - API will auto-detect)
            encoding = encoding_map.get(mime_type, speech_v1.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED)
            
            # Configure recognition
            # For compressed formats (MP3, MP4), use ENCODING_UNSPECIFIED and let API detect
            config = speech_v1.RecognitionConfig(
                encoding=encoding,
                sample_rate_hertz=16000,  # Optional for compressed formats, required for LINEAR16
                language_code='en-US',  # Can be made configurable
                enable_automatic_punctuation=True,
                model='latest_long',  # Best for longer audio (> 60 seconds)
            )
            
            # Create audio object
            audio = speech_v1.RecognitionAudio(content=audio_data)
            
            # Perform transcription
            response = client.recognize(config=config, audio=audio)
            
            # Extract transcript
            transcript_texts = []
            for result in response.results:
                if result.alternatives:
                    transcript_texts.append(result.alternatives[0].transcript)
            
            if transcript_texts:
                transcribed_text = ' '.join(transcript_texts).strip()
                logger.info(f"✅ Audio transcribed with Speech-to-Text API: {transcribed_text[:50]}...")
                return {
                    'success': True,
                    'text': transcribed_text,
                    'language': 'en-US'
                }
            else:
                logger.warning("Speech-to-Text API returned no results, trying Gemini fallback...")
                
        except ImportError:
            logger.warning("google-cloud-speech not installed, using Gemini fallback. Install with: pip install google-cloud-speech")
        except Exception as e:
            logger.warning(f"Speech-to-Text API failed, trying Gemini fallback: {e}")
        
        # FALLBACK: Use Gemini multimodal (works but not recommended for production)
        try:
            from google.genai.types import Part
            
            logger.info(f"🎤 Transcribing audio with Gemini multimodal (fallback)...")
            
            # Create the audio part
            audio_part = Part.from_bytes(
                data=base64.b64decode(audio_base64),
                mime_type=mime_type
            )
            
            transcription_prompt = """Transcribe this audio to text. 
If the speech contains mathematical expressions, write them in a clear format.
Only return the transcribed text, nothing else."""
            
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[audio_part, transcription_prompt],
            )
            
            if response and response.text:
                transcribed_text = response.text.strip()
                logger.info(f"✅ Audio transcribed with Gemini: {transcribed_text[:50]}...")
                return {
                    'success': True,
                    'text': transcribed_text,
                    'language': 'en'  # Default to English
                }
            else:
                return {'success': False, 'error': 'No transcription generated'}
                
        except Exception as e:
            logger.error(f"❌ Audio transcription failed: {e}")
            return {'success': False, 'error': str(e)}
    
    def analyze_document(
        self, 
        document_base64: str, 
        mime_type: str = "application/pdf",
        prompt: str = None
    ) -> Optional[Dict[str, Any]]:
        """
        Analyze a document (PDF or text file) using Vertex AI Gemini multimodal model.
        
        Supported MIME types: application/pdf, text/plain
        Max file size: 50 MB
        
        Args:
            document_base64: Base64-encoded document data
            mime_type: MIME type of the document (application/pdf or text/plain)
            prompt: Custom prompt for analysis (default: summarize and extract key points)
        
        Returns:
            Dict with 'success', 'analysis', 'summary' or 'error'
        """
        if not self.is_available():
            return {'success': False, 'error': 'Vertex AI service not available'}
        
        try:
            from google.genai.types import Part
            
            logger.info(f"📄 Analyzing document with Gemini ({mime_type})...")
            
            # Default prompt for document analysis
            if not prompt:
                prompt = """You are a professional document analysis specialist. Please analyze this document and provide:

1. **Summary**: A concise summary of the main content (2-3 paragraphs)
2. **Key Points**: List the most important points, facts, or findings
3. **Topics Covered**: Main topics or subjects discussed
4. **Relevant Information**: Any data, statistics, or notable quotes

If this is an educational document, also identify:
- Subject/topic area
- Difficulty level
- Key concepts students should understand

Format your response clearly with headers and bullet points for easy reading."""

            # Create the document part
            document_part = Part.from_bytes(
                data=base64.b64decode(document_base64),
                mime_type=mime_type
            )
            
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[document_part, prompt],
            )
            
            if response and response.text:
                analysis_text = response.text.strip()
                logger.info(f"✅ Document analyzed successfully ({len(analysis_text)} chars)")
                return {
                    'success': True,
                    'analysis': analysis_text,
                    'summary': analysis_text[:500] + ('...' if len(analysis_text) > 500 else ''),
                    'mime_type': mime_type
                }
            else:
                return {'success': False, 'error': 'No analysis generated'}
                
        except Exception as e:
            logger.error(f"❌ Document analysis failed: {e}")
            return {'success': False, 'error': str(e)}
    
    def generate_image_question(
        self,
        subject: str,
        topic: str,
        level: str = "O-Level",
        difficulty: str = "medium"
    ) -> Optional[Dict[str, Any]]:
        """
        Generate an educational science question with an accompanying image.
        
        This method:
        1. Uses Gemini to generate a question that benefits from visual representation
        2. Uses Imagen to generate the educational diagram/image
        3. Returns both combined for the quiz system
        
        Args:
            subject: Science subject (Biology, Chemistry, Physics)
            topic: Specific topic within the subject
            level: Educational level (O-Level, A-Level)
            difficulty: Question difficulty (easy, medium, difficult)
        
        Returns:
            Dict containing the question, options, answer, explanation, and image
        """
        if not self.is_available():
            logger.warning("Vertex AI not available, cannot generate image question")
            return None
        
        try:
            # Step 1: Generate question text and image prompt using Gemini
            question_prompt = self._create_image_question_prompt(subject, topic, level, difficulty)
            
            text_result = self.generate_text(question_prompt)
            
            if not text_result or not text_result.get('success'):
                logger.error("Failed to generate question text")
                return None
            
            # Parse the JSON response
            question_data = self._parse_json_response(text_result['text'])
            
            if not question_data:
                logger.error("Failed to parse question JSON")
                return None
            
            # Step 2: Generate the image using the image prompt from Gemini
            image_prompt = question_data.get('image_prompt', '')
            
            if not image_prompt:
                logger.warning("No image prompt in question data, using fallback")
                image_prompt = f"Educational scientific diagram showing {topic} for {subject} class. Clean, clear, labeled diagram suitable for students."
            
            image_result = self.generate_image(image_prompt, size="1K")
            
            if not image_result or not image_result.get('success'):
                logger.warning(f"Image generation failed: {image_result.get('error', 'Unknown error')}")
                # Still return the question even without image
                question_data['image_generation_error'] = image_result.get('error', 'Unknown error')
            else:
                # Save image and get URL
                image_url = self._save_image_to_static(
                    image_result['image_bytes'],
                    f"quiz_{subject}_{topic}_{uuid.uuid4().hex[:8]}.png"
                )
                question_data['question_image_url'] = image_url
                question_data['image_base64'] = image_result['image_base64']
            
            # Add metadata
            question_data['question_type'] = 'visual'
            question_data['credit_cost'] = IMAGE_QUESTION_CREDIT_COST
            question_data['source'] = 'vertex_ai_imagen'
            question_data['id'] = f"img_{uuid.uuid4().hex[:12]}"
            
            logger.info(f"✅ Image question generated for {subject}/{topic}")
            return question_data
            
        except Exception as e:
            logger.error(f"❌ Failed to generate image question: {e}")
            return None
    
    def _create_image_question_prompt(self, subject: str, topic: str, level: str, difficulty: str) -> str:
        """Create a prompt for generating a science question that benefits from visual representation."""
        
        visual_question_types = {
            "Biology": [
                "Label the parts of a diagram",
                "Identify structures in a cell/organism",
                "Interpret a process diagram",
                "Analyze a food web or ecosystem diagram"
            ],
            "Chemistry": [
                "Identify molecular structures",
                "Interpret apparatus setup diagrams",
                "Analyze reaction diagrams",
                "Identify atomic/molecular models"
            ],
            "Physics": [
                "Analyze circuit diagrams",
                "Interpret force diagrams",
                "Analyze wave patterns",
                "Identify energy transfer diagrams"
            ]
        }
        
        subject_types = visual_question_types.get(subject, visual_question_types["Biology"])
        
        return f"""You are an expert {level} {subject} teacher creating a visual-based multiple choice question.

TASK: Generate a question on "{topic}" that requires students to interpret or analyze a scientific image/diagram.

QUESTION STYLE: Choose from these visual question types:
{chr(10).join(f"- {qt}" for qt in subject_types)}

REQUIREMENTS:
- Subject: {subject}
- Topic: {topic}
- Level: {level} (ZIMSEC/Cambridge style)
- Difficulty: {difficulty}
- The question MUST require looking at an image to answer
- Provide 4 clear options (A, B, C, D)
- Include a detailed explanation

OUTPUT: Return ONLY valid JSON (no markdown, no extra text):
{{
    "question": "Based on the diagram shown, [question text that requires image analysis]",
    "options": {{
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
    }},
    "correct_answer": "B",
    "explanation": "Detailed scientific explanation of why the answer is correct (4-6 sentences)",
    "teaching_explanation": "Friendly teacher explanation with real-world connection",
    "image_prompt": "Detailed prompt for generating educational diagram: [describe the exact image needed, including labels, colors, style - must be educational and clear]",
    "image_description": "Brief description of what the image shows for accessibility",
    "difficulty": "{difficulty}",
    "topic": "{topic}",
    "subject": "{subject}",
    "learning_objective": "What students learn from this visual question"
}}

Generate a high-quality visual science question now!"""

    def _parse_json_response(self, text: str) -> Optional[Dict]:
        """Parse JSON from text response, handling markdown code blocks."""
        try:
            # Try direct parse first
            return json.loads(text)
        except json.JSONDecodeError:
            pass
        
        # Try to extract JSON from markdown code block
        try:
            json_start = text.find('{')
            json_end = text.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = text[json_start:json_end]
                return json.loads(json_str)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed: {e}")
        
        return None
    
    def _save_image_to_static(self, image_bytes: bytes, filename: str) -> str:
        """Save image bytes to static folder and return public URL."""
        try:
            # Ensure static/quiz_images directory exists
            static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'quiz_images')
            os.makedirs(static_dir, exist_ok=True)
            
            filepath = os.path.join(static_dir, filename)
            
            with open(filepath, 'wb') as f:
                f.write(image_bytes)
            
            logger.info(f"✅ Image saved to {filepath}")
            
            # Return relative URL for the app
            return f"/static/quiz_images/{filename}"
            
        except Exception as e:
            logger.error(f"❌ Failed to save image: {e}")
            return ""


# Singleton instance
vertex_service = VertexService()


def get_image_question_credit_cost() -> int:
    """Get the credit cost for image questions."""
    return IMAGE_QUESTION_CREDIT_COST


def get_text_question_credit_cost() -> int:
    """Get the credit cost for text questions."""
    return TEXT_QUESTION_CREDIT_COST
