"""Database package for NerdX Quiz Bot"""

from .session_db import *
from .external_db import *

__all__ = [
    # Session database functions
    'init_session_database',
    'save_user_session',
    'get_user_session',
    'clear_user_session',
    'get_registration_session',
    'update_registration_session',
    'clear_registration_session',
    'get_recent_question_hashes',
    'add_question_to_history',
    
    # External database functions
    'test_connection',
    'is_user_registered',
    'get_user_registration',
    'create_user_registration',
    'get_or_create_user_stats',
    'update_user_stats',
    'get_user_credits',
    'add_credits',
    'deduct_credits',
    'get_random_mcq_question',
    'get_questions_by_category_and_topic',
    'count_questions_by_category_and_topic',
    'save_ai_question_to_database',
    'create_pending_payment',
    'get_pending_payment',
    'complete_payment',
    'process_ecocash_payment',
    'add_referral_credits',
    'get_user_by_nerdx_id',
    'get_user_stats',
    'add_xp',
    'update_streak',
    'update_user_last_activity'
]
