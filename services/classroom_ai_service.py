"""
NerdX AI Classroom Service v2.0
Neuronet AI Solutions (Pvt) Ltd

AI-powered exam generation, marking engine, and student analytics.
Primary AI: Vertex AI (Gemini). Optional fallback: Google Gemini API (consumer key).
"""
import os
import json
import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")


def _call_ai(
    prompt: str,
    system: str = "",
    max_tokens: int = 4000,
    *,
    json_mode: bool = False,
) -> str:
    """Vertex AI first; if unavailable or empty, optional Gemini API."""
    model = os.environ.get("VERTEX_GEMINI_TEXT_MODEL", "gemini-2.5-flash")
    full = f"{system}\n\n{prompt}" if system else prompt
    try:
        from services.vertex_service import vertex_service

        if vertex_service.is_available():
            result = vertex_service.generate_text(
                full,
                model=model,
                max_output_tokens=max_tokens,
                temperature=0.7,
                json_mode=json_mode,
            )
            if result and result.get("success"):
                text = (result.get("text") or "").strip()
                if text:
                    return text
    except Exception as e:
        logger.warning("Vertex AI classroom call failed: %s", e)
    return _call_gemini(prompt, system, max_tokens)


def _call_gemini(prompt: str, system: str = "", max_tokens: int = 4000) -> str:
    try:
        import google.generativeai as genai
        if not GEMINI_API_KEY:
            raise ValueError("No AI API key configured")
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
        full_prompt = f"{system}\n\n{prompt}" if system else prompt
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return ""


def _parse_json_from_response(text: str) -> list:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    try:
        result = json.loads(text.strip())
        return result if isinstance(result, list) else [result]
    except json.JSONDecodeError:
        start = text.find("[")
        end = text.rfind("]") + 1
        if start >= 0 and end > start:
            try:
                return json.loads(text[start:end])
            except json.JSONDecodeError:
                pass
    return []


# ═══════════════════════════════════════════════════════════════════════════════
# EXAM GENERATION
# ═══════════════════════════════════════════════════════════════════════════════

def generate_exam_questions(
    subject: str,
    topic: str,
    question_type: str = "mcq",
    count: int = 10,
    difficulty: str = "medium",
    form_level: Optional[int] = None,
) -> List[Dict]:
    system = (
        "You are a ZIMSEC curriculum expert. Generate exam questions for Zimbabwean O-Level/A-Level students. "
        "All questions must be aligned with the ZIMSEC syllabus and marking guidelines. "
        "Return ONLY a JSON array of question objects."
    )

    level_hint = f" for Form {form_level}" if form_level else ""
    difficulty_map = {"easy": "straightforward recall", "medium": "application and understanding", "hard": "analysis and evaluation", "mixed": "a mix of easy, medium, and hard"}

    if question_type == "mcq":
        prompt = (
            f"Generate {count} multiple-choice questions on '{topic}' in {subject}{level_hint}.\n"
            f"Difficulty: {difficulty_map.get(difficulty, 'medium')}.\n"
            f"Each question must have exactly 4 options (A, B, C, D) with one correct answer.\n"
            f"Tag each question with a specific sub-topic.\n\n"
            f"Return as JSON array with objects having these fields:\n"
            f"- question_number (int)\n"
            f"- question_text (string)\n"
            f"- question_type: \"mcq\"\n"
            f"- options_json: [{{\"label\": \"A\", \"text\": \"...\"}}, ...]\n"
            f"- correct_answer: \"A\" or \"B\" or \"C\" or \"D\"\n"
            f"- marks: 1\n"
            f"- topic_tag: specific sub-topic string\n"
            f"- explanation: brief explanation of why the answer is correct"
        )
    elif question_type == "essay":
        prompt = (
            f"Generate {count} essay questions on '{topic}' in {subject}{level_hint}.\n"
            f"Difficulty: {difficulty_map.get(difficulty, 'medium')}.\n"
            f"Questions should require structured responses following ZIMSEC essay format.\n\n"
            f"Return as JSON array with objects having these fields:\n"
            f"- question_number (int)\n"
            f"- question_text (string, include mark allocation in brackets)\n"
            f"- question_type: \"essay\"\n"
            f"- marks: appropriate mark value (10-25)\n"
            f"- topic_tag: specific sub-topic string\n"
            f"- explanation: marking guide summary"
        )
    else:
        prompt = (
            f"Generate {count} short-answer questions on '{topic}' in {subject}{level_hint}.\n"
            f"Difficulty: {difficulty_map.get(difficulty, 'medium')}.\n\n"
            f"Return as JSON array with objects having these fields:\n"
            f"- question_number (int)\n"
            f"- question_text (string)\n"
            f"- question_type: \"saq\"\n"
            f"- correct_answer: expected answer string\n"
            f"- marks: 2-5\n"
            f"- topic_tag: specific sub-topic string\n"
            f"- explanation: brief explanation"
        )

    response = _call_ai(prompt, system, json_mode=True)
    questions = _parse_json_from_response(response)

    for i, q in enumerate(questions):
        q["question_number"] = i + 1
        if "question_type" not in q:
            q["question_type"] = question_type
        if "marks" not in q:
            q["marks"] = 1

    return questions[:count]


# ═══════════════════════════════════════════════════════════════════════════════
# AI MARKING
# ═══════════════════════════════════════════════════════════════════════════════

