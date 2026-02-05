"""
ZIMSEC O-Level Principles of Commerce Question Generator.
Paper 1: Multiple Choice (MCQ, 40 items).
Paper 2: Essay-type questions (20 marks each).

AI stack:
- Vertex AI (Gemini) as PRIMARY JSON generator via try_vertex_json.
- DeepSeek chat completion as FALLBACK.
"""

import os
import json
import requests
import logging
import random
from typing import Dict, Optional, Any

from utils.deepseek import get_deepseek_chat_model
from utils.vertex_ai_helper import try_vertex_json

try:
    from services.zimsec_commerce_syllabus import (
        ZIMSEC_COMMERCE_TOPIC_OBJECTIVES,
        ZIMSEC_COMMERCE_CODE,
        get_topic_objectives,
        get_paper1_prompt_guidance,
        get_paper2_prompt_guidance,
    )
except ImportError:
    ZIMSEC_COMMERCE_TOPIC_OBJECTIVES = {}
    ZIMSEC_COMMERCE_CODE = "4008"

    def get_topic_objectives(topic_name: str) -> dict:
        return {"subtopics": [], "learning_objectives": []}

    def get_paper1_prompt_guidance() -> str:
        return "ZIMSEC Commerce Paper 1: MCQ testing breadth of knowledge."

    def get_paper2_prompt_guidance() -> str:
        return "ZIMSEC Commerce Paper 2: Essay-type questions."


logger = logging.getLogger(__name__)


COMMERCE_SYSTEM_MESSAGE = (
    "You are an expert ZIMSEC O-Level Principles of Commerce examiner. "
    "Generate educational questions in valid JSON format only. "
    "Use Zimbabwean business context and examples (GMB, CCZ, SAZ, RBZ, EcoCash, NRZ, etc.) where appropriate."
)


