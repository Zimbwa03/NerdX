"""
NerdX AI Teacher Classroom API v2.0
Neuronet AI Solutions (Pvt) Ltd

Handles: Classroom posts, assessments, student submissions,
         AI exam generation, AI marking triggers, results release.
All endpoints prefixed with /api/v2/ (registered in routes.py).
"""
import logging
from datetime import datetime, timezone
from functools import wraps
from flask import Blueprint, request, jsonify
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
    cr = make_supabase_request(
        "GET", "ai_classrooms", select="*",
        filters={"id": f"eq.{classroom_id}"},
        use_service_role=True
    )
    if not cr:
        return jsonify({"error": "Classroom not found"}), 404

    classroom = cr[0]
    cs = make_supabase_request(
        "GET", "class_subjects", select="*",
        filters={"id": f"eq.{classroom['class_subject_id']}"},
        use_service_role=True
    )
    class_subject = cs[0] if cs else None

    subject = teacher = cls = None
    if class_subject:
        s = make_supabase_request("GET", "school_subjects", select="*",
                                  filters={"id": f"eq.{class_subject['subject_id']}"}, use_service_role=True)
        subject = s[0] if s else None
        t = make_supabase_request("GET", "school_teachers", select="id,first_name,last_name,photo_url,specialisation",
                                  filters={"id": f"eq.{class_subject['teacher_id']}"}, use_service_role=True)
        teacher = t[0] if t else None
        c = make_supabase_request("GET", "school_classes", select="id,display_name,form_id",
                                  filters={"id": f"eq.{class_subject['class_id']}"}, use_service_role=True)
        cls = c[0] if c else None

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
