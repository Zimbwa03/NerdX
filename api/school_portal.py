"""
School Portal API for NerdX
Provides authentication, student monitoring, financial management, and payment processing
for partner schools accessing their dedicated dashboard.
"""
import logging
import time
import uuid
import base64
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import Blueprint, request, jsonify
from database.external_db import make_supabase_request

logger = logging.getLogger(__name__)

school_portal_bp = Blueprint('school_portal', __name__)

REVENUE_PER_STUDENT = 10.0
SCHOOL_SHARE_PERCENT = 0.30
NERDX_SHARE_PERCENT = 0.70


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
        else:
            dt = dt.astimezone(timezone.utc)
        return dt
    except Exception:
        return None


def _generate_token():
    return uuid.uuid4().hex + uuid.uuid4().hex


def _get_school_from_token(token):
    """Validate session token and return school row."""
    if not token:
        return None
    sessions = make_supabase_request(
        "GET", "school_sessions",
        select="school_id,expires_at",
        filters={"token": f"eq.{token}"},
        use_service_role=True
    )
    if not sessions:
        return None
    session = sessions[0]
    exp = _parse_utc(session.get("expires_at"))
    if not exp or exp < _now_utc():
        return None
    schools = make_supabase_request(
        "GET", "schools", select="*",
        filters={"school_id": f"eq.{session['school_id']}"},
        use_service_role=True
    )
    return schools[0] if schools else None


