"""
School Portal API for NerdX
Provides authentication, student monitoring, financial management, and payment processing
for partner schools accessing their dedicated dashboard.
"""
import json
import logging
import time
import uuid
import base64
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import Blueprint, request, jsonify, Response, stream_with_context, make_response

from database.external_db import make_supabase_request
from services.vertex_service import vertex_service
from services import school_portal_exports as portal_exports
from services.school_portal_scope import (
    portal_network_scope,
    fetch_users_registration_by_school_pks,
    fetch_school_payments_by_codes,
    fetch_school_activity_by_codes,
)

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
            "group_id": school.get("group_id"),
            "campus_name": school.get("campus_name"),
            "location": school.get("location"),
            "city": school.get("city"),
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
            "group_id": school.get("group_id"),
            "campus_name": school.get("campus_name"),
            "location": school.get("location"),
            "city": school.get("city"),
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
        "group_id": s.get("group_id"),
        "campus_name": s.get("campus_name"),
        "location": s.get("location"),
        "city": s.get("city"),
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
    db_ids, pay_codes = portal_network_scope(school)

    students = fetch_users_registration_by_school_pks(
        db_ids,
        "id,name,surname,student_level,subscription_expires_at,created_at,is_active,credits,xp,level,streak,last_daily_reset,daily_credits_used",
    )

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

    payments = fetch_school_payments_by_codes(pay_codes, "amount,status")
    total_paid = sum(float(p.get("amount", 0)) for p in payments if p.get("status") in ("paid", "verified"))
    total_pending = sum(float(p.get("amount", 0)) for p in payments if p.get("status") == "pending")

    activity = fetch_school_activity_by_codes(
        pay_codes,
        (now - timedelta(days=30)).strftime("%Y-%m-%d"),
    )

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


def _in_filter_csv(values):
    """Build PostgREST `in.(...)` CSV for numeric or alphanumeric tokens (no commas in values)."""
    parts = []
    for v in values:
        s = str(v).strip()
        if not s or "," in s:
            continue
        parts.append(s)
    return ",".join(parts)


def _chunks(seq, size):
    for i in range(0, len(seq), size):
        yield seq[i : i + size]


