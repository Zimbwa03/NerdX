"""
Gemini Image Generator for Project Assistant
Uses Google Gemini 2.5 Flash Image model for generating visual aids
"""

import logging
import os
import base64
import requests
from typing import Optional

logger = logging.getLogger(__name__)


class GeminiImageGenerator:
    """Handles image generation using Gemini 2.5 Flash Image API"""
    
    def __init__(self):
        self.api_key = os.environ.get('GEMINI_API_KEY')
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent"
    
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
            if not self.api_key:
                logger.error("GEMINI_API_KEY not found")
                return None
            
            headers = {
                "x-goog-api-key": self.api_key,
                "Content-Type": "application/json"
            }
            
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "responseModalities": ["IMAGE"],
                    "imageConfig": {
                        "aspectRatio": aspect_ratio
                    }
                }
            }
            
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract image data from response
                if 'candidates' in data and len(data['candidates']) > 0:
                    parts = data['candidates'][0].get('content', {}).get('parts', [])
                    
                    for part in parts:
                        if 'inlineData' in part:
                            mime_type = part['inlineData'].get('mimeType', 'image/png')
                            image_data = part['inlineData'].get('data', '')
                            
                            # Return as data URL for WhatsApp
                            data_url = f"data:{mime_type};base64,{image_data}"
                            return data_url
                
                logger.error(f"No image found in Gemini response: {data}")
                return None
            else:
                logger.error(f"Gemini API error: {response.status_code} - {response.text}")
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
