"""
MAIC — Multi-Agent Interactive Classroom orchestration (Phase 3).
Teacher (Mr. Moyo) + classmate (Chido) via Vertex Gemini; Supabase persistence.
Whiteboard: JSON inside <whiteboard>...</whiteboard> → message_type whiteboard + SVG.
RAG: stub + optional Vertex-generated curriculum snippets (not live corpus search).
"""
from __future__ import annotations

import json
import logging
import re
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Iterator, List, Optional, Tuple

from database.external_db import make_supabase_request
from services.vertex_service import vertex_service

logger = logging.getLogger(__name__)

TABLE_SESSIONS = "maic_classroom_sessions"
TABLE_MESSAGES = "maic_classroom_messages"
TABLE_QUIZ = "maic_quiz_attempts"
TABLE_PROGRESS = "maic_student_progress"

# Concept segments before quiz
CONCEPT_SEGMENTS = 2

STAGE_INTRO = "intro"
STAGE_CONCEPT = "concept"
STAGE_QUIZ = "quiz_checkpoint"
STAGE_REVIEW = "review"
STAGE_SUMMARY = "summary"
STAGE_COMPLETE = "complete"

_WHITEBOARD_BLOCK = re.compile(r"<whiteboard>\s*([\s\S]*?)\s*</whiteboard>", re.IGNORECASE)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _student_id_int(user_id: Any) -> int:
    try:
        return int(user_id)
    except (TypeError, ValueError):
        return 0


def extract_whiteboards(raw: str) -> Tuple[str, List[Dict[str, Any]]]:
    """Strip <whiteboard>JSON</whiteboard> blocks; return plain teacher text and parsed board specs."""
    if not (raw or "").strip():
        return "", []
    boards: List[Dict[str, Any]] = []
    for m in _WHITEBOARD_BLOCK.finditer(raw):
        inner = (m.group(1) or "").strip()
        if not inner:
            continue
        try:
            obj = json.loads(inner)
            if isinstance(obj, dict):
                boards.append(obj)
        except json.JSONDecodeError:
            continue
    plain = _WHITEBOARD_BLOCK.sub("", raw)
    plain = re.sub(r"\n{3,}", "\n\n", plain).strip()
    if not plain and boards:
        plain = "Here's a diagram on the board."
    return plain, boards


def insert_teacher_turn(session_id: str, raw_teacher_text: str) -> Tuple[str, List[Dict[str, Any]]]:
    """Persist teacher segment: text row(s) plus optional whiteboard JSON rows."""
    plain, boards = extract_whiteboards(raw_teacher_text)
    if not plain and not boards:
        return "", []
    insert_message(session_id, "teacher", plain, "text")
    for b in boards:
        insert_message(
            session_id,
            "teacher",
            json.dumps(b, ensure_ascii=False),
            "whiteboard",
        )
    return plain, boards


def _rag_stub(subject: str, topic: str, form_level: str) -> str:
    """Baseline curriculum line; combined with synthesize_curriculum_snippets in Phase 3."""
    return (
        f"[Curriculum context] ZIMSEC-aligned {form_level} {subject}: {topic}. "
        "Teach strictly to examination expectations; use Zimbabwean examples where natural."
    )


def synthesize_curriculum_snippets(subject: str, topic: str, form_level: str) -> str:
    """
    Phase 3 soft RAG: one short Vertex call to produce exam-oriented bullet facts.
    Grounding is model parametric — label clearly so teachers/students cross-check the syllabus.
    """
    try:
        prompt = f"""You help a ZIMSEC teacher in Zimbabwe.

Subject: {subject}
Topic: {topic}
Level: {form_level}

Output 6–10 bullet points ONLY. Each bullet = one line with a concrete fact, definition, formula, step, or common exam pitfall for this topic at this level.
No title, no greeting. Start each line with "• ".
If the topic is vague, infer the usual ZIMSEC scope. Include a bullet reminding students to verify wording with the official syllabus and past papers.
Keep total under 900 words."""
        if not vertex_service.is_available():
            return ""
        out = vertex_service.generate_text(prompt, model="gemini-2.5-flash")
        if not out or not out.get("success") or not out.get("text"):
            return ""
        text = str(out["text"]).strip()
        if len(text) > 4000:
            text = text[:4000] + "\n…"
        return text
    except Exception as ex:
        logger.warning("synthesize_curriculum_snippets failed: %s", ex)
        return ""


