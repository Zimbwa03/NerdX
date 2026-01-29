"""
Exam Session Service - CBT-Style Exam Engine
Handles intelligent time allocation, DeepSeek one-question-at-a-time generation,
marking, grading, and session management.
"""
import os
import json
import uuid
import logging
import time
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import requests
from utils.deepseek import get_deepseek_chat_model

logger = logging.getLogger(__name__)
DEEPSEEK_CHAT_MODEL = get_deepseek_chat_model()

# =============================================================================
# TIME ALLOCATION CONFIGURATION
# =============================================================================

TIME_CONFIG = {
    # Base seconds per MCQ question by subject
    "mcq": {
        "mathematics": 95,
        "math": 95,
        "pure_math": 110,  # A-Level Pure Math - more complex
        "a_level_biology": 100,  # A-Level Biology
        "a_level_chemistry": 100,  # A-Level Chemistry
        "a_level_physics": 100,  # A-Level Physics
        "english": 70,
        "computer_science": 85,  # O-Level CS (ZimSec/Cambridge)
        "geography": 85,  # O-Level Geography (ZIMSEC)
        "a_level_geography": 1500,  # A-Level Geography: essay-only (25-mark, ~25 min per essay)
        "biology": 80,
        "chemistry": 80,
        "physics": 80,
        "combined_science": 80,
    },
    # Base seconds per mark for structured questions
    "structured_per_mark": 60,
    # Default marks for structured if not specified
    "structured_default_marks": 3,
    # Difficulty multipliers
    "difficulty_multiplier": {
        "easy": 0.9,
        "standard": 1.0,
        "medium": 1.0,
        "hard": 1.2,
    },
    # Review buffer percentage
    "review_buffer_percent": 0.10,
    # Minimum buffer for exams >= 20 questions (seconds)
    "min_buffer_seconds": 300,
}

# Grading scale (no plus/minus)
GRADE_SCALE = [
    (80, "A"),
    (70, "B"),
    (60, "C"),
    (50, "D"),
    (40, "E"),
    (0, "U"),
]


