"""
NerdX DKT Service
=================
Async-first helpers for topic mastery, review queues, and weak-topic lookups.

This module keeps its database writes compatible with the existing DKT schema:
  - student_interactions(user_id, skill_id, ...)
  - student_knowledge_state(user_id, skill_id, ...)
  - daily_review_queue(user_id, skill_id, review_date, ...)
"""

import logging
import re
from datetime import datetime
from typing import Dict, List, Optional

from psycopg2.extras import RealDictCursor

from database.external_db import get_db_connection
from services.cache_service import get_cached_value, set_cached_value
from services.task_queue import queue_dkt_interaction

logger = logging.getLogger(__name__)


BKT_PARAMS = {
    'default': {'p_init': 0.30, 'p_transit': 0.09, 'p_slip': 0.10, 'p_guess': 0.20},
    'mathematics': {'p_init': 0.25, 'p_transit': 0.08, 'p_slip': 0.15, 'p_guess': 0.15},
    'biology': {'p_init': 0.35, 'p_transit': 0.12, 'p_slip': 0.08, 'p_guess': 0.25},
    'chemistry': {'p_init': 0.30, 'p_transit': 0.10, 'p_slip': 0.10, 'p_guess': 0.20},
    'physics': {'p_init': 0.28, 'p_transit': 0.09, 'p_slip': 0.12, 'p_guess': 0.18},
}


def topic_to_skill_id(subject: str, topic: str) -> str:
    normalized_subject = re.sub(r'[^a-z0-9]+', '_', (subject or '').strip().lower()).strip('_')
    normalized_topic = re.sub(r'[^a-z0-9]+', '_', (topic or '').strip().lower()).strip('_')
    return f"{normalized_subject}_{normalized_topic}" if normalized_topic else normalized_subject


def log_interaction(
    student_id: str,
    subject: str,
    topic: str,
    question_type: str,
    is_correct: bool,
    time_taken_seconds: int,
    difficulty: str,
    question_id: Optional[str] = None,
) -> None:
    interaction = {
        'user_id': student_id,
        'student_id': student_id,
        'subject': subject,
        'topic': topic,
        'skill_id': topic_to_skill_id(subject, topic),
        'question_type': question_type,
        'is_correct': is_correct,
        'time_taken_seconds': time_taken_seconds,
        'difficulty': difficulty,
        'question_id': question_id,
        'confidence': None,
        'hints_used': 0,
        'session_id': None,
        'device_id': None,
        'timestamp': datetime.utcnow().isoformat(),
    }
    queue_dkt_interaction(interaction)
    _update_mastery_cache(student_id, subject, topic, is_correct)


def get_student_mastery(student_id: str, subject: str, topic: str) -> float:
    cache_key = f"student:{student_id}:mastery:{subject}:{topic}"
    cached = get_cached_value(cache_key)
    if cached is not None:
        return float(cached)

    try:
        mastery = _query_mastery_from_db(student_id, subject, topic)
        set_cached_value(cache_key, mastery, ttl=60)
        return mastery
    except Exception as exc:
        logger.warning("Mastery lookup failed for %s/%s/%s: %s", student_id, subject, topic, exc)
        return 0.3


def get_recommended_difficulty(student_id: str, subject: str, topic: str) -> str:
    mastery = get_student_mastery(student_id, subject, topic)
    if mastery < 0.4:
        return 'easy'
    if mastery < 0.7:
        return 'medium'
    return 'difficult'


