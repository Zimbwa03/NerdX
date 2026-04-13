"""
NerdX Streaming API
====================
Endpoints:
  POST /api/questions/stream   — SSE stream of an AI-generated question
  GET  /api/jobs/<task_id>/status — Poll a background Celery task

Server-Sent Events format:
  data: {"chunk": "The question te..."}\n\n
  data: {"chunk": "xt continues..."}\n\n
  data: {"done": true, "latency_ms": 1234, "cached": false}\n\n

On error:
  data: {"error": "description"}\n\n

Frontend usage (JavaScript):
  const src = new EventSource('/api/questions/stream', {method: 'POST', ...});
  // or fetch() with ReadableStream
"""

import json
import time
import logging
from flask import Blueprint, Response, jsonify, request, stream_with_context
from services.ai_service import generate_question_streamed
from services.dkt_service_compat import get_recommended_difficulty

logger = logging.getLogger(__name__)

stream_bp = Blueprint('stream', __name__, url_prefix='/api')


@stream_bp.route('/questions/stream', methods=['POST'])
def stream_question():
    """
    Stream a generated question to the client via Server-Sent Events.

    Request JSON:
      subject       (str)  required  — e.g. "Mathematics"
      topic         (str)  required  — e.g. "Quadratic Functions"
      question_type (str)  optional  — "mcq" | "structured" | "essay"  (default: "mcq")
      difficulty    (str)  optional  — "easy" | "medium" | "difficult"
                                       (omit to let DKT auto-select)
      student_id    (str)  optional  — used for DKT difficulty recommendation
      task_type     (str)  optional  — override model routing key
    """
    data          = request.get_json(silent=True) or {}
    subject       = data.get('subject', '')
    topic         = data.get('topic', '')
    question_type = data.get('question_type', 'mcq')
    difficulty    = data.get('difficulty')
    student_id    = data.get('student_id', 'anonymous')
    task_type     = data.get('task_type')

    if not subject or not topic:
        return jsonify({'error': 'subject and topic are required'}), 400

    # DKT auto-select difficulty when caller omits it
    if not difficulty:
        try:
            difficulty = get_recommended_difficulty(student_id, subject, topic)
        except Exception:
            difficulty = 'medium'

    def generate():
        start = time.time()
        try:
            for chunk in generate_question_streamed(
                subject=subject,
                topic=topic,
                difficulty=difficulty,
                question_type=question_type,
                student_id=student_id,
                task_type=task_type,
            ):
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"

            latency_ms = int((time.time() - start) * 1000)
            yield f"data: {json.dumps({'done': True, 'latency_ms': latency_ms})}\n\n"

        except Exception as exc:
            logger.error(f"Stream error for {subject}/{topic}: {exc}")
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream',
        headers={
            'Cache-Control':    'no-cache',
            'X-Accel-Buffering': 'no',   # Disable nginx response buffering
        },
    )


@stream_bp.route('/jobs/<task_id>/status', methods=['GET'])
def get_job_status(task_id: str):
    """
    Poll the status of a background Celery task.

    Response states:
      {"status": "pending"}
      {"status": "progress", "meta": {...}}
      {"status": "success",  "result": {...}}
      {"status": "failure",  "error": "..."}
    """
    try:
        from services.task_queue import celery_app
        if celery_app is None:
            return jsonify({'status': 'unavailable', 'reason': 'task queue not configured'}), 503

        from celery.result import AsyncResult
        result = AsyncResult(task_id, app=celery_app)

        if result.state == 'PENDING':
            return jsonify({'status': 'pending'})
        elif result.state == 'PROGRESS':
            return jsonify({'status': 'progress', 'meta': result.info})
        elif result.state == 'SUCCESS':
            return jsonify({'status': 'success', 'result': result.result})
        elif result.state == 'FAILURE':
            return jsonify({'status': 'failure', 'error': str(result.info)})
        else:
            return jsonify({'status': result.state.lower()})

    except Exception as exc:
        logger.error(f"Job status error for {task_id}: {exc}")
        return jsonify({'status': 'error', 'error': str(exc)}), 500
