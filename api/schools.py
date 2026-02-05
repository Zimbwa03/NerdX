"""
Schools Management API for NerdX Admin Dashboard
CRUD for schools, school ID generation, subscription, and students.
"""
import logging
import random
import string
import re
from datetime import datetime, timedelta
from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from api.auth import login_required
from database.external_db import (
    make_supabase_request,
    generate_nerdx_id,
    get_user_registration,
    get_or_create_user_stats,
)

logger = logging.getLogger(__name__)

schools_bp = Blueprint('schools', __name__)


def generate_school_id():
    """Generate a unique 6-letter A-Z School ID."""
    for _ in range(100):
        school_id = "".join(random.choices(string.ascii_uppercase, k=6))
        existing = make_supabase_request(
            "GET", "schools", select="id", filters={"school_id": f"eq.{school_id}"}, use_service_role=True
        )
        if not existing or len(existing) == 0:
            return school_id
    raise ValueError("Could not generate unique school ID")


def subscription_days(subscription_type: str, subscription_months: int) -> int:
    """Return number of days for subscription: monthly=30, custom_months=N*30, term=90."""
    if subscription_type == "term":
        return 90
    if subscription_type == "custom_months":
        return max(1, min(12, subscription_months)) * 30
    return 30


def normalize_student_name(name: str, surname: str = "") -> str:
    """Normalized full name for uniqueness per school (lower, trimmed)."""
    full = f"{ (name or '').strip() } { (surname or '').strip() }".strip()
    return full.lower() if full else ""


@schools_bp.route("/schools")
@login_required
def schools_list():
    """Schools list page (admin)."""
    return render_template("schools/list.html", admin_user=request.admin_user)


@schools_bp.route("/schools/api/list")
@login_required
def api_schools_list():
    """GET list of all schools (JSON)."""
    try:
        rows = make_supabase_request(
            "GET", "schools", select="*", use_service_role=True
        )
        if not rows:
            return jsonify({"schools": []})

        # Get student count per school
        schools_out = []
        for s in rows:
            sid = s.get("id")
            students = make_supabase_request(
                "GET", "users_registration",
                select="id",
                filters={"school_id": f"eq.{sid}"},
                use_service_role=True
            )
            count = len(students) if students else 0
            schools_out.append({
                "id": sid,
                "school_id": s.get("school_id"),
                "name": s.get("name"),
                "phone": s.get("phone"),
                "email": s.get("email"),
                "address": s.get("address"),
                "contact_person": s.get("contact_person"),
                "subscription_type": s.get("subscription_type"),
                "subscription_months": s.get("subscription_months"),
                "subscription_started_at": s.get("subscription_started_at"),
                "subscription_expires_at": s.get("subscription_expires_at"),
                "created_at": s.get("created_at"),
                "student_count": count,
            })
        return jsonify({"schools": schools_out})
    except Exception as e:
        logger.error(f"Schools list error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/api/generate-id", methods=["POST"])
