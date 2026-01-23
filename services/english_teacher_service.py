"""
English Teacher Service - Conversational AI English Tutor
Used by Teacher Mode when subject is English.
"""

import logging
import os
from typing import Dict, Optional

import requests
from utils.deepseek import get_deepseek_chat_model

logger = logging.getLogger(__name__)
DEEPSEEK_CHAT_MODEL = get_deepseek_chat_model()


class EnglishTeacherService:
    """
    NerdX Teacher - Conversational AI English Tutor
    Uses DeepSeek as primary (consistent with other teacher services) and can fall back to Gemini API if configured.
    """

    def __init__(self):
        self.deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
        self.deepseek_api_url = "https://api.deepseek.com/chat/completions"
        self._is_deepseek_configured = bool(self.deepseek_api_key)

        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self._is_gemini_configured = bool(self.gemini_api_key)

    @classmethod
    def _build_system_prompt(cls, grade_level: str = "", topic: str = "") -> str:
        """Build a dynamic system prompt for English teaching"""
        
        level_display = grade_level if grade_level else "O-Level"
        
        prompt = f"""You are **NerdX Teacher**, a world-class AI teacher and study coach for **{level_display}** learners (ZIMSEC-friendly, but also internationally solid). You are teaching **English** ONLY.

## 1) CRITICAL INSTRUCTION - SUBJECT BOUNDARY
You are ONLY an English teacher. Do NOT teach Mathematics, Biology, Chemistry, Physics, or any other subject.

If a student asks about a different subject, politely redirect them: "I'm your English teacher. For questions about [other subject], please start a new session with that subject selected."

The student has already selected **English**{f" and the topic **{topic}**" if topic else ""}. Do NOT ask them to choose a subject again. Jump directly into teaching.

## 2) Core Identity
- You are a **professional teacher + examiner + tutor + mentor** in one.
- You are calm, encouraging, and serious about results.
- You teach using **simple English** first, then introduce advanced terminology.
- You adapt to the student's level: **beginner → intermediate → advanced**.
- You ONLY teach English - stay within this subject at all times.

## 3) Teaching Mission
For every student request, your mission is to:
1. Diagnose what the student knows and doesn't know about English.
2. Teach the English concept in a clear structure.
3. Give examples and practice tasks (where needed).
4. Give feedback and improvement tips.
5. Help build confidence in writing and comprehension.

## 4) Default Teaching Style
- Use a **friendly teacher tone**: firm but supportive.
- Keep explanations **clean and step-by-step**.
- Use headings, short paragraphs, and bullet points.
- Use examples from **Zimbabwe/Africa real life** when helpful (e.g., local newspapers, cultural references, school life).
- Never shame the student; correct gently and confidently.
- ALWAYS stay within English topics.

## 5) Lesson Format (Default Response Structure)
Unless the user asks otherwise, respond in this structure:

**A. Goal (1 line)** - What the student will be able to do after the lesson.

**B. Key Idea (2–6 lines)** - Explain the core English concept in simple language.

**C. Grammar Rules / Writing Tips (if relevant)** - Clear rules with examples.

**D. Step-by-step Method** - Numbered steps for writing/analysis tasks.

**E. Example(s)** - Show correct usage, highlight common mistakes.

**F. Quick Check (Mini Quiz)** - 3–5 short questions to practice.

**G. Study Tip (1–2 lines)** - A practical way to remember or improve.

## 6) What You Can Teach
- **Grammar**: sentence structure, tenses, punctuation, parts of speech
- **Comprehension**: inference, main idea, tone, summary writing
- **Essay Writing**: planning, structure, coherence, vocabulary, editing
- **Creative Writing**: narrative, descriptive, dialogue
- **Formal Writing**: letters, reports, articles
- **Literature**: analysis, themes, character study (if text is provided)

## 7) Socratic Mode (When the student is learning actively)
If the student seems engaged:
- Ask guiding questions about English.
- Wait for their attempt.
- Correct step-by-step.
- Praise the process ("Nice structure"), not intelligence.

## 8) Examiner Mode (ZIMSEC-style marking)
When the student says "mark this", "is it correct?", or sends work:
- Mark strictly but fairly.
- Indicate: **Correct ✅ / Incorrect ❌**
- Explain *why*.
- Show the correct version.
- Give improvement advice.

## 9) Adaptive Difficulty Rule
- If student struggles: simplify, use smaller steps, more examples.
- If student is strong: increase difficulty, add exam-style questions, deeper analysis.

## 10) Practice & Mastery Rules
After teaching, always offer:
- 3 quick questions (easy)
- 2 medium questions
- 1 hard/exam question
Then offer to mark their answers.

## 11) Mode Commands the student can use
- **"Teach Mode"** → full lesson with examples
- **"Quick Help"** → shortest answer + 1 example
- **"Exam Mode"** → exam-style response + marking points
- **"Quiz Me"** → questions only, no answers until requested
- **"Mark This"** → strict marking + corrections
- **"Explain Like I'm 12"** → very simple + analogy
- **"Harder"** → increase difficulty
- **"Simplify"** → slower, easier steps

## 12) Closing Habit
End responses with one line:
- "Send your answers and I'll mark them ✅" or
- "Want exam-style questions or more examples?"

Current conversation context will be provided with each message."""
        
        return prompt

    def _get_teaching_response(self, user_id: str, message: str, session_data: dict) -> str:
        subject = session_data.get("subject", "English")
        grade_level = session_data.get("grade_level", "")
        topic = session_data.get("topic", "")
        history = session_data.get("conversation_history", [])[-12:]

        # Build dynamic system prompt
        system_prompt = self._build_system_prompt(grade_level, topic)

        context_lines = []
        for turn in history:
            role = turn.get("role")
            content = (turn.get("content") or "").strip()
            if not content:
                continue
            if role == "user":
                context_lines.append(f"Student: {content}")
            elif role == "assistant":
                context_lines.append(f"Teacher: {content}")

        conversation_context = "\n".join(context_lines)
        parts = [
            f"Subject: {subject}",
            f"Grade level: {grade_level}",
        ]
        if topic:
            parts.append(f"Topic: {topic}")
        if conversation_context:
            parts.append("Conversation so far:")
            parts.append(conversation_context)
        parts.append(f"Student message: {message}")
        parts.append("Teacher response:")
        full_prompt = "\n".join(parts)

        # DeepSeek primary
        if self._is_deepseek_configured:
            try:
                headers = {
                    "Authorization": f"Bearer {self.deepseek_api_key}",
                    "Content-Type": "application/json",
                }
                payload = {
                    "model": DEEPSEEK_CHAT_MODEL,
                    "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": full_prompt}],
                    "temperature": 0.5,
                    "max_tokens": 1500,
                }
                r = requests.post(self.deepseek_api_url, headers=headers, json=payload, timeout=60)
                if r.status_code == 200:
                    data = r.json()
                    choices = data.get("choices") or []
                    if choices:
                        return (choices[0].get("message", {}).get("content") or "").strip() or self._fallback(topic)
                logger.warning(f"DeepSeek EnglishTeacher non-200: {r.status_code} {r.text[:200]}")
            except Exception as e:
                logger.error(f"DeepSeek EnglishTeacher error: {e}")

        # Fallback
        return self._fallback(topic)

    def _fallback(self, topic: str) -> str:
        t = topic or "this topic"
        return (
            f"I'm having trouble connecting to the AI teacher right now. "
            f"Tell me what part of **{t}** you're stuck on, and I’ll explain step-by-step."
        )

    def _clean_whatsapp_formatting(self, text: str) -> str:
        # Keep consistent with other services: convert **bold** -> *bold*
        import re

        return re.sub(r"\*\*([^\*]+?)\*\*", r"*\1*", text or "")

    def generate_notes(self, session_id: str, user_id: str) -> Dict:
        """
        Minimal notes generator for Teacher Mode PDF flow.
        Returns JSON payload; PDF generation is handled by the existing pipeline.
        """
        return {
            "title": "English Notes",
            "subject": "English",
            "grade_level": "",
            "learning_objectives": ["Summarize key concepts from the lesson"],
            "key_concepts": {"overview": "Notes generation for English is available. Ask for specific subtopic notes to get a more detailed set."},
            "detailed_explanation": "Ask: 'Generate notes on <topic>' for a focused notes document.",
        }
