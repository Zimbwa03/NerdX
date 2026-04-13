"""
NerdX Model Router
==================
Routes AI requests to the correct Gemini model tier based on task type.

Tier 1 (Flash-Lite): Navigation, simple MCQ   → <3 s
Tier 2 (Flash):      Standard quiz, chat       → <8 s
Tier 3 (Pro):        A-Level, essays, marking  → <20 s (streamed)
"""

import logging
import re
from config import Config

logger = logging.getLogger(__name__)


def get_model_for_task(task_type: str) -> tuple:
    """
    Return (model_name, timeout_seconds) for a given task type.

    Usage:
        model, timeout = get_model_for_task('math_topical')
        # ('gemini-2.5-flash', 15)
    """
    routing = Config.MODEL_ROUTING

    if task_type in routing['tier_1_tasks']:
        return routing['tier_1_flash_lite'], Config.AI_TIMEOUT_FAST

    if task_type in routing['tier_2_tasks']:
        return routing['tier_2_flash'], Config.AI_TIMEOUT_STANDARD

    if task_type in routing['tier_3_tasks']:
        return routing['tier_3_pro'], Config.AI_TIMEOUT_HEAVY

    # Default: Flash with standard timeout — safe middle ground
    logger.warning(f"Unknown task type '{task_type}' — defaulting to Flash tier")
    return routing['tier_2_flash'], Config.AI_TIMEOUT_STANDARD


def get_model_display_name(model: str) -> str:
    """Human-readable model name for logging."""
    names = {
        'gemini-2.5-flash-lite': 'Flash-Lite (Fast)',
        'gemini-2.5-flash':      'Flash (Standard)',
        'gemini-2.5-pro':        'Pro (Heavy)',
    }
    return names.get(model, model)


def derive_task_type(subject: str, question_type: str = 'mcq', topic: str = '') -> str:
    """
    Map a subject/question request to the closest configured routing key.

    This keeps the router useful even when callers don't know the exact
    internal action key ahead of time.
    """
    normalized_subject = (subject or '').strip().lower()
    normalized_question_type = (question_type or 'mcq').strip().lower()
    normalized_topic = (topic or '').strip().lower()

    if normalized_subject in {'mathematics', 'math'}:
        if 'graph' in normalized_topic:
            return 'math_graph_practice'
        return 'math_quiz'

    if normalized_subject in {'biology', 'chemistry', 'physics'}:
        if normalized_question_type == 'structured':
            return 'combined_science_topical_structured'
        if normalized_question_type == 'mcq':
            return 'combined_science_topical_mcq'
        return 'combined_science_topical'

    if normalized_subject == 'english':
        if normalized_question_type == 'essay':
            return 'english_essay_writing'
        return 'english_topical'

    if normalized_subject in {'computer_science', 'computer science'}:
        if normalized_question_type == 'essay':
            return 'a_level_computer_science_topical_essay'
        return 'computer_science_topical_mcq'

    if normalized_subject == 'a_level_pure_math':
        if normalized_question_type == 'structured':
            return 'a_level_pure_math_topical_structured'
        return 'a_level_pure_math_topical'

    if normalized_subject == 'a_level_chemistry':
        if normalized_question_type == 'structured':
            return 'a_level_chemistry_topical_structured'
        return 'a_level_chemistry_exam'

    if normalized_subject == 'a_level_physics':
        if normalized_question_type == 'structured':
            return 'a_level_physics_topical_structured'
        return 'a_level_physics_exam'

    if normalized_subject == 'a_level_biology':
        return 'a_level_biology_topical_essay' if normalized_question_type == 'essay' else 'a_level_biology_exam_essay'

    if normalized_subject == 'a_level_geography':
        return 'a_level_geography_topical_essay'

    if normalized_subject == 'history':
        return 'history_topical_essay'

    fallback = re.sub(r'[^a-z0-9]+', '_', normalized_subject).strip('_')
    if fallback and normalized_question_type:
        return f'{fallback}_{normalized_question_type}'
    return 'teacher_mode_followup'
