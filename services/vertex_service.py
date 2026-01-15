"""
Vertex AI Service for NerdX
Provides image generation using Imagen and text generation using Gemini via Vertex AI
"""
import os
import json
import base64
import logging
import uuid
from typing import Dict, Optional, Any

logger = logging.getLogger(__name__)

# Credit costs for image questions (scale of 1-5)
IMAGE_QUESTION_CREDIT_COST = 4  # Image questions cost 4 credits
TEXT_QUESTION_CREDIT_COST = 1   # Normal text questions cost 1 credit


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
