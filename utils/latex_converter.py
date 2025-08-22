import os
import logging
import requests
import base64
from typing import Optional
from config import Config

logger = logging.getLogger(__name__)

class LaTeXConverter:
    """Convert LaTeX mathematical expressions to PNG images"""
    
    def __init__(self):
        self.temp_dir = "temp"
        self.ensure_temp_directory()
    
    def ensure_temp_directory(self):
        """Ensure temp directory exists"""
        try:
            if not os.path.exists(self.temp_dir):
                os.makedirs(self.temp_dir)
                logger.info(f"Created temp directory: {self.temp_dir}")
        except Exception as e:
            logger.error(f"Error creating temp directory: {e}")
    
    def latex_to_png(self, latex_expression: str, filename: Optional[str] = None) -> Optional[str]:
        """Convert LaTeX expression to PNG image"""
        try:
            if not filename:
                import time
                timestamp = int(time.time())
                filename = f"math_expression_{timestamp}.png"
            
            # Clean the LaTeX expression
            latex_clean = self._clean_latex_expression(latex_expression)
            
            # Try online LaTeX renderer first
            image_path = self._render_with_online_service(latex_clean, filename)
            
            if not image_path:
                # Fallback to simple text conversion
                image_path = self._create_text_image(latex_expression, filename)
            
            return image_path
            
        except Exception as e:
            logger.error(f"Error converting LaTeX to PNG: {e}")
            return None
    
    def _clean_latex_expression(self, latex: str) -> str:
        """Clean and prepare LaTeX expression"""
        try:
            # Remove extra whitespace
            latex = latex.strip()
            
            # Ensure math mode
            if not latex.startswith('$') and not latex.startswith('\\['):
                latex = f"${latex}$"
            
            # Common replacements for compatibility
            replacements = {
                '\\cdot': '·',
                '\\times': '×',
                '\\div': '÷',
                '\\pm': '±',
                '\\sqrt': '√',
                '\\alpha': 'α',
                '\\beta': 'β',
                '\\gamma': 'γ',
                '\\theta': 'θ',
                '\\pi': 'π',
                '\\infty': '∞'
            }
            
            for old, new in replacements.items():
                latex = latex.replace(old, new)
            
            return latex
            
        except Exception as e:
            logger.error(f"Error cleaning LaTeX: {e}")
            return latex
    
    def _render_with_online_service(self, latex: str, filename: str) -> Optional[str]:
        """Use online LaTeX rendering service"""
        try:
            # Use QuickLaTeX service
            url = "https://quicklatex.com/latex3.f"
            
            data = {
                'formula': latex,
                'fsize': '18px',
                'fcolor': '000000',
                'mode': '0',
                'out': '1',
                'remhost': 'quicklatex.com'
            }
            
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.post(url, data=data, headers=headers, timeout=10)
            
            if response.status_code == 200:
                lines = response.text.strip().split('\n')
                if len(lines) >= 2 and lines[0].strip() == '0':
                    image_url = lines[1].strip()
                    
                    # Download the image
                    img_response = requests.get(image_url, timeout=10)
                    if img_response.status_code == 200:
                        file_path = os.path.join(self.temp_dir, filename)
                        with open(file_path, 'wb') as f:
                            f.write(img_response.content)
                        
                        logger.info(f"LaTeX image saved: {file_path}")
                        return file_path
            
            return None
            
        except Exception as e:
            logger.error(f"Error with online LaTeX service: {e}")
            return None
    
    def _create_text_image(self, text: str, filename: str) -> Optional[str]:
        """Create simple text image as fallback"""
        try:
            # This is a simple fallback - in a real implementation,
            # you might use PIL/Pillow to create actual text images
            
            file_path = os.path.join(self.temp_dir, filename.replace('.png', '.txt'))
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(f"Mathematical Expression: {text}")
            
            logger.info(f"Text fallback created: {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"Error creating text image: {e}")
            return None
    
    def convert_math_question_to_image(self, question_data: dict) -> dict:
        """Convert mathematical expressions in question to images"""
        try:
            # Look for LaTeX patterns in question
            question_text = question_data.get('question', '')
            solution_text = question_data.get('solution', '')
            
            # Simple LaTeX detection
            if '$' in question_text or '\\' in question_text:
                image_path = self.latex_to_png(question_text)
                if image_path:
                    question_data['question_image'] = image_path
            
            if '$' in solution_text or '\\' in solution_text:
                import time
                image_path = self.latex_to_png(solution_text, f"solution_{int(time.time())}.png")
                if image_path:
                    question_data['solution_image'] = image_path
            
            return question_data
            
        except Exception as e:
            logger.error(f"Error converting question to image: {e}")
            return question_data
    
    def cleanup_old_files(self, max_age_hours: int = 24):
        """Clean up old temporary files"""
        try:
            import time
            current_time = time.time()
            max_age_seconds = max_age_hours * 3600
            
            for filename in os.listdir(self.temp_dir):
                file_path = os.path.join(self.temp_dir, filename)
                if os.path.isfile(file_path):
                    file_age = current_time - os.path.getmtime(file_path)
                    if file_age > max_age_seconds:
                        os.remove(file_path)
                        logger.info(f"Cleaned up old file: {filename}")
            
        except Exception as e:
            logger.error(f"Error cleaning up files: {e}")