@login_required
def api_generate_school_id():
    """Generate a unique 6-letter School ID (for Add School form)."""
    try:
        school_id = generate_school_id()
        return jsonify({"success": True, "school_id": school_id})
    except Exception as e:
        logger.error(f"Generate school ID error: {e}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500


@schools_bp.route("/schools/api", methods=["POST"])
@login_required
def api_schools_create():
    """Create a new school."""
    try:
        data = request.get_json() or {}
        name = (data.get("name") or "").strip()
        school_id_raw = (data.get("school_id") or "").strip().upper()
        if not name:
            return jsonify({"success": False, "message": "School name is required"}), 400
        if len(school_id_raw) != 6 or not re.match(r"^[A-Z]{6}$", school_id_raw):
            return jsonify({"success": False, "message": "School ID must be exactly 6 letters (A-Z)"}), 400

        existing = make_supabase_request(
            "GET", "schools", select="id", filters={"school_id": f"eq.{school_id_raw}"}, use_service_role=True
        )
        if existing and len(existing) > 0:
            return jsonify({"success": False, "message": "This School ID is already in use"}), 400

        now = datetime.utcnow()
        subscription_type = (data.get("subscription_type") or "monthly").strip()
        subscription_months = int(data.get("subscription_months") or 1)
        days = subscription_days(subscription_type, subscription_months)
        started_at = now
        expires_at = now + timedelta(days=days)

        payload = {
            "school_id": school_id_raw,
            "name": name,
            "phone": (data.get("phone") or "").strip() or None,
            "email": (data.get("email") or "").strip() or None,
            "address": (data.get("address") or "").strip() or None,
            "contact_person": (data.get("contact_person") or "").strip() or None,
            "subscription_type": subscription_type,
            "subscription_months": subscription_months,
            "subscription_started_at": started_at.isoformat(),
            "subscription_expires_at": expires_at.isoformat(),
        }
        result = make_supabase_request("POST", "schools", payload, use_service_role=True)
        if not result:
            return jsonify({"success": False, "message": "Failed to create school"}), 500
        school = result[0] if isinstance(result, list) else result
        return jsonify({"success": True, "school": school, "id": school.get("id")})
    except Exception as e:
        logger.error(f"Create school error: {e}", exc_info=True)
        return jsonify({"success": False, "message": str(e)}), 500


@schools_bp.route("/schools/<int:school_pk>")
@login_required
def school_detail(school_pk):
    """School detail page (admin)."""
    return render_template("schools/detail.html", admin_user=request.admin_user, school_id=school_pk)


@schools_bp.route("/schools/<int:school_pk>/api")
@login_required
def api_school_detail(school_pk):
    """GET single school (JSON)."""
    try:
        rows = make_supabase_request(
            "GET", "schools", select="*", filters={"id": f"eq.{school_pk}"}, use_service_role=True
        )
        if not rows or len(rows) == 0:
            return jsonify({"error": "School not found"}), 404
        school = rows[0]
        students = make_supabase_request(
            "GET", "users_registration",
            select="id,chat_id,name,surname,student_level,subscription_expires_at,created_at",
            filters={"school_id": f"eq.{school_pk}"},
            use_service_role=True
        )
        school["student_count"] = len(students) if students else 0
        school["students"] = students or []
        return jsonify(school)
    except Exception as e:
        logger.error(f"School detail error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:school_pk>/api", methods=["PATCH"])
@login_required
def api_school_update(school_pk):
    """Update school (subscription, renew)."""
    try:
        data = request.get_json() or {}
        rows = make_supabase_request(
            "GET", "schools", select="*", filters={"id": f"eq.{school_pk}"}, use_service_role=True
        )
        if not rows or len(rows) == 0:
            return jsonify({"success": False, "message": "School not found"}), 404
        school = rows[0]

        renew = data.get("renew") is True
        if renew:
            now = datetime.utcnow()
            sub_type = school.get("subscription_type") or "monthly"
            sub_months = school.get("subscription_months") or 1
            days = subscription_days(sub_type, sub_months)
            started_at = now
            expires_at = now + timedelta(days=days)
            payload = {
                "subscription_started_at": started_at.isoformat(),
                "subscription_expires_at": expires_at.isoformat(),
            }
        else:
            sub_type = (data.get("subscription_type") or school.get("subscription_type") or "monthly").strip()
            sub_months = int(data.get("subscription_months") or school.get("subscription_months") or 1)
            started = school.get("subscription_started_at")
            if started:
                try:
                    if isinstance(started, str):
                        started_dt = datetime.fromisoformat(started.replace("Z", "+00:00"))
                    else:
                        started_dt = started
                except Exception:
                    started_dt = datetime.utcnow()
            else:
                started_dt = datetime.utcnow()
            days = subscription_days(sub_type, sub_months)
            expires_at = started_dt + timedelta(days=days)
            payload = {
                "subscription_type": sub_type,
                "subscription_months": sub_months,
                "subscription_expires_at": expires_at.isoformat(),
            }

        make_supabase_request("PATCH", "schools", payload, filters={"id": f"eq.{school_pk}"}, use_service_role=True)
        # Sync expiry to all students of this school
        make_supabase_request(
            "PATCH", "users_registration",
            {"subscription_expires_at": payload.get("subscription_expires_at")},
            filters={"school_id": f"eq.{school_pk}"},
            use_service_role=True
        )
        return jsonify({"success": True})
    except Exception as e:
        logger.error(f"Update school error: {e}", exc_info=True)
        return jsonify({"success": False, "message": str(e)}), 500


@schools_bp.route("/schools/<int:school_pk>/api/students", methods=["GET"])
@login_required
def api_school_students_list(school_pk):
    """List students for a school."""
    try:
        students = make_supabase_request(
            "GET", "users_registration",
            select="id,chat_id,name,surname,student_level,subscription_expires_at,created_at",
            filters={"school_id": f"eq.{school_pk}"},
            use_service_role=True
        )
        return jsonify({"students": students or []})
    except Exception as e:
        logger.error(f"List students error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:school_pk>/api/students", methods=["POST"])
@login_required
def api_school_students_add(school_pk):
    """Add a student to a school (create user_registration school_student)."""
    try:
        data = request.get_json() or {}
        full_name = (data.get("name") or data.get("full_name") or "").strip()
        level = (data.get("level") or data.get("student_level") or "").strip()

        if not full_name:
            return jsonify({"success": False, "message": "Student full name is required"}), 400

        rows = make_supabase_request(
            "GET", "schools", select="*", filters={"id": f"eq.{school_pk}"}, use_service_role=True
        )
        if not rows or len(rows) == 0:
            return jsonify({"success": False, "message": "School not found"}), 404
        school = rows[0]

        name_part = full_name
        surname_part = ""
        if " " in full_name:
            parts = full_name.split(None, 1)
            name_part = parts[0]
            surname_part = parts[1] if len(parts) > 1 else ""
        normalized = normalize_student_name(name_part, surname_part)
        if not normalized:
            return jsonify({"success": False, "message": "Invalid student name"}), 400

        existing_students = make_supabase_request(
            "GET", "users_registration",
            select="id,name,surname",
            filters={"school_id": f"eq.{school_pk}"},
            use_service_role=True
        )
        for ex in (existing_students or []):
            ex_normalized = normalize_student_name(ex.get("name", ""), ex.get("surname", ""))
            if ex_normalized == normalized:
                return jsonify({"success": False, "message": "A student with this name already exists in this school"}), 400

        slug = re.sub(r"[^a-z0-9]+", "_", normalized)[:80]
        chat_id = f"school_{school_pk}_{slug}"
        for i in range(100):
            if i > 0:
                chat_id = f"school_{school_pk}_{slug}_{i}"
            ur = get_user_registration(chat_id)
            if not ur:
                break
        else:
            return jsonify({"success": False, "message": "Could not generate unique student ID"}), 500

        nerdx_id = generate_nerdx_id()
        expires_at = school.get("subscription_expires_at")
        if expires_at and isinstance(expires_at, str):
            expires_at = expires_at
        elif expires_at:
            expires_at = expires_at.isoformat() if hasattr(expires_at, "isoformat") else str(expires_at)

        registration_data = {
            "chat_id": chat_id,
            "name": name_part,
            "surname": surname_part,
            "date_of_birth": "2000-01-01",
            "nerdx_id": nerdx_id,
            "user_type": "school_student",
            "school_id": school_pk,
            "student_level": level or None,
            "subscription_expires_at": expires_at,
            "registration_source": "school",
            "credits": 0,
            "welcome_bonus_claimed": True,
            "daily_credits_used": 0,
        }
        result = make_supabase_request("POST", "users_registration", registration_data, use_service_role=True)
        if not result:
            return jsonify({"success": False, "message": "Failed to create student"}), 500
        created = result[0] if isinstance(result, list) else result
        try:
            get_or_create_user_stats(chat_id, username=normalized, first_name=name_part)
        except Exception as e:
            logger.warning(f"User stats init for school student: {e}")
        return jsonify({"success": True, "student": created})
    except Exception as e:
        logger.error(f"Add student error: {e}", exc_info=True)
        return jsonify({"success": False, "message": str(e)}), 500
