"""
ZIMSEC O-Level Business Enterprise and Skills (4048) Question Generator.
Paper 1: Multiple Choice Questions (MCQs).
Paper 2: Essay questions (20 marks style).

AI stack:
- Vertex AI (Gemini) as PRIMARY JSON generator via try_vertex_json.
- Optional consumer Gemini API as FALLBACK.
"""

import logging
from typing import Dict, Optional, Any

from utils.vertex_ai_helper import try_vertex_json, try_gemini_json

logger = logging.getLogger(__name__)

ZIMSEC_BES_CODE = "4048"

BES_TOPICS = [
    "The Business Enterprise",
    "The Enterprising Environment",
    "Setting Up a New Enterprise",
    "Business Planning",
    "Enterprise Finance and Securing Investors",
    "People in Business Enterprises",
    "Markets and Marketing",
    "Operations Management",
]

BES_SYSTEM_MESSAGE = (
    "You are an expert ZIMSEC O-Level Business Enterprise and Skills examiner (syllabus 4048). "
    "Generate educational questions in valid JSON format only. "
    "Test business leadership, communication, critical thinking, problem solving, creativity, decision making, and team building. "
    "Use Zimbabwean context where appropriate."
)


class BESGenerator:
    """ZIMSEC O-Level Business Enterprise and Skills generator – Paper 1 MCQs, Paper 2 Essays."""

    def generate_topical_question(
        self,
        topic: str,
        difficulty: str = "medium",
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate a single Paper 1-style MCQ (topical or exam mode)."""
        try:
            prompt = self._create_mcq_prompt(topic, difficulty)
            context = f"bes:mcq:{topic}:{difficulty}"
            vertex_prompt = f"{BES_SYSTEM_MESSAGE}\n\n{prompt}"

            logger.info("Trying Vertex AI (primary) for %s", context)
            vertex_response = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if vertex_response and vertex_response.get("question"):
                return self._validate_and_enhance_mcq(vertex_response, topic, difficulty, user_id, source="vertex_ai")

            logger.info("Falling back to Gemini API for %s", context)
            response = try_gemini_json(vertex_prompt, logger=logger, context=context)
            if response and response.get("question"):
                return self._validate_and_enhance_mcq(response, topic, difficulty, user_id, source="gemini_fallback")

            return self._get_fallback_mcq_question(topic, difficulty, user_id)
        except Exception as exc:
            logger.error("Error generating BES MCQ question: %s", exc, exc_info=True)
            return self._get_fallback_mcq_question(topic, difficulty, user_id)

    def generate_essay_question(
        self,
        topic: str,
        difficulty: str = "medium",
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate a Paper 2-style essay question (20 marks)."""
        try:
            prompt = self._create_essay_prompt(topic, difficulty)
            context = f"bes:essay:{topic}:{difficulty}"
            vertex_prompt = f"{BES_SYSTEM_MESSAGE}\n\n{prompt}"

            logger.info("Trying Vertex AI (primary) for %s", context)
            vertex_response = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if vertex_response:
                return self._validate_and_enhance_essay(vertex_response, topic, difficulty, user_id, source="vertex_ai")

            logger.info("Falling back to Gemini API for %s", context)
            response = try_gemini_json(vertex_prompt, logger=logger, context=context)
            if response:
                return self._validate_and_enhance_essay(response, topic, difficulty, user_id, source="gemini_fallback")

            return self._get_fallback_essay_question(topic, difficulty, user_id)
        except Exception as exc:
            logger.error("Error generating BES essay question: %s", exc, exc_info=True)
            return self._get_fallback_essay_question(topic, difficulty, user_id)

    def _create_mcq_prompt(self, topic: str, difficulty: str) -> str:
        """Create ZIMSEC BES Paper 1 MCQ prompt."""
        diff_text = {
            "easy": "Focus on definitions, basic concepts, and identification. Suitable for early revision.",
            "medium": "Include application of business concepts, simple analysis. Suitable for Forms 3–4.",
            "hard": "Require analysis, evaluation, and decision-making scenarios. Suitable for exam preparation.",
        }
        guidance = diff_text.get(difficulty, diff_text["medium"])

        return f"""You are an expert ZIMSEC O-Level Business Enterprise and Skills examiner (syllabus {ZIMSEC_BES_CODE}).

**Paper 1**: MCQs testing breadth of knowledge: business enterprise, enterprising environment, setting up enterprise, business planning, finance and investors, people in business, markets and marketing, operations management.

**Topic**: {topic}
**Difficulty**: {difficulty}
**Difficulty Guidance**: {guidance}

**Requirements**:
1. Question must be clear, unambiguous, and age-appropriate for Forms 3–4.
2. Provide exactly 4 options (A–D); only ONE must be correct.
3. Avoid 'All of the above' or 'None of the above'.
4. Use standard business terminology (enterprise, stakeholder, marketing, operations, etc.).

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
  "explanation": "Detailed explanation of why the answer is correct and why other options are wrong. Include the key concept being tested.",
  "topic": "{topic}",
  "difficulty": "{difficulty}"
}}

Generate ONE high-quality MCQ now."""

    def _create_essay_prompt(self, topic: str, difficulty: str) -> str:
        """Create ZIMSEC BES Paper 2 essay prompt."""
        return f"""You are an expert ZIMSEC O-Level Business Enterprise and Skills examiner (syllabus {ZIMSEC_BES_CODE}).

**Paper 2**: Section B – Essay questions (20 marks each). Test deep understanding, analysis, and application.

**Topic**: {topic}
**Difficulty**: {difficulty}

**Requirements**:
1. Create ONE essay-type question suitable for 20 marks (Section B style).
2. Include essay structure: Introduction, Body (with subheadings), Conclusion.
3. Provide essay_plan with mark allocation, key_terms, and marking_criteria.
4. Use command words: Explain, Describe, Discuss, Compare, Evaluate, Analyse.
5. Include Zimbabwean context and examples where appropriate.

**Response Format (JSON only)**:
{{
  "question_type": "essay",
  "question": "Full question text including any context",
  "command_word": "Discuss",
  "total_marks": 20,
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
  "model_answer_outline": "Brief outline of an excellent response",
  "topic": "{topic}",
  "difficulty": "{difficulty}"
}}

Generate ONE high-quality essay question now."""

    def _validate_and_enhance_mcq(
        self,
        data: Dict,
        topic: str,
        difficulty: str,
        user_id: Optional[str],
        source: str,
    ) -> Dict:
        """Normalize MCQ response to standard shape."""
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

        return {
            "question": data.get("question", ""),
            "options": cleaned_options,
            "correct_answer": correct,
            "explanation": data.get("explanation", ""),
            "topic": topic,
            "subtopic": data.get("subtopic", topic),
            "difficulty": difficulty,
            "question_type": "mcq",
            "subject": "business_enterprise_skills",
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
        question = data.get("question", "") or data.get("question_text", "")
        essay_plan = data.get("essay_plan") or {}
        if isinstance(essay_plan, str):
            essay_plan = {"introduction": essay_plan, "main_body": [], "conclusion": ""}

        return {
            "question_type": "essay",
            "question": question,
            "question_text": question,
            "command_word": data.get("command_word", "Discuss"),
            "total_marks": data.get("total_marks", data.get("marks", 20)),
            "essay_plan": essay_plan,
            "must_include_terms": data.get("must_include_terms", []),
            "marking_criteria": data.get("marking_criteria", {}),
            "sample_answer_outline": data.get("sample_answer_outline", "") or data.get("model_answer_outline", ""),
            "model_answer_outline": data.get("model_answer_outline", "") or data.get("sample_answer_outline", ""),
            "topic": topic,
            "difficulty": difficulty,
            "subject": "business_enterprise_skills",
            "source": source,
            "user_id": user_id,
        }

    def _get_fallback_mcq_question(self, topic: str, difficulty: str, user_id: Optional[str]) -> Dict:
        """Simple fallback MCQ when AI fails."""
        question = "What is a business enterprise?"
        options = {
            "A": "A government department",
            "B": "An organisation that provides goods or services to earn profit or meet social goals",
            "C": "A non-profit only",
            "D": "A school",
        }
        explanation = "A business enterprise is an organisation that provides goods or services, often to earn profit or meet social objectives."
        return {
            "question": question,
            "options": options,
            "correct_answer": "B",
            "explanation": explanation,
            "topic": topic or BES_TOPICS[0],
            "subtopic": topic or BES_TOPICS[0],
            "difficulty": difficulty,
            "question_type": "mcq",
            "subject": "business_enterprise_skills",
            "user_id": user_id,
        }

    def _get_fallback_essay_question(self, topic: str, difficulty: str, user_id: Optional[str]) -> Dict:
        """Simple fallback essay when AI fails."""
        question = f"Discuss the importance of business planning for a new enterprise. Use examples where appropriate. [{topic or 'Business Planning'}]"
        return {
            "question_type": "essay",
            "question": question,
            "question_text": question,
            "command_word": "Discuss",
            "total_marks": 20,
            "essay_plan": {
                "introduction": "2 marks - Define business planning, set context",
                "main_body": [
                    {"section": "Benefits of planning", "content": "Reduces risk, sets objectives", "marks": 6},
                    {"section": "Key elements", "content": "Market research, finance, operations", "marks": 6},
                    {"section": "Examples", "content": "Zimbabwean SME context", "marks": 4},
                ],
                "conclusion": "2 marks - Summarise importance",
            },
            "must_include_terms": ["business plan", "objectives", "market research"],
            "marking_criteria": {
                "A": "Excellent: 16-20 marks",
                "B": "Good: 12-15 marks",
                "C": "Satisfactory: 8-11 marks",
                "D": "Limited: 4-7 marks",
                "E": "Very limited: 0-3 marks",
            },
            "sample_answer_outline": "Introduction: define planning. Body: benefits (risk, objectives), elements (market, finance), examples. Conclusion: summarise.",
            "model_answer_outline": "Introduction: define planning. Body: benefits (risk, objectives), elements (market, finance), examples. Conclusion: summarise.",
            "topic": topic or BES_TOPICS[0],
            "difficulty": difficulty,
            "subject": "business_enterprise_skills",
            "user_id": user_id,
        }
