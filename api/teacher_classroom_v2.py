"""
NerdX AI Teacher Classroom API v2.0
Neuronet AI Solutions (Pvt) Ltd

Handles: Classroom posts, assessments, student submissions,
         AI exam generation, AI marking triggers, results release.
All endpoints prefixed with /api/v2/ (registered in routes.py).
"""
import logging
import os
import uuid
import json
from datetime import datetime, timezone
from functools import wraps
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from database.external_db import make_supabase_request

logger = logging.getLogger(__name__)

teacher_classroom_bp = Blueprint('teacher_classroom_v2', __name__)


def _now_utc():
    return datetime.now(timezone.utc)


def _parse_utc(value):
    if value is None:
        return None
    try:
        s = str(value).strip()
        if s.endswith("Z"):
            s = s[:-1] + "+00:00"
        dt = datetime.fromisoformat(s)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return None


def _is_post_visible(post):
    if not post.get("is_published"):
        return False
    scheduled_at = _parse_utc(post.get("scheduled_at"))
    if scheduled_at and scheduled_at > _now_utc():
        return False
    return True


def _get_classroom_context(classroom_id):
    cr = make_supabase_request(
        "GET", "ai_classrooms", select="*",
        filters={"id": f"eq.{classroom_id}"},
        use_service_role=True
    )
    if not cr:
        return None, None, None, None

    classroom = cr[0]
    cs = make_supabase_request(
        "GET", "class_subjects", select="*",
        filters={"id": f"eq.{classroom['class_subject_id']}"},
        use_service_role=True
    )
    class_subject = cs[0] if cs else None

    subject = cls = None
    if class_subject:
        s = make_supabase_request(
            "GET", "school_subjects", select="*",
            filters={"id": f"eq.{class_subject['subject_id']}"},
            use_service_role=True
        )
        subject = s[0] if s else None
        c = make_supabase_request(
            "GET", "school_classes", select="id,display_name,form_id",
            filters={"id": f"eq.{class_subject['class_id']}"},
            use_service_role=True
        )
        cls = c[0] if c else None

    return classroom, class_subject, subject, cls


def _get_teacher_from_token(token):
    if not token:
        return None
    sessions = make_supabase_request(
        "GET", "teacher_sessions",
        select="teacher_id,sub_school_id,expires_at",
        filters={"token": f"eq.{token}"},
        use_service_role=True
    )
    if not sessions:
        return None
    session = sessions[0]
    exp = _parse_utc(session.get("expires_at"))
    if not exp or exp < _now_utc():
        return None
    teachers = make_supabase_request(
        "GET", "school_teachers", select="*",
        filters={"id": f"eq.{session['teacher_id']}"},
        use_service_role=True
    )
    return teachers[0] if teachers else None


def teacher_auth_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        token = auth.replace("Bearer ", "") if auth.startswith("Bearer ") else None
        teacher = _get_teacher_from_token(token)
        if not teacher:
            return jsonify({"error": "Unauthorized"}), 401
        request.teacher = teacher
        return f(*args, **kwargs)
    return wrapper


# ═══════════════════════════════════════════════════════════════════════════════
# CLASSROOM FEED
# ═══════════════════════════════════════════════════════════════════════════════

@teacher_classroom_bp.route("/classrooms/<int:classroom_id>", methods=["GET"])
@teacher_auth_required
def get_classroom(classroom_id):
    classroom, class_subject, subject, cls = _get_classroom_context(classroom_id)
    if not classroom:
        return jsonify({"error": "Classroom not found"}), 404

    teacher = None
    if class_subject:
        t = make_supabase_request("GET", "school_teachers", select="id,first_name,last_name,photo_url,specialisation",
                                  filters={"id": f"eq.{class_subject['teacher_id']}"}, use_service_role=True)
        teacher = t[0] if t else None

    students = make_supabase_request(
        "GET", "school_students", select="id",
        filters={"class_id": f"eq.{class_subject['class_id']}"} if class_subject else {},
        use_service_role=True
    ) or []

    return jsonify({
        "classroom": classroom,
        "subject": subject,
        "teacher": teacher,
        "class": cls,
        "student_count": len(students),
    })


