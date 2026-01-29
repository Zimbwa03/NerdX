"""
NerdX GeoTutor – Maps-based Geography Learning Lab (ZIMSEC O-Level + A-Level).
Uses DeepSeek AI to provide teaching feedback from map_actions (markers, distance, bearing, etc.).
"""

import json
import logging
from typing import Any, Dict, List, Optional

from utils.deepseek import call_deepseek_chat

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are **NerdX GeoTutor**, an expert ZIMSEC Geography teacher, examiner, and fieldwork coach.
You teach Geography through interactive map work. You must:
- Teach using map actions the student performed (markers, distance, bearing, selected place).
- Align learning strictly to **ZIMSEC O-Level + A-Level** Geography outcomes.
- Convert every map activity into **exam-ready understanding** (definitions → processes → application → evaluation).
- Include **practical skills**, **case studies** (Zimbabwe preferred for A-Level), and **exam-style questions**.

**Output format (strict):**
1. **What you did on the map** – 1–3 lines summarising their map actions.
2. **Micro-lesson** – Key terms, process, how map evidence supports the idea.
3. **Practical method (steps)** – How to calculate/interpret; common mistakes; mark hints.
4. **Checkpoint questions** – 3–6 MCQs or short structured questions.
5. **Exam practice** – One structured or essay-style question with marking points (depending on level).
6. **Model answers / marking points** – Brief model answer or key points.
7. **Case study link** (A-Level only) – One short Zimbabwean or relevant case study link to the topic.

Use clear headings (##) and bullet points. Keep response concise but exam-focused."""


def _build_user_prompt(
    level: str,
    topic: str,
    task_type: str,
    map_actions: Dict[str, Any],
    student_answer_text: Optional[str] = None,
) -> str:
    """Build the user prompt from map_actions and optional student answer."""
    parts = [
        f"**Level:** {'A-Level (ZIMSEC 9156)' if level.upper() == 'A' else 'O-Level'}",
        f"**Topic:** {topic or 'Map Work and GIS'}",
        f"**Task type:** {task_type or 'Mapwork'}",
        "",
        "**Map actions the student did:**",
        json.dumps(map_actions, indent=2),
    ]
    if student_answer_text and student_answer_text.strip():
        parts.extend(["", "**Student's written answer (mark and give feedback):**", student_answer_text.strip()])
    parts.extend(["", "Provide your full response in the required format (What you did → Micro-lesson → Practical method → Checkpoint questions → Exam practice → Model answers → Case study if A-Level)."])
    return "\n".join(parts)


def get_geotutor_feedback(
    level: str = "O",
    topic: str = "Map Work and Geographical Information Systems (GIS)",
    task_type: str = "Mapwork",
    map_actions: Optional[Dict[str, Any]] = None,
    student_answer_text: Optional[str] = None,
) -> str:
    """
    Call DeepSeek to generate NerdX GeoTutor feedback from map_actions.

    Args:
        level: "O" or "A"
        topic: Syllabus topic string
        task_type: e.g. "Mapwork", "Fieldwork simulation", "Case study analysis"
        map_actions: Dict with keys markers, lines, measurements, selected_place (per master prompt)
        student_answer_text: Optional typed response from student (for marking)

    Returns:
        AI response text (markdown).
    """
    map_actions = map_actions or {}
    # Ensure we have at least something to comment on
    if not map_actions and not student_answer_text:
        return (
            "**What you did on the map**\n\nYou haven't placed any markers or written an answer yet.\n\n"
            "**What to do:** Tap the map to place at least 2 points. You'll see straight-line distance and bearing. "
            "Then tap **Get AI feedback** again for a micro-lesson and exam-style questions."
        )

    user_prompt = _build_user_prompt(
        level=level,
        topic=topic,
        task_type=task_type,
        map_actions=map_actions,
        student_answer_text=student_answer_text,
    )

    try:
        response = call_deepseek_chat(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            temperature=0.6,
            max_tokens=2048,
        )
        return response.strip() if response else "Unable to generate feedback. Please try again."
    except Exception as e:
        logger.error("GeoTutor DeepSeek error: %s", e, exc_info=True)
        return "Sorry, the AI tutor is temporarily unavailable. Please try again later."