def build_full_rag_context(subject: str, topic: str, form_level: str) -> str:
    try:
        base = _rag_stub(subject, topic, form_level)
        extra = synthesize_curriculum_snippets(subject, topic, form_level)
        if not extra.strip():
            return base
        return (
            base
            + "\n\nREFERENCE SNIPPETS (AI-generated — always cross-check with syllabus and past papers):\n"
            + extra
        )
    except Exception as ex:
        logger.warning("build_full_rag_context failed, using stub only: %s", ex)
        return _rag_stub(subject, topic, form_level)


def _messages_for_prompt(rows: List[Dict[str, Any]], max_turns: int = 12) -> str:
    lines = []
    for r in rows[-max_turns:]:
        role = r.get("sender") or "?"
        content = (r.get("content") or "").strip()
        if content:
            lines.append(f"{role}: {content}")
    return "\n".join(lines) if lines else "(no prior messages)"


def fetch_session(session_id: str, student_id: Any) -> Optional[Dict[str, Any]]:
    sid = _student_id_int(student_id)
    rows = make_supabase_request(
        "GET",
        TABLE_SESSIONS,
        select="*",
        filters={"id": f"eq.{session_id}", "student_id": f"eq.{sid}"},
        limit=1,
        use_service_role=True,
    )
    if not rows or not isinstance(rows, list):
        return None
    return rows[0] if rows else None


def list_session_messages(session_id: str, student_id: Any) -> List[Dict[str, Any]]:
    sess = fetch_session(session_id, student_id)
    if not sess:
        return []
    rows = make_supabase_request(
        "GET",
        TABLE_MESSAGES,
        select="id,sender,content,message_type,created_at",
        filters={"session_id": f"eq.{session_id}"},
        limit=200,
        use_service_role=True,
    )
    if not rows or not isinstance(rows, list):
        return []
    rows.sort(key=lambda x: x.get("created_at") or "")
    return rows


def insert_message(
    session_id: str,
    sender: str,
    content: str,
    message_type: str = "text",
) -> None:
    make_supabase_request(
        "POST",
        TABLE_MESSAGES,
        {
            "session_id": session_id,
            "sender": sender,
            "content": content,
            "message_type": message_type,
        },
        use_service_role=True,
    )


def patch_session(session_id: str, student_id: Any, data: Dict[str, Any]) -> bool:
    sid = _student_id_int(student_id)
    data = {**data, "updated_at": _now_iso()}
    result = make_supabase_request(
        "PATCH",
        TABLE_SESSIONS,
        data,
        filters={"id": f"eq.{session_id}", "student_id": f"eq.{sid}"},
        use_service_role=True,
    )
    return result is not None


def create_session_record(
    student_id: Any,
    subject: str,
    topic: str,
    form_level: str,
    outline: Any,
    rag_stub: str,
) -> Optional[str]:
    sid = _student_id_int(student_id)
    session_id = str(uuid.uuid4())
    row = {
        "id": session_id,
        "student_id": sid,
        "subject": subject,
        "topic": topic,
        "form_level": form_level,
        "stage": STAGE_INTRO,
        "concepts_done": 0,
        "lesson_outline": outline,
        "rag_context_stub": rag_stub,
        "credits_used": 0,
    }
    result = make_supabase_request("POST", TABLE_SESSIONS, row, use_service_role=True)
    if not result:
        return None
    if isinstance(result, list) and result:
        return result[0].get("id") or session_id
    return session_id


