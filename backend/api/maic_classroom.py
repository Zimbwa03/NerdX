"""
MAIC AI Classroom API — /api/mobile/classroom/*
"""
import json
import logging
import threading
import uuid
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, g, Response, stream_with_context

from database import external_db as ext_db
from database.external_db import get_user_credits, make_supabase_request
from services.advanced_credit_service import advanced_credit_service
from services import maic_classroom_service as maic

logger = logging.getLogger(__name__)

maic_classroom_bp = Blueprint("maic_classroom", __name__)

_START_JOB_LOCK = threading.Lock()
_START_JOB_TTL = timedelta(minutes=30)
_START_JOBS = {}


def _utc_now():
    return datetime.now(timezone.utc)


def _utc_now_iso():
    return _utc_now().isoformat()


def _prune_start_jobs():
    cutoff = _utc_now() - _START_JOB_TTL
    stale = []
    with _START_JOB_LOCK:
        for jid, job in _START_JOBS.items():
            updated = job.get("updated_at")
            try:
                updated_dt = datetime.fromisoformat(str(updated)) if updated else _utc_now()
            except Exception:
                updated_dt = _utc_now()
            if updated_dt < cutoff:
                stale.append(jid)
        for jid in stale:
            _START_JOBS.pop(jid, None)


def _upsert_start_job(job_id, **updates):
    with _START_JOB_LOCK:
        row = _START_JOBS.get(job_id, {"id": job_id, "created_at": _utc_now_iso()})
        row.update(updates)
        row["updated_at"] = _utc_now_iso()
        _START_JOBS[job_id] = row
        return dict(row)


def _get_start_job(job_id):
    with _START_JOB_LOCK:
        row = _START_JOBS.get(job_id)
        return dict(row) if row else None


def _public_start_job(row):
    return {
        "job_id": row.get("id"),
        "status": row.get("status"),
        "message": row.get("message"),
        "data": row.get("data"),
        "credits_remaining": row.get("credits_remaining"),
        "created_at": row.get("created_at"),
        "updated_at": row.get("updated_at"),
    }


def _import_mobile_helpers():
    from api.mobile import (
        require_auth,
        _credits_display,
        _get_student_first_name,
        _credits_text,
    )

    return require_auth, _credits_display, _get_student_first_name, _credits_text


require_auth, _credits_display, _get_student_first_name, _credits_text = _import_mobile_helpers()


def _run_start_flow(user_id, subject, topic, form_level):
    if not ext_db.SUPABASE_URL or not ext_db.SUPABASE_SERVICE_ROLE_KEY:
        return {
            "ok": False,
            "status": 503,
            "message": "AI Classroom storage is not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY on the server).",
        }

    credit_cost = advanced_credit_service.get_credit_cost("maic_classroom_start")
    user_credits = get_user_credits(user_id) or 0
    if user_credits <= 0:
        return {
            "ok": False,
            "status": 402,
            "message": "Access denied. You have 0 credits. AI Classroom requires credits.",
        }
    if user_credits < credit_cost:
        return {
            "ok": False,
            "status": 402,
            "message": f"Insufficient credits. Required: {_credits_text(credit_cost)}",
        }

    credit_result = advanced_credit_service.check_and_deduct_credits(
        user_id, "maic_classroom_start"
    )
    if not credit_result.get("success"):
        return {
            "ok": False,
            "status": 402,
            "message": credit_result.get("message", "Insufficient credits."),
            "credits_remaining": _credits_display(credit_result.get("current_credits", 0)),
        }

    try:
        rag = maic.build_full_rag_context(subject, topic or subject, form_level)
        outline = maic.generate_lesson_outline(subject, topic or subject, form_level, rag)
    except Exception:
        logger.exception("maic_start outline/rag step failed; using stub + default outline")
        rag = maic._rag_stub(subject, topic or subject, form_level)
        outline = maic.generate_lesson_outline(subject, topic or subject, form_level, rag)

    session_id = maic.create_session_record(
        user_id,
        subject,
        topic or subject,
        form_level,
        outline,
        rag,
    )
    if not session_id:
        try:
            advanced_credit_service.refund_credits(
                str(user_id),
                int(credit_cost),
                "maic_classroom_start session insert failed",
            )
        except Exception:
            logger.exception("maic_start: refund after failed session insert")
        return {
            "ok": False,
            "status": 500,
            "message": (
                "Could not save the classroom session. "
                "Apply database/migrations/004_maic_classroom.sql in Supabase if you have not, "
                "then retry. Your start credit was refunded."
            ),
        }

    maic.bump_credits_used(session_id, user_id, int(credit_cost))
    return {
        "ok": True,
        "status": 200,
        "data": {
            "session_id": session_id,
            "lesson_outline": outline,
            "stage": maic.STAGE_INTRO,
        },
        "credits_remaining": _credits_display(credit_result.get("new_balance", 0)),
    }