@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/posts", methods=["GET"])
@teacher_auth_required
def list_classroom_posts(classroom_id):
    posts = make_supabase_request(
        "GET", "classroom_posts", select="*",
        filters={"classroom_id": f"eq.{classroom_id}"},
        use_service_role=True
    ) or []
    posts.sort(key=lambda p: p.get("created_at", ""), reverse=True)
    return jsonify({"posts": posts, "total": len(posts)})


@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/posts", methods=["POST"])
@teacher_auth_required
def create_post(classroom_id):
    teacher = request.teacher
    body = request.get_json(silent=True) or {}
    title = (body.get("title") or "").strip()
    post_type = (body.get("post_type") or "announcement").strip()

    if not title:
        return jsonify({"error": "title is required"}), 400

    result = make_supabase_request("POST", "classroom_posts", {
        "classroom_id": classroom_id,
        "teacher_id": teacher["id"],
        "post_type": post_type,
        "title": title,
        "content": body.get("content"),
        "attachments": body.get("attachments", []),
        "due_date": body.get("due_date"),
        "is_published": body.get("is_published", True),
        "scheduled_at": body.get("scheduled_at"),
    }, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to create post"}), 500
    return jsonify({"success": True, "post": result[0]}), 201


@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/posts/ai-draft", methods=["POST"])
@teacher_auth_required
def generate_post_draft(classroom_id):
    body = request.get_json(silent=True) or {}
    classroom, _, subject, cls = _get_classroom_context(classroom_id)
    if not classroom:
        return jsonify({"error": "Classroom not found"}), 404

    post_type = (body.get("post_type") or "assignment").strip()
    topic = (body.get("topic") or "").strip()
    objective = (body.get("objective") or "").strip()
    due_date = body.get("due_date")

    subject_name = (subject or {}).get("name") or "the subject"
    class_name = (cls or {}).get("display_name") or classroom.get("name") or "the class"
    due_text = f"Due date: {due_date}." if due_date else "No due date has been set yet."

    system = (
        "You are an expert Zimbabwean school teacher assistant writing polished, direct classroom instructions. "
        "Return only valid JSON with keys: title, content, checklist. "
        "The content should be concise, professional, and clear for students."
    )
    prompt = (
        f"Draft a {post_type} for {subject_name}, class {class_name}.\n"
        f"Topic: {topic or 'Current class topic'}.\n"
        f"Objective: {objective or 'Help learners complete the required classwork successfully'}.\n"
        f"{due_text}\n"
        "Checklist must be a JSON array of 3 short learner actions."
    )

    try:
        from services.classroom_ai_service import _call_ai
        raw = _call_ai(prompt, system=system, max_tokens=600, json_mode=True)
        payload = json.loads(raw)
        return jsonify({
            "success": True,
            "title": payload.get("title") or f"{post_type.title()} on {topic or subject_name}",
            "content": payload.get("content") or objective,
            "checklist": payload.get("checklist") or [],
        })
    except Exception:
        fallback_title = f"{post_type.title()} - {topic or subject_name}"
        fallback_content = (
            f"Complete the {post_type} for {subject_name}. Focus on {topic or 'the current topic'}, "
            f"follow the instructions carefully, and submit clear work on time."
        )
        return jsonify({
            "success": True,
            "title": fallback_title,
            "content": fallback_content,
            "checklist": [
                "Read the task carefully before starting.",
                "Complete all required parts neatly.",
                "Submit your work before the deadline.",
            ],
        })


@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/attachments", methods=["POST"])
@teacher_auth_required
def upload_classroom_attachment(classroom_id):
    teacher = request.teacher
    uploaded = request.files.get("file")
    if not uploaded or not uploaded.filename:
        return jsonify({"error": "file is required"}), 400

    safe_name = secure_filename(uploaded.filename) or f"attachment-{uuid.uuid4().hex}"
    ext = os.path.splitext(safe_name)[1]
    relative_dir = os.path.join("static", "classroom_uploads", str(teacher["id"]))
    absolute_dir = os.path.join(os.getcwd(), relative_dir)
    os.makedirs(absolute_dir, exist_ok=True)
    stored_name = f"{uuid.uuid4().hex}{ext}"
    stored_path = os.path.join(absolute_dir, stored_name)
    uploaded.save(stored_path)

    from services.image_hosting_service import ImageHostingService

    hosting = ImageHostingService()
    mime_type = (uploaded.mimetype or "").lower()
    if mime_type.startswith("image/"):
        public_url = hosting.upload_image_with_fallback(stored_path)
    else:
        public_url = hosting.upload_document_with_fallback(stored_path)

    if not public_url:
        return jsonify({"error": "Failed to upload attachment"}), 500

    return jsonify({
        "success": True,
        "attachment": {
            "name": safe_name,
            "url": public_url,
            "mime_type": uploaded.mimetype or "application/octet-stream",
            "size_bytes": os.path.getsize(stored_path),
            "uploaded_at": _now_utc().isoformat(),
        },
    }), 201


@teacher_classroom_bp.route("/posts/<int:post_id>", methods=["PATCH"])
@teacher_auth_required
def update_post(post_id):
    body = request.get_json(silent=True) or {}
    allowed = ["title", "content", "attachments", "due_date", "is_published", "scheduled_at", "post_type"]
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return jsonify({"error": "No fields to update"}), 400

    updates["updated_at"] = _now_utc().isoformat()
    result = make_supabase_request(
        "PATCH", "classroom_posts", updates,
        filters={"id": f"eq.{post_id}"},
        use_service_role=True
    )
    if result is None:
        return jsonify({"error": "Failed to update post"}), 500
    return jsonify({"success": True, "post": result[0] if result else None})


@teacher_classroom_bp.route("/posts/<int:post_id>", methods=["DELETE"])
@teacher_auth_required
def delete_post(post_id):
    make_supabase_request(
        "DELETE", "classroom_posts",
        filters={"id": f"eq.{post_id}"},
        use_service_role=True
    )
    return jsonify({"success": True})


# ═══════════════════════════════════════════════════════════════════════════════
# ASSESSMENTS
# ═══════════════════════════════════════════════════════════════════════════════

@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/assessments", methods=["POST"])
@teacher_auth_required
def create_assessment(classroom_id):
    teacher = request.teacher
    body = request.get_json(silent=True) or {}
    title = (body.get("title") or "").strip()
    atype = (body.get("type") or "mixed").strip()

    if not title:
        return jsonify({"error": "title is required"}), 400

    total_marks = 0
    questions = body.get("questions", [])
    for q in questions:
        total_marks += float(q.get("marks", 1))

    assessment_data = {
        "classroom_id": classroom_id,
        "teacher_id": teacher["id"],
        "title": title,
        "type": atype,
        "instructions": body.get("instructions"),
        "ai_marking_enabled": body.get("ai_marking_enabled", True),
        "time_limit_mins": body.get("time_limit_mins"),
        "total_marks": total_marks or body.get("total_marks"),
        "due_date": body.get("due_date"),
        "release_date": body.get("release_date"),
        "is_released": body.get("is_released", False),
    }

    result = make_supabase_request("POST", "assessments", assessment_data, use_service_role=True)
    if not result:
        return jsonify({"error": "Failed to create assessment"}), 500

    assessment_id = result[0]["id"]

    for i, q in enumerate(questions):
        make_supabase_request("POST", "assessment_questions", {
            "assessment_id": assessment_id,
            "question_number": i + 1,
            "question_text": q.get("question_text", ""),
            "question_type": q.get("question_type", "mcq"),
            "options_json": q.get("options_json"),
            "correct_answer": q.get("correct_answer"),
            "marks": q.get("marks", 1),
            "topic_tag": q.get("topic_tag"),
            "explanation": q.get("explanation"),
            "image_url": q.get("image_url"),
        }, use_service_role=True)

    return jsonify({"success": True, "assessment": result[0], "questions_created": len(questions)}), 201


@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/assessments", methods=["GET"])
@teacher_auth_required
def list_assessments(classroom_id):
    assessments = make_supabase_request(
        "GET", "assessments", select="*",
        filters={"classroom_id": f"eq.{classroom_id}"},
        use_service_role=True
    ) or []
    assessments.sort(key=lambda a: a.get("created_at", ""), reverse=True)
    return jsonify({"assessments": assessments})


@teacher_classroom_bp.route("/assessments/<int:assessment_id>", methods=["GET"])
@teacher_auth_required
def get_assessment(assessment_id):
    assessments = make_supabase_request(
        "GET", "assessments", select="*",
        filters={"id": f"eq.{assessment_id}"},
        use_service_role=True
    )
    if not assessments:
        return jsonify({"error": "Assessment not found"}), 404

    questions = make_supabase_request(
        "GET", "assessment_questions", select="*",
        filters={"assessment_id": f"eq.{assessment_id}"},
        use_service_role=True
    ) or []
    questions.sort(key=lambda q: q.get("question_number", 0))

    return jsonify({"assessment": assessments[0], "questions": questions})


@teacher_classroom_bp.route("/assessments/<int:assessment_id>/release", methods=["POST"])
@teacher_auth_required
def release_assessment(assessment_id):
    make_supabase_request(
        "PATCH", "assessments",
        {"is_released": True, "release_date": _now_utc().isoformat(), "updated_at": _now_utc().isoformat()},
        filters={"id": f"eq.{assessment_id}"},
        use_service_role=True
    )
    return jsonify({"success": True, "message": "Assessment released to students"})


@teacher_classroom_bp.route("/assessments/<int:assessment_id>/release-results", methods=["POST"])
@teacher_auth_required
def release_results(assessment_id):
    make_supabase_request(
        "PATCH", "assessments",
        {"results_released": True, "updated_at": _now_utc().isoformat()},
        filters={"id": f"eq.{assessment_id}"},
        use_service_role=True
    )

    subs = make_supabase_request(
        "GET", "student_submissions", select="id",
        filters={"assessment_id": f"eq.{assessment_id}"},
        use_service_role=True
    ) or []
    for s in subs:
        make_supabase_request(
            "PATCH", "student_submissions",
            {"status": "returned", "released_at": _now_utc().isoformat()},
            filters={"id": f"eq.{s['id']}"},
            use_service_role=True
        )

    return jsonify({"success": True, "message": "Results released to students", "submissions_released": len(subs)})


# ═══════════════════════════════════════════════════════════════════════════════
# SUBMISSIONS (teacher view)
# ═══════════════════════════════════════════════════════════════════════════════

@teacher_classroom_bp.route("/assessments/<int:assessment_id>/submissions", methods=["GET"])
@teacher_auth_required
def list_submissions(assessment_id):
    subs = make_supabase_request(
        "GET", "student_submissions", select="*",
        filters={"assessment_id": f"eq.{assessment_id}"},
        use_service_role=True
    ) or []

    enriched = []
    for s in subs:
        student = make_supabase_request(
            "GET", "school_students", select="id,first_name,last_name,student_code,photo_url",
            filters={"id": f"eq.{s['student_id']}"},
            use_service_role=True
        )
        enriched.append({**s, "student": student[0] if student else None})

    return jsonify({"submissions": enriched, "total": len(enriched)})


@teacher_classroom_bp.route("/submissions/<int:submission_id>/review", methods=["PATCH"])
@teacher_auth_required
def review_submission(submission_id):
    body = request.get_json(silent=True) or {}
    teacher_score = body.get("teacher_score")
    teacher_feedback = body.get("teacher_feedback")

    updates = {
        "teacher_reviewed": True,
        "status": "teacher_reviewed",
    }
    if teacher_score is not None:
        updates["teacher_score"] = teacher_score
        updates["final_score"] = teacher_score
    if teacher_feedback:
        updates["teacher_feedback"] = teacher_feedback
    if body.get("final_score") is not None:
        updates["final_score"] = body["final_score"]
    if body.get("final_total") is not None:
        updates["final_total"] = body["final_total"]

    result = make_supabase_request(
        "PATCH", "student_submissions", updates,
        filters={"id": f"eq.{submission_id}"},
        use_service_role=True
    )
    if result is None:
        return jsonify({"error": "Failed to review submission"}), 500
    return jsonify({"success": True, "submission": result[0] if result else None})


# ═══════════════════════════════════════════════════════════════════════════════
# STUDENT SUBMISSIONS (student-facing)
# ═══════════════════════════════════════════════════════════════════════════════

@teacher_classroom_bp.route("/assessments/<int:assessment_id>/submit", methods=["POST"])
def submit_assessment(assessment_id):
    body = request.get_json(silent=True) or {}
    student_id = body.get("student_id")
    answers_json = body.get("answers_json")

    if not student_id:
        return jsonify({"error": "student_id is required"}), 400

    assessments = make_supabase_request(
        "GET", "assessments", select="is_released,due_date",
        filters={"id": f"eq.{assessment_id}"},
        use_service_role=True
    )
    if not assessments or not assessments[0].get("is_released"):
        return jsonify({"error": "Assessment is not available"}), 403

    due = _parse_utc(assessments[0].get("due_date"))
    if due and due < _now_utc():
        return jsonify({"error": "Submission deadline has passed"}), 403

    existing = make_supabase_request(
        "GET", "student_submissions", select="id",
        filters={"assessment_id": f"eq.{assessment_id}", "student_id": f"eq.{student_id}"},
        use_service_role=True
    )
    if existing:
        return jsonify({"error": "Already submitted"}), 409

    result = make_supabase_request("POST", "student_submissions", {
        "assessment_id": assessment_id,
        "student_id": student_id,
        "answers_json": answers_json,
        "attachments": body.get("attachments", []),
        "submitted_at": _now_utc().isoformat(),
        "status": "submitted",
    }, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to submit"}), 500

    questions = make_supabase_request(
        "GET", "assessment_questions", select="question_number,question_type,correct_answer,marks,topic_tag",
        filters={"assessment_id": f"eq.{assessment_id}"},
        use_service_role=True
    ) or []

    auto_score = 0
    auto_total = 0
    auto_feedback = []
    for q in questions:
        qnum = q["question_number"]
        marks = float(q.get("marks", 1))
        auto_total += marks
        student_answer = (answers_json or {}).get(str(qnum))

        if q["question_type"] in ("mcq", "true_false") and q.get("correct_answer"):
            is_correct = str(student_answer).strip().lower() == str(q["correct_answer"]).strip().lower()
            earned = marks if is_correct else 0
            auto_score += earned
            auto_feedback.append({
                "question_number": qnum,
                "correct": is_correct,
                "earned": earned,
                "max": marks,
                "correct_answer": q["correct_answer"],
                "topic_tag": q.get("topic_tag"),
            })

    if auto_feedback:
        make_supabase_request(
            "PATCH", "student_submissions", {
                "ai_score": auto_score,
                "ai_total": auto_total,
                "ai_feedback_json": auto_feedback,
                "status": "ai_marked",
            },
            filters={"id": f"eq.{result[0]['id']}"},
            use_service_role=True
        )

    return jsonify({"success": True, "submission_id": result[0]["id"]}), 201


# ═══════════════════════════════════════════════════════════════════════════════
# AI EXAM GENERATION (placeholder — will integrate DeepSeek/Gemini)
# ═══════════════════════════════════════════════════════════════════════════════

@teacher_classroom_bp.route("/assessments/generate", methods=["POST"])
@teacher_auth_required
def generate_assessment():
    body = request.get_json(silent=True) or {}
    subject = (body.get("subject") or "").strip()
    topic = (body.get("topic") or "").strip()
    question_type = body.get("question_type", "mcq")
    count = body.get("count", 10)
    difficulty = body.get("difficulty", "medium")

    if not subject or not topic:
        return jsonify({"error": "subject and topic are required"}), 400

    try:
        from services.classroom_ai_service import generate_exam_questions
        questions = generate_exam_questions(
            subject=subject,
            topic=topic,
            question_type=question_type,
            count=count,
            difficulty=difficulty,
        )
        return jsonify({"success": True, "questions": questions, "count": len(questions)})
    except ImportError:
        sample_questions = []
        for i in range(min(count, 20)):
            if question_type == "mcq":
                sample_questions.append({
                    "question_number": i + 1,
                    "question_text": f"Sample {subject} question about {topic} #{i+1}",
                    "question_type": "mcq",
                    "options_json": [
                        {"label": "A", "text": "Option A"},
                        {"label": "B", "text": "Option B"},
                        {"label": "C", "text": "Option C"},
                        {"label": "D", "text": "Option D"},
                    ],
                    "correct_answer": "A",
                    "marks": 1,
                    "topic_tag": topic,
                })
            else:
                sample_questions.append({
                    "question_number": i + 1,
                    "question_text": f"Explain the concept of {topic} in {subject}. [{3 * (i+1)} marks]",
                    "question_type": question_type,
                    "marks": 3 * (i + 1),
                    "topic_tag": topic,
                })

        return jsonify({
            "success": True,
            "questions": sample_questions,
            "count": len(sample_questions),
            "note": "AI service not yet configured — returning sample questions",
        })


# ═══════════════════════════════════════════════════════════════════════════════
# CLASS ANALYTICS (teacher view)
# ═══════════════════════════════════════════════════════════════════════════════

@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/schedule", methods=["GET"])
@teacher_auth_required
def get_classroom_schedule(classroom_id):
    timetable = make_supabase_request(
        "GET", "teacher_timetable_entries", select="*",
        filters={"classroom_id": f"eq.{classroom_id}"},
        use_service_role=True
    ) or []
    timetable.sort(key=lambda item: (item.get("weekday", 8), item.get("start_time", "")))

    scheme = make_supabase_request(
        "GET", "teacher_scheme_of_work", select="*",
        filters={"classroom_id": f"eq.{classroom_id}"},
        use_service_role=True
    ) or []
    scheme.sort(key=lambda item: (item.get("due_date") or "9999-12-31", item.get("created_at", "")))

    return jsonify({
        "timetable": timetable,
        "scheme_of_work": scheme,
    })


@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/schedule/timetable", methods=["POST"])
@teacher_auth_required
def create_timetable_entry(classroom_id):
    teacher = request.teacher
    body = request.get_json(silent=True) or {}
    title = (body.get("title") or "").strip()
    weekday = body.get("weekday")
    start_time = (body.get("start_time") or "").strip()
    end_time = (body.get("end_time") or "").strip()

    if not title or weekday is None or not start_time or not end_time:
        return jsonify({"error": "title, weekday, start_time and end_time are required"}), 400

    result = make_supabase_request("POST", "teacher_timetable_entries", {
        "classroom_id": classroom_id,
        "teacher_id": teacher["id"],
        "title": title,
        "weekday": weekday,
        "start_time": start_time,
        "end_time": end_time,
        "room": body.get("room"),
        "cadence": body.get("cadence") or "weekly",
        "notes": body.get("notes"),
    }, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to create timetable entry"}), 500
    return jsonify({"success": True, "entry": result[0]}), 201


@teacher_classroom_bp.route("/schedule/timetable/<int:entry_id>", methods=["PATCH"])
@teacher_auth_required
def update_timetable_entry(entry_id):
    body = request.get_json(silent=True) or {}
    allowed = ["title", "weekday", "start_time", "end_time", "room", "cadence", "notes"]
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return jsonify({"error": "No fields to update"}), 400

    updates["updated_at"] = _now_utc().isoformat()
    result = make_supabase_request(
        "PATCH", "teacher_timetable_entries", updates,
        filters={"id": f"eq.{entry_id}"},
        use_service_role=True
    )
    if result is None:
        return jsonify({"error": "Failed to update timetable entry"}), 500
    return jsonify({"success": True, "entry": result[0] if result else None})


@teacher_classroom_bp.route("/schedule/timetable/<int:entry_id>", methods=["DELETE"])
@teacher_auth_required
def delete_timetable_entry(entry_id):
    make_supabase_request(
        "DELETE", "teacher_timetable_entries",
        filters={"id": f"eq.{entry_id}"},
        use_service_role=True
    )
    return jsonify({"success": True})


@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/students/<int:student_id>/workspace", methods=["GET"])
@teacher_auth_required
def get_student_workspace_preview(classroom_id, student_id):
    classroom, class_subject, subject, cls = _get_classroom_context(classroom_id)
    if not classroom or not class_subject:
        return jsonify({"error": "Classroom not found"}), 404

    student_rows = make_supabase_request(
        "GET", "school_students", select="id,first_name,last_name,student_code,photo_url,class_id",
        filters={"id": f"eq.{student_id}"},
        use_service_role=True
    ) or []
    if not student_rows:
        return jsonify({"error": "Student not found"}), 404

    student = student_rows[0]
    if student.get("class_id") != class_subject.get("class_id"):
        return jsonify({"error": "Student does not belong to this classroom"}), 403

    posts = make_supabase_request(
        "GET", "classroom_posts", select="*",
        filters={"classroom_id": f"eq.{classroom_id}"},
        use_service_role=True
    ) or []
    visible_posts = [post for post in posts if _is_post_visible(post)]
    visible_posts.sort(key=lambda item: item.get("created_at", ""), reverse=True)

    assessments = make_supabase_request(
        "GET", "assessments", select="*",
        filters={"classroom_id": f"eq.{classroom_id}", "is_released": "eq.true"},
        use_service_role=True
    ) or []
    assessments.sort(key=lambda item: item.get("created_at", ""), reverse=True)

    workspace_assessments = []
    for assessment in assessments:
        subs = make_supabase_request(
            "GET", "student_submissions", select="*",
            filters={"assessment_id": f"eq.{assessment['id']}", "student_id": f"eq.{student_id}"},
            use_service_role=True
        ) or []
        workspace_assessments.append({
            "assessment": assessment,
            "submission": subs[0] if subs else None,
        })

    return jsonify({
        "student": {
            "id": student["id"],
            "first_name": student.get("first_name"),
            "last_name": student.get("last_name"),
            "student_code": student.get("student_code"),
            "photo_url": student.get("photo_url"),
            "class_name": cls.get("display_name") if cls else None,
            "subject_name": subject.get("name") if subject else None,
        },
        "posts": visible_posts,
        "assessments": workspace_assessments,
    })


@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/schedule/scheme", methods=["POST"])
@teacher_auth_required
def create_scheme_item(classroom_id):
    teacher = request.teacher
    body = request.get_json(silent=True) or {}
    week_label = (body.get("week_label") or "").strip()
    topic = (body.get("topic") or "").strip()
    if not week_label or not topic:
        return jsonify({"error": "week_label and topic are required"}), 400

    result = make_supabase_request("POST", "teacher_scheme_of_work", {
        "classroom_id": classroom_id,
        "teacher_id": teacher["id"],
        "week_label": week_label,
        "topic": topic,
        "objectives": body.get("objectives"),
        "activities": body.get("activities"),
        "homework": body.get("homework"),
        "due_date": body.get("due_date"),
        "ai_notes": body.get("ai_notes"),
        "status": body.get("status") or "planned",
    }, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to create scheme item"}), 500
    return jsonify({"success": True, "item": result[0]}), 201


@teacher_classroom_bp.route("/schedule/scheme/<int:item_id>", methods=["PATCH"])
@teacher_auth_required
def update_scheme_item(item_id):
    body = request.get_json(silent=True) or {}
    allowed = ["week_label", "topic", "objectives", "activities", "homework", "due_date", "ai_notes", "status"]
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return jsonify({"error": "No fields to update"}), 400

    updates["updated_at"] = _now_utc().isoformat()
    result = make_supabase_request(
        "PATCH", "teacher_scheme_of_work", updates,
        filters={"id": f"eq.{item_id}"},
        use_service_role=True
    )
    if result is None:
        return jsonify({"error": "Failed to update scheme item"}), 500
    return jsonify({"success": True, "item": result[0] if result else None})


@teacher_classroom_bp.route("/schedule/scheme/<int:item_id>", methods=["DELETE"])
@teacher_auth_required
def delete_scheme_item(item_id):
    make_supabase_request(
        "DELETE", "teacher_scheme_of_work",
        filters={"id": f"eq.{item_id}"},
        use_service_role=True
    )
    return jsonify({"success": True})


@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/schedule/ai-suggest", methods=["POST"])
@teacher_auth_required
def ai_suggest_scheme_item(classroom_id):
    body = request.get_json(silent=True) or {}
    topic = (body.get("topic") or "").strip()
    week_label = (body.get("week_label") or "").strip()
    subject = (body.get("subject") or "").strip()
    if not topic or not week_label:
        return jsonify({"error": "topic and week_label are required"}), 400

    try:
        from services.classroom_ai_service import _call_ai
        import json as _json

        prompt = (
            f"Generate a Zimbabwean teacher scheme-of-work entry.\n"
            f"Subject: {subject or 'General'}\n"
            f"Topic: {topic}\n"
            f"Week label: {week_label}\n\n"
            f"Return strict JSON with keys: objectives, activities, homework, ai_notes."
        )
        response = _call_ai(prompt, system="You are a professional Zimbabwean teacher planner. Return only JSON.", max_tokens=700, json_mode=True)
        cleaned = response.strip().replace("```json", "").replace("```", "").strip()
        payload = _json.loads(cleaned)
        return jsonify({"success": True, "suggestion": payload})
    except Exception as exc:
        logger.warning("AI scheme suggestion failed for classroom %s: %s", classroom_id, exc)
        return jsonify({
            "success": True,
            "suggestion": {
                "objectives": f"Cover the core learning points for {topic}.",
                "activities": f"Teacher exposition, guided examples, pair discussion, and exit quiz on {topic}.",
                "homework": f"Complete a short written task on {topic} and submit before the next lesson.",
                "ai_notes": "Vertex suggestion fallback used because live planning generation was unavailable.",
            },
            "note": "AI planning fallback returned",
        })


@teacher_classroom_bp.route("/classrooms/<int:classroom_id>/analytics", methods=["GET"])
@teacher_auth_required
def classroom_analytics(classroom_id):
    cr = make_supabase_request(
        "GET", "ai_classrooms", select="class_subject_id",
        filters={"id": f"eq.{classroom_id}"},
        use_service_role=True
    )
    if not cr:
        return jsonify({"error": "Classroom not found"}), 404

    cs = make_supabase_request(
        "GET", "class_subjects", select="class_id,subject_id",
        filters={"id": f"eq.{cr[0]['class_subject_id']}"},
        use_service_role=True
    )
    if not cs:
        return jsonify({"error": "Class subject not found"}), 404

    class_id = cs[0]["class_id"]
    subject_id = cs[0]["subject_id"]

    students = make_supabase_request(
        "GET", "school_students", select="id,first_name,last_name,student_code",
        filters={"class_id": f"eq.{class_id}"},
        use_service_role=True
    ) or []

    student_stats = []
    for st in students:
        perf = make_supabase_request(
            "GET", "student_performance", select="accuracy_pct,topic_tag,improvement_trend",
            filters={"student_id": f"eq.{st['id']}", "subject_id": f"eq.{subject_id}"},
            use_service_role=True
        ) or []

        avg_accuracy = 0
        if perf:
            avg_accuracy = round(sum(float(p.get("accuracy_pct", 0)) for p in perf) / len(perf), 1)

        badge = "At Risk"
        if avg_accuracy >= 80:
            badge = "Excellent"
        elif avg_accuracy >= 60:
            badge = "Good"
        elif avg_accuracy >= 40:
            badge = "Needs Help"

        student_stats.append({
            "student_id": st["id"],
            "name": f"{st['first_name']} {st['last_name']}",
            "student_code": st["student_code"],
            "average_accuracy": avg_accuracy,
            "badge": badge,
            "topics_assessed": len(perf),
        })

    student_stats.sort(key=lambda s: s["average_accuracy"], reverse=True)
    class_avg = round(sum(s["average_accuracy"] for s in student_stats) / len(student_stats), 1) if student_stats else 0

    return jsonify({
        "class_average": class_avg,
        "total_students": len(student_stats),
        "students": student_stats,
        "badge_distribution": {
            "Excellent": sum(1 for s in student_stats if s["badge"] == "Excellent"),
            "Good": sum(1 for s in student_stats if s["badge"] == "Good"),
            "Needs Help": sum(1 for s in student_stats if s["badge"] == "Needs Help"),
            "At Risk": sum(1 for s in student_stats if s["badge"] == "At Risk"),
        }
    })