def _teacher_system_block(
    student_name: str,
    subject: str,
    topic: str,
    form_level: str,
    stage: str,
    rag: str,
    transcript: str,
) -> str:
    return f"""You are Mr. Moyo, a dedicated Zimbabwean secondary school teacher on NerdX.
You teach {student_name or "the student"}, who is in {form_level}, studying {subject}.
Current topic: {topic}.
Lesson stage: {stage}.
Ground all teaching in ZIMSEC-style expectations. Use clear, encouraging language and local examples when natural.

CURRICULUM / CONTEXT:
{rag}

RECENT CONVERSATION:
{transcript}

Rules:
- Deliver ONE digestible lesson segment only (not the whole topic in one reply).
- Prefer short paragraphs and bullet points where helpful.
- Optional: one diagram per segment inside <whiteboard>...</whiteboard> as a single JSON object (no markdown fences):
  {{"version":1,"width":420,"height":260,"elements":[
    {{"kind":"line","x1":20,"y1":130,"x2":400,"y2":130,"stroke":"#94a3b8","strokeWidth":2}},
    {{"kind":"rect","x":40,"y":50,"w":120,"h":70,"stroke":"#34d399","fill":"none","strokeWidth":2}},
    {{"kind":"ellipse","cx":260,"cy":95,"rx":50,"ry":30,"stroke":"#fbbf24","fill":"rgba(251,191,36,0.08)"}},
    {{"kind":"text","x":50,"y":200,"text":"Label here","fill":"#e2e8f0","size":14}},
    {{"kind":"polyline","points":[20,200,100,120,180,200],"stroke":"#a78bfa","strokeWidth":2,"fill":"none"}}
  ]}}
  Coordinates are in the board's pixel space (0,0 top-left). Use contrast colours on dark backgrounds.
  Polyline: "points" is flat [x1,y1,x2,y2,...].
- End with one quick check-for-understanding question when stage is concept or intro."""


def _call_teacher_text(
    student_name: str,
    subject: str,
    topic: str,
    form_level: str,
    stage: str,
    rag: str,
    messages: List[Dict[str, Any]],
    extra_user_instruction: str = "",
) -> str:
    transcript = _messages_for_prompt(messages)
    system = _teacher_system_block(student_name, subject, topic, form_level, stage, rag, transcript)
    prompt = f"{system}\n\nContinue the lesson.\n{extra_user_instruction}".strip()
    if not vertex_service.is_available():
        return "I'm having trouble reaching the AI service. Please try again shortly."
    out = vertex_service.generate_text(prompt, model="gemini-2.5-flash")
    if out and out.get("success") and out.get("text"):
        return out["text"].strip()
    return "I couldn't generate a response. Please try again."


def stream_teacher_segment(
    student_name: str,
    subject: str,
    topic: str,
    form_level: str,
    stage: str,
    rag: str,
    messages: List[Dict[str, Any]],
    extra_user_instruction: str = "",
) -> Iterator[str]:
    transcript = _messages_for_prompt(messages)
    system = _teacher_system_block(student_name, subject, topic, form_level, stage, rag, transcript)
    prompt = f"{system}\n\nContinue the lesson.\n{extra_user_instruction}".strip()
    if not vertex_service.is_available():
        yield "I'm having trouble reaching the AI service. Please try again shortly."
        return
    yield from vertex_service.generate_text_stream(prompt, model="gemini-2.5-flash")


def classmate_question(teacher_last: str, topic: str, form_level: str) -> str:
    prompt = f"""You are Chido, a {form_level} student in Zimbabwe. The teacher (Mr. Moyo) just said:

\"\"\"{teacher_last[:3500]}\"\"\"

Topic: {topic}

Ask ONE short natural question (1–2 sentences) a real student would ask. Sound like a teenager.
Do NOT explain the answer — only ask or react briefly."""
    if not vertex_service.is_available():
        return "Sir, can you explain that part again simply?"
    out = vertex_service.generate_text(prompt, model="gemini-2.5-flash")
    if out and out.get("success") and out.get("text"):
        return out["text"].strip()[:500]
    return "Could we go over the main idea one more time?"


