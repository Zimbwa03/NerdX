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
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import requests

logger = logging.getLogger(__name__)

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
    # QUESTION GENERATION (DeepSeek)
    # =========================================================================
    
    def generate_next_question(
        self,
        session_id: str,
        question_index: int = None,
    ) -> Optional[Dict]:
        """
        Generate the next question using DeepSeek.
        One question at a time, no pre-generation.
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
        
        # Generate with DeepSeek
        question = self._call_deepseek_generate(session, idx)
        
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
    
    def _call_deepseek_generate(self, session: Dict, question_index: int) -> Optional[Dict]:
        """Call DeepSeek API to generate a single question."""
        if not self.api_key:
            logger.error("DEEPSEEK_API_KEY not configured")
            return self._get_fallback_question(session)
        
        # Determine question type for this index
        question_type = self._get_question_type_for_index(session, question_index)
        
        # Build prompt
        prompt = self._build_question_prompt(session, question_index, question_type)
        
        try:
            response = requests.post(
                self.api_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a professional exam question generator for ZIMSEC/Cambridge-style exams. Generate exactly one question in the specified JSON format. Be rigorous but fair."
                        },
                        {"role": "user", "content": prompt}
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
                question_data = json.loads(content)
                
                # Add metadata
                question_data["id"] = str(uuid.uuid4())
                question_data["generated_at"] = datetime.utcnow().isoformat()
                question_data["question_index"] = question_index
                
                # Add personalized prompt
                username = session.get("username", "Student")
                if question_index == 0:
                    question_data["prompt_to_student"] = f"Let's go, {username}! Here's your first question."
                elif question_index == session["total_questions"] - 1:
                    question_data["prompt_to_student"] = f"Last question, {username}. Give it your best!"
                else:
                    question_data["prompt_to_student"] = f"Question {question_index + 1}, {username}."
                
                logger.info(f"Generated question {question_index + 1} for session {session['id']}")
                return question_data
            else:
                logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                return self._get_fallback_question(session)
                
        except Exception as e:
            logger.error(f"DeepSeek API exception: {e}")
            return self._get_fallback_question(session)
    
    def _get_question_type_for_index(self, session: Dict, index: int) -> str:
        """Determine if this index should be MCQ or STRUCTURED."""
        mode = session.get("question_mode", "MCQ_ONLY")
        
        if mode == "MCQ_ONLY":
            return "MCQ"
        elif mode == "STRUCTURED_ONLY":
            return "STRUCTURED"
        else:  # MIXED - alternate
            return "MCQ" if index % 2 == 0 else "STRUCTURED"
    
    def _build_question_prompt(self, session: Dict, index: int, question_type: str) -> str:
        """Build the generation prompt for DeepSeek."""
        subject = session["subject"]
        level = session["level"]
        difficulty = session["difficulty"]
        paper_style = session.get("paper_style", "ZIMSEC")
        
        # Get allowed topics for filtering
        allowed_topics = session.get('allowed_topics', [])
        topic_instruction = ""
        if allowed_topics:
            topic_instruction = f"\nFocus ONLY on these topics: {allowed_topics}. Pick one topic from this list for each question."
        
        if question_type == "MCQ":
            return f"""Generate ONE {paper_style}-style {level.replace("_", " ")} {subject} MCQ question.

Difficulty: {difficulty}{topic_instruction}
Avoid these topics (recently used): {session.get('recent_topics', [])}
Do NOT repeat these question IDs: {session.get('asked_question_ids', [])}

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
            return f"""Generate ONE {paper_style}-style {level.replace("_", " ")} {subject} structured question.

Difficulty: {difficulty}{topic_instruction}
Avoid these topics (recently used): {session.get('recent_topics', [])}

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
    
    def _get_fallback_question(self, session: Dict) -> Dict:
        """Return a fallback question when DeepSeek fails."""
        subject = session["subject"].lower()
        
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
        }
        
        return fallback_questions.get(subject, fallback_questions["mathematics"])
    
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
    ) -> Dict[str, Any]:
        """
        Mark a single answer and return immediate feedback.
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
        
        # Mark the answer
        result = self._mark_answer(question, answer, session.get("username", "Student"))
        
        # Store response
        session["responses"][question_id] = {
            "question_id": question_id,
            "answer": answer,
            "is_correct": result["is_correct"],
            "marks_awarded": result.get("marks_awarded", 0),
            "marks_total": result.get("marks_total", 1),
            "time_spent_seconds": time_spent_seconds,
            "is_flagged": is_flagged,
            "marked_at": datetime.utcnow().isoformat(),
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
    
    def _mark_answer(self, question: Dict, answer: Any, username: str) -> Dict:
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
        else:  # STRUCTURED
            return self._mark_structured_answer(question, answer, username)
    
    def _mark_structured_answer(self, question: Dict, answer: str, username: str) -> Dict:
        """Mark a structured answer using keyword matching and DeepSeek if available."""
        total_marks = question.get("total_marks", 5)
        marking_scheme = question.get("marking_scheme", {})
        
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
        
        for response in session["responses"].values():
            total_marks += response.get("marks_total", 1)
            marks_awarded += response.get("marks_awarded", 0)
            
            if response.get("is_correct"):
                correct_count += 1
        
        # Handle unanswered questions
        answered_count = len(session["responses"])
        unanswered_count = session["total_questions"] - answered_count
        total_marks += unanswered_count  # 1 mark per unanswered MCQ
        
        # Calculate percentage and grade
        percentage = (marks_awarded / total_marks * 100) if total_marks > 0 else 0
        grade = self._calculate_grade(percentage)
        
        # Topic breakdown
        for question in session["questions"]:
            topic = question.get("topic", "Unknown")
            if topic not in topic_breakdown:
                topic_breakdown[topic] = {"correct": 0, "total": 0}
            topic_breakdown[topic]["total"] += 1
            
            q_id = question.get("id")
            if q_id and session["responses"].get(q_id, {}).get("is_correct"):
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
                "total_questions": session["total_questions"],
                "answered_count": answered_count,
                "unanswered_count": unanswered_count,
                "percentage": round(percentage, 1),
                "grade": grade,
            },
            "time": {
                "allowed_seconds": session["total_time_seconds"],
                "used_seconds": time_used_seconds,
                "used_formatted": f"{time_used_seconds // 60}m {time_used_seconds % 60}s",
            },
            "topic_breakdown": topic_breakdown,
            "weak_areas": weak_areas,
            "performance_signals": session["performance_signals"],
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
                "explanation": question.get("explanation", ""),
            })
        
        return {
            "session_id": session_id,
            "questions": review,
            "summary_message": f"Review complete, {username}. Focus on the questions you got wrong.",
        }


# Global service instance
exam_session_service = ExamSessionService()
