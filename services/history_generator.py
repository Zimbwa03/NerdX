"""
ZIMSEC O-Level History – 3-part Essay Question Generator.
Paper 1: Essays only (ZIMSEC 3-stage format: Part [a] 5 marks, Part [b] 12 marks, Part [c] 15 marks).

Uses Vertex AI (Gemini) as primary, with template fallback.
"""

import logging
import uuid
from typing import Dict, Optional, Any, List

from utils.vertex_ai_helper import try_vertex_json
from constants import TOPICS

logger = logging.getLogger(__name__)

HISTORY_TOPICS = TOPICS.get("History", [
    "Conceptualisation of History",
    "Origins of Humankind",
    "Ancient Civilisations Egypt",
    "Development of Zimbabwean Societies",
    "Slavery and the Slave Trade",
    "Early European Contacts",
    "Colonisation",
    "Colonial Administration",
    "Nationalism",
    "Armed Struggle",
    "Post-Independence",
    "Regional Cooperation",
    "Sources of History",
    "Zimbabwean Societies",
    "European Contacts",
    "World Wars",
    "International Cooperation",
    "Socialism and Communism",
    "Constitution Democracy and Human Rights",
])

SYSTEM_MESSAGE = (
    "You are an expert ZIMSEC O-Level History examiner. "
    "Generate ONE 3-part essay question in the exact ZIMSEC format. "
    "Part [a]: List/Identify question worth 5 marks (simple recall, bullet points). "
    "Part [b]: Describe/Explain question worth 12 marks (two paragraphs, NO conclusion). "
    "Part [c]: Analytical/Evaluation question worth 15 marks (introduction + body + conclusion 8–10 lines). "
    "Return ONLY valid JSON."
)


def _normalize_topic(topic: Optional[str]) -> str:
    if not topic or not isinstance(topic, str):
        return HISTORY_TOPICS[0]
    topic_clean = topic.strip()
    for t in HISTORY_TOPICS:
        if t.lower() == topic_clean.lower():
            return t
        if t.lower().replace(" ", "_") == topic_clean.lower().replace(" ", "_"):
            return t
    return topic_clean or HISTORY_TOPICS[0]


def generate_question(topic: Optional[str], difficulty: str = "medium", user_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Generate one ZIMSEC-style 3-part History essay question for the given topic.

    Returns:
        Dict with: id, topic, question_text, parts ([{label, question_text, marks}]), total_marks (32),
        marking_notes (optional), difficulty.
    """
    topic_name = _normalize_topic(topic)
    context = f"history:essay:{topic_name}:{difficulty}"

    prompt = f"""Generate a ZIMSEC O-Level History 3-part essay question on this topic: **{topic_name}**.

Format (strict):
- Part [a]: One short question asking to LIST or IDENTIFY 5 items (e.g. "Name any five ..."). Worth 5 marks.
- Part [b]: One question asking to DESCRIBE or EXPLAIN (e.g. "Describe the ..."). Worth 12 marks. Answer = 2 paragraphs, NO conclusion.
- Part [c]: One analytical/evaluation question (e.g. "How far do you agree that ...?"). Worth 15 marks. Answer = intro + body + conclusion (8–10 lines).

Return ONLY this JSON (no markdown, no extra text):
{{
  "question_text": "Brief stem/context for the question (1–2 sentences).",
  "parts": [
    {{ "label": "[a]", "question_text": "...", "marks": 5 }},
    {{ "label": "[b]", "question_text": "...", "marks": 12 }},
    {{ "label": "[c]", "question_text": "...", "marks": 15 }}
  ],
  "marking_notes": "Optional short note for examiners (e.g. key expected points)."
}}"""

    full_prompt = f"{SYSTEM_MESSAGE}\n\n{prompt}"

    try:
        vertex_response = try_vertex_json(full_prompt, logger=logger, context=context)
        if vertex_response and vertex_response.get("parts") and len(vertex_response["parts"]) >= 3:
            return _build_question_payload(vertex_response, topic_name, difficulty, user_id, source="vertex_ai")
    except Exception as exc:
        logger.warning("Vertex AI history question generation failed: %s", exc)

    return _get_fallback_question(topic_name, difficulty, user_id)


def _build_question_payload(
    data: Dict,
    topic_name: str,
    difficulty: str,
    user_id: Optional[str],
    source: str = "vertex_ai",
) -> Dict[str, Any]:
    question_text = data.get("question_text") or "Answer the following parts in ZIMSEC format."
    parts_raw = data.get("parts") or []
    parts: List[Dict[str, Any]] = []
    for i, p in enumerate(parts_raw[:3]):
        label = p.get("label") or ["[a]", "[b]", "[c]"][i]
        parts.append({
            "label": label,
            "question_text": p.get("question_text") or "",
            "marks": int(p.get("marks", [5, 12, 15][i])),
        })
    if len(parts) < 3:
        parts = [
            {"label": "[a]", "question_text": "List five key points.", "marks": 5},
            {"label": "[b]", "question_text": "Describe the main developments.", "marks": 12},
            {"label": "[c]", "question_text": "How far do you agree with the given statement?", "marks": 15},
        ]
    total_marks = sum(p["marks"] for p in parts)
    return {
        "id": str(uuid.uuid4()),
        "topic": topic_name,
        "question_text": question_text,
        "parts": parts,
        "total_marks": total_marks,
        "marking_notes": data.get("marking_notes") or "",
        "difficulty": difficulty,
        "source": source,
    }


def _get_fallback_question(topic_name: str, difficulty: str, user_id: Optional[str]) -> Dict[str, Any]:
    """Fallback 3-part question when AI is unavailable."""
    return _build_question_payload(
        {
            "question_text": f"ZIMSEC O-Level History: {topic_name}.",
            "parts": [
                {"label": "[a]", "question_text": f"Name any five important aspects of {topic_name}.", "marks": 5},
                {"label": "[b]", "question_text": f"Describe the main developments in {topic_name}.", "marks": 12},
                {"label": "[c]", "question_text": f"\"{topic_name} was the most important factor.\" How far do you agree?", "marks": 15},
            ],
            "marking_notes": "Mark according to ZIMSEC bands for [a] 1 mark each, [b] 12 marks, [c] 15 marks.",
        },
        topic_name,
        difficulty,
        user_id,
        source="fallback",
    )