def _fallback_note_lines(teacher_last: str, max_lines: int = 3) -> List[str]:
    text = re.sub(r"\s+", " ", (teacher_last or "")).strip()
    if not text:
        return []
    parts = re.split(r"(?<=[.!?])\s+", text)
    picks: List[str] = []
    for p in parts:
        p = p.strip(" -\t")
        if len(p) < 24:
            continue
        picks.append(p[:140].rstrip(".") + ".")
        if len(picks) >= max_lines:
            break
    return picks


def classmate_notes(teacher_last: str, topic: str, form_level: str) -> str:
    prompt = f"""You are Tari, a focused note-taker in a Zimbabwean {form_level} classroom.
The teacher just explained:

\"\"\"{teacher_last[:3500]}\"\"\"

Topic: {topic}

Write concise student notes in plain text:
- Start with: "Quick notes:"
- Then add exactly 3 short bullet lines, each prefixed with "- "
- Keep all notes exam-useful and simple.
- Do not ask questions."""
    if vertex_service.is_available():
        out = vertex_service.generate_text(prompt, model="gemini-2.5-flash")
        if out and out.get("success") and out.get("text"):
            txt = out["text"].strip()
            txt = re.sub(r"\r\n?", "\n", txt)
            txt = re.sub(r"\n{3,}", "\n\n", txt)
            return txt[:700]

    lines = _fallback_note_lines(teacher_last, max_lines=3)
    if not lines:
        return (
            "Quick notes:\n"
            "- Identify the core definition for this idea.\n"
            "- Keep one clear worked example in your revision notes.\n"
            "- Memorise key exam words from the lesson."
        )
    return "Quick notes:\n" + "\n".join(f"- {ln}" for ln in lines)


def generate_lesson_outline(subject: str, topic: str, form_level: str, rag: str) -> Any:
    prompt = f"""You plan a ZIMSEC-aligned mini-lesson for {form_level} {subject} on "{topic}".

Context:
{rag}

Return valid JSON only:
{{
  "title": "short lesson title",
  "objectives": ["2-4 bullet strings"],
  "segments": ["intro", "concept_1", "concept_2", "quiz", "review", "summary"]
}}"""
    if not vertex_service.is_available():
        return {
            "title": topic,
            "objectives": [f"Understand core ideas in {topic}"],
            "segments": ["intro", "concept_1", "concept_2", "quiz", "review", "summary"],
        }
    out = vertex_service.generate_text(prompt, model="gemini-2.5-flash")
    if not out or not out.get("success") or not out.get("text"):
        return {
            "title": topic,
            "objectives": [f"Understand core ideas in {topic}"],
            "segments": ["intro", "concept_1", "concept_2", "quiz", "review", "summary"],
        }
    text = out["text"].strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {
            "title": topic,
            "objectives": [f"Understand core ideas in {topic}"],
            "segments": ["intro", "concept_1", "concept_2", "quiz", "review", "summary"],
        }


def generate_quiz_snapshot(subject: str, topic: str, form_level: str, rag: str, transcript: str) -> List[Dict[str, Any]]:
    prompt = f"""Create 3 exam-style questions for {form_level} ZIMSEC {subject} on topic "{topic}".

Context:
{rag}

Recent lesson:
{transcript[:4000]}

Return JSON array ONLY with exactly 3 objects:
[
  {{"id":"q1","type":"mcq","question":"...","options":["A","B","C","D"],"correct_index":0}},
  {{"id":"q2","type":"short","question":"...","rubric":"what a good answer includes"}},
  {{"id":"q3","type":"structured","question":"...","rubric":"mark scheme hints"}}
]"""
    if not vertex_service.is_available():
        return []
    out = vertex_service.generate_text(prompt, model="gemini-2.5-flash")
    if not out or not out.get("success") or not out.get("text"):
        return []
    text = out["text"].strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    try:
        data = json.loads(text)
        return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def grade_quiz_attempt(
    subject: str,
    topic: str,
    form_level: str,
    questions: List[Dict[str, Any]],
    answers: Dict[str, Any],
) -> Tuple[float, str]:
    prompt = f"""You are marking a {form_level} {subject} mini-quiz on "{topic}" (ZIMSEC style).

Questions JSON:
{json.dumps(questions, ensure_ascii=False)}

Student answers JSON:
{json.dumps(answers, ensure_ascii=False)}

Return JSON ONLY:
{{"score": 0-10, "feedback": "2-4 sentences of constructive feedback"}}"""
    if not vertex_service.is_available():
        return 0.0, "Could not grade — AI unavailable."
    out = vertex_service.generate_text(prompt, model="gemini-2.5-flash")
    if not out or not out.get("success") or not out.get("text"):
        return 0.0, "Could not grade this attempt."
    text = out["text"].strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    try:
        data = json.loads(text)
        score = float(data.get("score", 0))
        fb = str(data.get("feedback", "")).strip()
        return max(0.0, min(10.0, score)), fb or "Well done — keep practising."
    except (json.JSONDecodeError, TypeError, ValueError):
        return 5.0, "Marked approximately — review the model answers in your notes."