def _group_network_analytics_impl():
    """
    CEO-grade network analytics for a logged-in school that belongs to a group (e.g. Herentals).
    Aggregates portal learners, payments, activity, mobile vs web proxy, and ecosystem performance.
    """
    school = request.school
    gid = (school.get("group_id") or "").strip()
    if not gid:
        return jsonify({"error": "This school is not linked to a group network."}), 400

    members = (
        make_supabase_request(
            "GET",
            "schools",
            select="id,school_id,name,slug,city,campus_name,logo_url",
            filters={"group_id": f"eq.{gid}"},
            use_service_role=True,
        )
        or []
    )
    members.sort(key=lambda m: (m.get("name") or "").lower())

    if not members:
        z = {
            "portal_students": 0,
            "active_30d": 0,
            "subscribed_now": 0,
            "retention_pct_30d": 0.0,
            "subscription_pct": 0.0,
            "sessions_30d": 0,
            "questions_30d": 0,
            "minutes_30d": 0,
            "payments_paid_usd": 0.0,
            "payments_pending_usd": 0.0,
            "revenue_model_monthly_usd": 0.0,
            "school_share_model_usd": 0.0,
            "nerdx_share_model_usd": 0.0,
            "eco_students": 0,
            "teachers_registered": 0,
            "performance_rows_students": 0,
            "weighted_avg_accuracy": None,
        }
        return jsonify(
            {
                "group_id": gid,
                "network_name": school.get("name"),
                "school_count": 0,
                "totals": z,
                "schools": [],
                "network_daily_activity": [],
                "monetization_funnel": [],
                "channel_engagement": [
                    {"channel": "Mobile app", "learners": 0, "detail": "Active Expo push token"},
                    {"channel": "Web-first", "learners": 0, "detail": "No active mobile token"},
                ],
                "channel_devices": [],
                "subject_distribution_network": [],
                "top_schools_by_activity": [],
                "payments_by_school": [],
                "performance": {
                    "weighted_avg_accuracy": None,
                    "students_with_assessment_data": 0,
                    "eco_student_records": 0,
                },
                "projected_pass_rate_pct": None,
                "projected_pass_band": None,
                "executive_insight": "No sub-schools are registered under this group yet. Add branches from Sub-Schools to unlock network analytics.",
            }
        )

    id_list = [m["id"] for m in members if m.get("id") is not None]
    code_list = [m["school_id"] for m in members if m.get("school_id")]

    # ── Portal students (users_registration.school_id = schools.id) ─────────
    all_users = []
    id_csv = _in_filter_csv(id_list)
    if id_csv:
        for chunk in _chunks(id_csv.split(","), 45):
            c = ",".join(chunk)
            rows = (
                make_supabase_request(
                    "GET",
                    "users_registration",
                    select="id,school_id,subscription_expires_at,last_daily_reset,created_at,chat_id",
                    filters={"school_id": f"in.({c})"},
                    use_service_role=True,
                )
                or []
            )
            all_users.extend(rows)

    users_by_school_id = {}
    for u in all_users:
        sid_int = u.get("school_id")
        users_by_school_id.setdefault(sid_int, []).append(u)

    now = _now_utc()
    thirty_days_ago = now - timedelta(days=30)

    # ── Payments (per school code) ─────────────────────────────────────────
    payments_all = []
    code_csv = _in_filter_csv(code_list)
    if code_csv:
        for chunk in _chunks(code_csv.split(","), 40):
            c = ",".join(chunk)
            rows = (
                make_supabase_request(
                    "GET",
                    "school_payments",
                    select="school_id,amount,status,created_at",
                    filters={"school_id": f"in.({c})"},
                    use_service_role=True,
                    limit=5000,
                )
                or []
            )
            payments_all.extend(rows)

    payments_by_code = {}
    for p in payments_all:
        payments_by_code.setdefault(p.get("school_id"), []).append(p)

    # ── Activity last 30 days ──────────────────────────────────────────────
    date_from = (now - timedelta(days=30)).strftime("%Y-%m-%d")
    activity_all = []
    if code_csv:
        for chunk in _chunks(code_csv.split(","), 35):
            c = ",".join(chunk)
            rows = (
                make_supabase_request(
                    "GET",
                    "school_student_activity",
                    select="school_id,date,sessions_count,questions_answered,time_spent_minutes,subjects_accessed",
                    filters={"school_id": f"in.({c})", "date": f"gte.{date_from}"},
                    use_service_role=True,
                    limit=20000,
                )
                or []
            )
            activity_all.extend(rows)

    activity_by_code = {}
    network_daily = {}
    subject_counts_net = {}
    for a in activity_all:
        sc = a.get("school_id")
        activity_by_code.setdefault(sc, []).append(a)
        d = a.get("date", "")
        if d not in network_daily:
            network_daily[d] = {"date": d, "sessions": 0, "questions": 0, "time_minutes": 0}
        network_daily[d]["sessions"] += int(a.get("sessions_count") or 0)
        network_daily[d]["questions"] += int(a.get("questions_answered") or 0)
        network_daily[d]["time_minutes"] += int(a.get("time_spent_minutes") or 0)
        for subj in a.get("subjects_accessed") or []:
            subject_counts_net[subj] = subject_counts_net.get(subj, 0) + 1

    # ── Mobile vs web proxy (active push token per learner id) ──────────────
    idents = set()
    for u in all_users:
        idents.add(str(u.get("id") or ""))
        ch = u.get("chat_id")
        if ch is not None and str(ch).strip():
            idents.add(str(ch).strip())
    idents.discard("")

    mobile_users = set()
    platform_split = {"ios": 0, "android": 0, "other": 0}
    if idents:
        for chunk in _chunks(sorted(idents), 50):
            inc = _in_filter_csv(chunk)
            if not inc:
                continue
            tokens = (
                make_supabase_request(
                    "GET",
                    "mobile_push_tokens",
                    select="user_id,platform",
                    filters={"user_id": f"in.({inc})", "is_active": "eq.true"},
                    use_service_role=True,
                    limit=5000,
                )
                or []
            )
            for t in tokens:
                uid = str(t.get("user_id") or "")
                mobile_users.add(uid)
                pl = (t.get("platform") or "").lower()
                if pl == "ios":
                    platform_split["ios"] += 1
                elif pl == "android":
                    platform_split["android"] += 1
                else:
                    platform_split["other"] += 1

    def user_has_mobile(u):
        if str(u.get("id") or "") in mobile_users:
            return True
        ch = u.get("chat_id")
        return bool(ch and str(ch).strip() in mobile_users)

    mobile_learners = sum(1 for u in all_users if user_has_mobile(u))
    web_primary_learners = max(0, len(all_users) - mobile_learners)

    # ── Ecosystem performance (school_students + student_performance) ───────
    eco_student_rows = []
    if code_csv:
        for chunk in _chunks(code_csv.split(","), 40):
            c = ",".join(chunk)
            rows = (
                make_supabase_request(
                    "GET",
                    "school_students",
                    select="id,sub_school_id",
                    filters={"sub_school_id": f"in.({c})"},
                    use_service_role=True,
                    limit=15000,
                )
                or []
            )
            eco_student_rows.extend(rows)

    sid_to_sub = {r["id"]: r.get("sub_school_id") for r in eco_student_rows}
    perf_weighted_num = 0.0
    perf_weighted_den = 0.0
    per_school_perf = {m["school_id"]: {"w_num": 0.0, "w_den": 0.0} for m in members}

    seen_students_perf = set()
    eco_ids = [r["id"] for r in eco_student_rows if r.get("id")]
    for chunk in _chunks(eco_ids, 60):
        inc = _in_filter_csv(chunk)
        if not inc:
            continue
        prow = (
            make_supabase_request(
                "GET",
                "student_performance",
                select="student_id,accuracy_pct,total_attempts",
                filters={"student_id": f"in.({inc})"},
                use_service_role=True,
                limit=8000,
            )
            or []
        )
        for row in prow:
            sid = row.get("student_id")
            if sid is not None:
                seen_students_perf.add(sid)
            acc = float(row.get("accuracy_pct") or 0)
            att = int(row.get("total_attempts") or 0)
            w = att if att > 0 else 1
            perf_weighted_num += acc * w
            perf_weighted_den += w
            subc = sid_to_sub.get(sid)
            if subc and subc in per_school_perf:
                per_school_perf[subc]["w_num"] += acc * w
                per_school_perf[subc]["w_den"] += w

    avg_accuracy = None
    if perf_weighted_den > 0:
        avg_accuracy = perf_weighted_num / perf_weighted_den

    students_with_perf = len(seen_students_perf)

    projected_pass = None
    pass_band = None
    if avg_accuracy is not None and students_with_perf > 0:
        projected_pass = round(max(42.0, min(91.0, 36.0 + 0.58 * avg_accuracy)), 1)
        pass_band = "±7 percentage points (model band)"

    # ── Per-school breakdown ─────────────────────────────────────────────────
    schools_out = []
    total_students = 0
    total_active_30d = 0
    total_subscribed = 0
    total_paid_net = 0.0
    total_pending_net = 0.0
    total_sessions_30d = 0
    total_questions_30d = 0
    total_minutes_30d = 0

    teacher_counts = {}
    if code_csv:
        for chunk in _chunks(code_csv.split(","), 40):
            c = ",".join(chunk)
            trows = (
                make_supabase_request(
                    "GET",
                    "school_teachers",
                    select="id,sub_school_id",
                    filters={"sub_school_id": f"in.({c})"},
                    use_service_role=True,
                    limit=15000,
                )
                or []
            )
            for tr in trows or []:
                sc = tr.get("sub_school_id")
                teacher_counts[sc] = teacher_counts.get(sc, 0) + 1

    eco_counts = {}
    for r in eco_student_rows:
        eco_counts[r.get("sub_school_id")] = eco_counts.get(r.get("sub_school_id"), 0) + 1

    for m in members:
        mid = m["id"]
        mcode = m["school_id"]
        ulist = users_by_school_id.get(mid, [])
        n_st = len(ulist)
        active = 0
        subd = 0
        for u in ulist:
            lr = _parse_utc(u.get("last_daily_reset"))
            if lr and lr >= thirty_days_ago:
                active += 1
            se = _parse_utc(u.get("subscription_expires_at"))
            if se and se >= now:
                subd += 1

        pays = payments_by_code.get(mcode, [])
        paid = sum(float(x.get("amount", 0)) for x in pays if x.get("status") in ("paid", "verified"))
        pending = sum(float(x.get("amount", 0)) for x in pays if x.get("status") == "pending")

        act_rows = activity_by_code.get(mcode, [])
        sess = sum(int(x.get("sessions_count") or 0) for x in act_rows)
        ques = sum(int(x.get("questions_answered") or 0) for x in act_rows)
        mins = sum(int(x.get("time_spent_minutes") or 0) for x in act_rows)
        activity_score = sess + ques / 10.0 + mins / 25.0

        psp = per_school_perf.get(mcode, {"w_num": 0.0, "w_den": 0.0})
        school_avg_acc = (psp["w_num"] / psp["w_den"]) if psp["w_den"] > 0 else None

        total_students += n_st
        total_active_30d += active
        total_subscribed += subd
        total_paid_net += paid
        total_pending_net += pending
        total_sessions_30d += sess
        total_questions_30d += ques
        total_minutes_30d += mins

        retention_pct = round(100.0 * active / n_st, 1) if n_st else 0.0
        subscription_pct = round(100.0 * subd / n_st, 1) if n_st else 0.0

        schools_out.append(
            {
                "school_id": mcode,
                "name": m.get("name"),
                "slug": m.get("slug"),
                "city": m.get("city"),
                "campus_name": m.get("campus_name"),
                "portal_students": n_st,
                "active_30d": active,
                "subscribed_now": subd,
                "retention_pct": retention_pct,
                "subscription_pct": subscription_pct,
                "eco_students": eco_counts.get(mcode, 0),
                "teachers_registered": teacher_counts.get(mcode, 0),
                "payments_paid": round(paid, 2),
                "payments_pending": round(pending, 2),
                "sessions_30d": sess,
                "questions_30d": ques,
                "minutes_30d": mins,
                "activity_score": round(activity_score, 2),
                "avg_topic_accuracy": round(school_avg_acc, 2) if school_avg_acc is not None else None,
            }
        )

    schools_out.sort(key=lambda x: -x["activity_score"])

    retention_network = round(100.0 * total_active_30d / total_students, 1) if total_students else 0.0
    subscription_network = round(100.0 * total_subscribed / total_students, 1) if total_students else 0.0

    funnel = [
        {"stage": "Registered on NerdX", "value": total_students},
        {"stage": "Active subscription", "value": total_subscribed},
        {"stage": "Engaged (30d)", "value": total_active_30d},
    ]

    channel_engagement = [
        {"channel": "Mobile app", "learners": mobile_learners, "detail": "Active Expo push token"},
        {"channel": "Web-first", "learners": web_primary_learners, "detail": "No active mobile token"},
    ]

    m_total = platform_split["ios"] + platform_split["android"] + platform_split["other"]
    channel_devices = []
    if m_total > 0:
        channel_devices = [
            {"name": "iOS", "value": platform_split["ios"]},
            {"name": "Android", "value": platform_split["android"]},
            {"name": "Other", "value": platform_split["other"]},
        ]

    total_rev_model = total_students * REVENUE_PER_STUDENT
    school_share_model = total_rev_model * SCHOOL_SHARE_PERCENT
    nerdx_share_model = total_rev_model * NERDX_SHARE_PERCENT

    insight_parts = []
    if total_students == 0:
        insight_parts.append(
            "The network has no portal-registered learners yet. Onboard students per branch to unlock revenue, engagement, and examination-readiness modelling."
        )
    else:
        insight_parts.append(
            f"The group operates {len(members)} campuses with {total_students:,} learners on the NerdX portal. "
            f"Thirty-day engagement covers {retention_network:.1f}% of that base; {subscription_network:.1f}% hold an active paid subscription window."
        )
        if total_sessions_30d or total_questions_30d:
            insight_parts.append(
                f"In the last 30 days the network logged {total_sessions_30d:,} sessions, {total_questions_30d:,} questions, "
                f"and {total_minutes_30d // 60:,}h {total_minutes_30d % 60}m of study time — concentration in the top campuses below."
            )
        if projected_pass is not None:
            insight_parts.append(
                f"Aggregated AI classroom mastery (topic-level accuracy, weighted by attempts across {students_with_perf} learners with assessment history) "
                f"suggests an indicative group examination readiness of about {projected_pass:.1f}% {pass_band or ''}, "
                f"before timetabled teaching and mock exams."
            )
        else:
            insight_parts.append(
                "Pass-rate projection will appear once branches run AI classroom assessments and performance rows accumulate in the ecosystem database."
            )
        if total_paid_net or total_pending_net:
            insight_parts.append(
                f"Recorded network collections: {total_paid_net:,.2f} USD settled; {total_pending_net:,.2f} USD awaiting verification."
            )

    executive_insight = " ".join(insight_parts)

    top_activity_chart = [
        {
            "name": (s["name"] or s["school_id"])[:22] + ("…" if len(s["name"] or "") > 22 else ""),
            "full_name": s["name"],
            "activity": round(s["activity_score"], 1),
            "sessions": s["sessions_30d"],
            "students": s["portal_students"],
        }
        for s in schools_out[:12]
    ]

    payment_by_school = [
        {
            "name": (s["name"] or s["school_id"])[:20],
            "paid": s["payments_paid"],
            "pending": s["payments_pending"],
        }
        for s in sorted(schools_out, key=lambda x: -(x["payments_paid"] + x["payments_pending"]))[:12]
    ]

    return jsonify(
        {
            "group_id": gid,
            "network_name": school.get("name"),
            "school_count": len(members),
            "totals": {
                "portal_students": total_students,
                "active_30d": total_active_30d,
                "subscribed_now": total_subscribed,
                "retention_pct_30d": retention_network,
                "subscription_pct": subscription_network,
                "sessions_30d": total_sessions_30d,
                "questions_30d": total_questions_30d,
                "minutes_30d": total_minutes_30d,
                "payments_paid_usd": round(total_paid_net, 2),
                "payments_pending_usd": round(total_pending_net, 2),
                "revenue_model_monthly_usd": round(total_rev_model, 2),
                "school_share_model_usd": round(school_share_model, 2),
                "nerdx_share_model_usd": round(nerdx_share_model, 2),
                "eco_students": len(eco_student_rows),
                "teachers_registered": sum(teacher_counts.values()),
                "performance_rows_students": students_with_perf,
                "weighted_avg_accuracy": round(avg_accuracy, 2) if avg_accuracy is not None else None,
            },
            "schools": schools_out,
            "network_daily_activity": sorted(network_daily.values(), key=lambda x: x["date"]),
            "monetization_funnel": funnel,
            "channel_engagement": channel_engagement,
            "channel_devices": channel_devices,
            "subject_distribution_network": [
                {"subject": s, "count": c} for s, c in sorted(subject_counts_net.items(), key=lambda x: -x[1])[:14]
            ],
            "top_schools_by_activity": top_activity_chart,
            "payments_by_school": payment_by_school,
            "performance": {
                "weighted_avg_accuracy": round(avg_accuracy, 2) if avg_accuracy is not None else None,
                "students_with_assessment_data": students_with_perf,
                "eco_student_records": len(eco_student_rows),
            },
            "projected_pass_rate_pct": projected_pass,
            "projected_pass_band": pass_band,
            "executive_insight": executive_insight,
        }
    )


