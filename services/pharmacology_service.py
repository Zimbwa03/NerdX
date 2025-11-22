#!/usr/bin/env python3
"""
Pharmacology Service for NerdX
Provides Pharmacology question generation using DeepSeek AI
"""

import json
import logging
import random
import os
import requests
from typing import Optional, Dict, List
from config import Config

logger = logging.getLogger(__name__)

class PharmacologyService:
    def __init__(self):
        """Initialize Pharmacology Service with DeepSeek AI capabilities"""
        self.deepseek_api_key = Config.DEEPSEEK_API_KEY
        self.deepseek_api_url = 'https://api.deepseek.com/chat/completions'

    def _clean_json_block(self, text: str) -> str:
        """Remove markdown fences from AI responses"""
        cleaned = text.strip()
        if cleaned.startswith('```json'):
            cleaned = cleaned[7:]
        if cleaned.startswith('```'):
            cleaned = cleaned[3:]
        if cleaned.endswith('```'):
            cleaned = cleaned[:-3]
        return cleaned.strip()

    def generate_question(self, topic: str, question_type: str = 'MCQ', difficulty: str = 'medium') -> Optional[Dict]:
        """Generate a Pharmacology question using DeepSeek AI"""
        if not self.deepseek_api_key:
            logger.warning("DeepSeek API key not configured - skipping Pharmacology generation")
            return None

        try:
            system_prompt = (
                "You are a professional Medical Pharmacology Tutor. "
                "Create high-quality pharmacology questions for medical students. "
                "Focus on clinical application, mechanism of action, side effects, and drug interactions."
            )

            if question_type == 'True/False':
                user_prompt = f"""
Generate a True/False Pharmacology question.

Topic: {topic}
Difficulty: {difficulty}

Requirements:
- Statement must be clearly True or False.
- Focus on key pharmacological concepts.
- Provide a detailed explanation for why it is True or False.

Return ONLY valid JSON:
{{
  "question_type": "True/False",
  "topic": "{topic}",
  "question": "The statement to evaluate...",
  "options": ["True", "False"],
  "correct_answer": "True" or "False",
  "explanation": "Detailed explanation...",
  "difficulty": "{difficulty}"
}}
"""
            else:  # MCQ
                user_prompt = f"""
Generate a Multiple Choice Pharmacology question.

Topic: {topic}
Difficulty: {difficulty}

Requirements:
- Provide 4 distinct options (A, B, C, D).
- Only one correct answer.
- Focus on clinical scenarios or specific drug properties.
- Provide a detailed explanation.

Return ONLY valid JSON:
{{
  "question_type": "MCQ",
  "topic": "{topic}",
  "question": "The question text...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": "The correct option text (must match one of the options exactly)",
  "explanation": "Detailed explanation...",
  "difficulty": "{difficulty}"
}}
"""

            headers = {
                'Authorization': f'Bearer {self.deepseek_api_key}',
                'Content-Type': 'application/json'
            }

            payload = {
                'model': 'deepseek-chat',
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_prompt}
                ],
                'temperature': 0.7,
                'max_tokens': 1000
            }

            response = requests.post(self.deepseek_api_url, headers=headers, json=payload, timeout=45)

            if response.status_code == 200:
                response_data = response.json()
                content = response_data.get('choices', [{}])[0].get('message', {}).get('content', '')

                if content:
                    try:
                        cleaned_text = self._clean_json_block(content.strip())
                        question_data = json.loads(cleaned_text)
                        
                        # Normalize response
                        if question_type == 'True/False':
                            question_data['options'] = ['True', 'False']
                        
                        return {
                            'success': True,
                            'question_data': question_data
                        }
                    except json.JSONDecodeError as e:
                        logger.error(f"Failed to parse DeepSeek response: {e}")
                        return None
            else:
                logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            logger.error(f"Error generating Pharmacology question: {e}")
            return None
