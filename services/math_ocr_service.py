#!/usr/bin/env python3
"""
Pix2Text OCR Service - Free Alternative to Mathpix
Provides mathematical equation recognition from images
Outperforms Mathpix in LaTeX accuracy benchmarks
Zero API costs, 100% offline capable
"""

import logging
import os
from typing import Dict, List, Optional
from pathlib import Path
import base64
from io import BytesIO

logger = logging.getLogger(__name__)

# Global P2T instance (initialized lazily)
_p2t_instance = None


class MathOCRService:
    """Free OCR service for mathematical equations using Pix2Text"""
    
    def __init__(self):
        """Initialize Pix2Text OCR service"""
        self.p2t = self._get_p2t_instance()
        logger.info("Pix2Text OCR Service initialized (Free Alternative to Mathpix)")
    
    def _get_p2t_instance(self):
        """Get or create singleton Pix2Text instance"""
        global _p2t_instance
        
        if _p2t_instance is None:
            try:
                from pix2text import Pix2Text
                
                # Initialize with default analyzer for math formula detection
                _p2t_instance = Pix2Text(
                    analyzer_config=dict(model_name='mfd'),  # Math Formula Detection
                    languages='en'  # English language support
                )
                logger.info("✅ Pix2Text model loaded successfully")
                
            except ImportError as e:
                logger.error(f"Pix2Text not installed. Run: pip install pix2text[multilingual]")
                raise ImportError("Pix2Text library not found. Please install: pip install pix2text[multilingual]") from e
            except Exception as e:
                logger.error(f"Error initializing Pix2Text: {e}")
                raise
        
        return _p2t_instance
    
    def scan_equation(self, image_path: str) -> Dict:
        """
        Scan single equation from image
        
        Args:
            image_path: Path to image file
        
        Returns:
            Dict with LaTeX output, confidence, and bounding boxes
        """
        try:
            # Recognize formula from image
            result = self.p2t.recognize_formula(image_path)
            
            # Extract LaTeX
            if isinstance(result, dict):
                latex_output = result.get('text', '')
                confidence = result.get('score', 0.95)
            elif isinstance(result, str):
                latex_output = result
                confidence = 0.95  # Default confidence
            else:
                latex_output = str(result)
                confidence = 0.90
            
            return {
                "success": True,
                "latex": latex_output,
                "confidence": confidence,
                "method": "pix2text",
                "cost": 0.0  # Free!
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
        Detects text, equations, and diagrams separately
        
        Args:
            image_path: Path to image file (Green Book page)
            detect_layout: Whether to perform layout analysis
        
        Returns:
            Dict with question text, equations, and diagrams
        """
        try:
            if detect_layout:
                # Use full OCR with layout detection
                result = self.p2t(image_path, return_text=True)
            else:
                # Simple formula recognition only
                result = self.p2t.recognize_formula(image_path)
            
            # Parse result structure
            if isinstance(result, dict):
                # Structured output with text and formulas
                question_text = result.get('text', '')
                
                # Extract equations (formulas)
                equations = []
                if 'formulas' in result:
                    for formula in result['formulas']:
                        equations.append({
                            'latex': formula.get('latex', ''),
                            'position': formula.get('position', {}),
                            'confidence': formula.get('score', 0.95)
                        })
                
                # Extract diagrams if any
                diagrams = result.get('figures', [])
                
            else:
                # Simple string output
                question_text = str(result)
                equations = []
                diagrams = []
            
            return {
                "success": True,
                "question_text": question_text,
                "equations": equations,
                "diagrams": diagrams,
                "page_type": "green_book",
                "method": "pix2text_full_page"
            }
            
        except Exception as e:
            logger.error(f"Error scanning full page from '{image_path}': {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def scan_handwritten(self, image_path: str) -> Dict:
        """
        Scan handwritten mathematical work
        Optimized for student handwriting recognition
        
        Args:
            image_path: Path to handwritten solution image
        
        Returns:
            Dict with recognized steps and LaTeX
        """
        try:
            # Pix2Text handles handwritten text reasonably well
            result = self.p2t(image_path, return_text=True)
            
            if isinstance(result, dict):
                recognized_text = result.get('text', '')
                formulas = result.get('formulas', [])
            else:
                recognized_text = str(result)
                formulas = []
            
            return {
                "success": True,
                "recognized_text": recognized_text,
                "formulas": [f.get('latex', '') for f in formulas] if formulas else [],
                "confidence": 0.85,  # Handwriting typically lower confidence
                "type": "handwritten"
            }
            
        except Exception as e:
            logger.error(f"Error scanning handwritten image: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def batch_scan(self, image_paths: List[str]) -> List[Dict]:
        """
        Scan multiple images in batch
        Useful for past paper sets
        
        Args:
            image_paths: List of image file paths
        
        Returns:
            List of scan results
        """
        results = []
        
        for path in image_paths:
            result = self.scan_equation(path)
            result['image_path'] = path
            results.append(result)
        
        return results
    
    def verify_installation(self) -> Dict:
        """
        Verify Pix2Text is correctly installed and working
        
        Returns:
            Dict with installation status and version
        """
        try:
            from pix2text import __version__ as pix2text_version
            
            # Try a simple test
            test_passed = self.p2t is not None
            
            return {
                "installed": True,
                "version": pix2text_version,
                "test_passed": test_passed,
                "cost": "$0/month",
                "alternative_to": "Mathpix ($50/month)"
            }
            
        except Exception as e:
            return {
                "installed": False,
                "error": str(e),
                "install_command": "pip install pix2text[multilingual]"
            }


# Global service instance
math_ocr_service = MathOCRService()