def _run_start_job(job_id, user_id, subject, topic, form_level):
    _upsert_start_job(
        job_id,
        status="working",
        message="Preparing lesson outline and classroom context...",
    )
    try:
        result = _run_start_flow(user_id, subject, topic, form_level)
        if result.get("ok"):
            _upsert_start_job(
                job_id,
                status="succeeded",
                message="Classroom session is ready.",
                data=result.get("data"),
                credits_remaining=result.get("credits_remaining"),
            )
            return
        _upsert_start_job(
            job_id,
            status="failed",
            message=result.get("message") or "Could not start session.",
            credits_remaining=result.get("credits_remaining"),
        )
    except Exception:
        logger.exception("maic_start_job failed")
        _upsert_start_job(
            job_id,
            status="failed",
            message="Unexpected error while preparing the classroom session.",
        )


@maic_classroom_bp.route("/start", methods=["POST"])
@require_auth
def maic_start():
    try:
        body = request.get_json() or {}
        subject = (body.get("subject") or "").strip()
        topic = (body.get("topic") or "").strip()
        form_level = (body.get("form_level") or body.get("grade_level") or "").strip()

        if not subject or not form_level:
            return jsonify({"success": False, "message": "subject and form_level are required"}), 400

        result = _run_start_flow(g.current_user_id, subject, topic or subject, form_level)
        if not result.get("ok"):
            payload = {
                "success": False,
                "message": result.get("message") or "Could not start session.",
            }
            if result.get("credits_remaining") is not None:
                payload["credits_remaining"] = result.get("credits_remaining")
            return jsonify(payload), int(result.get("status") or 500)

        return jsonify(
            {
                "success": True,
                "data": result.get("data"),
                "credits_remaining": result.get("credits_remaining"),
            }
        ), 200
    except Exception as ex:
        logger.exception("maic_start failed")
        return jsonify({"success": False, "message": str(ex)}), 500


@maic_classroom_bp.route("/start-job", methods=["POST"])
@require_auth
def maic_start_job():
    try:
        body = request.get_json() or {}
        subject = (body.get("subject") or "").strip()
        topic = (body.get("topic") or "").strip()
        form_level = (body.get("form_level") or body.get("grade_level") or "").strip()

        if not subject or not form_level:
            return jsonify({"success": False, "message": "subject and form_level are required"}), 400

        _prune_start_jobs()
        job_id = str(uuid.uuid4())
        _upsert_start_job(
            job_id,
            user_id=str(g.current_user_id),
            status="queued",
            message="Queued. Preparing classroom session...",
        )

        t = threading.Thread(
            target=_run_start_job,
            args=(job_id, g.current_user_id, subject, topic or subject, form_level),
            daemon=True,
        )
        t.start()

        return jsonify(
            {
                "success": True,
                "data": {
                    "job_id": job_id,
                    "status": "queued",
                    "message": "Queued. Preparing classroom session...",
                },
            }
        ), 202
    except Exception as ex:
        logger.exception("maic_start_job failed")
        return jsonify({"success": False, "message": str(ex)}), 500


