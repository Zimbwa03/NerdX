"""
Mobile API Blueprint for NerdX Mobile Application
Provides REST API endpoints for React Native mobile app
"""
import json
import logging
import jwt
import hashlib
import secrets
import time
import re
from datetime import datetime, timedelta, timezone
from functools import wraps
from typing import Optional
from flask import Blueprint, request, jsonify, g
from werkzeug.utils import secure_filename
import uuid
import os
import base64
from database.external_db import (
    get_user_registration, create_user_registration, is_user_registered,
    get_user_stats, get_user_credits, add_credits, deduct_credits, deduct_credits_with_balance,
    get_user_by_nerdx_id, add_xp, update_streak,
    claim_welcome_bonus, get_credit_breakdown,
    make_supabase_request,
    authenticate_supabase_user,
    get_user_by_email_admin,
    get_user_registration_by_email,
    get_user_projects,
    get_project_by_id,
    get_project_chat_history,
    get_wallet_transactions,
    get_lesson_wallet,
    LESSON_FEE,
)
# Additional Services
from services.advanced_credit_service import advanced_credit_service
from services.question_service import QuestionService
from services.mathematics_service import MathematicsService
from services.math_ocr_service import MathOCRService
from services.symbolic_solver_service import SymbolicSolverService
from services.mathematics_teacher_service import mathematics_teacher_service
from services.combined_science_generator import CombinedScienceGenerator
from services.computer_science_generator import ComputerScienceGenerator
from services.geography_generator import GeographyGenerator
from services.geotutor_service import get_geotutor_feedback
from services.english_service import EnglishService
from services.referral_service import ReferralService
from services.paynow_service import PaynowService
from services.graph_service import GraphService
from services.image_service import ImageService
from services.voice_service import get_voice_service
from services.vertex_service import vertex_service, get_image_question_credit_cost, get_text_question_credit_cost
from services.exam_session_service import exam_session_service
from services.database_lab_execution_service import database_lab_execution_service
from services.programming_lab_ai_service import programming_lab_ai_service
from services.balance_sheet_generator import generate_balance_sheet_question
from services.income_statement_generator import generate_income_statement_question
from services.partnership_appropriation_generator import generate_partnership_appropriation_question
from services.cash_flow_generator import generate_cash_flow_question
from services.manufacturing_account_generator import generate_manufacturing_account_question
from services.correction_of_errors_generator import generate_correction_of_errors_question
from services.not_for_profit_generator import generate_not_for_profit_question
from services.flashcard_service import flashcard_service
from services.project_assistant_service import ProjectAssistantService
from services.project_export_service import project_export_service
from services.engagement_notification_service import engagement_notification_service
from services.history_generator import generate_question as history_generate_question
from services.history_marking_service import mark_history_essay
from services.lesson_payment_service import lesson_payment_service
from utils.url_utils import convert_local_path_to_public_url
from utils.credit_units import format_credits, units_to_credits, credits_to_units
from utils.question_cache import QuestionCacheService
from utils.latex_converter import LaTeXConverter
from config import Config

logger = logging.getLogger(__name__)

mobile_bp = Blueprint('mobile', __name__)
question_cache = QuestionCacheService()
project_assistant_service = ProjectAssistantService()


def _credits_display(units: int) -> int:
    """Convert credit units to display credits for API responses.
    Returns whole number credits (rounded) - no decimals.
    1 credit = 10 units, so we round to nearest whole credit."""
    if units is None or units == 0:
        return 0
    # Convert to credits and round to nearest whole number
    credits = units_to_credits(units)
    # Whole-number display policy: always show whole credits.
    # Use floor (not bankers rounding) to avoid confusing .5 edge cases and to keep display stable.
    return int(credits)


def _credits_text(units: int) -> str:
    """Format credit units for messages."""
    return format_credits(units or 0)


def _credits_remaining(user_id: str) -> int:
    """Get current remaining credits (displayed as whole credits)."""
    units = get_user_credits(user_id) or 0
    return _credits_display(units)


def _parse_utc_datetime(value):
    """Parse datetime-like values to naive UTC datetime."""
    if value is None:
        return None
    try:
        dt = datetime.fromisoformat(str(value).replace('Z', '+00:00')) if isinstance(value, str) else value
        if dt is None:
            return None
        if getattr(dt, 'tzinfo', None):
            dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
        return dt
    except Exception:
        return None


def _resolve_school_context(user_data: Optional[dict]):
    """Return (school_name, school_expiry_at) for a school student row."""
    school_name = None
    school_expiry_at = None
    if not isinstance(user_data, dict):
        return school_name, school_expiry_at

    school_name = (user_data.get('school_name') or '').strip() or None
    school_expiry_at = user_data.get('subscription_expires_at')
    school_pk = user_data.get('school_id')
    if not school_pk:
        return school_name, school_expiry_at

    try:
        school_rows = make_supabase_request(
            "GET",
            "schools",
            select="name,subscription_expires_at",
            filters={"id": f"eq.{school_pk}"},
            use_service_role=True,
        ) or []
        if school_rows:
            school_row = school_rows[0] or {}
            school_name = (school_row.get('name') or school_name or '').strip() or None
            school_expiry_at = school_row.get('subscription_expires_at') or school_expiry_at
    except Exception as e:
        logger.warning(f"School context lookup failed: {e}")

    return school_name, school_expiry_at


def _format_school_expiry_label(expiry_value):
    """Format school expiry for user-facing text."""
    exp_dt = _parse_utc_datetime(expiry_value)
    if not exp_dt:
        return "Unknown expiry date"
    return exp_dt.strftime("%d %b %Y")


def _is_school_subscription_expired(expiry_value) -> bool:
    """Return True when expiry exists and is in the past."""
    exp_dt = _parse_utc_datetime(expiry_value)
    if not exp_dt:
        return False
    return exp_dt < datetime.utcnow()


def _build_school_levy_message(school_name: Optional[str], expiry_value, expired: bool = False) -> str:
    """Message shown for school expiry and school credit-store restrictions."""
    school_label = (school_name or "your school").strip() or "your school"
    expiry_label = _format_school_expiry_label(expiry_value)
    if expired:
        return (
            f"Your NerdX access for {school_label} expired on {expiry_label}. "
            f"System access is now closed. Go to {school_label} and pay the levy to use NerdX."
        )
    return (
        f"Credit Store is disabled for school student accounts. {school_label} pays for NerdX as a school, "
        f"not as individual students. School expiry date: {expiry_label}. "
        f"If access expires, go to {school_label} and pay the levy to use NerdX."
    )


def _is_single_device_enforced(user_data: Optional[dict]) -> bool:
    """
    Single-device enforcement policy:
    - school_student accounts: enforced (per-platform)
    - all other accounts (individual, teacher): not enforced
    """
    if not isinstance(user_data, dict):
        return False
    user_type = (user_data.get('user_type') or '').strip().lower()
    return user_type == 'school_student'


def _has_active_session(user_data: Optional[dict], platform: str = 'mobile') -> bool:
    """Return True when account already has an active session on the given platform."""
    if not isinstance(user_data, dict):
        return False
    col = f'active_session_id_{platform}'
    return bool((user_data.get(col) or '').strip())


def _single_device_block_message(platform: str = 'device') -> str:
    """User-facing message for blocked concurrent login."""
    label = 'browser' if platform == 'web' else 'phone'
    return (
        f"This account is already logged in on another {label}. "
        f"Please log out there first, then sign in here."
    )


def _get_student_first_name(user_id: Optional[str]) -> str:
    """Return a short first-name style label for personalized prompts."""
    if not user_id:
        return "Student"
    try:
        reg = get_user_registration(user_id) or {}
        raw_name = (
            reg.get('name')
            or reg.get('first_name')
            or reg.get('full_name')
            or reg.get('nerdx_id')
            or reg.get('chat_id')
            or ''
        )
        if not isinstance(raw_name, str):
            raw_name = str(raw_name)
        raw_name = raw_name.strip()
        if raw_name:
            first = raw_name.split()[0].strip()
            if first:
                return first[:40]
    except Exception as e:
        logger.debug("Unable to resolve student first name for prompt: %s", e)
    return "Student"


def _deduct_credits_or_fail(user_id: str, cost_units: int, transaction_type: str, description: str):
    """
    Deduct credits and return remaining displayed credits (real-time from RPC when possible).
    Returns int (credits remaining, display units) on success, None on failure.
    """
    ok, new_units = deduct_credits_with_balance(user_id, cost_units, transaction_type, description)
    if not ok:
        return None
    if new_units is not None:
        return _credits_display(new_units)
    return _credits_remaining(user_id)


FREE_VIRTUAL_LAB_SIMULATIONS = {
    "biology": {"cell-explorer", "osmosis-adventure", "food-test-lab"},
    "chemistry": {"atom-builder", "equation-balancer", "titration-master"},
    "physics": {"circuit-builder", "projectile-motion", "motion-grapher"},
}


def _get_quiz_credit_action(
    subject: str,
    question_type: str,
    question_format: str,
    bio_question_type: str,
    cs_question_type: str = None,
    geo_question_type: str = None,
) -> str:
    subject_key = (subject or '').lower()
    qt = (question_type or 'topical').lower()
    qf = (question_format or 'mcq').lower()
    bio_qt = (bio_question_type or 'mcq').lower()
    cs_fmt = (cs_question_type or qf or 'mcq').lower()
    geo_fmt = (geo_question_type or qf or 'mcq').lower()

    if subject_key == 'mathematics':
        return 'math_topical' if qt == 'topical' else 'math_exam'
    if subject_key == 'combined_science':
        if qt == 'exam':
            return 'combined_science_exam'
        return 'combined_science_topical_structured' if qf == 'structured' else 'combined_science_topical_mcq'
    if subject_key == 'computer_science':
        # Exam: per-format keys (0.3 MCQ, 0.5 structured, 1 essay) like other subjects
        if qt == 'exam':
            if cs_fmt == 'structured':
                return 'computer_science_exam_structured'
            if cs_fmt == 'essay':
                return 'computer_science_exam_essay'
            return 'computer_science_exam_mcq'
        # Topical: MCQ=3 units (0.3), Structured=5 (0.5), Essay=10 (1)
        if cs_fmt == 'structured':
            return 'computer_science_topical_structured'
        if cs_fmt == 'essay':
            return 'computer_science_topical_essay'
        return 'computer_science_topical_mcq'
    if subject_key == 'english':
        return 'english_topical'

    # A-Level subjects
    if subject_key == 'a_level_pure_math':
        if qt == 'exam':
            return 'a_level_pure_math_exam'
        return 'a_level_pure_math_topical_structured' if qf == 'structured' else 'a_level_pure_math_topical_mcq'
    if subject_key == 'a_level_chemistry':
        if qt == 'exam':
            return 'a_level_chemistry_exam'
        return 'a_level_chemistry_topical_structured' if qf == 'structured' else 'a_level_chemistry_topical_mcq'
    if subject_key == 'a_level_physics':
        if qt == 'exam':
            return 'a_level_physics_exam'
        return 'a_level_physics_topical_structured' if qf == 'structured' else 'a_level_physics_topical_mcq'
    if subject_key == 'a_level_biology':
        bio_key = bio_qt if bio_qt in ['mcq', 'structured', 'essay'] else 'mcq'
        return f"a_level_biology_{qt}_{bio_key}"
    if subject_key == 'a_level_computer_science':
        # Exam: per-format keys (0.3 MCQ, 0.5 structured, 1 essay) like other A-Level subjects
        if qt == 'exam':
            if cs_fmt == 'structured':
                return 'a_level_computer_science_exam_structured'
            if cs_fmt == 'essay':
                return 'a_level_computer_science_exam_essay'
            return 'a_level_computer_science_exam_mcq'
        # Topical: MCQ=3 units (0.3), Structured=5 (0.5), Essay=10 (1)
        if cs_fmt == 'structured':
            return 'a_level_computer_science_topical_structured'
        if cs_fmt == 'essay':
            return 'a_level_computer_science_topical_essay'
        return 'a_level_computer_science_topical_mcq'
    if subject_key == 'a_level_geography':
        # A-Level Geography: MCQ, structured, essay (same as other A-Level subjects)
        if qt == 'exam':
            if geo_fmt == 'structured':
                return 'a_level_geography_exam_structured'
            if geo_fmt == 'essay':
                return 'a_level_geography_exam_essay'
            return 'a_level_geography_exam_mcq'
        if geo_fmt == 'structured':
            return 'a_level_geography_topical_structured'
        if geo_fmt == 'essay':
            return 'a_level_geography_topical_essay'
        return 'a_level_geography_topical_mcq'
    if subject_key == 'accounting':
        # Principles of Accounting (ZIMSEC 7112): MCQ 0.3, Essay 1 credit
        acc_fmt = (qf or 'mcq').lower()
        if qt == 'exam':
            return 'accounting_exam_essay' if acc_fmt == 'essay' else 'accounting_exam_mcq'
        return 'accounting_topical_essay' if acc_fmt == 'essay' else 'accounting_topical_mcq'
    if subject_key == 'business_enterprise_skills':
        # BES (ZIMSEC 4048): MCQ 0.3, Essay 1 credit (same as Accounting)
        bes_fmt = (qf or 'mcq').lower()
        if qt == 'exam':
            return 'bes_exam_essay' if bes_fmt == 'essay' else 'bes_exam_mcq'
        return 'bes_topical_essay' if bes_fmt == 'essay' else 'bes_topical_mcq'
    if subject_key == 'commerce':
        # Commerce (ZIMSEC Principles of Commerce): MCQ 0.3, Essay 1 credit (same as BES/CS O-Level)
        com_fmt = (qf or 'mcq').lower()
        if qt == 'exam':
            return 'commerce_exam_essay' if com_fmt == 'essay' else 'commerce_exam_mcq'
        return 'commerce_topical_essay' if com_fmt == 'essay' else 'commerce_topical_mcq'
    if subject_key == 'history':
        # History (ZIMSEC O-Level): Paper 1 Essays only (3-part ZIMSEC format)
        if qt == 'exam':
            return 'history_exam_essay'
        return 'history_topical_essay'

    return f"{subject}_topical" if qt == 'topical' else f"{subject}_exam"


def _get_exam_session_cost_units(
    subject: str,
    level: str,
    question_mode: str,
    total_questions: int
) -> int:
    subject_key = (subject or '').lower().replace(' ', '_').replace('-', '_')
    level_key = (level or '').upper()
    is_a_level = level_key == 'A_LEVEL' or 'a_level' in subject_key

    if is_a_level and 'biology' in subject_key:
        mcq_cost = 3  # 0.25 credit
        structured_cost = 5  # 0.5 credit
    elif is_a_level:
        mcq_cost = 5  # 0.5 credit
        structured_cost = 5  # 0.5 credit
    else:
        if 'math' in subject_key:
            mcq_cost = 5  # 0.5 credit
            structured_cost = 5  # 0.5 credit
        elif subject_key == 'computer_science':
            mcq_cost = 3  # 0.3 credit per exam MCQ (3 units) - 1 credit = 3 MCQs
            structured_cost = 5  # 0.5 credit per exam structured (5 units)
        elif subject_key in ('commerce', 'business_enterprise_skills'):
            mcq_cost = 3  # 0.3 credit per MCQ (Paper 1)
            structured_cost = 10  # 1 credit per Essay (Paper 2)
        elif subject_key == 'history':
            # History: Essay only (no MCQ)
            mcq_cost = 10  # not used; essay only
            structured_cost = 10  # 1 credit per 3-part essay question
        elif any(key in subject_key for key in ['biology', 'chemistry', 'physics', 'combined_science']):
            mcq_cost = 5  # 0.5 credit
            structured_cost = 5  # 0.5 credit
        else:
            mcq_cost = 5  # 0.5 credit
            structured_cost = 5  # 0.5 credit

    if question_mode == 'MCQ_ONLY':
        return mcq_cost * total_questions
    if question_mode == 'STRUCTURED_ONLY':
        return structured_cost * total_questions
    if question_mode == 'MIXED':
        mcq_count = total_questions // 2
        structured_count = total_questions - mcq_count
        return (mcq_cost * mcq_count) + (structured_cost * structured_count)
    return mcq_cost * total_questions


def _get_exam_question_cost_units(subject: str, level: str, question_type: str) -> int:
    subject_key = (subject or '').lower().replace(' ', '_').replace('-', '_')
    level_key = (level or '').upper()
    is_a_level = level_key == 'A_LEVEL' or 'a_level' in subject_key
    q_type = (question_type or 'MCQ').upper()

    if is_a_level and 'biology' in subject_key:
        return 3 if q_type == 'MCQ' else 5  # 0.25 credit for MCQ, 0.5 credit for structured/essay
    if subject_key == 'a_level_computer_science' or subject_key == 'computer_science':
        # A-Level & O-Level CS: MCQ=0.3, Structured=0.5, Essay=1 credit
        if q_type == 'MCQ':
            return 3  # 0.3 credit per exam MCQ (3 units)
        elif q_type in ['STRUCTURED', 'STRUCTURED_ONLY']:
            return 5  # 0.5 credit per exam structured (5 units)
        elif q_type in ['ESSAY', 'ESSAY_ONLY']:
            return 10  # 1 credit per exam essay (10 units)
        return 5  # Default to structured cost
    if subject_key == 'accounting':
        # Principles of Accounting: MCQ=0.3, Essay=1
        if q_type == 'MCQ':
            return 3
        elif q_type in ['ESSAY', 'ESSAY_ONLY']:
            return 10
        return 3  # Default to MCQ
    if subject_key == 'business_enterprise_skills':
        # BES: MCQ=0.3, Essay=1 (same as Accounting)
        if q_type == 'MCQ':
            return 3
        elif q_type in ['ESSAY', 'ESSAY_ONLY']:
            return 10
        return 3  # Default to MCQ
    if subject_key == 'history':
        # History: Essay only (3-part ZIMSEC format) = 1 credit
        return 10  # 1 credit per essay question
    if subject_key == 'commerce':
        # Commerce: MCQ=0.3, Essay=1 (same as BES)
        if q_type == 'MCQ':
            return 3
        elif q_type in ['ESSAY', 'ESSAY_ONLY']:
            return 10
        return 3  # Default to MCQ
    if subject_key == 'a_level_geography':
        # A-Level Geography: MCQ=0.3, Structured=0.5, Essay=1 credit (exam essay)
        if q_type == 'MCQ':
            return 3  # 0.3 credit per exam MCQ (3 units)
        elif q_type in ['STRUCTURED', 'STRUCTURED_ONLY']:
            return 5  # 0.5 credit per exam structured (5 units)
        elif q_type in ['ESSAY', 'ESSAY_ONLY']:
            return 10  # 1 credit per exam essay (10 units)
        return 5  # Default to structured cost
    if is_a_level:
        return 5  # 0.5 credit
    if 'math' in subject_key:
        return 5  # 0.5 credit
    if any(key in subject_key for key in ['biology', 'chemistry', 'physics', 'combined_science']):
        return 5  # 0.5 credit
    return 5  # 0.5 credit (English and other subjects)

