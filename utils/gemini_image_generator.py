"""
Gemini Image Generator for Project Assistant
Uses Google Gemini via Vertex AI for generating visual aids
"""

import logging
import os
import base64
from typing import Optional

logger = logging.getLogger(__name__)

# Try to import google-genai SDK (Vertex AI)
try:
    from google import genai
    from google.genai.types import HttpOptions
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    HttpOptions = None
    GENAI_AVAILABLE = False


class GeminiImageGenerator:
    """Handles image generation using Gemini via Vertex AI"""
    
    def __init__(self):
        self.client = None
        self._is_configured = False
        
        # Vertex AI configuration (preferred - higher rate limits)
        self.project_id = os.environ.get('GOOGLE_CLOUD_PROJECT', 'gen-lang-client-0303273462')
        self.use_vertex_ai = os.environ.get('GOOGLE_GENAI_USE_VERTEXAI', 'True').lower() == 'true'
        
        # Fallback API key
        self.api_key = os.environ.get('GEMINI_API_KEY')
        
        if GENAI_AVAILABLE:
            self._init_client()
        else:
            logger.warning("google-genai SDK not available for image generation")
    
    def _init_client(self):
        """Initialize Gemini client with Vertex AI or API key."""
        try:
            # Try Vertex AI first (higher rate limits)
            if self.use_vertex_ai:
                os.environ['GOOGLE_GENAI_USE_VERTEXAI'] = 'True'
                credentials_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
                service_account_json = os.environ.get('GOOGLE_SERVICE_ACCOUNT_JSON')
                
                if credentials_path and os.path.exists(credentials_path):
                    self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
                    self._is_configured = True
                    logger.info(f"GeminiImageGenerator: Configured via Vertex AI (project: {self.project_id})")
                    return
                elif service_account_json:
                    import tempfile
                    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
                        f.write(service_account_json)
                        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = f.name
                    self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
                    self._is_configured = True
                    logger.info("GeminiImageGenerator: Configured via Vertex AI (inline credentials)")
                    return
                else:
                    # Try ADC
                    try:
                        self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
                        self._is_configured = True
                        logger.info("GeminiImageGenerator: Configured via Vertex AI (ADC)")
                        return
                    except Exception:
                        logger.warning("Vertex AI ADC failed, trying API key...")
            
            # Fallback to API key
            if self.api_key:
                self.client = genai.Client(api_key=self.api_key)
                self._is_configured = True
                logger.info("GeminiImageGenerator: Configured with API key (fallback)")
        except Exception as e:
            logger.error(f"Error initializing GeminiImageGenerator: {e}")
            self._is_configured = False
    
    def generate(self, prompt: str, aspect_ratio: str = "16:9") -> Optional[str]:
        """
        Generate an image from a text prompt
        
        Args:
            prompt: Text description of the desired image
            aspect_ratio: Image aspect ratio (default: "16:9")
            
        Returns:
            URL or base64 data URL of the generated image, or None if failed
        """
        try:
            if not self._is_configured or not self.client:
                logger.error("GeminiImageGenerator not configured")
                return None
            
            # Use Gemini model for image generation
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "response_modalities": ["IMAGE"],
                    "image_config": {
                        "aspect_ratio": aspect_ratio
                    }
                }
            )
            
            # Extract image data from response
            if response and response.candidates:
                for candidate in response.candidates:
                    if hasattr(candidate, 'content') and candidate.content:
                        for part in candidate.content.parts:
                            if hasattr(part, 'inline_data') and part.inline_data:
                                mime_type = part.inline_data.mime_type or 'image/png'
                                image_data = base64.b64encode(part.inline_data.data).decode('utf-8')
                                
                                # Return as data URL
                                data_url = f"data:{mime_type};base64,{image_data}"
                                return data_url
            
            logger.error(f"No image found in Gemini response")
            return None
                
        except Exception as e:
            logger.error(f"Error generating image with Gemini: {e}", exc_info=True)
            return None
    
    def generate_educational_diagram(self, topic: str, diagram_type: str = "flowchart") -> Optional[str]:
        """
        Generate an educational diagram for a specific topic
        
        Args:
            topic: The subject matter of the diagram
            diagram_type: Type of diagram (flowchart, mindmap, process, etc.)
            
        Returns:
            URL of the generated diagram image
        """
        prompt = f"Create a professional, educational {diagram_type} diagram about: {topic}. "
        prompt += "Use clear labels, arrows, and organized layout. Make it suitable for a school project presentation. "
        prompt += "Use colors that are easy to read and print."
        
        return self.generate(prompt)
    
    def generate_poster(self, title: str, key_points: list, theme: str = "academic") -> Optional[str]:
        """
        Generate a project poster/presentation visual
        
        Args:
            title: Poster title
            key_points: List of main points to include
            theme: Visual theme (academic, modern, creative, etc.)
            
        Returns:
            URL of the generated poster image
        """
        prompt = f"Create a professional {theme} poster with the title '{title}'. "
        prompt += "Include these key points clearly visible: "
        prompt += ", ".join(key_points[:5])  # Limit to 5 points
        prompt += ". Use a clean layout with good contrast, readable fonts, and appropriate visual elements. "
        prompt += "Suitable for a ZIMSEC school project presentation."
        
        return self.generate(prompt, aspect_ratio="9:16")

