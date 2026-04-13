"""
NerdX Background Task Queue
===========================
Async execution for heavy or latency-sensitive work:
  - Manim rendering
  - DKT batch writes
  - PDF generation
  - Audio processing
  - Cache prewarming

Celery is preferred in production. When Redis/Celery is unavailable, the module
falls back to daemon threads so the app still works in development.
"""

import logging
import threading
from typing import Dict, Optional

from config import Config

logger = logging.getLogger(__name__)

try:
    from celery import Celery

    celery_app = Celery(
        'nerdx',
        broker=Config.CELERY_BROKER_URL,
        backend=Config.CELERY_RESULT_BACKEND,
    )
    celery_app.conf.update(
        task_serializer='json',
        accept_content=['json'],
        result_serializer='json',
        timezone='Africa/Harare',
        enable_utc=True,
        task_track_started=True,
        task_acks_late=True,
        worker_prefetch_multiplier=1,
        task_soft_time_limit=60,
        task_time_limit=120,
        task_routes={
            'services.task_queue.render_manim_video': {'queue': 'graphics'},
            'services.task_queue.generate_pdf': {'queue': 'documents'},
            'services.task_queue.process_audio': {'queue': 'audio'},
            'services.task_queue.write_dkt_batch': {'queue': 'analytics'},
            'services.task_queue.prewarm_question_pool': {'queue': 'pregenerate'},
        },
    )
    _CELERY_AVAILABLE = True
except Exception as exc:
    celery_app = None
    _CELERY_AVAILABLE = False
    logger.warning("Celery unavailable, background tasks will use threads: %s", exc)


_dkt_buffer = []
_dkt_lock = threading.Lock()


def _enqueue_background_call(target, *args) -> None:
    thread = threading.Thread(target=target, args=args, daemon=True)
    thread.start()


def queue_dkt_interaction(interaction: dict) -> None:
    global _dkt_buffer

    batch = None
    with _dkt_lock:
        _dkt_buffer.append(interaction)
        if len(_dkt_buffer) >= Config.DKT_BATCH_SIZE:
            batch = list(_dkt_buffer)
            _dkt_buffer = []

    if batch:
        _flush_dkt_batch_async(batch)


def _flush_dkt_batch_async(batch: list) -> None:
    if not batch:
        return
    if _CELERY_AVAILABLE:
        try:
            write_dkt_batch.delay(batch)
            return
        except Exception as exc:
            logger.warning("Celery enqueue failed, falling back to thread for DKT batch: %s", exc)
    _enqueue_background_call(_write_dkt_batch_sync, batch)


def _write_dkt_batch_sync(interactions: list) -> None:
    if not interactions:
        return
    from services.dkt_service import bulk_write_interactions
    bulk_write_interactions(interactions)


def enqueue_manim_render(graph_type: str, payload: Dict, student_id: str) -> Dict[str, Optional[str]]:
    """
    Queue a Manim render and return either a job id or an immediate video path.
    """
    if _CELERY_AVAILABLE:
        try:
            task = render_manim_video.delay(graph_type, payload, student_id)
            return {'job_id': task.id, 'video_path': None}
        except Exception as exc:
            logger.warning("Celery enqueue failed, rendering graph inline fallback: %s", exc)

    result = _render_manim_video_sync(graph_type, payload, student_id)
    return {'job_id': None, 'video_path': result.get('video_path')}


def _render_manim_video_sync(graph_type: str, payload: Dict, student_id: str) -> Dict:
    del student_id
    from services.manim_service import get_manim_service

    manim = get_manim_service()
    if graph_type == 'quadratic':
        return manim.render_quadratic(
            float(payload.get('a', 1)),
            float(payload.get('b', 0)),
            float(payload.get('c', 0)),
            quality='l',
            x_range=payload.get('x_range'),
            y_range=payload.get('y_range'),
        )
    if graph_type == 'linear':
        return manim.render_linear(
            float(payload.get('m', 1)),
            float(payload.get('c', 0)),
            quality='l',
            x_range=payload.get('x_range'),
            y_range=payload.get('y_range'),
        )
    if graph_type == 'expression':
        return manim.render_expression(
            str(payload.get('expression', '')),
            quality='l',
            x_range=payload.get('x_range'),
            y_range=payload.get('y_range'),
        )
    raise ValueError(f"Unsupported graph type: {graph_type}")