def bump_credits_used(session_id: str, student_id: Any, units: int) -> None:
    sess = fetch_session(session_id, student_id)
    if not sess:
        return
    current = int(sess.get("credits_used") or 0)
    patch_session(session_id, student_id, {"credits_used": current + units})


def upsert_progress(
    student_id: Any,
    subject: str,
    topic: str,
    form_level: str,
    quiz_score: Optional[float],
) -> None:
    sid = _student_id_int(student_id)
    existing = make_supabase_request(
        "GET",
        TABLE_PROGRESS,
        select="id,sessions_count,avg_quiz_score",
        filters={
            "student_id": f"eq.{sid}",
            "subject": f"eq.{subject}",
            "topic": f"eq.{topic}",
            "form_level": f"eq.{form_level}",
        },
        limit=1,
        use_service_role=True,
    )
    if existing and isinstance(existing, list) and existing:
        row = existing[0]
        n = int(row.get("sessions_count") or 1) + 1
        old_avg = row.get("avg_quiz_score")
        if quiz_score is not None and old_avg is not None:
            try:
                new_avg = (float(old_avg) * (n - 1) + quiz_score) / n
            except (TypeError, ValueError):
                new_avg = quiz_score
        elif quiz_score is not None:
            new_avg = quiz_score
        else:
            new_avg = old_avg
        make_supabase_request(
            "PATCH",
            TABLE_PROGRESS,
            {
                "sessions_count": n,
                "avg_quiz_score": new_avg,
                "last_studied": _now_iso(),
            },
            filters={"id": f"eq.{row['id']}"},
            use_service_role=True,
        )
    else:
        make_supabase_request(
            "POST",
            TABLE_PROGRESS,
            {
                "student_id": sid,
                "subject": subject,
                "topic": topic,
                "form_level": form_level,
                "sessions_count": 1,
                "avg_quiz_score": quiz_score,
                "last_studied": _now_iso(),
                "mastery_level": "developing" if quiz_score and quiz_score >= 6 else "beginner",
            },
            use_service_role=True,
        )


def advance_after_stream(session: Dict[str, Any]) -> Dict[str, Any]:
    """Compute next stage after a teacher concept/intro segment is saved."""
    stage = session.get("stage") or STAGE_INTRO
    concepts = int(session.get("concepts_done") or 0)

    if stage == STAGE_INTRO:
        return {"stage": STAGE_CONCEPT, "concepts_done": 0}

    if stage == STAGE_CONCEPT:
        concepts += 1
        if concepts >= CONCEPT_SEGMENTS:
            return {"stage": STAGE_QUIZ, "concepts_done": concepts}
        return {"stage": STAGE_CONCEPT, "concepts_done": concepts}

    if stage == STAGE_REVIEW:
        return {"stage": STAGE_SUMMARY, "concepts_done": concepts}

    if stage == STAGE_SUMMARY:
        return {"stage": STAGE_COMPLETE, "concepts_done": concepts}

    return {"stage": stage, "concepts_done": concepts}