def school_auth_required(f):
    """Decorator requiring valid school portal session."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        token = auth.replace("Bearer ", "") if auth.startswith("Bearer ") else None
        school = _get_school_from_token(token)
        if not school:
            return jsonify({"error": "Unauthorized"}), 401
        request.school = school
        return f(*args, **kwargs)
    return wrapper


# ─── AUTH ───────────────────────────────────────────────────────────────────────

@school_portal_bp.route("/login", methods=["POST"])
def school_login():
    """Authenticate school using name + school_id."""
    body = request.get_json(silent=True) or {}
    school_name = (body.get("school_name") or "").strip()
    school_id = (body.get("school_id") or "").strip().upper()

    if not school_name or not school_id:
        return jsonify({"error": "School name and School ID are required"}), 400

    schools = make_supabase_request(
        "GET", "schools", select="*",
        filters={"school_id": f"eq.{school_id}"},
        use_service_role=True
    )
    if not schools:
        return jsonify({"error": "Invalid credentials"}), 401

    school = schools[0]
    db_name = (school.get("name") or "").strip().lower()
    if db_name != school_name.lower():
        return jsonify({"error": "Invalid credentials"}), 401

    token = _generate_token()
    expires = _now_utc() + timedelta(days=7)
    make_supabase_request("POST", "school_sessions", {
        "school_id": school_id,
        "token": token,
        "expires_at": expires.isoformat(),
    }, use_service_role=True)

    return jsonify({
        "token": token,
        "school": {
            "id": school.get("id"),
            "school_id": school.get("school_id"),
            "name": school.get("name"),
            "slug": school.get("slug"),
            "logo_url": school.get("logo_url"),
            "subscription_expires_at": school.get("subscription_expires_at"),
            "email": school.get("email"),
            "phone": school.get("phone"),
            "contact_person": school.get("contact_person"),
        }
    })


@school_portal_bp.route("/login-by-slug", methods=["POST"])
def school_login_by_slug():
    """Authenticate school using slug + school_id (for URL-based login)."""
    body = request.get_json(silent=True) or {}
    slug = (body.get("slug") or "").strip().lower()
    school_id = (body.get("school_id") or "").strip().upper()

    if not slug or not school_id:
        return jsonify({"error": "Slug and School ID are required"}), 400

    schools = make_supabase_request(
        "GET", "schools", select="*",
        filters={"slug": f"eq.{slug}", "school_id": f"eq.{school_id}"},
        use_service_role=True
    )
    if not schools:
        return jsonify({"error": "Invalid credentials"}), 401

    school = schools[0]
    token = _generate_token()
    expires = _now_utc() + timedelta(days=7)
    make_supabase_request("POST", "school_sessions", {
        "school_id": school["school_id"],
        "token": token,
        "expires_at": expires.isoformat(),
    }, use_service_role=True)

    return jsonify({
        "token": token,
        "school": {
            "id": school.get("id"),
            "school_id": school.get("school_id"),
            "name": school.get("name"),
            "slug": school.get("slug"),
            "logo_url": school.get("logo_url"),
            "subscription_expires_at": school.get("subscription_expires_at"),
            "email": school.get("email"),
            "phone": school.get("phone"),
            "contact_person": school.get("contact_person"),
        }
    })


@school_portal_bp.route("/me", methods=["GET"])
@school_auth_required
def school_me():
    """Return authenticated school profile."""
    s = request.school
    return jsonify({
        "id": s.get("id"),
        "school_id": s.get("school_id"),
        "name": s.get("name"),
        "slug": s.get("slug"),
        "logo_url": s.get("logo_url"),
        "email": s.get("email"),
        "phone": s.get("phone"),
        "contact_person": s.get("contact_person"),
        "subscription_type": s.get("subscription_type"),
        "subscription_expires_at": s.get("subscription_expires_at"),
        "subscription_started_at": s.get("subscription_started_at"),
    })


@school_portal_bp.route("/school-by-slug/<slug>", methods=["GET"])
def school_by_slug(slug):
    """Public: get basic school info by slug (for login page display)."""
    slug_lower = slug.lower().strip()
    logger.info(f"Looking up school by slug: {slug_lower}")

    # Retry up to 3 times for transient SSL errors
    schools = None
    for attempt in range(3):
        try:
            schools = make_supabase_request(
                "GET", "schools", select="name,slug,logo_url",
                filters={"slug": f"eq.{slug_lower}"},
                use_service_role=True
            )
            if schools is not None:
                break
        except Exception as e:
            logger.warning(f"school-by-slug attempt {attempt+1} failed: {e}")
            time.sleep(1)

    logger.info(f"school-by-slug result: {schools}")
    if not schools:
        return jsonify({"error": "School not found"}), 404
    return jsonify(schools[0])


@school_portal_bp.route("/logout", methods=["POST"])
@school_auth_required
def school_logout():
    """Invalidate current session."""
    auth = request.headers.get("Authorization", "")
    token = auth.replace("Bearer ", "")
    make_supabase_request(
        "DELETE", "school_sessions",
        filters={"token": f"eq.{token}"},
        use_service_role=True
    )
    return jsonify({"ok": True})


# ─── OVERVIEW ───────────────────────────────────────────────────────────────────

@school_portal_bp.route("/overview", methods=["GET"])
@school_auth_required
def school_overview():
    """Dashboard overview: aggregate stats, revenue summary."""
    try:
        return _school_overview_impl()
    except Exception as e:
        logger.error(f"Overview error: {e}", exc_info=True)
        return jsonify({"error": f"Overview failed: {str(e)}"}), 500


def _school_overview_impl():
    school = request.school
    sid = school["school_id"]

    students = make_supabase_request(
        "GET", "users_registration",
        select="id,name,surname,student_level,subscription_expires_at,created_at,is_active,credits,xp,level,streak,last_daily_reset,daily_credits_used",
        filters={"school_id": f"eq.{school['id']}"},
        use_service_role=True
    ) or []

    total_students = len(students)
    now = _now_utc()
    thirty_days_ago = now - timedelta(days=30)

    active_students = 0
    for st in students:
        last_reset = _parse_utc(st.get("last_daily_reset"))
        if last_reset and last_reset >= thirty_days_ago:
            active_students += 1

    sub_expires = _parse_utc(school.get("subscription_expires_at"))
    sub_active = bool(sub_expires and sub_expires >= now)
    days_remaining = max(0, (sub_expires - now).days) if sub_expires and sub_expires >= now else 0

    total_revenue = total_students * REVENUE_PER_STUDENT
    school_earnings = total_revenue * SCHOOL_SHARE_PERCENT
    nerdx_share = total_revenue * NERDX_SHARE_PERCENT

    payments = make_supabase_request(
        "GET", "school_payments",
        select="amount,status",
        filters={"school_id": f"eq.{sid}"},
        use_service_role=True
    ) or []
    total_paid = sum(float(p.get("amount", 0)) for p in payments if p.get("status") in ("paid", "verified"))
    total_pending = sum(float(p.get("amount", 0)) for p in payments if p.get("status") == "pending")

    activity = make_supabase_request(
        "GET", "school_student_activity",
        select="date,sessions_count,questions_answered,credits_used,time_spent_minutes,subjects_accessed",
        filters={
            "school_id": f"eq.{sid}",
            "date": f"gte.{(now - timedelta(days=30)).strftime('%Y-%m-%d')}",
        },
        use_service_role=True
    ) or []

    daily_activity = {}
    subject_counts = {}
    for a in activity:
        d = a.get("date", "")
        if d not in daily_activity:
            daily_activity[d] = {"date": d, "sessions": 0, "questions": 0, "time_minutes": 0}
        daily_activity[d]["sessions"] += a.get("sessions_count", 0)
        daily_activity[d]["questions"] += a.get("questions_answered", 0)
        daily_activity[d]["time_minutes"] += a.get("time_spent_minutes", 0)
        for subj in (a.get("subjects_accessed") or []):
            subject_counts[subj] = subject_counts.get(subj, 0) + 1

    return jsonify({
        "total_students": total_students,
        "active_students": active_students,
        "subscription_active": sub_active,
        "subscription_expires_at": school.get("subscription_expires_at"),
        "days_remaining": days_remaining,
        "revenue": {
            "per_student": REVENUE_PER_STUDENT,
            "total_monthly": total_revenue,
            "school_share": school_earnings,
            "school_share_percent": SCHOOL_SHARE_PERCENT * 100,
            "nerdx_share": nerdx_share,
            "nerdx_share_percent": NERDX_SHARE_PERCENT * 100,
            "total_paid": total_paid,
            "total_pending": total_pending,
            "amount_due": max(0, nerdx_share - total_paid),
        },
        "daily_activity": sorted(daily_activity.values(), key=lambda x: x["date"]),
        "subject_distribution": [
            {"subject": s, "count": c} for s, c in sorted(subject_counts.items(), key=lambda x: -x[1])
        ],
    })


# ─── STUDENTS ───────────────────────────────────────────────────────────────────

@school_portal_bp.route("/students", methods=["GET"])
@school_auth_required
def school_students():
    """List all students with usage stats."""
    try:
        return _school_students_impl()
    except Exception as e:
        logger.error(f"Students error: {e}", exc_info=True)
        return jsonify({"error": f"Students failed: {str(e)}"}), 500


def _school_students_impl():
    school = request.school

    students = make_supabase_request(
        "GET", "users_registration",
        select="id,name,surname,student_level,subscription_expires_at,created_at,is_active,credits,xp,level,streak,last_daily_reset,daily_credits_used",
        filters={"school_id": f"eq.{school['id']}"},
        use_service_role=True
    ) or []

    now = _now_utc()
    thirty_days_ago = now - timedelta(days=30)
    result = []
    for st in students:
        last_active = _parse_utc(st.get("last_daily_reset"))
        is_recently_active = bool(last_active and last_active >= thirty_days_ago)
        result.append({
            "id": st.get("id"),
            "name": f"{(st.get('name') or '').strip()} {(st.get('surname') or '').strip()}".strip(),
            "level": st.get("student_level") or "Not set",
            "xp": st.get("xp", 0),
            "app_level": st.get("level", 1),
            "streak": st.get("streak", 0),
            "credits": st.get("credits", 0),
            "daily_credits_used": st.get("daily_credits_used", 0),
            "last_active": last_active.isoformat() if last_active else None,
            "is_active": is_recently_active,
            "joined_at": st.get("created_at"),
        })

    result.sort(key=lambda x: (not x["is_active"], (x["last_active"] or "")), reverse=False)
    result.sort(key=lambda x: x["is_active"], reverse=True)

    return jsonify({"students": result, "total": len(result)})


@school_portal_bp.route("/students/<int:student_id>", methods=["GET"])
@school_auth_required
def school_student_detail(student_id):
    """Individual student detail with activity history."""
    school = request.school

    students = make_supabase_request(
        "GET", "users_registration",
        select="id,name,surname,student_level,subscription_expires_at,created_at,is_active,credits,xp,level,streak,last_daily_reset,daily_credits_used",
        filters={"id": f"eq.{student_id}", "school_id": f"eq.{school['id']}"},
        use_service_role=True
    )
    if not students:
        return jsonify({"error": "Student not found"}), 404

    st = students[0]
    last_active = _parse_utc(st.get("last_daily_reset"))

    activity = make_supabase_request(
        "GET", "school_student_activity",
        select="date,sessions_count,questions_answered,credits_used,time_spent_minutes,subjects_accessed",
        filters={
            "student_id": f"eq.{student_id}",
            "school_id": f"eq.{school['school_id']}",
        },
        use_service_role=True
    ) or []

    total_sessions = sum(a.get("sessions_count", 0) for a in activity)
    total_questions = sum(a.get("questions_answered", 0) for a in activity)
    total_time = sum(a.get("time_spent_minutes", 0) for a in activity)
    subjects_set = set()
    for a in activity:
        for s in (a.get("subjects_accessed") or []):
            subjects_set.add(s)

    return jsonify({
        "student": {
            "id": st.get("id"),
            "name": f"{(st.get('name') or '').strip()} {(st.get('surname') or '').strip()}".strip(),
            "level": st.get("student_level") or "Not set",
            "xp": st.get("xp", 0),
            "app_level": st.get("level", 1),
            "streak": st.get("streak", 0),
            "credits": st.get("credits", 0),
            "daily_credits_used": st.get("daily_credits_used", 0),
            "last_active": last_active.isoformat() if last_active else None,
            "joined_at": st.get("created_at"),
        },
        "summary": {
            "total_sessions": total_sessions,
            "total_questions": total_questions,
            "total_time_minutes": total_time,
            "subjects_used": sorted(subjects_set),
            "days_active": len(activity),
        },
        "activity": sorted(
            [{"date": a["date"], "sessions": a.get("sessions_count", 0),
              "questions": a.get("questions_answered", 0),
              "time_minutes": a.get("time_spent_minutes", 0),
              "subjects": a.get("subjects_accessed", [])} for a in activity],
            key=lambda x: x["date"], reverse=True
        ),
    })


# ─── FINANCE ────────────────────────────────────────────────────────────────────

@school_portal_bp.route("/finance/summary", methods=["GET"])
@school_auth_required
def finance_summary():
    """Financial summary: earnings, amounts due, payment history."""
    try:
        return _finance_summary_impl()
    except Exception as e:
        logger.error(f"Finance summary error: {e}", exc_info=True)
        return jsonify({"error": f"Finance summary failed: {str(e)}"}), 500


def _finance_summary_impl():
    school = request.school
    sid = school["school_id"]

    students = make_supabase_request(
        "GET", "users_registration",
        select="id",
        filters={"school_id": f"eq.{school['id']}"},
        use_service_role=True
    ) or []
    num_students = len(students)

    total_revenue = num_students * REVENUE_PER_STUDENT
    school_earnings = total_revenue * SCHOOL_SHARE_PERCENT
    nerdx_share = total_revenue * NERDX_SHARE_PERCENT

    payments = make_supabase_request(
        "GET", "school_payments",
        select="*",
        filters={"school_id": f"eq.{sid}"},
        use_service_role=True
    ) or []

    total_paid = sum(float(p.get("amount", 0)) for p in payments if p.get("status") in ("paid", "verified"))
    total_pending = sum(float(p.get("amount", 0)) for p in payments if p.get("status") == "pending")

    return jsonify({
        "num_students": num_students,
        "per_student_fee": REVENUE_PER_STUDENT,
        "total_monthly_revenue": total_revenue,
        "school_earnings": school_earnings,
        "school_share_percent": SCHOOL_SHARE_PERCENT * 100,
        "nerdx_share": nerdx_share,
        "nerdx_share_percent": NERDX_SHARE_PERCENT * 100,
        "total_paid": total_paid,
        "total_pending": total_pending,
        "amount_due": max(0, nerdx_share - total_paid),
        "payments": sorted(payments, key=lambda p: p.get("created_at", ""), reverse=True),
    })


@school_portal_bp.route("/finance/payments", methods=["GET"])
@school_auth_required
def finance_payments():
    """List all payments."""
    school = request.school
    payments = make_supabase_request(
        "GET", "school_payments",
        select="*",
        filters={"school_id": f"eq.{school['school_id']}"},
        use_service_role=True
    ) or []
    return jsonify({
        "payments": sorted(payments, key=lambda p: p.get("created_at", ""), reverse=True)
    })


@school_portal_bp.route("/finance/pay-ecocash", methods=["POST"])
@school_auth_required
def finance_pay_ecocash():
    """Initiate EcoCash payment via Paynow."""
    school = request.school
    body = request.get_json(silent=True) or {}
    phone = (body.get("phone_number") or "").strip()
    email = (body.get("email") or school.get("email") or "").strip()
    amount = float(body.get("amount", 0))

    if not phone:
        return jsonify({"error": "Phone number is required"}), 400
    if amount <= 0:
        return jsonify({"error": "Amount must be greater than 0"}), 400

    try:
        from services.paynow_service import PaynowService
        paynow = PaynowService()
    except Exception as e:
        logger.error(f"Paynow init error: {e}")
        return jsonify({"error": "Payment service unavailable"}), 503

    if not paynow.is_available():
        return jsonify({"error": "Payment service unavailable"}), 503

    reference = f"SCHOOL-{school['school_id']}-{uuid.uuid4().hex[:8].upper()}"
    description = f"NerdX School Payment - {school.get('name', '')}"

    result = paynow.create_usd_ecocash_payment(
        amount=amount,
        phone_number=phone,
        email=email,
        reference=reference,
        description=description,
    )

    if not result.get("success"):
        return jsonify({"error": result.get("message", "Payment failed")}), 400

    students = make_supabase_request(
        "GET", "users_registration", select="id",
        filters={"school_id": f"eq.{school['id']}"},
        use_service_role=True
    ) or []

    make_supabase_request("POST", "school_payments", {
        "school_id": school["school_id"],
        "amount": amount,
        "num_students": len(students),
        "payment_method": "ecocash",
        "paynow_reference": reference,
        "paynow_poll_url": result.get("poll_url"),
        "status": "pending",
        "period_start": _now_utc().strftime("%Y-%m-%d"),
        "period_end": (_now_utc() + timedelta(days=30)).strftime("%Y-%m-%d"),
    }, use_service_role=True)

    return jsonify({
        "success": True,
        "reference": reference,
        "poll_url": result.get("poll_url"),
        "instructions": result.get("instructions"),
    })


@school_portal_bp.route("/finance/payment-status/<reference>", methods=["GET"])
@school_auth_required
def finance_payment_status(reference):
    """Check EcoCash payment status."""
    school = request.school

    payments = make_supabase_request(
        "GET", "school_payments",
        select="*",
        filters={
            "school_id": f"eq.{school['school_id']}",
            "paynow_reference": f"eq.{reference}",
        },
        use_service_role=True
    )
    if not payments:
        return jsonify({"error": "Payment not found"}), 404

    payment = payments[0]
    if payment.get("status") in ("paid", "verified"):
        return jsonify({"status": payment["status"], "paid": True})

    poll_url = payment.get("paynow_poll_url")
    if not poll_url:
        return jsonify({"status": payment.get("status", "unknown"), "paid": False})

    try:
        from services.paynow_service import PaynowService
        paynow = PaynowService()
        result = paynow.check_payment_status(poll_url)
    except Exception as e:
        logger.error(f"Payment status check error: {e}")
        return jsonify({"status": "unknown", "paid": False})

    if result.get("paid"):
        make_supabase_request(
            "PATCH", "school_payments",
            {"status": "paid", "updated_at": _now_utc().isoformat()},
            filters={"id": f"eq.{payment['id']}"},
            use_service_role=True,
        )
        return jsonify({"status": "paid", "paid": True})

    return jsonify({
        "status": result.get("status", "pending").lower(),
        "paid": False,
    })


@school_portal_bp.route("/finance/upload-receipt", methods=["POST"])
@school_auth_required
def finance_upload_receipt():
    """Upload bank transfer receipt (base64 image)."""
    school = request.school
    body = request.get_json(silent=True) or {}
    receipt_data = body.get("receipt_data", "")
    amount = float(body.get("amount", 0))
    notes = (body.get("notes") or "").strip()

    if not receipt_data:
        return jsonify({"error": "Receipt image is required"}), 400
    if amount <= 0:
        return jsonify({"error": "Amount must be greater than 0"}), 400

    students = make_supabase_request(
        "GET", "users_registration", select="id",
        filters={"school_id": f"eq.{school['id']}"},
        use_service_role=True
    ) or []

    reference = f"BANK-{school['school_id']}-{uuid.uuid4().hex[:8].upper()}"

    make_supabase_request("POST", "school_payments", {
        "school_id": school["school_id"],
        "amount": amount,
        "num_students": len(students),
        "payment_method": "bank_transfer",
        "paynow_reference": reference,
        "status": "pending",
        "receipt_url": receipt_data,
        "notes": notes,
        "period_start": _now_utc().strftime("%Y-%m-%d"),
        "period_end": (_now_utc() + timedelta(days=30)).strftime("%Y-%m-%d"),
    }, use_service_role=True)

    return jsonify({
        "success": True,
        "reference": reference,
        "message": "Receipt uploaded successfully. Payment is pending verification.",
    })
