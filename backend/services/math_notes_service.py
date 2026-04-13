"""
Math Notes Service
Generates professional, ZIMSEC-standard mathematics notes with Vertex primary.
"""

import os
import json
import logging
import requests
from typing import Dict, Optional, List
from utils.deepseek import get_deepseek_chat_model
from utils.vertex_ai_helper import try_vertex_json
from services.vertex_service import vertex_service

logger = logging.getLogger(__name__)

class MathNotesService:
    def __init__(self):
        self.api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.api_url = 'https://api.deepseek.com/chat/completions'
        self.deepseek_model = get_deepseek_chat_model()
        self.timeout = 60  # Optimized: Reduced from 120s - DeepSeek typically responds faster
        self._is_vertex_configured = bool(vertex_service and vertex_service.is_available())
        
        if self._is_vertex_configured:
            logger.info("MathNotesService configured with Vertex AI primary")
        elif not self.api_key:
            logger.warning("No AI providers configured for MathNotesService")


    def generate_topic_notes(self, topic: str, grade_level: str = "O-Level") -> Optional[Dict]:
        """Generate comprehensive mathematics notes for a specific topic."""
        prompt = self._create_notes_prompt(topic, grade_level)
        system_message = (
            "You are an expert ZIMSEC O-Level Mathematics teacher. "
            "You provide professional, comprehensive, and clear notes."
        )

        # Vertex AI primary
        if self._is_vertex_configured:
            context = f"math_notes:{grade_level}:{topic}"
            vertex_prompt = f"{system_message}\n\n{prompt}"
            notes = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if notes:
                notes.setdefault('ai_model', 'vertex_ai')
                return notes

        # DeepSeek fallback
        if not self.api_key:
            return self._get_fallback_notes(topic, grade_level)

        try:
            response = requests.post(
                self.api_url,
                headers={
                    'Authorization': f'Bearer {self.api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': self.deepseek_model,
                    'messages': [
                        {'role': 'system', 'content': system_message},
                        {'role': 'user', 'content': prompt}
                    ],
                    'temperature': 0.7,
                    'max_tokens': 4000
                },
                timeout=self.timeout
            )

            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content'].strip()
                parsed = self._parse_ai_response(content)
                if parsed:
                    parsed.setdefault('ai_model', 'deepseek_fallback')
                    return parsed
            else:
                logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")

            return self._get_fallback_notes(topic, grade_level)

        except Exception as e:
            logger.error(f"Error generating math notes: {e}")
            return self._get_fallback_notes(topic, grade_level)

    def _create_notes_prompt(self, topic: str, grade_level: str) -> str:
        return f"""Generate professional, ZIMSEC-standard mathematics study notes for the topic: {topic}.
Target Level: {grade_level}

The notes must be VERY COMPREHENSIVE (500-800 words) and follow this exact JSON structure:

{{
  "topic": "{topic}",
  "subject": "Mathematics",
  "grade_level": "{grade_level}",
  "summary": "A concise overview of the topic.",
  "sections": [
    {{
      "title": "Section Title",
      "content": "Detailed explanation with KaTeX formulas (use $[formula]$ for inline and $$[formula]$$ for blocks). Use Markdown for formatting.",
      "worked_examples": [
        {{
          "question": "Problem statement",
          "steps": ["Step 1 explanation", "Step 2 explanation"],
          "final_answer": "Final answer with units if applicable"
        }}
      ]
    }}
  ],
  "key_points": ["Point 1", "Point 2"],
  "exam_tips": ["Tip 1", "Tip 2"],
  "visual_descriptions": ["Detailed description of a graph or diagram that represents this topic"]
}}

REQUIREMENTS:
1. Use KaTeX for ALL mathematical formulas and expressions.
2. Provide at least 3 detailed worked examples.
3. The explanation should be deep enough for a student to master the topic.
4. Focus on ZIMSEC/Cambridge O-Level standards.
5. Ensure valid JSON output.
"""

    def _parse_ai_response(self, content: str) -> Optional[Dict]:
        try:
            # Find JSON boundaries
            start = content.find('{')
            end = content.rfind('}') + 1
            if start != -1 and end != 0:
                return json.loads(content[start:end])
            return None
        except Exception as e:
            logger.error(f"Failed to parse math notes JSON: {e}")
            return None

    def _get_fallback_notes(self, topic: str, grade_level: str) -> Dict:
        return {
            "topic": topic,
            "subject": "Mathematics",
            "grade_level": grade_level,
            "summary": f"Study notes for {topic}.",
            "sections": [
                {
                    "title": "Introduction",
                    "content": f"Basic explanation of {topic} will appear here.",
                    "worked_examples": []
                }
            ],
            "key_points": [f"Understand the basics of {topic}"],
            "exam_tips": ["Practice makes perfect"],
            "visual_descriptions": []
        }

# Global instance
math_notes_service = MathNotesService()
