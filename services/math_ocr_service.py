#!/usr/bin/env python3
"""
Lightweight Math OCR Service - Optimized for Render Free Tier
Uses cloud-based vision APIs (DeepSeek/Gemini) instead of local models
Zero memory overhead, fast responses
"""

import logging
import os
import base64
import requests
from typing import Dict, List, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

# Try to import google generative ai for fallback
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    genai = None
    GEMINI_AVAILABLE = False


class MathOCRService:
    """Lightweight OCR service for mathematical equations using cloud vision APIs"""
    
    def __init__(self):
        """Initialize cloud-based OCR service - no heavy model loading"""
        # DeepSeek API (primary)
        self.deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
        self.deepseek_api_url = 'https://api.deepseek.com/chat/completions'
        
        # Gemini API (fallback for vision)
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        if GEMINI_AVAILABLE and self.gemini_api_key:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
            except Exception as e:
                logger.error(f"Error initializing Gemini: {e}")
                self.gemini_model = None
        else:
            self.gemini_model = None
        
        logger.info("✅ Math OCR Service initialized (lightweight cloud-based mode)")
    
    def _encode_image(self, image_path: str) -> Optional[str]:
        """Encode image to base64"""
        try:
            with open(image_path, 'rb') as f:
                return base64.b64encode(f.read()).decode('utf-8')
        except Exception as e:
            logger.error(f"Error encoding image: {e}")
            return None
    
    def _get_mime_type(self, image_path: str) -> str:
        """Get MIME type from file extension"""
        ext = Path(image_path).suffix.lower()
        mime_types = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }
        return mime_types.get(ext, 'image/png')
    
    def scan_equation(self, image_path: str) -> Dict:
        """
        Scan equation from image using cloud vision APIs
        
        Args:
            image_path: Path to image file
        
        Returns:
            Dict with LaTeX output and recognized text
        """
        try:
            # Encode image
            image_base64 = self._encode_image(image_path)
            if not image_base64:
                return {"success": False, "error": "Failed to read image"}
            
            mime_type = self._get_mime_type(image_path)
            
            # Try Gemini Vision first (better for math OCR)
            if self.gemini_model:
                try:
                    import PIL.Image
                    image = PIL.Image.open(image_path)
                    
                    prompt = """You are a mathematical equation OCR system. Look at this image and:
1. Extract any mathematical equations, formulas, or expressions you see
2. Convert them to LaTeX format
3. Also extract any plain text visible in the image

Respond in this exact JSON format:
{
    "latex": "the equation in LaTeX format",
    "plain_text": "any plain text visible",
    "description": "brief description of what the math is about"
}

If no math is visible, set latex to empty string."""

                    response = self.gemini_model.generate_content([prompt, image])
                    
                    if response and response.text:
                        # Try to parse JSON response
                        import json
                        try:
                            result_text = response.text.strip()
                            # Remove markdown code blocks if present
                            if result_text.startswith('```'):
                                result_text = result_text.split('\n', 1)[1]
                            if result_text.endswith('```'):
                                result_text = result_text.rsplit('```', 1)[0]
                            result_text = result_text.strip()
                            
                            if result_text.startswith('{'):
                                result = json.loads(result_text)
                                return {
                                    "success": True,
                                    "latex": result.get('latex', ''),
                                    "plain_text": result.get('plain_text', ''),
                                    "description": result.get('description', ''),
                                    "confidence": 0.90,
                                    "method": "gemini_vision",
                                    "cost": 0.0
                                }
                        except json.JSONDecodeError:
                            pass
                        
                        # If JSON parsing failed, return raw text
                        return {
                            "success": True,
                            "latex": response.text.strip(),
                            "plain_text": response.text.strip(),
                            "confidence": 0.85,
                            "method": "gemini_vision",
                            "cost": 0.0
                        }
                        
                except Exception as e:
                    logger.error(f"Gemini vision error: {e}")
            
            # Fallback: Return helpful message
            return {
                "success": False,
                "error": "OCR service temporarily unavailable. Please try typing the equation instead.",
                "fallback": "Unable to recognize equation. Please type it manually."
            }
            
        except Exception as e:
            logger.error(f"Error scanning equation from '{image_path}': {e}")
            return {
                "success": False,
                "error": str(e),
                "fallback": "Unable to recognize equation. Please try a clearer image."
            }
    
    def scan_full_page(self, image_path: str, detect_layout: bool = True) -> Dict:
        """
        Scan full question page with layout analysis
        Uses cloud vision API for OCR
        """
        try:
            # Use the same approach as scan_equation but with different prompt
            if self.gemini_model:
                try:
                    import PIL.Image
                    image = PIL.Image.open(image_path)
                    
                    prompt = """You are analyzing a math exam page. Please:
1. Extract all text from this page
2. Identify any mathematical equations and convert them to LaTeX
3. Describe any diagrams or figures you see

Respond with:
- The full question text
- Any equations in LaTeX format
- Description of any diagrams"""

                    response = self.gemini_model.generate_content([prompt, image])
                    
                    if response and response.text:
                        return {
                            "success": True,
                            "question_text": response.text.strip(),
                            "equations": [],
                            "diagrams": [],
                            "page_type": "exam_page",
                            "method": "gemini_vision"
                        }
                        
                except Exception as e:
                    logger.error(f"Full page scan error: {e}")
            
            return {
                "success": False,
                "error": "Page scanning temporarily unavailable",
                "question_text": ""
            }
            
        except Exception as e:
            logger.error(f"Error scanning full page: {e}")
            return {"success": False, "error": str(e)}
    
    def scan_handwritten(self, image_path: str) -> Dict:
        """Scan handwritten mathematical work"""
        # Use same method as scan_equation
        result = self.scan_equation(image_path)
        if result.get('success'):
            result['type'] = 'handwritten'
        return result
    
    def batch_scan(self, image_paths: List[str]) -> List[Dict]:
        """Scan multiple images in batch"""
        results = []
        for path in image_paths:
            result = self.scan_equation(path)
            result['image_path'] = path
            results.append(result)
        return results
    
    def verify_installation(self) -> Dict:
        """Verify cloud APIs are configured"""
        gemini_configured = self.gemini_model is not None
        deepseek_configured = bool(self.deepseek_api_key)
        
        return {
            "installed": gemini_configured or deepseek_configured,
            "gemini_available": gemini_configured,
            "deepseek_available": deepseek_configured,
            "method": "cloud_vision_api",
            "cost": "$0/month",
            "note": "Using cloud-based vision APIs (lightweight, no local models)"
        }


# Global service instance (lazy initialization)
_math_ocr_service = None

def get_math_ocr_service():
    global _math_ocr_service
    if _math_ocr_service is None:
        _math_ocr_service = MathOCRService()
    return _math_ocr_service

# For backward compatibility
math_ocr_service = MathOCRService()