@maic_classroom_bp.route("/start-job/<job_id>", methods=["GET"])
@require_auth
def maic_start_job_status(job_id):
    try:
        _prune_start_jobs()
        row = _get_start_job(job_id)
        if not row or str(row.get("user_id")) != str(g.current_user_id):
            return jsonify({"success": False, "message": "Job not found"}), 404
        return jsonify({"success": True, "data": _public_start_job(row)}), 200
    except Exception as ex:
        logger.exception("maic_start_job_status failed")
        return jsonify({"success": False, "message": str(ex)}), 500


@maic_classroom_bp.route("/stream", methods=["POST"])
@require_auth
def maic_stream():
    try:
        body = request.get_json() or {}
        session_id = (body.get("session_id") or "").strip()
        action = (body.get("action") or "next_segment").strip()

        if not session_id:
            return jsonify({"success": False, "message": "session_id required"}), 400
        if action != "next_segment":
            return jsonify({"success": False, "message": "Unsupported action"}), 400

        sess = maic.fetch_session(session_id, g.current_user_id)
        if not sess:
            return jsonify({"success": False, "message": "Session not found"}), 404

        stage = sess.get("stage") or maic.STAGE_INTRO

        if stage == maic.STAGE_COMPLETE:
            return jsonify({"success": False, "message": "Session already completed"}), 400

        credit_cost = advanced_credit_service.get_credit_cost("maic_classroom_stream")
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify(
                {
                    "success": False,
                    "message": f"Insufficient credits. Required: {_credits_text(credit_cost)}",
                }
            ), 402

        credit_result = advanced_credit_service.check_and_deduct_credits(
            g.current_user_id, "maic_classroom_stream"
        )
        if not credit_result.get("success"):
            return jsonify(
                {
                    "success": False,
                    "message": credit_result.get("message", "Insufficient credits."),
                    "credits_remaining": _credits_display(credit_result.get("current_credits", 0)),
                }
            ), 402

        maic.bump_credits_used(session_id, g.current_user_id, int(credit_cost))
        credits_remaining = _credits_display(credit_result.get("new_balance", 0))

        subject = sess.get("subject") or ""
        topic = sess.get("topic") or ""
        form_level = sess.get("form_level") or ""
        rag = (sess.get("rag_context_stub") or "") + "\n" + maic._rag_stub(subject, topic, form_level)
        outline = sess.get("lesson_outline")
        student_name = _get_student_first_name(str(g.current_user_id))
        messages = maic.list_session_messages(session_id, g.current_user_id)

        def sse_event(obj):
            return f"data: {json.dumps(obj, ensure_ascii=False)}\n\n"

        def generate():
            nonlocal sess, stage, messages
            try:
                yield sse_event(
                    {
                        "sender": "system",
                        "type": "start",
                        "credits_remaining": credits_remaining,
                    }
                )

                if stage == maic.STAGE_QUIZ:
                    snapshot = sess.get("quiz_snapshot")
                    if not snapshot:
                        transcript = maic._messages_for_prompt(messages)
                        questions = maic.generate_quiz_snapshot(
                            subject, topic, form_level, rag, transcript
                        )
                        if not questions:
                            questions = [
                                {
                                    "id": "q1",
                                    "type": "short",
                                    "question": f"In one paragraph, explain a key idea from {topic}.",
                                    "rubric": "definitions, example, ZIMSEC keywords",
                                }
                            ]
                        snapshot = questions
                        maic.patch_session(
                            session_id,
                            g.current_user_id,
                            {"quiz_snapshot": snapshot},
                        )
                    yield sse_event({"sender": "teacher", "type": "quiz", "questions": snapshot})
                    yield sse_event({"sender": "teacher", "type": "end", "credits_remaining": credits_remaining})
                    yield sse_event({"type": "done"})
                    return

                if stage == maic.STAGE_COMPLETE:
                    yield sse_event({"type": "done"})
                    return

                extra = ""
                if stage == maic.STAGE_INTRO:
                    extra = f"Lesson outline (JSON): {json.dumps(outline, ensure_ascii=False)[:2000]}\nDeliver a warm intro and preview the objectives."
                elif stage == maic.STAGE_CONCEPT:
                    n = int(sess.get("concepts_done") or 0) + 1
                    extra = f"This is concept segment {n} of {maic.CONCEPT_SEGMENTS}. Teach one focused idea with an example."
                elif stage == maic.STAGE_REVIEW:
                    extra = "Briefly review what we covered and praise effort. Keep it short."
                elif stage == maic.STAGE_SUMMARY:
                    extra = "Give a concise summary the student can use for revision (bullet summary)."

                yield sse_event({"sender": "teacher", "type": "start"})

                teacher_chunks = []
                if stage in (maic.STAGE_INTRO, maic.STAGE_CONCEPT, maic.STAGE_REVIEW, maic.STAGE_SUMMARY):
                    stream_it = maic.stream_teacher_segment(
                        student_name,
                        subject,
                        topic,
                        form_level,
                        stage,
                        rag,
                        messages,
                        extra_user_instruction=extra,
                    )
                    for token in stream_it:
                        teacher_chunks.append(token)
                        yield sse_event(
                            {"sender": "teacher", "type": "token", "content": token}
                        )
                teacher_text = "".join(teacher_chunks).strip()
                if not teacher_text:
                    teacher_text = maic._call_teacher_text(
                        student_name,
                        subject,
                        topic,
                        form_level,
                        stage,
                        rag,
                        messages,
                        extra_user_instruction=extra,
                    )
                    yield sse_event(
                        {"sender": "teacher", "type": "token", "content": teacher_text}
                    )

                plain_teacher, _boards = maic.insert_teacher_turn(session_id, teacher_text)

                yield sse_event({"sender": "teacher", "type": "end"})

                merged = dict(sess)
                merged["stage"] = stage
                nxt = maic.advance_after_stream(merged)

                patch_body = {
                    "stage": nxt["stage"],
                    "concepts_done": nxt["concepts_done"],
                }
                if stage == maic.STAGE_SUMMARY:
                    patch_body["summary_text"] = plain_teacher
                    patch_body["completed_at"] = maic._now_iso()
                    patch_body["stage"] = maic.STAGE_COMPLETE
                    qrows = make_supabase_request(
                        "GET",
                        maic.TABLE_QUIZ,
                        select="score",
                        filters={"session_id": f"eq.{session_id}"},
                        limit=1,
                        use_service_role=True,
                    )
                    last_score = None
                    if qrows and isinstance(qrows, list) and qrows:
                        try:
                            last_score = float(qrows[0].get("score"))
                        except (TypeError, ValueError):
                            last_score = None
                    maic.upsert_progress(
                        g.current_user_id,
                        subject,
                        topic,
                        form_level,
                        quiz_score=last_score,
                    )
                elif nxt["stage"] == maic.STAGE_COMPLETE and stage != maic.STAGE_SUMMARY:
                    patch_body["completed_at"] = maic._now_iso()

                maic.patch_session(session_id, g.current_user_id, patch_body)

                classmate_stages = (maic.STAGE_INTRO, maic.STAGE_CONCEPT)
                if stage in classmate_stages and plain_teacher.strip():
                    cq = maic.classmate_question(plain_teacher, topic, form_level)
                    maic.insert_message(session_id, "classmate", cq, "text")
                    yield sse_event(
                        {"sender": "classmate", "type": "message", "content": cq}
                    )

                note_stages = (
                    maic.STAGE_INTRO,
                    maic.STAGE_CONCEPT,
                    maic.STAGE_REVIEW,
                    maic.STAGE_SUMMARY,
                )
                if stage in note_stages and plain_teacher.strip():
                    note = maic.classmate_notes(plain_teacher, topic, form_level)
                    if note and note.strip():
                        maic.insert_message(
                            session_id,
                            "classmate",
                            f"[NOTE_TAKER] {note.strip()}",
                            "text",
                        )
                        yield sse_event(
                            {
                                "sender": "note_taker",
                                "type": "note",
                                "content": note.strip(),
                            }
                        )

                yield sse_event(
                    {
                        "sender": "system",
                        "type": "stage",
                        "stage": nxt["stage"],
                        "credits_remaining": credits_remaining,
                    }
                )
                yield sse_event({"type": "done"})
            except Exception as ex:
                logger.exception("maic_stream generate failed")
                yield sse_event({"type": "error", "message": str(ex)})

        return Response(
            stream_with_context(generate()),
            mimetype="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )
    except Exception as e:
        logger.exception("maic_stream failed")
        return jsonify({"success": False, "message": str(e)}), 500


@maic_classroom_bp.route("/message", methods=["POST"])
@require_auth
def maic_message():
    try:
        body = request.get_json() or {}
        session_id = (body.get("session_id") or "").strip()
        content = (body.get("content") or body.get("message") or "").strip()

        if not session_id or not content:
            return jsonify({"success": False, "message": "session_id and content required"}), 400

        sess = maic.fetch_session(session_id, g.current_user_id)
        if not sess:
            return jsonify({"success": False, "message": "Session not found"}), 404

        credit_result = advanced_credit_service.check_and_deduct_credits(
            g.current_user_id, "maic_classroom_message"
        )
        if not credit_result.get("success"):
            return jsonify(
                {
                    "success": False,
                    "message": credit_result.get("message", "Insufficient credits."),
                    "credits_remaining": _credits_display(credit_result.get("current_credits", 0)),
                }
            ), 402

        maic.bump_credits_used(session_id, g.current_user_id, int(advanced_credit_service.get_credit_cost("maic_classroom_message")))

        subject = sess.get("subject") or ""
        topic = sess.get("topic") or ""
        form_level = sess.get("form_level") or ""
        stage = sess.get("stage") or maic.STAGE_CONCEPT
        rag = (sess.get("rag_context_stub") or "") + "\n" + maic._rag_stub(subject, topic, form_level)
        student_name = _get_student_first_name(str(g.current_user_id))
        messages = maic.list_session_messages(session_id, g.current_user_id)

        maic.insert_message(session_id, "student", content, "text")
        messages = maic.list_session_messages(session_id, g.current_user_id)

        reply = maic._call_teacher_text(
            student_name,
            subject,
            topic,
            form_level,
            stage,
            rag,
            messages,
            extra_user_instruction=f"The student just asked: {content}\nAnswer helpfully and keep them on track for ZIMSEC.",
        )
        plain_reply, reply_boards = maic.insert_teacher_turn(session_id, reply)

        return jsonify(
            {
                "success": True,
                "data": {
                    "response": plain_reply,
                    "whiteboards": reply_boards,
                    "session_id": session_id,
                    "stage": stage,
                },
                "credits_remaining": _credits_display(credit_result.get("new_balance", 0)),
            }
        ), 200
    except Exception as e:
        logger.exception("maic_message failed")
        return jsonify({"success": False, "message": str(e)}), 500


@maic_classroom_bp.route("/<session_id>/quiz/submit", methods=["POST"])
@require_auth
def maic_quiz_submit(session_id):
    try:
        body = request.get_json() or {}
        answers = body.get("answers")
        if answers is None or not isinstance(answers, dict):
            return jsonify({"success": False, "message": "answers object required"}), 400

        sess = maic.fetch_session(session_id, g.current_user_id)
        if not sess:
            return jsonify({"success": False, "message": "Session not found"}), 404

        if sess.get("stage") != maic.STAGE_QUIZ:
            return jsonify({"success": False, "message": "Quiz not active for this session"}), 400

        questions = sess.get("quiz_snapshot") or []
        if not questions:
            return jsonify({"success": False, "message": "No quiz loaded — run stream segment first"}), 400

        credit_result = advanced_credit_service.check_and_deduct_credits(
            g.current_user_id, "maic_classroom_quiz"
        )
        if not credit_result.get("success"):
            return jsonify(
                {
                    "success": False,
                    "message": credit_result.get("message", "Insufficient credits."),
                    "credits_remaining": _credits_display(credit_result.get("current_credits", 0)),
                }
            ), 402

        maic.bump_credits_used(session_id, g.current_user_id, int(advanced_credit_service.get_credit_cost("maic_classroom_quiz")))

        subject = sess.get("subject") or ""
        topic = sess.get("topic") or ""
        form_level = sess.get("form_level") or ""

        score, feedback = maic.grade_quiz_attempt(subject, topic, form_level, questions, answers)

        sid_int = maic._student_id_int(g.current_user_id)
        make_supabase_request(
            "POST",
            maic.TABLE_QUIZ,
            {
                "session_id": session_id,
                "student_id": sid_int,
                "questions": questions,
                "answers": answers,
                "score": score,
                "feedback": feedback,
            },
            use_service_role=True,
        )

        maic.patch_session(
            session_id,
            g.current_user_id,
            {"stage": maic.STAGE_REVIEW},
        )

        return jsonify(
            {
                "success": True,
                "data": {
                    "score": score,
                    "feedback": feedback,
                    "session_id": session_id,
                    "stage": maic.STAGE_REVIEW,
                },
                "credits_remaining": _credits_display(credit_result.get("new_balance", 0)),
            }
        ), 200
    except Exception as e:
        logger.exception("maic_quiz_submit failed")
        return jsonify({"success": False, "message": str(e)}), 500


@maic_classroom_bp.route("/<session_id>/summary", methods=["GET"])
@require_auth
def maic_summary(session_id):
    sess = maic.fetch_session(session_id, g.current_user_id)
    if not sess:
        return jsonify({"success": False, "message": "Session not found"}), 404
    return jsonify(
        {
            "success": True,
            "data": {
                "summary": sess.get("summary_text") or "",
                "stage": sess.get("stage"),
            },
        }
    ), 200


@maic_classroom_bp.route("/<session_id>/playback", methods=["GET"])
@require_auth
def maic_playback(session_id):
    sess = maic.fetch_session(session_id, g.current_user_id)
    if not sess:
        return jsonify({"success": False, "message": "Session not found"}), 404
    messages = maic.list_session_messages(session_id, g.current_user_id)
    return jsonify({"success": True, "data": {"session": sess, "messages": messages}}), 200


@maic_classroom_bp.route("/history", methods=["GET"])
@require_auth
def maic_history():
    sid = maic._student_id_int(g.current_user_id)
    rows = make_supabase_request(
        "GET",
        maic.TABLE_SESSIONS,
        select="id,subject,topic,form_level,stage,started_at,completed_at,credits_used",
        filters={"student_id": f"eq.{sid}"},
        limit=80,
        use_service_role=True,
    )
    if not rows:
        rows = []
    if isinstance(rows, list):
        rows.sort(key=lambda x: x.get("started_at") or "", reverse=True)
    return jsonify({"success": True, "data": rows}), 200


@maic_classroom_bp.route("/<session_id>", methods=["DELETE"])
@require_auth
def maic_delete_session(session_id):
    sess = maic.fetch_session(session_id, g.current_user_id)
    if not sess:
        return jsonify({"success": True}), 200
    maic.patch_session(
        session_id,
        g.current_user_id,
        {"completed_at": maic._now_iso(), "stage": maic.STAGE_COMPLETE},
    )
    return jsonify({"success": True}), 200
