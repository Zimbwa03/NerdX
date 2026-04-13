"""
NerdX Cache Service
===================
Redis-backed caching for AI-generated questions and student data.

Cache key format:  nerdx:{subject_prefix}:{md5_hash}
Pool model:        Each topic/difficulty combo stores a pool of 5 questions
                   so students always get variety even from cache.

Target: >70% cache hit rate on common ZIMSEC topics.

Degrades gracefully: if Redis is unavailable the service logs a warning
and every cache call becomes a no-op (always miss).
"""

import hashlib
import json
import logging
import random
from typing import Any, Optional
from config import Config

logger = logging.getLogger(__name__)

_redis_client = None  # Lazy-initialised singleton


def _get_redis():
    """Return a Redis connection, or None if Redis is unreachable."""
    global _redis_client
    if _redis_client is not None:
        return _redis_client
    try:
        import redis
        client = redis.from_url(
            Config.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=2,
            socket_timeout=2,
        )
        client.ping()
        _redis_client = client
        logger.info("Redis cache connected")
    except Exception as exc:
        logger.warning(f"Redis unavailable — running without cache: {exc}")
        _redis_client = None
    return _redis_client


# ---------------------------------------------------------------------------
# Key helpers
# ---------------------------------------------------------------------------

def _pool_key(subject: str, topic: str, difficulty: str, question_type: str) -> str:
    raw = f"{subject}:{topic}:{difficulty}:{question_type}".lower()
    digest = hashlib.md5(raw.encode()).hexdigest()[:8]
    return f"nerdx:{subject[:4].lower()}:{digest}"


def _resolve_question_ttl(question_type: str) -> int:
    normalized = (question_type or '').strip().lower()
    direct_match = Config.CACHE_TTL.get(normalized)
    if direct_match:
        return direct_match

    aliases = {
        'mcq': 'mcq_question',
        'multiple_choice': 'mcq_question',
        'structured': 'structured_question',
        'essay': 'essay_question',
        'math_stream': 'mcq_question',
        'math_quiz': 'mcq_question',
    }
    mapped = aliases.get(normalized)
    if mapped:
        return Config.CACHE_TTL.get(mapped, 86400)
    return 86400


# ---------------------------------------------------------------------------
# Question pool cache
# ---------------------------------------------------------------------------

def get_cached_question(
    subject: str,
    topic: str,
    difficulty: str,
    question_type: str,
) -> Optional[dict]:
    """
    Return a random question from the cached pool, or None on miss.
    Returning a random item from the pool gives students variety.
    """
    r = _get_redis()
    if not r:
        return None
    try:
        raw = r.get(_pool_key(subject, topic, difficulty, question_type))
        if not raw:
            return None
        pool = json.loads(raw)
        if not pool:
            return None
        logger.debug(f"Cache HIT: {subject}/{topic}/{difficulty} (pool={len(pool)})")
        return random.choice(pool)
    except Exception as exc:
        logger.warning(f"Cache get error: {exc}")
        return None


def cache_question(
    subject: str,
    topic: str,
    difficulty: str,
    question_type: str,
    question_data: dict,
    pool_size: int = 5,
    ttl: Optional[int] = None,
) -> bool:
    """
    Add *question_data* to the pool for this topic/difficulty.
    Pool is capped at *pool_size* (circular buffer — drops oldest when full).
    """
    r = _get_redis()
    if not r:
        return False
    try:
        key = _pool_key(subject, topic, difficulty, question_type)
        ttl = ttl or _resolve_question_ttl(question_type)
        raw = r.get(key)
        pool = json.loads(raw) if raw else []
        pool.append(question_data)
        if len(pool) > pool_size:
            pool = pool[-pool_size:]
        r.setex(key, ttl, json.dumps(pool))
        logger.debug(f"Cache SET: {subject}/{topic}/{difficulty} (pool={len(pool)}, ttl={ttl}s)")
        return True
    except Exception as exc:
        logger.warning(f"Cache set error: {exc}")
        return False


# ---------------------------------------------------------------------------
# Generic key/value cache
# ---------------------------------------------------------------------------

def get_cached_value(key: str) -> Optional[Any]:
    r = _get_redis()
    if not r:
        return None
    try:
        val = r.get(f"nerdx:{key}")
        return json.loads(val) if val else None
    except Exception as exc:
        logger.warning(f"Cache get ({key}): {exc}")
        return None


def set_cached_value(key: str, value: Any, ttl: int = 300) -> bool:
    r = _get_redis()
    if not r:
        return False
    try:
        r.setex(f"nerdx:{key}", ttl, json.dumps(value))
        return True
    except Exception as exc:
        logger.warning(f"Cache set ({key}): {exc}")
        return False


def invalidate_student_cache(student_id: str) -> None:
    """Remove all cached data for one student (call after profile changes)."""
    r = _get_redis()
    if not r:
        return
    try:
        keys = r.keys(f"nerdx:student:{student_id}:*")
        if keys:
            r.delete(*keys)
            logger.debug(f"Invalidated {len(keys)} cache keys for student {student_id}")
    except Exception as exc:
        logger.warning(f"Cache invalidation error: {exc}")


def get_cache_stats() -> dict:
    """Return Redis hit/miss stats for the /health or admin endpoint."""
    r = _get_redis()
    if not r:
        return {"status": "unavailable"}
    try:
        info = r.info("stats")
        hits   = info.get("keyspace_hits", 0)
        misses = info.get("keyspace_misses", 0)
        total  = hits + misses or 1
        return {
            "status":   "connected",
            "hits":     hits,
            "misses":   misses,
            "hit_rate": round(hits / total * 100, 1),
        }
    except Exception as exc:
        return {"status": "error", "error": str(exc)}
