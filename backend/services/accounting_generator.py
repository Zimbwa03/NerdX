"""
ZIMSEC O-Level Principles of Accounting (7112) Question Generator.
Paper 1: 40 Multiple Choice Questions (40 marks, 1 hour).
Paper 2: Structured (not implemented in v1 – MCQ only).

AI stack:
- Vertex AI (Gemini) as PRIMARY JSON generator via try_vertex_json.
- Optional consumer Gemini API as FALLBACK.
"""

import logging
from typing import Dict, Optional, Any

from utils.vertex_ai_helper import try_vertex_json, try_gemini_json

logger = logging.getLogger(__name__)

ZIMSEC_ACCOUNTING_CODE = "7112"

ACCOUNTING_SYSTEM_MESSAGE = (
    "You are an expert ZIMSEC O-Level Principles of Accounting examiner (syllabus 7112). "
    "Generate educational MCQ questions in valid JSON format only. "
    "Test double-entry bookkeeping, financial statements, and accounting concepts. "
    "Use clear business scenarios and Zimbabwean context where appropriate."
)


class AccountingGenerator:
    """ZIMSEC O-Level Principles of Accounting generator – Paper 1 MCQs only."""

    def generate_topical_question(
        self,
        topic: str,
        difficulty: str = "medium",
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate a single Paper 1-style MCQ for Principles of Accounting (topical or exam mode).
        """
        try:
            prompt = self._create_mcq_prompt(topic, difficulty)
            context = f"accounting:mcq:{topic}:{difficulty}"
            vertex_prompt = f"{ACCOUNTING_SYSTEM_MESSAGE}\n\n{prompt}"

            logger.info("Trying Vertex AI (primary) for %s", context)
            vertex_response = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if vertex_response and "question" in vertex_response:
                return self._validate_and_enhance_mcq(vertex_response, topic, difficulty, user_id, source="vertex_ai")

            logger.info("Falling back to Gemini API for %s", context)
            response = try_gemini_json(vertex_prompt, logger=logger, context=context)
            if response and "question" in response:
                return self._validate_and_enhance_mcq(response, topic, difficulty, user_id, source="gemini_fallback")

            return self._get_fallback_mcq_question(topic, difficulty, user_id)
        except Exception as exc:
            logger.error("Error generating Accounting MCQ question: %s", exc, exc_info=True)
            return self._get_fallback_mcq_question(topic, difficulty, user_id)

    def _create_mcq_prompt(self, topic: str, difficulty: str) -> str:
        """Create ZIMSEC Principles of Accounting Paper 1 MCQ prompt."""
        diff_text = {
            "easy": "Focus on definitions, basic concepts, and identification. Suitable for early revision.",
            "medium": "Include application of double entry, simple calculations, and interpretation. Suitable for Forms 3–4.",
            "hard": "Require analysis, adjustments, and preparation of ledger/trial balance elements. Suitable for exam preparation.",
        }
        guidance = diff_text.get(difficulty, diff_text["medium"])

        return f"""You are an expert ZIMSEC O-Level Principles of Accounting examiner (syllabus {ZIMSEC_ACCOUNTING_CODE}).

**Paper 1**: 40 MCQs (1 hour). Test breadth of accounting knowledge: double entry, ledger, trial balance, financial statements, adjustments, partnerships, companies, cash flow, interpretation, not-for-profit, manufacturing.

**Topic**: {topic}
**Difficulty**: {difficulty}
**Difficulty Guidance**: {guidance}

**Requirements**:
1. Question must be clear, unambiguous, and age-appropriate for Forms 3–4.
2. Provide exactly 4 options (A–D); only ONE must be correct.
3. Avoid 'All of the above' or 'None of the above'.
4. Where numbers are used, keep calculations simple and syllabus-aligned.
5. Use standard accounting terminology (assets, liabilities, capital, revenue, expenses, debit, credit).

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

    def _validate_and_enhance_mcq(
        self,
        data: Dict,
        topic: str,
        difficulty: str,
        user_id: Optional[str],
        source: str,
    ) -> Dict:
        """Normalize MCQ response to standard shape (options dict A–D, correct_answer, explanation)."""
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
            "subject": "accounting",
            "source": source,
            "user_id": user_id,
        }

    def _get_fallback_mcq_question(self, topic: str, difficulty: str, user_id: Optional[str]) -> Dict:
        """Simple fallback MCQ when AI fails (from syllabus Topic 1 sample)."""
        question = "What is the PRIMARY purpose of accounting?"
        options = {
            "A": "To prepare tax returns",
            "B": "To provide financial information for decision-making",
            "C": "To record all business transactions",
            "D": "To prepare budgets",
        }
        explanation = (
            "Accounting provides systematic financial information to help stakeholders make informed business decisions."
        )
        return {
            "question": question,
            "options": options,
            "correct_answer": "B",
            "explanation": explanation,
            "topic": topic or "Introduction to Principles of Accounting",
            "subtopic": topic or "Introduction to Principles of Accounting",
            "difficulty": difficulty,
            "question_type": "mcq",
            "subject": "accounting",
            "user_id": user_id,
        }
