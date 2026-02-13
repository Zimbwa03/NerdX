"""
Flashcard Generation Service
Generates AI-powered educational flashcards using Vertex AI as primary and DeepSeek as fallback for all subjects (O-Level and A-Level).
"""

import os
import json
import logging
import requests
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict
from utils.deepseek import get_deepseek_chat_model

logger = logging.getLogger(__name__)
DEEPSEEK_CHAT_MODEL = get_deepseek_chat_model()

@dataclass
class Flashcard:
    """Represents a single flashcard"""
    id: int
    question: str
    answer: str
    difficulty: str  # 'easy', 'medium', 'difficult'
    category: str  # Section of the topic the card covers
    hint: Optional[str] = None


class FlashcardService:
    """
    Service for generating educational flashcards using Vertex AI as primary and DeepSeek as fallback for all subjects.
    
    Supports two modes:
    - Batch mode: Generate up to 100 cards at once
    - Streaming mode: Generate cards one at a time for >100 cards
    """
    
    def __init__(self):
        self.api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.api_url = 'https://api.deepseek.com/chat/completions'
        self.max_batch_size = 100
        self.timeout = 60  # seconds
        
        # Vertex AI service (primary for all subjects)
        self.vertex_service = None
        try:
            from services.vertex_service import vertex_service
            self.vertex_service = vertex_service
            if self.vertex_service.is_available():
                logger.info("✅ Vertex AI service available for flashcards (primary)")
            else:
                logger.warning("⚠️ Vertex AI service not available - flashcards will use DeepSeek fallback")
        except Exception as e:
            logger.warning(f"⚠️ Could not initialize Vertex AI service: {e}")
        
        if not self.api_key:
            logger.warning("DEEPSEEK_API_KEY not configured - DeepSeek fallback will be unavailable")
    
    def _is_a_level_subject(self, subject: str) -> bool:
        """Check if subject is an A-level subject"""
        a_level_indicators = ['A Level', 'A-Level']
        return any(indicator in subject for indicator in a_level_indicators)
    
    def generate_flashcards(
        self,
        subject: str,
        topic: str,
        notes_content: str,
        count: int = 20
    ) -> List[Dict]:
        """
        Generate a batch of flashcards for a topic.
        
        Args:
            subject: Science subject (Biology, Chemistry, Physics)
            topic: Topic name
            notes_content: Full notes text to base flashcards on
            count: Number of flashcards to generate (max 100 per batch)
        
        Returns:
            List of flashcard dictionaries
        """
        # Require at least one provider (Vertex primary or DeepSeek fallback)
        if not (self.vertex_service and self.vertex_service.is_available()) and not self.api_key:
            logger.error("Neither Vertex AI nor DEEPSEEK_API_KEY available")
            return self._generate_fallback_flashcards(topic, count)
        
        # Limit batch size
        actual_count = min(count, self.max_batch_size)
        
        try:
            prompt = self._create_batch_prompt(subject, topic, notes_content, actual_count)
            
            # Primary: Vertex AI for all subjects
            response = None
            if self.vertex_service and self.vertex_service.is_available():
                response = self._send_vertex_ai_request(prompt)
                if response:
                    logger.info(f"Generated flashcards for {topic} via Vertex AI (primary)")
            # Fallback: DeepSeek
            if not response and self.api_key:
                logger.info(f"Falling back to DeepSeek for flashcards ({topic})")
                response = self._send_api_request(prompt)
            
            if response:
                flashcards = self._parse_flashcards_response(response, actual_count)
                logger.info(f"✅ Generated {len(flashcards)} flashcards for {topic} ({subject})")
                return flashcards
            else:
                logger.warning(f"Failed to generate flashcards, using fallback")
                return self._generate_fallback_flashcards(topic, actual_count)
                
        except Exception as e:
            logger.error(f"Error generating flashcards: {e}")
            return self._generate_fallback_flashcards(topic, actual_count)
    
    def generate_single_flashcard(
        self,
        subject: str,
        topic: str,
        notes_content: str,
        index: int,
        previous_questions: List[str] = None
    ) -> Optional[Dict]:
        """
        Generate a single flashcard (for streaming mode with >100 cards).
        
        Args:
            subject: Science subject
            topic: Topic name  
            notes_content: Notes text
            index: Card number in sequence
            previous_questions: List of previous questions to avoid repeats
        
        Returns:
            Single flashcard dictionary or None
        """
        # Require at least one provider (Vertex primary or DeepSeek fallback)
        if not (self.vertex_service and self.vertex_service.is_available()) and not self.api_key:
            return self._generate_single_fallback(topic, index)
        
        try:
            prompt = self._create_single_prompt(subject, topic, notes_content, index, previous_questions)
            
            # Primary: Vertex AI for all subjects
            response = None
            if self.vertex_service and self.vertex_service.is_available():
                response = self._send_vertex_ai_request(prompt)
                if response:
                    logger.info(f"Generated single flashcard for {topic} via Vertex AI (primary)")
            # Fallback: DeepSeek
            if not response and self.api_key:
                logger.info(f"Falling back to DeepSeek for single flashcard ({topic})")
                response = self._send_api_request(prompt, timeout=30)
            
            if response:
                flashcard = self._parse_single_flashcard(response, index)
                return flashcard
            else:
                return self._generate_single_fallback(topic, index)
                
        except Exception as e:
            logger.error(f"Error generating single flashcard: {e}")
            return self._generate_single_fallback(topic, index)
    
    def _create_batch_prompt(
        self, 
        subject: str, 
        topic: str, 
        notes_content: str, 
        count: int
    ) -> str:
        """Create prompt for batch flashcard generation"""
        # Truncate notes to avoid token limit
        truncated_notes = notes_content[:8000] if len(notes_content) > 8000 else notes_content
        
        # Detect if A Level or O Level
        is_a_level = self._is_a_level_subject(subject)
        level = "A-Level" if is_a_level else "ZIMSEC O-Level"
        
        # Enhanced prompt for A-level subjects
        if is_a_level:
            return f"""You are an expert Cambridge/ZIMSEC A-Level {subject.replace('A Level ', '')} teacher with 15+ years of experience creating high-quality educational flashcards for advanced students.

TOPIC: {topic}
SUBJECT: {subject}
EXAM BOARD: Cambridge/ZIMSEC A-Level

NOTES CONTENT TO BASE FLASHCARDS ON:
{truncated_notes}

TASK: Generate exactly {count} high-quality A-Level flashcards that comprehensively cover this topic with appropriate depth and complexity.

REQUIREMENTS FOR A-LEVEL FLASHCARDS:
1. Test higher-order thinking skills: analysis, evaluation, and synthesis, not just recall.
2. Include application questions that require students to apply concepts to new situations.
3. Cover complex relationships, mechanisms, and theoretical frameworks.
4. Use proper scientific terminology and notation appropriate for A-Level.
5. For Chemistry/Physics: Include mathematical derivations and formula applications where relevant.
6. For Biology: Include detailed processes, pathways, and regulatory mechanisms.
7. Questions should challenge students to think critically and make connections.
8. Answers should be comprehensive (3-5 sentences) with sufficient detail for A-Level standard.
9. Include hints that guide students toward the answer without giving it away.
10. Make flashcards exam-relevant and aligned with Cambridge/ZIMSEC A-Level standards.

DIFFICULTY DISTRIBUTION:
- 20% Easy: Core definitions, fundamental concepts
- 50% Medium: Application, analysis, comparisons, mechanisms
- 30% Difficult: Synthesis, evaluation, complex problem-solving, exam-style questions

OUTPUT FORMAT (JSON array only, no other text):
[
  {{
    "id": 1,
    "question": "Clear, specific A-Level question that tests understanding?",
    "answer": "Comprehensive answer with appropriate depth (3-5 sentences).",
    "difficulty": "easy|medium|difficult",
    "category": "Section name from notes",
    "hint": "Helpful hint that guides without revealing (null if not needed)"
  }},
  ...
]

Generate {count} high-quality A-Level flashcards now:"""
        
        # O-Level prompt (original)
        return f"""You are an expert {level} {subject} teacher creating educational flashcards for students.

TOPIC: {topic}
SUBJECT: {subject}

NOTES CONTENT TO BASE FLASHCARDS ON:
{truncated_notes}

TASK: Generate exactly {count} educational flashcards that comprehensively cover this topic.

REQUIREMENTS:
1. Each flashcard must test understanding, not just memorization.
2. For Mathematics, include step-by-step logic in the answer where appropriate.
3. Use KaTeX for ALL mathematical formulas and expressions (use $[formula]$ for inline and $$[formula]$$ for blocks).
4. Questions should range from easy to difficult.
5. Distribute cards across ALL sections of the topic.
6. Answers should be concise but complete (2-4 sentences max).
7. Include a helpful hint for harder questions.
8. Make flashcards engaging and relevant to exams.

DIFFICULTY DISTRIBUTION:
- 30% Easy: Definitions, simple facts
- 50% Medium: Application, comparisons
- 20% Difficult: Analysis, synthesis, exam-style

OUTPUT FORMAT (JSON array only, no other text):
[
  {{
    "id": 1,
    "question": "Clear, specific question here?",
    "answer": "Concise, accurate answer here.",
    "difficulty": "easy|medium|difficult",
    "category": "Section name from notes",
    "hint": "Optional helpful hint (null if not needed)"
  }},
  ...
]

Generate {count} flashcards now:"""


    def _create_single_prompt(
        self, 
        subject: str, 
        topic: str, 
        notes_content: str, 
        index: int,
        previous_questions: List[str] = None
    ) -> str:
        """Create prompt for single flashcard generation"""
        
        # Truncate notes
        truncated_notes = notes_content[:6000] if len(notes_content) > 6000 else notes_content
        
        avoid_text = ""
        if previous_questions:
            # Include last 10 questions to avoid
            recent = previous_questions[-10:]
            avoid_text = f"\n\nDO NOT repeat these previous questions:\n" + "\n".join(f"- {q}" for q in recent)
        
        difficulty = "easy" if index % 5 < 2 else "medium" if index % 5 < 4 else "difficult"
        
        # Detect if A Level or O Level
        is_a_level = self._is_a_level_subject(subject)
        level = "A-Level" if is_a_level else "ZIMSEC O-Level"
        
        # Enhanced prompt for A-level subjects
        if is_a_level:
            return f"""You are an expert Cambridge/ZIMSEC A-Level {subject.replace('A Level ', '')} teacher. Generate ONE unique, high-quality A-Level flashcard.

TOPIC: {topic}
CARD NUMBER: {index + 1}
REQUIRED DIFFICULTY: {difficulty}
EXAM BOARD: Cambridge/ZIMSEC A-Level
{avoid_text}

NOTES EXCERPT:
{truncated_notes[:3000]}

REQUIREMENTS FOR A-LEVEL FLASHCARD:
- Test higher-order thinking: analysis, evaluation, or synthesis
- Use proper A-Level scientific terminology
- Answer should be comprehensive (3-5 sentences) with appropriate depth
- Include application to real-world scenarios where relevant
- For Chemistry/Physics: Include mathematical reasoning if applicable
- For Biology: Include detailed mechanisms and processes
- Make it challenging and exam-relevant

Generate ONE A-Level flashcard in this exact JSON format:
{{
  "id": {index + 1},
  "question": "Your unique A-Level question here?",
  "answer": "Comprehensive answer with appropriate depth (3-5 sentences)",
  "difficulty": "{difficulty}",
  "category": "Relevant section name",
  "hint": "Helpful hint that guides without revealing (null if not needed)"
}}

Generate the A-Level flashcard now (JSON only):"""
        
        # O-Level prompt (original)
        return f"""You are an expert {level} {subject} teacher. Generate ONE unique flashcard.

TOPIC: {topic}
CARD NUMBER: {index + 1}
REQUIRED DIFFICULTY: {difficulty}
{avoid_text}

NOTES EXCERPT:
{truncated_notes[:3000]}

REQUIREMENTS FOR MATHEMATICS:
- Use KaTeX for ALL mathematical formulas ($[formula]$ or $$[formula]$$).
- Focus on logic and problem-solving steps.

Generate ONE flashcard in this exact JSON format:
{{
  "id": {index + 1},
  "question": "Your unique question here?",
  "answer": "Concise answer (2-4 sentences)",
  "difficulty": "{difficulty}",
  "category": "Relevant section name",
  "hint": "Helpful hint or null"
}}

Generate the flashcard now (JSON only):"""

    def _send_api_request(self, prompt: str, timeout: int = None) -> Optional[str]:
        """Send request to DeepSeek API"""
        
        if timeout is None:
            timeout = self.timeout
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'model': DEEPSEEK_CHAT_MODEL,
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': 4000,
            'temperature': 0.7
        }
        
        try:
            response = requests.post(
                self.api_url,
                headers=headers,
                json=data,
                timeout=timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                if 'choices' in result and len(result['choices']) > 0:
                    return result['choices'][0]['message']['content'].strip()
            else:
                logger.error(f"DeepSeek API error: {response.status_code} - {response.text[:200]}")
                
        except requests.exceptions.Timeout:
            logger.warning(f"DeepSeek API timeout after {timeout}s")
        except requests.exceptions.ConnectionError as e:
            logger.error(f"DeepSeek connection error: {e}")
        except Exception as e:
            logger.error(f"DeepSeek API error: {e}")
        
        return None
    
    def _send_vertex_ai_request(self, prompt: str) -> Optional[str]:
        """Send request to Vertex AI Gemini (primary for all subjects)."""
        
        if not self.vertex_service or not self.vertex_service.is_available():
            logger.error("Vertex AI service not available")
            return None
        
        try:
            logger.info("📝 Generating flashcards using Vertex AI Gemini...")
            result = self.vertex_service.generate_text(prompt, model="gemini-2.5-flash")
            
            if result and result.get('success'):
                text = result.get('text', '').strip()
                logger.info(f"✅ Vertex AI generated response ({len(text)} chars)")
                return text
            else:
                error = result.get('error', 'Unknown error') if result else 'No response'
                logger.error(f"Vertex AI generation failed: {error}")
                return None
                
        except Exception as e:
            logger.error(f"Vertex AI request error: {e}")
            return None
    
    def _fix_latex_in_json(self, json_str: str) -> str:
        """Fix LaTeX backslash commands that get corrupted by JSON escape rules.
        
        AI generates LaTeX like \\text, \\frac, \\theta inside JSON strings,
        but \\t becomes tab, \\f becomes form-feed, \\b becomes backspace
        during JSON parsing. We pre-escape these before json.loads().
        """
        import re
        result = []
        i = 0
        in_string = False
        escape_next = False
        
        while i < len(json_str):
            ch = json_str[i]
            
            if escape_next:
                escape_next = False
                if ch in ('"', '\\', '/', 'n', 'r', 'u'):
                    result.append(ch)
                elif ch == 't':
                    lookahead = json_str[i+1:i+5] if i+1 < len(json_str) else ''
                    if lookahead.startswith('ext') or lookahead.startswith('heta') or lookahead.startswith('imes') or lookahead.startswith('an'):
                        result.append('\\')
                        result.append(ch)
                    else:
                        result.append(ch)
                elif ch == 'f':
                    lookahead = json_str[i+1:i+5] if i+1 < len(json_str) else ''
                    if lookahead.startswith('rac') or lookahead.startswith('oral'):
                        result.append('\\')
                        result.append(ch)
                    else:
                        result.append(ch)
                elif ch == 'b':
                    lookahead = json_str[i+1:i+6] if i+1 < len(json_str) else ''
                    if lookahead.startswith('egin') or lookahead.startswith('inom') or lookahead.startswith('eta') or lookahead.startswith('old') or lookahead.startswith('ar'):
                        result.append('\\')
                        result.append(ch)
                    else:
                        result.append(ch)
                else:
                    result.append('\\')
                    result.append(ch)
                i += 1
                continue
            
            if ch == '\\' and in_string:
                escape_next = True
                result.append(ch)
                i += 1
                continue
            
            if ch == '"' and (not result or result[-1] != '\\'):
                in_string = not in_string
            
            result.append(ch)
            i += 1
        
        return ''.join(result)

    def _fix_latex_in_card(self, card: Dict) -> Dict:
        """Fix corrupted LaTeX in parsed flashcard fields.
        
        After JSON parsing, control characters (tab, form-feed, backspace)
        that were originally LaTeX commands get restored.
        """
        for field in ('question', 'answer', 'hint'):
            val = card.get(field)
            if not val or not isinstance(val, str):
                continue
            val = val.replace('\t', '\\t')
            val = val.replace('\f', '\\f')
            val = val.replace('\b', '\\b')
            val = val.replace('\r', '\\r')
            card[field] = val
        return card

    def _parse_flashcards_response(self, response: str, expected_count: int) -> List[Dict]:
        """Parse batch flashcard response from AI"""
        
        try:
            response = response.strip()
            
            start_idx = response.find('[')
            end_idx = response.rfind(']') + 1
            
            if start_idx == -1 or end_idx == 0:
                logger.error("No JSON array found in response")
                return self._generate_fallback_flashcards("Topic", expected_count)
            
            json_str = response[start_idx:end_idx]
            json_str = self._fix_latex_in_json(json_str)
            
            try:
                flashcards = json.loads(json_str)
            except json.JSONDecodeError:
                json_str = response[start_idx:end_idx]
                flashcards = json.loads(json_str)
            
            valid_flashcards = []
            for i, card in enumerate(flashcards):
                card = self._fix_latex_in_card(card)
                if self._validate_flashcard(card):
                    card['id'] = i + 1
                    valid_flashcards.append(card)
            
            return valid_flashcards
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse flashcards JSON: {e}")
            return self._generate_fallback_flashcards("Topic", expected_count)
    
    def _parse_single_flashcard(self, response: str, index: int) -> Optional[Dict]:
        """Parse single flashcard response"""
        
        try:
            response = response.strip()
            
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                return None
            
            json_str = response[start_idx:end_idx]
            json_str = self._fix_latex_in_json(json_str)
            
            try:
                flashcard = json.loads(json_str)
            except json.JSONDecodeError:
                json_str = response[start_idx:end_idx]
                flashcard = json.loads(json_str)
            
            flashcard = self._fix_latex_in_card(flashcard)
            if self._validate_flashcard(flashcard):
                flashcard['id'] = index + 1
                return flashcard
                
        except json.JSONDecodeError:
            pass
        
        return None
    
    def _validate_flashcard(self, card: Dict) -> bool:
        """Validate flashcard has required fields"""
        required = ['question', 'answer', 'difficulty', 'category']
        return all(key in card and card[key] for key in required)
    
    def _generate_fallback_flashcards(self, topic: str, count: int) -> List[Dict]:
        """Generate fallback flashcards when AI is unavailable"""
        
        fallback_templates = [
            {"question": f"What is the main purpose of {topic}?", "answer": f"The main purpose involves understanding key concepts and their applications in living organisms.", "difficulty": "easy", "category": "Overview"},
            {"question": f"List three key points about {topic}.", "answer": "Please review the notes above for detailed key points about this topic.", "difficulty": "medium", "category": "Key Concepts"},
            {"question": f"How does {topic} relate to everyday life?", "answer": "This topic has practical applications in health, agriculture, and environmental science.", "difficulty": "medium", "category": "Applications"},
            {"question": f"What are common exam questions about {topic}?", "answer": "ZIMSEC exams often ask about definitions, diagrams, and practical applications.", "difficulty": "easy", "category": "Exam Tips"},
            {"question": f"Compare and contrast key concepts in {topic}.", "answer": "Look for similarities and differences between related concepts in the notes.", "difficulty": "difficult", "category": "Analysis"},
        ]
        
        flashcards = []
        for i in range(min(count, len(fallback_templates) * 3)):
            template = fallback_templates[i % len(fallback_templates)].copy()
            template['id'] = i + 1
            template['hint'] = "Review the notes section for more details."
            flashcards.append(template)
        
        return flashcards
    
    def _generate_single_fallback(self, topic: str, index: int) -> Dict:
        """Generate single fallback flashcard"""
        return {
            "id": index + 1,
            "question": f"What is an important concept in {topic}?",
            "answer": "Please review the notes above for key concepts.",
            "difficulty": "medium",
            "category": "General",
            "hint": "Check the key points section."
        }


# Global instance
flashcard_service = FlashcardService()
