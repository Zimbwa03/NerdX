"""
ZIMSEC O-Level History – 3-part Essay Marking Service.
Marks Part [a] (5), Part [b] (12), Part [c] (15) using ZIMSEC examiner criteria via Vertex AI (Gemini).
"""

import json
import logging
import re
from typing import Dict, Optional, Any

from services.vertex_service import vertex_service

logger = logging.getLogger(__name__)

ZIMSEC_EXAMINER_SYSTEM = """You are an expert ZIMSEC O-Level History examiner with 20+ years of experience marking examination papers. You have deep knowledge of ZIMSEC marking schemes, assessment criteria, and the Zimbabwe history curriculum. Your role is to evaluate student essays with the same rigor, fairness, and expertise as a senior chief examiner.

YOUR EXPERTISE INCLUDES:
- ZIMSEC History syllabus (Forms 1-4)
- Mark allocation and band descriptors (Bands 1-7)
- Common student errors and misconceptions
- Zimbabwean historical context and cultural sensitivity
- Essay structure requirements for different question types
- Evidence-based marking with specific justifications

YOUR MARKING PRINCIPLES:
1. Be fair, consistent, and objective
2. Reward what students know, not penalize what they don't
3. Look for analysis and critical thinking, not just facts
4. Recognize different valid interpretations of history
5. Provide constructive, actionable feedback
6. Maintain high standards while being encouraging
7. Use specific examples from student work in feedback

PART [a] (5 marks): 1 mark per correct item, any 5. Simple recall, bullet points acceptable.
PART [b] (12 marks): Two distinct aspects, two paragraphs, NO introduction or conclusion. Band 1 (10-12) = Excellent; Band 2 (8-9) = Very Good; etc.
PART [c] (15 marks): Balanced argument, introduction + body + conclusion (8-10 lines). Band 1 (13-15) = Excellent; Band 2 (11-12) = Very Good; etc.

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "part_a_score": 0,
  "part_b_score": 0,
  "part_c_score": 0,
  "total": 0,
  "part_a_feedback": "Brief comment on Part [a]",
  "part_b_feedback": "Brief comment on Part [b] with band",
  "part_c_feedback": "Brief comment on Part [c] with band",
  "constructive_feedback": "Overall strengths and areas for improvement",
  "breakdown": {
    "part_a_analysis": "What was correct/incorrect in [a]",
    "part_b_analysis": "What was done well / could improve in [b]",
    "part_c_analysis": "Balance of argument, evidence, conclusion in [c]"
  }
}"""


def mark_history_essay(
    question: Dict[str, Any],
    answers: Dict[str, str],
    user_id: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Mark a 3-part ZIMSEC History essay using Vertex AI.

    Args:
        question: Dict with question_text, parts ([{label, question_text, marks}]).
        answers: Dict with keys part_a, part_b, part_c (student answer text).
    Returns:
        Dict with part_a_score, part_b_score, part_c_score, total, feedback fields, success, error.
    """
    part_a = (answers.get("part_a") or "").strip()
    part_b = (answers.get("part_b") or "").strip()
    part_c = (answers.get("part_c") or "").strip()

    parts = question.get("parts") or []
    if len(parts) < 3:
        return {
            "success": False,
            "error": "Invalid question format: need 3 parts",
            "part_a_score": 0,
            "part_b_score": 0,
            "part_c_score": 0,
            "total": 0,
        }

    question_text = question.get("question_text") or ""
    stem = "\n".join([f"{p.get('label', '')} {p.get('question_text', '')} [{p.get('marks', 0)} marks]" for p in parts])

    prompt = f"""{ZIMSEC_EXAMINER_SYSTEM}

QUESTION BEING ASSESSED:
{question_text}
{stem}

STUDENT ANSWER TO MARK:

Part [a] Answer:
{part_a or '(No answer provided)'}

Part [b] Answer:
{part_b or '(No answer provided)'}

Part [c] Answer:
{part_c or '(No answer provided)'}

Mark the student's answer and return ONLY the JSON object as specified (part_a_score, part_b_score, part_c_score, total, part_a_feedback, part_b_feedback, part_c_feedback, constructive_feedback, breakdown)."""

    if not vertex_service.is_available():
        logger.warning("Vertex AI not available for history marking")
        return _fallback_marking(question, answers)

    try:
        result = vertex_service.generate_text(prompt=prompt, model="gemini-2.5-flash")
        if not result or not result.get("success") or not result.get("text"):
            return _fallback_marking(question, answers)

        text = result["text"].strip()
        data = _parse_marking_response(text)
        if data:
            total = data.get("part_a_score", 0) + data.get("part_b_score", 0) + data.get("part_c_score", 0)
            data["total"] = total
            data["success"] = True
            return data
    except Exception as e:
        logger.error("History marking error: %s", e, exc_info=True)

    return _fallback_marking(question, answers)


def _parse_marking_response(text: str) -> Optional[Dict[str, Any]]:
    """Extract JSON from model response."""
    cleaned = text.strip()
    # Strip markdown code fences if present
    fence = re.search(r"```(?:json)?\s*(.*?)```", cleaned, re.IGNORECASE | re.DOTALL)
    if fence:
        cleaned = fence.group(1).strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}") + 1
    if start >= 0 and end > start:
        try:
            return json.loads(cleaned[start:end])
        except json.JSONDecodeError:
            pass
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None


def _fallback_marking(question: Dict[str, Any], answers: Dict[str, str]) -> Dict[str, Any]:
    """Return a safe fallback when AI is unavailable."""
    part_a = (answers.get("part_a") or "").strip()
    part_b = (answers.get("part_b") or "").strip()
    part_c = (answers.get("part_c") or "").strip()
    # Very simple heuristic: give partial credit if something was written
    sa = 0 if not part_a else min(5, 1 + (len(part_a) // 50))
    sb = 0 if not part_b else min(12, 3 + (len(part_b) // 80))
    sc = 0 if not part_c else min(15, 3 + (len(part_c) // 100))
    return {
        "success": True,
        "part_a_score": sa,
        "part_b_score": sb,
        "part_c_score": sc,
        "total": sa + sb + sc,
        "part_a_feedback": "Automatic marking only. Submit again when AI marking is available for full feedback.",
        "part_b_feedback": "Automatic marking only. Submit again when AI marking is available for full feedback.",
        "part_c_feedback": "Automatic marking only. Submit again when AI marking is available for full feedback.",
        "constructive_feedback": "AI marking is temporarily unavailable. Your response was saved; try again later for detailed ZIMSEC-style feedback.",
        "breakdown": {},
    }
