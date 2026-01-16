"""
Gemini Interactions API Service
Provides unified interface for Deep Research, multimodal understanding, and stateful conversations
using the new Gemini Interactions API.
"""

import logging
import os
import time
import base64
from typing import Optional, Dict, List, Any, Union

logger = logging.getLogger(__name__)

# Try to import the new google-genai SDK for Interactions API
try:
    from google import genai
    GENAI_SDK_AVAILABLE = True
    logger.info("✅ google-genai SDK loaded successfully for Interactions API")
except ImportError:
    genai = None
    GENAI_SDK_AVAILABLE = False
    logger.warning("⚠️ google-genai SDK not available. Interactions API features will be disabled.")


class GeminiInteractionsService:
    """
    Unified service for Gemini Interactions API
    Supports:
    - Basic text interactions with stateful conversations
    - Deep Research agent for comprehensive research
    - Multimodal understanding (images, audio, video, PDFs)
    - Built-in tools (Google Search, URL context, code execution)
    """
    
    # Supported models
    MODELS = {
        'flash': 'gemini-2.5-flash',
        'flash_lite': 'gemini-2.5-flash-lite',
        'pro': 'gemini-2.5-pro',
        'pro_3': 'gemini-3-pro-preview',
    }
    
    # Deep Research agent ID
    DEEP_RESEARCH_AGENT = 'deep-research-pro-preview-12-2025'
    
    def __init__(self):
        """Initialize the Gemini Interactions Service with Vertex AI authentication"""
        self.client = None
        self.is_configured = False
        self._interaction_cache = {}  # Cache for interaction IDs
        
        # Vertex AI configuration (preferred - higher rate limits)
        self.project_id = os.environ.get('GOOGLE_CLOUD_PROJECT', 'gen-lang-client-0303273462')
        self.location = os.environ.get('GOOGLE_CLOUD_LOCATION', 'global')
        self.use_vertex_ai = os.environ.get('GOOGLE_GENAI_USE_VERTEXAI', 'True').lower() == 'true'
        
        # Fallback API key (only used if Vertex AI is explicitly disabled)
        self.api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
            
        if not GENAI_SDK_AVAILABLE:
            logger.warning("⚠️ google-genai SDK not installed. Run: pip install google-genai>=1.55.0")
            return
        
        # Try Vertex AI first (higher rate limits, production-ready)
        if self.use_vertex_ai:
            if self._init_vertex_ai_client():
                return
            logger.warning("⚠️ Vertex AI init failed, falling back to API key...")
        
        # Fallback to API key if Vertex AI disabled or failed
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
                self.is_configured = True
                logger.info("✅ GeminiInteractionsService initialized with API key (fallback)")
            except Exception as e:
                logger.error(f"❌ Failed to initialize GeminiInteractionsService: {e}")
                self.is_configured = False
        else:
            logger.warning("⚠️ No Vertex AI credentials or API key found. Service disabled.")
    
    def _init_vertex_ai_client(self) -> bool:
        """Initialize the Google GenAI client with Vertex AI credentials."""
        try:
            from google.genai.types import HttpOptions
            
            # Set environment variable to use Vertex AI
            os.environ['GOOGLE_GENAI_USE_VERTEXAI'] = 'True'
            
            # Check for service account credentials
            credentials_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
            service_account_json = os.environ.get('GOOGLE_SERVICE_ACCOUNT_JSON')
            
            if credentials_path and os.path.exists(credentials_path):
                logger.info(f"Using Vertex AI credentials file: {credentials_path}")
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
                # Try Application Default Credentials (ADC)
                logger.info("Using Application Default Credentials for Vertex AI")
                self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
            
            self.is_configured = True
            logger.info(f"✅ GeminiInteractionsService initialized with Vertex AI (project: {self.project_id})")
            return True
            
        except ImportError as e:
            logger.error(f"❌ Failed to import google-genai types: {e}")
            return False
        except Exception as e:
            logger.error(f"❌ Failed to initialize Vertex AI client: {e}")
            return False
    
    # =========================================================================
    # BASIC INTERACTIONS
    # =========================================================================
    
    def create_interaction(
        self,
        input_content: Union[str, List[Dict]],
        model: str = 'flash',
        tools: Optional[List[Dict]] = None,
        system_prompt: Optional[str] = None,
        previous_interaction_id: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> Dict:
        """
        Create a new interaction with the Gemini model
        
        Args:
            input_content: Text string or list of content objects
            model: Model key from MODELS dict
            tools: List of tools (google_search, url_context, code_execution, etc.)
            system_prompt: Optional system instruction
            previous_interaction_id: For continuing conversations
            temperature: Generation temperature
            max_tokens: Maximum output tokens
            
        Returns:
            dict with 'success', 'text', 'interaction_id', 'outputs'
        """
        if not self.is_configured:
            return {
                'success': False,
                'error': 'GeminiInteractionsService not configured',
                'text': None
            }
        
        try:
            # Get model name
            model_name = self.MODELS.get(model, self.MODELS['flash'])
            
            # Build request parameters
            params = {
                'model': model_name,
                'input': input_content,
                'generation_config': {
                    'temperature': temperature,
                    'max_output_tokens': max_tokens
                }
            }
            
            # Add optional parameters
            if tools:
                params['tools'] = tools
                
            if previous_interaction_id:
                params['previous_interaction_id'] = previous_interaction_id
                
            # Create the interaction
            interaction = self.client.interactions.create(**params)
            
            # Extract text output
            text_output = None
            for output in interaction.outputs:
                if hasattr(output, 'type') and output.type == 'text':
                    text_output = output.text
                    break
                elif hasattr(output, 'text'):
                    text_output = output.text
                    break
            
            # Cache the interaction ID
            if hasattr(interaction, 'id'):
                self._interaction_cache[interaction.id] = {
                    'model': model_name,
                    'created_at': time.time()
                }
            
            return {
                'success': True,
                'text': text_output,
                'interaction_id': getattr(interaction, 'id', None),
                'outputs': interaction.outputs,
                'status': getattr(interaction, 'status', 'completed')
            }
            
        except Exception as e:
            logger.error(f"Error creating interaction: {e}", exc_info=True)
            return {
                'success': False,
                'error': str(e),
                'text': None
            }
    
    def continue_conversation(
        self,
        previous_interaction_id: str,
        input_content: Union[str, List[Dict]],
        model: str = 'flash'
    ) -> Dict:
        """
        Continue a previous conversation using interaction ID
        
        Args:
            previous_interaction_id: ID from previous interaction
            input_content: New input content
            model: Model to use
            
        Returns:
            dict with interaction result
        """
        return self.create_interaction(
            input_content=input_content,
            model=model,
            previous_interaction_id=previous_interaction_id
        )
    
    def get_interaction(self, interaction_id: str) -> Dict:
        """
        Retrieve a previous interaction by ID
        
        Args:
            interaction_id: The interaction ID to retrieve
            
        Returns:
            dict with interaction details
        """
        if not self.is_configured:
            return {'success': False, 'error': 'Service not configured'}
            
        try:
            interaction = self.client.interactions.get(interaction_id)
            
            text_output = None
            for output in interaction.outputs:
                if hasattr(output, 'type') and output.type == 'text':
                    text_output = output.text
                    break
                elif hasattr(output, 'text'):
                    text_output = output.text
                    break
            
            return {
                'success': True,
                'interaction': interaction,
                'text': text_output,
                'status': getattr(interaction, 'status', 'unknown'),
                'outputs': interaction.outputs
            }
        except Exception as e:
            logger.error(f"Error retrieving interaction: {e}")
            return {'success': False, 'error': str(e)}
    
    # =========================================================================
    # DEEP RESEARCH AGENT
    # =========================================================================
    
    def start_deep_research(
        self,
        query: str,
        context: Optional[str] = None
    ) -> Dict:
        """
        Start a Deep Research task using the Gemini Deep Research agent
        
        Args:
            query: Research query/topic
            context: Optional additional context
            
        Returns:
            dict with 'success', 'interaction_id', 'status'
        """
        if not self.is_configured:
            return {
                'success': False,
                'error': 'GeminiInteractionsService not configured'
            }
        
        try:
            # Build the research prompt
            if context:
                research_input = f"{context}\n\nResearch Topic: {query}"
            else:
                research_input = query
            
            # Start the Deep Research agent in background mode
            interaction = self.client.interactions.create(
                input=research_input,
                agent=self.DEEP_RESEARCH_AGENT,
                background=True  # Required for Deep Research
            )
            
            logger.info(f"🔬 Deep Research started. Interaction ID: {interaction.id}")
            
            # Cache the interaction
            self._interaction_cache[interaction.id] = {
                'type': 'deep_research',
                'query': query,
                'started_at': time.time()
            }
            
            return {
                'success': True,
                'interaction_id': interaction.id,
                'status': getattr(interaction, 'status', 'in_progress'),
                'message': 'Deep Research started. Poll for results using the interaction ID.'
            }
            
        except Exception as e:
            logger.error(f"Error starting Deep Research: {e}", exc_info=True)
            return {
                'success': False,
                'error': str(e)
            }
    
    def poll_research_status(self, interaction_id: str) -> Dict:
        """
        Poll the status of a Deep Research task
        
        Args:
            interaction_id: The interaction ID from start_deep_research
            
        Returns:
            dict with 'success', 'status', 'result' (if completed)
        """
        if not self.is_configured:
            return {'success': False, 'error': 'Service not configured'}
            
        try:
            interaction = self.client.interactions.get(interaction_id)
            status = getattr(interaction, 'status', 'unknown')
            
            result = {
                'success': True,
                'status': status,
                'interaction_id': interaction_id
            }
            
            if status == 'completed':
                # Extract the final report
                text_output = None
                for output in interaction.outputs:
                    if hasattr(output, 'type') and output.type == 'text':
                        text_output = output.text
                        break
                    elif hasattr(output, 'text'):
                        text_output = output.text
                        break
                
                result['result'] = text_output
                result['message'] = 'Research completed successfully'
                
                # Update cache
                if interaction_id in self._interaction_cache:
                    self._interaction_cache[interaction_id]['completed_at'] = time.time()
                    self._interaction_cache[interaction_id]['result'] = text_output[:500] if text_output else None
                    
            elif status in ['failed', 'cancelled']:
                result['message'] = f'Research {status}'
                
            else:
                result['message'] = 'Research in progress...'
            
            return result
            
        except Exception as e:
            logger.error(f"Error polling research status: {e}")
            return {
                'success': False,
                'error': str(e),
                'status': 'error'
            }
    
    # =========================================================================
    # MULTIMODAL UNDERSTANDING
    # =========================================================================
    
    def analyze_image(
        self,
        image_data: str,
        mime_type: str,
        prompt: str = "Describe what you see in this image.",
        model: str = 'flash'
    ) -> Dict:
        """
        Analyze an image using multimodal understanding
        
        Args:
            image_data: Base64-encoded image data
            mime_type: MIME type (e.g., 'image/png', 'image/jpeg')
            prompt: Text prompt for analysis
            model: Model to use
            
        Returns:
            dict with analysis result
        """
        if not self.is_configured:
            return {'success': False, 'error': 'Service not configured'}
            
        try:
            input_content = [
                {"type": "text", "text": prompt},
                {"type": "image", "data": image_data, "mime_type": mime_type}
            ]
            
            return self.create_interaction(
                input_content=input_content,
                model=model
            )
            
        except Exception as e:
            logger.error(f"Error analyzing image: {e}")
            return {'success': False, 'error': str(e)}
    
    def transcribe_audio(
        self,
        audio_data: str,
        mime_type: str,
        prompt: str = "Transcribe and respond to this audio.",
        model: str = 'flash'
    ) -> Dict:
        """
        Transcribe and process audio content
        
        Args:
            audio_data: Base64-encoded audio data
            mime_type: MIME type (e.g., 'audio/wav', 'audio/mp3')
            prompt: Text prompt for processing
            model: Model to use
            
        Returns:
            dict with transcription and response
        """
        if not self.is_configured:
            return {'success': False, 'error': 'Service not configured'}
            
        try:
            input_content = [
                {"type": "text", "text": prompt},
                {"type": "audio", "data": audio_data, "mime_type": mime_type}
            ]
            
            return self.create_interaction(
                input_content=input_content,
                model=model
            )
            
        except Exception as e:
            logger.error(f"Error transcribing audio: {e}")
            return {'success': False, 'error': str(e)}
    
    def analyze_video(
        self,
        video_data: str,
        mime_type: str,
        prompt: str = "What is happening in this video? Provide a timestamped summary.",
        model: str = 'flash'
    ) -> Dict:
        """
        Analyze video content with optional timestamped summary
        
        Args:
            video_data: Base64-encoded video data
            mime_type: MIME type (e.g., 'video/mp4')
            prompt: Text prompt for analysis
            model: Model to use
            
        Returns:
            dict with video analysis
        """
        if not self.is_configured:
            return {'success': False, 'error': 'Service not configured'}
            
        try:
            input_content = [
                {"type": "text", "text": prompt},
                {"type": "video", "data": video_data, "mime_type": mime_type}
            ]
            
            return self.create_interaction(
                input_content=input_content,
                model=model
            )
            
        except Exception as e:
            logger.error(f"Error analyzing video: {e}")
            return {'success': False, 'error': str(e)}
    
    def analyze_document(
        self,
        document_data: str,
        mime_type: str = "application/pdf",
        prompt: str = "What is this document about? Provide a comprehensive summary.",
        model: str = 'flash'
    ) -> Dict:
        """
        Analyze a PDF or document
        
        Args:
            document_data: Base64-encoded document data
            mime_type: MIME type (default: 'application/pdf')
            prompt: Text prompt for analysis
            model: Model to use
            
        Returns:
            dict with document analysis
        """
        if not self.is_configured:
            return {'success': False, 'error': 'Service not configured'}
            
        try:
            input_content = [
                {"type": "text", "text": prompt},
                {"type": "document", "data": document_data, "mime_type": mime_type}
            ]
            
            return self.create_interaction(
                input_content=input_content,
                model=model
            )
            
        except Exception as e:
            logger.error(f"Error analyzing document: {e}")
            return {'success': False, 'error': str(e)}
    
    # =========================================================================
    # BUILT-IN TOOLS
    # =========================================================================
    
    def search_with_grounding(
        self,
        query: str,
        model: str = 'flash'
    ) -> Dict:
        """
        Search with Google Search grounding for factual responses
        
        Args:
            query: Search query
            model: Model to use
            
        Returns:
            dict with grounded response
        """
        if not self.is_configured:
            return {'success': False, 'error': 'Service not configured'}
            
        try:
            return self.create_interaction(
                input_content=query,
                model=model,
                tools=[{"type": "google_search"}]
            )
            
        except Exception as e:
            logger.error(f"Error with grounded search: {e}")
            return {'success': False, 'error': str(e)}
    
    def analyze_url(
        self,
        url: str,
        prompt: str = "Summarize the content of this URL.",
        model: str = 'flash'
    ) -> Dict:
        """
        Analyze content from a URL
        
        Args:
            url: URL to analyze
            prompt: Text prompt
            model: Model to use
            
        Returns:
            dict with URL content analysis
        """
        if not self.is_configured:
            return {'success': False, 'error': 'Service not configured'}
            
        try:
            full_prompt = f"{prompt}: {url}"
            
            return self.create_interaction(
                input_content=full_prompt,
                model=model,
                tools=[{"type": "url_context"}]
            )
            
        except Exception as e:
            logger.error(f"Error analyzing URL: {e}")
            return {'success': False, 'error': str(e)}
    
    def execute_code(
        self,
        prompt: str,
        model: str = 'flash'
    ) -> Dict:
        """
        Execute code using Gemini's code execution tool
        
        Args:
            prompt: Code execution prompt
            model: Model to use
            
        Returns:
            dict with code execution result
        """
        if not self.is_configured:
            return {'success': False, 'error': 'Service not configured'}
            
        try:
            return self.create_interaction(
                input_content=prompt,
                model=model,
                tools=[{"type": "code_execution"}]
            )
            
        except Exception as e:
            logger.error(f"Error executing code: {e}")
            return {'success': False, 'error': str(e)}
    
    # =========================================================================
    # HELPER METHODS
    # =========================================================================
    
    def is_available(self) -> bool:
        """Check if the service is available and configured"""
        return self.is_configured and GENAI_SDK_AVAILABLE
    
    def get_cached_interactions(self) -> Dict:
        """Get cached interaction metadata"""
        return self._interaction_cache.copy()


# Global service instance
_gemini_interactions_service = None

def get_gemini_interactions_service() -> GeminiInteractionsService:
    """Get or create the global GeminiInteractionsService instance"""
    global _gemini_interactions_service
    if _gemini_interactions_service is None:
        _gemini_interactions_service = GeminiInteractionsService()
    return _gemini_interactions_service