class CommerceGenerator:
    """ZIMSEC O-Level Commerce generator with Vertex primary."""

    def __init__(self) -> None:
        self.api_key = os.environ.get("DEEPSEEK_API_KEY")
        self.api_url = "https://api.deepseek.com/v1/chat/completions"
        self.model = get_deepseek_chat_model()
        self.max_retries = 3
        self.timeouts = [30, 45, 60]
        self.retry_delay = 2
        self.connect_timeout = 10

        self.session = requests.Session()
        self.session.headers.update(
            {
                "Content-Type": "application/json",
                "User-Agent": "NerdX-Education/1.0",
            }
        )

        self.topics = dict(ZIMSEC_COMMERCE_TOPIC_OBJECTIVES) if ZIMSEC_COMMERCE_TOPIC_OBJECTIVES else {}

    def generate_mcq_question(
        self,
        topic: str,
        difficulty: str = "medium",
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate a single MCQ for Paper 1 (topical or exam mode)."""
        try:
            prompt = self._create_mcq_prompt(topic, difficulty)
            context = f"commerce:mcq:{topic}:{difficulty}"
            vertex_prompt = f"{COMMERCE_SYSTEM_MESSAGE}\n\n{prompt}"

            logger.info("Trying Vertex AI (primary) for %s", context)
            vertex_response = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if vertex_response and "question" in vertex_response:
                return self._validate_and_enhance_mcq(vertex_response, topic, difficulty, user_id, source="vertex_ai")

            logger.info("Falling back to DeepSeek for %s", context)
            response = self._call_deepseek_api(prompt, "mcq")
            if response and "question" in response:
                return self._validate_and_enhance_mcq(response, topic, difficulty, user_id, source="deepseek_fallback")

            return self._get_fallback_mcq_question(topic, difficulty, user_id)
        except Exception as exc:
            logger.error("Error generating Commerce MCQ question: %s", exc, exc_info=True)
            return self._get_fallback_mcq_question(topic, difficulty, user_id)

    def generate_essay_question(
        self,
        topic: str,
        difficulty: str = "medium",
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate a Paper 2 essay-type question."""
        try:
            prompt = self._create_essay_prompt(topic, difficulty)
            context = f"commerce:essay:{topic}:{difficulty}"
            vertex_prompt = f"{COMMERCE_SYSTEM_MESSAGE}\n\n{prompt}"

            logger.info("Trying Vertex AI (primary) for %s", context)
            vertex_response = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if vertex_response:
                return self._validate_and_enhance_essay(vertex_response, topic, difficulty, user_id, source="vertex_ai")

            logger.info("Falling back to DeepSeek for %s", context)
            response = self._call_deepseek_api(prompt, "essay")
            if response:
                return self._validate_and_enhance_essay(response, topic, difficulty, user_id, source="deepseek_fallback")

            return self._get_fallback_essay_question(topic, difficulty, user_id)
        except Exception as exc:
            logger.error("Error generating Commerce essay question: %s", exc, exc_info=True)
            return self._get_fallback_essay_question(topic, difficulty, user_id)

    def _topic_info(self, topic: str) -> dict:
        """Resolve topic to syllabus objectives."""
        try:
            info = get_topic_objectives(topic)
            if info and (info.get("subtopics") or info.get("learning_objectives")):
                return info
        except Exception:
            pass
        return self.topics.get(topic, {})

    def _create_mcq_prompt(self, topic: str, difficulty: str) -> str:
        """Create Paper 1 MCQ prompt."""
        topic_info = self._topic_info(topic)
        subtopics = topic_info.get("subtopics", [])
        objectives = topic_info.get("learning_objectives", [])
        selected_subtopic = random.choice(subtopics) if subtopics else topic

        diff_text = {
            "easy": "Focus on basic definitions and identification. Suitable for early revision.",
            "medium": "Include application and simple analysis. Suitable for exam preparation.",
            "difficult": "Require analysis, comparison, and Zimbabwean context. Suitable for advanced revision.",
        }
        paper1_guide = get_paper1_prompt_guidance()
        objs_text = "\n".join(
            f"- {obj}"
            for obj in (objectives[:4] if objectives else ["Align to ZIMSEC Commerce syllabus for this topic."])
        )

        return f"""You are an expert ZIMSEC O-Level Principles of Commerce examiner (syllabus {ZIMSEC_COMMERCE_CODE}).

**Paper 1 Focus**: {paper1_guide}

**Topic**: {topic}
**Subtopic Focus**: {selected_subtopic}
**Difficulty**: {difficulty}
**Difficulty Guidance**: {diff_text.get(difficulty, diff_text["medium"])}

**Learning objectives to test (syllabus-aligned)**:
{objs_text}

**Requirements**:
1. Question must be clear, unambiguous, and age-appropriate for O-Level Commerce.
2. Provide exactly 4 options (A, B, C, D); only ONE must be correct.
3. Avoid "All of the above" or "None of the above".
4. Use Zimbabwean examples (GMB, CCZ, SAZ, RBZ, EcoCash, OK Zimbabwe, NRZ, etc.) where relevant.

**Response Format (JSON only)**:
{{
  "question": "Clear question text",
  "options": {{
    "A": "First option",
    "B": "Second option",
    "C": "Third option",
    "D": "Fourth option"
  }},
  "correct_answer": "A",
  "explanation": "Detailed explanation of why the answer is correct and why other options are wrong.",
  "topic": "{topic}",
  "subtopic": "{selected_subtopic}",
  "difficulty": "{difficulty}"
}}

Generate ONE high-quality MCQ now."""

    def _create_essay_prompt(self, topic: str, difficulty: str) -> str:
        """Create Paper 2 essay prompt."""
        topic_info = self._topic_info(topic)
        subtopics = topic_info.get("subtopics", [])
        objectives = topic_info.get("learning_objectives", [])
        selected_subtopic = random.choice(subtopics) if subtopics else topic
        paper2_guide = get_paper2_prompt_guidance()
        objs_text = "\n".join(
            f"- {obj}"
            for obj in (objectives[:4] if objectives else ["Align to ZIMSEC Commerce syllabus for this topic."])
        )

        return f"""You are an expert ZIMSEC O-Level Principles of Commerce examiner (syllabus {ZIMSEC_COMMERCE_CODE}).

**Paper 2 Focus**: {paper2_guide}

**Topic**: {topic}
**Subtopic Focus**: {selected_subtopic}
**Difficulty**: {difficulty}

**Learning objectives to target (syllabus-aligned)**:
{objs_text}

**Requirements**:
1. Create ONE essay-type question suitable for 15-20 marks (Section B style).
2. Include essay structure: Introduction, Body (with subheadings), Conclusion.
3. Provide essay_plan with mark allocation, key_terms, and marking_criteria.
4. Use command words: Explain, Describe, Discuss, Compare, Evaluate.
5. Include Zimbabwean context and examples where appropriate.

**Response Format (JSON only)**:
{{
  "question_type": "essay",
  "question": "Full question text including any context",
  "command_word": "Discuss",
  "marks": 20,
  "essay_plan": {{
    "introduction": "2 marks - Define key terms, set context",
    "main_body": [
      {{"section": "Section 1", "content": "Key points", "marks": 6}},
      {{"section": "Section 2", "content": "Key points", "marks": 6}},
      {{"section": "Section 3", "content": "Key points", "marks": 4}}
    ],
    "conclusion": "2 marks - Summarise, final statement"
  }},
  "must_include_terms": ["term1", "term2", "term3"],
  "marking_criteria": {{
    "A": "Excellent: 16-20 marks",
    "B": "Good: 12-15 marks",
    "C": "Satisfactory: 8-11 marks",
    "D": "Limited: 4-7 marks",
    "E": "Very limited: 0-3 marks"
  }},
  "sample_answer_outline": "Brief outline of an excellent response",
  "topic": "{topic}",
  "subtopic": "{selected_subtopic}",
  "difficulty": "{difficulty}"
}}

Generate ONE high-quality essay question now."""

    def _call_deepseek_api(self, prompt: str, generation_type: str) -> Optional[Dict]:
        """Call DeepSeek API with retries."""
        if not self.api_key:
            logger.error("DeepSeek API key not configured for CommerceGenerator")
            return None

        if not prompt or not prompt.strip():
            logger.error("Empty prompt provided to DeepSeek Commerce generator")
            return None

        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": COMMERCE_SYSTEM_MESSAGE},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 2000,
        }

        for attempt in range(self.max_retries):
            timeout = self.timeouts[min(attempt, len(self.timeouts) - 1)]
            if attempt > 0:
                import time as _time
                backoff = self.retry_delay * (2 ** (attempt - 1)) + random.uniform(0, 1)
                logger.info("DeepSeek Commerce %s retry %s/%s", generation_type, attempt + 1, self.max_retries)
                _time.sleep(backoff)

            try:
                self.session.headers.update(headers)
                response = self.session.post(
                    self.api_url,
                    json=payload,
                    timeout=(self.connect_timeout, timeout),
                )
                if response.status_code != 200:
                    logger.warning("DeepSeek Commerce %s HTTP %s", generation_type, response.status_code)
                    continue

                result = response.json()
                content = (result.get("choices", [{}])[0].get("message", {}) or {}).get("content", "")
                if not content:
                    continue

                try:
                    if "```json" in content:
                        json_str = content.split("```json")[1].split("```")[0].strip()
                    elif "```" in content:
                        json_str = content.split("```")[1].split("```")[0].strip()
                    else:
                        json_str = content.strip()
                    return json.loads(json_str)
                except json.JSONDecodeError as exc:
                    logger.error("DeepSeek Commerce JSON parse error: %s", exc)
                    continue
            except requests.exceptions.Timeout:
                logger.warning("DeepSeek Commerce %s timeout on attempt %s", generation_type, attempt + 1)
            except Exception as exc:
                logger.error("DeepSeek Commerce %s error on attempt %s: %s", generation_type, attempt + 1, exc)

        return None

    def _validate_and_enhance_mcq(
        self,
        data: Dict,
        topic: str,
        difficulty: str,
        user_id: Optional[str],
        source: str,
    ) -> Dict:
        """Validate and format MCQ for mobile/quiz API."""
        options = data.get("options") or {}
        if isinstance(options, dict):
            cleaned_options = options
        else:
            labels = ["A", "B", "C", "D"]
            cleaned_options = {labels[i]: opt for i, opt in enumerate(options[:4])}

        correct = data.get("correct_answer") or data.get("correct_option") or "A"
        if isinstance(correct, str):
            correct = correct.strip().upper()
        else:
            correct = "A"

        opt_list = [cleaned_options.get("A", ""), cleaned_options.get("B", ""), cleaned_options.get("C", ""), cleaned_options.get("D", "")]
        opt_list = [o for o in opt_list if o]
        correct_text = cleaned_options.get(correct, opt_list[0] if opt_list else "")

        return {
            "question": data.get("question", ""),
            "options": opt_list,
            "correct_answer": correct_text,
            "explanation": data.get("explanation", ""),
            "topic": topic,
            "subtopic": data.get("subtopic", topic),
            "difficulty": difficulty,
            "question_type": "mcq",
            "subject": "commerce",
            "source": source,
            "user_id": user_id,
        }

    def _validate_and_enhance_essay(
        self,
        data: Dict,
        topic: str,
        difficulty: str,
        user_id: Optional[str],
        source: str,
    ) -> Dict:
        """Validate and format essay for mobile/quiz API."""
        return {
            "question_type": "essay",
            "question": data.get("question", ""),
            "command_word": data.get("command_word", "Discuss"),
            "marks": data.get("marks", 20),
            "essay_plan": data.get("essay_plan", {}),
            "must_include_terms": data.get("must_include_terms", []),
            "marking_criteria": data.get("marking_criteria", {}),
            "sample_answer_outline": data.get("sample_answer_outline", ""),
            "topic": topic,
            "subtopic": data.get("subtopic", topic),
            "difficulty": difficulty,
            "subject": "commerce",
            "source": source,
            "user_id": user_id,
        }

    def _get_fallback_mcq_question(self, topic: str, difficulty: str, user_id: Optional[str]) -> Dict:
        """Simple Commerce fallback MCQ."""
        return {
            "question": "What is the reward for land as a factor of production?",
            "options": ["Wages", "Rent", "Interest", "Profit"],
            "correct_answer": "Rent",
            "explanation": "Land receives rent as its reward. Labor receives wages, capital receives interest, and the entrepreneur receives profit.",
            "topic": topic or "Production",
            "subtopic": topic or "Production",
            "difficulty": difficulty,
            "question_type": "mcq",
            "subject": "commerce",
            "user_id": user_id,
        }

    def _get_fallback_essay_question(self, topic: str, difficulty: str, user_id: Optional[str]) -> Dict:
        """Simple Commerce fallback essay."""
        return {
            "question_type": "essay",
            "question": "Explain the relationship between production and commerce. In your answer, define both terms and use Zimbabwean examples to illustrate how they are interdependent.",
            "command_word": "Explain",
            "marks": 20,
            "essay_plan": {
                "introduction": "2 marks - Define production and commerce",
                "main_body": [
                    {"section": "Production", "content": "Creation of goods and services; examples from Zimbabwe", "marks": 6},
                    {"section": "Commerce", "content": "Distribution of goods from producer to consumer; examples", "marks": 6},
                    {"section": "Interdependence", "content": "How production needs commerce for distribution; commerce needs production for goods", "marks": 4},
                ],
                "conclusion": "2 marks - Summarise the complementary relationship",
            },
            "must_include_terms": ["production", "commerce", "goods", "services", "distribution"],
            "marking_criteria": {
                "A": "Excellent: 16-20 marks",
                "B": "Good: 12-15 marks",
                "C": "Satisfactory: 8-11 marks",
                "D": "Limited: 4-7 marks",
                "E": "Very limited: 0-3 marks",
            },
            "sample_answer_outline": "Define production and commerce -> Explain production creates goods/services -> Explain commerce distributes -> Discuss interdependence with Zimbabwe examples (farmer->GMB->retailer->consumer) -> Conclusion",
            "topic": topic or "Production",
            "subtopic": topic or "Production",
            "difficulty": difficulty,
            "subject": "commerce",
            "user_id": user_id,
        }


commerce_generator = CommerceGenerator()