def mark_mcq(student_answer: str, correct_answer: str, marks: float) -> Dict:
    is_correct = str(student_answer).strip().upper() == str(correct_answer).strip().upper()
    return {
        "earned": marks if is_correct else 0,
        "max": marks,
        "correct": is_correct,
        "feedback": "Correct!" if is_correct else f"Incorrect. The correct answer is {correct_answer}.",
    }


def mark_short_answer(student_answer: str, correct_answer: str, marks: float, topic: str = "") -> Dict:
    if not student_answer or not student_answer.strip():
        return {"earned": 0, "max": marks, "correct": False, "feedback": "No answer provided."}

    system = (
        "You are a ZIMSEC exam marker. Evaluate the student's answer against the expected answer. "
        "Award partial credit for partially correct answers. Be fair but strict. "
        "Return ONLY a JSON object."
    )
    prompt = (
        f"Topic: {topic}\n"
        f"Expected answer: {correct_answer}\n"
        f"Student answer: {student_answer}\n"
        f"Total marks available: {marks}\n\n"
        f"Return JSON: {{\"earned\": number, \"max\": {marks}, \"correct\": boolean, \"feedback\": \"explanation\"}}"
    )

    response = _call_ai(prompt, system, max_tokens=500, json_mode=True)
    try:
        result = json.loads(response.strip().strip("```json").strip("```"))
        result["max"] = marks
        return result
    except Exception:
        is_similar = student_answer.strip().lower() == correct_answer.strip().lower()
        return {"earned": marks if is_similar else 0, "max": marks, "correct": is_similar, "feedback": "Auto-marked by exact match."}


def mark_essay(student_answer: str, question_text: str, marks: float, subject: str = "", topic: str = "") -> Dict:
    if not student_answer or not student_answer.strip():
        return {"earned": 0, "max": marks, "correct": False, "feedback": "No answer provided.", "breakdown": {}}

    system = (
        "You are a ZIMSEC essay examiner. Mark the student's essay using these criteria:\n"
        "1. Structure (intro, body, conclusion) - 20%\n"
        "2. Content accuracy - 30%\n"
        "3. Language and expression - 20%\n"
        "4. Argument strength and evidence - 30%\n"
        "Be fair and constructive. Return ONLY JSON."
    )
    prompt = (
        f"Subject: {subject}\nTopic: {topic}\n"
        f"Question: {question_text}\n"
        f"Student essay:\n{student_answer}\n"
        f"Total marks: {marks}\n\n"
        f"Return JSON: {{"
        f"\"earned\": number, \"max\": {marks}, \"correct\": boolean, "
        f"\"feedback\": \"overall feedback string\", "
        f"\"breakdown\": {{\"structure\": number, \"content\": number, \"language\": number, \"argument\": number}}"
        f"}}"
    )

    response = _call_ai(prompt, system, max_tokens=1000, json_mode=True)
    try:
        result = json.loads(response.strip().strip("```json").strip("```"))
        result["max"] = marks
        return result
    except Exception:
        return {"earned": 0, "max": marks, "correct": False, "feedback": "AI marking failed. Requires teacher review.", "breakdown": {}}


def mark_submission(answers: Dict, questions: List[Dict], subject: str = "") -> Dict:
    total_earned = 0
    total_possible = 0
    feedback_list = []

    for q in questions:
        qnum = str(q.get("question_number", ""))
        student_answer = answers.get(qnum, "")
        marks = float(q.get("marks", 1))
        total_possible += marks
        topic = q.get("topic_tag", "")

        if q["question_type"] in ("mcq", "true_false"):
            result = mark_mcq(student_answer, q.get("correct_answer", ""), marks)
        elif q["question_type"] == "saq":
            result = mark_short_answer(student_answer, q.get("correct_answer", ""), marks, topic)
        elif q["question_type"] == "essay":
            result = mark_essay(student_answer, q.get("question_text", ""), marks, subject, topic)
        else:
            result = {"earned": 0, "max": marks, "correct": False, "feedback": "Unknown question type."}

        total_earned += float(result.get("earned", 0))
        feedback_list.append({
            "question_number": q.get("question_number"),
            "topic_tag": topic,
            **result,
        })

    return {
        "total_score": round(total_earned, 1),
        "total_possible": round(total_possible, 1),
        "percentage": round((total_earned / total_possible * 100), 1) if total_possible > 0 else 0,
        "feedback": feedback_list,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# STUDENT ANALYTICS
# ═══════════════════════════════════════════════════════════════════════════════

def generate_student_diagnostic(
    student_name: str,
    subject: str,
    topic_performances: List[Dict],
) -> str:
    if not topic_performances:
        return f"{student_name} has not yet completed any assessments in {subject}."

    system = (
        "You are a ZIMSEC education specialist providing teacher-friendly student diagnostic summaries. "
        "Be constructive, specific, and actionable. Keep it to 3-4 sentences."
    )

    perf_text = "\n".join([
        f"- {p['topic']}: {p['accuracy']}% accuracy ({p['attempts']} attempts, trend: {p.get('trend', 'new')})"
        for p in topic_performances
    ])

    prompt = (
        f"Student: {student_name}\nSubject: {subject}\n\nTopic performance:\n{perf_text}\n\n"
        f"Write a brief diagnostic summary for the teacher, identifying strengths, weaknesses, "
        f"and 2-3 specific recommended interventions."
    )

    return _call_ai(prompt, system, max_tokens=500)