def get_daily_review_topics(student_id: str, subject: str, limit: int = 5) -> List[Dict]:
    cache_key = f"student:{student_id}:review_queue:{subject}"
    cached = get_cached_value(cache_key)
    if cached:
        return list(cached)[:limit]

    rows: List[Dict] = []
    try:
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT q.skill_id, q.priority, q.review_date, st.topic
                    FROM daily_review_queue q
                    LEFT JOIN skills_taxonomy st ON st.skill_id = q.skill_id
                    WHERE q.user_id = %s
                      AND q.completed = FALSE
                      AND q.review_date <= CURRENT_DATE
                      AND (%s = '' OR st.subject ILIKE %s)
                    ORDER BY q.priority DESC, q.review_date ASC
                    LIMIT %s
                    """,
                    (student_id, subject or '', subject or '', limit),
                )
                for row in cur.fetchall():
                    rows.append(
                        {
                            'topic': row.get('topic') or row.get('skill_id'),
                            'priority': row.get('priority'),
                            'last_reviewed': str(row.get('review_date')) if row.get('review_date') else None,
                        }
                    )
        set_cached_value(cache_key, rows, ttl=3600)
        return rows
    except Exception as exc:
        logger.warning("Review queue query failed for %s/%s: %s", student_id, subject, exc)
        return []


def get_student_weak_topics(student_id: str, subject: str, limit: int = 3) -> List[Dict]:
    cache_key = f"student:{student_id}:weak_topics:{subject}"
    cached = get_cached_value(cache_key)
    if cached:
        return list(cached)

    rows: List[Dict] = []
    try:
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT ks.skill_id, ks.mastery_probability, st.topic
                    FROM student_knowledge_state ks
                    LEFT JOIN skills_taxonomy st ON st.skill_id = ks.skill_id
                    WHERE ks.user_id = %s
                      AND (%s = '' OR st.subject ILIKE %s)
                    ORDER BY ks.mastery_probability ASC NULLS FIRST
                    LIMIT %s
                    """,
                    (student_id, subject or '', subject or '', limit),
                )
                for row in cur.fetchall():
                    rows.append(
                        {
                            'topic': row.get('topic') or row.get('skill_id'),
                            'mastery': float(row.get('mastery_probability') or 0.3),
                        }
                    )
        set_cached_value(cache_key, rows, ttl=300)
        return rows
    except Exception as exc:
        logger.warning("Weak topic query failed for %s/%s: %s", student_id, subject, exc)
        return []


def bulk_write_interactions(interactions: List[Dict]) -> None:
    if not interactions:
        return

    from services.deep_knowledge_tracing import dkt_service

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.executemany(
                    """
                    INSERT INTO student_interactions
                        (user_id, subject, topic, skill_id, question_id,
                         difficulty, response, confidence, time_spent_seconds, hints_used,
                         session_id, device_id, timestamp)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT DO NOTHING
                    """,
                    [
                        (
                            item.get('user_id') or item.get('student_id'),
                            item.get('subject'),
                            item.get('topic'),
                            item.get('skill_id') or topic_to_skill_id(item.get('subject', ''), item.get('topic', '')),
                            item.get('question_id'),
                            item.get('difficulty'),
                            item.get('is_correct'),
                            item.get('confidence'),
                            item.get('time_taken_seconds'),
                            item.get('hints_used', 0),
                            item.get('session_id'),
                            item.get('device_id'),
                            item.get('timestamp'),
                        )
                        for item in interactions
                    ],
                )
            conn.commit()

        touched_skills = {}
        for item in interactions:
            user_id = item.get('user_id') or item.get('student_id')
            skill_id = item.get('skill_id') or topic_to_skill_id(item.get('subject', ''), item.get('topic', ''))
            touched_skills[(user_id, skill_id)] = item

        for (user_id, skill_id), item in touched_skills.items():
            dkt_service.update_knowledge_state(user_id, skill_id)
            dkt_service.update_srs_state(user_id, skill_id, bool(item.get('is_correct')), item.get('confidence'))
            _update_mastery_cache(user_id, item.get('subject', ''), item.get('topic', ''), bool(item.get('is_correct')))

        logger.info("DKT batch committed: %s interactions", len(interactions))
    except Exception as exc:
        logger.error("DKT bulk write failed: %s", exc)
        raise


def _update_mastery_cache(student_id: str, subject: str, topic: str, is_correct: bool) -> None:
    cache_key = f"student:{student_id}:mastery:{subject}:{topic}"
    current = float(get_cached_value(cache_key) or 0.3)
    params = BKT_PARAMS.get((subject or '').strip().lower(), BKT_PARAMS['default'])

    if is_correct:
        p_correct = current * (1 - params['p_slip']) + (1 - current) * params['p_guess']
        posterior = (current * (1 - params['p_slip'])) / max(p_correct, 1e-9)
    else:
        p_wrong = current * params['p_slip'] + (1 - current) * (1 - params['p_guess'])
        posterior = (current * params['p_slip']) / max(p_wrong, 1e-9)

    new_mastery = posterior + (1 - posterior) * params['p_transit']
    set_cached_value(cache_key, max(0.0, min(1.0, new_mastery)), ttl=60)


def _query_mastery_from_db(student_id: str, subject: str, topic: str) -> float:
    skill_id = topic_to_skill_id(subject, topic)
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT mastery_probability
                FROM student_knowledge_state
                WHERE user_id = %s AND skill_id = %s
                """,
                (student_id, skill_id),
            )
            row = cur.fetchone()
    return float(row[0]) if row and row[0] is not None else 0.3