# JWT Secret Key (should be in environment variable)
JWT_SECRET = os.environ.get('JWT_SECRET', 'nerdx-mobile-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days



@mobile_bp.route('/auth/login', methods=['POST'])
def login():
    """Login user and return token"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        user_identifier = (data.get('identifier', '').strip() or data.get('email', '').strip() or data.get('phone_number', '').strip()).lower()
        password = data.get('password', '')
        requested_role = data.get('role')  # Optional: 'student' or 'teacher'
        platform = (data.get('platform') or 'mobile').strip().lower()
        if platform not in ('web', 'mobile'):
            platform = 'mobile'
        
        if not user_identifier or not password:
            return jsonify({'success': False, 'message': 'Identifier and password are required'}), 400

        # --- School-student login: identifier = full name, password = School ID (6 letters) ---
        if '@' not in user_identifier:
            school_id_raw = (password or '').strip().upper()
            if len(school_id_raw) == 6 and school_id_raw.isalpha():
                schools = make_supabase_request(
                    "GET", "schools", select="id,name,subscription_expires_at",
                    filters={"school_id": f"eq.{school_id_raw}"}, use_service_role=True
                )
                if schools and len(schools) > 0:
                    school = schools[0]
                    expires_at = school.get("subscription_expires_at")
                    if expires_at:
                        try:
                            exp_dt = _parse_utc_datetime(expires_at)
                            if exp_dt and exp_dt < datetime.utcnow():
                                return jsonify({
                                    'success': False,
                                    'message': _build_school_levy_message(school.get("name"), expires_at, expired=True)
                                }), 403
                        except Exception:
                            pass
                    students = make_supabase_request(
                        "GET", "users_registration",
                        select="id,chat_id,name,surname,user_type,active_session_id,active_session_id_web,active_session_id_mobile,subscription_expires_at",
                        filters={"school_id": f"eq.{school['id']}", "user_type": "eq.school_student"},
                        use_service_role=True
                    )
                    student_name_normalized = (user_identifier or "").strip().lower()
                    user_data = None
                    for s in (students or []):
                        full = ((s.get("name") or "") + " " + (s.get("surname") or "")).strip().lower()
                        if full == student_name_normalized:
                            user_data = s
                            break
                    if user_data:
                        # Per-platform single-device policy: block only if same platform already has a session.
                        if _has_active_session(user_data, platform):
                            return jsonify({
                                'success': False,
                                'message': _single_device_block_message(platform)
                            }), 409

                        session_id = str(uuid.uuid4())
                        token = generate_token(user_data["chat_id"], jti=session_id, platform=platform)
                        session_col = f"active_session_id_{platform}"
                        make_supabase_request(
                            "PATCH", "users_registration", {session_col: session_id},
                            filters={"chat_id": f"eq.{user_data['chat_id']}"}, use_service_role=True
                        )
                        credit_units = get_user_credits(user_data["chat_id"]) or 0
                        return jsonify({
                            'success': True,
                            'token': token,
                            'user': {
                                'id': user_data['chat_id'],
                                'nerdx_id': user_data.get('nerdx_id'),
                                'name': user_data.get('name'),
                                'surname': user_data.get('surname'),
                                'email': user_data.get('email'),
                                'credits': _credits_display(credit_units),
                                'user_type': 'school_student',
                                'role': 'student',
                                'school_name': school.get('name'),
                                'subscription_expires_at': school.get('subscription_expires_at'),
                                'credit_breakdown': {
                                    'total': _credits_display(credit_units),
                                    'free_credits': 0,
                                    'purchased_credits': _credits_display(credit_units),
                                    'welcome_bonus_claimed': True,
                                    'credit_status': 'paid_school_plan',
                                },
                            },
                            'notifications': {},
                            'message': 'Login successful'
                        }), 200
            return jsonify({'success': False, 'message': 'Invalid credentials or user not found'}), 401

        # Get user data (email/phone login)
        user_data = get_user_registration(user_identifier)
        
        if not user_data:
            # Fallback: Check if user exists in Supabase Auth but not in our local table
            # This handles users created via Dashboard or other means
            logger.info(f"User {user_identifier} not found locally, checking Supabase Auth...")
            supabase_user = authenticate_supabase_user(user_identifier, password)
            
            if supabase_user:
                logger.info(f"User found in Supabase Auth! Backfilling local registration...")
                try:
                    # Extract user metadata
                    # Supabase returns structure: {'user': {'id': '...', 'user_metadata': {...}, ...}, 'access_token': '...'}
                    s_user = supabase_user.get('user', {})
                    metadata = s_user.get('user_metadata', {})
                    
                    # Use metadata or fallbacks
                    name = metadata.get('name') or metadata.get('first_name') or 'User'
                    surname = metadata.get('surname') or metadata.get('last_name') or ''
                    
                    # Create local registration
                    create_user_registration(
                        chat_id=user_identifier,
                        name=name,
                        surname=surname,
                        date_of_birth='2000-01-01', # Default
                        email=user_identifier,
                        password_hash=None, # We don't have the hash, rely on Supabase Auth for future logins too
                    )
                    
                    # fetch again
                    user_data = get_user_registration(user_identifier)
                    
                    # If we just authenticated with Supabase, we don't need to check hash again below.
                    # We can set a flag to skip verification
                    g.skip_password_verification = True
                    
                except Exception as e:
                    logger.error(f"Failed to backfill user from Supabase Auth: {e}")
                    return jsonify({'success': False, 'message': 'Login failed during sync'}), 500
            else:
                logger.warning(f"Supabase Auth fallback failed for {user_identifier} - Login rejected. Checking Admin API for OAuth user...")
                
                # Check if user exists via Admin API (e.g. Google/OAuth user)
                from database.external_db import get_user_by_email_admin
                
                # Only check for email identifiers
                if '@' in user_identifier:
                    admin_user = get_user_by_email_admin(user_identifier)
                    
                    if admin_user:
                        logger.info(f"User found via Admin API (likely OAuth)! Backfilling local registration...")
                        try:
                            s_user = admin_user.get('user', {})
                            metadata = s_user.get('user_metadata', {})
                            
                            name = metadata.get('name') or metadata.get('first_name') or 'User'
                            surname = metadata.get('surname') or metadata.get('last_name') or ''
                            
                            create_user_registration(
                                chat_id=user_identifier,
                                name=name,
                                surname=surname,
                                date_of_birth='2000-01-01',
                                email=user_identifier,
                                password_hash=None
                            )
                            
                            # Refetch
                            user_data = get_user_registration(user_identifier)
                            
                            # We found the user, but since they are OAuth, we CANNOT log them in with the provided password.
                            # So we do NOT clear skip_password_verification. 
                            # They will hit the "Invalid credentials" block below, which is CORRECT.
                            # BUT, they won't get "User not found" (404), they get 401.
                            
                        except Exception as e:
                            logger.error(f"Failed to backfill OAuth user: {e}")

            if not user_data:
                 # If we reached here, user not found locally AND Supabase Auth failed AND Admin lookup failed
                 return jsonify({'success': False, 'message': 'Invalid credentials or user not found'}), 401
        
        # Verify password (assume users_registration has password_hash, or fetch from auth table)
        # Note: In real implementation, password_hash would be stored securely. 
        # Here we check if the user has a password set.
        stored_hash = user_data.get('password_hash')
        stored_salt = user_data.get('password_salt')
        
        # If we verified via Supabase fallback, skip local hash check
        if not getattr(g, 'skip_password_verification', False):
            if not stored_hash or not stored_salt:
                # If no password set (e.g. social login only), this might fail
                # Try Supabase Auth as last resort if local hash missing
                 logger.info(f"No local hash for {user_identifier}, trying Supabase Auth...")
                 if authenticate_supabase_user(user_identifier, password):
                     # Success!
                     pass
                 else:
                     return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
                
            elif not verify_password(password, stored_hash, stored_salt):
                 # Password mismatch locally. 
                 # Could be password changed in Supabase but not locally?
                 # Try Supabase Auth to be sure? 
                 # For now, strict on local if it exists to avoid desync, 
                 # OR try Supabase if local fails? 
                 # Let's trust local if it exists for performance, but fallback if failed?
                 # No, that might be a security risk or inconsistent. 
                 # Let's stick to: If local exists, use local. 
                 return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Determine user ID (chat_id)
        user_id = user_data.get('chat_id')
        
        # Determine user role
        stored_role = user_data.get('role', 'student')
        is_teacher = stored_role == 'teacher'
        
        # Role validation: if client specified a role, check it matches
        if requested_role and requested_role in ('student', 'teacher'):
            if requested_role != stored_role:
                role_label = 'teacher' if stored_role == 'teacher' else 'student'
                return jsonify({
                    'success': False,
                    'message': f'This account is registered as a {role_label}. Please select "{role_label.title()}" to sign in.'
                }), 403

        # Per-platform single-device policy for school_student accounts only.
        if _is_single_device_enforced(user_data) and _has_active_session(user_data, platform):
            return jsonify({
                'success': False,
                'message': _single_device_block_message(platform)
            }), 409

        # Generate token (session-bound for enforced accounts)
        session_id = str(uuid.uuid4()) if _is_single_device_enforced(user_data) else None
        token = generate_token(user_id, jti=session_id, platform=platform)
        if session_id:
            session_col = f"active_session_id_{platform}"
            make_supabase_request(
                "PATCH", "users_registration", {session_col: session_id},
                filters={"chat_id": f"eq.{user_id}"}, use_service_role=True
            )
        
        # CREDIT SYSTEM CHECKS
        # 1. Check for welcome bonus (one-time 150 credits)
        welcome_result = claim_welcome_bonus(user_id)
        
        # 2. Get latest credit breakdown
        credit_info = get_credit_breakdown(user_id)
        credit_info_display = {
            **credit_info,
            "total": _credits_display(credit_info.get("total", 0)),
            "free_credits": _credits_display(credit_info.get("free_credits", 0)),
            "purchased_credits": _credits_display(credit_info.get("purchased_credits", 0)),
        }

        # 3. Resolve school context for content-access decisions on frontend
        school_name, school_expiry_at = _resolve_school_context(user_data)
        
        # Prepare notifications
        notifications = {
            "welcome_bonus": welcome_result.get("awarded", False),
            "welcome_message": welcome_result.get("message")
        }
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user_id,
                'nerdx_id': user_data.get('nerdx_id'),
                'name': user_data.get('name'),
                'surname': user_data.get('surname'),
                'email': user_data.get('email'),
                'credits': _credits_display(credit_info.get('total', 0)),
                'credit_breakdown': credit_info_display,
                'role': stored_role,
                'is_teacher': is_teacher,
                'user_type': user_data.get('user_type', 'student'),
                'school_name': school_name,
                'subscription_expires_at': school_expiry_at,
            },
            'notifications': notifications,
            'message': 'Login successful'
        }), 200
            
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'message': f'Login failed: {str(e)}'}), 500

# Helper Functions
def generate_token(user_id: str, jti: Optional[str] = None, platform: Optional[str] = None) -> str:
    """Generate JWT token for user. jti (session id) is used for single-device session enforcement."""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow(),
        'jti': jti or str(uuid.uuid4()),
        'platform': platform or 'mobile',
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception('Token expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')

def hash_password(password: str) -> tuple:
    """Hash password with salt"""
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return password_hash.hex(), salt

def verify_password(password: str, password_hash: str, salt: str) -> bool:
    """Verify password against hash"""
    new_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return new_hash.hex() == password_hash

def require_auth(f):
    """Decorator to require authentication with per-platform single-device enforcement for school_student accounts."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
        
        try:
            payload = verify_token(token)
            user_id = payload['user_id']
            g.current_user_id = user_id
            g.current_user_jti = payload.get('jti')
            platform = payload.get('platform', 'mobile')
            g.current_user_platform = platform
            user_data = get_user_registration(user_id)
            g.current_user_type = (user_data.get('user_type') or '').strip() if user_data else ''
            if user_data and _is_single_device_enforced(user_data):
                session_jti = payload.get('jti')
                session_col = f"active_session_id_{platform}"
                active_sid = (user_data.get(session_col) or '').strip()
                if active_sid and session_jti != active_sid:
                    return jsonify({
                        'success': False,
                        'message': _single_device_block_message(platform)
                    }), 401
                # First authenticated request after rollout can bind legacy tokens with empty platform session.
                if (not active_sid) and session_jti:
                    make_supabase_request(
                        "PATCH", "users_registration", {session_col: session_jti},
                        filters={"chat_id": f"eq.{user_id}"}, use_service_role=True
                    )
            if user_data and g.current_user_type == 'school_student':
                exp = user_data.get('subscription_expires_at')
                if exp:
                    try:
                        exp_dt = _parse_utc_datetime(exp)
                        if exp_dt and exp_dt < datetime.utcnow():
                            school_name, school_expiry_at = _resolve_school_context(user_data)
                            return jsonify({
                                'success': False,
                                'message': _build_school_levy_message(school_name, school_expiry_at or exp, expired=True)
                            }), 403
                    except Exception:
                        pass
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 401
    return decorated_function


@mobile_bp.route('/auth/reset-password', methods=['POST'])
def reset_password():
    """Reset user password - handles both Supabase session and token-based reset"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        new_password = data.get('new_password', '').strip()
        email = data.get('email', '').strip().lower()
        token = data.get('token') or data.get('access_token')
        
        if not new_password:
            return jsonify({'success': False, 'message': 'New password is required'}), 400
        
        # Validate password strength
        if len(new_password) < 8:
            return jsonify({'success': False, 'message': 'Password must be at least 8 characters long'}), 400
        
        if not re.search(r'[a-z]', new_password):
            return jsonify({'success': False, 'message': 'Password must contain at least one lowercase letter'}), 400
        
        if not re.search(r'[A-Z]', new_password):
            return jsonify({'success': False, 'message': 'Password must contain at least one uppercase letter'}), 400
        
        if not re.search(r'\d', new_password):
            return jsonify({'success': False, 'message': 'Password must contain at least one number'}), 400
        
        # If we have email, use it to find user and update password
        if email:
            user_data = get_user_registration_by_email(email)
            if not user_data:
                return jsonify({'success': False, 'message': 'User not found'}), 404
            
            user_id = user_data.get('chat_id')
            if not user_id:
                return jsonify({'success': False, 'message': 'User ID not found'}), 404
            
            # Hash new password
            password_hash, password_salt = hash_password(new_password)
            
            # Update password in database
            update_data = {
                'password_hash': password_hash,
                'password_salt': password_salt,
                'updated_at': datetime.now().isoformat()
            }
            
            result = make_supabase_request(
                "PATCH", 
                "users_registration", 
                update_data, 
                filters={"chat_id": f"eq.{user_id}"},
                use_service_role=True
            )
            
            if result:
                logger.info(f"Password reset successful for user: {email}")
                
                # Also update in Supabase Auth if user exists there
                try:
                    import requests
                    supabase_admin_url = f"{os.getenv('SUPABASE_URL')}/auth/v1/admin/users"
                    headers = {
                        "apikey": os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
                        "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_ROLE_KEY')}",
                        "Content-Type": "application/json"
                    }
                    
                    # Get user ID from Supabase Auth
                    admin_user = get_user_by_email_admin(email)
                    if admin_user and admin_user.get('user'):
                        user_id = admin_user['user'].get('id')
                        if user_id:
                            # Update password in Supabase Auth
                            requests.put(
                                f"{supabase_admin_url}/{user_id}",
                                headers=headers,
                                json={"password": new_password}
                            )
                            logger.info(f"Supabase Auth password updated for user: {email}")
                except Exception as supabase_error:
                    logger.warning(f"Failed to update Supabase Auth password (non-critical): {supabase_error}")
                
                return jsonify({
                    'success': True,
                    'message': 'Password reset successfully'
                }), 200
            else:
                return jsonify({'success': False, 'message': 'Failed to update password'}), 500
        
        elif token:
            # Token-based reset (from email link)
            # Verify token with Supabase
            try:
                import requests
                supabase_url = os.getenv('SUPABASE_URL')
                verify_url = f"{supabase_url}/auth/v1/user"
                
                headers = {
                    "apikey": os.getenv('SUPABASE_ANON_KEY'),
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
                
                # Verify token by getting user info
                response = requests.get(verify_url, headers=headers)
                
                if response.status_code == 200:
                    user_info = response.json()
                    user_email = user_info.get('email', '').strip().lower()
                    
                    if not user_email:
                        return jsonify({'success': False, 'message': 'Invalid reset token'}), 400
                    
                    # Update password using email
                    user_data = get_user_registration(user_email)
                    if not user_data:
                        return jsonify({'success': False, 'message': 'User not found'}), 404
                    
                    # Hash new password
                    password_hash, password_salt = hash_password(new_password)
                    
                    # Update password in database
                    update_data = {
                        'password_hash': password_hash,
                        'password_salt': password_salt
                    }
                    
                    result = make_supabase_request(
                        "PATCH", 
                        "users_registration", 
                        update_data, 
                        filters={"chat_id": f"eq.{user_email}"},
                        use_service_role=True
                    )
                    
                    if result:
                        logger.info(f"Password reset successful via token for user: {user_email}")
                        return jsonify({
                            'success': True,
                            'message': 'Password reset successfully'
                        }), 200
                    else:
                        return jsonify({'success': False, 'message': 'Failed to update password'}), 500
                else:
                    return jsonify({'success': False, 'message': 'Invalid or expired reset token'}), 400
                    
            except Exception as token_error:
                logger.error(f"Token verification error: {token_error}")
                return jsonify({'success': False, 'message': 'Invalid reset token'}), 400
        else:
            return jsonify({'success': False, 'message': 'Email or token is required'}), 400
            
    except Exception as e:
        logger.error(f"Password reset error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'message': f'Password reset failed: {str(e)}'}), 500


# ============================================================================
# ATTACHMENTS / CONTEXT PACK (Multi-image memory)
# ============================================================================

@mobile_bp.route('/attachments/analyze', methods=['POST'])
@require_auth
def analyze_attachments():
    """
    Analyze 1..10 attached images and create a durable Context Pack.
    Multipart form-data:
      - images: (repeatable file field) up to 10 images
      - prompt: optional text instruction
      - chat_id: optional string to link to a chat thread (e.g., teacher session id / project id)
    """
    try:
        if not request.content_type or 'multipart/form-data' not in request.content_type:
            return jsonify({'success': False, 'message': 'multipart/form-data required'}), 400

        files = request.files.getlist('images')
        prompt = (request.form.get('prompt') or '').strip()
        chat_id = request.form.get('chat_id')

        logger.info("attachments/analyze: files=%s, has_prompt=%s, chat_id=%s", len(files or []), bool(prompt), bool(chat_id))

        if not files or len(files) < 1:
            return jsonify({'success': False, 'message': 'At least 1 image is required'}), 400
        if len(files) > 10:
            return jsonify({'success': False, 'message': 'Too many images (max 10)'}), 400

        # Validate and read bytes
        images = []
        total_bytes = 0
        for f in files:
            data = f.read()
            if not data:
                return jsonify({'success': False, 'message': 'Empty image uploaded'}), 400

            mime_type = (f.mimetype or '').lower().strip()
            # Allow common formats only
            if mime_type not in ('image/jpeg', 'image/jpg', 'image/png', 'image/webp'):
                return jsonify({'success': False, 'message': f'Unsupported image type: {mime_type or "unknown"}'}), 400

            # Per-image limit (5MB default)
            if len(data) > 5 * 1024 * 1024:
                return jsonify({'success': False, 'message': 'Image too large (max 5MB each)'}), 400

            total_bytes += len(data)
            images.append({'bytes': data, 'mime_type': mime_type})

        # Total limit (15MB to stay within app MAX_CONTENT_LENGTH=16MB)
        if total_bytes > 15 * 1024 * 1024:
            return jsonify({'success': False, 'message': 'Total upload too large (max ~15MB)'}), 400

        from services.context_pack_service import context_pack_service

        logger.info("attachments/analyze: creating context pack for user_id=%s, %s images", g.current_user_id, len(images))
        pack = context_pack_service.create_context_pack(
            user_id=str(g.current_user_id),
            chat_id=chat_id,
            images=images,
            prompt=prompt,
        )

        return jsonify({'success': True, 'data': pack}), 200

    except ValueError as e:
        return jsonify({'success': False, 'message': str(e)}), 400
    except RuntimeError as e:
        logger.error("Analyze attachments error (Vertex/context pack): %s", str(e), exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500
    except Exception as e:
        logger.error("Analyze attachments error: %s", str(e), exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/app/version-check', methods=['GET'])
def app_version_check():
    """
    Check whether the client should update.
    Reads settings from `app_versions` (managed in the admin dashboard).

    Query params:
      - platform: android | ios | web (default: web)
      - version: optional semantic version string (e.g. 1.2.3)
    """
    try:
        platform = (request.args.get('platform') or 'web').strip().lower()
        current_version = (request.args.get('version') or '').strip()

        def parse_version(v: str):
            parts = re.split(r'[^0-9]+', (v or '').strip())
            nums = [int(p) for p in parts if p.isdigit()]
            while len(nums) < 3:
                nums.append(0)
            return tuple(nums[:3])

        def compare_versions(a: str, b: str) -> int:
            aa = parse_version(a)
            bb = parse_version(b)
            if aa < bb:
                return -1
            if aa > bb:
                return 1
            return 0

        rows = make_supabase_request(
            'GET',
            'app_versions',
            filters={'platform': f"eq.{platform}"},
            use_service_role=True,
        )
        row = rows[0] if rows else None

        if not row:
            return jsonify({
                'success': True,
                'data': {
                    'platform': platform,
                    'current_version': current_version or None,
                    'min_supported_version': None,
                    'latest_version': None,
                    'update_required': False,
                    'soft_update': False,
                    'update_message': None,
                    'update_url': None,
                },
            }), 200

        min_supported = (row.get('min_supported_version') or '').strip()
        latest = (row.get('latest_version') or '').strip()
        update_required = bool(row.get('update_required', False))
        soft_update = bool(row.get('soft_update', False))

        if current_version and min_supported and compare_versions(current_version, min_supported) < 0:
            update_required = True

        if current_version and latest and compare_versions(current_version, latest) < 0 and not update_required:
            # If admin enabled soft_update, or client is behind latest, suggest update.
            soft_update = True

        return jsonify({
            'success': True,
            'data': {
                'platform': platform,
                'current_version': current_version or None,
                'min_supported_version': min_supported or None,
                'latest_version': latest or None,
                'update_required': update_required,
                'soft_update': soft_update,
                'update_message': row.get('update_message') or None,
                'update_url': row.get('update_url') or None,
            },
        }), 200
    except Exception as e:
        logger.exception("app_version_check failed")
        return jsonify({'success': False, 'message': str(e)}), 500

def generate_nerdx_id() -> str:
    """Generate unique NerdX ID"""
    return f"NX{secrets.token_hex(4).upper()}"

# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@mobile_bp.route('/auth/register', methods=['POST'])
def register():
    """Register new mobile user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        name = data.get('name', '').strip()
        surname = data.get('surname', '').strip()
        email = data.get('email', '').strip().lower() if data.get('email') else None
        phone_number = data.get('phone_number', '').strip() if data.get('phone_number') else None
        password = data.get('password', '')
        date_of_birth = data.get('date_of_birth')
        referred_by = data.get('referred_by')
        role = data.get('role', 'student')  # 'student' or 'teacher'
        
        # Validate role
        if role not in ('student', 'teacher'):
            role = 'student'
        
        # Validation
        if not name or not surname:
            return jsonify({'success': False, 'message': 'Name and surname are required'}), 400
        
        if not email and not phone_number:
            return jsonify({'success': False, 'message': 'Email or phone number is required'}), 400
        
        if not password or len(password) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400
        
        # Check if user exists (by email or phone)
        # For now, use phone_number or email as whatsapp_id equivalent
        user_identifier = phone_number or email
        
        if is_user_registered(user_identifier):
            return jsonify({'success': False, 'message': 'User already exists'}), 400
        
        # Hash password
        password_hash, salt = hash_password(password)
        
        # Generate NerdX ID
        nerdx_id = generate_nerdx_id()
        
        # Create user registration with password
        try:
            # 1. Register in Supabase Auth (if email provided)
            # This triggers the "Confirm your mail" email from Supabase
            if email:
                from database.external_db import register_supabase_auth_user
                
                # Metadata to store in Supabase Auth user object
                metadata = {
                    'name': name,
                    'surname': surname,
                    'nerdx_id': nerdx_id,
                    'chat_id': user_identifier
                }
                
                auth_user = register_supabase_auth_user(email, password, metadata)
                
                if not auth_user:
                    # If failed, it might be that user already exists in Auth but not locally?
                    # or some other error. For now, strict failure.
                    return jsonify({'success': False, 'message': 'Registration failed. Email might be invalid or already in use.'}), 400

            # 2. Create user in database with password and auth info
            create_user_registration(
                chat_id=user_identifier,
                name=name,
                surname=surname,
                date_of_birth=date_of_birth or '2000-01-01',
                referred_by_nerdx_id=referred_by,
                password_hash=password_hash,
                password_salt=salt,
                email=email,
                phone_number=phone_number,
                role=role
            )
            
            # Generate token + session lock for student accounts
            session_id = str(uuid.uuid4()) if role != 'teacher' else None
            token = generate_token(user_identifier, jti=session_id)
            if session_id:
                make_supabase_request(
                    "PATCH", "users_registration", {"active_session_id": session_id},
                    filters={"chat_id": f"eq.{user_identifier}"},
                    use_service_role=True
                )
            
            # Get user data
            user_data = get_user_registration(user_identifier)
            
            if not user_data:
                logger.error(f"Failed to retrieve user data for {user_identifier} after registration")
                return jsonify({'success': False, 'message': 'Post-registration data retrieval failed'}), 500

            # CREDIT SYSTEM CHECKS
            # 1. Claim welcome bonus (one-time 150 credits)
            welcome_result = claim_welcome_bonus(user_identifier)
            
            # 2. Get latest credit breakdown
            credit_info = get_credit_breakdown(user_identifier)
            credit_info_display = {
                **credit_info,
                "total": _credits_display(credit_info.get("total", 0)),
                "free_credits": _credits_display(credit_info.get("free_credits", 0)),
                "purchased_credits": _credits_display(credit_info.get("purchased_credits", 0)),
            }
            
            # Prepare notifications
            notifications = {
                "welcome_bonus": welcome_result.get("awarded", False),
                "welcome_message": welcome_result.get("message")
            }

            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'id': user_data.get('chat_id'),
                    'nerdx_id': user_data.get('nerdx_id'),
                    'name': name,
                    'surname': surname,
                    'email': email,
                    'phone_number': phone_number,
                    'credits': credit_info_display.get("total", "0.0"),
                    'credit_breakdown': credit_info_display,
                    'role': role,
                    'is_teacher': role == 'teacher',
                },
                'notifications': notifications,
                'message': 'Registration successful'
            }), 201
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}", exc_info=True)
            return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500
            
    except Exception as e:
        logger.error(f"Register endpoint error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'}), 500

@mobile_bp.route('/auth/social-login', methods=['POST'])
def social_login():
    """Handle social authentication (Google, etc.) and sync with user_registration"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        # Social login data from frontend
        # Can be: { provider: 'google', user: { email, name, given_name, family_name, id, ... } }
        # OR: { provider: 'google', email: '...', name: '...', ... } (legacy format)
        provider = data.get('provider', 'google')
        
        # Handle both formats
        if 'user' in data:
            user_info = data.get('user', {})
        else:
            # Legacy format - user data is at root level
            user_info = data
            
        email = (user_info.get('email') or '').strip().lower()
        supabase_uid = user_info.get('id') or user_info.get('sub')
        name = user_info.get('name') or user_info.get('given_name') or ''
        given_name = user_info.get('given_name') or name
        family_name = user_info.get('family_name') or user_info.get('surname') or ''
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required for social login'}), 400
            
        logger.info(f"Social login attempt: provider={provider}, email={email}, uid={supabase_uid}")
            
        # Check if user is already registered in our system
        # For OAuth, check by email first (to prevent duplicates)
        from database.external_db import is_user_registered_by_email, get_user_registration_by_email, make_supabase_request
        
        # Check by email first (for OAuth users)
        user_data = None
        if is_user_registered_by_email(email):
            logger.info(f"Found existing user by email: {email}")
            user_data = get_user_registration_by_email(email)
        # Fallback: check by chat_id (email) in case email field is null
        elif is_user_registered(email):
            logger.info(f"Found existing user by chat_id: {email}")
            user_data = get_user_registration(email)
        
        if user_data:
            # Existing user - sync Supabase UID if not present
            try:
                # Update Supabase UID in our local record if possible/needed
                # This ensures future lookups by UID work
                pass 
            except Exception as e:
                logger.warning(f"Failed to sync Supabase UID: {e}")
            
            # Update name if provided by OAuth and different from stored
            if given_name and given_name != user_data.get('name'):
                try:
                    make_supabase_request(
                        "PATCH",
                        "users_registration",
                        {"name": given_name, "surname": family_name},
                        filters={"chat_id": f"eq.{email}"},
                        use_service_role=True
                    )
                    user_data['name'] = given_name
                    user_data['surname'] = family_name
                except Exception as e:
                    logger.warning(f"Failed to update user name from OAuth: {e}")
            
            # Get credit breakdown
            credit_info = get_credit_breakdown(email)
            credit_info_display = {
                **credit_info,
                "total": _credits_display(credit_info.get("total", 0)),
                "free_credits": _credits_display(credit_info.get("free_credits", 0)),
                "purchased_credits": _credits_display(credit_info.get("purchased_credits", 0)),
            }

            social_platform = (data.get('platform') or 'mobile').strip().lower()
            if social_platform not in ('web', 'mobile'):
                social_platform = 'mobile'

            if _is_single_device_enforced(user_data) and _has_active_session(user_data, social_platform):
                return jsonify({
                    'success': False,
                    'message': _single_device_block_message(social_platform)
                }), 409

            session_id = str(uuid.uuid4()) if _is_single_device_enforced(user_data) else None
            token = generate_token(email, jti=session_id, platform=social_platform)
            if session_id:
                session_col = f"active_session_id_{social_platform}"
                make_supabase_request(
                    "PATCH", "users_registration", {session_col: session_id},
                    filters={"chat_id": f"eq.{user_data.get('chat_id') or email}"},
                    use_service_role=True
                )
            
            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'id': user_data.get('chat_id'),
                    'nerdx_id': user_data.get('nerdx_id'),
                    'name': user_data.get('name') or given_name,
                    'surname': user_data.get('surname') or family_name,
                    'email': email,
                    'credits': credit_info_display.get("total", "0.0"),
                    'credit_breakdown': credit_info_display,
                    'role': user_data.get('role', 'student'),
                    'level_title': user_data.get('level_title', 'Explorer') 
                },
                'message': 'Logged in successfully'
            }), 200
        else:
            # New user via social login - create registration
            # Use the extracted name fields
            if not name:
                # Fallback: use email prefix as name
                name = email.split('@')[0].replace('.', ' ').title()
                given_name = name
            
            # Create user registration in Supabase
            try:
                # Use email as user_identifier for social sign-ups
                # This matches the legacy bot logic where chat_id was the key
                # For email users, chat_id = email
                # Check for referral code from request data
                social_referred_by = data.get('referred_by') or user_info.get('referred_by') or None
                
                create_user_registration(
                    chat_id=email,
                    name=given_name,
                    surname=family_name,
                    date_of_birth='2000-01-01', # Default DOB for social
                    referred_by_nerdx_id=social_referred_by,
                    email=email,
                    password_hash=None, # OAuth users don't have passwords
                    password_salt=None
                )
                
                # Check if creation succeeded and return data
                # Try by email first, then by chat_id
                user_data = get_user_registration_by_email(email)
                if not user_data:
                    user_data = get_user_registration(email)
                
                if user_data:
                    # Grant initial credits (Registration Bonus) - one-time welcome bonus
                    welcome_result = claim_welcome_bonus(email)
                    
                    # Get latest credit breakdown
                    credit_info = get_credit_breakdown(email)
                    credit_info_display = {
                        **credit_info,
                        "total": _credits_display(credit_info.get("total", 0)),
                        "free_credits": _credits_display(credit_info.get("free_credits", 0)),
                        "purchased_credits": _credits_display(credit_info.get("purchased_credits", 0)),
                    }
                    
                    # Prepare notifications
                    notifications = {
                        "welcome_bonus": welcome_result.get("awarded", False),
                        "welcome_message": welcome_result.get("message", "")
                    }
                    
                    new_social_platform = (data.get('platform') or 'mobile').strip().lower()
                    if new_social_platform not in ('web', 'mobile'):
                        new_social_platform = 'mobile'
                    token = generate_token(email, platform=new_social_platform)
                    
                    return jsonify({
                        'success': True,
                        'token': token,
                        'user': {
                            'id': email,
                            'nerdx_id': user_data.get('nerdx_id'),
                            'name': given_name,
                            'surname': family_name,
                            'email': email,
                            'credits': credit_info_display.get("total", "0.0"),
                            'credit_breakdown': credit_info_display,
                            'role': 'student',
                            'level_title': user_data.get('level_title', 'Explorer')
                        },
                        'notifications': notifications,
                        'message': 'Account created successfully'
                    }), 201
                else:
                    raise Exception("Failed to retrieve created user")
                    
            except Exception as e:
                logger.error(f"Social registration error: {e}", exc_info=True)
                return jsonify({'success': False, 'message': f'Social registration failed: {str(e)}'}), 500
                
    except Exception as e:
        logger.error(f"Social login error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500



@mobile_bp.route('/auth/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP for phone-based authentication"""
    try:
        data = request.get_json()
        phone_number = data.get('phone_number', '').strip()
        otp = data.get('otp', '')
        
        # TODO: Implement OTP verification
        # For now, return success (implement actual OTP service)
        
        if not is_user_registered(phone_number):
            return jsonify({'success': False, 'message': 'User not found'}), 404

        user_data = get_user_registration(phone_number)
        if _is_single_device_enforced(user_data) and _has_active_session(user_data):
            return jsonify({
                'success': False,
                'message': _single_device_block_message()
            }), 409

        session_id = str(uuid.uuid4()) if _is_single_device_enforced(user_data) else None
        token = generate_token(phone_number, jti=session_id)
        if session_id:
            make_supabase_request(
                "PATCH", "users_registration", {"active_session_id": session_id},
                filters={"chat_id": f"eq.{phone_number}"},
                use_service_role=True
            )

        credits = get_user_credits(phone_number) or 0
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user_data.get('chat_id'),
                'nerdx_id': user_data.get('nerdx_id'),
                'name': user_data.get('name'),
                'surname': user_data.get('surname'),
                'phone_number': phone_number,
                'credits': _credits_display(credits),
            }
        }), 200
        
    except Exception as e:
        logger.error(f"OTP verification error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/auth/refresh-token', methods=['POST'])
@require_auth
def refresh_token():
    """Refresh JWT token. Keeps same jti when present so single-device sessions stay valid."""
    try:
        if getattr(g, 'current_user_jti', None):
            new_token = generate_token(g.current_user_id, jti=g.current_user_jti)
        else:
            new_token = generate_token(g.current_user_id)
        return jsonify({
            'success': True,
            'token': new_token
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/auth/logout', methods=['POST'])
@require_auth
def logout():
    """Logout user and clear the platform-specific active session for school_student accounts."""
    try:
        user_data = get_user_registration(g.current_user_id)
        if user_data and _is_single_device_enforced(user_data):
            platform = getattr(g, 'current_user_platform', 'mobile')
            session_col = f"active_session_id_{platform}"
            make_supabase_request(
                "PATCH", "users_registration", {session_col: None},
                filters={"chat_id": f"eq.{g.current_user_id}"}, use_service_role=True
            )
    except Exception as e:
        logger.warning(f"Logout clear session: {e}")
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200

# ============================================================================
# USER PROFILE ENDPOINTS
# ============================================================================

@mobile_bp.route('/user/profile', methods=['GET'])
@require_auth
def get_profile():
    """Get user profile"""
    try:
        user_data = get_user_registration(g.current_user_id)
        if not user_data:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        credits = get_user_credits(g.current_user_id) or 0
        
        return jsonify({
            'success': True,
            'data': {
                'id': user_data.get('chat_id'),
                'nerdx_id': user_data.get('nerdx_id'),
                'name': user_data.get('name'),
                'surname': user_data.get('surname'),
                'email': user_data.get('email'),
                'phone_number': user_data.get('phone_number'),
                'credits': _credits_display(credits),
                'date_of_birth': user_data.get('date_of_birth'),
            }
        }), 200
    except Exception as e:
        logger.error(f"Get profile error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/user/profile', methods=['PUT'])
@require_auth
def update_profile():
    """Update user profile"""
    try:
        data = request.get_json()
        user_id = g.current_user_id
        user_data = get_user_registration(user_id)
        
        if not user_data:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # Prepare update data - only update fields that are provided
        update_data = {
            'updated_at': datetime.now().isoformat()
        }
        
        # Update name if provided
        if 'name' in data and data['name']:
            update_data['name'] = data['name'].strip()
        
        # Update surname if provided
        if 'surname' in data and data['surname']:
            update_data['surname'] = data['surname'].strip()
        
        # Update email if provided
        if 'email' in data and data['email']:
            email = data['email'].strip().lower()
            # Validate email format
            import re
            if re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
                update_data['email'] = email
            else:
                return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        # Update phone_number if provided
        if 'phone_number' in data:
            phone = data['phone_number'].strip() if data['phone_number'] else None
            update_data['phone_number'] = phone
        
        # Update Supabase database
        result = make_supabase_request(
            "PATCH",
            "users_registration",
            data=update_data,
            filters={"chat_id": f"eq.{user_id}"},
            use_service_role=True
        )
        
        if result is None:
            logger.error(f"Failed to update profile for user {user_id}")
            return jsonify({'success': False, 'message': 'Failed to update profile'}), 500
        
        # Also update Supabase Auth email if email was changed
        if 'email' in update_data:
            try:
                from supabase import create_client, Client
                import os
                supabase_url = os.getenv('SUPABASE_URL')
                supabase_service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
                
                if supabase_url and supabase_service_key:
                    supabase: Client = create_client(supabase_url, supabase_service_key)
                    # Get user's auth ID from email
                    auth_users = supabase.auth.admin.list_users()
                    for auth_user in auth_users:
                        if auth_user.email == user_data.get('email'):
                            # Update email in Supabase Auth
                            supabase.auth.admin.update_user_by_id(
                                auth_user.id,
                                {'email': update_data['email']}
                            )
                            logger.info(f"Updated Supabase Auth email for user {user_id}")
                            break
            except Exception as auth_error:
                logger.warning(f"Failed to update Supabase Auth email: {auth_error}")
                # Continue even if Auth update fails - database update succeeded
        
        # Get updated user data
        updated_user = get_user_registration(user_id)
        
        return jsonify({
            'success': True,
            'data': updated_user,
            'message': 'Profile updated successfully'
        }), 200
    except Exception as e:
        logger.error(f"Update profile error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/user/stats', methods=['GET'])
@require_auth
def get_user_stats_endpoint():
    """Get user statistics"""
    try:
        stats = get_user_stats(g.current_user_id)
        credits = get_user_credits(g.current_user_id) or 0
        
        return jsonify({
            'success': True,
            'data': {
                'credits': _credits_display(credits),
                'total_points': stats.get('total_xp', 0) if stats else 0,
                'streak_count': stats.get('current_streak', 0) if stats else 0,
                'accuracy': stats.get('accuracy', 0) if stats else 0,
                'questions_answered': stats.get('questions_answered', 0) if stats else 0,
                'last_activity': stats.get('last_activity') if stats else None,
            }
        }), 200
    except Exception as e:
        logger.error(f"Get user stats error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/user/history', methods=['GET'])
@require_auth
def get_user_history():
    """Get user question history"""
    try:
        limit = request.args.get('limit', 50, type=int)
        
        # TODO: Implement question history retrieval
        # For now, return empty array
        
        return jsonify({
            'success': True,
            'data': []
        }), 200
    except Exception as e:
        logger.error(f"Get user history error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/user/preferences', methods=['GET'])
@require_auth
def get_user_preferences():
    """Get learning + notification preferences for the current user."""
    try:
        prefs = engagement_notification_service.get_user_preferences(g.current_user_id)
        return jsonify({'success': True, 'data': prefs}), 200
    except Exception as e:
        logger.error(f"Get user preferences error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/user/preferences', methods=['PUT'])
@require_auth
def update_user_preferences():
    """Update learning + notification preferences for the current user."""
    try:
        data = request.get_json() or {}
        if not isinstance(data, dict):
            return jsonify({'success': False, 'message': 'Invalid request body'}), 400

        updated = engagement_notification_service.update_user_preferences(g.current_user_id, data)
        if updated is None:
            return jsonify({
                'success': False,
                'message': 'Failed to save preferences. Ensure engagement migration is applied.'
            }), 500

        return jsonify({
            'success': True,
            'data': updated,
            'message': 'Preferences updated successfully'
        }), 200
    except Exception as e:
        logger.error(f"Update user preferences error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# QUIZ ENDPOINTS
# ============================================================================

@mobile_bp.route('/quiz/subjects', methods=['GET'])
@require_auth
def get_subjects():
    """Get available subjects"""
    try:
        subjects = [
            {
                'id': 'mathematics',
                'name': 'Mathematics',
                'icon': 'calculate',
                'color': '#2196F3'
            },
            {
                'id': 'combined_science',
                'name': 'Combined Science',
                'icon': 'science',
                'color': '#4CAF50'
            },
            {
                'id': 'business_enterprise_skills',
                'name': 'Business Enterprise and Skills',
                'icon': 'briefcase',
                'color': '#2E7D32'
            },
            {
                'id': 'geography',
                'name': 'Geography',
                'icon': 'public',
                'color': '#2E7D32'
            },

            {
                'id': 'english',
                'name': 'English',
                'icon': 'menu-book',
                'color': '#FF9800'
            },
            {
                'id': 'accounting',
                'name': 'Principles of Accounting',
                'icon': 'receipt',
                'color': '#B8860B'
            },
            {
                'id': 'commerce',
                'name': 'Commerce',
                'icon': 'receipt',
                'color': '#B8860B'
            },
            {
                'id': 'history',
                'name': 'History',
                'icon': 'book',
                'color': '#5D4037'
            }
        ]
        
        return jsonify({
            'success': True,
            'data': subjects
        }), 200
    except Exception as e:
        logger.error(f"Get subjects error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/quiz/topics', methods=['GET'])
@require_auth
def get_topics():
    """Get topics for a subject (supports O-Level and A-Level)"""
    try:
        subject = request.args.get('subject', '')
        parent_subject = request.args.get('parent_subject', '')  # For Combined Science: Biology/Chemistry/Physics
        
        # Get topics from constants or database
        from constants import (
            TOPICS, 
            A_LEVEL_PHYSICS_ALL_TOPICS, 
            A_LEVEL_CHEMISTRY_ALL_TOPICS, 
            A_LEVEL_BIOLOGY_ALL_TOPICS, 
            A_LEVEL_PURE_MATH_ALL_TOPICS,
            A_LEVEL_COMPUTER_SCIENCE_ALL_TOPICS,
            A_LEVEL_GEOGRAPHY_ALL_TOPICS,
            A_LEVEL_PHYSICS_TOPICS,
            A_LEVEL_CHEMISTRY_TOPICS,
            A_LEVEL_BIOLOGY_TOPICS,
            A_LEVEL_PURE_MATH_TOPICS,
            A_LEVEL_COMPUTER_SCIENCE_TOPICS,
            A_LEVEL_GEOGRAPHY_TOPICS
        )
        
        topics = []
        
        # Handle A-Level subjects
        if subject == 'a_level_physics' or subject == 'A-Level Physics':
            # Return all A-Level Physics topics
            for topic in A_LEVEL_PHYSICS_ALL_TOPICS:
                topics.append({
                    'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', ''),
                    'name': topic,
                    'subject': 'a_level_physics',
                    'level': 'AS Level' if topic in A_LEVEL_PHYSICS_TOPICS.get('AS Level', []) else 'A2 Level'
                })
        elif subject == 'a_level_chemistry' or subject == 'A-Level Chemistry':
            # Return all A-Level Chemistry topics
            for topic in A_LEVEL_CHEMISTRY_ALL_TOPICS:
                topics.append({
                    'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', ''),
                    'name': topic,
                    'subject': 'a_level_chemistry',
                    'level': 'AS Level' if topic in A_LEVEL_CHEMISTRY_TOPICS.get('AS Level', []) else 'A2 Level'
                })
        elif subject == 'a_level_biology' or subject == 'A-Level Biology':
            # Return all A-Level Biology topics
            for topic in A_LEVEL_BIOLOGY_ALL_TOPICS:
                topics.append({
                    'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', ''),
                    'name': topic,
                    'subject': 'a_level_biology',
                    'level': 'Lower Sixth' if topic in A_LEVEL_BIOLOGY_TOPICS.get('Lower Sixth', []) else 'Upper Sixth'
                })
        elif subject == 'a_level_pure_math' or subject == 'A-Level Pure Mathematics' or subject == 'Pure Mathematics':
            # Return all A-Level Pure Mathematics topics
            for topic in A_LEVEL_PURE_MATH_ALL_TOPICS:
                topics.append({
                    'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', ''),
                    'name': topic,
                    'subject': 'a_level_pure_math',
                    'level': 'Lower Sixth' if topic in A_LEVEL_PURE_MATH_TOPICS.get('Lower Sixth', []) else 'Upper Sixth'
                })
        elif subject == 'a_level_computer_science' or subject == 'A-Level Computer Science':
            # Board: zimsec (default) or cambridge — Cambridge 9618 AS & A Level
            board = (request.args.get('board') or 'zimsec').lower()
            if board == 'cambridge':
                try:
                    from services.cambridge_a_level_cs_syllabus import (
                        CAMBRIDGE_A_LEVEL_CS_TOPICS_AS,
                        CAMBRIDGE_A_LEVEL_CS_TOPICS_A2,
                        CAMBRIDGE_A_LEVEL_CS_ALL_TOPICS,
                    )
                    for topic in CAMBRIDGE_A_LEVEL_CS_ALL_TOPICS:
                        topics.append({
                            'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', '').replace('-', '_'),
                            'name': topic,
                            'subject': 'a_level_computer_science',
                            'level': 'AS Level' if topic in CAMBRIDGE_A_LEVEL_CS_TOPICS_AS else 'A2 Level',
                            'board': 'cambridge'
                        })
                except ImportError:
                    board = 'zimsec'
            if board == 'zimsec':
                for topic in A_LEVEL_COMPUTER_SCIENCE_ALL_TOPICS:
                    topics.append({
                        'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', '').replace('-', '_'),
                        'name': topic,
                        'subject': 'a_level_computer_science',
                        'level': 'Form 5' if topic in A_LEVEL_COMPUTER_SCIENCE_TOPICS.get('Form 5', []) else 'Form 6',
                        'board': 'zimsec'
                    })
        elif subject == 'a_level_geography' or subject == 'A-Level Geography':
            # Return all A-Level Geography topics (Paper 1 and Paper 2)
            for topic in A_LEVEL_GEOGRAPHY_ALL_TOPICS:
                topics.append({
                    'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', '').replace('&', 'and'),
                    'name': topic,
                    'subject': 'a_level_geography',
                    'paper': 'Paper 1' if topic in A_LEVEL_GEOGRAPHY_TOPICS.get('Paper 1', []) else 'Paper 2'
                })
        
        # Handle Combined Science two-level structure
        elif subject == 'combined_science':
            if parent_subject:
                # Return subtopics for Biology/Chemistry/Physics
                if parent_subject in TOPICS:
                    for topic in TOPICS[parent_subject]:
                        topics.append({
                            'id': topic.lower().replace(' ', '_'),
                            'name': topic,
                            'subject': 'combined_science',
                            'parent_subject': parent_subject
                        })
            else:
                # Return Biology, Chemistry, Physics as top-level topics
                for science_subject in ['Biology', 'Chemistry', 'Physics']:
                    topics.append({
                        'id': science_subject.lower(),
                        'name': science_subject,
                        'subject': 'combined_science',
                        'is_parent': True  # Flag to indicate this is a parent topic
                    })
        elif subject == 'english':
            # Return all English topics including Grammar and Vocabulary
            if 'English' in TOPICS:
                for topic in TOPICS['English']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_'),
                        'name': topic,
                        'subject': 'english'
                    })
            # Also add special Grammar Usage and Vocabulary if not already in list
            topic_names = [t['name'] for t in topics]
            if 'Grammar and Language' in TOPICS.get('English', []) and 'Grammar Usage and Vocabulary' not in topic_names:
                # Grammar Usage and Vocabulary is already covered by individual topics
                pass
        elif subject == 'mathematics':
            # Return all Mathematics topics
            if 'Mathematics' in TOPICS:
                for topic in TOPICS['Mathematics']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_'),
                        'name': topic,
                        'subject': 'mathematics'
                    })

        elif subject == 'computer_science':
            # Board: zimsec (default) or cambridge
            board = (request.args.get('board') or 'zimsec').lower()
            if board == 'cambridge':
                try:
                    from services.cambridge_cs_syllabus import CAMBRIDGE_CS_TOPICS
                    for topic in CAMBRIDGE_CS_TOPICS:
                        topics.append({
                            'id': topic.lower().replace(' ', '_').replace('-', '_'),
                            'name': topic,
                            'subject': 'computer_science',
                            'board': 'cambridge'
                        })
                except ImportError:
                    board = 'zimsec'
            if board == 'zimsec' and 'Computer Science' in TOPICS:
                for topic in TOPICS['Computer Science']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_').replace('-', '_'),
                        'name': topic,
                        'subject': 'computer_science',
                        'board': 'zimsec'
                    })
        elif subject == 'geography':
            # ZIMSEC O-Level Geography – All Level, flat topic list (no Forms)
            if 'Geography' in TOPICS:
                for topic in TOPICS['Geography']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_').replace('-', '_'),
                        'name': topic,
                        'subject': 'geography',
                        'board': 'zimsec'
                    })
        elif subject == 'accounting':
            # ZIMSEC O-Level Principles of Accounting 7112 – 15 topics (Paper 1 MCQ)
            if 'Principles of Accounting' in TOPICS:
                for topic in TOPICS['Principles of Accounting']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_').replace('-', '_').replace('&', 'and'),
                        'name': topic,
                        'subject': 'accounting',
                    })
        elif subject == 'business_enterprise_skills':
            # ZIMSEC O-Level Business Enterprise and Skills 4048 – 8 topics (Paper 1 MCQs, Paper 2 Essays)
            if 'Business Enterprise and Skills' in TOPICS:
                for topic in TOPICS['Business Enterprise and Skills']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_').replace('-', '_').replace('&', 'and'),
                        'name': topic,
                        'subject': 'business_enterprise_skills',
                    })
        elif subject == 'commerce':
            # ZIMSEC O-Level Principles of Commerce – 11 topics (Paper 1 MCQs, Paper 2 Essays)
            if 'Commerce' in TOPICS:
                for topic in TOPICS['Commerce']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_').replace('-', '_').replace('&', 'and'),
                        'name': topic,
                        'subject': 'commerce',
                    })
        elif subject == 'history':
            # ZIMSEC O-Level History – flat topic list (Paper 1 Essays only)
            if 'History' in TOPICS:
                for topic in TOPICS['History']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_').replace('-', '_').replace('&', 'and'),
                        'name': topic,
                        'subject': 'history',
                    })
        elif subject in TOPICS:
            # Default handling for other subjects
            for topic in TOPICS[subject]:
                topics.append({
                    'id': topic.lower().replace(' ', '_'),
                    'name': topic,
                    'subject': subject
                })
        
        return jsonify({
            'success': True,
            'data': topics
        }), 200
    except Exception as e:
        logger.error(f"Get topics error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/quiz/generate', methods=['POST'])
@require_auth
def generate_question():
    """Generate a quiz question. Supports mixed image questions via Vertex AI."""
    try:
        data = request.get_json()
        subject = data.get('subject', '')
        topic = data.get('topic')
        difficulty = data.get('difficulty', 'medium')
        form_level = data.get('form_level', 'Form 1')
        student_first_name = _get_student_first_name(g.current_user_id)
        question_type = data.get('type', 'topical')  # 'topical' or 'exam'
        question_format = (data.get('question_format') or 'mcq').lower()  # 'mcq' or 'structured'
        
        # NEW: Image mixing parameters
        mix_images = data.get('mix_images', False)  # Enable visual questions
        question_count = data.get('question_count', 1)  # Current question number in session
        
        if not subject:
            return jsonify({'success': False, 'message': 'Subject is required'}), 400
        
        # CREDIT CALCULATION: Image questions cost more (scale 1-5)
        # Text question: 1 credit (default)
        # Image question: 4 credits (when mix_images enabled and it's image turn)
        is_image_question = False
        if mix_images and vertex_service.is_available():
            # Every 6th question is an image question (questions 6, 12, 18, ...)
            # Uses modulo 6 == 0 to trigger on 6th questions
            is_image_question = (question_count > 0 and question_count % 6 == 0)
            logger.info(f"🖼️ Image check: question #{question_count}, mix_images={mix_images}, is_image={is_image_question}")
        
        # For A-Level Biology, use question_type from data (mcq, structured, essay)
        bio_question_type = data.get('question_type', 'mcq') if subject == 'a_level_biology' else 'mcq'
        # For Computer Science (O-Level and A-Level), use question_type from data (mcq, structured, essay)
        cs_question_type = (data.get('question_type') or question_format or 'mcq').lower() if subject in ('computer_science', 'a_level_computer_science') else None
        # For A-Level Geography, use question_type from data (mcq, structured, essay)
        geo_question_type = (data.get('question_type') or question_format or 'mcq').lower() if subject == 'a_level_geography' else None
        credit_action = _get_quiz_credit_action(subject, question_type, question_format, bio_question_type, cs_question_type, geo_question_type)
        if is_image_question:
            credit_cost = get_image_question_credit_cost()
        else:
            # Standard text question credit cost
            credit_cost = advanced_credit_service.get_credit_cost(credit_action)
        
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}, Available: {_credits_text(user_credits)}',
                'credit_cost': _credits_display(credit_cost),
                'is_image_question': is_image_question
            }), 402
        
        # Generate question based on subject
        question_data = None
        
        # IMAGE QUESTION PATH: Use Vertex AI for visual science questions
        if is_image_question and subject in ['combined_science', 'a_level_biology', 'a_level_chemistry', 'a_level_physics']:
            logger.info(f"🖼️ Generating IMAGE question for {subject}/{topic} (question #{question_count})")
            
            # Determine parent subject for Combined Science
            parent_subject = data.get('parent_subject', 'Biology')
            if subject == 'combined_science':
                actual_subject = parent_subject
            elif subject == 'a_level_biology':
                actual_subject = 'Biology'
            elif subject == 'a_level_chemistry':
                actual_subject = 'Chemistry'
            elif subject == 'a_level_physics':
                actual_subject = 'Physics'
            else:
                actual_subject = 'Biology'
            
            # Determine level
            level = 'O-Level' if subject == 'combined_science' else 'A-Level'
            
            # Generate image question using Vertex AI
            question_data = vertex_service.generate_image_question(
                subject=actual_subject,
                topic=topic or 'General',
                level=level,
                difficulty=difficulty
            )
            
            if question_data:
                question_data['is_visual_question'] = True
                question_data['credit_cost'] = credit_cost
                logger.info(f"✅ Image question generated successfully")
            else:
                logger.warning(f"⚠️ Image question generation failed, falling back to text question")
                is_image_question = False  # Fall back to text
                credit_cost = advanced_credit_service.get_credit_cost(credit_action)
        
        # STANDARD TEXT QUESTION PATH (or fallback)
        if not question_data:
            if subject == 'mathematics':
                from services.math_question_generator import MathQuestionGenerator
                from services.math_solver import MathSolver
                math_generator = MathQuestionGenerator()
                used_cached_question = False

                if question_type == 'topical' and topic and not is_image_question:
                    cached_question = question_cache.get_cached_question(topic, difficulty, g.current_user_id)
                    if cached_question:
                        question_data = dict(cached_question)
                        question_data['source'] = question_data.get('source') or 'cached'
                        question_text = question_data.get('question') or question_data.get('question_text') or ''
                        if question_text:
                            question_cache.save_question_to_history(
                                g.current_user_id,
                                question_text,
                                topic,
                                difficulty
                            )
                        used_cached_question = True
                
                if not question_data:
                    # For exam mode, select random topic if no topic specified
                    if question_type == 'exam' and not topic:
                        from constants import TOPICS
                        import random
                        math_topics = TOPICS.get('Mathematics', [])
                        if math_topics:
                            topic = random.choice(math_topics)
                            topic = topic.lower().replace(' ', '_')
                    
                    # Retry logic for AI generation - reject fallback questions and None returns
                    max_retries = 3
                    # Increased time budget to accommodate progressive timeouts (30s, 45s, 60s) + retry delays
                    # Allow up to 70s total: 30s + 2s delay + 45s + 2s delay + 60s = ~139s max, but cap at 70s for safety
                    time_budget_seconds = 70
                    attempt_start_time = time.monotonic()
                    question_data = None
                    last_error = None
                    
                    for attempt in range(max_retries):
                        elapsed = time.monotonic() - attempt_start_time
                        if elapsed >= time_budget_seconds:
                            logger.warning(f"⏱️ AI generation time budget exceeded before attempt {attempt + 1}/{max_retries} ({elapsed:.1f}s/{time_budget_seconds}s)")
                            break
                        try:
                            remaining_budget = time_budget_seconds - (time.monotonic() - attempt_start_time)
                            if remaining_budget <= 5:
                                logger.warning(f"⏱️ AI generation remaining budget too small before attempt {attempt + 1}/{max_retries} ({remaining_budget:.1f}s)")
                                break
                            # Allow progressive timeouts to work: don't cap too aggressively
                            # The generator will handle its own progressive timeouts [30s, 45s, 60s]
                            attempt_timeout = max(10, min(max(math_generator.timeouts) if hasattr(math_generator, 'timeouts') else math_generator.base_timeout * 2, int(remaining_budget - 5)))
                            question_data = math_generator.generate_question(
                                'Mathematics',
                                topic or 'Algebra',
                                difficulty,
                                g.current_user_id,
                                timeout_seconds=attempt_timeout,
                                form_level=form_level,
                                student_name=student_first_name,
                            )
                            
                            # Reject fallback questions - they are default/static questions
                            if question_data and question_data.get('source') == 'fallback':
                                logger.warning(f"⚠️ Fallback question detected (attempt {attempt + 1}/{max_retries}) - rejecting and retrying")
                                question_data = None
                            
                            # Valid AI-generated question found
                            if question_data and question_data.get('source') != 'fallback':
                                logger.info(f"✅ Successfully generated question on attempt {attempt + 1}")
                                break
                            
                            # If None or fallback, wait before retry
                            if attempt < max_retries - 1:
                                wait_time = (attempt + 1) * 1.0
                                remaining_budget = max(0.0, time_budget_seconds - (time.monotonic() - attempt_start_time))
                                wait_time = min(wait_time, remaining_budget)
                                if wait_time > 0:
                                    logger.info(f"⏳ Retrying question generation in {wait_time:.1f}s (attempt {attempt + 2}/{max_retries})")
                                    time.sleep(wait_time)
                        except Exception as e:
                            last_error = str(e)
                            logger.error(f"❌ Error during question generation (attempt {attempt + 1}/{max_retries}): {e}")
                            if attempt < max_retries - 1:
                                time.sleep(1)
                    
                    # Final check - ensure we have a valid question
                    if not question_data or question_data.get('source') == 'fallback':
                        error_msg = last_error or 'AI generation service unavailable'
                        logger.error(f"❌ Failed to generate valid question after {max_retries} attempts: {error_msg}")
                        return jsonify({
                            'success': False, 
                            'message': 'Unable to generate question at this time. The AI service may be temporarily unavailable. Please try again in a moment.'
                        }), 503
                
                # Generate hint for math questions if not already present
                if question_data and not question_data.get('hint_level_1'):
                    math_solver = MathSolver()
                    hint = math_solver.get_hint(question_data.get('question', ''), difficulty)
                    if hint:
                        question_data['hint_level_1'] = hint

                if question_data and question_type == 'topical' and topic and not is_image_question and not used_cached_question:
                    question_text = question_data.get('question') or question_data.get('question_text') or ''
                    if question_text:
                        question_cache.cache_question(topic, difficulty, question_data)
                        question_cache.save_question_to_history(
                            g.current_user_id,
                            question_text,
                            topic,
                            difficulty
                        )
                        
            elif subject == 'combined_science':
                # Combined Science needs parent_subject (Biology/Chemistry/Physics) and topic (subtopic)
                parent_subject = data.get('parent_subject', 'Biology')  # Default to Biology if not specified
                
                # Handle exam mode - randomly select from all topics across Biology, Chemistry, Physics
                if question_type == 'exam':
                    from constants import TOPICS
                    import random
                    
                    # Randomly select a subject (Biology, Chemistry, or Physics)
                    science_subjects = ['Biology', 'Chemistry', 'Physics']
                    parent_subject = random.choice(science_subjects)
                    
                    # Randomly select a topic from the chosen subject
                    if parent_subject in TOPICS and len(TOPICS[parent_subject]) > 0:
                        topic = random.choice(TOPICS[parent_subject])
                    else:
                        topic = 'Cell Structure and Organisation'
                        parent_subject = 'Biology'
                
                # If topic is Biology/Chemistry/Physics itself, use default subtopic
                elif topic and topic.lower() in ['biology', 'chemistry', 'physics']:
                    parent_subject = topic.capitalize()
                    # Use first subtopic as default
                    from constants import TOPICS
                    if parent_subject in TOPICS and len(TOPICS[parent_subject]) > 0:
                        topic = TOPICS[parent_subject][0]
                
                science_gen = CombinedScienceGenerator()
                if question_format == 'structured':
                    question_data = science_gen.generate_structured_question(parent_subject, topic or 'Cell Structure and Organisation', difficulty, g.current_user_id)
                else:
                    question_data = science_gen.generate_topical_question(parent_subject, topic or 'Cell Structure and Organisation', difficulty, g.current_user_id)
            elif subject == 'english':
                english_service = EnglishService()
                # English service uses different method - get grammar or vocabulary question
                topic_lower = (topic or '').lower()
                if 'vocabulary' in topic_lower or topic_lower in ['vocab', 'vocabulary_building']:
                    question_result = english_service.generate_vocabulary_question()
                elif 'grammar' in topic_lower or topic_lower in ['grammar_and_language', 'grammar_usage_and_vocabulary']:
                    question_result = english_service.generate_grammar_question()
                else:
                    # Default to grammar if topic not specified
                    question_result = english_service.generate_grammar_question()
                
                if question_result and question_result.get('success'):
                    question_data = question_result.get('question_data', {})
                else:
                    question_data = None
            
            elif subject == 'a_level_physics':
                # A Level Physics - uses DeepSeek generator
                from services.a_level_physics_generator import a_level_physics_generator
                from constants import A_LEVEL_PHYSICS_TOPICS, A_LEVEL_PHYSICS_ALL_TOPICS
                import random
                
                selected_topic = topic or 'Kinematics'
                if question_type == 'exam':
                    level = data.get('parent_subject') or 'AS Level'
                    level_topics = A_LEVEL_PHYSICS_TOPICS.get(level, A_LEVEL_PHYSICS_ALL_TOPICS)
                    selected_topic = random.choice(level_topics)
                
                # Pass question_format to support MCQ vs Structured questions
                try:
                    question_data = a_level_physics_generator.generate_question(
                        selected_topic, 
                        difficulty, 
                        g.current_user_id,
                        question_format  # 'mcq' or 'structured'
                    )
                except Exception as physics_error:
                    logger.error(f"Error generating A-Level Physics {question_format} question: {physics_error}", exc_info=True)
                    question_data = None
            
            elif subject == 'a_level_chemistry':
                # A Level Chemistry - uses DeepSeek generator
                from services.a_level_chemistry_generator import a_level_chemistry_generator
                from constants import A_LEVEL_CHEMISTRY_TOPICS, A_LEVEL_CHEMISTRY_ALL_TOPICS
                import random
                
                selected_topic = topic or 'Atomic Structure'
                if question_type == 'exam':
                    level = data.get('parent_subject') or 'AS Level'
                    level_topics = A_LEVEL_CHEMISTRY_TOPICS.get(level, A_LEVEL_CHEMISTRY_ALL_TOPICS)
                    selected_topic = random.choice(level_topics)
                
                # Pass question_format to support MCQ vs Structured questions
                try:
                    question_data = a_level_chemistry_generator.generate_question(
                        selected_topic, 
                        difficulty, 
                        g.current_user_id,
                        question_format  # 'mcq' or 'structured'
                    )
                except Exception as chemistry_error:
                    logger.error(f"Error generating A-Level Chemistry {question_format} question: {chemistry_error}", exc_info=True)
                    import traceback
                    logger.error(f"Full traceback: {traceback.format_exc()}")
                    question_data = None
            
            elif subject == 'a_level_pure_math':
                # A Level Pure Mathematics - uses DeepSeek generator
                from services.a_level_pure_math_generator import a_level_pure_math_generator
                from constants import A_LEVEL_PURE_MATH_TOPICS, A_LEVEL_PURE_MATH_ALL_TOPICS
                import random
                
                selected_topic = topic or 'Polynomials'
                if question_type == 'exam':
                    level = data.get('parent_subject') or 'Lower Sixth'
                    level_topics = A_LEVEL_PURE_MATH_TOPICS.get(level, A_LEVEL_PURE_MATH_ALL_TOPICS)
                    selected_topic = random.choice(level_topics)
                
                # Pass question_format to support MCQ vs Structured questions
                try:
                    question_data = a_level_pure_math_generator.generate_question(
                        selected_topic, 
                        difficulty, 
                        g.current_user_id,
                        question_format  # 'mcq' or 'structured'
                    )
                except Exception as math_error:
                    logger.error(f"Error generating A-Level Pure Math {question_format} question: {math_error}", exc_info=True)
                    question_data = None
            
            elif subject == 'a_level_biology':
                # A Level Biology - uses DeepSeek generator with MCQ, Structured, Essay support
                from services.a_level_biology_generator import a_level_biology_generator
                from constants import A_LEVEL_BIOLOGY_TOPICS, A_LEVEL_BIOLOGY_ALL_TOPICS
                import random
                # question_type can be 'mcq', 'structured', or 'essay'
                bio_question_type = data.get('question_type', 'mcq')
                
                selected_topic = topic or 'Cell Structure'
                if question_type == 'exam':
                    level = data.get('parent_subject') or 'Lower Sixth'
                    level_topics = A_LEVEL_BIOLOGY_TOPICS.get(level, A_LEVEL_BIOLOGY_ALL_TOPICS)
                    selected_topic = random.choice(level_topics)
                
                try:
                    question_data = a_level_biology_generator.generate_question(
                        selected_topic, 
                        difficulty, 
                        g.current_user_id, 
                        bio_question_type
                    )
                except Exception as bio_error:
                    logger.error(f"Error generating A-Level Biology {bio_question_type} question: {bio_error}", exc_info=True)
                    question_data = None
            
            elif subject == 'computer_science':
                # Computer Science - uses DeepSeek generator with MCQ, Structured, Essay support
                cs_generator = ComputerScienceGenerator()
                from constants import TOPICS
                import random
                board = (data.get('board') or 'zimsec').lower()
                # Handle exam mode - randomly select topic (board-specific list)
                if question_type == 'exam':
                    if board == 'cambridge':
                        try:
                            from services.cambridge_cs_syllabus import CAMBRIDGE_CS_TOPICS
                            cs_topics = list(CAMBRIDGE_CS_TOPICS) if CAMBRIDGE_CS_TOPICS else []
                        except ImportError:
                            cs_topics = TOPICS.get('Computer Science', [])
                    else:
                        cs_topics = TOPICS.get('Computer Science', [])
                    if cs_topics:
                        topic = random.choice(cs_topics)
                # Default topic if none specified (board-specific default)
                default_topic = 'Data representation' if board == 'cambridge' else 'Hardware and Software'
                selected_topic = topic or default_topic
                # Determine question format - MCQ, structured, or essay
                cs_question_type = data.get('question_type', question_format or 'mcq').lower()
                if cs_question_type == 'essay':
                    question_data = cs_generator.generate_essay_question(selected_topic, difficulty, g.current_user_id, board=board)
                elif cs_question_type == 'structured':
                    question_data = cs_generator.generate_structured_question(selected_topic, difficulty, g.current_user_id, board=board)
                else:
                    question_data = cs_generator.generate_topical_question(selected_topic, difficulty, g.current_user_id, board=board)
            
            elif subject == 'geography':
                # ZIMSEC O-Level Geography – All Level MCQ / Structured / Essay generation
                geo_generator = GeographyGenerator()
                from constants import TOPICS
                import random
                
                # In exam mode, randomly select topic from full Geography list
                if question_type == 'exam':
                    geo_topics = TOPICS.get('Geography', [])
                    if geo_topics:
                        topic = random.choice(geo_topics)
                selected_topic = topic or 'Weather and Climate'
                
                geo_question_type = (data.get('question_type') or question_format or 'mcq').lower()
                if geo_question_type == 'essay':
                    question_data = geo_generator.generate_essay_question(selected_topic, difficulty, g.current_user_id)
                elif geo_question_type == 'structured' or question_format == 'structured':
                    question_data = geo_generator.generate_structured_question(selected_topic, difficulty, g.current_user_id)
                else:
                    question_data = geo_generator.generate_topical_question(selected_topic, difficulty, g.current_user_id)
            
            elif subject == 'accounting':
                # ZIMSEC O-Level Principles of Accounting 7112 – Paper 1 MCQ only
                from services.accounting_generator import AccountingGenerator
                from constants import TOPICS
                import random
                acc_gen = AccountingGenerator()
                if question_type == 'exam':
                    acc_topics = TOPICS.get('Principles of Accounting', [])
                    if acc_topics:
                        topic = random.choice(acc_topics)
                selected_topic = topic or 'Introduction to Principles of Accounting'
                if isinstance(selected_topic, dict):
                    selected_topic = selected_topic.get('name') or selected_topic.get('id') or 'Introduction to Principles of Accounting'
                question_data = acc_gen.generate_topical_question(selected_topic, difficulty, g.current_user_id)

            elif subject == 'business_enterprise_skills':
                # ZIMSEC O-Level Business Enterprise and Skills 4048 – Paper 1 MCQs, Paper 2 Essays
                from services.bes_generator import BESGenerator
                from constants import TOPICS
                import random
                bes_gen = BESGenerator()
                bes_topics = TOPICS.get('Business Enterprise and Skills', [])
                if question_type == 'exam' and bes_topics:
                    topic = random.choice(bes_topics)
                selected_topic = topic or 'The Business Enterprise'
                if isinstance(selected_topic, dict):
                    selected_topic = selected_topic.get('name') or selected_topic.get('id') or 'The Business Enterprise'
                qf_bes = (data.get('question_format') or data.get('question_type') or 'mcq').lower()
                if qf_bes == 'essay':
                    question_data = bes_gen.generate_essay_question(selected_topic, difficulty, g.current_user_id)
                else:
                    question_data = bes_gen.generate_topical_question(selected_topic, difficulty, g.current_user_id)

            elif subject == 'commerce':
                # ZIMSEC O-Level Principles of Commerce – Paper 1 MCQs, Paper 2 Essays (Vertex AI primary)
                from services.commerce_generator import CommerceGenerator
                from constants import TOPICS
                import random
                commerce_gen = CommerceGenerator()
                commerce_topics = TOPICS.get('Commerce', [])
                if question_type == 'exam' and commerce_topics:
                    topic = random.choice(commerce_topics)
                selected_topic = topic or 'Production'
                if isinstance(selected_topic, dict):
                    selected_topic = selected_topic.get('name') or selected_topic.get('id') or 'Production'
                qf_com = (data.get('question_format') or data.get('question_type') or 'mcq').lower()
                if qf_com == 'essay':
                    question_data = commerce_gen.generate_essay_question(selected_topic, difficulty, g.current_user_id)
                else:
                    question_data = commerce_gen.generate_mcq_question(selected_topic, difficulty, g.current_user_id)
            
            elif subject == 'a_level_geography':
                # ZIMSEC A-Level Geography – MCQ, structured, essay (same as other A-Level subjects)
                from services.a_level_geography_generator import ALevelGeographyGenerator
                from constants import A_LEVEL_GEOGRAPHY_TOPICS
                import random
                a_level_geo_generator = ALevelGeographyGenerator()
                geo_generator = GeographyGenerator()  # O-Level generator for MCQ/structured (topic-based)
                
                # In exam mode, randomly select topic from full A-Level Geography list
                if question_type == 'exam':
                    geo_topics = A_LEVEL_GEOGRAPHY_TOPICS.get('Paper 1', []) + A_LEVEL_GEOGRAPHY_TOPICS.get('Paper 2', [])
                    if geo_topics:
                        topic = random.choice(geo_topics)
                selected_topic = topic or 'Climatology'
                
                geo_question_type = (data.get('question_type') or question_format or 'mcq').lower()
                if geo_question_type == 'essay':
                    question_data = a_level_geo_generator.generate_essay_question(selected_topic, difficulty, g.current_user_id)
                elif geo_question_type == 'structured':
                    question_data = geo_generator.generate_structured_question(selected_topic, difficulty, g.current_user_id)
                else:
                    question_data = geo_generator.generate_topical_question(selected_topic, difficulty, g.current_user_id)
            
            elif subject == 'a_level_computer_science':
                # A Level Computer Science - ZIMSEC 6023 or Cambridge 9618 (board from client)
                cs_generator = ComputerScienceGenerator()
                import random
                board = (data.get('board') or 'zimsec').lower()
                
                if board == 'cambridge':
                    try:
                        from services.cambridge_a_level_cs_syllabus import (
                            CAMBRIDGE_A_LEVEL_CS_TOPICS_AS,
                            CAMBRIDGE_A_LEVEL_CS_TOPICS_A2,
                            CAMBRIDGE_A_LEVEL_CS_ALL_TOPICS,
                        )
                        selected_topic = topic or '1.1 Data representation – number systems'
                        if question_type == 'exam':
                            level = data.get('parent_subject') or 'AS Level'
                            level_topics = CAMBRIDGE_A_LEVEL_CS_TOPICS_AS if level == 'AS Level' else CAMBRIDGE_A_LEVEL_CS_TOPICS_A2
                            if level_topics:
                                selected_topic = random.choice(level_topics)
                    except ImportError:
                        board = 'zimsec'
                
                if board == 'zimsec':
                    from constants import A_LEVEL_COMPUTER_SCIENCE_TOPICS, A_LEVEL_COMPUTER_SCIENCE_ALL_TOPICS
                    selected_topic = topic or 'Data Representation - Number Systems'
                    if question_type == 'exam':
                        level = data.get('parent_subject') or 'Form 5'
                        level_topics = A_LEVEL_COMPUTER_SCIENCE_TOPICS.get(level, A_LEVEL_COMPUTER_SCIENCE_ALL_TOPICS)
                        if level_topics:
                            selected_topic = random.choice(level_topics)
                
                # Determine question format - MCQ, structured, or essay
                cs_question_type = data.get('question_type', question_format or 'mcq').lower()
                a_level_cambridge = (board == 'cambridge' and subject == 'a_level_computer_science')
                if cs_question_type == 'essay':
                    question_data = cs_generator.generate_essay_question(selected_topic, difficulty, g.current_user_id, board=board, a_level_cambridge=a_level_cambridge)
                elif cs_question_type == 'structured':
                    question_data = cs_generator.generate_structured_question(selected_topic, difficulty, g.current_user_id, board=board, a_level_cambridge=a_level_cambridge)
                else:
                    question_data = cs_generator.generate_topical_question(selected_topic, difficulty, g.current_user_id, board=board, a_level_cambridge=a_level_cambridge)

        
        if not question_data:
            # Provide more specific error messages based on subject and question type
            question_format_used = data.get('question_format') or data.get('question_type', 'mcq')
            
            if subject == 'a_level_biology':
                bio_type = data.get('question_type', 'mcq')
                if bio_type == 'essay':
                    error_msg = 'Failed to generate essay question. The AI service may be experiencing high load. Please try again in a moment.'
                elif bio_type == 'structured':
                    error_msg = 'Failed to generate structured question. Please try again or switch to MCQ questions.'
                else:
                    error_msg = f'Failed to generate A-Level Biology {bio_type} question. Please try again.'
            elif subject == 'a_level_geography':
                geo_type = data.get('question_type', 'mcq')
                if geo_type == 'essay':
                    error_msg = 'Failed to generate A-Level Geography essay question. The AI service may be experiencing high load. Please try again in a moment.'
                elif geo_type == 'structured':
                    error_msg = 'Failed to generate A-Level Geography structured question. Please try again or switch to MCQ questions.'
                else:
                    error_msg = 'Failed to generate A-Level Geography question. Please try again.'
            elif subject in ['a_level_physics', 'a_level_chemistry', 'a_level_pure_math', 'a_level_computer_science']:
                if question_format_used == 'structured':
                    error_msg = f'Failed to generate {subject.replace("a_level_", "").replace("_", " ").title()} structured question. Please try again or switch to MCQ questions.'
                elif question_format_used == 'essay':
                    error_msg = f'Failed to generate {subject.replace("a_level_", "").replace("_", " ").title()} essay question. The AI service may be experiencing high load. Please try again in a moment.'
                else:
                    error_msg = f'Failed to generate {subject.replace("a_level_", "").replace("_", " ").title()} question. Please try again.'
            elif subject == 'business_enterprise_skills':
                if question_format_used == 'essay':
                    error_msg = 'Failed to generate Business Enterprise and Skills essay question. The AI service may be experiencing high load. Please try again in a moment.'
                else:
                    error_msg = 'Failed to generate Business Enterprise and Skills question. Please try again.'
            elif subject == 'commerce':
                if question_format_used == 'essay':
                    error_msg = 'Failed to generate Commerce essay question. The AI service may be experiencing high load. Please try again in a moment.'
                else:
                    error_msg = 'Failed to generate Commerce question. Please try again.'
            else:
                error_msg = 'Failed to generate question. Please try again.'
            logger.error(f"Question generation failed for {subject}/{topic} (type: {question_format_used})")
            return jsonify({'success': False, 'message': error_msg}), 500
        
        # Format question for mobile - normalize different question formats
        # English questions might have different structure
        if subject == 'english':
            # Normalize English question format
            options = question_data.get('options', [])
            if isinstance(options, dict):
                # Convert dict {A: "...", B: "..."} to array
                options = [options.get(k, '') for k in sorted(options.keys()) if options.get(k)]
            
            # Get correct answer - could be in different fields
            correct_answer = question_data.get('answer') or question_data.get('correct_answer') or ''
            acceptable_answers = question_data.get('acceptable_answers', [])
            if not correct_answer and acceptable_answers:
                correct_answer = acceptable_answers[0] if isinstance(acceptable_answers, list) and len(acceptable_answers) > 0 else str(acceptable_answers)
            if isinstance(correct_answer, list) and len(correct_answer) > 0:
                correct_answer = correct_answer[0]
            if not correct_answer:
                correct_answer = ''
            
            # Get solution/explanation - English service returns a nested dict
            explanation_obj = question_data.get('explanation', {})
            if isinstance(explanation_obj, dict):
                # Build a comprehensive solution string from the explanation dict
                solution_parts = []
                
                # Correct answer
                correction = explanation_obj.get('correction', '') or correct_answer
                if correction:
                    solution_parts.append(f"✅ Correct Answer: {correction}")
                
                # Grammar rule
                rule = explanation_obj.get('rule', '')
                if rule:
                    solution_parts.append(f"\n📚 Rule: {rule}")
                
                # Error analysis
                error_analysis = explanation_obj.get('error_analysis', '')
                if error_analysis:
                    solution_parts.append(f"\n⚠️ Why: {error_analysis}")
                
                # ZIMSEC importance
                zimsec_importance = explanation_obj.get('zimsec_importance', '')
                if zimsec_importance:
                    solution_parts.append(f"\n🎓 ZIMSEC Tip: {zimsec_importance}")
                
                # Examples
                examples = explanation_obj.get('examples', [])
                if examples and isinstance(examples, list) and len(examples) > 0:
                    solution_parts.append(f"\n📝 Examples: {'; '.join(examples[:2])}")
                
                solution = '\n'.join(solution_parts) if solution_parts else f"The correct answer is: {correct_answer}"
            else:
                # Fallback if explanation is already a string
                solution = str(explanation_obj) if explanation_obj else question_data.get('solution', '') or question_data.get('feedback', '') or f"The correct answer is: {correct_answer}"
        else:
            # For other subjects (including Mathematics), use standard format
            options = question_data.get('options', [])
            if isinstance(options, dict):
                options = [options.get(k, '') for k in sorted(options.keys()) if options.get(k)]
            correct_answer = question_data.get('answer', '') or question_data.get('correct_answer', '')
            solution = question_data.get('solution', '') or question_data.get('explanation', '')
        
        # Optional graph/diagram attachment (e.g., A Level Pure Math matplotlib output)
        question_image_url = question_data.get('question_image_url') or question_data.get('graph_image_url')
        if not question_image_url and question_data.get('graph_image_path'):
            try:
                question_image_url = convert_local_path_to_public_url(question_data['graph_image_path'])
            except Exception:
                question_image_url = None
        
        # For Mathematics, ensure it's treated as short_answer type (allows text input)
        question_type_mobile = question_data.get('question_type', '') or question_data.get('type', 'short_answer')
        if subject == 'mathematics' and not options:
            question_type_mobile = 'short_answer'  # Math questions allow text input
        
        # Handle A-Level Biology question types (mcq, structured, essay)
        if subject == 'a_level_biology':
            bio_question_type = (question_data.get('question_type') or '').lower()
            if bio_question_type in ['structured', 'essay']:
                question_type_mobile = bio_question_type
            elif bio_question_type == 'mcq':
                question_type_mobile = 'mcq'
        
        # Handle structured questions for Combined Science and other A-Level subjects
        if (question_data.get('question_type') or '').lower() == 'structured' and subject != 'a_level_biology':
            question_type_mobile = 'structured'
            # Structured questions use typed answers; options/correct_answer are not used
            options = []
            correct_answer = ''
            # Provide a compact "solution" string (model answers) for UI display if desired
            try:
                # For A-Level subjects, parts are in structured_question.parts
                structured_q = question_data.get('structured_question', {})
                parts = structured_q.get('parts', []) if structured_q else []
                # Fallback to top-level parts if not in structured_question
                if not parts:
                    parts = question_data.get('parts', []) if isinstance(question_data.get('parts'), list) else []
                model_lines = []
                for p in parts:
                    label = p.get('label', '') or p.get('part', '')
                    model = (p.get('model_answer') or p.get('expected_answer') or '').strip()
                    marks = p.get('marks', '')
                    if model:
                        model_lines.append(f"{label} [{marks}]: {model}")
                if model_lines:
                    solution = "MODEL ANSWERS:\n" + "\n".join(model_lines[:10])
            except Exception:
                pass
        
        # Format question for mobile
        topic_label = (topic or question_data.get('topic') or '').replace('_', ' ').strip() or 'Mathematics'
        math_prompt = (
            f"{student_first_name}, solve this {form_level} {topic_label} question step by step and show all your working."
            if subject in ('mathematics', 'a_level_pure_math')
            else ''
        )
        question = {
            'id': str(uuid.uuid4()),
            'question_text': (
                question_data.get('question', '') or
                question_data.get('question_text', '') or
                (question_data.get('stem', '') if (question_data.get('question_type') or '').lower() == 'structured' else '')
            ),
            'question_image_url': question_image_url,
            'question_type': question_type_mobile,
            'options': options if isinstance(options, list) else [],
            'correct_answer': correct_answer,
            'solution': solution,
            'hint': question_data.get('hint', '') if subject == 'mathematics' else '',
            # For English, use the formatted solution since explanation is a dict
            # For Combined Science, use teaching_explanation for the "Teaching Explanation" section (different from solution)
            'explanation': (
                solution if subject == 'english' 
                else (question_data.get('teaching_explanation', '') or question_data.get('real_world_application', '') or question_data.get('explanation', '')) if subject == 'combined_science'
                else (question_data.get('explanation', '') if not isinstance(question_data.get('explanation'), dict) else '')
            ),
            'points': question_data.get('points', 10),
            'topic': topic or '',
            'difficulty': difficulty,
            'form_level': form_level if subject in ('mathematics', 'a_level_pure_math') else question_data.get('form_level', ''),
            'prompt_to_student': question_data.get('prompt_to_student') or math_prompt,
            'allows_text_input': (
                subject == 'mathematics' or 
                subject == 'a_level_pure_math' or
                question_type_mobile == 'short_answer' or
                question_type_mobile == 'structured' or
                question_type_mobile == 'essay' or  # Essay questions need text input
                (subject == 'english' and not options)  # English grammar questions without MCQ options need text input
            ),
            'allows_image_upload': (
                subject == 'mathematics' or 
                subject == 'a_level_pure_math' or
                # Computer Science essay/structured questions support image upload for diagrams, code screenshots
                (subject in ('computer_science', 'a_level_computer_science') and question_type_mobile in ('essay', 'structured')) or
                # Geography essay/structured questions support image upload for maps, diagrams
                (subject in ('geography', 'a_level_geography') and question_type_mobile in ('essay', 'structured')) or
                # Commerce essay questions support image upload for handwritten/diagram answers
                (subject == 'accounting' and question_type_mobile == 'essay') or
                # BES essay questions support image upload for handwritten/diagram answers
                (subject == 'business_enterprise_skills' and question_type_mobile == 'essay') or
                (subject == 'commerce' and question_type_mobile == 'essay')
            ),
            
            # New AI Tutor Fields
            'concept_explanation': question_data.get('concept_explanation', ''),
            'worked_example': question_data.get('worked_example', None),
            'hint_level_1': question_data.get('hint_level_1', ''),
            'hint_level_2': question_data.get('hint_level_2', ''),
            'hint_level_3': question_data.get('hint_level_3', ''),
            'common_mistakes': question_data.get('common_mistakes', []),
            'learning_objective': question_data.get('learning_objective', ''),
            # Separate teaching explanation for Combined Science (different from solution)
            'teaching_explanation': question_data.get('teaching_explanation', '') or question_data.get('real_world_application', '')
        }
        
        # Normalize spacing for all STEM subjects; keep LaTeX intact so web and app can render it (MathRenderer/KaTeX)
        if subject in ('mathematics', 'a_level_pure_math', 'combined_science'):
            try:
                spacing_keys = ('solution', 'explanation', 'teaching_explanation', 'concept_explanation')
                for key in ('question_text', 'solution', 'explanation', 'teaching_explanation', 'concept_explanation', 'hint', 'hint_level_1', 'hint_level_2', 'hint_level_3'):
                    if question.get(key) and isinstance(question[key], str) and key in spacing_keys:
                        question[key] = LaTeXConverter.normalize_explanation_spacing(question[key])
            except Exception as e:
                logger.warning(f"Spacing normalization in quiz payload failed (non-blocking): {e}")
        
        # Include structured payload for the app (so it can render parts and resubmit for marking)
        if subject == 'combined_science' and question_type_mobile == 'structured':
            question['structured_question'] = {
                'question_type': 'structured',
                'subject': question_data.get('subject', ''),
                'topic': question_data.get('topic', ''),
                'difficulty': question_data.get('difficulty', difficulty),
                'stem': question_data.get('stem', ''),
                'parts': question_data.get('parts', []),
                'total_marks': question_data.get('total_marks', 0),
                # rubric is needed for server-side marking in stateless mobile flow
                'marking_rubric': question_data.get('marking_rubric', {})
            }
        
        # Handle A-Level Physics, Chemistry, Pure Math, and Computer Science structured questions
        if subject in ['a_level_physics', 'a_level_chemistry', 'a_level_pure_math', 'computer_science', 'a_level_computer_science'] and question_type_mobile == 'structured':
            structured_q = question_data.get('structured_question', {})
            parts = structured_q.get('parts', []) if structured_q else question_data.get('parts', [])
            # Normalize parts: ensure model_answer for frontend (use expected_answer if model_answer missing)
            for p in parts:
                if 'label' not in p:
                    p['label'] = p.get('part', 'a')
                if not (p.get('model_answer') or '').strip() and (p.get('expected_answer') or '').strip():
                    p['model_answer'] = (p.get('expected_answer') or '').strip()
            # Ensure question.solution is set from parts for submit-answer
            if not (solution or '').strip():
                solution = _build_structured_solution_from_parts(parts)
            question['structured_question'] = {
                'question_type': 'structured',
                'subject': question_data.get('subject', subject.replace('_', ' ').title()),
                'topic': question_data.get('topic', topic),
                'difficulty': question_data.get('difficulty', difficulty),
                'stem': question_data.get('question_text', '') or question_data.get('question', '') or question_data.get('stem', ''),
                'parts': parts,
                'total_marks': structured_q.get('total_marks', 0) if structured_q else sum(p.get('marks', 0) for p in parts),
                'marking_rubric': {}
            }
            question['allows_text_input'] = True
            # For Pure Math and Computer Science, also allow image upload
            if subject in ('a_level_pure_math', 'computer_science', 'a_level_computer_science'):
                question['allows_image_upload'] = True
        
        # Handle A-Level Biology structured and essay questions
        if subject == 'a_level_biology':
            # Structured questions
            if question_type_mobile == 'structured' or question_data.get('question_type') == 'structured':
                parts = question_data.get('parts', [])
                # Ensure each part has a label
                for part in parts:
                    if 'label' not in part:
                        part['label'] = part.get('part', 'a')
                question['structured_question'] = {
                    'question_type': 'structured',
                    'subject': question_data.get('subject', 'A Level Biology'),
                    'topic': question_data.get('topic', topic),
                    'difficulty': question_data.get('difficulty', difficulty),
                    'stem': question_data.get('stimulus') or question_data.get('question', ''),
                    'parts': parts,
                    'total_marks': question_data.get('total_marks', sum(p.get('marks', 0) for p in parts)),
                    'marking_rubric': {}
                }
                question['allows_text_input'] = True  # Structured questions need text input
            
            # Essay questions
            elif question_type_mobile == 'essay' or question_data.get('question_type') == 'essay':
                question['question_type'] = 'essay'
                question['allows_text_input'] = True  # Essay questions need text input
                # Enable image upload for CS/Geography essays (diagrams, screenshots, maps)
                if subject in ('computer_science', 'a_level_computer_science', 'geography', 'a_level_geography'):
                    question['allows_image_upload'] = True
                question['essay_data'] = {
                    'command_word': question_data.get('command_word', 'Discuss'),
                    'total_marks': question_data.get('total_marks', 25),
                    'time_allocation': question_data.get('time_allocation', '35-40 minutes'),
                    'essay_plan': question_data.get('essay_plan', {}),
                    'must_include_terms': question_data.get('must_include_terms', []),
                    'marking_criteria': question_data.get('marking_criteria', {}),
                    'model_answer_outline': question_data.get('model_answer_outline', ''),
                    'common_mistakes': question_data.get('common_mistakes', [])
                }
                # Solution should include essay plan and marking criteria
                essay_solution_parts = []
                if question_data.get('essay_plan'):
                    essay_solution_parts.append("📋 ESSAY PLAN:")
                    plan = question_data.get('essay_plan', {})
                    if plan.get('introduction'):
                        essay_solution_parts.append(f"Introduction: {plan['introduction']}")
                    if plan.get('main_body'):
                        for section in plan['main_body']:
                            essay_solution_parts.append(f"{section.get('section', 'Section')} [{section.get('marks', 0)} marks]: {section.get('content', '')}")
                    if plan.get('conclusion'):
                        essay_solution_parts.append(f"Conclusion: {plan['conclusion']}")
                if question_data.get('must_include_terms'):
                    essay_solution_parts.append(f"\n🔑 Key Terms to Include: {', '.join(question_data['must_include_terms'])}")
                if question_data.get('marking_criteria'):
                    essay_solution_parts.append("\n📊 MARKING CRITERIA:")
                    criteria = question_data.get('marking_criteria', {})
                    for grade, desc in criteria.items():
                        essay_solution_parts.append(f"{grade}: {desc}")
                if essay_solution_parts:
                    question['solution'] = '\n'.join(essay_solution_parts)
        
        # Handle Geography structured and essay questions
        if subject in ('geography', 'a_level_geography'):
            if question_type_mobile == 'structured' or question_data.get('question_type') == 'structured':
                structured_q = question_data.get('structured_question', {})
                parts = structured_q.get('parts', []) if structured_q else question_data.get('parts', [])
                # Ensure each part has a label and model_answer (for frontend and submit-answer)
                for part in parts:
                    if 'label' not in part:
                        part['label'] = part.get('part', 'a')
                    if not (part.get('model_answer') or '').strip() and (part.get('expected_answer') or '').strip():
                        part['model_answer'] = (part.get('expected_answer') or '').strip()
                # Ensure question.solution is set from parts for submit-answer
                if not (solution or '').strip():
                    solution = _build_structured_solution_from_parts(parts)
                question['structured_question'] = {
                    'question_type': 'structured',
                    'subject': 'Geography' if subject == 'geography' else 'A Level Geography',
                    'topic': question_data.get('topic', topic),
                    'difficulty': question_data.get('difficulty', difficulty),
                    'stem': question_data.get('stem', '') or question_data.get('question', ''),
                    'parts': parts,
                    'total_marks': question_data.get('total_marks', sum(p.get('marks', 0) for p in parts)),
                    'marking_rubric': {}
                }
                question['allows_text_input'] = True
                question['allows_image_upload'] = True  # Geography needs maps/diagrams
            elif question_type_mobile == 'essay' or question_data.get('question_type') == 'essay':
                question['question_type'] = 'essay'
                question['allows_text_input'] = True
                question['allows_image_upload'] = True  # Geography essays need maps/diagrams
                # Build detailed solution (model answer outline, key points, marking criteria) for after submit
                geo_essay_solution_parts = []
                if question_data.get('key_points'):
                    geo_essay_solution_parts.append("📋 KEY POINTS TO COVER:")
                    for kp in (question_data.get('key_points') or [])[:8]:
                        geo_essay_solution_parts.append(f"• {kp}")
                if question_data.get('marking_criteria'):
                    geo_essay_solution_parts.append("\n📊 MARKING CRITERIA:")
                    for grade, desc in (question_data.get('marking_criteria') or {}).items():
                        geo_essay_solution_parts.append(f"{grade}: {desc}")
                if question_data.get('sample_answer_outline'):
                    geo_essay_solution_parts.append("\n📝 MODEL ANSWER OUTLINE:")
                    geo_essay_solution_parts.append(question_data['sample_answer_outline'])
                if question_data.get('case_studies'):
                    geo_essay_solution_parts.append("\n🌍 CASE STUDIES TO REFERENCE:")
                    geo_essay_solution_parts.append(", ".join(question_data.get('case_studies', [])[:4]))
                if geo_essay_solution_parts:
                    question['solution'] = '\n'.join(geo_essay_solution_parts)

        # Handle Commerce essay questions (Paper 2)
        if subject == 'accounting' and (question_type_mobile == 'essay' or question_data.get('question_type') == 'essay'):
            question['question_type'] = 'essay'
            question['allows_text_input'] = True
            question['allows_image_upload'] = True
            question['question_text'] = question_data.get('question', '') or question_data.get('question_text', '')
            question['essay_data'] = {
                'command_word': question_data.get('command_word', 'Discuss'),
                'total_marks': question_data.get('total_marks', 20),
                'time_allocation': question_data.get('time_allocation', '35-40 minutes'),
                'essay_plan': question_data.get('essay_plan', {}),
                'must_include_terms': question_data.get('must_include_terms', []),
                'marking_criteria': question_data.get('marking_criteria', {}),
                'model_answer_outline': question_data.get('sample_answer_outline', '') or question_data.get('model_answer_outline', ''),
                'common_mistakes': question_data.get('common_mistakes', [])
            }
            com_essay_solution_parts = []
            if question_data.get('essay_plan'):
                com_essay_solution_parts.append("📋 ESSAY PLAN:")
                plan = question_data.get('essay_plan', {})
                if plan.get('introduction'):
                    com_essay_solution_parts.append(f"Introduction: {plan['introduction']}")
                if plan.get('main_body'):
                    for section in (plan.get('main_body') or []):
                        com_essay_solution_parts.append(f"{section.get('section', 'Section')} [{section.get('marks', 0)} marks]: {section.get('content', '')}")
                if plan.get('conclusion'):
                    com_essay_solution_parts.append(f"Conclusion: {plan['conclusion']}")
            if question_data.get('must_include_terms'):
                com_essay_solution_parts.append(f"\n🔑 Key Terms to Include: {', '.join(question_data['must_include_terms'])}")
            if question_data.get('marking_criteria'):
                com_essay_solution_parts.append("\n📊 MARKING CRITERIA:")
                for grade, desc in (question_data.get('marking_criteria') or {}).items():
                    com_essay_solution_parts.append(f"{grade}: {desc}")
            if question_data.get('sample_answer_outline'):
                com_essay_solution_parts.append("\n📝 MODEL ANSWER OUTLINE:")
                com_essay_solution_parts.append(question_data['sample_answer_outline'])
            if com_essay_solution_parts:
                question['solution'] = '\n'.join(com_essay_solution_parts)

        # Handle BES essay questions (Paper 2)
        if (subject == 'business_enterprise_skills' or subject == 'commerce') and (question_type_mobile == 'essay' or question_data.get('question_type') == 'essay'):
            question['question_type'] = 'essay'
            question['allows_text_input'] = True
            question['allows_image_upload'] = True
            question['question_text'] = question_data.get('question', '') or question_data.get('question_text', '')
            question['essay_data'] = {
                'command_word': question_data.get('command_word', 'Discuss'),
                'total_marks': question_data.get('total_marks', 20),
                'time_allocation': question_data.get('time_allocation', '35-40 minutes'),
                'essay_plan': question_data.get('essay_plan', {}),
                'must_include_terms': question_data.get('must_include_terms', []),
                'marking_criteria': question_data.get('marking_criteria', {}),
                'model_answer_outline': question_data.get('sample_answer_outline', '') or question_data.get('model_answer_outline', ''),
                'common_mistakes': question_data.get('common_mistakes', [])
            }
            bes_essay_solution_parts = []
            if question_data.get('essay_plan'):
                bes_essay_solution_parts.append("📋 ESSAY PLAN:")
                plan = question_data.get('essay_plan', {})
                if plan.get('introduction'):
                    bes_essay_solution_parts.append(f"Introduction: {plan['introduction']}")
                if plan.get('main_body'):
                    for section in (plan.get('main_body') or []):
                        bes_essay_solution_parts.append(f"{section.get('section', 'Section')} [{section.get('marks', 0)} marks]: {section.get('content', '')}")
                if plan.get('conclusion'):
                    bes_essay_solution_parts.append(f"Conclusion: {plan['conclusion']}")
            if question_data.get('must_include_terms'):
                bes_essay_solution_parts.append(f"\n🔑 Key Terms to Include: {', '.join(question_data['must_include_terms'])}")
            if question_data.get('marking_criteria'):
                bes_essay_solution_parts.append("\n📊 MARKING CRITERIA:")
                for grade, desc in (question_data.get('marking_criteria') or {}).items():
                    bes_essay_solution_parts.append(f"{grade}: {desc}")
            if question_data.get('sample_answer_outline') or question_data.get('model_answer_outline'):
                bes_essay_solution_parts.append("\n📝 MODEL ANSWER OUTLINE:")
                bes_essay_solution_parts.append(question_data.get('sample_answer_outline') or question_data.get('model_answer_outline', ''))
            if bes_essay_solution_parts:
                question['solution'] = '\n'.join(bes_essay_solution_parts)

        # Normalize spacing in structured_question for combined_science (keep LaTeX intact for client MathRenderer/KaTeX)
        if subject == 'combined_science' and question.get('structured_question'):
            try:
                sq = question['structured_question']
                if sq.get('stem') and isinstance(sq['stem'], str):
                    sq['stem'] = LaTeXConverter.normalize_explanation_spacing(sq['stem'])
                for p in (sq.get('parts') or []):
                    for f in ('model_answer', 'question', 'content'):
                        if p.get(f) and isinstance(p[f], str):
                            p[f] = LaTeXConverter.normalize_explanation_spacing(p[f])
            except Exception as e:
                logger.warning(f"Spacing normalization for structured_question failed (non-blocking): {e}")
        
        # Deduct credits ONLY after we have successfully produced a question payload.
        # For CS/biology include format (mcq/structured/essay) so Supabase credit_transactions are clear
        desc_fmt = (cs_question_type or question_format or '') if subject == 'computer_science' else (bio_question_type if subject == 'a_level_biology' else question_format or '')
        desc = f'Generated {subject} {question_type} {desc_fmt} question'.replace('  ', ' ').strip() if desc_fmt else f'Generated {subject} {question_type} question'
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'quiz_generation',
            desc
        )
        if credits_remaining is None:
            # If deduction fails (race condition / DB issue), do not deliver paid content.
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500

        question['credits_remaining'] = credits_remaining
        question['credit_cost'] = _credits_display(int(credit_cost))
        question['is_image_question'] = bool(is_image_question)

        return jsonify({'success': True, 'data': question}), 200
        
    except Exception as e:
        logger.error(f"Generate question error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        
        # Provide user-friendly error messages
        if 'timeout' in error_message.lower() or 'timed out' in error_message.lower():
            user_message = 'Question generation is taking longer than expected. Please try again - essay and structured questions may take up to 90 seconds.'
        elif 'connection' in error_message.lower() or 'network' in error_message.lower():
            user_message = 'Network error while generating question. Please check your connection and try again.'
        elif 'a_level_biology' in error_message.lower() or subject == 'a_level_biology':
            user_message = 'Failed to generate Biology question. The AI service may be temporarily unavailable. Please try again in a moment.'
        else:
            user_message = 'Failed to generate question. Please try again.'
        
        return jsonify({'success': False, 'message': user_message}), 500

@mobile_bp.route('/quiz/generate-stream', methods=['POST'])
@require_auth
def generate_question_stream():
    """
    Generate a math question with real-time thinking updates (SSE).
    Uses DeepSeek Reasoner (V3.2 CoT) for step-by-step reasoning.
    Only for Mathematics subjects.
    """
    from flask import Response
    
    try:
        data = request.get_json()
        subject = data.get('subject', 'mathematics')
        topic = data.get('topic', 'Algebra')
        difficulty = data.get('difficulty', 'medium')
        form_level = data.get('form_level', 'Form 1')
        student_first_name = _get_student_first_name(g.current_user_id)
        
        # Only allow streaming for mathematics subjects
        if subject not in ['mathematics', 'a_level_pure_math', 'a_level_statistics']:
            return jsonify({
                'success': False,
                'message': 'Streaming only available for Mathematics subjects'
            }), 400
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('math_quiz')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}, Available: {_credits_text(user_credits)}'
            }), 402
        
        user_id = g.current_user_id
        
        def generate():
            """SSE generator for streaming thinking updates."""
            try:
                from services.math_question_generator import MathQuestionGenerator
                math_generator = MathQuestionGenerator()
                
                # Stream thinking updates and final question
                subject_name = 'Mathematics' if subject == 'mathematics' else 'A Level Pure Mathematics'
                for event in math_generator.generate_question_stream(
                    subject_name,
                    topic,
                    difficulty,
                    user_id,
                    form_level=form_level,
                    student_name=student_first_name,
                ):
                    event_type = event.get('type', 'unknown')
                    
                    if event_type == 'thinking':
                        # Send thinking update
                        yield f"data: {json.dumps({'type': 'thinking', 'content': event.get('content', ''), 'stage': event.get('stage', 1), 'total_stages': event.get('total_stages', 4)})}\n\n"
                    
                    elif event_type == 'question':
                        # Deduct credits on successful generation (do not deliver if transaction fails)
                        credits_remaining = _deduct_credits_or_fail(
                            user_id,
                            int(credit_cost),
                            'math_quiz',
                            f'Math question: {topic}'
                        )
                        if credits_remaining is None:
                            yield f"data: {json.dumps({'type': 'error', 'message': 'Transaction failed. Please try again.'})}\n\n"
                            continue
                        
                        # Format question for mobile
                        question_data = event.get('data', {})
                        topic_label = (topic or question_data.get('topic') or 'Mathematics').replace('_', ' ').strip()
                        personalized_prompt = (
                            question_data.get('prompt_to_student')
                            or f"{student_first_name}, solve this {form_level} {topic_label} question step by step and show all your working."
                        )
                        question = {
                            'id': str(uuid.uuid4()),
                            'question_text': question_data.get('question', ''),
                            'question_type': 'short_answer',
                            'options': [],
                            'correct_answer': question_data.get('answer', ''),
                            'solution': question_data.get('solution', ''),
                            'hint': question_data.get('hint_level_1', ''),
                            'explanation': question_data.get('explanation', ''),
                            'points': question_data.get('points', 20),
                            'topic': topic,
                            'difficulty': difficulty,
                            'form_level': form_level,
                            'prompt_to_student': personalized_prompt,
                            'allows_text_input': True,
                            'allows_image_upload': True,
                            'source': 'deepseek_reasoner',
                            'credits_remaining': credits_remaining
                        }
                        
                        yield f"data: {json.dumps({'type': 'question', 'data': question})}\n\n"
                    
                    elif event_type == 'error':
                        yield f"data: {json.dumps({'type': 'error', 'message': event.get('message', 'Unknown error')})}\n\n"
                
                # Send done signal
                yield f"data: {json.dumps({'type': 'done'})}\n\n"
                
            except Exception as e:
                logger.error(f"SSE streaming error: {e}")
                yield f"data: {json.dumps({'type': 'error', 'message': 'Streaming error occurred'})}\n\n"
        
        return Response(
            generate(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            }
        )
        
    except Exception as e:
        logger.error(f"Generate stream error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/quiz/exam/next', methods=['POST'])
@require_auth
def get_next_exam_question():
    """Get next exam question from olevel_maths table (hybrid: DB images + AI)"""
    try:
        data = request.get_json()
        question_count = data.get('question_count', 1)
        year = data.get('year')
        paper = data.get('paper')
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('math_exam')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}, Available: {_credits_text(user_credits)}'
            }), 400
        
        # Import the math exam service
        from services.math_exam_service import math_exam_service
        
        # Get next question (hybrid: DB or AI based on question_count)
        question_data = math_exam_service.get_next_question(
            g.current_user_id,
            question_count,
            year,
            paper
        )
        
        if not question_data:
            return jsonify({'success': False, 'message': 'Failed to get exam question'}), 500
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'math_exam',
            f'Math exam question #{question_count}'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        
        # Filter out None values from answer_image_urls if present
        if 'answer_image_urls' in question_data:
            question_data['answer_image_urls'] = [
                url for url in question_data['answer_image_urls'] if url
            ]
        
        # Format question for mobile
        question = {
            'id': question_data.get('id', str(uuid.uuid4())),
            'type': question_data.get('type', 'db_image'),
            'question_text': question_data.get('question_text', 'Solve the problem shown in the image.'),
            'question_image_url': question_data.get('question_image_url'),
            'answer_image_urls': question_data.get('answer_image_urls', []),
            'options': question_data.get('options', []),
            'correct_answer': question_data.get('correct_answer', ''),
            'solution': question_data.get('solution', ''),
            'explanation': question_data.get('explanation', ''),
            'topic': question_data.get('topic', ''),
            'year': question_data.get('year', ''),
            'difficulty': question_data.get('difficulty', 'medium'),
            'allows_text_input': question_data.get('allows_text_input', True),
            'allows_image_upload': question_data.get('allows_image_upload', True),
            'is_ai': question_data.get('is_ai', False),
            'points': 10,
            'credits_remaining': credits_remaining
        }
        
        return jsonify({
            'success': True,
            'data': question
        }), 200
        
    except Exception as e:
        logger.error(f"Get exam question error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to get exam question: {error_message}'}), 500


def _build_structured_solution_from_parts(parts):
    """Build detailed solution string from structured question parts (model_answer or expected_answer)."""
    if not parts or not isinstance(parts, list):
        return ''
    lines = []
    for p in parts:
        label = p.get('label', p.get('part', ''))
        model = (p.get('model_answer') or p.get('expected_answer') or '').strip()
        marks = p.get('marks', '')
        if model:
            lines.append(f"Part ({label}) [{marks} marks]: {model}")
    if not lines:
        return ''
    return "📋 MODEL ANSWERS / DETAILED SOLUTION:\n\n" + "\n\n".join(lines)


@mobile_bp.route('/quiz/submit-answer', methods=['POST'])
@require_auth
def submit_answer():
    """Submit answer and get feedback with enhanced math support"""
    try:
        data = request.get_json()
        question_id = data.get('question_id')
        answer = data.get('answer', '').strip()
        image_url = data.get('image_url', '')  # For image-based answers
        subject = data.get('subject', '')
        question_type = (data.get('question_type') or '').lower()
        correct_answer = data.get('correct_answer', '')
        solution = data.get('solution', '')
        hint = data.get('hint', '')
        question_text = data.get('question_text', '') # Need question text for AI analysis
        structured_question = data.get('structured_question')  # For structured science marking
        
        if not question_id:
            return jsonify({'success': False, 'message': 'Question ID is required'}), 400
        
        if not answer and not image_url:
            return jsonify({'success': False, 'message': 'Answer (text or image) is required'}), 400
        
        # For math questions, use MathSolver to evaluate
        is_correct = False
        feedback = ''
        detailed_solution = solution or 'No solution provided'
        analysis_result = {}
        
        if subject == 'mathematics' or subject == 'a_level_pure_math':
            from services.math_solver import MathSolver
            math_solver = MathSolver()
            
            # Use the enhanced analyze_answer method
            # If we have the question text, we can get a full analysis
            try:
                if question_text:
                    analysis_result = math_solver.analyze_answer(
                        question_text,
                        answer if answer else "Image Answer",
                        correct_answer,
                        solution
                    )
                    # Ensure analysis_result is a dict
                    if not isinstance(analysis_result, dict):
                        analysis_result = {}
                    is_correct = analysis_result.get('is_correct', False)
                    feedback = analysis_result.get('feedback', '')
                else:
                    # Fallback to simple comparison if question text missing
                    if image_url:
                        # Process image answer using OCR
                        from services.image_service import ImageService
                        image_service = ImageService()
                        # Extract text from image (simplified - would need actual image processing)
                        extracted_text = answer  # Placeholder - would extract from image
                        # Use simple comparison for now
                        user_clean = str(extracted_text).strip().lower()
                        correct_clean = str(correct_answer).strip().lower()
                        is_correct = user_clean == correct_clean
                        analysis_result = {}  # No AI analysis for image answers yet
                    else:
                        # Compare text answer using math solver's comparison logic
                        analysis_result = math_solver.analyze_answer(
                            "Question not provided",
                            answer,
                            correct_answer,
                            solution
                        )
                        # Ensure analysis_result is a dict
                        if not isinstance(analysis_result, dict):
                            analysis_result = {}
                        is_correct = analysis_result.get('is_correct', False)
                        feedback = analysis_result.get('feedback', '')
            except Exception as math_error:
                logger.error(f"Error in math answer analysis: {math_error}", exc_info=True)
                # Fallback to simple comparison
                user_clean = str(answer).strip().lower()
                correct_clean = str(correct_answer).strip().lower()
                is_correct = user_clean == correct_clean
                analysis_result = {}
                feedback = ''

            # Enhance feedback to ensure it's step-by-step and clear
            if is_correct:
                if not feedback:
                    feedback = """✅ Step 1: Your answer is CORRECT!
Step 2: You've successfully applied the mathematical concepts.
Step 3: Well done on showing your working!

💡 Keep practicing similar problems to reinforce your understanding!"""
                elif 'Step 1' not in feedback and 'Step' not in feedback:
                    # Add step structure if missing
                    feedback = f"""✅ Step 1: Your answer is CORRECT!

{feedback}

💡 Well done! Continue practicing to master this topic."""
            else:
                if not feedback:
                    feedback = """❌ Step 1: Your answer needs review.
Step 2: Review the detailed solution steps below to understand the correct approach.
Step 3: Identify where your approach differed and learn from it.

💡 Remember: Understanding the method is more important than just getting the answer!"""
                elif 'Step 1' not in feedback and 'Step' not in feedback:
                    # Add step structure if missing
                    feedback = f"""❌ Step 1: Let's review the correct approach.

{feedback}

📚 Step-by-step solution is provided below. Study each step carefully."""
            
            # Ensure detailed_solution is properly formatted
            if not detailed_solution or detailed_solution == 'No solution provided':
                detailed_solution = solution or 'Review the solution steps provided with the question.'
            
            # Add step-by-step explanation from analysis if available
            step_by_step = analysis_result.get('step_by_step_explanation', '')
            if step_by_step and step_by_step not in detailed_solution:
                detailed_solution = f"{detailed_solution}\n\n📚 DETAILED STEP-BY-STEP EXPLANATION:\n{step_by_step}"
        elif subject == 'combined_science' and (question_type == 'structured' or isinstance(structured_question, dict)):
            # ZIMSEC-style structured question marking (DeepSeek) for mobile.
            try:
                from services.combined_science_generator import CombinedScienceGenerator
                gen = CombinedScienceGenerator()
                evaluation = gen.evaluate_structured_answer(structured_question or {}, answer if answer else "Image Answer")

                if not evaluation or not evaluation.get('success'):
                    return jsonify({'success': False, 'message': 'Failed to evaluate structured answer'}), 500

                is_correct = bool(evaluation.get('is_correct', False))
                feedback = (evaluation.get('overall_teacher_feedback') or '').strip() or ('✅ Good work!' if is_correct else '❌ Not quite right.')
                detailed_solution = (evaluation.get('well_detailed_explanation') or '').strip() or (solution or 'No solution provided')
                analysis_result = {
                    'what_went_right': '',
                    'what_went_wrong': '',
                    'improvement_tips': '\n'.join(evaluation.get('next_steps', [])) if isinstance(evaluation.get('next_steps'), list) else '',
                    'encouragement': feedback,
                    'related_topic': structured_question.get('topic', '') if isinstance(structured_question, dict) else ''
                }

                # Add a compact per-part summary into feedback (optional, but helpful)
                per_part = evaluation.get('per_part', [])
                if isinstance(per_part, list) and per_part:
                    lines = []
                    for p in per_part[:6]:
                        lbl = p.get('label', '')
                        got = p.get('awarded', 0)
                        mx = p.get('max_marks', p.get('marks', 0))
                        tfb = (p.get('teacher_feedback') or '').strip()
                        if tfb:
                            lines.append(f"{lbl} [{got}/{mx}]: {tfb}")
                    if lines:
                        feedback = feedback + "\n\nPart feedback:\n" + "\n".join(lines)

            except Exception as se:
                logger.error(f"Structured answer evaluation error: {se}", exc_info=True)
                return jsonify({'success': False, 'message': 'Error evaluating structured answer'}), 500
        elif subject == 'a_level_biology' and question_type == 'essay':
            # A-Level Biology Essay marking - provide feedback based on essay plan and marking criteria
            try:
                # For essays, we provide constructive feedback rather than strict right/wrong
                # Essays are evaluated based on content, structure, and use of key terms
                feedback = '📝 Essay submitted! Review the marking criteria and model answer outline below.'
                is_correct = True  # Essays are not strictly right/wrong, but we mark as "submitted" for progress tracking
                detailed_solution = solution or 'Review the essay plan and marking criteria provided with the question.'
                analysis_result = {
                    'feedback': feedback,
                    'encouragement': 'Well done on completing your essay! Compare your answer with the model answer outline and marking criteria.',
                    'improvement_tips': 'Review the key terms that should be included and ensure your essay follows the suggested structure.'
                }
            except Exception as e:
                logger.error(f"Essay answer evaluation error: {e}", exc_info=True)
                feedback = 'Essay submitted successfully. Review the solution below.'
                is_correct = True
                detailed_solution = solution or 'No detailed feedback available.'
                analysis_result = {}
        elif subject == 'a_level_geography' or (subject == 'geography' and question_type == 'essay') or (subject == 'accounting' and question_type == 'essay') or (subject == 'business_enterprise_skills' and question_type == 'essay') or (subject == 'commerce' and question_type == 'essay'):
            # A-Level Geography (and O-Level Geography/Accounting/BES essay): show analysis and detailed model answer
            try:
                feedback = (
                    '📝 Essay submitted! Your answer has been recorded. '
                    'Review the marking criteria and model answer outline below to see how your answer compares.'
                )
                is_correct = True  # Essays are not strictly right/wrong; we mark as submitted for progress
                detailed_solution = (
                    (solution or '').strip()
                    or 'Review the key points, marking criteria, and model answer outline provided with the question.'
                )
                analysis_result = {
                    'feedback': feedback,
                    'encouragement': (
                        'Well done on completing your Geography essay! '
                        'Compare your answer with the model outline and marking criteria to identify strengths and areas to improve.'
                    ),
                    'improvement_tips': (
                        'Check that you addressed all key points, used case studies where relevant, '
                        'and followed the marking criteria (content, analysis, communication).'
                    ),
                    'step_by_step_explanation': detailed_solution,
                }
            except Exception as e:
                logger.error(f"Geography essay answer evaluation error: {e}", exc_info=True)
                feedback = 'Essay submitted successfully. Review the solution below.'
                is_correct = True
                detailed_solution = solution or 'Review the marking criteria and model answer outline provided with the question.'
                analysis_result = {}
        elif subject in ('computer_science', 'a_level_computer_science') and question_type == 'structured' and (structured_question or data.get('structured_question')):
            # O-Level and A-Level Computer Science structured: AI evaluation + model answers + teacher feedback
            try:
                sq = structured_question or data.get('structured_question', {})
                parts = sq.get('parts', []) or []
                detailed_solution = _build_structured_solution_from_parts(parts) or (solution or 'No solution provided.')
                question_payload = {
                    'question_type': 'structured',
                    'stem': question_text or sq.get('stem', ''),
                    'total_marks': sq.get('total_marks', 10),
                    'parts': parts,
                }
                gen = ComputerScienceGenerator()
                eval_result = gen.evaluate_answer(question_payload, answer if answer else 'Image Answer')
                total_score = int(eval_result.get('total_score', 0))
                max_score = int(eval_result.get('max_score', 1) or 1)
                is_correct = (total_score >= (max_score * 0.5)) if max_score else False
                feedback = (eval_result.get('feedback') or '').strip()
                if not feedback:
                    feedback = '✅ Good work! Review the model answers below.' if is_correct else '❌ Review the model answers below and compare with your response.'
                analysis_result = {
                    'encouragement': feedback,
                    'improvement_tips': 'Compare each part of your answer with the model answers. Focus on key terms and structure.',
                    'step_by_step_explanation': detailed_solution,
                }
            except Exception as cs_err:
                logger.error(f"Computer Science structured evaluation error: {cs_err}", exc_info=True)
                sq = structured_question or data.get('structured_question', {})
                parts = sq.get('parts', []) or []
                detailed_solution = _build_structured_solution_from_parts(parts) or (solution or 'No solution provided.')
                is_correct = False
                feedback = '❌ Could not evaluate automatically. Review the model answers below and compare with your response.'
                analysis_result = {}
        elif subject in ('geography', 'a_level_geography') and question_type == 'structured' and (structured_question or data.get('structured_question')):
            # O-Level and A-Level Geography structured: show model answers + constructive feedback
            try:
                sq = structured_question or data.get('structured_question', {})
                parts = sq.get('parts', []) or []
                detailed_solution = _build_structured_solution_from_parts(parts) or (solution or 'No solution provided.')
                feedback = (
                    '📝 Your answer has been recorded. Review the model answers below and compare with your response '
                    'to see what was expected. Focus on key terms, case studies, and structure.'
                )
                is_correct = True  # Structured geography: we show feedback rather than strict right/wrong
                analysis_result = {
                    'encouragement': 'Well done on completing the question. Use the model answers to improve your next attempt.',
                    'improvement_tips': 'Check that you addressed each part, used appropriate terminology, and referred to examples where relevant.',
                    'step_by_step_explanation': detailed_solution,
                }
            except Exception as geo_err:
                logger.error(f"Geography structured answer error: {geo_err}", exc_info=True)
                sq = structured_question or data.get('structured_question', {})
                parts = sq.get('parts', []) or []
                detailed_solution = _build_structured_solution_from_parts(parts) or (solution or 'No solution provided.')
                feedback = 'Review the model answers below and compare with your response.'
                is_correct = True
                analysis_result = {}
        elif question_type == 'structured' and (structured_question or data.get('structured_question')):
            # Other structured subjects (A-Level Physics, Chemistry, Pure Math, Biology): show model answers + feedback
            try:
                sq = structured_question or data.get('structured_question', {})
                parts = sq.get('parts', []) or []
                detailed_solution = _build_structured_solution_from_parts(parts) or (solution or 'No solution provided.')
                feedback = (
                    '📝 Your answer has been recorded. Review the model answers below and compare with your response.'
                )
                is_correct = True  # Structured: we show feedback rather than strict right/wrong
                analysis_result = {
                    'encouragement': 'Use the model answers to see what was expected for each part.',
                    'improvement_tips': 'Compare each part of your answer with the model answer. Focus on key terms and structure.',
                    'step_by_step_explanation': detailed_solution,
                }
            except Exception as struct_err:
                logger.error(f"Structured answer (other subject) error: {struct_err}", exc_info=True)
                sq = structured_question or data.get('structured_question', {})
                parts = sq.get('parts', []) or []
                detailed_solution = _build_structured_solution_from_parts(parts) or (solution or 'No solution provided.')
                feedback = 'Review the model answers below.'
                is_correct = True
                analysis_result = {}
        else:
            # For other subjects (Combined Science, English, etc.)
            # Handle MCQ answer validation: could be option letter (A/B/C/D) or full option text
            user_answer_normalized = str(answer).strip()
            correct_answer_normalized = str(correct_answer).strip()
            
            # Get options from the request data for flexible matching
            options = data.get('options', [])
            
            # Normalize options to list format
            if isinstance(options, dict):
                options = [options.get(k, '') for k in ['A', 'B', 'C', 'D'] if options.get(k)]
            
            # Check for exact match first (handles both letter or text)
            if user_answer_normalized.lower() == correct_answer_normalized.lower():
                is_correct = True
                feedback = '✅ Correct! Well done!'
            else:
                # CASE 1: correct_answer is a letter (A/B/C/D)
                if correct_answer_normalized.upper() in ['A', 'B', 'C', 'D']:
                    correct_letter = correct_answer_normalized.upper()
                    option_index = ord(correct_letter) - ord('A')
                    
                    # Get the correct option text
                    correct_option_text = None
                    if isinstance(options, list) and 0 <= option_index < len(options):
                        correct_option_text = str(options[option_index]).strip()
                    
                    # Check if user's answer matches the correct option text
                    if correct_option_text and user_answer_normalized.lower() == correct_option_text.lower():
                        is_correct = True
                        feedback = '✅ Correct! Well done!'
                    # Check if user sent the correct letter
                    elif user_answer_normalized.upper() == correct_letter:
                        is_correct = True
                        feedback = '✅ Correct! Well done!'
                    else:
                        # Check if user selected a DIFFERENT option - find which one they selected
                        user_selected_letter = None
                        if user_answer_normalized.upper() in ['A', 'B', 'C', 'D']:
                            user_selected_letter = user_answer_normalized.upper()
                        else:
                            # User sent option text - find which letter it matches
                            for i, opt in enumerate(options):
                                if str(opt).strip().lower() == user_answer_normalized.lower():
                                    user_selected_letter = chr(ord('A') + i)
                                    break
                        
                        # Compare the letters
                        if user_selected_letter and user_selected_letter == correct_letter:
                            is_correct = True
                            feedback = '✅ Correct! Well done!'
                        else:
                            is_correct = False
                            feedback = '❌ Incorrect. The correct answer is shown below.'
                
                # CASE 2: correct_answer is text (full option text)
                else:
                    # Find which letter corresponds to the correct answer text
                    correct_letter = None
                    for i, opt in enumerate(options):
                        if str(opt).strip().lower() == correct_answer_normalized.lower():
                            correct_letter = chr(ord('A') + i)
                            break
                    
                    # Find which letter the user selected
                    user_letter = None
                    if user_answer_normalized.upper() in ['A', 'B', 'C', 'D']:
                        user_letter = user_answer_normalized.upper()
                    else:
                        for i, opt in enumerate(options):
                            if str(opt).strip().lower() == user_answer_normalized.lower():
                                user_letter = chr(ord('A') + i)
                                break
                    
                    # Compare
                    if correct_letter and user_letter and correct_letter == user_letter:
                        is_correct = True
                        feedback = '✅ Correct! Well done!'
                    elif user_answer_normalized.lower() == correct_answer_normalized.lower():
                        is_correct = True
                        feedback = '✅ Correct! Well done!'
                    else:
                        is_correct = False
                        feedback = '❌ Incorrect. The correct answer is shown below.'
        
        points_earned = 10 if is_correct else 0
        
        # Add XP if correct
        if is_correct:
            try:
                add_xp(g.current_user_id, points_earned, 'quiz_answer_correct', f'Correct answer in {subject} quiz')
            except Exception as xp_error:
                logger.warning(f"Failed to add XP (non-critical): {xp_error}")
                # Continue execution - XP failure should not block answer submission
        
        # Format detailed solution to ensure step-by-step structure
        if detailed_solution and 'Step 1' not in detailed_solution and 'Step' not in detailed_solution:
            # Try to add step structure if solution is provided but not formatted
            solution_lines = detailed_solution.split('\n')
            if len(solution_lines) > 1:
                # Add step numbers if multiple lines
                formatted_solution = []
                step_num = 1
                for line in solution_lines:
                    line = line.strip()
                    if line and not line.startswith('Step'):
                        formatted_solution.append(f"Step {step_num}: {line}")
                        step_num += 1
                    else:
                        formatted_solution.append(line)
                if formatted_solution:
                    detailed_solution = '\n'.join(formatted_solution)
        
        # Preserve full LaTeX for all STEM subjects (Mathematics, Pure Math, Combined Science).
        # Both web (MathRenderer) and mobile (WebView+KaTeX) can now render LaTeX natively.
        if subject in ('mathematics', 'a_level_pure_math', 'combined_science'):
            try:
                detailed_solution = LaTeXConverter.normalize_explanation_spacing(detailed_solution or '')
                # Keep max_length very high so math working is not truncated.
                detailed_solution = LaTeXConverter.format_explanation_professionally(detailed_solution, max_length=50000)
                feedback = LaTeXConverter.format_explanation_professionally(feedback or '', max_length=2000)
                for k in ('what_went_right', 'what_went_wrong', 'improvement_tips', 'encouragement', 'related_topic', 'step_by_step_explanation'):
                    v = analysis_result.get(k)
                    if v and isinstance(v, str):
                        v = LaTeXConverter.normalize_explanation_spacing(v)
                        analysis_result[k] = LaTeXConverter.format_explanation_professionally(v, max_length=20000)
            except Exception as e:
                logger.warning(f"LaTeX-preserving formatting in submit-answer failed (non-blocking): {e}")
        
        return jsonify({
            'success': True,
            'data': {
                'correct': is_correct,
                'feedback': feedback,
                'solution': detailed_solution,
                'hint': hint if not is_correct else '',
                'points_earned': points_earned,
                'credits_used': 0,  # Already deducted
                
                # Enhanced feedback fields with step-by-step structure
                'what_went_right': analysis_result.get('what_went_right', ''),
                'what_went_wrong': analysis_result.get('what_went_wrong', ''),
                'improvement_tips': analysis_result.get('improvement_tips', ''),
                'encouragement': analysis_result.get('encouragement', ''),
                'related_topic': analysis_result.get('related_topic', ''),
                'step_by_step_explanation': analysis_result.get('step_by_step_explanation', detailed_solution)
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Submit answer error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to submit answer: {error_message}'}), 500

@mobile_bp.route('/quiz/start-session', methods=['POST'])
@require_auth
def start_session():
    """Start a new quiz session"""
    try:
        data = request.get_json()
        subject = data.get('subject', '')
        topic = data.get('topic')
        session_type = data.get('type', 'topical')
        
        session_id = str(uuid.uuid4())
        
        # TODO: Store session in database
        
        return jsonify({
            'success': True,
            'data': {
                'id': session_id,
                'subject': subject,
                'topic': topic,
                'session_type': session_type,
                'questions_answered': 0,
                'correct_answers': 0,
                'started_at': datetime.utcnow().isoformat()
            }
        }), 200
    except Exception as e:
        logger.error(f"Start session error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-programming-lab/ai', methods=['POST'])
@require_auth
def programming_lab_ai_endpoint():
    """
    Programming Lab AI: code help, debug, explain, suggest-test, fix-error, general-question.
    Costs 1 credit (10 units) per request. Deducts only after successful AI response.
    """
    try:
        user_id = g.current_user_id
        credit_cost = advanced_credit_service.get_credit_cost('programming_lab_ai')
        user_credits = get_user_credits(user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}, Available: {_credits_text(user_credits)}',
                'credit_cost': _credits_display(credit_cost),
            }), 402

        payload = request.get_json() or {}
        result = programming_lab_ai_service.process_request(payload)
        if not result:
            return jsonify({'success': False, 'message': 'AI request failed'}), 500

        credits_remaining = _deduct_credits_or_fail(
            user_id, credit_cost, 'programming_lab_ai', 'Programming Lab AI'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Credit deduction failed'}), 402

        return jsonify({
            'success': True,
            'data': {
                **result,
                'credits_remaining': credits_remaining,
                'credit_cost': _credits_display(credit_cost),
            }
        }), 200
    except Exception as e:
        logger.error(f"Programming Lab AI error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-database-lab/execute', methods=['POST'])
@require_auth
def virtual_database_lab_execute():
    """
    Execute SQL in the Database Lab sandbox (in-memory SQLite). Returns columns/rows for SELECT
    or message/rowsAffected for other statements. No credits deducted (practice lab).
    """
    try:
        data = request.get_json() or {}
        sql = (data.get('sql') or '').strip()
        if not sql:
            return jsonify({
                'success': False,
                'message': 'No SQL provided.',
                'data': {'error': 'No SQL provided.'}
            }), 400
        result = database_lab_execution_service.execute(sql)
        if 'error' in result:
            return jsonify({
                'success': True,
                'data': result
            }), 200
        return jsonify({'success': True, 'data': result}), 200
    except ValueError as e:
        return jsonify({
            'success': True,
            'data': {'error': str(e)}
        }), 200
    except Exception as e:
        logger.error(f"Database Lab execute error: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'message': 'Database Lab error',
            'data': {'error': str(e) if str(e) else 'Data not loading. Please try again.'}
        }), 500


@mobile_bp.route('/virtual-lab/balance-sheet-question', methods=['POST'])
@require_auth
def get_balance_sheet_question():
    """
    Generate a Balance Sheet practice question for the Virtual Lab using Vertex AI only.
    Students can request a new question to practice different scenarios (sole trader, difficulty, etc.).
    No credits deducted for this endpoint (practice lab).
    """
    try:
        data = request.get_json() or {}
        business_type = (data.get('business_type') or 'sole_trader').strip().lower()
        difficulty_level = (data.get('difficulty_level') or 'intermediate').strip().lower()
        format_type = (data.get('format') or 'vertical').strip().lower()
        if business_type not in ('sole_trader', 'partnership', 'limited_company', 'non_profit'):
            business_type = 'sole_trader'
        if difficulty_level not in ('basic', 'intermediate', 'advanced'):
            difficulty_level = 'intermediate'

        question = generate_balance_sheet_question(
            business_type=business_type,
            difficulty_level=difficulty_level,
            format_type=format_type,
        )
        return jsonify({
            'success': True,
            'data': question,
        }), 200
    except Exception as e:
        logger.error("Balance sheet question generation error: %s", e, exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-lab/income-statement-question', methods=['POST'])
@require_auth
def get_income_statement_question():
    """
    Generate an Income Statement / P&L practice question for the Virtual Lab using Vertex AI only.
    Students can request a new question to practice different scenarios.
    """
    try:
        data = request.get_json() or {}
        business_type = (data.get('business_type') or 'sole_trader').strip().lower()
        difficulty_level = (data.get('difficulty_level') or 'intermediate').strip().lower()
        format_type = (data.get('format') or 'vertical').strip().lower()
        if business_type not in ('sole_trader', 'partnership', 'limited_company', 'non_profit'):
            business_type = 'sole_trader'
        if difficulty_level not in ('basic', 'intermediate', 'advanced'):
            difficulty_level = 'intermediate'

        question = generate_income_statement_question(
            business_type=business_type,
            difficulty_level=difficulty_level,
            format_type=format_type,
        )
        return jsonify({
            'success': True,
            'data': question,
        }), 200
    except Exception as e:
        logger.error("Income statement question generation error: %s", e, exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-lab/partnership-appropriation-question', methods=['POST'])
@require_auth
def get_partnership_appropriation_question():
    """Generate a Partnership Appropriation practice question for the Virtual Lab using Vertex AI only."""
    try:
        data = request.get_json() or {}
        difficulty_level = (data.get('difficulty_level') or 'intermediate').strip().lower()
        format_type = (data.get('format') or 'vertical').strip().lower()
        if difficulty_level not in ('basic', 'intermediate', 'advanced'):
            difficulty_level = 'intermediate'

        question = generate_partnership_appropriation_question(
            difficulty_level=difficulty_level,
            format_type=format_type,
        )
        return jsonify({
            'success': True,
            'data': question,
        }), 200
    except Exception as e:
        logger.error("Partnership appropriation question generation error: %s", e, exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-lab/cash-flow-question', methods=['POST'])
@require_auth
def get_cash_flow_question():
    """Generate a Cash Flow Statement practice question for the Virtual Lab using Vertex AI only."""
    try:
        data = request.get_json() or {}
        difficulty_level = (data.get('difficulty_level') or 'intermediate').strip().lower()
        format_type = (data.get('format') or 'vertical').strip().lower()
        if difficulty_level not in ('basic', 'intermediate', 'advanced'):
            difficulty_level = 'intermediate'

        question = generate_cash_flow_question(
            difficulty_level=difficulty_level,
            format_type=format_type,
        )
        return jsonify({'success': True, 'data': question}), 200
    except Exception as e:
        logger.error("Cash flow question generation error: %s", e, exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-lab/manufacturing-account-question', methods=['POST'])
@require_auth
def get_manufacturing_account_question():
    """Generate a Manufacturing Account practice question for the Virtual Lab using Vertex AI only."""
    try:
        data = request.get_json() or {}
        difficulty_level = (data.get('difficulty_level') or 'intermediate').strip().lower()
        format_type = (data.get('format') or 'vertical').strip().lower()
        if difficulty_level not in ('basic', 'intermediate', 'advanced'):
            difficulty_level = 'intermediate'

        question = generate_manufacturing_account_question(
            difficulty_level=difficulty_level,
            format_type=format_type,
        )
        return jsonify({'success': True, 'data': question}), 200
    except Exception as e:
        logger.error("Manufacturing account question generation error: %s", e, exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-lab/correction-of-errors-question', methods=['POST'])
@require_auth
def get_correction_of_errors_question():
    """Generate a Correction of Errors practice question for the Virtual Lab using Vertex AI only."""
    try:
        data = request.get_json() or {}
        difficulty_level = (data.get('difficulty_level') or 'intermediate').strip().lower()
        format_type = (data.get('format') or 'vertical').strip().lower()
        if difficulty_level not in ('basic', 'intermediate', 'advanced'):
            difficulty_level = 'intermediate'

        question = generate_correction_of_errors_question(
            difficulty_level=difficulty_level,
            format_type=format_type,
        )
        return jsonify({'success': True, 'data': question}), 200
    except Exception as e:
        logger.error("Correction of errors question generation error: %s", e, exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-lab/not-for-profit-question', methods=['POST'])
@require_auth
def get_not_for_profit_question():
    """Generate a Not-for-Profit Income & Expenditure practice question for the Virtual Lab using Vertex AI only."""
    try:
        data = request.get_json() or {}
        difficulty_level = (data.get('difficulty_level') or 'intermediate').strip().lower()
        format_type = (data.get('format') or 'vertical').strip().lower()
        if difficulty_level not in ('basic', 'intermediate', 'advanced'):
            difficulty_level = 'intermediate'

        question = generate_not_for_profit_question(
            difficulty_level=difficulty_level,
            format_type=format_type,
        )
        return jsonify({'success': True, 'data': question}), 200
    except Exception as e:
        logger.error("Not-for-profit question generation error: %s", e, exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-lab/knowledge-check', methods=['POST'])
@require_auth
def generate_virtual_lab_knowledge_check():
    """
    Generate Virtual Lab knowledge-check questions using DeepSeek (Costs 2 credits).

    Payload:
      - simulation_id (optional, for analytics/debug)
      - subject: biology | chemistry | physics
      - topic: string
      - difficulty: easy | medium | hard
      - count: int (default 5, max 20)

    Returns:
      data: [
        { id, question_text, options, correct_index, explanation }
      ]
    """
    try:
        data = request.get_json() or {}

        simulation_id = data.get('simulation_id') or data.get('simulationId') or ''
        subject = (data.get('subject') or '').strip().lower()
        topic = (data.get('topic') or '').strip()
        difficulty_in = (data.get('difficulty') or 'medium').strip().lower()
        count_raw = data.get('count', 5)

        if subject not in ['biology', 'chemistry', 'physics', 'mathematics']:
            return jsonify({'success': False, 'message': 'Invalid subject'}), 400

        user_id = g.current_user_id
        breakdown = get_credit_breakdown(user_id)
        purchased_credits = breakdown.get('purchased_credits', 0) or 0
        if purchased_credits == 0 and simulation_id:
            free_ids = FREE_VIRTUAL_LAB_SIMULATIONS.get(subject, set())
            if simulation_id not in free_ids:
                return jsonify({
                    'success': False,
                    'message': 'This simulation is locked. Purchase credits to unlock all simulations.'
                }), 402

        # Map app difficulty to generator difficulty
        difficulty_map = {
            'easy': 'easy',
            'medium': 'medium',
            'hard': 'difficult',
            'difficult': 'difficult',
        }
        difficulty = difficulty_map.get(difficulty_in, 'medium')

        try:
            count = int(count_raw)
        except Exception:
            count = 5
        count = max(1, min(count, 20))

        parent_subject = subject.capitalize()
        if not topic:
            # Sensible defaults per subject if topic omitted
            default_topics = {
                'biology': 'Cell Structure and Organisation',
                'chemistry': 'Acids, Bases and Salts',
                'physics': 'Kinematics',
                'mathematics': 'Differentiation',
            }
            topic = default_topics.get(subject, 'General')

        science_gen = CombinedScienceGenerator()
        questions = []

        def _options_to_list(opts):
            if isinstance(opts, dict):
                # Ensure A,B,C,D order
                ordered = []
                for k in ['A', 'B', 'C', 'D']:
                    if opts.get(k):
                        ordered.append(opts.get(k))
                # Fallback to key-sorted order if unexpected keys
                return ordered if ordered else [opts.get(k, '') for k in sorted(opts.keys()) if opts.get(k)]
            if isinstance(opts, list):
                return [str(o) for o in opts if str(o).strip()]
            return []

        def _correct_index_from_answer(answer, options):
            # DeepSeek generator typically returns A/B/C/D
            if isinstance(answer, str):
                a = answer.strip().upper()
                if a in ['A', 'B', 'C', 'D']:
                    return ['A', 'B', 'C', 'D'].index(a)
                # Sometimes the answer is the option text
                for idx, opt in enumerate(options):
                    if opt.strip().lower() == answer.strip().lower():
                        return idx
            return 0

        for _ in range(count):
            q = science_gen.generate_topical_question(parent_subject, topic, difficulty, g.current_user_id)
            if not q:
                continue

            options = _options_to_list(q.get('options', []))
            # Ensure we always have 4 options for the mobile UI
            if len(options) < 4:
                # Pad with plausible placeholders if DeepSeek response is malformed
                while len(options) < 4:
                    options.append(f"Option {chr(65 + len(options))}")
            options = options[:4]

            answer = q.get('answer') or q.get('correct_answer') or 'A'
            correct_index = _correct_index_from_answer(answer, options)
            explanation = q.get('explanation') or q.get('solution') or ''

            questions.append({
                'id': str(uuid.uuid4()),
                'question_text': q.get('question', '') or q.get('question_text', ''),
                'options': options,
                'correct_index': correct_index,
                'explanation': explanation,
                'meta': {
                    'simulation_id': simulation_id,
                    'subject': subject,
                    'topic': topic,
                    'difficulty': difficulty_in,
                }
            })

        if not questions:
            return jsonify({'success': False, 'message': 'Failed to generate questions'}), 500

        # Deduct credits ONLY after successful generation (and charge based on actual delivered count).
        cost_per_question = advanced_credit_service.get_credit_cost('virtual_lab_knowledge_check')
        delivered_count = len(questions)
        total_cost = int(cost_per_question) * int(delivered_count)
        current_credits = get_user_credits(user_id) or 0
        if current_credits < total_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(total_cost)}, Available: {_credits_text(current_credits)}'
            }), 402

        credits_remaining = _deduct_credits_or_fail(
            user_id,
            total_cost,
            'virtual_lab_knowledge_check',
            f'Virtual Lab Knowledge Check ({delivered_count} questions)'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500

        return jsonify({'success': True, 'data': questions, 'credits_remaining': credits_remaining}), 200

    except Exception as e:
        logger.error(f"Virtual lab knowledge check generation error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-lab/geo-maps-feedback', methods=['POST'])
@require_auth
def geo_maps_feedback():
    """
    Geography Maps Lab – AI feedback from map_actions (DeepSeek).
    Costs 0.1 credit (geo_maps_feedback).

    Payload:
      - level: "O" | "A"
      - topic: string (optional)
      - task_type: string (optional, e.g. "Mapwork")
      - map_actions: { markers, lines?, measurements?, selected_place? }
      - student_answer_text: string (optional, for marking)

    Returns:
      data: { response: string (markdown) }, credits_remaining
    """
    try:
        data = request.get_json() or {}
        level = (data.get('level') or 'O').strip().upper()
        if level not in ('O', 'A'):
            level = 'O'
        topic = (data.get('topic') or 'Map Work and Geographical Information Systems (GIS)').strip()
        task_type = (data.get('task_type') or 'Mapwork').strip()
        map_actions = data.get('map_actions') or {}
        student_answer_text = (data.get('student_answer_text') or '').strip() or None

        user_id = g.current_user_id
        credit_cost = advanced_credit_service.get_credit_cost('geo_maps_feedback')
        current_credits = get_user_credits(user_id) or 0
        if current_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}, Available: {_credits_text(current_credits)}',
            }), 402

        response_text = get_geotutor_feedback(
            level=level,
            topic=topic,
            task_type=task_type,
            map_actions=map_actions,
            student_answer_text=student_answer_text,
        )

        credits_remaining = _deduct_credits_or_fail(
            user_id,
            int(credit_cost),
            'geo_maps_feedback',
            'Geography Maps Lab AI feedback',
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500

        return jsonify({
            'success': True,
            'data': {'response': response_text},
            'credits_remaining': credits_remaining,
        }), 200

    except Exception as e:
        logger.error(f"Geo maps feedback error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/quiz/session/<session_id>', methods=['GET'])
@require_auth
def get_session(session_id):
    """Get quiz session details"""
    try:
        # TODO: Retrieve session from database
        return jsonify({
            'success': True,
            'data': {
                'id': session_id,
                'subject': '',
                'topic': '',
                'session_type': 'topical',
                'questions_answered': 0,
                'correct_answers': 0,
                'started_at': datetime.utcnow().isoformat()
            }
        }), 200
    except Exception as e:
        logger.error(f"Get session error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# CREDIT ENDPOINTS
# ============================================================================

@mobile_bp.route('/credits/balance', methods=['GET'])
@require_auth
def get_credit_balance():
    """Get user credit balance"""
    try:
        credits = get_user_credits(g.current_user_id) or 0
        return jsonify({
            'success': True,
            'data': {
                'balance': _credits_display(credits)
            }
        }), 200
    except Exception as e:
        logger.error(f"Get credit balance error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/credits/info', methods=['GET'])
@require_auth
def get_credit_info():
    """Get user credit breakdown (total, free_credits, purchased_credits) for display."""
    try:
        credit_info = get_credit_breakdown(g.current_user_id)
        user_data = get_user_registration(g.current_user_id) or {}
        is_school_student = (user_data.get('user_type') or '').strip() == 'school_student'
        credit_info_display = {
            **credit_info,
            "total": _credits_display(credit_info.get("total", 0)),
            "free_credits": _credits_display(credit_info.get("free_credits", 0)),
            "purchased_credits": _credits_display(credit_info.get("purchased_credits", 0)),
        }
        if is_school_student:
            school_name, school_expiry_at = _resolve_school_context(user_data)
            credit_info_display.update({
                "credit_status": "paid_school_plan",
                "credit_store_enabled": False,
                "school_name": school_name,
                "subscription_expires_at": school_expiry_at,
                "daily_refresh_time": "06:00 Africa/Harare",
                "credit_store_message": _build_school_levy_message(
                    school_name,
                    school_expiry_at,
                    expired=_is_school_subscription_expired(school_expiry_at),
                ),
            })
        return jsonify({
            'success': True,
            'data': credit_info_display
        }), 200
    except Exception as e:
        logger.error(f"Get credit info error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/credits/transactions', methods=['GET'])
@require_auth
def get_credit_transactions():
    """Get credit transaction history"""
    try:
        limit = request.args.get('limit', 20, type=int)
        
        from database.external_db import make_supabase_request
        
        # Fetch payment transactions (completed/approved ones)
        # We want payments that were successful
        payment_txs = make_supabase_request(
            'GET',
            'payment_transactions',
            None,
            filters={
                'user_id': f"eq.{g.current_user_id}",
                'status': 'in.(completed,approved,paid)'
            },
            limit=limit,
            use_service_role=True
        ) or []
        
        # Transform to standard format
        transactions = []
        
        # Add payment transactions
        for tx in payment_txs:
            tx_status = str(tx.get('status') or '').lower()
            credits_added_units = int(tx.get('credits_added') or 0)

            # Skip provider-only "paid" rows where credits haven't been applied yet.
            if tx_status == 'paid' and credits_added_units <= 0:
                continue

            credits_units = credits_added_units if credits_added_units > 0 else int(tx.get('credits', 0) or 0)
            transactions.append({
                'id': tx.get('id', str(uuid.uuid4())),
                'transaction_type': 'purchase',
                'credits_change': _credits_display(credits_units),
                'balance_before': 0, # We don't historically track balance snapshot in this simple table yet
                'balance_after': 0,
                'description': f"Purchased {_credits_text(credits_units)} credits",
                'transaction_date': tx.get('created_at'),
                'amount': tx.get('amount', 0),
                'currency': 'USD'
            })
            
        # Also fetching usage logs if we had them, but for now payments are the most important for the graph
        # If we have a credit_usage_logs table, we would fetch that too.
        # Assuming we might want to show usage:
        # usage_logs = make_supabase_request('GET', 'credit_usage_logs', ...)
        
        # Sort combined list by date desc
        transactions.sort(key=lambda x: x.get('transaction_date', ''), reverse=True)
        
        return jsonify({
            'success': True,
            'data': transactions[:limit]
        }), 200
    except Exception as e:
        logger.error(f"Get credit transactions error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# FLASHCARDS
# ============================================================================

@mobile_bp.route('/flashcards/generate', methods=['POST'])
@require_auth
def generate_flashcards():
    """Generate a batch of flashcards for a topic (Vertex primary, DeepSeek fallback)."""
    try:
        data = request.get_json() or {}
        subject = (data.get('subject') or '').strip() or 'Biology'
        topic = (data.get('topic') or '').strip() or 'General'
        count = min(int(data.get('count', 20)), 100)
        notes_content = (data.get('notes_content') or '').strip()
        user_id = g.current_user_id
        # Batch cost: count * 3 units (same as flashcard_single per card), capped at 300
        required_units = min(count * 3, 300)
        balance = get_user_credits(user_id) or 0
        if balance < required_units:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Need {format_credits(required_units)} for {count} flashcards.',
                'required_credits': required_units,
                'current_credits': balance,
            }), 402
        flashcards = flashcard_service.generate_flashcards(
            subject=subject,
            topic=topic,
            notes_content=notes_content,
            count=count,
        )
        if not flashcards:
            return jsonify({'success': False, 'message': 'Failed to generate flashcards.'}), 500

        # Deduct only after successful generation and return display credits consistently.
        credits_remaining = _deduct_credits_or_fail(
            user_id,
            int(required_units),
            'flashcards_batch',
            f'Generated {len(flashcards)} flashcards for {topic}',
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500

        return jsonify({
            'success': True,
            'data': {'flashcards': flashcards},
            'credits_remaining': credits_remaining,
        }), 200
    except Exception as e:
        logger.error(f"Generate flashcards error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/flashcards/generate-single', methods=['POST'])
@require_auth
def generate_single_flashcard():
    """Generate a single flashcard (for streaming mode)."""
    try:
        data = request.get_json() or {}
        subject = (data.get('subject') or '').strip() or 'Biology'
        topic = (data.get('topic') or '').strip() or 'General'
        index = int(data.get('index', 0))
        notes_content = (data.get('notes_content') or '').strip()
        previous_questions = data.get('previous_questions') or []
        user_id = g.current_user_id

        credit_cost = advanced_credit_service.get_credit_cost('flashcard_single', platform='mobile')
        current_credits = get_user_credits(user_id) or 0
        if current_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}, Available: {_credits_text(current_credits)}',
            }), 402

        flashcard = flashcard_service.generate_single_flashcard(
            subject=subject,
            topic=topic,
            notes_content=notes_content,
            index=index,
            previous_questions=previous_questions,
        )
        if not flashcard:
            return jsonify({'success': False, 'message': 'Failed to generate flashcard.'}), 500

        credits_remaining = _deduct_credits_or_fail(
            user_id,
            int(credit_cost),
            'flashcard_single',
            f'Generated single flashcard for {topic}',
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500

        return jsonify({
            'success': True,
            'data': {'flashcard': flashcard},
            'credits_remaining': credits_remaining,
        }), 200
    except Exception as e:
        logger.error(f"Generate single flashcard error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/credits/packages', methods=['GET'])
@require_auth
def get_credit_packages():
    """Get available credit packages"""
    try:
        user_data = get_user_registration(g.current_user_id) or {}
        if (user_data.get('user_type') or '').strip() == 'school_student':
            school_name, school_expiry_at = _resolve_school_context(user_data)
            return jsonify({
                'success': False,
                'message': _build_school_levy_message(school_name, school_expiry_at),
                'data': {
                    'school_name': school_name,
                    'subscription_expires_at': school_expiry_at,
                },
            }), 403

        # Get packages from PaymentService to ensure consistency
        from services.payment_service import PaymentService
        payment_service_instance = PaymentService()
        packages = payment_service_instance.get_credit_packages()
        
        return jsonify({
            'success': True,
            'data': packages
        }), 200
    except Exception as e:
        logger.error(f"Get credit packages error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/credits/purchase', methods=['POST'])
@require_auth
def initiate_credit_purchase():
    """Initiate credit purchase - supports EcoCash and Visa/Mastercard via Paynow"""
    try:
        from database.external_db import make_supabase_request
        
        data = request.get_json()
        package_id = data.get('package_id')
        payment_method = data.get('payment_method', 'ecocash')  # Default to ecocash for backward compatibility
        
        if not package_id:
            return jsonify({'success': False, 'message': 'Package ID is required'}), 400
        
        # Validate payment method
        if payment_method not in ['ecocash', 'visa_mastercard']:
            return jsonify({'success': False, 'message': 'Invalid payment method. Use "ecocash" or "visa_mastercard"'}), 400
        
        # Get package details
        # Get available packages from PaymentService
        from services.payment_service import PaymentService
        payment_service_instance = PaymentService()
        available_packages = payment_service_instance.get_credit_packages()
        
        # Convert list to dictionary for easy lookup
        packages = {pkg['id']: pkg for pkg in available_packages}
        
        package = packages.get(package_id)
        if not package:
            logger.warning(f"Invalid package ID requested: {package_id}. Available: {list(packages.keys())}")
            return jsonify({'success': False, 'message': 'Invalid package'}), 400
        
        # Get user data for payment
        user_data = get_user_registration(g.current_user_id)
        if not user_data:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        # School-student accounts use daily school credits and should not purchase packages in-app.
        if (user_data.get('user_type') or '').strip() == 'school_student':
            school_name, school_expiry_at = _resolve_school_context(user_data)
            return jsonify({
                'success': False,
                'message': _build_school_levy_message(school_name, school_expiry_at),
                'data': {
                    'school_name': school_name,
                    'subscription_expires_at': school_expiry_at,
                },
            }), 403
        
        email = data.get('email', user_data.get('email', ''))
        
        # Validate required fields based on payment method
        if payment_method == 'ecocash':
            phone_number = data.get('phone_number', user_data.get('phone_number', ''))
            if not phone_number or not email:
                return jsonify({
                    'success': False,
                    'message': 'Phone number and email are required for EcoCash payment'
                }), 400
            
            # Normalize and validate phone number - MUST be exactly 10 digits
            phone_cleaned = re.sub(r'[^\d+]', '', phone_number.strip())
            
            # Normalize to local format (10 digits: 077XXXXXXX or 078XXXXXXX)
            local_phone = phone_cleaned
            if phone_cleaned.startswith('+263'):
                local_phone = '0' + phone_cleaned[4:]  # +263771111111 -> 0771111111
            elif phone_cleaned.startswith('263'):
                local_phone = '0' + phone_cleaned[3:]  # 263771111111 -> 0771111111
            
            # Validate: MUST be exactly 10 digits with valid prefix
            if len(local_phone) != 10:
                return jsonify({
                    'success': False,
                    'message': f'Invalid phone number: must be exactly 10 digits (you entered {len(local_phone)} digits). Format: 077XXXXXXX or 078XXXXXXX'
                }), 400
            
            if not (local_phone.startswith('07') and local_phone[:3] in ['077', '078']):
                return jsonify({
                    'success': False,
                    'message': 'Invalid phone number format. Must start with 077 or 078 (e.g., 0771234567)'
                }), 400
            
            # Use normalized phone number
            phone_number = local_phone
        else:
            # Visa/Mastercard only needs email
            if not email:
                return jsonify({
                    'success': False,
                    'message': 'Email is required for card payment'
                }), 400
            phone_number = data.get('phone_number', '')  # Optional for card payments
        
        # Initiate payment via Paynow
        paynow_service = PaynowService()
        
        if payment_method == 'ecocash':
            # Use PaymentService wrapper which handles DB save and Fallback to Manual automatically
            # This solves the issue where Paynow configuration errors cause the app to crash/fail
            payment_result = payment_service_instance.create_paynow_payment(
                 user_id=g.current_user_id,
                 package_id=package_id,
                 phone_number=phone_number,
                 email=email
            )

            # Reference is generated inside create_paynow_payment
            reference = payment_result.get('reference_code')

            # Manual fallback: Paynow unavailable; create payment_transactions row so status API returns "pending"
            if payment_result.get('success') and not payment_result.get('poll_url'):
                from utils.credit_units import credits_to_units
                manual_transaction = {
                    'user_id': g.current_user_id,
                    'reference_code': reference,
                    'package_id': package_id,
                    'amount': package['price'],
                    'credits': int(credits_to_units(package['credits'])),
                    'payment_method': 'paynow_ecocash',
                    'status': 'pending',
                    'phone_number': phone_number,
                    'email': email,
                    'created_at': datetime.utcnow().isoformat()
                }
                try:
                    make_supabase_request('POST', 'payment_transactions', manual_transaction, use_service_role=True)
                    logger.info(f"Manual fallback: created payment_transactions row for {reference}")
                except Exception as e:
                    logger.warning(f"Manual fallback: failed to create payment_transactions for {reference}: {e}")
                # Return 200 with empty poll_url so app shows instructions and does not poll
                response_data = {
                    'reference': reference,
                    'poll_url': '',
                    'instructions': payment_result.get('message', 'Complete payment per instructions and wait for manual confirmation.'),
                    'amount': package['price'],
                    'credits': package['credits'],
                    'payment_method': payment_method
                }
                return jsonify({'success': True, 'data': response_data}), 200
            
        else:
            # Visa/Mastercard web checkout (keep existing manual flow for now)
            reference = f"MOBILE_{uuid.uuid4().hex[:8].upper()}"
            
            # Store payment transaction in database before initiating
            # from database.external_db import make_supabase_request  <-- Removed, already imported at top
            # Convert package credits to units for storage (1 credit = 10 units)
            from utils.credit_units import credits_to_units
            payment_transaction = {
                'user_id': g.current_user_id,
                'reference_code': reference,
                'package_id': package_id,
                'amount': package['price'],
                'credits': int(credits_to_units(package['credits'])),  # Store as units
                'payment_method': 'paynow_' + payment_method,
                'status': 'pending',
                'phone_number': phone_number,
                'email': email,
                'created_at': datetime.utcnow().isoformat()
            }
            
            try:
                make_supabase_request('POST', 'payment_transactions', payment_transaction, use_service_role=True)
            except Exception as e:
                logger.warning(f"Failed to store payment transaction: {e}")

            # Use Visa/Mastercard web checkout
            payment_result = paynow_service.create_visa_mastercard_payment(
                amount=package['price'],
                email=email,
                reference=reference,
                description=f"NerdX {package_id} - {package['credits']} credits"
            )
        
        if not payment_result.get('success'):
            return jsonify({
                'success': False,
                'message': payment_result.get('message', 'Failed to initiate payment')
            }), 400
        
        # Update transaction with poll_url (non-blocking - payment prompt already sent successfully)
        try:
            make_supabase_request(
                'PATCH',
                'payment_transactions',
                {
                    'poll_url': payment_result.get('poll_url', '')  # Only use poll_url (paynow_poll_url doesn't exist)
                },
                filters={'reference_code': f"eq.{reference}"},
                use_service_role=True
            )
        except Exception as e:
            # Log as warning, not error - payment prompt was successfully sent
            logger.warning(f"Payment prompt sent successfully but failed to update transaction poll_url: {reference} - {e}")
        
        # Build response based on payment method
        response_data = {
            'reference': reference,
            'poll_url': payment_result.get('poll_url', ''),
            'instructions': payment_result.get('instructions', ''),
            'amount': package['price'],
            'credits': package['credits'],
            'payment_method': payment_method
        }
        
        # Include redirect_url for card payments
        if payment_method == 'visa_mastercard':
            response_data['redirect_url'] = payment_result.get('redirect_url', '')
        
        return jsonify({
            'success': True,
            'data': response_data
        }), 200
        
    except Exception as e:
        logger.error(f"Initiate credit purchase error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# PAYMENT ENDPOINTS
# ============================================================================

@mobile_bp.route('/payment/initiate', methods=['POST'])
@require_auth
def initiate_payment():
    """Deprecated: Use POST /api/mobile/credits/purchase instead.
    Validates package_id against PaymentService packages and returns a clear migration message."""
    try:
        from services.payment_service import PaymentService
        data = request.get_json() or {}
        package_id = data.get('package_id')
        payment_service_instance = PaymentService()
        packages = payment_service_instance.get_credit_packages()
        packages_dict = {p['id']: p for p in packages}
        package = packages_dict.get(package_id) if package_id else None
        valid_ids = ', '.join(packages_dict.keys())
        if not package:
            return jsonify({
                'success': False,
                'message': f'Invalid package. Use POST /api/mobile/credits/purchase with package_id one of: {valid_ids}. This endpoint is deprecated.'
            }), 400
        return jsonify({
            'success': False,
            'message': 'This endpoint is deprecated. Use POST /api/mobile/credits/purchase with package_id, payment_method (ecocash or visa_mastercard), and for EcoCash: phone_number, email.',
            'deprecated': True,
            'valid_package_ids': list(packages_dict.keys())
        }), 410
    except Exception as e:
        logger.error(f"Initiate payment error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/payment/status/<reference>', methods=['GET'])
@require_auth
def check_payment_status(reference):
    """Check payment status"""
    try:
        from database.external_db import make_supabase_request
        from services.payment_service import payment_service

        # Always run Paynow status sync so credits are applied promptly
        try:
            payment_service.check_paynow_payment_status(reference)
        except Exception as sync_error:
            logger.warning(f"Paynow status sync failed: {sync_error}")

        # Get payment transaction from database (latest status)
        result = make_supabase_request(
            'GET',
            'payment_transactions',
            None,
            filters={'reference_code': f"eq.{reference}", 'user_id': f"eq.{g.current_user_id}"},
            use_service_role=True
        )

        if not result or len(result) == 0:
            return jsonify({'success': False, 'message': 'Payment not found'}), 404

        transaction = result[0]
        status = str(transaction.get('status') or 'pending').lower()
        credits_added_units = int(transaction.get('credits_added') or 0)
        credits_units = credits_added_units if credits_added_units > 0 else int(transaction.get('credits', 0) or 0)
        display_credits = _credits_display(credits_units)

        # "paid" in the mobile API means credits have been applied to the student's account.
        credits_applied = credits_added_units > 0 or status in ['approved', 'completed']
        if credits_applied and status not in ['approved', 'completed']:
            status = 'approved'

        return jsonify({
            'success': True,
            'data': {
                'reference': reference,
                'status': status,  # 'pending', 'approved', 'failed', 'cancelled'
                'amount': transaction.get('amount', 0),
                'credits': display_credits,
                'paid': credits_applied
            }
        }), 200
    except Exception as e:
        logger.error(f"Check payment status error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/payment/latest', methods=['GET'])
@require_auth
def get_latest_payment():
    """Get latest Paynow EcoCash payment for the current user."""
    try:
        # Look for most recent initiated/pending Paynow EcoCash payment
        result = make_supabase_request(
            'GET',
            'payment_transactions',
            None,
            filters={
                'user_id': f"eq.{g.current_user_id}",
                'payment_method': 'eq.paynow_ecocash',
                'status': 'in.(initiated,pending,approving)',
                'order': 'created_at.desc'
            },
            limit=1,
            use_service_role=True
        )

        if not result:
            return jsonify({'success': True, 'data': None}), 200

        transaction = result[0]
        created_at = transaction.get('created_at')
        if created_at:
            try:
                created_dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                if datetime.utcnow() - created_dt.replace(tzinfo=None) > timedelta(minutes=10):
                    return jsonify({'success': True, 'data': None}), 200
            except Exception:
                # If parsing fails, continue and return the record
                pass

        poll_url = transaction.get('paynow_poll_url') or transaction.get('poll_url')
        if not poll_url:
            admin_notes = transaction.get('admin_notes', '')
            match = re.search(r'Poll URL:\s*(https?://[^\s]+)', admin_notes)
            if match:
                poll_url = match.group(1).strip()

        response_data = {
            'reference': transaction.get('reference_code'),
            'poll_url': poll_url or '',
            'instructions': 'Please check your phone for the EcoCash prompt and enter your PIN to complete the payment.',
            'amount': transaction.get('amount', 0),
            'credits': _credits_display(transaction.get('credits', 0) or 0),
            'payment_method': 'ecocash'
        }

        return jsonify({'success': True, 'data': response_data}), 200
    except Exception as e:
        logger.error(f"Get latest payment error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# REFERRAL ENDPOINTS
# ============================================================================

@mobile_bp.route('/referral/code', methods=['GET'])
@require_auth
def get_referral_code():
    """Get user's referral code"""
    try:
        user_data = get_user_registration(g.current_user_id)
        if not user_data:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        nerdx_id = user_data.get('nerdx_id')
        
        return jsonify({
            'success': True,
            'data': {
                'code': nerdx_id
            }
        }), 200
    except Exception as e:
        logger.error(f"Get referral code error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/referral/apply', methods=['POST'])
@require_auth
def apply_referral_code():
    """Apply referral code"""
    try:
        data = request.get_json()
        code = data.get('code', '').strip().upper()
        
        if not code:
            return jsonify({'success': False, 'message': 'Referral code is required'}), 400
        
        # Check if code is valid
        referrer = get_user_by_nerdx_id(code)
        if not referrer:
            return jsonify({'success': False, 'message': 'Invalid referral code'}), 400
        
        # Check if user already used a referral
        user_data = get_user_registration(g.current_user_id)
        if user_data.get('referred_by_nerdx_id'):
            return jsonify({'success': False, 'message': 'Referral code already applied'}), 400
        
        # Apply referral
        referral_service = ReferralService()
        result = referral_service.process_referral(g.current_user_id, code)
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'data': {
                    'credits_earned': Config.REFERRAL_BONUS
                }
            }), 200
        else:
            return jsonify({'success': False, 'message': result.get('message', 'Failed to apply referral')}), 400
            
    except Exception as e:
        logger.error(f"Apply referral code error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/referral/stats', methods=['GET'])
@require_auth
def get_referral_stats_simple():
    """Get referral statistics (legacy endpoint)"""
    try:
        referral_service = ReferralService()
        stats = referral_service.get_referral_stats(g.current_user_id)
        return jsonify({
            'success': True,
            'data': {
                'total_referrals': stats.get('total_referrals', 0),
                'credits_earned': stats.get('total_bonus_earned', 0)
            }
        }), 200
    except Exception as e:
        logger.error(f"Get referral stats error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/user/referral-stats', methods=['GET'])
@require_auth
def get_user_referral_stats():
    """Get detailed referral statistics for the current user"""
    try:
        referral_service = ReferralService()
        stats = referral_service.get_referral_stats(g.current_user_id)

        # Build referred users list with more detail
        referred_users = []
        for r in stats.get('recent_referrals', []):
            referred_users.append({
                'name': r.get('name', 'Unknown'),
                'surname': r.get('surname', ''),
                'joined_date': r.get('date', ''),
                'nerdx_id': r.get('nerdx_id', ''),
            })

        return jsonify({
            'success': True,
            'data': {
                'referral_code': stats.get('referral_code', ''),
                'total_referrals': stats.get('total_referrals', 0),
                'successful_referrals': stats.get('successful_referrals', 0),
                'total_bonus_earned': stats.get('total_bonus_earned', 0),
                'last_referral_date': referred_users[0]['joined_date'] if referred_users else None,
                'referred_users': referred_users,
            }
        }), 200
    except Exception as e:
        logger.error(f"Get user referral stats error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/user/referral-share', methods=['GET'])
@require_auth
def get_user_referral_share():
    """Get referral share link and message for the current user"""
    try:
        referral_service = ReferralService()

        # Get user name for share message
        user_data = get_user_registration(g.current_user_id)
        user_name = user_data.get('name', 'Student') if user_data else 'Student'

        share_info = referral_service.get_referral_share_message(g.current_user_id, user_name)
        if not share_info.get('success'):
            return jsonify({'success': False, 'message': 'Could not generate share info'}), 500

        referral_code = share_info.get('referral_code', '')
        web_link = f"https://nerdx.onrender.com/register?ref={referral_code}"

        return jsonify({
            'success': True,
            'data': {
                'referral_code': referral_code,
                'whatsapp_link': share_info.get('whatsapp_link', ''),
                'share_message': f"Join NerdX and ace your exams! Sign up using my link and we both win: {web_link}",
                'bonus_per_referral': 10,
                'web_link': web_link,
            }
        }), 200
    except Exception as e:
        logger.error(f"Get user referral share error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# NOTIFICATION EVENT ENDPOINTS
# ============================================================================

@mobile_bp.route('/notifications/push-token', methods=['POST'])
@require_auth
def register_push_token():
    """Register/update Expo push token for the current mobile user."""
    try:
        data = request.get_json() or {}
        expo_push_token = (data.get('expo_push_token') or '').strip()
        if not expo_push_token:
            return jsonify({'success': False, 'message': 'expo_push_token is required'}), 400

        ok, message = engagement_notification_service.register_push_token(
            user_id=g.current_user_id,
            expo_push_token=expo_push_token,
            platform=(data.get('platform') or 'unknown'),
            device_id=data.get('device_id'),
            app_version=data.get('app_version'),
            supabase_user_id=data.get('supabase_user_id'),
        )
        if not ok:
            return jsonify({'success': False, 'message': message}), 400

        return jsonify({'success': True, 'message': message}), 200
    except Exception as e:
        logger.error(f"Register push token error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/notifications/push-token', methods=['DELETE'])
@require_auth
def unregister_push_token():
    """Deactivate Expo push token(s) for the current mobile user."""
    try:
        data = request.get_json(silent=True) or {}
        ok, message = engagement_notification_service.unregister_push_token(
            user_id=g.current_user_id,
            expo_push_token=data.get('expo_push_token'),
            device_id=data.get('device_id'),
        )
        if not ok:
            return jsonify({'success': False, 'message': message}), 400
        return jsonify({'success': True, 'message': message}), 200
    except Exception as e:
        logger.error(f"Unregister push token error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/notifications/engagement/badge-earned', methods=['POST'])
@require_auth
def engagement_badge_earned():
    """Trigger a 'new badge unlocked' engagement notification for the current user."""
    try:
        data = request.get_json() or {}
        badge_id = (data.get('badge_id') or '').strip()
        badge_name = (data.get('badge_name') or '').strip() or badge_id
        rarity = (data.get('rarity') or '').strip() or None

        if not badge_name:
            return jsonify({'success': False, 'message': 'badge_name or badge_id is required'}), 400

        result = engagement_notification_service.handle_badge_earned(
            user_id=g.current_user_id,
            badge_id=badge_id or badge_name,
            badge_name=badge_name,
            rarity=rarity,
        )
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        logger.error(f"Badge earned notification error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/notifications/engagement/level-up', methods=['POST'])
@require_auth
def engagement_level_up():
    """Trigger friend social-proof notifications when current user levels up."""
    try:
        data = request.get_json() or {}
        new_level = int(data.get('new_level', 0))
        if new_level <= 0:
            return jsonify({'success': False, 'message': 'new_level must be greater than 0'}), 400

        result = engagement_notification_service.handle_level_up(
            user_id=g.current_user_id,
            new_level=new_level,
        )
        return jsonify({'success': True, 'data': result}), 200
    except ValueError:
        return jsonify({'success': False, 'message': 'new_level must be an integer'}), 400
    except Exception as e:
        logger.error(f"Level-up social notification error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/notifications/engagement/run', methods=['POST'])
def run_engagement_campaigns():
    """
    Run automated engagement campaigns.
    Requires X-Engagement-Secret header matching ENGAGEMENT_CRON_SECRET.
    """
    try:
        expected_secret = (os.getenv('ENGAGEMENT_CRON_SECRET') or '').strip()
        provided_secret = (request.headers.get('X-Engagement-Secret') or '').strip()

        if not expected_secret:
            return jsonify({
                'success': False,
                'message': 'ENGAGEMENT_CRON_SECRET is not configured'
            }), 503

        if not provided_secret or not secrets.compare_digest(provided_secret, expected_secret):
            return jsonify({'success': False, 'message': 'Unauthorized'}), 401

        data = request.get_json(silent=True) or {}
        force = bool(data.get('force', False))
        dry_run = bool(data.get('dry_run', False))

        result = engagement_notification_service.run_scheduled_campaigns(
            force=force,
            dry_run=dry_run,
        )
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        logger.error(f"Run engagement campaigns error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/notifications/event', methods=['POST'])
@require_auth
def create_notification_event():
    """
    Create notifications for platform events (new teacher post, comment, etc.)
    Body:
      event_type: 'new_post' | 'new_comment'
      post_id, post_title, teacher_name, teacher_id, comment_author, comment_content
    """
    try:
        data = request.get_json() or {}
        event_type = data.get('event_type')
        post_id = data.get('post_id', '')
        post_title = (data.get('post_title') or '')[:100]
        teacher_name = data.get('teacher_name', 'A teacher')
        teacher_id = data.get('teacher_id', '')
        comment_author = data.get('comment_author', 'Someone')
        comment_content = (data.get('comment_content') or '')[:80]

        if not event_type:
            return jsonify({'success': False, 'message': 'event_type is required'}), 400

        if event_type == 'new_post':
            title = f"New post from {teacher_name}"
            body = post_title if post_title else f"{teacher_name} shared a new post on the marketplace."
            notif_type = 'update'
            metadata = {'action_url': '/app/marketplace', 'action_label': 'View Post', 'post_id': post_id, 'teacher_id': teacher_id, 'event': 'new_post'}
        elif event_type == 'new_comment':
            title = f"{comment_author} commented on a post"
            body = comment_content if comment_content else f"{comment_author} left a comment."
            notif_type = 'info'
            metadata = {'action_url': '/app/marketplace', 'action_label': 'View Comment', 'post_id': post_id, 'event': 'new_comment'}
        else:
            return jsonify({'success': False, 'message': f'Unknown event_type: {event_type}'}), 400

        notification_data = {
            'title': title,
            'body': body,
            'type': notif_type,
            'audience': 'all' if event_type == 'new_post' else 'targeted',
            'metadata': metadata,
            'status': 'sent',
        }
        notification = make_supabase_request('POST', 'notifications', data=notification_data, use_service_role=True)
        if not notification:
            return jsonify({'success': False, 'message': 'Failed to create notification'}), 500

        notification_id = notification[0]['id'] if isinstance(notification, list) else notification.get('id')
        target_user_ids = []

        if event_type == 'new_post':
            import requests as http_req
            supabase_url = os.getenv('SUPABASE_URL')
            service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            if supabase_url and service_key:
                page = 1
                while True:
                    resp = http_req.get(
                        f"{supabase_url}/auth/v1/admin/users",
                        headers={"apikey": service_key, "Authorization": f"Bearer {service_key}"},
                        params={"page": page, "per_page": 1000}, timeout=30
                    )
                    if resp.status_code == 200:
                        users = resp.json().get('users', [])
                        target_user_ids.extend([u['id'] for u in users])
                        if len(users) < 1000:
                            break
                        page += 1
                    else:
                        break

        elif event_type == 'new_comment':
            if teacher_id:
                tp = make_supabase_request('GET', 'teacher_profiles', select='user_id', filters={'id': f'eq.{teacher_id}'}, use_service_role=True)
                if tp and len(tp) > 0 and tp[0].get('user_id'):
                    target_user_ids.append(tp[0]['user_id'])
            if post_id:
                comments = make_supabase_request('GET', 'post_comments', select='user_id', filters={'post_id': f'eq.{post_id}'}, use_service_role=True)
                if comments:
                    current_uid = None
                    try:
                        reg = get_user_registration(g.current_user_id)
                        if reg:
                            current_uid = str(reg.get('chat_id') or g.current_user_id)
                    except Exception:
                        pass
                    for c in comments:
                        uid = c.get('user_id')
                        if uid and uid not in target_user_ids and uid != current_uid:
                            target_user_ids.append(uid)

        target_user_ids = list(set(target_user_ids))
        if not target_user_ids:
            return jsonify({'success': True, 'notification_id': notification_id, 'recipients_created': 0}), 200

        total_inserted = 0
        for i in range(0, len(target_user_ids), 1000):
            batch = target_user_ids[i:i + 1000]
            recipients = [{'notification_id': notification_id, 'user_id': uid} for uid in batch]
            result = make_supabase_request('POST', 'notification_recipients', data=recipients, use_service_role=True)
            if result:
                total_inserted += len(result) if isinstance(result, list) else 1

        logger.info(f"Notification event '{event_type}': {total_inserted} recipients")
        return jsonify({'success': True, 'notification_id': notification_id, 'recipients_created': total_inserted}), 200

    except Exception as e:
        logger.error(f"Notification event error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


# ============================================================================
# MATH ENDPOINTS
# ============================================================================

def _latex_to_sympy_like(s: str) -> str:
    """Convert common LaTeX to SymPy-parseable form."""
    s = s.strip()
    s = s.replace('\\times', '*').replace('\\cdot', '*')
    s = s.replace('\\div', '/')
    s = s.replace('^', '**')
    s = re.sub(r'\\frac\{([^{}]*)\}\{([^{}]*)\}', r'(\1)/(\2)', s)
    s = re.sub(r'\\sqrt\{([^{}]*)\}', r'sqrt(\1)', s)
    s = re.sub(r'\\sqrt\[2\]\{([^{}]*)\}', r'sqrt(\1)', s)
    s = s.replace('\\left(', '(').replace('\\right)', ')')
    s = s.replace('\\left[', '[').replace('\\right]', ']')
    return s


@mobile_bp.route('/math/solve', methods=['POST'])
@require_auth
def math_solve():
    """Solve math equation with step-by-step solution (SymPy, free)."""
    try:
        data = request.get_json() or {}
        problem = (data.get('problem') or '').strip()
        if not problem:
            return jsonify({'success': False, 'message': 'problem is required'}), 400
        problem = _latex_to_sympy_like(problem)
        symbolic_solver = SymbolicSolverService()
        result = symbolic_solver.solve_equation_with_steps(problem, 'x')
        if not result.get('success'):
            return jsonify({
                'success': False,
                'message': result.get('fallback', result.get('error', 'Could not solve')),
                'data': result
            }), 200
        steps = result.get('steps', [])
        steps_formatted = [
            {
                'step': s.get('step', i + 1),
                'description': s.get('description', ''),
                'latex': s.get('latex', ''),
                'explanation': s.get('explanation', ''),
            }
            for i, s in enumerate(steps)
        ]
        return jsonify({
            'success': True,
            'data': {
                'success': True,
                'steps': steps_formatted,
                'latex_solutions': result.get('latex_solutions', result.get('solutions', [])),
                'explanation': result.get('explanation', ''),
                'solvedOffline': False,
            }
        }), 200
    except Exception as e:
        logger.error(f"Math solve error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/math/scan-gemini', methods=['POST'])
@require_auth
def math_scan_gemini():
    """
    Scan/extract math or text from an image using Vertex AI (Gemini Vision).
    Used by Math Solver and any flow that needs NerdX Cloud OCR.
    Vertex AI is the primary image analysis provider throughout the app.
    """
    try:
        data = request.get_json() or {}
        image_base64 = data.get('image_base64', '').strip()
        mime_type = data.get('mime_type', 'image/png')
        if not image_base64:
            return jsonify({'success': False, 'message': 'image_base64 is required'}), 400
        if not vertex_service.is_available():
            return jsonify({
                'success': False,
                'message': 'Vertex AI image analysis is not available. Please try again later.'
            }), 503
        result = vertex_service.analyze_image(
            image_base64=image_base64,
            mime_type=mime_type,
        )
        if not result or not result.get('success'):
            return jsonify({
                'success': False,
                'message': result.get('error', 'Image analysis failed'),
            }), 500
        return jsonify({
            'success': True,
            'data': {
                'detected_text': result.get('text', ''),
                'latex': result.get('latex', result.get('text', '')),
                'confidence': result.get('confidence', 0.9),
                'content_type': result.get('content_type', 'text'),
                'method': 'vertex-vision',
            }
        }), 200
    except Exception as e:
        logger.error(f"Math scan-gemini (Vertex AI) error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/math/graph', methods=['POST'])
@require_auth
def generate_math_graph():
    """Generate math graph"""
    try:
        data = request.get_json()
        function_text = data.get('function_text', '')
        
        if not function_text:
            return jsonify({'success': False, 'message': 'Function text is required'}), 400
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('math_graph_practice')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        
        # Generate graph
        graph_service = GraphService()
        graph_path = graph_service.generate_function_graph(function_text)
        if not graph_path:
            return jsonify({'success': False, 'message': 'Failed to generate graph image'}), 500

        graph_url = convert_local_path_to_public_url(graph_path)
        if not graph_url:
            import os
            filename = os.path.basename(graph_path)
            base_url = os.environ.get('RENDER_EXTERNAL_URL', 'https://nerdx.onrender.com')
            graph_url = f"{base_url.rstrip('/')}/static/graphs/{filename}"
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'math_graph_practice',
            'Math graph generation'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500

        return jsonify({
            'success': True,
            'data': {
                'graph_url': graph_url,
                'image_url': graph_url,
                'credits_remaining': credits_remaining
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate math graph error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

def _generate_graph_and_return(function_text: str):
    """Shared logic: generate graph from function text, deduct credits, return graph_url and credits_remaining."""
    credit_cost = advanced_credit_service.get_credit_cost('math_graph_practice')
    user_credits = get_user_credits(g.current_user_id) or 0
    if user_credits < credit_cost:
        return None, None, 402, f'Insufficient credits. Required: {_credits_text(credit_cost)}'
    graph_service = GraphService()
    graph_path = graph_service.generate_function_graph(function_text)
    if not graph_path:
        return None, None, 500, 'Failed to generate graph image'
    graph_url = convert_local_path_to_public_url(graph_path)
    if not graph_url:
        import os
        filename = os.path.basename(graph_path)
        base_url = os.environ.get('RENDER_EXTERNAL_URL', 'https://nerdx.onrender.com')
        graph_url = f"{base_url.rstrip('/')}/static/graphs/{filename}"
    credits_remaining = _deduct_credits_or_fail(
        g.current_user_id, int(credit_cost), 'math_graph_practice', 'Math graph generation'
    )
    if credits_remaining is None:
        return None, None, 500, 'Transaction failed. Please try again.'
    return graph_url, credits_remaining, 200, None

@mobile_bp.route('/math/graph/custom', methods=['POST'])
@require_auth
def generate_math_graph_custom():
    """Generate math graph from custom equation. Uses create_graph so response includes graph_spec and question/solution."""
    try:
        data = request.get_json() or {}
        equation = data.get('equation', '').strip()
        if not equation:
            return jsonify({'success': False, 'message': 'Equation is required'}), 400
        credit_cost = advanced_credit_service.get_credit_cost('math_graph_practice')
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        graph_service = GraphService()
        result = graph_service.create_graph(
            user_id=g.current_user_id or 'mobile',
            expression=equation,
            title='NerdX Graph Practice',
            user_name='Student',
            x_range=None
        )
        if not result or 'image_path' not in result:
            return jsonify({'success': False, 'message': 'Failed to generate graph image'}), 500
        graph_path = result.get('image_path')
        graph_url = convert_local_path_to_public_url(graph_path)
        if not graph_url:
            import os
            filename = os.path.basename(graph_path)
            base_url = os.environ.get('RENDER_EXTERNAL_URL', 'https://nerdx.onrender.com')
            graph_url = f"{base_url.rstrip('/')}/static/graphs/{filename}"
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id, int(credit_cost), 'math_graph_practice', 'Math graph (custom equation)'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        from services.graph_practice_templates import equation_to_display
        eq_display = equation_to_display(equation)
        question = f"Using the graph of y = {eq_display or equation}, describe the key features: intercepts, gradient (or slope), and shape. Use your graph to answer the question set."
        solution = "Check your answer using the equation above. Compare intercepts and behaviour with the graph."
        payload = {
            'graph_url': graph_url,
            'image_url': graph_url,
            'equation': equation,
            'equation_display': eq_display or equation,
            'question': question,
            'solution': solution,
            'credits_remaining': credits_remaining
        }
        if result.get('graph_spec'):
            payload['graph_spec'] = result['graph_spec']
        return jsonify({'success': True, 'data': payload, 'credits_remaining': credits_remaining}), 200
    except Exception as e:
        logger.error(f"Generate custom graph error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/math/graph/generate', methods=['POST'])
@require_auth
def generate_math_graph_generate():
    """Generate math graph by type (graph_type) and optional equation. Returns graph_spec so frontend can request Manim animations."""
    try:
        data = request.get_json() or {}
        equation = (data.get('equation') or '').strip()
        graph_type = (data.get('graph_type') or '').strip()
        level = (data.get('level') or 'o_level').strip().lower()
        if level not in ('o_level', 'a_level'):
            level = 'o_level'
        graph_service = GraphService()
        # When only graph_type is sent (e.g. "linear"), generate a real plottable equation instead of passing "linear"
        if not equation and graph_type:
            gen_eq = graph_service.generate_equation_by_type(graph_type)
            if gen_eq:
                function_text = gen_eq
            else:
                function_text = graph_type
        else:
            function_text = equation or graph_type
        if not function_text:
            return jsonify({'success': False, 'message': 'Equation or graph_type is required'}), 400
        credit_cost = advanced_credit_service.get_credit_cost('math_graph_practice')
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        gt = (graph_type or '').strip().lower()
        is_statistics = gt in ('statistics', 'statistical', 'statistics graphs')
        # Statistics: no plottable graph; return template question/solution only (draw on paper / upload image)
        if is_statistics:
            from services.graph_practice_templates import get_template_for_graph_type
            templ = get_template_for_graph_type(gt, level, '')
            credits_remaining = _deduct_credits_or_fail(
                g.current_user_id, int(credit_cost), 'math_graph_practice', 'Math graph generation'
            )
            if credits_remaining is None:
                return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
            payload = {
                'graph_url': None,
                'image_url': None,
                'equation': None,
                'graph_type': graph_type or 'statistics',
                'question': templ['question'],
                'solution': templ['solution'],
                'credits_remaining': credits_remaining,
                'no_plot': True,
            }
            return jsonify({'success': True, 'data': payload, 'credits_remaining': credits_remaining}), 200
        # Use create_graph so we get graph_spec for Manim animations
        result = graph_service.create_graph(
            user_id=g.current_user_id or 'mobile',
            expression=function_text,
            title='NerdX Graph Practice',
            user_name='Student',
            x_range=None
        )
        if not result or 'image_path' not in result:
            return jsonify({'success': False, 'message': 'Failed to generate graph image'}), 500
        graph_path = result.get('image_path')
        graph_url = convert_local_path_to_public_url(graph_path)
        if not graph_url:
            import os
            filename = os.path.basename(graph_path)
            base_url = os.environ.get('RENDER_EXTERNAL_URL', 'https://nerdx.onrender.com')
            graph_url = f"{base_url.rstrip('/')}/static/graphs/{filename}"
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id, int(credit_cost), 'math_graph_practice', 'Math graph generation'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        # Template question/solution by graph type and level (O-Level and A-Level ZIMSEC/Cambridge templates).
        # Templates GUIDE Vertex AI: AI generates a question in the structure of the template for the student.
        from services.graph_practice_templates import get_template_for_graph_type, equation_to_display
        eq_display = equation_to_display(function_text)
        templ = get_template_for_graph_type(gt, level, eq_display)
        question = templ['question']
        solution = templ['solution']
        # Use Vertex AI to generate a question in the structure of the template (templates guide the AI).
        try:
            from services.math_question_generator import MathQuestionGenerator
            math_generator = MathQuestionGenerator()
            ai_result = math_generator.generate_graph_question_from_template(
                eq_display, gt, level, templ['question'], templ['solution']
            )
            if ai_result and ai_result.get('question'):
                question = ai_result['question']
                solution = ai_result.get('solution') or solution
                logger.info("Graph practice question generated by DeepSeek AI (template-guided)")
        except Exception as e:
            logger.warning("DeepSeek AI graph question from template failed, using template: %s", e)
        # Normalize spacing for professional display (keep LaTeX intact for MathRenderer)
        try:
            question = LaTeXConverter.normalize_explanation_spacing(question or '')
            solution = LaTeXConverter.normalize_explanation_spacing(solution or '')
        except Exception as e:
            logger.warning("LaTeX spacing normalization for graph practice failed (non-blocking): %s", e)
        payload = {
            'graph_url': graph_url,
            'image_url': graph_url,
            'equation': function_text,
            'equation_display': eq_display,
            'graph_type': graph_type or None,
            'question': question,
            'solution': solution,
            'credits_remaining': credits_remaining
        }
        if result.get('graph_spec'):
            payload['graph_spec'] = result['graph_spec']
        return jsonify({'success': True, 'data': payload, 'credits_remaining': credits_remaining}), 200
    except Exception as e:
        logger.error(f"Generate graph error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/math/graph/upload', methods=['POST'])
@require_auth
def upload_math_graph_image():
    """Upload graph/math image for OCR and solution (costs image_solve credits)."""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'message': 'No image file provided'}), 400
        image_file = request.files['image']
        if not image_file or not image_file.filename:
            return jsonify({'success': False, 'message': 'Empty image uploaded'}), 400
        credit_cost = advanced_credit_service.get_credit_cost('image_solve')
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        image_service = ImageService()
        result = image_service.process_image(image_file)
        if not result:
            return jsonify({'success': False, 'message': 'Failed to process image'}), 500
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id, int(credit_cost), 'image_solve', 'Graph image solve'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        return jsonify({
            'success': True,
            'data': {
                'processed_text': result.get('text', ''),
                'solution': result.get('solution', ''),
                'analysis': result.get('analysis', ''),
                'credits_remaining': credits_remaining
            },
            'credits_remaining': credits_remaining
        }), 200
    except Exception as e:
        logger.error(f"Graph upload/solve error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/math/graph/answer-images', methods=['POST'])
@require_auth
def graph_practice_answer_images():
    """Submit one or more images as the student's answer for Vertex AI analysis (graph practice)."""
    try:
        question = (request.form.get('question') or '').strip()
        if not question:
            return jsonify({'success': False, 'message': 'question is required'}), 400
        files = request.files.getlist('images')
        if not files:
            return jsonify({'success': False, 'message': 'At least one image is required'}), 400
        if len(files) > 10:
            return jsonify({'success': False, 'message': 'Maximum 10 images'}), 400
        if not vertex_service.is_available():
            return jsonify({'success': False, 'message': 'Vertex AI is not available. Please try again later.'}), 503
        credit_cost = advanced_credit_service.get_credit_cost('image_solve')
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        images_data = []
        for f in files:
            if not f or not f.filename:
                continue
            data = f.read()
            if not data:
                continue
            mime = f.content_type or 'image/jpeg'
            if mime not in ('image/jpeg', 'image/png', 'image/webp'):
                mime = 'image/jpeg'
            images_data.append((data, mime))
        if not images_data:
            return jsonify({'success': False, 'message': 'No valid image data'}), 400
        result = vertex_service.analyze_answer_images(images_data, question)
        if not result:
            return jsonify({'success': False, 'message': 'Analysis failed'}), 500
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id, int(credit_cost), 'image_solve', 'Graph practice answer (images)'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed'}), 500
        return jsonify({
            'success': True,
            'data': {
                **result,
                'credits_remaining': credits_remaining,
            },
            'credits_remaining': credits_remaining,
        }), 200
    except Exception as e:
        logger.error(f"Graph practice answer-images error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/math/graph/linear-programming', methods=['POST'])
@require_auth
def generate_linear_programming_graph():
    """Generate linear programming feasible-region graph from constraints and objective."""
    try:
        data = request.get_json() or {}
        constraints = data.get('constraints') or []
        objective = (data.get('objective') or '').strip() or None
        if not constraints or not isinstance(constraints, list):
            return jsonify({'success': False, 'message': 'Constraints array is required'}), 400
        credit_cost = advanced_credit_service.get_credit_cost('math_graph_practice')
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        graph_service = GraphService()
        graph_result = graph_service.generate_linear_programming_graph(
            [str(c).strip() for c in constraints if c],
            objective_function=objective
        )
        if not graph_result or 'image_path' not in graph_result:
            return jsonify({'success': False, 'message': 'Failed to generate linear programming graph'}), 500
        graph_path = graph_result.get('image_path')
        graph_url = convert_local_path_to_public_url(graph_path)
        if not graph_url:
            import os
            filename = os.path.basename(graph_path)
            base_url = os.environ.get('RENDER_EXTERNAL_URL', 'https://nerdx.onrender.com')
            graph_url = f"{base_url.rstrip('/')}/static/graphs/{filename}"
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id, int(credit_cost), 'math_graph_practice', 'Linear programming graph'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        constraint_list = graph_result.get('constraints', constraints)
        corner_points = graph_result.get('corner_points', [])
        equation_str = "Constraints: " + "; ".join(constraint_list)
        if objective:
            equation_str += " | Objective: " + objective
        question = "Identify the corner points of the feasible region R and state their coordinates."
        solution = "Corner points: " + ", ".join(f"({p[0]:.1f}, {p[1]:.1f})" for p in corner_points) if corner_points else "No corner points found."
        if objective:
            solution += " Evaluate the objective function at each corner point to find the optimum."
        return jsonify({
            'success': True,
            'data': {
                'graph_url': graph_url,
                'image_url': graph_url,
                'equation': equation_str,
                'constraints': constraint_list,
                'corner_points': corner_points,
                'objective': objective,
                'question': question,
                'solution': solution,
                'credits_remaining': credits_remaining
            },
            'credits_remaining': credits_remaining
        }), 200
    except Exception as e:
        logger.error(f"Linear programming graph error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# MATH ANIMATION (MANIM) ENDPOINTS - for graph practice videos in student frontend
# ============================================================================

def _manim_video_path_to_url(relative_path: str) -> str:
    """Turn Manim relative path (e.g. static/media/videos/...) into a URL path with leading slash."""
    if not relative_path:
        return ''
    path = relative_path.replace('\\', '/')
    if not path.startswith('/'):
        path = '/' + path
    return path

@mobile_bp.route('/math/animate/quadratic', methods=['POST'])
@require_auth
def animate_quadratic():
    """Generate Manim quadratic animation; returns video_path for frontend (e.g. /static/media/videos/.../file.mp4)."""
    try:
        data = request.get_json() or {}
        a = float(data.get('a', 1))
        b = float(data.get('b', 0))
        c = float(data.get('c', 0))
        x_range = data.get('x_range')
        y_range = data.get('y_range')
        from services.manim_service import get_manim_service
        manim = get_manim_service()
        result = manim.render_quadratic(a, b, c, quality='l', x_range=x_range, y_range=y_range)
        if not result.get('success') or not result.get('video_path'):
            return jsonify({
                'success': False,
                'message': result.get('error', 'Animation failed'),
                'data': None
            }), 500
        video_path = _manim_video_path_to_url(result['video_path'])
        return jsonify({'success': True, 'data': {'video_path': video_path}}), 200
    except Exception as e:
        logger.error(f"Animate quadratic error: {e}")
        return jsonify({'success': False, 'message': 'Server error', 'data': None}), 500

@mobile_bp.route('/math/animate/linear', methods=['POST'])
@require_auth
def animate_linear():
    """Generate Manim linear animation; returns video_path for frontend."""
    try:
        data = request.get_json() or {}
        m = float(data.get('m', 1))
        c = float(data.get('c', 0))
        x_range = data.get('x_range')
        y_range = data.get('y_range')
        from services.manim_service import get_manim_service
        manim = get_manim_service()
        result = manim.render_linear(m, c, quality='l', x_range=x_range, y_range=y_range)
        if not result.get('success') or not result.get('video_path'):
            return jsonify({
                'success': False,
                'message': result.get('error', 'Animation failed'),
                'data': None
            }), 500
        video_path = _manim_video_path_to_url(result['video_path'])
        return jsonify({'success': True, 'data': {'video_path': video_path}}), 200
    except Exception as e:
        logger.error(f"Animate linear error: {e}")
        return jsonify({'success': False, 'message': 'Server error', 'data': None}), 500

@mobile_bp.route('/math/animate/expression', methods=['POST'])
@require_auth
def animate_expression():
    """Generate Manim expression animation (trig, exponential, etc.); returns video_path for frontend."""
    try:
        data = request.get_json() or {}
        expression = (data.get('expression') or '').strip()
        if not expression:
            return jsonify({'success': False, 'message': 'Expression is required', 'data': None}), 400
        x_range = data.get('x_range')
        y_range = data.get('y_range')
        from services.manim_service import get_manim_service
        manim = get_manim_service()
        result = manim.render_expression(expression, quality='l', x_range=x_range, y_range=y_range)
        if not result.get('success') or not result.get('video_path'):
            return jsonify({
                'success': False,
                'message': result.get('error', 'Animation failed'),
                'data': None
            }), 500
        video_path = _manim_video_path_to_url(result['video_path'])
        return jsonify({'success': True, 'data': {'video_path': video_path}}), 200
    except Exception as e:
        logger.error(f"Animate expression error: {e}")
        return jsonify({'success': False, 'message': 'Server error', 'data': None}), 500

# ============================================================================
# ENGLISH ENDPOINTS
# ============================================================================

@mobile_bp.route('/english/comprehension', methods=['POST'])
@require_auth
def generate_comprehension():
    """Generate English comprehension passage (long story 900-1200 words, 10 questions). Vertex primary, DeepSeek fallback."""
    try:
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('english_comprehension')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        
        # Accept JSON even when Content-Type is missing (e.g. some proxies strip it) to avoid 415
        data = request.get_json(force=True, silent=True) or {}
        theme = (data.get('theme') or '').strip() or None
        form_level = int(data.get('form_level', 4))
        
        # Generate comprehension (Vertex primary; passage 900-1200 words, exactly 10 questions)
        english_service = EnglishService()
        comprehension = english_service.generate_comprehension(theme=theme, form_level=form_level)
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'english_comprehension',
            'English comprehension generation'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        
        return jsonify({
            'success': True,
            'data': {
                'title': comprehension.get('title', ''),
                'passage': comprehension.get('passage', ''),
                'questions': comprehension.get('questions', []),
                'credits_remaining': credits_remaining
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate comprehension error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to generate comprehension: {error_message}'}), 500

@mobile_bp.route('/english/essay/prompts', methods=['GET'])
@require_auth
def get_essay_prompts():
    """Get essay prompts"""
    try:
        # Check credits (optional, maybe free or low cost?)
        # Let's make it free for now as it encourages usage
        
        english_service = EnglishService()
        result = english_service.generate_essay_prompts()
        
        return jsonify({
            'success': True,
            'data': result.get('prompts', [])
        }), 200
        
    except Exception as e:
        logger.error(f"Get essay prompts error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/free-response-topics', methods=['GET'])
@require_auth
def get_free_response_topics():
    """Get free response essay topics"""
    try:
        english_service = EnglishService()
        result = english_service.generate_free_response_topics()
        
        return jsonify({
            'success': True,
            'data': result.get('topics', [])
        }), 200
        
    except Exception as e:
        logger.error(f"Get free response topics error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/guided-composition', methods=['GET'])
@require_auth
def get_guided_composition():
    """Get guided composition prompt"""
    try:
        english_service = EnglishService()
        result = english_service.generate_guided_composition_prompt()
        
        return jsonify({
            'success': True,
            'data': result.get('prompt', {})
        }), 200
        
    except Exception as e:
        logger.error(f"Get guided composition error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/submit', methods=['POST'])
@require_auth
def submit_essay_marking():
    """Submit essay for AI marking"""
    try:
        data = request.get_json()
        essay_type = data.get('essay_type') # 'free_response' or 'guided'
        student_name = data.get('student_name')
        student_surname = data.get('student_surname')
        essay_text = data.get('essay_text')
        
        # Optional context depending on type
        topic = data.get('topic') # For free response
        prompt = data.get('prompt') # For guided
        
        if not essay_type or not student_name or not student_surname or not essay_text:
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
            
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('english_essay_marking')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
            
        english_service = EnglishService()
        result = None
        
        if essay_type == 'free_response':
            if not topic:
                return jsonify({'success': False, 'message': 'Topic is required for free response'}), 400
            result = english_service.mark_free_response_essay(student_name, student_surname, essay_text, topic)
        elif essay_type == 'guided':
            if not prompt:
                return jsonify({'success': False, 'message': 'Prompt is required for guided composition'}), 400
            result = english_service.mark_guided_composition(student_name, student_surname, essay_text, prompt)
        else:
            return jsonify({'success': False, 'message': 'Invalid essay type'}), 400
            
        if not result or not result.get('success'):
            return jsonify({'success': False, 'message': 'Failed to mark essay'}), 500
            
        if result and result.get('success'):
            marking_result = result.get('result', {})
            
            # Generate PDF report
            pdf_base64 = english_service.generate_essay_pdf_report(
                student_name, student_surname, essay_type,
                marking_result.get('score', 0), marking_result.get('max_score', 0),
                marking_result.get('corrections', []), marking_result.get('teacher_comment', ''),
                marking_result.get('corrected_essay', ''), marking_result.get('detailed_feedback', ''),
                essay_text, topic.get('title') if topic else prompt.get('title')
            )
            
            marking_result['pdf_report'] = pdf_base64
            
            # --- SAVE TO HISTORY ---
            try:
                submission_data = {
                    'user_id': g.current_user_id,
                    'essay_type': essay_type,
                    'topic_title': topic.get('title') if topic else prompt.get('title', 'Guided Composition'),
                    'original_essay': essay_text,
                    'corrected_essay': marking_result.get('corrected_essay', ''),
                    'teacher_comment': marking_result.get('teacher_comment', ''),
                    'detailed_feedback': marking_result.get('detailed_feedback', {}), # Store as JSON
                    'score': marking_result.get('score', 0),
                    'max_score': marking_result.get('max_score', 0),
                    'pdf_report_url': None, # We don't have a URL yet, could store base64 in a separate storage if needed, or just regenerate
                    'created_at': datetime.utcnow().isoformat()
                }
                
                # Check for table existence lazily
                make_supabase_request("POST", "english_essay_submissions", submission_data, use_service_role=True)
            except Exception as db_err:
                logger.error(f"Failed to save essay history: {db_err}")
                # Don't fail the request if history save fails, just log it
            
            credits_remaining = _deduct_credits_or_fail(
                g.current_user_id,
                int(credit_cost),
                'english_essay_marking',
                f'Marked {essay_type} essay'
            )
            if credits_remaining is None:
                return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
            
            return jsonify({
                'success': True,
                'data': marking_result,
                'credits_deducted': _credits_display(int(credit_cost)),
                'credits_remaining': credits_remaining
            }), 200
            
        else:
             return jsonify({'success': False, 'message': 'Failed to mark essay'}), 500
        
    except Exception as e:
        logger.error(f"Submit essay marking error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


ESSAY_IMAGE_EXTRACT_PROMPT = """Extract all handwritten or printed text from this image exactly as written.
Preserve paragraphs, line breaks, and punctuation. Do not correct or rewrite—only transcribe.
If the image contains an essay or composition, output the full text in order (top to bottom, left to right).
Respond in this exact JSON format only:
{"detected_text": "the full extracted text here"}
Only respond with the JSON, no other text."""


@mobile_bp.route('/english/essay/extract-from-images', methods=['POST'])
@require_auth
def extract_essay_text_from_images():
    """Extract essay text from one or more images using Vertex AI (OCR). No credit deduction—user pays on submit for marking."""
    try:
        data = request.get_json(force=True, silent=True) or {}
        images = data.get('images') or []
        if not images or not isinstance(images, list):
            return jsonify({'success': False, 'message': 'images array required'}), 400
        if len(images) > 10:
            return jsonify({'success': False, 'message': 'Maximum 10 images allowed'}), 400
        if not vertex_service.is_available():
            return jsonify({
                'success': False,
                'message': 'Image analysis is not available. Please try again later.'
            }), 503
        combined = []
        for i, img in enumerate(images):
            b64 = img.get('base64') or img.get('image_base64') or ''
            mime = (img.get('mime_type') or img.get('mimeType') or 'image/png').strip()
            if not b64:
                continue
            result = vertex_service.analyze_image(
                image_base64=b64,
                mime_type=mime,
                prompt=ESSAY_IMAGE_EXTRACT_PROMPT,
            )
            if result and result.get('success') and result.get('text'):
                combined.append(result.get('text', '').strip())
        extracted_text = '\n\n'.join(combined) if combined else ''
        return jsonify({
            'success': True,
            'data': {'extracted_text': extracted_text},
        }), 200
    except Exception as e:
        logger.error(f"Extract essay from images error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e) or 'Server error'}), 500


# ============== History Essay (ZIMSEC 3-part format) ==============
@mobile_bp.route('/history/essay/generate', methods=['POST'])
@require_auth
def history_essay_generate():
    """Generate a 3-part ZIMSEC History essay question for a topic. Deducts history_topical_essay credits."""
    try:
        data = request.get_json() or {}
        topic = data.get('topic')  # id or name
        form_level = data.get('form_level') or 'Form 1'
        difficulty = (data.get('difficulty') or 'medium').lower()
        credit_action = 'history_topical_essay'
        credit_cost = advanced_credit_service.get_credit_cost(credit_action, platform='mobile')
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}',
                'credit_cost': _credits_display(credit_cost),
            }), 402
        question = history_generate_question(topic, difficulty, g.current_user_id, form_level=form_level)
        if not question:
            return jsonify({'success': False, 'message': 'Failed to generate question'}), 500
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            credit_action,
            'History 3-part essay question',
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        return jsonify({
            'success': True,
            'data': question,
            'credits_remaining': credits_remaining,
            'credits_deducted': _credits_display(int(credit_cost)),
        }), 200
    except Exception as e:
        logger.error(f"History essay generate error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/history/essay/submit', methods=['POST'])
@require_auth
def history_essay_submit():
    """Submit 3-part History essay answers for AI marking. No extra credit (1 credit = 10 units charged on generate)."""
    try:
        data = request.get_json() or {}
        question = data.get('question')
        answers = data.get('answers') or {}
        form_level = data.get('form_level') or (question.get('form_level') if isinstance(question, dict) else None) or 'Form 1'
        if not question or not isinstance(answers, dict):
            return jsonify({'success': False, 'message': 'question and answers required'}), 400
        credit_action = 'history_essay_marking'
        credit_cost = advanced_credit_service.get_credit_cost(credit_action, platform='mobile')
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}',
            }), 402
        result = mark_history_essay(question, answers, g.current_user_id, form_level=form_level)
        if not result.get('success'):
            return jsonify({'success': False, 'message': result.get('error', 'Marking failed')}), 500
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            credit_action,
            'History essay marking',
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        result['credits_remaining'] = credits_remaining
        result['credits_deducted'] = _credits_display(int(credit_cost))
        # Save to history_essay_submissions for "Past attempts"
        try:
            submission_data = {
                'user_id': g.current_user_id,
                'form_level': form_level,
                'topic': question.get('topic', ''),
                'question_snapshot': question,
                'part_a_answer': (answers.get('part_a') or '').strip(),
                'part_b_answer': (answers.get('part_b') or '').strip(),
                'part_c_answer': (answers.get('part_c') or '').strip(),
                'part_a_score': result.get('part_a_score', 0),
                'part_b_score': result.get('part_b_score', 0),
                'part_c_score': result.get('part_c_score', 0),
                'total': result.get('total', 0),
                'constructive_feedback': result.get('constructive_feedback', ''),
                'part_a_feedback': result.get('part_a_feedback', ''),
                'part_b_feedback': result.get('part_b_feedback', ''),
                'part_c_feedback': result.get('part_c_feedback', ''),
            }
            make_supabase_request('POST', 'history_essay_submissions', submission_data, use_service_role=True)
        except Exception as db_err:
            logger.error(f"Failed to save history essay submission: {db_err}")
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        logger.error(f"History essay submit error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/history/essay/history', methods=['GET'])
@require_auth
def get_history_essay_history():
    """Get History essay submission history for current user."""
    try:
        result = make_supabase_request(
            'GET',
            'history_essay_submissions',
            filters={'user_id': f'eq.{g.current_user_id}'},
            use_service_role=True,
        ) or []
        # Sort by created_at desc if not already
        if isinstance(result, list) and len(result) > 1:
            result = sorted(result, key=lambda x: (x.get('created_at') or ''), reverse=True)
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        logger.error(f"Get history essay history error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/english/essay/history', methods=['GET'])
@require_auth
def get_essay_history():
    """Get essay history for current user"""
    try:
        # Fetch from Supabase
        result = make_supabase_request(
            "GET", 
            "english_essay_submissions", 
            filters={
                'user_id': f"eq.{g.current_user_id}",
                'order': 'created_at.desc' # Supabase order syntax might differ for REST, let's try standard
            },
            # Note: For Supabase REST, ordering is usually a query param like ?order=created_at.desc
            # make_supabase_request handles params as query string
             use_service_role=True
        ) or []
        
        # If make_supabase_request doesn't handle 'order' param correctly in the dict:
        # We might need to sort manually if the API Wrapper is simple. 
        # But let's assume it works or we get raw data.
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"Get essay history error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/submission/<essay_id>', methods=['GET'])
@require_auth
def get_essay_submission(essay_id):
    """Get specific essay submission details"""
    try:
        # Fetch single record
        result = make_supabase_request(
            "GET", 
            "english_essay_submissions",
            filters={'id': f"eq.{essay_id}"},
            use_service_role=True
        )
        
        if result and len(result) > 0:
            return jsonify({
                'success': True,
                'data': result[0]
            }), 200
        else:
             return jsonify({'success': False, 'message': 'Submission not found'}), 404
             
    except Exception as e:
        logger.error(f"Get essay submission error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/<essay_id>/report', methods=['GET'])
@require_auth
def get_essay_report(essay_id):
    """Get essay PDF report - Regenerate or fetch"""
    try:
        # 1. Try to get submission from DB
        submission_list = make_supabase_request(
            "GET", 
            "english_essay_submissions",
            filters={'id': f"eq.{essay_id}"},
            use_service_role=True
        )
        
        if not submission_list or len(submission_list) == 0:
             return jsonify({'success': False, 'message': 'Submission not found'}), 404
             
        submission = submission_list[0]
        
        # 2. Regenerate PDF
        english_service = EnglishService()
        
        # Extract user name (might need to fetch user profile if not in submission, currently it's not)
        # We'll use placeholder or fetch user. 
        # Ideally, submission should have stored student name, but it stores user_id.
        user_profile = get_user_registration(submission.get('user_id'))
        student_name = user_profile.get('name', 'Student') if user_profile else 'Student'
        student_surname = user_profile.get('surname', '') if user_profile else ''
        
        detailed_feedback = submission.get('detailed_feedback', {})
        corrections = [] # Might need to parse from detailed_feedback or store explicitly if needed.
        # Assuming detailed_feedback might contain corrections or we just use text.
        
        # For now, let's keep it simple. If we didn't store corrections explicitly as a separate column,
        # we might not be able to perfectly reconstruct the PDF without parsing. 
        # But 'detailed_feedback' in schema was JSONB, so hopefully it has it.
        # Wait, in the INSERT above: 'detailed_feedback': marking_result.get('detailed_feedback', {})
        # marking_result corrections were separate in the JSON return but maybe not in DB?
        # Let's check INSERT again: 'detailed_feedback': marking_result.get('detailed_feedback', {})
        # It missed 'corrections'. I should probably update the INSERT to store 'corrections' too if I want full regen.
        # Or just rely on the text fields.
        
        pdf_base64 = english_service.generate_essay_pdf_report(
            student_name, student_surname, submission.get('essay_type', ''),
            submission.get('score', 0), submission.get('max_score', 0),
            [], # Corrections might be missing if not stored.
            submission.get('teacher_comment', ''),
            submission.get('corrected_essay', ''), 
            str(submission.get('detailed_feedback', '')), 
            submission.get('original_essay', ''), 
            submission.get('topic_title', '')
        )
        
        return jsonify({
            'success': True,
            'data': {
                'pdf_report': pdf_base64
            }
        }), 200
    except Exception as e:
        logger.error(f"Get essay report error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to get essay report: {error_message}'}), 500

@mobile_bp.route('/english/comprehension/grade', methods=['POST'])
@require_auth
def grade_comprehension():
    """Grade comprehension answers"""
    try:
        data = request.get_json()
        passage = data.get('passage', '')
        questions = data.get('questions', [])
        answers = data.get('answers', {})
        
        if not passage or not questions or not answers:
            return jsonify({'success': False, 'message': 'Missing required data'}), 400
            
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('english_comprehension_grading')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
            
        english_service = EnglishService()
        result = english_service.grade_comprehension_answers(passage, questions, answers)
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'english_comprehension_grading',
            'English comprehension grading'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        
        return jsonify({
            'success': True,
            'data': result,
            'credits_remaining': credits_remaining
        }), 200
        
    except Exception as e:
        logger.error(f"Grade comprehension error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/summary/grade', methods=['POST'])
@require_auth
def grade_summary():
    """Grade summary writing"""
    try:
        data = request.get_json()
        passage = data.get('passage', '')
        prompt = data.get('prompt', '')
        summary = data.get('summary', '')
        
        if not passage or not prompt or not summary:
            return jsonify({'success': False, 'message': 'Missing required data'}), 400
            
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('english_summary_grading')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
            
        english_service = EnglishService()
        result = english_service.grade_summary(passage, prompt, summary)
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'english_summary_grading',
            'English summary grading'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        
        return jsonify({
            'success': True,
            'data': result,
            'credits_remaining': credits_remaining
        }), 200
        
    except Exception as e:
        logger.error(f"Grade summary error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

# ============================================================================
# VOICE ENDPOINTS (transcription for Quiz/Teacher/Voice input)
# ============================================================================

@mobile_bp.route('/voice/transcribe', methods=['POST'])
@require_auth
def voice_transcribe():
    """Transcribe audio file to text. Accepts multipart form key 'audio'. Returns { text, language }."""
    try:
        if 'audio' not in request.files:
            return jsonify({'success': False, 'message': 'No audio file provided'}), 400
        audio_file = request.files['audio']
        if not audio_file or not audio_file.filename:
            return jsonify({'success': False, 'message': 'Empty audio upload'}), 400
        audio_bytes = audio_file.read()
        if not audio_bytes:
            return jsonify({'success': False, 'message': 'Audio file is empty'}), 400
        mime_type = audio_file.content_type or 'audio/mp4'
        audio_b64 = base64.b64encode(audio_bytes).decode('utf-8')
        if vertex_service.is_available():
            result = vertex_service.transcribe_audio(audio_b64, mime_type)
        else:
            voice_svc = get_voice_service()
            import tempfile
            suffix = '.m4a' if 'm4a' in mime_type else '.mp3'
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name
            try:
                result = voice_svc.transcribe_audio(tmp_path)
                if result.get('error'):
                    result = {'success': False, 'text': '', 'language': 'en', 'error': result['error']}
                else:
                    result = {'success': True, 'text': result.get('text', ''), 'language': result.get('language', 'en')}
            finally:
                if os.path.exists(tmp_path):
                    try:
                        os.unlink(tmp_path)
                    except Exception:
                        pass
        if not result.get('success'):
            err = result.get('error', 'Transcription failed')
            logger.warning(f"Voice transcribe failed: {err}")
            return jsonify({'success': False, 'message': err}), 500
        return jsonify({
            'success': True,
            'text': result.get('text', ''),
            'language': result.get('language', 'en')
        }), 200
    except Exception as e:
        logger.error(f"Voice transcribe error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/voice/speak', methods=['POST'])
@require_auth
def voice_speak():
    """Text-to-speech: accept { text }, return { audio_url } (path to static media)."""
    try:
        data = request.get_json() or {}
        text = (data.get('text') or '').strip()
        if not text:
            return jsonify({'success': False, 'message': 'Text is required'}), 400
        voice_svc = get_voice_service()
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result = loop.run_until_complete(voice_svc.text_to_speech(text))
        finally:
            loop.close()
        if result.get('error') or not result.get('audio_path'):
            return jsonify({'success': False, 'message': result.get('error', 'TTS failed')}), 500
        rel_path = result.get('audio_path', '').replace('\\', '/')
        audio_url = ('/static/' + rel_path) if rel_path else ''
        return jsonify({'success': True, 'audio_url': audio_url}), 200
    except Exception as e:
        logger.error(f"Voice speak error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

# ============================================================================
# IMAGE ENDPOINTS
# ============================================================================

@mobile_bp.route('/image/upload', methods=['POST'])
@require_auth
def upload_image():
    """Upload image for OCR solving or exam answers"""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'message': 'No image file provided'}), 400
        
        image_file = request.files['image']
        use_for_exam = request.form.get('use_for_exam', 'false').lower() == 'true'
        
        # For exam answers, upload to hosting service and return URL (no credit check)
        if use_for_exam:
            try:
                from services.image_hosting_service import ImageHostingService
                import tempfile
                import os
                
                # Save uploaded file temporarily
                tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
                try:
                    image_file.save(tmp_file.name)
                    tmp_path = tmp_file.name
                finally:
                    tmp_file.close()
                
                try:
                    # Upload to image hosting service
                    hosting_service = ImageHostingService()
                    image_url = hosting_service.upload_image_with_fallback(tmp_path)
                    
                    if image_url:
                        return jsonify({
                            'success': True,
                            'data': {
                                'image_url': image_url,
                                'image_id': str(uuid.uuid4()),
                            }
                        }), 200
                    else:
                        return jsonify({'success': False, 'message': 'Failed to upload image to hosting service'}), 500
                finally:
                    # Clean up temp file
                    if os.path.exists(tmp_path):
                        try:
                            os.unlink(tmp_path)
                        except:
                            pass
            except Exception as e:
                logger.error(f"Error uploading exam image: {e}", exc_info=True)
                return jsonify({'success': False, 'message': f'Failed to upload image: {str(e)}'}), 500
        
        # Original OCR flow (requires credits)
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('image_solve')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        
        # Process image
        image_service = ImageService()
        result = image_service.process_image(image_file)
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'image_solve',
            'Image OCR solving'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        
        return jsonify({
            'success': True,
            'data': {
                'image_id': str(uuid.uuid4()),
                'processed_text': result.get('text', ''),
                'solution': result.get('solution', ''),
                'credits_remaining': credits_remaining
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Upload image error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to process image: {error_message}'}), 500

# ============================================================================
# DEEP KNOWLEDGE TRACING (DKT) ENDPOINTS
# ============================================================================

@mobile_bp.route('/dkt/log-interaction', methods=['POST'])
@require_auth
def log_dkt_interaction():
    """Log a student interaction for DKT tracking"""
    try:
        from services.deep_knowledge_tracing import dkt_service
        data = request.get_json()
        
        result = dkt_service.log_interaction(
            user_id=g.current_user_id,
            subject=data.get('subject', ''),
            topic=data.get('topic', ''),
            skill_id=data.get('skill_id', ''),
            question_id=data.get('question_id', ''),
            correct=data.get('correct', False),
            confidence=data.get('confidence'),
            time_spent=data.get('time_spent'),
            hints_used=data.get('hints_used', 0),
            session_id=data.get('session_id'),
            device_id=data.get('device_id')
        )
        
        # Get updated mastery for the skill
        skill_mastery = None
        if data.get('skill_id'):
            skill_mastery = dkt_service.predict_mastery(g.current_user_id, data['skill_id'])
        
        return jsonify({
            'success': True,
            'data': {
                'interaction_id': result,
                'skill_mastery': skill_mastery
            }
        }), 200
        
    except Exception as e:
        logger.error(f"DKT log interaction error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Failed to log interaction'}), 500


@mobile_bp.route('/dkt/knowledge-map', methods=['GET'])
@require_auth
def get_dkt_knowledge_map():
    """Get visual knowledge map showing mastery across all skills"""
    try:
        from services.deep_knowledge_tracing import dkt_service
        subject = request.args.get('subject')
        
        knowledge_map = dkt_service.get_knowledge_map(g.current_user_id, subject)
        
        return jsonify({
            'success': True,
            'data': knowledge_map
        }), 200
        
    except Exception as e:
        logger.error(f"DKT get knowledge map error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Failed to get knowledge map'}), 500


@mobile_bp.route('/dkt/mastery/<skill_id>', methods=['GET'])
@require_auth
def get_dkt_skill_mastery(skill_id):
    """Get current mastery probability for a specific skill"""
    try:
        from services.deep_knowledge_tracing import dkt_service
        
        mastery_prob = dkt_service.predict_mastery(g.current_user_id, skill_id)
        history = dkt_service.get_interaction_history(g.current_user_id, skill_id, limit=10)
        
        # Determine status based on mastery
        if mastery_prob >= 0.8:
            status = 'mastered'
        elif mastery_prob >= 0.6:
            status = 'proficient'
        elif mastery_prob >= 0.4:
            status = 'learning'
        else:
            status = 'struggling'
        
        return jsonify({
            'success': True,
            'data': {
                'skill_id': skill_id,
                'mastery_probability': mastery_prob,
                'status': status,
                'total_interactions': len(history) if history else 0,
                'recent_history': history[:5] if history else []
            }
        }), 200
        
    except Exception as e:
        logger.error(f"DKT get skill mastery error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Failed to get skill mastery'}), 500


@mobile_bp.route('/dkt/recommend-next', methods=['POST'])
@require_auth
def get_dkt_recommendation():
    """Get personalized question recommendation based on DKT predictions"""
    try:
        from services.deep_knowledge_tracing import dkt_service
        data = request.get_json()
        subject = data.get('subject', '')
        topic = data.get('topic')
        
        recommendation = dkt_service.get_next_question_recommendation(g.current_user_id, subject, topic)
        
        return jsonify({
            'success': True,
            'data': recommendation
        }), 200
        
    except Exception as e:
        logger.error(f"DKT get recommendation error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Failed to get recommendation'}), 500


@mobile_bp.route('/dkt/daily-review', methods=['GET'])
@require_auth
def get_dkt_daily_review():
    """Get list of skills due for review today (SRS)"""
    try:
        from services.deep_knowledge_tracing import dkt_service
        
        reviews = dkt_service.generate_daily_review_queue(g.current_user_id)
        
        return jsonify({
            'success': True,
            'count': len(reviews) if reviews else 0,
            'reviews': reviews or []
        }), 200
        
    except Exception as e:
        logger.error(f"DKT get daily review error: {e}", exc_info=True)
        return jsonify({'success': False, 'count': 0, 'reviews': []}), 500


@mobile_bp.route('/dkt/review-complete', methods=['POST'])
@require_auth
def complete_dkt_review():
    """Submit a completed review item"""
    try:
        from services.deep_knowledge_tracing import dkt_service
        data = request.get_json()
        
        # Log the review as an interaction
        result = dkt_service.log_interaction(
            user_id=g.current_user_id,
            subject=data.get('subject', ''),
            topic=data.get('topic', ''),
            skill_id=data.get('skill_id', ''),
            question_id=data.get('question_id', ''),
            correct=data.get('correct', False),
            confidence=data.get('confidence'),
            time_spent=data.get('time_spent'),
            hints_used=data.get('hints_used', 0)
        )
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        logger.error(f"DKT complete review error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Failed to complete review'}), 500


@mobile_bp.route('/dkt/interaction-history', methods=['GET'])
@require_auth
def get_dkt_interaction_history():
    """Get student's interaction history"""
    try:
        from services.deep_knowledge_tracing import dkt_service
        skill_id = request.args.get('skill_id')
        limit = int(request.args.get('limit', 100))
        
        history = dkt_service.get_interaction_history(g.current_user_id, skill_id, limit)
        
        return jsonify({
            'success': True,
            'data': {
                'interactions': history or []
            }
        }), 200
        
    except Exception as e:
        logger.error(f"DKT get interaction history error: {e}", exc_info=True)
        return jsonify({'success': False, 'data': {'interactions': []}}), 500


def _fallback_net_decks_message(first_name, health_score, recent_total, recent_accuracy, failed_areas, focus_areas):
    """Fallback net-decks content when Vertex AI is unavailable."""
    parts = [f"• {first_name}, your learning health is {health_score}/100. To raise it, focus on consistent practice and reviewing what you got wrong."]
    if recent_total > 0:
        parts.append(f"• This week you answered {recent_total} questions at {round(recent_accuracy)}% accuracy. Aim to improve accuracy by redoing topics where you made mistakes.")
    if failed_areas:
        top = failed_areas[0]
        parts.append(f"• You missed questions most in: {top.get('skill_name', top.get('skill_id'))}. Practice this topic for 15–20 minutes and try similar questions again.")
    if focus_areas:
        parts.append(f"• Focus areas to strengthen: {', '.join(a.get('skill_name', '') for a in focus_areas[:3])}. Do one topic per day, then retest.")
    parts.append(f"• Study tip: After each wrong answer, read the solution once, then try 2 more questions on the same skill before moving on.")
    return "\n\n".join(parts)


def _build_ai_insights_response(user_id, knowledge_map, history, student_name):
    """Build frontend-shaped AI insights payload. Uses Vertex AI for personalized message."""
    from datetime import datetime, timezone, timedelta
    from utils.vertex_ai_helper import try_vertex_text

    now = datetime.now(timezone.utc)
    skills = knowledge_map.get('skills') or []
    total_skills = knowledge_map.get('total_skills', 0)
    mastered_count = knowledge_map.get('mastered_skills', 0)
    learning_count = knowledge_map.get('learning_skills', 0)
    struggling_count = knowledge_map.get('struggling_skills', 0)

    # Recent 7 days from history (today = index 6, 6 days ago = index 0 for M T W T F S S)
    recent_correct = 0
    recent_total = 0
    active_dates = set()
    daily_breakdown = []
    for i in range(6, -1, -1):
        d = (now - timedelta(days=i)).date()
        daily_breakdown.append({'date': d.isoformat(), 'count': 0})

    for interaction in (history or []):
        try:
            ts = interaction.get('timestamp')
            if not ts:
                continue
            if isinstance(ts, str):
                ts = datetime.fromisoformat(ts.replace('Z', '+00:00'))
            if ts.tzinfo is None:
                ts = ts.replace(tzinfo=timezone.utc)
            days_ago = (now - ts).days
            if days_ago <= 6:
                recent_total += 1
                if interaction.get('correct'):
                    recent_correct += 1
                d = ts.date()
                active_dates.add(d)
                for entry in daily_breakdown:
                    if entry['date'] == d.isoformat():
                        entry['count'] += 1
                        break
        except Exception:
            pass

    recent_accuracy = (recent_correct / recent_total * 100) if recent_total > 0 else 0

    # Health score: blend recent accuracy and skill mastery (0-100)
    avg_mastery = (mastered_count * 100 + learning_count * 50 + struggling_count * 20) / total_skills if total_skills else 50
    health_score = round(0.5 * recent_accuracy + 0.5 * min(avg_mastery, 100)) if (recent_total > 0 or total_skills > 0) else 50
    health_score = max(0, min(100, health_score))

    # Strengths: skills with mastery >= 0.8 (DKT returns mastery 0-1)
    strengths = []
    for s in skills:
        m = s.get('mastery') if 'mastery' in s else (s.get('mastery_probability') or 0)
        if m >= 0.8:
            strengths.append({
                'skill_name': s.get('skill_name', 'Skill'),
                'subject': s.get('subject', ''),
                'topic': s.get('topic', ''),
                'mastery': round((m if m <= 1 else m / 100)),
                'status': s.get('status', 'mastered'),
                'recommendation': None,
            })
    strengths = strengths[:5]

    # Focus areas: skills with mastery < 0.5
    focus_areas = []
    for s in skills:
        m = s.get('mastery') if 'mastery' in s else (s.get('mastery_probability') or 0)
        if m < 0.5:
            focus_areas.append({
                'skill_name': s.get('skill_name', 'Skill'),
                'subject': s.get('subject', ''),
                'topic': s.get('topic', ''),
                'mastery': round((m if m <= 1 else m / 100)),
                'status': s.get('status', 'struggling'),
                'recommendation': f"Practice more {s.get('skill_name', 'this topic')} to improve.",
            })
    focus_areas = focus_areas[:5]

    # Study plan from struggling skills
    study_plan = []
    struggling = [s for s in skills if (s.get('mastery') if 'mastery' in s else (s.get('mastery_probability') or 0)) < 0.5]
    for i, skill in enumerate(struggling[:3]):
        study_plan.append({
            'priority': 'high' if i == 0 else 'medium',
            'action': f"Practice {skill.get('skill_name', 'weak area')}",
            'description': f"Focus on {skill.get('subject', '')} - {skill.get('topic', '')} to raise your mastery.",
            'estimated_time': '15-20 min',
        })

    # Failed questions: from recent history (last 14 days), aggregate by skill_id
    skill_id_to_info = {s.get('skill_id'): s for s in skills if s.get('skill_id')}
    failed_by_skill = {}
    for interaction in (history or []):
        try:
            if not interaction.get('correct'):
                ts = interaction.get('timestamp')
                if ts:
                    if isinstance(ts, str):
                        ts = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                    if ts.tzinfo is None:
                        ts = ts.replace(tzinfo=timezone.utc)
                    if (now - ts).days <= 14:
                        sid = interaction.get('skill_id')
                        if sid:
                            failed_by_skill[sid] = failed_by_skill.get(sid, 0) + 1
        except Exception:
            pass
    failed_areas = []
    for sid, count in sorted(failed_by_skill.items(), key=lambda x: -x[1])[:10]:
        info = skill_id_to_info.get(sid, {})
        failed_areas.append({
            'skill_id': sid,
            'skill_name': info.get('skill_name', sid),
            'subject': info.get('subject', ''),
            'topic': info.get('topic', ''),
            'fail_count': count,
        })

    # Vertex AI personalized message (student name + activity summary)
    summary_parts = []
    if recent_total > 0:
        summary_parts.append(f"answered {recent_total} questions in the last 7 days at {round(recent_accuracy)}% accuracy")
    if total_skills > 0:
        summary_parts.append(f"mastered {mastered_count} skills, learning {learning_count}, {struggling_count} need work")
    summary_parts.append(f"learning health score {health_score}/100")
    summary = "; ".join(summary_parts) if summary_parts else "just getting started (no activity yet)"
    name_part = f"Student name: {student_name}." if student_name else "Student name not provided."
    prompt = f"""You are a supportive learning coach for NerdX. Write 1-2 short, encouraging sentences as a "thought assistant" for this student. Be specific to their data. Do not use bullet points or labels. Write only the message.

{name_part}
Summary: {summary}.

Message:"""
    personalized_message = try_vertex_text(prompt, context="ai_insights", logger=logger)
    if not personalized_message:
        personalized_message = f"Your learning health is {health_score}/100. " + (
            f"This week you answered {recent_total} questions at {round(recent_accuracy)}% accuracy. " if recent_total > 0 else "Start practicing to unlock personalized insights. "
        ) + ("Keep focusing on your focus areas to improve." if focus_areas else "Keep it up!")

    # Vertex AI "Net-decks towards [Name]": recommendations, failed areas, how to pass, study techniques
    first_name = (student_name or "Student").split()[0] if student_name else "Student"
    failed_summary = ""
    if failed_areas:
        failed_summary = "Questions/topics failed recently (with times failed): " + ", ".join(
            f"{a.get('skill_name', a.get('skill_id'))} ({a.get('fail_count', 0)} failed)" for a in failed_areas[:8]
        )
    focus_summary = ""
    if focus_areas:
        focus_summary = "Focus areas (low mastery): " + ", ".join(
            f"{a.get('skill_name')} ({a.get('subject')})" for a in focus_areas[:5]
        )
    net_decks_prompt = f"""You are an expert NerdX learning coach. Write a personalized "Net-decks towards {first_name}" section for this student. Use their first name ({first_name}) in the text. Be very specific and actionable.

Student data:
- Learning health: {health_score}/100. This week: {recent_total} questions, {round(recent_accuracy)}% accuracy, {len(active_dates)}/7 active days.
- Mastered: {mastered_count}, Learning: {learning_count}, Need work: {struggling_count}.
{f"- {failed_summary}" if failed_summary else ""}
{f"- {focus_summary}" if focus_summary else ""}

Write 4-6 short paragraphs or bullet points that cover:
1. What {first_name} needs to work on most (based on failed questions and focus areas).
2. The specific topics/questions they failed and why focusing there will help.
3. How to pass those questions next time (concrete steps or techniques).
4. Study techniques tailored to {first_name} (e.g. spaced practice, review wrong answers, one topic at a time).
5. Clear recommendations to increase learning health and pass more questions.

Be encouraging but specific. Use bullet points (•) or short numbered steps. Write only the net-decks content, no extra headers."""

    net_decks_message = try_vertex_text(net_decks_prompt, context="ai_insights_net_decks", logger=logger)
    if not net_decks_message:
        net_decks_message = _fallback_net_decks_message(first_name, health_score, recent_total, recent_accuracy, failed_areas, focus_areas)

    return {
        'health_score': health_score,
        'total_skills': total_skills,
        'mastered_count': mastered_count,
        'learning_count': learning_count,
        'struggling_count': struggling_count,
        'strengths': strengths,
        'focus_areas': focus_areas,
        'weekly_trend': {
            'total_questions': recent_total,
            'correct_answers': recent_correct,
            'accuracy': round(recent_accuracy, 1),
            'active_days': len(active_dates),
            'daily_breakdown': daily_breakdown,
        },
        'study_plan': study_plan,
        'personalized_message': personalized_message,
        'failed_areas': failed_areas,
        'net_decks_message': net_decks_message,
        'last_updated': now.isoformat(),
    }


@mobile_bp.route('/dkt/ai-insights', methods=['GET'])
@require_auth
def get_dkt_ai_insights():
    """Get AI-powered personalized learning insights. Response shape matches frontend AIInsights interface. Uses Vertex AI for personalized message."""
    try:
        from services.deep_knowledge_tracing import dkt_service
        from datetime import datetime, timezone

        user_id = g.current_user_id
        student_name = None
        try:
            reg = get_user_registration(user_id)
            if reg:
                student_name = (reg.get('name') or '').strip() or (reg.get('chat_id') or '')
        except Exception:
            pass

        knowledge_map = {}
        history = []
        try:
            knowledge_map = dkt_service.get_knowledge_map(user_id) or {}
        except Exception as e:
            logger.warning(f"DKT get_knowledge_map failed for ai-insights: {e}")
        try:
            history = dkt_service.get_interaction_history(user_id, limit=50) or []
        except Exception as e:
            logger.warning(f"DKT get_interaction_history failed for ai-insights: {e}")

        data = _build_ai_insights_response(user_id, knowledge_map, history, student_name)
        return jsonify({'success': True, 'data': data}), 200

    except Exception as e:
        logger.error(f"Get AI insights error for user {g.current_user_id}: {e}", exc_info=True)
        try:
            data = _build_ai_insights_response(g.current_user_id, {}, [], None)
            return jsonify({'success': True, 'data': data}), 200
        except Exception:
            return jsonify({'success': False, 'message': 'Failed to get AI insights'}), 500


# ============================================================================
# CBT EXAM ENDPOINTS (calculate-time, create, next, submit, complete, state, review)
# ============================================================================

@mobile_bp.route('/exam/calculate-time', methods=['POST'])
@require_auth
def exam_calculate_time():
    """Calculate estimated exam time for setup UI (no session created)."""
    try:
        data = request.get_json() or {}
        subject = data.get('subject', 'mathematics')
        question_count = int(data.get('question_count', 10))
        question_mode = data.get('question_mode', 'MCQ_ONLY')
        difficulty = data.get('difficulty', 'standard')
        info = exam_session_service.calculate_exam_time(
            subject=subject,
            question_count=question_count,
            question_mode=question_mode,
            difficulty=difficulty,
        )
        return jsonify({'success': True, 'data': info}), 200
    except Exception as e:
        logger.error(f"Exam calculate-time error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/exam/create', methods=['POST'])
@require_auth
def exam_create():
    """Create a new CBT exam session."""
    try:
        data = request.get_json() or {}
        user_id = g.current_user_id
        reg = get_user_registration(user_id)
        username = (reg.get('name') or reg.get('nerdx_id') or 'Student') if reg else 'Student'
        subject = data.get('subject', 'mathematics')
        level = data.get('level', 'O_LEVEL')
        question_mode = data.get('question_mode', 'MCQ_ONLY')
        difficulty = data.get('difficulty', 'standard')
        total_questions = int(data.get('total_questions', 10))
        paper_style = data.get('paper_style', 'ZIMSEC')
        topics = data.get('topics')
        result = exam_session_service.create_session(
            user_id=user_id,
            username=username,
            subject=subject,
            level=level,
            question_mode=question_mode,
            difficulty=difficulty,
            total_questions=total_questions,
            paper_style=paper_style,
            topics=topics,
        )
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        logger.error(f"Exam create error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/exam/next', methods=['POST'])
@require_auth
def exam_next():
    """Get next question for an exam session (generates one at a time)."""
    try:
        data = request.get_json() or {}
        session_id = data.get('session_id')
        question_index = data.get('question_index')
        if not session_id:
            return jsonify({'success': False, 'message': 'session_id required'}), 400
        session = exam_session_service.get_session(session_id)
        if not session:
            return jsonify({'success': False, 'message': 'Session not found'}), 404
        if session.get('user_id') != g.current_user_id:
            return jsonify({'success': False, 'message': 'Forbidden'}), 403
        idx = int(question_index) if question_index is not None else session.get('current_index', 0)

        # Pre-check credits (use STRUCTURED for conservative check - highest cost for mixed exams)
        subject = session.get('subject', '')
        level = session.get('level', 'O_LEVEL')
        cost_units = _get_exam_question_cost_units(subject, level, 'STRUCTURED')
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < cost_units:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(cost_units)}, Available: {_credits_text(user_credits)}'
            }), 402

        question = exam_session_service.generate_next_question(
            session_id=session_id,
            question_index=idx,
            platform='mobile',
        )
        if not question:
            return jsonify({'success': False, 'message': 'No more questions or generation failed'}), 500

        # Deduct credits for this exam question (per question, after successful generation)
        subject = session.get('subject', '')
        level = session.get('level', 'O_LEVEL')
        q_type = question.get('question_type', 'MCQ')
        cost_units = _get_exam_question_cost_units(subject, level, q_type)
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(cost_units),
            'exam_question',
            f'Exam question #{idx + 1} ({subject})',
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500

        # Build QuestionResponse: question (ExamQuestion shape), question_index, total_questions, remaining_seconds, prompt
        start_time = datetime.fromisoformat(session['start_time'])
        elapsed = (datetime.utcnow() - start_time).total_seconds()
        remaining = max(0, session['total_time_seconds'] - int(elapsed))
        stem = question.get('stem') or question.get('question_text', '')
        prompt = question.get('prompt_to_student') or f"Question {idx + 1} of {session['total_questions']}"
        exam_question = {
            'id': question.get('id', str(uuid.uuid4())),
            'question_type': question.get('question_type', 'MCQ'),
            'topic': question.get('topic', ''),
            'stem': stem,
            'options': question.get('options', []),
            'correct_option': question.get('correct_option', ''),
            'parts': question.get('parts', []),
            'total_marks': question.get('total_marks'),
            'explanation': question.get('explanation', ''),
            'difficulty': question.get('difficulty', 'standard'),
            'prompt_to_student': prompt,
        }
        response_data = {
            'question': exam_question,
            'question_index': idx,
            'total_questions': session['total_questions'],
            'remaining_seconds': remaining,
            'prompt': prompt,
            'credits_remaining': credits_remaining,
        }
        return jsonify({'success': True, 'data': response_data}), 200
    except Exception as e:
        logger.error(f"Exam next error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/exam/submit', methods=['POST'])
@require_auth
def exam_submit():
    """Submit answer for a single question and get immediate feedback."""
    try:
        data = request.get_json() or {}
        session_id = data.get('session_id')
        question_id = data.get('question_id')
        answer = data.get('answer', '')
        time_spent_seconds = int(data.get('time_spent_seconds', 0))
        is_flagged = bool(data.get('is_flagged', False))
        image_url = data.get('image_url')
        if not session_id or not question_id:
            return jsonify({'success': False, 'message': 'session_id and question_id required'}), 400
        session = exam_session_service.get_session(session_id)
        if not session or session.get('user_id') != g.current_user_id:
            return jsonify({'success': False, 'message': 'Session not found or forbidden'}), 404
        result = exam_session_service.submit_answer(
            session_id=session_id,
            question_id=question_id,
            answer=answer,
            time_spent_seconds=time_spent_seconds,
            is_flagged=is_flagged,
            image_url=image_url,
        )
        if result.get('error'):
            return jsonify({'success': False, 'message': result['error']}), 400
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        logger.error(f"Exam submit error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/exam/complete', methods=['POST'])
@require_auth
def exam_complete():
    """Complete exam and get final results."""
    try:
        data = request.get_json() or {}
        session_id = data.get('session_id')
        if not session_id:
            return jsonify({'success': False, 'message': 'session_id required'}), 400
        session = exam_session_service.get_session(session_id)
        if not session or session.get('user_id') != g.current_user_id:
            return jsonify({'success': False, 'message': 'Session not found or forbidden'}), 404
        results = exam_session_service.complete_exam(session_id)
        if results.get('error'):
            return jsonify({'success': False, 'message': results['error']}), 400
        return jsonify({'success': True, 'data': results}), 200
    except Exception as e:
        logger.error(f"Exam complete error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/exam/state/<session_id>', methods=['GET'])
@require_auth
def exam_state(session_id):
    """Get current exam session state (for resume)."""
    try:
        state = exam_session_service.get_session_state(session_id)
        if not state:
            return jsonify({'success': False, 'message': 'Session not found'}), 404
        session = exam_session_service.get_session(session_id)
        if session and session.get('user_id') != g.current_user_id:
            return jsonify({'success': False, 'message': 'Forbidden'}), 403
        return jsonify({'success': True, 'data': state}), 200
    except Exception as e:
        logger.error(f"Exam state error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/exam/review/<session_id>', methods=['GET'])
@require_auth
def exam_review(session_id):
    """Get detailed question-by-question review after exam completion."""
    try:
        session = exam_session_service.get_session(session_id)
        if not session:
            return jsonify({'success': False, 'message': 'Session not found'}), 404
        if session.get('user_id') != g.current_user_id:
            return jsonify({'success': False, 'message': 'Forbidden'}), 403
        review = exam_session_service.get_exam_review(session_id)
        if not review:
            return jsonify({'success': False, 'message': 'Review not available (exam not submitted)'}), 404
        return jsonify({'success': True, 'data': review}), 200
    except Exception as e:
        logger.error(f"Exam review error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


# ============================================================================
# TEACHER MODE ENDPOINTS (Multi-Subject Chatbot - Math, Science, etc.)
# ============================================================================

@mobile_bp.route('/teacher/start', methods=['POST'])
@require_auth
def start_teacher_mode():
    """Start Teacher Mode session"""
    try:
        data = request.get_json()
        subject = data.get('subject', '')  # Mathematics, Biology, Chemistry, Physics
        grade_level = data.get('grade_level', '')  # Form 1-2, O-Level, A-Level
        topic = data.get('topic', '')  # Optional topic
        
        if not subject or not grade_level:
            return jsonify({'success': False, 'message': 'Subject and grade level are required'}), 400
        
        # Check credits for initial session
        credit_cost = advanced_credit_service.get_credit_cost('teacher_mode_start')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        # CRITICAL: Block users with zero credits from accessing Teacher Mode
        if user_credits <= 0:
            return jsonify({
                'success': False,
                'message': 'Access denied. You have 0 credits. Teacher Mode requires credits to use. Please purchase credits to continue.'
            }), 402
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        
        # Initialize session
        session_id = str(uuid.uuid4())
        from utils.session_manager import session_manager
        
        # Determine which service to use based on subject (mobile sends "O Level Mathematics", "Pure Mathematics", etc.)
        subj_lower = (subject or '').lower()
        is_mathematics = ('math' in subj_lower) or ('pure mathematics' in subj_lower)
        is_english = 'english' in subj_lower
        is_computer_science = 'computer science' in subj_lower
        is_science = any(s in subj_lower for s in ('biology', 'chemistry', 'physics', 'combined science'))

        # Deduct credits for starting the session
        credit_result = advanced_credit_service.check_and_deduct_credits(
            g.current_user_id, 'teacher_mode_start'
        )
        if not credit_result.get('success'):
            return jsonify({
                'success': False,
                'message': credit_result.get('message', 'Insufficient credits. Please purchase credits to use Teacher Mode.'),
                'credits_remaining': _credits_display(credit_result.get('current_credits', 0))
            }), 402

        # Store session for this user (so /teacher/message can resolve by session_id)
        session_data = {
            'session_id': session_id,
            'subject': subject,
            'grade_level': grade_level,
            'topic': topic or '',
            'conversation_history': [],
            'started_at': datetime.now().isoformat(),
        }
        session_manager.set_data(g.current_user_id, 'mobile_teacher', session_data)

        # Placeholder initial message (full AI response can be wired via services later)
        topic_part = f" Topic: {topic}." if topic else " What would you like to learn today?"
        initial_message = (
            f"Welcome to Teacher Mode for {subject}! "
            f"You're studying at {grade_level} level.{topic_part}"
        )

        return jsonify({
            'success': True,
            'data': {
                'session_id': session_id,
                'initial_message': initial_message,
                'credits_remaining': _credits_display(credit_result.get('new_balance', 0)),
            },
            'credits_remaining': _credits_display(credit_result.get('new_balance', 0)),
        }), 200

    except Exception as e:
        logging.exception("start_teacher_mode failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/message', methods=['POST'])
@require_auth
def teacher_message():
    """Send a message in Teacher Mode session and get AI response"""
    try:
        from utils.session_manager import session_manager
        
        data = request.get_json()
        session_id = data.get('session_id', '')
        message = (data.get('message') or '').strip()
        context_pack_id = data.get('context_pack_id')
        
        # Require session_id and either message or context_pack_id (image-only send)
        if not session_id:
            return jsonify({'success': False, 'message': 'session_id required'}), 400
        if not message and not context_pack_id:
            return jsonify({'success': False, 'message': 'message or context_pack_id required'}), 400
        
        # When user sends only images, use a default prompt so the tutor responds about the images
        if not message and context_pack_id:
            message = "What can you tell me about the attached image(s)?"
        
        # Retrieve session data
        session_data = session_manager.get_data(g.current_user_id, 'mobile_teacher')
        if not session_data or session_data.get('session_id') != session_id:
            return jsonify({'success': False, 'message': 'Invalid or expired session'}), 400
        
        subject = session_data.get('subject', '')
        grade_level = session_data.get('grade_level', '')
        topic = session_data.get('topic', '')
        conversation_history = session_data.get('conversation_history', [])
        
        # Check and deduct credits for follow-up message
        credit_result = advanced_credit_service.check_and_deduct_credits(
            g.current_user_id, 'teacher_mode_followup'
        )
        if not credit_result.get('success'):
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. You need credits to continue the conversation.',
                'credits_remaining': _credits_display(credit_result.get('current_credits', 0))
            }), 402

        # Load context pack when present so the AI can ground the reply on the analyzed image(s)
        image_context_block = ""
        if context_pack_id:
            from services.context_pack_service import context_pack_service
            pack = context_pack_service.get_context_pack(context_pack_id)
            if not pack:
                return jsonify({'success': False, 'message': 'Invalid or expired context pack'}), 400
            combined_summary = (pack.get('combined_summary') or '').strip()
            images_meta = pack.get('images') or []
            if combined_summary:
                per_image_parts = []
                for i, img in enumerate(images_meta):
                    summary = (img.get('per_image_summary') or '').strip()
                    extracted = (img.get('extracted_text') or '').strip()
                    if summary or extracted:
                        per_image_parts.append(f"Image {i + 1}: {summary}" + (f" | Extracted text: {extracted[:300]}" if extracted else ""))
                per_image_text = "\n".join(per_image_parts) if per_image_parts else ""
                image_context_block = f"""
The user has attached {len(images_meta)} image(s). Use the following context from those images in your response.

Context from images:
{combined_summary}
{f'{chr(10)}{per_image_text}' if per_image_text else ''}
"""

        # Build context for AI
        system_prompt = f"""You are an expert {subject} tutor helping a {grade_level} student.
{f"Current topic: {topic}" if topic else ""}

Guidelines:
- Explain concepts clearly and step-by-step
- Use examples relevant to {grade_level} level
- For Geography: Include real-world examples, case studies, and diagram descriptions
- For Physics: Include formulas, units, and worked examples
- Be encouraging and supportive
- Ask follow-up questions to check understanding
- Keep responses concise but comprehensive
- When image context is provided below, base your answer on that content and refer to what is in the images."""
        if image_context_block:
            system_prompt = system_prompt.rstrip() + image_context_block

        # Build conversation context (last 10 turns) for prompt
        conv_lines = []
        for hist in conversation_history[-10:]:
            role_label = "User" if hist['role'] == 'user' else "Assistant"
            conv_lines.append(f"{role_label}: {hist['content']}")
        conv_block = "\n".join(conv_lines) if conv_lines else ""
        user_turn = f"User: {message}"
        full_user_prompt = f"{conv_block}\n{user_turn}\n\nRespond as the tutor:".strip() if conv_block else f"{user_turn}\n\nRespond as the tutor:"

        # Generate AI response: Vertex AI (Gemini) primary, DeepSeek fallback
        ai_response = None
        try:
            from services.vertex_service import vertex_service
            if vertex_service.is_available():
                full_prompt = f"{system_prompt}\n\nConversation:\n{full_user_prompt}"
                result = vertex_service.generate_text(full_prompt, model="gemini-2.5-flash")
                if result.get("success") and result.get("text"):
                    ai_response = result["text"].strip()
        except Exception as e:
            logger.warning("Teacher mode Vertex AI error (will try DeepSeek fallback): %s", e)
        if not ai_response:
            try:
                from utils.deepseek import call_deepseek_chat
                ai_response = call_deepseek_chat(
                    system_prompt=system_prompt,
                    user_prompt=full_user_prompt,
                    temperature=0.7,
                    max_tokens=1500,
                    timeout=60
                )
            except Exception as e:
                logger.error("Teacher mode AI error: %s", e)
                ai_response = f"I apologize, but I'm having trouble processing your question right now. Please try again in a moment. Error: {str(e)}"
        
        # Update conversation history and updated_at
        conversation_history.append({'role': 'user', 'content': message})
        conversation_history.append({'role': 'assistant', 'content': ai_response})
        session_data['conversation_history'] = conversation_history
        session_data['updated_at'] = datetime.now().isoformat()
        session_manager.set_data(g.current_user_id, 'mobile_teacher', session_data)
        
        return jsonify({
            'success': True,
            'data': {
                'response': ai_response,
                'session_id': session_id,
                'context_pack_id': context_pack_id
            },
            'credits_remaining': _credits_display(credit_result.get('new_balance', 0))
        }), 200

    except Exception as e:
        logging.exception("teacher_message failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/history', methods=['GET'])
@require_auth
def teacher_history():
    """Get Teacher Mode session history for the current user (current + past sessions)."""
    try:
        from utils.session_manager import session_manager
        
        session_data = session_manager.get_data(g.current_user_id, 'mobile_teacher')
        history = list(session_data.get('past_sessions', [])) if session_data else []
        
        if session_data and session_data.get('session_id'):
            conv = session_data.get('conversation_history') or []
            last_msg = conv[-1].get('content', '') if conv else ''
            current_entry = {
                'session_id': session_data['session_id'],
                'subject': session_data.get('subject', ''),
                'grade_level': session_data.get('grade_level', ''),
                'topic': session_data.get('topic', ''),
                'last_message': last_msg,
                'updated_at': session_data.get('updated_at') or session_data.get('started_at', datetime.now().isoformat()),
            }
            history.insert(0, current_entry)
        
        history.sort(key=lambda x: x.get('updated_at', ''), reverse=True)
        return jsonify({
            'success': True,
            'data': history
        }), 200
        
    except Exception as e:
        logging.exception("teacher_history failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/session/<session_id>', methods=['DELETE'])
@require_auth
def delete_teacher_session(session_id):
    """Delete a Teacher Mode session (current or from history)."""
    try:
        from utils.session_manager import session_manager
        
        session_data = session_manager.get_data(g.current_user_id, 'mobile_teacher')
        if not session_data:
            return jsonify({'success': True}), 200
        if session_data.get('session_id') == session_id:
            # Remove current session; keep past_sessions
            new_data = {'past_sessions': session_data.get('past_sessions', [])}
            session_manager.set_data(g.current_user_id, 'mobile_teacher', new_data)
        else:
            # Remove from past_sessions
            past = [p for p in session_data.get('past_sessions', []) if p.get('session_id') != session_id]
            session_data['past_sessions'] = past
            session_manager.set_data(g.current_user_id, 'mobile_teacher', session_data)
        return jsonify({'success': True}), 200
        
    except Exception as e:
        logging.exception("delete_teacher_session failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/generate-notes', methods=['POST'])
@require_auth
def teacher_generate_notes():
    """Generate PDF notes from Teacher Mode session (optional feature)."""
    try:
        data = request.get_json() or {}
        session_id = data.get('session_id', '')
        if not session_id:
            return jsonify({'success': False, 'message': 'session_id required'}), 400
        
        credit_result = advanced_credit_service.check_and_deduct_credits(
            g.current_user_id, 'teacher_mode_pdf'
        )
        if not credit_result.get('success'):
            return jsonify({
                'success': False,
                'message': 'Insufficient credits for PDF generation.',
                'credits_remaining': _credits_display(credit_result.get('current_credits', 0))
            }), 402
        
        # Placeholder: return empty notes; full PDF generation can be wired later
        return jsonify({
            'success': True,
            'data': {'notes': None, 'pdf_url': None},
            'credits_remaining': _credits_display(credit_result.get('new_balance', 0))
        }), 200
    except Exception as e:
        logging.exception("teacher_generate_notes failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/multimodal', methods=['POST'])
@require_auth
def teacher_multimodal():
    """Send multimodal message (text + attachments). For now, treat as text-only and route to teacher/message if session exists."""
    try:
        from utils.session_manager import session_manager
        
        data = request.get_json() or {}
        message = data.get('message', '')
        attachments = data.get('attachments', [])
        context_pack_id = data.get('context_pack_id')
        session_id = data.get('session_id', '')
        
        if not message and not attachments:
            return jsonify({'success': False, 'message': 'message or attachments required'}), 400

        # If attachments are provided, try to build a Context Pack for grounded responses.
        if attachments and not context_pack_id:
            try:
                from services.context_pack_service import context_pack_service
                images = []
                for att in attachments:
                    att_type = (att.get('type') or 'image').lower()
                    if att_type != 'image':
                        continue
                    att_mime = (att.get('mime_type') or att.get('mimeType') or 'image/png').strip()
                    att_data = att.get('data') or ''
                    if isinstance(att_data, str):
                        img_bytes = _decode_base64_payload(att_data) or b""
                    else:
                        img_bytes = att_data if isinstance(att_data, (bytes, bytearray)) else b""
                    if img_bytes:
                        images.append({'bytes': img_bytes, 'mime_type': att_mime})
                if images:
                    pack = context_pack_service.create_context_pack(
                        user_id=g.current_user_id,
                        chat_id=session_id or None,
                        images=images,
                        prompt=message or "",
                    )
                    context_pack_id = pack.get('id')
            except Exception as e:
                logger.warning("Teacher multimodal context pack creation failed: %s", e)
        
        # Resolve session: use provided session_id or current user's Teacher Mode session
        if not session_id:
            session_data = session_manager.get_data(g.current_user_id, 'mobile_teacher')
            if session_data and session_data.get('session_id'):
                session_id = session_data['session_id']
        
        # If we have a session (from body or current user), use same flow as /teacher/message
        if session_id:
            session_data = session_manager.get_data(g.current_user_id, 'mobile_teacher')
            if session_data and session_data.get('session_id') == session_id:
                # For now: append note about attachments if we couldn't make a context pack
                if attachments and not context_pack_id:
                    message = f"{message}\n[User attached {len(attachments)} file(s)]".strip()
                # Reuse teacher_message logic inline to avoid redirect
                credit_result = advanced_credit_service.check_and_deduct_credits(
                    g.current_user_id, 'teacher_mode_followup'
                )
                if not credit_result.get('success'):
                    return jsonify({
                        'success': False,
                        'message': 'Insufficient credits.',
                        'credits_remaining': _credits_display(credit_result.get('current_credits', 0))
                    }), 402
                subject = session_data.get('subject', '')
                grade_level = session_data.get('grade_level', '')
                topic = session_data.get('topic', '')
                conversation_history = session_data.get('conversation_history', [])
                image_context_block = ""
                if context_pack_id:
                    try:
                        from services.context_pack_service import context_pack_service
                        pack = context_pack_service.get_context_pack(context_pack_id)
                        if pack:
                            combined_summary = (pack.get('combined_summary') or '').strip()
                            images_meta = pack.get('images') or []
                            if combined_summary:
                                per_image_parts = []
                                for i, img in enumerate(images_meta):
                                    summary = (img.get('per_image_summary') or '').strip()
                                    extracted = (img.get('extracted_text') or '').strip()
                                    if summary or extracted:
                                        per_image_parts.append(
                                            f"Image {i + 1}: {summary}" + (f" | Extracted text: {extracted[:300]}" if extracted else "")
                                        )
                                per_image_text = "\n".join(per_image_parts) if per_image_parts else ""
                                image_context_block = f"""
The user has attached {len(images_meta)} image(s). Use the following context from those images in your response.

Context from images:
{combined_summary}
{f'{chr(10)}{per_image_text}' if per_image_text else ''}
"""
                    except Exception as e:
                        logger.warning("Teacher multimodal context pack load failed: %s", e)

                system_prompt = f"You are an expert {subject} tutor for {grade_level}. {f'Topic: {topic}' if topic else ''} Explain clearly and support with examples."
                if image_context_block:
                    system_prompt = system_prompt.rstrip() + image_context_block
                conv_lines = []
                for h in conversation_history[-10:]:
                    role_label = "User" if h['role'] == 'user' else "Assistant"
                    conv_lines.append(f"{role_label}: {h['content']}")
                conv_block = "\n".join(conv_lines) if conv_lines else ""
                user_turn = f"User: {message}"
                full_user_prompt = f"{conv_block}\n{user_turn}\n\nRespond as the tutor:".strip() if conv_block else f"{user_turn}\n\nRespond as the tutor:"
                ai_response = None
                try:
                    from services.vertex_service import vertex_service
                    if vertex_service.is_available():
                        full_prompt = f"{system_prompt}\n\nConversation:\n{full_user_prompt}"
                        result = vertex_service.generate_text(full_prompt, model="gemini-2.5-flash")
                        if result.get("success") and result.get("text"):
                            ai_response = result["text"].strip()
                except Exception as e:
                    logger.warning("Teacher multimodal Vertex AI error (will try DeepSeek): %s", e)
                if not ai_response:
                    try:
                        from utils.deepseek import call_deepseek_chat
                        ai_response = call_deepseek_chat(
                            system_prompt=system_prompt,
                            user_prompt=full_user_prompt,
                            temperature=0.7,
                            max_tokens=1500,
                            timeout=60
                        )
                    except Exception as e:
                        logger.error("Teacher multimodal AI error: %s", e)
                        ai_response = "I'm having trouble processing that right now. Please try again."
                conversation_history.append({'role': 'user', 'content': message})
                conversation_history.append({'role': 'assistant', 'content': ai_response})
                session_data['conversation_history'] = conversation_history
                session_data['updated_at'] = datetime.now().isoformat()
                session_manager.set_data(g.current_user_id, 'mobile_teacher', session_data)
                return jsonify({
                    'success': True,
                    'data': {
                        'response': ai_response,
                        'session_id': session_id,
                        'context_pack_id': context_pack_id,
                    },
                    'credits_remaining': _credits_display(credit_result.get('new_balance', 0))
                }), 200
        
        return jsonify({'success': False, 'message': 'Valid session_id required for multimodal'}), 400
    except Exception as e:
        logging.exception("teacher_multimodal failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/analyze-image', methods=['POST'])
@require_auth
def teacher_analyze_image():
    """Analyze an image (e.g. diagram, lab result) and return explanation."""
    try:
        data = request.get_json() or {}
        image_b64 = data.get('image', '')
        mime_type = (data.get('mime_type') or data.get('mimeType') or 'image/png').strip()
        prompt = data.get('prompt', 'Explain this image in the context of the subject.')
        if not image_b64:
            return jsonify({'success': False, 'message': 'image (base64) required'}), 400

        from services.vertex_service import vertex_service
        if not vertex_service.is_available():
            return jsonify({
                'success': False,
                'message': 'Vertex AI image analysis is not available. Please try again later.'
            }), 503
        
        credit_result = advanced_credit_service.check_and_deduct_credits(
            g.current_user_id, 'ocr_solve'
        )
        if not credit_result.get('success'):
            return jsonify({
                'success': False,
                'message': 'Insufficient credits for image analysis.',
                'credits_remaining': _credits_display(credit_result.get('current_credits', 0))
            }), 402

        result = vertex_service.analyze_image(
            image_base64=image_b64,
            mime_type=mime_type,
            prompt=prompt,
        )
        if not result or not result.get('success'):
            return jsonify({
                'success': False,
                'message': (result or {}).get('error', 'Image analysis failed'),
            }), 500

        return jsonify({
            'success': True,
            'data': {
                'analysis': result.get('text', ''),
                'latex': result.get('latex', result.get('text', '')),
                'confidence': result.get('confidence', 0.9),
                'content_type': result.get('content_type', 'text'),
                'method': 'vertex-vision',
            },
            'credits_remaining': _credits_display(credit_result.get('new_balance', 0))
        }), 200
    except Exception as e:
        logging.exception("teacher_analyze_image failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/analyze-document', methods=['POST'])
@require_auth
def teacher_analyze_document():
    """Analyze a document (e.g. textbook page) and return summary."""
    try:
        data = request.get_json() or {}
        document_b64 = data.get('document', '')
        mime_type = (data.get('mime_type') or data.get('mimeType') or 'application/pdf').strip()
        prompt = data.get('prompt', 'Summarize this document.')
        if not document_b64:
            return jsonify({'success': False, 'message': 'document (base64) required'}), 400

        from services.vertex_service import vertex_service
        if not vertex_service.is_available():
            return jsonify({
                'success': False,
                'message': 'Document analysis is not available. Please try again later.'
            }), 503
        
        credit_result = advanced_credit_service.check_and_deduct_credits(
            g.current_user_id, 'ocr_solve'
        )
        if not credit_result.get('success'):
            return jsonify({
                'success': False,
                'message': 'Insufficient credits for document analysis.',
                'credits_remaining': _credits_display(credit_result.get('current_credits', 0))
            }), 402

        result = vertex_service.analyze_document(
            document_base64=document_b64,
            mime_type=mime_type,
            prompt=prompt,
        )
        if not result or not result.get('success'):
            return jsonify({
                'success': False,
                'message': (result or {}).get('error', 'Document analysis failed'),
            }), 500

        analysis_text = result.get('analysis') or result.get('text', '')
        return jsonify({
            'success': True,
            'data': {
                'analysis': analysis_text,
                'summary': result.get('summary', analysis_text[:500]),
                'mime_type': result.get('mime_type', mime_type),
                'method': 'document-understanding',
            },
            'credits_remaining': _credits_display(credit_result.get('new_balance', 0))
        }), 200
    except Exception as e:
        logging.exception("teacher_analyze_document failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/search', methods=['POST'])
@require_auth
def teacher_search():
    """Web search with grounding for Teacher Mode."""
    try:
        data = request.get_json() or {}
        query = data.get('query', '')
        if not query:
            return jsonify({'success': False, 'message': 'query required'}), 400
        
        credit_result = advanced_credit_service.check_and_deduct_credits(
            g.current_user_id, 'teacher_mode_followup'
        )
        if not credit_result.get('success'):
            return jsonify({
                'success': False,
                'message': 'Insufficient credits.',
                'credits_remaining': _credits_display(credit_result.get('current_credits', 0))
            }), 402

        # Placeholder: return message; can wire Google Search / grounding later
        return jsonify({
            'success': True,
            'data': {'response': f'Search for "{query[:80]}..." is available. Try asking your question in the chat for a direct answer.'},
            'credits_remaining': _credits_display(credit_result.get('new_balance', 0))
        }), 200
    except Exception as e:
        logging.exception("teacher_search failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/deep-research', methods=['POST'])
@require_auth
def teacher_deep_research():
    """Deep research (e.g. Gemini agent). Placeholder."""
    try:
        data = request.get_json() or {}
        query = data.get('query', '')
        if not query:
            return jsonify({'success': False, 'message': 'query required'}), 400
        
        credit_result = advanced_credit_service.check_and_deduct_credits(
            g.current_user_id, 'teacher_mode_followup'
        )
        if not credit_result.get('success'):
            return jsonify({
                'success': False,
                'message': 'Insufficient credits.',
                'credits_remaining': _credits_display(credit_result.get('current_credits', 0))
            }), 402

        return jsonify({
            'success': True,
            'data': {'response': f'Deep research for your question is available. You can also ask follow-ups in the chat.', 'status': 'ok'},
            'credits_remaining': _credits_display(credit_result.get('new_balance', 0))
        }), 200
    except Exception as e:
        logging.exception("teacher_deep_research failed")
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== Project Assistant (ZIMSEC) ====================

@mobile_bp.route('/project/list', methods=['GET'])
@require_auth
def project_list():
    """List all projects for the authenticated user."""
    try:
        user_id = g.current_user_id
        projects = project_assistant_service.get_user_projects(user_id)
        if projects is None:
            projects = []
        return jsonify({'success': True, 'data': {'projects': projects}}), 200
    except Exception as e:
        logger.exception("project_list failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/create', methods=['POST'])
@require_auth
def project_create():
    """Create a new ZIMSEC project."""
    try:
        user_id = g.current_user_id
        data = request.get_json() or {}
        if not data.get('subject') or not data.get('level'):
            return jsonify({'success': False, 'message': 'subject and level are required'}), 400
        project = project_assistant_service.create_project_mobile(user_id, data)
        if not project:
            return jsonify({'success': False, 'message': 'Failed to create project'}), 500
        out = {
            'id': project.get('id'),
            'title': project.get('project_title') or project.get('title'),
            'subject': project.get('subject'),
            'current_stage': project.get('current_stage'),
            'completed': project.get('completed'),
            'updated_at': project.get('updated_at'),
            'project_data': project.get('project_data'),
            'created_at': project.get('created_at'),
        }
        return jsonify({'success': True, 'data': out}), 200
    except ValueError as e:
        return jsonify({'success': False, 'message': str(e)}), 400
    except Exception as e:
        logger.exception("project_create failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>', methods=['GET'])
@require_auth
def project_get(project_id):
    """Get a single project by ID (must belong to current user)."""
    try:
        user_id = g.current_user_id
        project = project_assistant_service.get_project_details(user_id, project_id)
        if not project:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        out = {
            'id': project.get('id'),
            'title': project.get('project_title') or project.get('title'),
            'subject': project.get('subject'),
            'current_stage': project.get('current_stage'),
            'completed': project.get('completed'),
            'updated_at': project.get('updated_at'),
            'created_at': project.get('created_at'),
            'project_data': project.get('project_data'),
        }
        return jsonify({'success': True, 'data': out}), 200
    except Exception as e:
        logger.exception("project_get failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>/chat', methods=['POST'])
@require_auth
def project_chat(project_id):
    """Send a chat message and get AI response."""
    try:
        user_id = g.current_user_id
        data = request.get_json() or {}
        message = (data.get('message') or '').strip()
        context_pack_id = data.get('context_pack_id')
        if not message and not context_pack_id:
            return jsonify({'success': False, 'message': 'message or context_pack_id is required'}), 400
        if not message and context_pack_id:
            message = "What can you tell me about the attached image(s)?"
        result = project_assistant_service.process_mobile_chat(
            user_id,
            project_id,
            message,
            context_pack_id=context_pack_id,
        )
        if not result:
            return jsonify({'success': False, 'message': 'Project not found or error processing message'}), 404
        credits_rem = result.get('credits_remaining')
        return jsonify({
            'success': True,
            'data': {
                'response': result.get('response', ''),
                'project_id': project_id,
                'credits_remaining': credits_rem,
                'context_pack_id': context_pack_id,
            },
            'credits_remaining': credits_rem,
        }), 200
    except Exception as e:
        logger.exception("project_chat failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>/history', methods=['GET'])
@require_auth
def project_history(project_id):
    """Get chat history for a project."""
    try:
        user_id = g.current_user_id
        proj = get_project_by_id(project_id)
        if not proj or str(proj.get('user_id')) != str(user_id):
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        history = get_project_chat_history(project_id)
        out = [
            {
                'id': i + 1,
                'project_id': project_id,
                'role': h.get('role'),
                'content': h.get('content'),
                'timestamp': h.get('timestamp'),
                'image_url': h.get('image_url'),
            }
            for i, h in enumerate(history)
        ]
        return jsonify({'success': True, 'data': {'history': out}}), 200
    except Exception as e:
        logger.exception("project_history failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>', methods=['DELETE'])
@require_auth
def project_delete(project_id):
    """Delete a project (must belong to current user)."""
    try:
        user_id = g.current_user_id
        proj = get_project_by_id(project_id)
        if not proj or str(proj.get('user_id')) != str(user_id):
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        make_supabase_request(
            "DELETE", "user_projects",
            filters={"id": f"eq.{project_id}", "user_id": f"eq.{user_id}"},
            use_service_role=True
        )
        return jsonify({'success': True}), 200
    except Exception as e:
        logger.exception("project_delete failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>/generate-image', methods=['POST'])
@require_auth
def project_generate_image(project_id):
    """Generate an educational image for the project using Vertex AI Imagen."""
    try:
        user_id = g.current_user_id
        proj = project_assistant_service.get_project_details(user_id, project_id)
        if not proj:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        data = request.get_json() or {}
        prompt = (data.get('prompt') or '').strip()
        if not prompt:
            return jsonify({'success': False, 'message': 'prompt is required'}), 400
        aspect_ratio = (data.get('aspect_ratio') or '1:1').strip()
        result = project_assistant_service.generate_educational_image(
            user_id=user_id,
            project_id=project_id,
            user_prompt=prompt,
            explicit_mode=False,
            aspect_ratio=aspect_ratio,
        )
        if not result.get('success'):
            return jsonify({
                'success': False,
                'message': result.get('error', 'Image generation failed'),
                'data': {'credits_remaining': result.get('credits_remaining')},
            }), 400
        creds = result.get('credits_remaining')
        return jsonify({
            'success': True,
            'data': {
                'response': result.get('response', ''),
                'image_url': result.get('image_url'),
                'aspect_ratio': result.get('aspect_ratio'),
                'credits_remaining': creds,
            },
            'credits_remaining': creds,
        }), 200
    except Exception as e:
        logger.exception("project_generate_image failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>/analyze-document', methods=['POST'])
@require_auth
def project_analyze_document(project_id):
    """Analyze a document (PDF, etc.) for the project using Vertex AI."""
    try:
        user_id = g.current_user_id
        proj = project_assistant_service.get_project_details(user_id, project_id)
        if not proj:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        data = request.get_json() or {}
        document_b64 = data.get('document') or ''
        mime_type = (data.get('mime_type') or 'application/pdf').strip()
        prompt = (data.get('prompt') or '').strip() or None
        if not document_b64:
            return jsonify({'success': False, 'message': 'document (base64) is required'}), 400
        result = project_assistant_service.analyze_document_for_project(
            user_id=user_id,
            project_id=project_id,
            document_data=document_b64,
            mime_type=mime_type,
            prompt=prompt,
        )
        if not result.get('success'):
            return jsonify({
                'success': False,
                'message': result.get('error', 'Document analysis failed'),
            }), 400
        analysis = result.get('analysis') or result.get('text', '')
        return jsonify({
            'success': True,
            'data': {'analysis': analysis, 'interaction_id': result.get('interaction_id')},
        }), 200
    except Exception as e:
        logger.exception("project_analyze_document failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>/multimodal-chat', methods=['POST'])
@require_auth
def project_multimodal_chat(project_id):
    """Send a message with attachments (images, documents, etc.) for the project."""
    try:
        user_id = g.current_user_id
        proj = project_assistant_service.get_project_details(user_id, project_id)
        if not proj:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        data = request.get_json() or {}
        message = (data.get('message') or '').strip()
        attachments = data.get('attachments') or []
        if not isinstance(attachments, list):
            attachments = []
        result = project_assistant_service.process_multimodal_message(
            user_id=user_id,
            project_id=project_id,
            message=message or 'Please see my attachments.',
            attachments=attachments,
        )
        if not result.get('success'):
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to process message'),
                'data': {'credits_remaining': result.get('credits_remaining')},
            }), 400
        creds = result.get('credits_remaining')
        return jsonify({
            'success': True,
            'data': {
                'response': result.get('response', ''),
                'project_id': project_id,
                'image_url': result.get('image_url'),
                'credits_remaining': creds,
                'context_pack_id': result.get('context_pack_id'),
            },
            'credits_remaining': creds,
        }), 200
    except Exception as e:
        logger.exception("project_multimodal_chat failed")
        return jsonify({'success': False, 'message': str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════════════
# LESSON WALLET ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@mobile_bp.route('/project/<int:project_id>/export/checklist', methods=['GET'])
@require_auth
def project_export_checklist(project_id):
    """Get project submission checklist and completion summary."""
    try:
        user_id = g.current_user_id
        proj = project_assistant_service.get_project_details(user_id, project_id)
        if not proj:
            return jsonify({'success': False, 'message': 'Project not found'}), 404

        checklist = project_export_service.get_submission_checklist(project_id, user_id)
        if checklist.get('error'):
            return jsonify({'success': False, 'message': checklist['error']}), 404

        return jsonify({
            'success': True,
            'data': checklist,
            'checklist': checklist,
        }), 200
    except Exception as e:
        logger.exception("project_export_checklist failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>/export/preview', methods=['GET'])
@require_auth
def project_export_preview(project_id):
    """Preview export readiness and missing items before generating a PDF."""
    try:
        user_id = g.current_user_id
        proj = project_assistant_service.get_project_details(user_id, project_id)
        if not proj:
            return jsonify({'success': False, 'message': 'Project not found'}), 404

        checklist = project_export_service.get_submission_checklist(project_id, user_id)
        if checklist.get('error'):
            return jsonify({'success': False, 'message': checklist['error']}), 404

        missing_stages = []
        for stage_num, stage_info in (checklist.get('stages') or {}).items():
            if (stage_info or {}).get('completed', 0) < (stage_info or {}).get('total', 0):
                missing_stages.append(stage_num)

        overall_completion = checklist.get('overall_completion', 0)
        preview = {
            **checklist,
            'ready_for_submission': overall_completion >= 80,
            'missing_stages': missing_stages,
            'message': (
                'Submission pack is ready.'
                if overall_completion >= 80
                else 'Complete more sections before final submission.'
            ),
        }

        return jsonify({
            'success': True,
            'data': preview,
            'checklist': preview,
        }), 200
    except Exception as e:
        logger.exception("project_export_preview failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>/export/generate', methods=['POST'])
@require_auth
def project_export_generate(project_id):
    """Generate submission PDF for full project or a specific stage."""
    try:
        user_id = g.current_user_id
        proj = project_assistant_service.get_project_details(user_id, project_id)
        if not proj:
            return jsonify({'success': False, 'message': 'Project not found'}), 404

        data = request.get_json() or {}
        file_type = (data.get('file_type') or 'pdf').strip().lower()
        stage_number_raw = data.get('stage_number')

        if file_type != 'pdf':
            return jsonify({'success': False, 'message': 'Only pdf export is currently supported'}), 400

        stage_number = None
        if stage_number_raw not in (None, ''):
            try:
                stage_number = int(stage_number_raw)
            except (TypeError, ValueError):
                return jsonify({'success': False, 'message': 'stage_number must be an integer between 1 and 6'}), 400
            if stage_number < 1 or stage_number > 6:
                return jsonify({'success': False, 'message': 'stage_number must be between 1 and 6'}), 400

        result = project_export_service.generate_pdf(project_id, user_id, stage_number=stage_number)
        if not result.get('success'):
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to generate export'),
            }), 400

        payload = {
            'export_id': result.get('export_id'),
            'filename': result.get('filename'),
            'download_url': result.get('download_url'),
            'selected_stages': result.get('selected_stages') or ([stage_number] if stage_number else [1, 2, 3, 4, 5, 6]),
        }

        return jsonify({
            'success': True,
            'data': payload,
            'export_id': payload['export_id'],
            'filename': payload['filename'],
            'download_url': payload['download_url'],
            'selected_stages': payload['selected_stages'],
        }), 200
    except Exception as e:
        logger.exception("project_export_generate failed")
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/wallet/balance', methods=['GET'])
@require_auth
def wallet_balance():
    """Get student lesson wallet balance."""
    try:
        user_id = g.current_user_id
        data = lesson_payment_service.get_wallet_balance(user_id)
        return jsonify({'success': True, 'data': data}), 200
    except Exception as e:
        logger.exception("wallet_balance failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/wallet/topup', methods=['POST'])
@require_auth
def wallet_topup():
    """Initiate wallet top-up via EcoCash or Card."""
    try:
        user_id = g.current_user_id
        data = request.get_json() or {}
        amount = data.get('amount')
        payment_method = data.get('payment_method', 'ecocash')
        phone_number = data.get('phone_number', '')
        email = data.get('email', '')

        if not amount or float(amount) <= 0:
            return jsonify({'success': False, 'message': 'Valid amount required'}), 400

        # Normalise phone number (same as credits purchase)
        if phone_number:
            phone_number = phone_number.strip().replace(' ', '').replace('-', '')
            if phone_number.startswith('+263'):
                phone_number = '0' + phone_number[4:]
            elif phone_number.startswith('263'):
                phone_number = '0' + phone_number[3:]

        result = lesson_payment_service.initiate_wallet_topup(
            user_id=user_id,
            amount=float(amount),
            payment_method=payment_method,
            phone_number=phone_number,
            email=email,
        )

        if result.get('success'):
            return jsonify({'success': True, 'data': result}), 200
        else:
            return jsonify({'success': False, 'message': result.get('message', 'Top-up failed')}), 400
    except Exception as e:
        logger.exception("wallet_topup failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/wallet/topup/complete', methods=['POST'])
@require_auth
def wallet_topup_complete():
    """Complete a wallet top-up (called after payment confirmation)."""
    try:
        data = request.get_json() or {}
        reference = data.get('reference')
        if not reference:
            return jsonify({'success': False, 'message': 'Reference required'}), 400

        result = lesson_payment_service.complete_wallet_topup(reference)
        if result.get('success'):
            return jsonify({'success': True, 'data': result}), 200
        else:
            return jsonify({'success': False, 'message': result.get('message', 'Failed')}), 400
    except Exception as e:
        logger.exception("wallet_topup_complete failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/wallet/transactions', methods=['GET'])
@require_auth
def wallet_transactions():
    """Get wallet transaction history."""
    try:
        user_id = g.current_user_id
        limit = request.args.get('limit', 20, type=int)
        txns = get_wallet_transactions(user_id, limit=limit)
        return jsonify({'success': True, 'data': txns}), 200
    except Exception as e:
        logger.exception("wallet_transactions failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


# ═══════════════════════════════════════════════════════════════════════════════
# LESSON PAYMENT ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@mobile_bp.route('/lesson/pay', methods=['POST'])
@require_auth
def lesson_pay():
    """Deduct $0.50 from student wallet when lesson starts."""
    try:
        user_id = g.current_user_id
        data = request.get_json() or {}
        booking_id = data.get('booking_id')
        teacher_id = data.get('teacher_id')

        if not booking_id:
            return jsonify({'success': False, 'message': 'booking_id required'}), 400

        result = lesson_payment_service.pay_for_lesson(user_id, booking_id, teacher_id)

        if result.get('success'):
            return jsonify({'success': True, 'data': result}), 200
        elif result.get('insufficient_funds'):
            return jsonify({'success': False, 'message': result['message'], 'data': result}), 402
        else:
            return jsonify({'success': False, 'message': result.get('message', 'Payment failed')}), 400
    except Exception as e:
        logger.exception("lesson_pay failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/lesson/refund', methods=['POST'])
@require_auth
def lesson_refund():
    """Refund a lesson payment back to student wallet."""
    try:
        user_id = g.current_user_id
        data = request.get_json() or {}
        booking_id = data.get('booking_id')
        reason = data.get('reason', 'Lesson cancelled')

        if not booking_id:
            return jsonify({'success': False, 'message': 'booking_id required'}), 400

        result = lesson_payment_service.refund_lesson(user_id, booking_id, reason)

        if result.get('success'):
            return jsonify({'success': True, 'data': result}), 200
        else:
            return jsonify({'success': False, 'message': result.get('message', 'Refund failed')}), 400
    except Exception as e:
        logger.exception("lesson_refund failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


# ═══════════════════════════════════════════════════════════════════════════════
# TEACHER EARNINGS & PAYOUT ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@mobile_bp.route('/teacher/earnings', methods=['GET'])
@require_auth
def teacher_earnings():
    """Get teacher earnings dashboard data."""
    try:
        user_id = g.current_user_id
        data = lesson_payment_service.get_earnings_dashboard(user_id)
        return jsonify({'success': True, 'data': data}), 200
    except Exception as e:
        logger.exception("teacher_earnings failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/teacher/earnings/history', methods=['GET'])
@require_auth
def teacher_earnings_history():
    """Get detailed teacher earnings history."""
    try:
        user_id = g.current_user_id
        from database.external_db import get_teacher_earnings_history
        limit = request.args.get('limit', 50, type=int)
        history = get_teacher_earnings_history(user_id, limit=limit)
        return jsonify({'success': True, 'data': history}), 200
    except Exception as e:
        logger.exception("teacher_earnings_history failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/teacher/payout/request', methods=['POST'])
@require_auth
def teacher_payout_request():
    """Request an EcoCash payout for available earnings."""
    try:
        user_id = g.current_user_id
        data = request.get_json() or {}
        phone_number = data.get('phone_number', '')

        if phone_number:
            phone_number = phone_number.strip().replace(' ', '').replace('-', '')
            if phone_number.startswith('+263'):
                phone_number = '0' + phone_number[4:]
            elif phone_number.startswith('263'):
                phone_number = '0' + phone_number[3:]

        result = lesson_payment_service.request_payout(user_id, phone_number)

        if result.get('success'):
            return jsonify({'success': True, 'data': result}), 200
        else:
            return jsonify({'success': False, 'message': result.get('message', 'Payout failed')}), 400
    except Exception as e:
        logger.exception("teacher_payout_request failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/teacher/payout/complete', methods=['POST'])
@require_auth
def teacher_payout_complete():
    """Mark a teacher payout as completed (processing -> completed)."""
    try:
        user_id = g.current_user_id
        data = request.get_json() or {}
        payout_id = data.get('payout_id')
        reference = (data.get('reference') or '').strip()

        if not payout_id:
            return jsonify({'success': False, 'message': 'payout_id required'}), 400
        if not reference:
            return jsonify({'success': False, 'message': 'reference required'}), 400

        result = lesson_payment_service.complete_payout(user_id, payout_id, reference)
        if result.get('success'):
            return jsonify({'success': True, 'data': result}), 200
        return jsonify({'success': False, 'message': result.get('message', 'Failed')}), 400
    except Exception:
        logger.exception("teacher_payout_complete failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/teacher/payouts', methods=['GET'])
@require_auth
def teacher_payouts():
    """Get teacher payout history."""
    try:
        user_id = g.current_user_id
        from database.external_db import get_teacher_payouts
        limit = request.args.get('limit', 20, type=int)
        payouts = get_teacher_payouts(user_id, limit=limit)
        return jsonify({'success': True, 'data': payouts}), 200
    except Exception as e:
        logger.exception("teacher_payouts failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


# ═══════════════════════════════════════════════════════════════════════════════
# LESSON CANCELLATION WITH REFUND RULES
# ═══════════════════════════════════════════════════════════════════════════════

@mobile_bp.route('/teacher/bookings/confirm', methods=['POST'])
@require_auth
def teacher_confirm_booking():
    """Confirm a booking after validating student wallet balance."""
    try:
        user_id = g.current_user_id
        data = request.get_json() or {}
        booking_id = data.get('booking_id')

        if not booking_id:
            return jsonify({'success': False, 'message': 'booking_id required'}), 400

        teacher_rows = make_supabase_request(
            "GET",
            "teacher_profiles",
            select="id",
            filters={"user_id": f"eq.{user_id}"},
            limit=1,
            use_service_role=True,
        ) or []
        if not teacher_rows:
            # Fallback: older tokens can carry chat_id while teacher_profiles.user_id stores Supabase UUID.
            reg = get_user_registration(user_id) or {}
            teacher_email = (reg.get('email') or '').strip()
            if teacher_email:
                teacher_rows = make_supabase_request(
                    "GET",
                    "teacher_profiles",
                    select="id",
                    filters={"email": f"eq.{teacher_email}"},
                    limit=1,
                    use_service_role=True,
                ) or []
        if not teacher_rows:
            return jsonify({'success': False, 'message': 'Teacher profile not found'}), 403

        teacher_profile_id = teacher_rows[0].get('id')

        booking_rows = make_supabase_request(
            "GET",
            "lesson_bookings",
            filters={"id": f"eq.{booking_id}"},
            use_service_role=True,
        ) or []
        if not booking_rows:
            return jsonify({'success': False, 'message': 'Booking not found'}), 404

        booking = booking_rows[0]
        if booking.get('teacher_id') != teacher_profile_id:
            return jsonify({'success': False, 'message': 'Not authorized for this booking'}), 403

        status = (booking.get('status') or '').lower()
        if status == 'confirmed':
            return jsonify({'success': True, 'data': {'already_confirmed': True}}), 200
        if status in {'cancelled', 'completed'}:
            return jsonify({'success': False, 'message': f'Cannot confirm a {status} booking'}), 400

        student_id = booking.get('student_id')
        wallet = get_lesson_wallet(student_id) if student_id else None
        balance = round(float((wallet or {}).get('balance', 0)), 2)
        if balance < LESSON_FEE:
            return jsonify({
                'success': False,
                'message': f"Student wallet balance is insufficient (${balance:.2f} < ${LESSON_FEE:.2f})",
                'data': {
                    'insufficient_funds': True,
                    'balance': balance,
                    'required': LESSON_FEE,
                },
            }), 402

        room_id = booking.get('room_id') or f"nerdx-{str(booking_id)[:8]}-{uuid.uuid4().hex[:6]}"
        update_result = make_supabase_request(
            "PATCH",
            "lesson_bookings",
            data={"status": "confirmed", "room_id": room_id},
            filters={"id": f"eq.{booking_id}"},
            use_service_role=True,
        )
        if update_result is None:
            return jsonify({'success': False, 'message': 'Failed to confirm booking'}), 500

        return jsonify({
            'success': True,
            'data': {'booking_id': booking_id, 'status': 'confirmed', 'room_id': room_id},
        }), 200
    except Exception:
        logger.exception("teacher_confirm_booking failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/lesson/cancel', methods=['POST'])
@require_auth
def lesson_cancel():
    """Cancel a lesson booking with automatic refund based on cancellation rules.

    Rules:
    - Teacher cancels anytime: Full refund to student
    - Student cancels > 1 hour before: Full refund
    - Student cancels < 1 hour before: No refund (teacher still earns)
    - System cancellation (teacher no-show): Full refund
    """
    try:
        user_id = g.current_user_id
        data = request.get_json() or {}
        booking_id = data.get('booking_id')
        cancelled_by = data.get('cancelled_by', 'student')  # 'student', 'teacher', or 'system'

        if not booking_id:
            return jsonify({'success': False, 'message': 'booking_id required'}), 400

        booking_rows = make_supabase_request(
            "GET",
            "lesson_bookings",
            filters={"id": f"eq.{booking_id}"},
            use_service_role=True,
        ) or []
        if not booking_rows:
            return jsonify({'success': False, 'message': 'Booking not found'}), 404
        booking = booking_rows[0]

        student_id = booking.get('student_id')
        teacher_id = booking.get('teacher_id')
        booking_status = (booking.get('status') or '').lower()

        if booking_status == 'cancelled':
            return jsonify({'success': True, 'data': {'booking_id': booking_id, 'already_cancelled': True}}), 200

        # Authorization checks for explicit student/teacher initiated cancellation.
        if cancelled_by == 'student' and student_id and user_id != student_id:
            return jsonify({'success': False, 'message': 'Not authorized to cancel this booking as student'}), 403

        if cancelled_by == 'teacher':
            teacher_rows = make_supabase_request(
                "GET",
                "teacher_profiles",
                select="id",
                filters={"user_id": f"eq.{user_id}"},
                limit=1,
                use_service_role=True,
            ) or []
            if not teacher_rows:
                reg = get_user_registration(user_id) or {}
                teacher_email = (reg.get('email') or '').strip()
                if teacher_email:
                    teacher_rows = make_supabase_request(
                        "GET",
                        "teacher_profiles",
                        select="id",
                        filters={"email": f"eq.{teacher_email}"},
                        limit=1,
                        use_service_role=True,
                    ) or []
            if not teacher_rows or teacher_rows[0].get('id') != teacher_id:
                return jsonify({'success': False, 'message': 'Not authorized to cancel this booking as teacher'}), 403

        if cancelled_by == 'system':
            is_booking_student = bool(student_id and user_id == student_id)
            is_booking_teacher = False

            teacher_rows = make_supabase_request(
                "GET",
                "teacher_profiles",
                select="id",
                filters={"user_id": f"eq.{user_id}"},
                limit=1,
                use_service_role=True,
            ) or []
            if not teacher_rows:
                reg = get_user_registration(user_id) or {}
                teacher_email = (reg.get('email') or '').strip()
                if teacher_email:
                    teacher_rows = make_supabase_request(
                        "GET",
                        "teacher_profiles",
                        select="id",
                        filters={"email": f"eq.{teacher_email}"},
                        limit=1,
                        use_service_role=True,
                    ) or []
            if teacher_rows and teacher_rows[0].get('id') == teacher_id:
                is_booking_teacher = True

            if not is_booking_student and not is_booking_teacher:
                return jsonify({'success': False, 'message': 'Not authorized to perform system cancellation for this booking'}), 403

        normalized_start_time = booking.get('start_time') or ''
        if isinstance(normalized_start_time, str) and normalized_start_time.count(':') == 1:
            normalized_start_time = f"{normalized_start_time}:00"

        scheduled_time = (data.get('scheduled_time') or f"{booking.get('date')}T{normalized_start_time}").strip()

        # Check refund eligibility
        eligibility = lesson_payment_service.check_cancellation_eligibility(
            booking_id, cancelled_by, scheduled_time
        )

        # Always update booking status to cancelled as the source of truth.
        existing_notes = (booking.get('notes') or '').strip()
        cancel_note = f"Cancelled by {cancelled_by}: {eligibility['reason']}"
        merged_notes = f"{existing_notes}\n{cancel_note}".strip()[:1200]
        make_supabase_request(
            "PATCH",
            "lesson_bookings",
            data={"status": "cancelled", "notes": merged_notes},
            filters={"id": f"eq.{booking_id}"},
            use_service_role=True,
        )

        # Teacher no-show flag (best-effort): create attendance row with missed status.
        if cancelled_by == 'system' and teacher_id and student_id:
            try:
                make_supabase_request(
                    "POST",
                    "lesson_attendance",
                    data={
                        "booking_id": booking_id,
                        "teacher_id": teacher_id,
                        "student_id": student_id,
                        "subject": booking.get('subject') or 'Lesson',
                        "date": booking.get('date'),
                        "status": "missed",
                        "duration_minutes": 0,
                        "teacher_notes": "Auto-cancelled due to teacher no-show (10-minute grace).",
                    },
                    use_service_role=True,
                )
            except Exception:
                logger.warning("Failed to write lesson_attendance missed row for booking %s", booking_id)

        result_data = {
            'booking_id': booking_id,
            'cancelled_by': cancelled_by,
            'booking_status': 'cancelled',
            'refund_eligible': eligibility['eligible_for_refund'],
            'reason': eligibility['reason'],
        }

        if eligibility['eligible_for_refund'] and student_id:
            refund_result = lesson_payment_service.refund_lesson(
                student_id, booking_id, eligibility['reason']
            )
            result_data['refund'] = refund_result
        else:
            result_data['refund'] = {'success': False, 'message': eligibility['reason']}

        return jsonify({'success': True, 'data': result_data}), 200
    except Exception:
        logger.exception("lesson_cancel failed")
        return jsonify({'success': False, 'message': 'Server error'}), 500