@school_portal_bp.route("/group-network-analytics", methods=["GET"])
@school_auth_required
def school_group_network_analytics():
    """Rich analytics for group-school CEOs: all campuses, engagement, payments, AI readiness."""
    try:
        return _group_network_analytics_impl()
    except Exception as e:
        logger.error(f"Group network analytics error: {e}", exc_info=True)
        return jsonify({"error": f"Analytics failed: {str(e)}"}), 500


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
    db_ids, _ = portal_network_scope(school)
    students = fetch_users_registration_by_school_pks(
        db_ids,
        "id,name,surname,student_level,subscription_expires_at,created_at,is_active,credits,xp,level,streak,last_daily_reset,daily_credits_used",
    )

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
            "subscription_expires_at": st.get("subscription_expires_at"),
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
    db_ids, _ = portal_network_scope(school)
    id_csv = _in_filter_csv(db_ids)
    st = None
    if id_csv:
        for chunk in _chunks(id_csv.split(","), 45):
            c = ",".join(chunk)
            rows = make_supabase_request(
                "GET",
                "users_registration",
                select="id,name,surname,student_level,subscription_expires_at,created_at,is_active,credits,xp,level,streak,last_daily_reset,daily_credits_used",
                filters={"id": f"eq.{student_id}", "school_id": f"in.({c})"},
                use_service_role=True,
            ) or []
            if rows:
                st = rows[0]
                break
    if not st:
        return jsonify({"error": "Student not found"}), 404
    last_active = _parse_utc(st.get("last_daily_reset"))

    # Activity rows use the human-readable school code for this learner's campus, not the head-office code.
    activity_school_code = school["school_id"]
    learner_campus_pk = st.get("school_id")
    if learner_campus_pk is not None:
        cmap = (
            make_supabase_request(
                "GET",
                "schools",
                select="school_id",
                filters={"id": f"eq.{learner_campus_pk}"},
                use_service_role=True,
            )
            or []
        )
        if cmap and cmap[0].get("school_id"):
            activity_school_code = cmap[0]["school_id"]

    activity = make_supabase_request(
        "GET", "school_student_activity",
        select="date,sessions_count,questions_answered,credits_used,time_spent_minutes,subjects_accessed",
        filters={
            "student_id": f"eq.{student_id}",
            "school_id": f"eq.{activity_school_code}",
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
            "subscription_expires_at": st.get("subscription_expires_at"),
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


@school_portal_bp.route("/students/<int:student_id>/expiry", methods=["PATCH"])
@school_auth_required
def school_update_student_expiry(student_id):
    """Update a student subscription expiry date for this school."""
    school = request.school
    body = request.get_json(silent=True) or {}
    expires_at_raw = body.get("subscription_expires_at")

    if not expires_at_raw:
        return jsonify({"error": "subscription_expires_at is required"}), 400

    expires_at = _parse_utc(expires_at_raw)
    if not expires_at:
        return jsonify({"error": "Invalid subscription_expires_at format"}), 400

    db_ids, _ = portal_network_scope(school)
    id_csv = _in_filter_csv(db_ids)
    found = False
    if id_csv:
        for chunk in _chunks(id_csv.split(","), 45):
            c = ",".join(chunk)
            rows = make_supabase_request(
                "GET",
                "users_registration",
                select="id",
                filters={"id": f"eq.{student_id}", "school_id": f"in.({c})"},
                use_service_role=True,
            ) or []
            if rows:
                found = True
                break
    if not found:
        return jsonify({"error": "Student not found"}), 404

    updated = make_supabase_request(
        "PATCH", "users_registration",
        {"subscription_expires_at": expires_at.isoformat()},
        filters={"id": f"eq.{student_id}"},
        use_service_role=True
    )
    if updated is None:
        return jsonify({"error": "Failed to update student expiry"}), 500

    return jsonify({
        "success": True,
        "student_id": student_id,
        "subscription_expires_at": expires_at.isoformat()
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
    db_ids, pay_codes = portal_network_scope(school)

    students = fetch_users_registration_by_school_pks(db_ids, "id")
    num_students = len(students)

    total_revenue = num_students * REVENUE_PER_STUDENT
    school_earnings = total_revenue * SCHOOL_SHARE_PERCENT
    nerdx_share = total_revenue * NERDX_SHARE_PERCENT

    payments = fetch_school_payments_by_codes(pay_codes, "*")

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
    _, pay_codes = portal_network_scope(school)
    payments = fetch_school_payments_by_codes(pay_codes, "*")
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

    db_ids, _ = portal_network_scope(school)
    students = fetch_users_registration_by_school_pks(db_ids, "id")

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

    db_ids, _ = portal_network_scope(school)
    students = fetch_users_registration_by_school_pks(db_ids, "id")

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


# ─── SCHOOL SELF-SERVICE (profile + logo — mirrors admin-safe fields only) ─────

_ALLOWED_PROFILE_FIELDS = frozenset(
    {"email", "phone", "contact_person", "campus_name", "location", "city"}
)


@school_portal_bp.route("/school/profile", methods=["PATCH"])
@school_auth_required
def school_portal_update_profile():
    """Update contact / location fields for the authenticated school (not subscription)."""
    school = request.school
    body = request.get_json(silent=True) or {}
    payload = {k: body.get(k) for k in _ALLOWED_PROFILE_FIELDS if k in body}
    if not payload:
        return jsonify({"error": "No allowed fields to update"}), 400
    for key in list(payload.keys()):
        val = payload[key]
        if val is None:
            continue
        if isinstance(val, str):
            payload[key] = val.strip() or None
    try:
        make_supabase_request(
            "PATCH",
            "schools",
            payload,
            filters={"school_id": f"eq.{school['school_id']}"},
            use_service_role=True,
        )
        rows = make_supabase_request(
            "GET",
            "schools",
            select="id,school_id,name,slug,logo_url,email,phone,contact_person,subscription_expires_at,group_id,campus_name,location,city",
            filters={"school_id": f"eq.{school['school_id']}"},
            use_service_role=True,
        )
        if not rows:
            return jsonify({"error": "School not found"}), 404
        s = rows[0]
        return jsonify(
            {
                "success": True,
                "school": {
                    "id": s.get("id"),
                    "school_id": s.get("school_id"),
                    "name": s.get("name"),
                    "slug": s.get("slug"),
                    "logo_url": s.get("logo_url"),
                    "email": s.get("email"),
                    "phone": s.get("phone"),
                    "contact_person": s.get("contact_person"),
                    "subscription_expires_at": s.get("subscription_expires_at"),
                    "group_id": s.get("group_id"),
                    "campus_name": s.get("campus_name"),
                    "location": s.get("location"),
                    "city": s.get("city"),
                },
            }
        )
    except Exception as e:
        logger.error(f"Portal profile update error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@school_portal_bp.route("/school/logo", methods=["POST"])
@school_auth_required
def school_portal_upload_logo():
    """Upload school logo as base64 data URL (same contract as admin /api/logo)."""
    school = request.school
    body = request.get_json(silent=True) or {}
    logo_data = body.get("logo_url", "")
    if not logo_data or not isinstance(logo_data, str):
        return jsonify({"error": "Logo image data is required"}), 400
    try:
        result = make_supabase_request(
            "PATCH",
            "schools",
            {"logo_url": logo_data},
            filters={"id": f"eq.{school['id']}"},
            use_service_role=True,
        )
        if result:
            return jsonify({"success": True, "logo_url": result[0].get("logo_url")})
        return jsonify({"error": "School not found"}), 404
    except Exception as e:
        logger.error(f"Portal logo upload error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


def _portal_group_school_ids(school):
    """DB ids for all schools in the same group, or [this school] if no group."""
    return portal_network_scope(school)[0]


@school_portal_bp.route("/analytics/extras", methods=["GET"])
@school_auth_required
def school_portal_analytics_extras():
    """
    Supplementary read-only analytics: top portal learners by XP, accuracy histogram (ecosystem).
    Query: period=30|90 (days for activity window label only; histogram uses all performance rows).
    """
    school = request.school
    period = request.args.get("period", "30")
    try:
        period_days = int(period)
    except ValueError:
        period_days = 30
    if period_days not in (30, 90):
        period_days = 30

    db_ids = _portal_group_school_ids(school)
    if not db_ids:
        return jsonify(
            {
                "period_days": period_days,
                "top_learners": [],
                "accuracy_histogram": [],
            }
        )

    id_csv = _in_filter_csv(db_ids)
    if not id_csv:
        return jsonify({"period_days": period_days, "top_learners": [], "accuracy_histogram": []})

    all_users = []
    for chunk in _chunks(id_csv.split(","), 45):
        c = ",".join(chunk)
        rows = (
            make_supabase_request(
                "GET",
                "users_registration",
                select="id,name,surname,school_id,xp,streak,last_daily_reset,subscription_expires_at",
                filters={"school_id": f"in.({c})"},
                use_service_role=True,
                limit=2000,
            )
            or []
        )
        all_users.extend(rows)

    school_name_by_id = {}
    for m in (
        make_supabase_request(
            "GET",
            "schools",
            select="id,name,school_id",
            filters={"group_id": f"eq.{(school.get('group_id') or '').strip()}"} if (school.get("group_id") or "").strip() else {"id": f"eq.{school['id']}"},
            use_service_role=True,
        )
        or []
    ):
        school_name_by_id[m.get("id")] = m.get("name") or m.get("school_id")

    now = _now_utc()
    cutoff = now - timedelta(days=period_days)
    top_learners = sorted(
        all_users,
        key=lambda u: int(u.get("xp") or 0),
        reverse=True,
    )[:25]
    top_out = []
    for u in top_learners:
        sid_int = u.get("school_id")
        top_out.append(
            {
                "id": u.get("id"),
                "name": f"{(u.get('name') or '').strip()} {(u.get('surname') or '').strip()}".strip() or "Learner",
                "xp": int(u.get("xp") or 0),
                "streak": int(u.get("streak") or 0),
                "school_name": school_name_by_id.get(sid_int) or "",
                "recently_active": bool(_parse_utc(u.get("last_daily_reset")) and _parse_utc(u.get("last_daily_reset")) >= cutoff),
            }
        )

    code_list = []
    for mid in db_ids:
        r = make_supabase_request(
            "GET", "schools", select="school_id",
            filters={"id": f"eq.{mid}"}, use_service_role=True
        )
        if r and r[0].get("school_id"):
            code_list.append(r[0]["school_id"])
    eco = []
    code_csv = _in_filter_csv(code_list)
    if code_csv:
        for chunk in _chunks(code_csv.split(","), 40):
            c = ",".join(chunk)
            eco.extend(
                make_supabase_request(
                    "GET",
                    "school_students",
                    select="id",
                    filters={"sub_school_id": f"in.({c})"},
                    use_service_role=True,
                    limit=8000,
                )
                or []
            )
    eco_ids = [r["id"] for r in eco if r.get("id")]
    acc_values = []
    for chunk in _chunks(eco_ids, 80):
        inc = _in_filter_csv(chunk)
        if not inc:
            continue
        prow = (
            make_supabase_request(
                "GET",
                "student_performance",
                select="accuracy_pct",
                filters={"student_id": f"in.({inc})"},
                use_service_role=True,
                limit=5000,
            )
            or []
        )
        for row in prow:
            try:
                acc_values.append(float(row.get("accuracy_pct") or 0))
            except (TypeError, ValueError):
                continue

    buckets = [
        (0, 20),
        (20, 40),
        (40, 60),
        (60, 80),
        (80, 100.01),
    ]
    hist = []
    for lo, hi in buckets:
        cnt = sum(1 for a in acc_values if lo <= a < hi)
        hist.append(
            {
                "range": f"{lo}-{hi if hi < 100 else 100}%",
                "count": cnt,
            }
        )

    return jsonify(
        {
            "period_days": period_days,
            "top_learners": top_out,
            "accuracy_histogram": hist,
            "accuracy_sample_size": len(acc_values),
        }
    )


# ─── PHASE 2: HERENTALS AI (Vertex / Gemini, read-only) ─────────────────────────

HERENTALS_SYSTEM = (
    "You are Herentals AI, a read-only analyst for the NerdX school portal. "
    "Answer using only the DATA CONTEXT provided. If information is missing, say you do not have it. "
    "Use USD for money. Be concise and professional. "
    "Do not invent students, IDs, or metrics. You cannot change data or execute actions."
)


def _herentals_build_prompt(school, user_message, history, page_context):
    context = portal_exports.build_herentals_ai_context(school)
    history_lines = []
    for msg in history[-20:]:
        if not isinstance(msg, dict):
            continue
        role = (msg.get("role") or "user").strip().lower()
        role = "assistant" if role.startswith("assist") else "user"
        text = " ".join((msg.get("text") or msg.get("content") or "").strip().split())
        if not text:
            continue
        history_lines.append(f"{role}: {text}")
    parts = [HERENTALS_SYSTEM, "\n\nDATA CONTEXT:\n", context]
    if page_context:
        parts.append(f"\n\nCurrent dashboard area: {page_context}\n")
    if history_lines:
        parts.append("\n\nConversation:\n" + "\n".join(history_lines))
    parts.append(f"\n\nuser: {user_message}\nassistant:")
    return "".join(parts)


@school_portal_bp.route("/herentals-ai/chat", methods=["POST"])
@school_auth_required
def herentals_ai_chat():
    """Herentals AI: Vertex AI (Gemini) only, grounded on this school's portal data (read-only)."""
    try:
        data = request.get_json(silent=True) or {}
        user_message = " ".join((data.get("message") or "").strip().split())
        if not user_message:
            return jsonify({"error": "message is required"}), 400
        if len(user_message) > 8000:
            return jsonify({"error": "message too long"}), 400

        history = data.get("history") or []
        if not isinstance(history, list):
            history = []
        page_context = (data.get("page_context") or "").strip()[:200]
        want_stream = bool(data.get("stream"))

        if not vertex_service.is_available() or not getattr(vertex_service, "client", None):
            return jsonify(
                {
                    "error": (
                        "Herentals AI requires Google Vertex AI. On the server, set "
                        "GOOGLE_GENAI_USE_VERTEXAI=true (default), GOOGLE_CLOUD_PROJECT, "
                        "GOOGLE_CLOUD_LOCATION (e.g. us-central1), and credentials via "
                        "GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS. "
                        "Then restart the app."
                    ),
                }
            ), 503

        school = request.school
        try:
            prompt = _herentals_build_prompt(school, user_message, history, page_context)
        except Exception as ctx_err:
            logger.error("Herentals AI context build failed: %s", ctx_err, exc_info=True)
            return jsonify({"error": f"Failed to build school context: {ctx_err}"}), 500

        if want_stream:

            def generate():
                try:
                    for chunk in vertex_service.generate_text_stream(prompt):
                        yield f"data: {json.dumps({'text': chunk})}\n\n"
                    yield f"data: {json.dumps({'done': True})}\n\n"
                except Exception as ex:
                    logger.error("Herentals AI stream error: %s", ex, exc_info=True)
                    yield f"data: {json.dumps({'error': str(ex)})}\n\n"

            return Response(
                stream_with_context(generate()),
                mimetype="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "X-Accel-Buffering": "no",
                },
            )

        result = vertex_service.generate_text(prompt)
        if not result or not result.get("success"):
            err = (result or {}).get("error") or "generation failed"
            return jsonify({"error": err}), 500
        reply = (result.get("text") or "").strip() or "I could not produce an answer."
        return jsonify({"reply": reply})
    except Exception as e:
        logger.error("Herentals AI chat error: %s", e, exc_info=True)
        return jsonify({"error": str(e)}), 500


# ─── PHASE 2: EXPORTS ────────────────────────────────────────────────────────────


@school_portal_bp.route("/export/pdf-summary", methods=["GET"])
@school_auth_required
def export_portal_pdf_summary():
    try:
        raw = portal_exports.generate_summary_pdf(request.school)
        resp = make_response(raw)
        resp.headers["Content-Type"] = "application/pdf"
        resp.headers["Content-Disposition"] = 'attachment; filename="nerdx-school-summary.pdf"'
        return resp
    except Exception as e:
        logger.error("PDF export error: %s", e, exc_info=True)
        return jsonify({"error": str(e)}), 500


@school_portal_bp.route("/export/students-xlsx", methods=["GET"])
@school_auth_required
def export_portal_students_xlsx():
    try:
        raw = portal_exports.generate_students_xlsx(request.school)
        resp = make_response(raw)
        resp.headers["Content-Type"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        resp.headers["Content-Disposition"] = 'attachment; filename="nerdx-portal-students.xlsx"'
        return resp
    except Exception as e:
        logger.error("XLSX export error: %s", e, exc_info=True)
        return jsonify({"error": str(e)}), 500


@school_portal_bp.route("/export/pptx-highlights", methods=["GET"])
@school_auth_required
def export_portal_pptx():
    try:
        raw = portal_exports.generate_board_pptx(request.school)
        resp = make_response(raw)
        resp.headers["Content-Type"] = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        resp.headers["Content-Disposition"] = 'attachment; filename="nerdx-school-highlights.pptx"'
        return resp
    except Exception as e:
        logger.error("PPTX export error: %s", e, exc_info=True)
        return jsonify({"error": str(e)}), 500