class ExamSessionService:
    """
    Core exam engine for CBT-style exams.
    
    Features:
    - Intelligent time allocation by subject & question type
    - One-question-at-a-time DeepSeek generation
    - Per-answer marking with immediate feedback
    - Final grading with topic breakdown
    - Session persistence for resume capability
    """
    
    def __init__(self):
        self.api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.api_url = 'https://api.deepseek.com/chat/completions'
        # In-memory session storage (should use Redis/DB in production)
        self._sessions: Dict[str, Dict] = {}
        
    # =========================================================================
    # TIME CALCULATION
    # =========================================================================
    
    def calculate_exam_time(
        self,
        subject: str,
        question_count: int,
        question_mode: str = "MCQ_ONLY",
        difficulty: str = "standard",
        marks_per_structured: int = None,
    ) -> Dict[str, Any]:
        """
        Calculate total exam time based on subject, question type, and count.
        
        Args:
            subject: Subject name (mathematics, english, biology, etc.)
            question_count: Number of questions
            question_mode: MCQ_ONLY, STRUCTURED_ONLY, or MIXED
            difficulty: easy, standard, or hard
            marks_per_structured: Average marks per structured question
            
        Returns:
            Dict with total_seconds, per_question_seconds, breakdown
        """
        subject_key = subject.lower().replace(" ", "_").replace("-", "_")
        
        # Get base time per MCQ
        mcq_base = TIME_CONFIG["mcq"].get(subject_key, 80)
        
        # Get structured time (per mark)
        structured_marks = marks_per_structured or TIME_CONFIG["structured_default_marks"]
        structured_base = TIME_CONFIG["structured_per_mark"] * structured_marks
        
        # Difficulty multiplier
        diff_mult = TIME_CONFIG["difficulty_multiplier"].get(difficulty.lower(), 1.0)
        
        # Calculate based on mode
        if question_mode == "MCQ_ONLY":
            per_question = mcq_base * diff_mult
            total_question_time = per_question * question_count
        elif question_mode == "STRUCTURED_ONLY":
            per_question = structured_base * diff_mult
            total_question_time = per_question * question_count
        else:  # MIXED - assume 50/50 split
            mcq_count = question_count // 2
            structured_count = question_count - mcq_count
            total_question_time = (
                (mcq_base * mcq_count + structured_base * structured_count) * diff_mult
            )
            per_question = total_question_time / question_count
        
        # Add review buffer
        buffer = max(
            total_question_time * TIME_CONFIG["review_buffer_percent"],
            TIME_CONFIG["min_buffer_seconds"] if question_count >= 20 else 0
        )
        
        total_seconds = int(total_question_time + buffer)
        
        return {
            "total_seconds": total_seconds,
            "total_minutes": round(total_seconds / 60, 1),
            "per_question_seconds": int(per_question),
            "buffer_seconds": int(buffer),
            "breakdown": {
                "base_mcq_seconds": mcq_base,
                "base_structured_seconds": structured_base,
                "difficulty_multiplier": diff_mult,
                "question_count": question_count,
                "question_mode": question_mode,
            }
        }
    
    # =========================================================================
    # SESSION MANAGEMENT
    # =========================================================================
    
    def create_session(
        self,
        user_id: str,
        username: str,
        subject: str,
        level: str = "O_LEVEL",
        question_mode: str = "MCQ_ONLY",
        difficulty: str = "standard",
        total_questions: int = 10,
        paper_style: str = "ZIMSEC",
        topics: List[str] = None,
    ) -> Dict[str, Any]:
        """
        Create a new exam session.
        
        Returns session data including calculated time and session ID.
        """
        session_id = str(uuid.uuid4())
        
        # Calculate time
        time_info = self.calculate_exam_time(
            subject=subject,
            question_count=total_questions,
            question_mode=question_mode,
            difficulty=difficulty,
        )
        
        topic_pool = self._get_subject_topics(subject, level, topics, paper_style=paper_style)
        topic_plan = self._build_topic_plan(topic_pool, total_questions)

        session = {
            "id": session_id,
            "user_id": user_id,
            "username": username,
            "subject": subject,
            "level": level,
            "question_mode": question_mode,
            "difficulty": difficulty,
            "paper_style": paper_style,
            "total_questions": total_questions,
            "total_time_seconds": time_info["total_seconds"],
            "start_time": datetime.utcnow().isoformat(),
            "end_time": None,
            "status": "active",
            "current_index": 0,
            "questions": [],
            "responses": {},
            "asked_question_ids": [],
            "recent_topics": [],
            "asked_question_signatures": [],
            "topic_plan": topic_plan,
            "allowed_topics": topics or [],  # Store allowed topics for filtering
            "performance_signals": {
                "weak_topics": [],
                "strong_topics": [],
            },
        }
        
        # Store session
        self._sessions[session_id] = session
        
        logger.info(f"Created exam session {session_id} for user {user_id}: "
                   f"{total_questions} {question_mode} questions, {time_info['total_minutes']} min")
        
        return {
            "session_id": session_id,
            "total_questions": total_questions,
            "total_time_seconds": time_info["total_seconds"],
            "total_time_minutes": time_info["total_minutes"],
            "time_breakdown": time_info,
            "status": "active",
            "message": f"Alright {username}, your exam is ready. {total_questions} questions, "
                      f"{time_info['total_minutes']} minutes. Good luck!"
        }
    
    def get_session(self, session_id: str) -> Optional[Dict]:
        """Get session by ID."""
        return self._sessions.get(session_id)
    
    def get_session_state(self, session_id: str) -> Optional[Dict]:
        """Get session state for resume capability."""
        session = self._sessions.get(session_id)
        if not session:
            return None
            
        # Calculate remaining time
        start_time = datetime.fromisoformat(session["start_time"])
        elapsed = (datetime.utcnow() - start_time).total_seconds()
        remaining = max(0, session["total_time_seconds"] - elapsed)
        
        return {
            "session_id": session_id,
            "status": session["status"],
            "current_index": session["current_index"],
            "total_questions": session["total_questions"],
            "answered_count": len([r for r in session["responses"].values() if r.get("answer")]),
            "flagged_count": len([r for r in session["responses"].values() if r.get("is_flagged")]),
            "remaining_seconds": int(remaining),
            "is_expired": remaining <= 0 and session["status"] == "active",
        }
    
    # =========================================================================
    # QUESTION GENERATION (Vertex AI primary)
    # =========================================================================
    
    def generate_next_question(
        self,
        session_id: str,
        question_index: int = None,
        platform: str = 'mobile',
    ) -> Optional[Dict]:
        """
        Generate the next question using Vertex AI primary with DeepSeek fallback.
        One question at a time, no pre-generation.
        
        Args:
            session_id: Exam session ID
            question_index: Optional question index
            platform: Platform hint (kept for compatibility)
        """
        session = self._sessions.get(session_id)
        if not session:
            logger.error(f"Session {session_id} not found")
            return None
            
        if session["status"] != "active":
            logger.warning(f"Session {session_id} is not active: {session['status']}")
            return None
        
        # Determine question index
        idx = question_index if question_index is not None else session["current_index"]
        
        if idx >= session["total_questions"]:
            logger.info(f"Session {session_id} has reached question limit")
            return None
        
        # Check if already generated
        if idx < len(session["questions"]) and session["questions"][idx].get("id"):
            return session["questions"][idx]
        
        # Generate with Vertex primary (retry for diversity / duplicates)
        question = None
        max_attempts = 3
        target_topic = self._get_topic_for_index(session, idx)

        for attempt in range(1, max_attempts + 1):
            question = self._call_deepseek_generate(session, idx, platform=platform)
            if not question:
                continue

            # Enforce planned topic label for diversity tracking
            if target_topic:
                question["topic"] = target_topic

            # Ensure structured questions always have explanation
            if question.get("question_type") == "STRUCTURED" and not question.get("explanation"):
                question["explanation"] = self._build_structured_explanation(question)

            signature = self._build_question_signature(question)
            if signature and signature in session.get("asked_question_signatures", []):
                logger.warning(
                    f"Duplicate question signature detected (attempt {attempt}/{max_attempts}); regenerating."
                )
                question = None
                continue

            if signature:
                session["asked_question_signatures"].append(signature)
            break

        if question:
            # Store in session
            while len(session["questions"]) <= idx:
                session["questions"].append({})
            session["questions"][idx] = question
            session["asked_question_ids"].append(question.get("id", str(uuid.uuid4())))
            
            # Track topic
            topic = question.get("topic", "")
            if topic and topic not in session["recent_topics"]:
                session["recent_topics"].append(topic)
                if len(session["recent_topics"]) > 5:
                    session["recent_topics"].pop(0)
        
        return question
    
    def _call_deepseek_generate(self, session: Dict, question_index: int, platform: str = 'mobile') -> Optional[Dict]:
        """Generate a single question with Vertex AI primary and DeepSeek fallback."""
        subject_key = (session.get("subject") or "").lower().replace(" ", "_").replace("-", "_")
        if subject_key == "computer_science":
            question_type = self._get_question_type_for_index(session, question_index)
            return self._generate_cs_exam_question(session, question_index, question_type)
        
        if subject_key == "geography":
            question_type = self._get_question_type_for_index(session, question_index)
            return self._generate_geography_exam_question(session, question_index, question_type)

        if subject_key == "a_level_geography":
            return self._generate_a_level_geography_exam_question(session, question_index)

        # Determine question type for this index
        question_type = self._get_question_type_for_index(session, question_index)

        # Build prompt
        prompt = self._build_question_prompt(session, question_index, question_type)

        # Vertex/Gemini primary
        vertex_question = self._generate_with_vertex_ai(session, question_index, prompt)
        if vertex_question:
            vertex_question.setdefault("question_type", question_type)
            return vertex_question

        # DeepSeek fallback
        return self._call_deepseek_only(session, question_index, prompt, question_type)

    def _generate_cs_exam_question(
        self, session: Dict, question_index: int, question_type: str
    ) -> Optional[Dict]:
        """Generate a Computer Science exam question using the CS generator (ZimSec or Cambridge)."""
        try:
            from services.computer_science_generator import ComputerScienceGenerator
            cs_gen = ComputerScienceGenerator()
        except Exception as e:
            logger.error(f"Failed to load ComputerScienceGenerator: {e}")
            return self._get_fallback_question(session)

        topic = self._get_topic_for_index(session, question_index)
        if not topic:
            allowed = session.get("allowed_topics") or session.get("topic_plan") or []
            topic = random.choice(allowed) if allowed else "Data Representation"
        paper_style = (session.get("paper_style") or "ZIMSEC").upper()
        board = "cambridge" if paper_style == "CAMBRIDGE" else "zimsec"
        difficulty = (session.get("difficulty") or "standard").lower()
        if difficulty == "standard":
            difficulty = "medium"
        user_id = session.get("user_id")

        raw = None
        if question_type == "MCQ":
            raw = cs_gen.generate_topical_question(topic, difficulty, user_id, board=board)
        else:
            raw = cs_gen.generate_structured_question(topic, difficulty, user_id, board=board)

        if not raw:
            return self._get_fallback_question(session)

        # Map CS generator output to exam question format
        username = session.get("username", "Student")
        prompt_to_student = (
            f"Let's go, {username}! Here's your first question."
            if question_index == 0
            else f"Great work, {username}! Here's question {question_index + 1}."
        )

        if question_type == "MCQ":
            opts = raw.get("options") or {}
            if isinstance(opts, dict):
                options = [{"label": k, "text": v} for k, v in opts.items()]
            else:
                options = [{"label": str(i + 1), "text": o} for i, o in enumerate(opts)]
            return {
                "id": str(uuid.uuid4()),
                "question_type": "MCQ",
                "topic": raw.get("topic") or topic,
                "subtopic": raw.get("subtopic", ""),
                "stem": raw.get("question") or raw.get("question_text", ""),
                "options": options,
                "correct_option": raw.get("correct_answer", "A"),
                "explanation": raw.get("explanation", ""),
                "difficulty": difficulty,
                "prompt_to_student": prompt_to_student,
                "question_index": question_index,
                "generated_at": datetime.utcnow().isoformat(),
                "ai_model": "computer_science_generator",
            }

        # STRUCTURED
        sq = raw.get("structured_question") or raw
        parts_in = sq.get("parts") or []
        parts_out = []
        for p in parts_in:
            if isinstance(p, dict):
                parts_out.append({
                    "part": p.get("label", "a"),
                    "prompt": p.get("question", ""),
                    "marks": p.get("marks", 2),
                    "key_points": p.get("marking_points") or [],
                })
        stem = sq.get("stem") or sq.get("context") or (parts_out[0]["prompt"] if parts_out else "")
        return {
            "id": str(uuid.uuid4()),
            "question_type": "STRUCTURED",
            "topic": raw.get("topic") or sq.get("topic") or topic,
            "subtopic": sq.get("subtopic", ""),
            "stem": stem,
            "parts": parts_out,
            "total_marks": sq.get("total_marks", sum(pp.get("marks", 2) for pp in parts_out)),
            "marking_scheme": {p.get("part", str(i)): p.get("key_points", []) for i, p in enumerate(parts_out)},
            "explanation": raw.get("explanation") or sq.get("explanation", ""),
            "difficulty": difficulty,
            "prompt_to_student": prompt_to_student,
            "question_index": question_index,
            "generated_at": datetime.utcnow().isoformat(),
            "ai_model": "computer_science_generator",
        }

    def _generate_geography_exam_question(
        self, session: Dict, question_index: int, question_type: str
    ) -> Optional[Dict]:
        """Generate a Geography exam question using the Geography generator (ZIMSEC)."""
        try:
            from services.geography_generator import GeographyGenerator
            geo_gen = GeographyGenerator()
        except Exception as e:
            logger.error(f"Failed to load GeographyGenerator: {e}")
            return self._get_fallback_question(session)

        topic = self._get_topic_for_index(session, question_index)
        if not topic:
            allowed = session.get("allowed_topics") or session.get("topic_plan") or []
            topic = random.choice(allowed) if allowed else "Weather and Climate"
        paper_style = (session.get("paper_style") or "ZIMSEC").upper()
        board = "zimsec"  # Geography currently only supports ZIMSEC
        difficulty = (session.get("difficulty") or "standard").lower()
        if difficulty == "standard":
            difficulty = "medium"
        user_id = session.get("user_id")

        raw = None
        if question_type == "MCQ":
            raw = geo_gen.generate_topical_question(topic, difficulty, user_id, board=board)
        else:
            raw = geo_gen.generate_structured_question(topic, difficulty, user_id, board=board)

        if not raw:
            return self._get_fallback_question(session)

        # Map Geography generator output to exam question format
        username = session.get("username", "Student")
        prompt_to_student = (
            f"Let's go, {username}! Here's your first question."
            if question_index == 0
            else f"Great work, {username}! Here's question {question_index + 1}."
        )

        if question_type == "MCQ":
            opts = raw.get("options") or {}
            if isinstance(opts, dict):
                options = [{"label": k, "text": v} for k, v in opts.items()]
            else:
                options = [{"label": str(i + 1), "text": o} for i, o in enumerate(opts)]
            return {
                "id": str(uuid.uuid4()),
                "question_type": "MCQ",
                "topic": raw.get("topic") or topic,
                "subtopic": raw.get("subtopic", ""),
                "stem": raw.get("question") or raw.get("question_text", ""),
                "options": options,
                "correct_option": raw.get("correct_answer", "A"),
                "explanation": raw.get("explanation", ""),
                "difficulty": difficulty,
                "prompt_to_student": prompt_to_student,
                "question_index": question_index,
                "generated_at": datetime.utcnow().isoformat(),
                "ai_model": "geography_generator",
            }

        # STRUCTURED
        sq = raw.get("structured_question") or raw
        parts_in = sq.get("parts") or []
        parts_out = []
        for p in parts_in:
            if isinstance(p, dict):
                parts_out.append({
                    "part": p.get("label", "a"),
                    "prompt": p.get("question", ""),
                    "marks": p.get("marks", 2),
                    "key_points": p.get("marking_points") or [],
                })
        stem = sq.get("stem") or sq.get("context") or (parts_out[0]["prompt"] if parts_out else "")
        return {
            "id": str(uuid.uuid4()),
            "question_type": "STRUCTURED",
            "topic": raw.get("topic") or sq.get("topic") or topic,
            "subtopic": sq.get("subtopic", ""),
            "stem": stem,
            "parts": parts_out,
            "total_marks": sq.get("total_marks", sum(pp.get("marks", 2) for pp in parts_out)),
            "marking_scheme": {p.get("part", str(i)): p.get("key_points", []) for i, p in enumerate(parts_out)},
            "explanation": raw.get("explanation") or sq.get("explanation", ""),
            "difficulty": difficulty,
            "prompt_to_student": prompt_to_student,
            "question_index": question_index,
            "generated_at": datetime.utcnow().isoformat(),
            "ai_model": "geography_generator",
        }

    def _generate_a_level_geography_exam_question(
        self, session: Dict, question_index: int
    ) -> Optional[Dict]:
        """Generate an A-Level Geography exam question (essay only, 20-25 marks)."""
        try:
            from services.a_level_geography_generator import ALevelGeographyGenerator
            from constants import A_LEVEL_GEOGRAPHY_TOPICS
            geo_gen = ALevelGeographyGenerator()
        except Exception as e:
            logger.error("Failed to load ALevelGeographyGenerator: %s", e)
            return self._get_fallback_question(session)

        topic = self._get_topic_for_index(session, question_index)
        if not topic:
            allowed = session.get("allowed_topics") or session.get("topic_plan") or []
            paper1 = A_LEVEL_GEOGRAPHY_TOPICS.get("Paper 1", [])
            paper2 = A_LEVEL_GEOGRAPHY_TOPICS.get("Paper 2", [])
            full = paper1 + paper2
            topic = random.choice(full) if full else "Climatology"
        difficulty = (session.get("difficulty") or "standard").lower()
        if difficulty == "standard":
            difficulty = "medium"
        user_id = session.get("user_id")

        raw = geo_gen.generate_essay_question(topic, difficulty, user_id)
        if not raw:
            return self._get_fallback_question(session)

        username = session.get("username", "Student")
        prompt_to_student = (
            f"Let's go, {username}! Here's your first essay."
            if question_index == 0
            else f"Great work, {username}! Here's essay question {question_index + 1}."
        )

        return {
            "id": str(uuid.uuid4()),
            "question_type": "essay",
            "topic": raw.get("topic") or topic,
            "stem": raw.get("question", ""),
            "question": raw.get("question", ""),
            "word_limit": raw.get("word_limit", "400-600 words"),
            "marks": raw.get("marks", 25),
            "key_points": raw.get("key_points", []),
            "marking_criteria": raw.get("marking_criteria", {}),
            "case_studies": raw.get("case_studies", []),
            "sample_answer_outline": raw.get("sample_answer_outline", ""),
            "paper": raw.get("paper", ""),
            "explanation": raw.get("sample_answer_outline", ""),
            "difficulty": difficulty,
            "prompt_to_student": prompt_to_student,
            "question_index": question_index,
            "generated_at": datetime.utcnow().isoformat(),
            "ai_model": "a_level_geography_generator",
            "allows_text_input": True,
        }

    def _call_deepseek_only(
        self,
        session: Dict,
        question_index: int,
        prompt: str,
        question_type: str,
    ) -> Optional[Dict]:
        """DeepSeek-only fallback generation."""
        if not self.api_key:
            logger.error("DEEPSEEK_API_KEY not configured")
            return self._get_fallback_question(session)

        try:
            response = requests.post(
                self.api_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": DEEPSEEK_CHAT_MODEL,
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "You are a professional exam question generator for ZIMSEC/Cambridge-style exams. "
                                "Generate exactly one question in the specified JSON format. Be rigorous but fair."
                            ),
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000,
                    "response_format": {"type": "json_object"},
                },
                timeout=45,
            )

            if response.status_code == 200:
                data = response.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

                # Try to extract JSON from response (handle markdown formatting)
                try:
                    if "```json" in content:
                        start_idx = content.find("```json") + 7
                        end_idx = content.find("```", start_idx)
                        if end_idx > start_idx:
                            content = content[start_idx:end_idx].strip()
                    elif "```" in content:
                        start_idx = content.find("```") + 3
                        end_idx = content.find("```", start_idx)
                        if end_idx > start_idx:
                            content = content[start_idx:end_idx].strip()

                    json_start = content.find("{")
                    json_end = content.rfind("}") + 1

                    if json_start >= 0 and json_end > json_start:
                        json_str = content[json_start:json_end]
                        question_data = json.loads(json_str)
                    else:
                        question_data = json.loads(content)

                    # Metadata
                    question_data.setdefault("question_type", question_type)
                    question_data["id"] = str(uuid.uuid4())
                    question_data["generated_at"] = datetime.utcnow().isoformat()
                    question_data["question_index"] = question_index
                    question_data.setdefault("ai_model", "deepseek_fallback")

                    username = session.get("username", "Student")
                    if question_index == 0:
                        question_data["prompt_to_student"] = f"Let's go, {username}! Here's your first question."
                    else:
                        question_data["prompt_to_student"] = (
                            f"Great work, {username}! Here's question {question_index + 1}."
                        )

                    logger.info("Generated exam question %s with DeepSeek fallback", question_index + 1)
                    return question_data

                except json.JSONDecodeError as e:
                    logger.error(f"DeepSeek JSON parsing error: {e}")
                    logger.debug(f"Raw content: {content[:500]}")
                    return self._get_fallback_question(session)

            logger.error("DeepSeek API error: %s - %s", response.status_code, response.text)
            return self._get_fallback_question(session)

        except Exception as e:
            logger.error(f"DeepSeek API exception: {e}")
            return self._get_fallback_question(session)

    def _build_question_prompt(self, session: Dict, index: int, question_type: str) -> str:
        """Build the generation prompt for the AI question generator."""
        subject = session["subject"]
        level = session["level"]
        difficulty = session["difficulty"]
        paper_style = session.get("paper_style", "ZIMSEC")
        
        # Normalize subject name for prompt clarity
        subject_key = (subject or "").lower().replace(" ", "_").replace("-", "_")
        subject_display = subject
        if "a_level_physics" in subject_key:
            subject_display = "A Level Physics"
        elif "a_level_chemistry" in subject_key:
            subject_display = "A Level Chemistry"
        elif "a_level_biology" in subject_key:
            subject_display = "A Level Biology"
        elif "a_level_pure_math" in subject_key or "pure_math" in subject_key:
            subject_display = "A Level Pure Mathematics"
        elif subject_key in ("mathematics", "math"):
            subject_display = "Mathematics"
        
        # Get allowed topics for filtering
        allowed_topics = session.get('allowed_topics', [])
        topic_instruction = ""
        planned_topic = self._get_topic_for_index(session, index)
        if planned_topic:
            topic_instruction = f"\nUse this EXACT topic for this question: {planned_topic}. Set the 'topic' field to exactly this value."
        elif allowed_topics:
            topic_instruction = f"\nFocus ONLY on these topics: {allowed_topics}. Pick one topic from this list for each question."
        
        if question_type == "MCQ":
            return f"""Generate ONE {paper_style}-style {level.replace("_", " ")} {subject_display} MCQ question.

Difficulty: {difficulty}{topic_instruction}
Avoid these topics (recently used): {session.get('recent_topics', [])}
Do NOT repeat these question IDs: {session.get('asked_question_ids', [])}

Use PLAIN TEXT math (x², √, π) - NO LaTeX or $ symbols.

Return ONLY valid JSON:
{{
  "question_type": "MCQ",
  "topic": "specific topic name",
  "subtopic": "optional subtopic",
  "stem": "Clear, unambiguous question text",
  "options": [
    {{"label": "A", "text": "first option"}},
    {{"label": "B", "text": "second option"}},
    {{"label": "C", "text": "third option"}},
    {{"label": "D", "text": "fourth option"}}
  ],
  "correct_option": "A",
  "explanation": "Why the correct answer is correct and others are wrong",
  "difficulty": "{difficulty}"
}}

Requirements:
- Single best answer (no "all of the above")
- Plausible distractors
- Level-appropriate vocabulary
- Clear, unambiguous"""

        else:  # STRUCTURED
            return f"""Generate ONE {paper_style}-style {level.replace("_", " ")} {subject_display} structured question.

Difficulty: {difficulty}{topic_instruction}
Avoid these topics (recently used): {session.get('recent_topics', [])}

Use PLAIN TEXT math (x², √, π) - NO LaTeX or $ symbols.

Return ONLY valid JSON:
{{
  "question_type": "STRUCTURED",
  "topic": "specific topic name",
  "stem": "Question context/scenario",
  "parts": [
    {{"part": "a", "marks": 2, "prompt": "First part question", "key_points": ["point1", "point2"]}},
    {{"part": "b", "marks": 3, "prompt": "Second part question", "key_points": ["point1", "point2", "point3"]}}
  ],
  "total_marks": 5,
  "marking_scheme": {{
    "a": {{"points": ["expected point 1", "expected point 2"], "marks_each": 1}},
    "b": {{"points": ["expected point 1", "expected point 2", "expected point 3"], "marks_each": 1}}
  }},
  "difficulty": "{difficulty}"
}}

Requirements:
- Progressive difficulty within parts
- Clear marking allocation (1 mark per point typically)
- Exam-appropriate language"""
    
    def _generate_with_vertex_ai(self, session: Dict, question_index: int, prompt: str) -> Optional[Dict]:
        """Generate an exam question using Vertex AI (Gemini) as primary."""
        try:
            from services.vertex_service import vertex_service

            if not vertex_service.is_available():
                logger.warning("Vertex AI not available for exam generation")
                return None

            system_message = (
                "You are a professional exam question generator for ZIMSEC/Cambridge-style exams. "
                "Generate exactly one question in the specified JSON format. Be rigorous but fair."
            )
            full_prompt = f"{system_message}\n\n{prompt}"

            result = vertex_service.generate_text(prompt=full_prompt, model="gemini-2.5-flash")
            if not result or not result.get('success'):
                logger.warning("Vertex AI exam generation returned no result")
                return None

            content = (result.get('text') or "").strip()
            if not content:
                return None

            try:
                if '```json' in content:
                    start_idx = content.find('```json') + 7
                    end_idx = content.find('```', start_idx)
                    if end_idx > start_idx:
                        content = content[start_idx:end_idx].strip()
                elif '```' in content:
                    start_idx = content.find('```') + 3
                    end_idx = content.find('```', start_idx)
                    if end_idx > start_idx:
                        content = content[start_idx:end_idx].strip()

                json_start = content.find('{')
                json_end = content.rfind('}') + 1

                if json_start >= 0 and json_end > json_start:
                    json_str = content[json_start:json_end]
                    question_data = json.loads(json_str)
                else:
                    question_data = json.loads(content)

                question_data.setdefault('ai_model', 'vertex_ai')
                question_data['id'] = str(uuid.uuid4())
                question_data['generated_at'] = datetime.utcnow().isoformat()
                question_data['question_index'] = question_index

                username = session.get('username', 'Student')
                if question_index == 0:
                    question_data['prompt_to_student'] = f"Let's go, {username}! Here's your first question."
                else:
                    question_data['prompt_to_student'] = (
                        f"Great work, {username}! Here's question {question_index + 1}."
                    )

                logger.info("Generated exam question %s with Vertex AI", question_index + 1)
                return question_data

            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error in Vertex AI exam session: {e}")
                return None

        except Exception as e:
            logger.error(f"Error generating exam question with Vertex AI: {e}")
            return None

    def _get_fallback_question(self, session: Dict) -> Dict:
        """Return a fallback question when AI fails."""
        subject = session["subject"].lower()
        subject_key = subject.replace(" ", "_").replace("-", "_")
        
        fallback_questions = {
            "mathematics": {
                "id": f"fallback-{uuid.uuid4()}",
                "question_type": "MCQ",
                "topic": "Algebra",
                "stem": "Simplify: 3x + 2x - x",
                "options": [
                    {"label": "A", "text": "4x"},
                    {"label": "B", "text": "5x"},
                    {"label": "C", "text": "6x"},
                    {"label": "D", "text": "3x"},
                ],
                "correct_option": "A",
                "explanation": "3x + 2x - x = (3 + 2 - 1)x = 4x",
                "prompt_to_student": "Here's a question while we prepare the next one.",
            },
            "biology": {
                "id": f"fallback-{uuid.uuid4()}",
                "question_type": "MCQ",
                "topic": "Cell Biology",
                "stem": "Which organelle is responsible for producing ATP?",
                "options": [
                    {"label": "A", "text": "Nucleus"},
                    {"label": "B", "text": "Mitochondria"},
                    {"label": "C", "text": "Ribosome"},
                    {"label": "D", "text": "Golgi apparatus"},
                ],
                "correct_option": "B",
                "explanation": "Mitochondria are the powerhouse of the cell, producing ATP through cellular respiration.",
                "prompt_to_student": "Here's a question while we prepare the next one.",
            },
            "a_level_physics": {
                "id": f"fallback-{uuid.uuid4()}",
                "question_type": "MCQ",
                "topic": "Kinematics",
                "stem": "A car accelerates from rest at 2 m/s² for 5 seconds. What is its final velocity?",
                "options": [
                    {"label": "A", "text": "5 m/s"},
                    {"label": "B", "text": "10 m/s"},
                    {"label": "C", "text": "15 m/s"},
                    {"label": "D", "text": "20 m/s"},
                ],
                "correct_option": "B",
                "explanation": "Using v = u + at, where u = 0, a = 2 m/s², t = 5 s: v = 0 + (2)(5) = 10 m/s",
                "prompt_to_student": "Here's a question while we prepare the next one.",
            },
            "a_level_chemistry": {
                "id": f"fallback-{uuid.uuid4()}",
                "question_type": "MCQ",
                "topic": "Atomic Structure",
                "stem": "What is the maximum number of electrons that can occupy the third shell (n=3)?",
                "options": [
                    {"label": "A", "text": "8"},
                    {"label": "B", "text": "18"},
                    {"label": "C", "text": "32"},
                    {"label": "D", "text": "2"},
                ],
                "correct_option": "B",
                "explanation": "The maximum number of electrons in shell n is 2n². For n=3: 2(3)² = 2(9) = 18 electrons.",
                "prompt_to_student": "Here's a question while we prepare the next one.",
            },
            "a_level_biology": {
                "id": f"fallback-{uuid.uuid4()}",
                "question_type": "MCQ",
                "topic": "Cell Structure",
                "stem": "Which organelle contains DNA in eukaryotic cells?",
                "options": [
                    {"label": "A", "text": "Mitochondria"},
                    {"label": "B", "text": "Nucleus"},
                    {"label": "C", "text": "Ribosome"},
                    {"label": "D", "text": "Endoplasmic reticulum"},
                ],
                "correct_option": "B",
                "explanation": "The nucleus contains the cell's DNA in eukaryotic cells, controlling cellular activities.",
                "prompt_to_student": "Here's a question while we prepare the next one.",
            },
            "pure_math": {
                "id": f"fallback-{uuid.uuid4()}",
                "question_type": "MCQ",
                "topic": "Polynomials",
                "stem": "If f(x) = x² + 3x - 4, what is f(2)?",
                "options": [
                    {"label": "A", "text": "2"},
                    {"label": "B", "text": "6"},
                    {"label": "C", "text": "8"},
                    {"label": "D", "text": "10"},
                ],
                "correct_option": "B",
                "explanation": "f(2) = (2)² + 3(2) - 4 = 4 + 6 - 4 = 6",
                "prompt_to_student": "Here's a question while we prepare the next one.",
            },
            "computer_science": {
                "id": f"fallback-{uuid.uuid4()}",
                "question_type": "MCQ",
                "topic": "Data representation",
                "stem": "How many bits are there in one byte?",
                "options": [
                    {"label": "A", "text": "4"},
                    {"label": "B", "text": "8"},
                    {"label": "C", "text": "16"},
                    {"label": "D", "text": "32"},
                ],
                "correct_option": "B",
                "explanation": "One byte consists of 8 bits. This is a fundamental unit in digital data representation.",
                "prompt_to_student": "Here's a question while we prepare the next one.",
            },
        }
        
        # Check for A-Level subjects
        if "a_level_physics" in subject_key:
            return fallback_questions["a_level_physics"]
        elif "a_level_chemistry" in subject_key:
            return fallback_questions["a_level_chemistry"]
        elif "a_level_biology" in subject_key:
            return fallback_questions["a_level_biology"]
        elif "pure_math" in subject_key or "a_level_pure_math" in subject_key:
            return fallback_questions["pure_math"]
        elif "biology" in subject_key:
            return fallback_questions["biology"]
        elif subject_key == "computer_science":
            return fallback_questions["computer_science"]
        elif subject_key == "a_level_geography":
            return {
                "id": f"fallback-{uuid.uuid4()}",
                "question_type": "essay",
                "topic": "Climatology",
                "stem": "Discuss the key processes and patterns in climatology. Analyse the factors influencing global climate and evaluate their impacts on Zimbabwean agriculture and water resources.",
                "question": "Discuss the key processes and patterns in climatology. Analyse the factors influencing global climate and evaluate their impacts on Zimbabwean agriculture and water resources.",
                "word_limit": "400-600 words",
                "marks": 25,
                "key_points": ["Define key concepts", "Describe processes and patterns", "Analyse factors", "Evaluate impacts"],
                "marking_criteria": {"content": "10-12 marks", "analysis": "6-8 marks", "communication": "3-4 marks"},
                "explanation": "Address command word; use Zimbabwean/African examples where relevant.",
                "prompt_to_student": "Here's an essay question while we prepare the next one.",
                "allows_text_input": True,
            }

        return fallback_questions.get(subject, fallback_questions["mathematics"])

    def _get_subject_topics(
        self,
        subject: str,
        level: str,
        allowed_topics: Optional[List[str]] = None,
        paper_style: str = "ZIMSEC",
    ) -> List[str]:
        """Resolve topic pool for a given subject/level. For Computer Science, paper_style selects ZimSec vs Cambridge topics."""
        if allowed_topics:
            return [t for t in allowed_topics if isinstance(t, str) and t.strip()]

        subject_key = (subject or "").lower().replace(" ", "_").replace("-", "_")
        # Computer Science: board-specific topic list
        if subject_key == "computer_science":
            try:
                if (paper_style or "").upper() == "CAMBRIDGE":
                    from services.cambridge_cs_syllabus import CAMBRIDGE_CS_TOPICS
                    return list(CAMBRIDGE_CS_TOPICS) if CAMBRIDGE_CS_TOPICS else []
                from constants import TOPICS
                return list(TOPICS.get("Computer Science", []))
            except Exception:
                try:
                    from constants import TOPICS
                    return list(TOPICS.get("Computer Science", []))
                except Exception:
                    return []
        try:
            from constants import (
                TOPICS,
                A_LEVEL_PURE_MATH_ALL_TOPICS,
                A_LEVEL_PURE_MATH_TOPICS,
                A_LEVEL_PHYSICS_ALL_TOPICS,
                A_LEVEL_PHYSICS_TOPICS,
                A_LEVEL_CHEMISTRY_ALL_TOPICS,
                A_LEVEL_CHEMISTRY_TOPICS,
                A_LEVEL_BIOLOGY_ALL_TOPICS,
                A_LEVEL_BIOLOGY_TOPICS,
                A_LEVEL_GEOGRAPHY_ALL_TOPICS,
            )
        except Exception:
            return []

        # A-Level Geography (essay-only, Paper 1 + Paper 2 topics)
        if subject_key == "a_level_geography":
            return list(A_LEVEL_GEOGRAPHY_ALL_TOPICS)

        # O-Level Mathematics
        if subject_key in ("mathematics", "math") or subject_key.startswith("mathematics_"):
            return TOPICS.get("Mathematics", [])

        # A-Level Pure Mathematics
        if "pure_math" in subject_key or "a_level_pure_math" in subject_key:
            # Check if level-specific topics are requested
            if level == "A_LEVEL" and allowed_topics is None:
                # Return all topics if no specific level requested
                return list(A_LEVEL_PURE_MATH_ALL_TOPICS)
            # If specific level requested, return that level's topics
            if "lower_sixth" in level.lower() or "form_5" in level.lower():
                return list(A_LEVEL_PURE_MATH_TOPICS.get("Lower Sixth", []))
            elif "upper_sixth" in level.lower() or "form_6" in level.lower():
                return list(A_LEVEL_PURE_MATH_TOPICS.get("Upper Sixth", []))
            return list(A_LEVEL_PURE_MATH_ALL_TOPICS)

        # A-Level Physics
        if "a_level_physics" in subject_key or subject_key == "a_level_physics":
            if level == "A_LEVEL" and allowed_topics is None:
                return list(A_LEVEL_PHYSICS_ALL_TOPICS)
            # Check for AS/A2 level
            if "as_level" in level.lower() or "as" in level.lower():
                return list(A_LEVEL_PHYSICS_TOPICS.get("AS Level", []))
            elif "a2_level" in level.lower() or "a2" in level.lower():
                return list(A_LEVEL_PHYSICS_TOPICS.get("A2 Level", []))
            return list(A_LEVEL_PHYSICS_ALL_TOPICS)

        # A-Level Chemistry
        if "a_level_chemistry" in subject_key or subject_key == "a_level_chemistry":
            if level == "A_LEVEL" and allowed_topics is None:
                return list(A_LEVEL_CHEMISTRY_ALL_TOPICS)
            # Check for Lower/Upper Sixth
            if "lower_sixth" in level.lower() or "as_level" in level.lower() or "as" in level.lower():
                return list(A_LEVEL_CHEMISTRY_TOPICS.get("Lower Sixth", []))
            elif "upper_sixth" in level.lower() or "a2_level" in level.lower() or "a2" in level.lower():
                return list(A_LEVEL_CHEMISTRY_TOPICS.get("Upper Sixth", []))
            return list(A_LEVEL_CHEMISTRY_ALL_TOPICS)

        # A-Level Biology
        if "a_level_biology" in subject_key or subject_key == "a_level_biology":
            if level == "A_LEVEL" and allowed_topics is None:
                return list(A_LEVEL_BIOLOGY_ALL_TOPICS)
            # Check for Lower/Upper Sixth
            if "lower_sixth" in level.lower() or "as_level" in level.lower() or "as" in level.lower():
                return list(A_LEVEL_BIOLOGY_TOPICS.get("Lower Sixth", []))
            elif "upper_sixth" in level.lower() or "a2_level" in level.lower() or "a2" in level.lower():
                return list(A_LEVEL_BIOLOGY_TOPICS.get("Upper Sixth", []))
            return list(A_LEVEL_BIOLOGY_ALL_TOPICS)

        return []

    def _build_topic_plan(self, topics: List[str], total_questions: int) -> List[str]:
        """Build a topic plan that cycles through topics for maximum diversity."""
        if not topics or total_questions <= 0:
            return []

        plan: List[str] = []
        topics_clean = [t for t in topics if isinstance(t, str) and t.strip()]
        if not topics_clean:
            return []

        while len(plan) < total_questions:
            block = topics_clean[:]
            random.shuffle(block)
            # Avoid immediate repeat across block boundaries
            if plan and block and plan[-1].strip().lower() == block[0].strip().lower():
                if len(block) > 1:
                    block[0], block[1] = block[1], block[0]
            plan.extend(block)

        return plan[:total_questions]

    def _get_topic_for_index(self, session: Dict, index: int) -> Optional[str]:
        plan = session.get("topic_plan", [])
        if isinstance(plan, list) and 0 <= index < len(plan):
            topic = plan[index]
            return topic.strip() if isinstance(topic, str) else None
        return None

    def _get_question_type_for_index(self, session: Dict, question_index: int) -> str:
        """Return question type (MCQ, STRUCTURED, or essay) for this index based on session question_mode."""
        subject_key = (session.get("subject") or "").lower().replace(" ", "_").replace("-", "_")
        if subject_key == "a_level_geography":
            return "essay"
        mode = (session.get("question_mode") or "MCQ_ONLY").upper()
        if mode == "MCQ_ONLY":
            return "MCQ"
        if mode == "STRUCTURED_ONLY":
            return "STRUCTURED"
        # MIXED: alternate MCQ and STRUCTURED by index
        return "MCQ" if question_index % 2 == 0 else "STRUCTURED"

    def _build_question_signature(self, question: Dict) -> str:
        """Build a normalized signature for duplicate detection within a session."""
        if not question or not isinstance(question, dict):
            return ""

        stem = str(question.get("stem") or question.get("question_text") or "")
        options = question.get("options") or []
        option_texts = []
        if isinstance(options, list):
            for opt in options:
                if isinstance(opt, dict):
                    option_texts.append(str(opt.get("text") or ""))
                else:
                    option_texts.append(str(opt))

        parts = question.get("parts") or []
        part_texts = []
        if isinstance(parts, list):
            for part in parts:
                if isinstance(part, dict):
                    part_texts.append(str(part.get("prompt") or ""))
                else:
                    part_texts.append(str(part))

        raw = " ".join([stem] + option_texts + part_texts).lower()
        normalized = "".join(ch for ch in raw if ch.isalnum() or ch.isspace())
        return " ".join(normalized.split())

    def _build_structured_explanation(self, question: Dict) -> str:
        """Create a step-by-step explanation for structured questions."""
        parts = question.get("parts") or []
        marking = question.get("marking_scheme") or {}
        lines = ["Step-by-step solution:"]

        if isinstance(parts, list) and parts:
            for part in parts:
                if not isinstance(part, dict):
                    continue
                label = part.get("part", "")
                prompt = part.get("prompt", "")
                key_points = part.get("key_points") or []
                scheme = marking.get(label, {}) if isinstance(marking, dict) else {}
                points = scheme.get("points") or key_points
                points_text = ", ".join([p for p in points if isinstance(p, str)]) if points else "Show working clearly."
                lines.append(f"Step {label}: {prompt} — Key points: {points_text}")
        else:
            lines.append("Work through each part logically and show your method.")

        return "\n".join(lines)
    
    # =========================================================================
    # ANSWER MARKING
    # =========================================================================
    
    def submit_answer(
        self,
        session_id: str,
        question_id: str,
        answer: Any,
        time_spent_seconds: int = 0,
        is_flagged: bool = False,
        image_url: str = None,
    ) -> Dict[str, Any]:
        """
        Mark a single answer and return immediate feedback.
        Supports image-based answers for mathematics questions using Vertex AI.
        """
        session = self._sessions.get(session_id)
        if not session:
            return {"error": "Session not found"}
        
        # Find the question
        question = None
        question_index = None
        for idx, q in enumerate(session["questions"]):
            if q.get("id") == question_id:
                question = q
                question_index = idx
                break
        
        if not question:
            return {"error": "Question not found in session"}
        
        # Process image answer if provided (for mathematics)
        processed_answer = answer
        if image_url and question.get("question_type") == "STRUCTURED":
            # Check if this is a mathematics subject
            subject = session.get("subject", "").lower()
            is_math = "math" in subject or subject in ["mathematics", "pure_math", "a_level_pure_math"]
            
            if is_math:
                # Extract text from image using Vertex AI
                extracted_text = self._extract_text_from_image(image_url)
                if extracted_text:
                    # Combine text answer with extracted image text
                    processed_answer = f"{answer}\n\n[From image: {extracted_text}]" if answer else extracted_text
        
        # Mark the answer
        result = self._mark_answer(question, processed_answer, session.get("username", "Student"), image_url)
        
        # Store response
        session["responses"][question_id] = {
            "question_id": question_id,
            "answer": processed_answer,
            "is_correct": result["is_correct"],
            "marks_awarded": result.get("marks_awarded", 0),
            "marks_total": result.get("marks_total", 1),
            "time_spent_seconds": time_spent_seconds,
            "is_flagged": is_flagged,
            "marked_at": datetime.utcnow().isoformat(),
            "image_url": image_url if image_url else None,
        }
        
        # Update performance signals
        topic = question.get("topic", "")
        if topic:
            if result["is_correct"]:
                if topic not in session["performance_signals"]["strong_topics"]:
                    session["performance_signals"]["strong_topics"].append(topic)
            else:
                if topic not in session["performance_signals"]["weak_topics"]:
                    session["performance_signals"]["weak_topics"].append(topic)
        
        # Update current index
        if question_index is not None:
            session["current_index"] = max(session["current_index"], question_index + 1)
        
        return result
    
    def _mark_answer(self, question: Dict, answer: Any, username: str, image_url: str = None) -> Dict:
        """Mark a single answer."""
        question_type = question.get("question_type", "MCQ")
        
        if question_type == "MCQ":
            correct = question.get("correct_option", "")
            is_correct = str(answer).upper() == str(correct).upper()
            
            return {
                "is_correct": is_correct,
                "marks_awarded": 1 if is_correct else 0,
                "marks_total": 1,
                "correct_answer": correct,
                "explanation": question.get("explanation", ""),
                "feedback": self._generate_mcq_feedback(is_correct, username),
            }
        if question_type == "essay":
            return self._mark_essay_answer(question, answer, username)
        # STRUCTURED
        return self._mark_structured_answer(question, answer, username, image_url)

    def _mark_essay_answer(self, question: Dict, answer: Any, username: str) -> Dict:
        """Mark an essay answer using key_points presence (heuristic). Full marking would require AI."""
        total_marks = question.get("marks", 25)
        key_points = question.get("key_points") or []
        answer_text = (answer or "").strip()
        word_count = len(answer_text.split()) if answer_text else 0

        # Heuristic: award marks for key points addressed (keyword presence) and length
        marks_awarded = 0
        if key_points and answer_text:
            answer_lower = answer_text.lower()
            for point in key_points:
                # Check if any significant word from the key point appears
                words = [w for w in point.split() if len(w) > 3]
                if words and any(w.lower() in answer_lower for w in words):
                    marks_awarded += max(1, total_marks // max(len(key_points), 1))
        # Cap by total and give some credit for length (400-600 words expected)
        if word_count >= 300:
            marks_awarded = max(marks_awarded, total_marks // 3)
        marks_awarded = min(marks_awarded, total_marks)

        outline = question.get("sample_answer_outline") or question.get("explanation") or ""
        feedback = f"Essay submitted ({word_count} words). Key points to include: " + "; ".join(key_points[:4]) if key_points else "Review the marking criteria."
        if outline:
            feedback += f" Suggested structure: {outline[:200]}..."

        return {
            "is_correct": marks_awarded >= total_marks // 2,
            "marks_awarded": marks_awarded,
            "marks_total": total_marks,
            "percentage": (marks_awarded / total_marks * 100) if total_marks else 0,
            "explanation": outline,
            "feedback": feedback,
        }

    def _mark_structured_answer(self, question: Dict, answer: str, username: str, image_url: str = None) -> Dict:
        """Mark a structured answer using keyword matching and Vertex AI for image-based answers."""
        total_marks = question.get("total_marks", 5)
        marking_scheme = question.get("marking_scheme", {})
        
        # If image is provided, use Vertex AI for intelligent marking
        if image_url:
            return self._mark_image_answer_with_vertex_ai(question, answer, image_url, username, total_marks)
        
        # Simple keyword-based marking (can enhance with DeepSeek)
        marks_awarded = 0
        feedback_parts = []
        
        answer_lower = answer.lower() if answer else ""
        
        for part, scheme in marking_scheme.items():
            points = scheme.get("points", [])
            marks_per_point = scheme.get("marks_each", 1)
            part_marks = 0
            
            for point in points:
                # Simple keyword matching
                if any(keyword.lower() in answer_lower for keyword in point.split()):
                    part_marks += marks_per_point
            
            marks_awarded += min(part_marks, len(points) * marks_per_point)
        
        # Normalize to total marks
        marks_awarded = min(marks_awarded, total_marks)
        percentage = (marks_awarded / total_marks * 100) if total_marks > 0 else 0
        
        return {
            "is_correct": percentage >= 50,
            "marks_awarded": marks_awarded,
            "marks_total": total_marks,
            "percentage": percentage,
            "feedback": f"You scored {marks_awarded}/{total_marks} marks. " +
                       (f"Good effort, {username}!" if percentage >= 50 else f"Keep practicing, {username}."),
        }
    
    def _extract_text_from_image(self, image_url: str) -> str:
        """Extract text from image using Vertex AI."""
        try:
            import requests
            import base64
            from services.vertex_service import vertex_service
            
            if not vertex_service.is_available():
                logger.warning("Vertex AI not available for image extraction")
                return ""
            
            # Download image from URL
            response = requests.get(image_url, timeout=10)
            if response.status_code != 200:
                logger.error(f"Failed to download image from {image_url}")
                return ""
            
            # Convert to base64
            image_base64 = base64.b64encode(response.content).decode('utf-8')
            mime_type = response.headers.get('content-type', 'image/jpeg')
            
            # Analyze image with Vertex AI
            result = vertex_service.analyze_image(
                image_base64=image_base64,
                mime_type=mime_type,
                prompt="""Extract all mathematical equations, expressions, and handwritten text from this image.
                
Please respond in this exact JSON format:
{
    "detected_text": "the exact text/math expression you see",
    "latex": "the LaTeX representation if it's math, or the plain text otherwise",
    "confidence": 0.95
}

If you see handwritten math, interpret it as accurately as possible. Convert fractions, exponents, roots, and special symbols to proper LaTeX notation.
Only respond with the JSON, no other text."""
            )
            
            if result and result.get('success'):
                # Return the detected text or LaTeX
                return result.get('latex') or result.get('text', '')
            
            return ""
        except Exception as e:
            logger.error(f"Error extracting text from image: {e}", exc_info=True)
            return ""
    
    def _mark_image_answer_with_vertex_ai(
        self, 
        question: Dict, 
        answer: str, 
        image_url: str, 
        username: str, 
        total_marks: int
    ) -> Dict:
        """Mark an image-based answer using Vertex AI for intelligent evaluation."""
        try:
            import requests
            import base64
            from services.vertex_service import vertex_service
            
            if not vertex_service.is_available():
                # Fallback to simple marking
                return self._mark_structured_answer(question, answer, username, None)
            
            # Download image
            response = requests.get(image_url, timeout=10)
            if response.status_code != 200:
                logger.error(f"Failed to download image for marking")
                return self._mark_structured_answer(question, answer, username, None)
            
            image_base64 = base64.b64encode(response.content).decode('utf-8')
            mime_type = response.headers.get('content-type', 'image/jpeg')
            
            # Get question details
            question_stem = question.get("stem", "")
            parts = question.get("parts", [])
            marking_scheme = question.get("marking_scheme", {})
            
            # Build marking prompt
            marking_prompt = f"""You are a mathematics teacher marking a student's exam answer.

QUESTION:
{question_stem}

MARKING SCHEME:
{marking_scheme}

STUDENT'S ANSWER (from image):
[The student has submitted a handwritten answer in the image]

Please analyze the student's handwritten answer in the image and:
1. Extract the mathematical solution/work shown
2. Compare it against the marking scheme
3. Award marks based on correctness and completeness
4. Provide constructive feedback

Respond in this exact JSON format:
{{
    "marks_awarded": <number between 0 and {total_marks}>,
    "marks_total": {total_marks},
    "is_correct": <true if marks >= 50% of total, false otherwise>,
    "feedback": "Constructive feedback message",
    "extracted_solution": "What you extracted from the image",
    "strengths": ["list of what the student did well"],
    "improvements": ["list of areas for improvement"]
}}

Be fair but accurate. Award partial marks for correct steps even if the final answer is wrong."""
            
            # Analyze with Vertex AI
            result = vertex_service.analyze_image(
                image_base64=image_base64,
                mime_type=mime_type,
                prompt=marking_prompt
            )
            
            if result and result.get('success'):
                analysis_text = result.get('analysis', '') or result.get('text', '')
                
                # Try to parse JSON from response
                try:
                    import json
                    # Extract JSON from response (might be wrapped in markdown)
                    import re
                    json_match = re.search(r'\{.*\}', analysis_text, re.DOTALL)
                    if json_match:
                        parsed = json.loads(json_match.group())
                        marks_awarded = min(int(parsed.get('marks_awarded', 0)), total_marks)
                        percentage = (marks_awarded / total_marks * 100) if total_marks > 0 else 0
                        
                        return {
                            "is_correct": parsed.get('is_correct', percentage >= 50),
                            "marks_awarded": marks_awarded,
                            "marks_total": total_marks,
                            "percentage": percentage,
                            "feedback": parsed.get('feedback', f"You scored {marks_awarded}/{total_marks} marks."),
                            "extracted_solution": parsed.get('extracted_solution', ''),
                            "strengths": parsed.get('strengths', []),
                            "improvements": parsed.get('improvements', []),
                        }
                except (json.JSONDecodeError, ValueError, KeyError) as e:
                    logger.warning(f"Failed to parse Vertex AI response as JSON: {e}")
                    # Fallback: extract marks from text
                    marks_awarded = self._extract_marks_from_text(analysis_text, total_marks)
                    percentage = (marks_awarded / total_marks * 100) if total_marks > 0 else 0
                    
                    return {
                        "is_correct": percentage >= 50,
                        "marks_awarded": marks_awarded,
                        "marks_total": total_marks,
                        "percentage": percentage,
                        "feedback": f"You scored {marks_awarded}/{total_marks} marks. " +
                                   (f"Good effort, {username}!" if percentage >= 50 else f"Keep practicing, {username}."),
                    }
            
            # Fallback to simple marking
            return self._mark_structured_answer(question, answer, username, None)
            
        except Exception as e:
            logger.error(f"Error in Vertex AI marking: {e}", exc_info=True)
            # Fallback to simple marking
            return self._mark_structured_answer(question, answer, username, None)
    
    def _extract_marks_from_text(self, text: str, total_marks: int) -> int:
        """Extract marks from text response (fallback method)."""
        import re
        # Look for patterns like "X marks", "X/10", etc.
        patterns = [
            r'(\d+)\s*marks',
            r'(\d+)\s*/\s*(\d+)',
            r'scored\s*(\d+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    marks = int(match.group(1))
                    return min(marks, total_marks)
                except (ValueError, IndexError):
                    continue
        
        # Default: award 50% if text contains positive indicators
        positive_indicators = ['correct', 'right', 'good', 'well done', 'accurate']
        if any(indicator in text.lower() for indicator in positive_indicators):
            return max(1, total_marks // 2)
        
        return 0
    
    def _generate_mcq_feedback(self, is_correct: bool, username: str) -> str:
        """Generate personalized MCQ feedback."""
        if is_correct:
            return f"Correct, {username}! Well done."
        else:
            return f"Not quite, {username}. Review the explanation."
    
    # =========================================================================
    # EXAM COMPLETION & GRADING
    # =========================================================================
    
    def complete_exam(self, session_id: str) -> Dict[str, Any]:
        """
        Complete the exam and calculate final results.
        """
        session = self._sessions.get(session_id)
        if not session:
            return {"error": "Session not found"}
        
        # Mark as submitted
        session["status"] = "submitted"
        session["end_time"] = datetime.utcnow().isoformat()
        
        # Calculate scores
        total_marks = 0
        marks_awarded = 0
        correct_count = 0
        topic_breakdown = {}
        
        # Safely handle responses - ensure it's a dict
        responses = session.get("responses", {})
        if not isinstance(responses, dict):
            responses = {}
        
        for response in responses.values():
            if isinstance(response, dict):
                total_marks += response.get("marks_total", 1)
                marks_awarded += response.get("marks_awarded", 0)
                
                if response.get("is_correct"):
                    correct_count += 1
        
        # Handle unanswered questions
        answered_count = len(responses)
        total_questions = session.get("total_questions", 0)
        unanswered_count = max(0, total_questions - answered_count)
        total_marks += unanswered_count  # 1 mark per unanswered MCQ
        
        # Calculate percentage and grade
        percentage = (marks_awarded / total_marks * 100) if total_marks > 0 else 0
        grade = self._calculate_grade(percentage)
        
        # Topic breakdown - safely handle questions list
        questions = session.get("questions", [])
        if not isinstance(questions, list):
            questions = []
        
        for question in questions:
            if not isinstance(question, dict):
                continue
            topic = question.get("topic", "Unknown")
            if topic not in topic_breakdown:
                topic_breakdown[topic] = {"correct": 0, "total": 0}
            topic_breakdown[topic]["total"] += 1
            
            q_id = question.get("id")
            if q_id and responses.get(q_id, {}).get("is_correct"):
                topic_breakdown[topic]["correct"] += 1
        
        # Calculate time used
        start = datetime.fromisoformat(session["start_time"])
        end = datetime.fromisoformat(session["end_time"])
        time_used_seconds = int((end - start).total_seconds())
        
        username = session.get("username", "Student")
        
        # Generate encouragement
        if percentage >= 80:
            encouragement = f"Outstanding work, {username}! You've mastered this material."
        elif percentage >= 70:
            encouragement = f"Great job, {username}! You're doing really well."
        elif percentage >= 60:
            encouragement = f"Good effort, {username}. Keep pushing!"
        elif percentage >= 50:
            encouragement = f"You passed, {username}! Focus on your weak areas."
        else:
            encouragement = f"Keep practicing, {username}. You'll get there!"
        
        # Identify weak areas
        weak_areas = [
            topic for topic, stats in topic_breakdown.items()
            if stats["total"] > 0 and (stats["correct"] / stats["total"]) < 0.5
        ]
        
        results = {
            "session_id": session_id,
            "status": "submitted",
            "score": {
                "marks_awarded": marks_awarded,
                "marks_total": total_marks,
                "correct_count": correct_count,
                "total_questions": session.get("total_questions", total_questions),
                "answered_count": answered_count,
                "unanswered_count": unanswered_count,
                "percentage": round(percentage, 1),
                "grade": grade,
            },
            "time": {
                "allowed_seconds": session.get("total_time_seconds", 0),
                "used_seconds": time_used_seconds,
                "used_formatted": f"{time_used_seconds // 60}m {time_used_seconds % 60}s",
            },
            "topic_breakdown": topic_breakdown,
            "weak_areas": weak_areas,
            "performance_signals": session.get("performance_signals", {}),
            "encouragement": encouragement,
            "revision_suggestions": [f"Review: {topic}" for topic in weak_areas[:3]],
        }
        
        logger.info(f"Exam {session_id} completed: {grade} ({percentage:.1f}%)")
        
        return results
    
    def _calculate_grade(self, percentage: float) -> str:
        """Calculate letter grade from percentage."""
        for threshold, grade in GRADE_SCALE:
            if percentage >= threshold:
                return grade
        return "U"
    
    def get_exam_review(self, session_id: str) -> Optional[Dict]:
        """Get detailed question-by-question review after exam completion."""
        session = self._sessions.get(session_id)
        if not session or session["status"] != "submitted":
            return None
        
        review = []
        username = session.get("username", "Student")
        
        for idx, question in enumerate(session["questions"]):
            q_id = question.get("id")
            response = session["responses"].get(q_id, {})
            
            explanation = question.get("explanation", "")
            if question.get("question_type") == "STRUCTURED" and not explanation:
                explanation = self._build_structured_explanation(question)

            review.append({
                "question_number": idx + 1,
                "question": question,
                "user_answer": response.get("answer"),
                "is_correct": response.get("is_correct", False),
                "marks_awarded": response.get("marks_awarded", 0),
                "marks_total": response.get("marks_total", 1),
                "was_flagged": response.get("is_flagged", False),
                "time_spent": response.get("time_spent_seconds", 0),
                "correct_answer": question.get("correct_option") or "See marking scheme",
                "explanation": explanation,
            })
        
        return {
            "session_id": session_id,
            "questions": review,
            "summary_message": f"Review complete, {username}. Focus on the questions you got wrong.",
        }


# Global service instance
exam_session_service = ExamSessionService()