if _CELERY_AVAILABLE:
    @celery_app.task(bind=True, name='services.task_queue.render_manim_video')
    def render_manim_video(self, graph_type: str, payload: Dict, student_id: str):
        try:
            self.update_state(state='PROGRESS', meta={'stage': 'rendering', 'progress': 10})
            result = _render_manim_video_sync(graph_type, payload, student_id)
            if not result.get('success') or not result.get('video_path'):
                raise RuntimeError(result.get('error', 'Manim render failed'))
            return {
                'status': 'success',
                'video_path': result['video_path'],
                'graph_type': graph_type,
            }
        except Exception as exc:
            logger.error("Graph render failed for %s: %s", graph_type, exc)
            raise self.retry(exc=exc, countdown=5, max_retries=1)

    @celery_app.task(bind=True, name='services.task_queue.generate_pdf')
    def generate_pdf(self, content: dict, student_id: str, pdf_type: str):
        from services.pdf_service import create_pdf
        return {'status': 'success', 'pdf_url': create_pdf(content, student_id, pdf_type)}

    @celery_app.task(bind=True, name='services.task_queue.process_audio')
    def process_audio(self, audio_data: bytes, student_id: str, mode: str = 'transcribe'):
        from services.audio_service import handle_audio
        result = handle_audio(audio_data=audio_data, student_id=student_id, mode=mode)
        return {'status': 'success', **result}

    @celery_app.task(name='services.task_queue.write_dkt_batch')
    def write_dkt_batch(interactions: list):
        _write_dkt_batch_sync(interactions)

    @celery_app.task(name='services.task_queue.prewarm_question_pool')
    def prewarm_question_pool(subject: str, topic: str, difficulty: str, question_type: str):
        from services.ai_service import generate_question_direct
        from services.cache_service import cache_question, get_cached_question

        if get_cached_question(subject, topic, difficulty, question_type):
            return

        question = generate_question_direct(subject, topic, difficulty, question_type)
        if question:
            cache_question(subject, topic, difficulty, question_type, question)
            logger.info("Pre-warmed cache: %s/%s/%s", subject, topic, difficulty)

    @celery_app.task(name='services.task_queue.flush_dkt_buffer')
    def flush_dkt_buffer():
        global _dkt_buffer
        batch = None
        with _dkt_lock:
            if _dkt_buffer:
                batch = list(_dkt_buffer)
                _dkt_buffer = []
        if batch:
            write_dkt_batch.delay(batch)

    @celery_app.task(name='services.task_queue.prewarm_popular_topics')
    def prewarm_popular_topics():
        hot_topics = [
            ('Mathematics', 'Algebra', 'medium', 'mcq'),
            ('Mathematics', 'Quadratic Functions', 'medium', 'structured'),
            ('Biology', 'Cell Structure and Organisation', 'easy', 'mcq'),
            ('Chemistry', 'Acids, Bases and Salts', 'medium', 'mcq'),
            ('Physics', 'Electricity (Current Electricity, Circuits)', 'medium', 'mcq'),
            ('English', 'Comprehension Skills', 'medium', 'structured'),
        ]
        for args in hot_topics:
            prewarm_question_pool.delay(*args)

    celery_app.conf.beat_schedule = {
        'flush-dkt-buffer': {
            'task': 'services.task_queue.flush_dkt_buffer',
            'schedule': Config.DKT_FLUSH_INTERVAL,
        },
        'prewarm-popular-topics': {
            'task': 'services.task_queue.prewarm_popular_topics',
            'schedule': 3600.0,
        },
    }
else:
    def render_manim_video(graph_type: str, payload: Dict, student_id: str):
        return _render_manim_video_sync(graph_type, payload, student_id)

    def write_dkt_batch(interactions: list):
        _write_dkt_batch_sync(interactions)
