"""
Schools Management API for NerdX Admin Dashboard
CRUD for schools, school ID generation, subscription, students, and AI chat assistant.
"""
import logging
import random
import string
import re
import json
import base64
from datetime import datetime, timedelta, timezone
from flask import Blueprint, render_template, request, jsonify
from api.auth import login_required
from database.external_db import (
    make_supabase_request,
    generate_nerdx_id,
    get_user_registration,
    get_or_create_user_stats,
)
from services.vertex_service import vertex_service

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


def _parse_utc_datetime(value):
    """Parse datetime value to naive UTC datetime."""
    if value is None:
        return None
    try:
        dt = datetime.fromisoformat(str(value).replace("Z", "+00:00")) if isinstance(value, str) else value
        if dt is None:
            return None
        if getattr(dt, "tzinfo", None):
            dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
        return dt
    except Exception:
        return None


def _school_subscription_status(expires_at):
    """Return (is_active, status_label) for school subscription."""
    exp_dt = _parse_utc_datetime(expires_at)
    if not exp_dt:
        return False, "Expired"
    return (exp_dt >= datetime.utcnow(), "Paid" if exp_dt >= datetime.utcnow() else "Expired")


def normalize_student_name(name: str, surname: str = "") -> str:
    """Normalized full name for uniqueness per school (lower, trimmed)."""
    full = f"{ (name or '').strip() } { (surname or '').strip() }".strip()
    return full.lower() if full else ""


def split_full_name(full_name: str):
    """Split full name into first name + surname."""
    cleaned = " ".join((full_name or "").strip().split())
    if not cleaned:
        return "", ""
    if " " not in cleaned:
        return cleaned, ""
    parts = cleaned.split(None, 1)
    return parts[0], parts[1] if len(parts) > 1 else ""


def full_name_from_row(student_row):
    """Build a full name string from a users_registration row."""
    return f"{(student_row.get('name') or '').strip()} {(student_row.get('surname') or '').strip()}".strip()


def _list_school_students(school_pk, select="id,name,surname,student_level,subscription_expires_at"):
    """Read all students for a school."""
    return make_supabase_request(
        "GET", "users_registration",
        select=select,
        filters={"school_id": f"eq.{school_pk}"},
        use_service_role=True
    ) or []


def _resolve_student_target(school_pk, student_id=None, student_name=None):
    """Resolve a school student by id or name. Returns (student_row_or_none, error_message_or_none)."""
    students = _list_school_students(
        school_pk,
        select="id,name,surname,student_level,school_id"
    )
    if not students:
        return None, "Student not found in this school"

    if student_id is not None:
        try:
            sid = int(student_id)
        except (TypeError, ValueError):
            return None, "Invalid student ID"
        for s in students:
            try:
                if int(s.get("id")) == sid:
                    return s, None
            except (TypeError, ValueError):
                continue
        return None, "Student not found in this school"

    target_name = " ".join((student_name or "").strip().split())
    target_norm = normalize_student_name(target_name)
    if not target_norm:
        return None, "Student name is required"

    exact = []
    partial = []
    for s in students:
        norm = normalize_student_name(s.get("name", ""), s.get("surname", ""))
        if norm == target_norm:
            exact.append(s)
        elif target_norm in norm or norm in target_norm:
            partial.append(s)

    if len(exact) == 1:
        return exact[0], None
    if len(exact) > 1:
        names = ", ".join(full_name_from_row(x) for x in exact[:5])
        return None, f"Multiple students matched '{target_name}': {names}"
    if len(partial) == 1:
        return partial[0], None
    if len(partial) > 1:
        names = ", ".join(full_name_from_row(x) for x in partial[:5])
        return None, f"Multiple students matched '{target_name}': {names}"
    return None, f"Student '{target_name}' not found in this school"


def _delete_student_from_school(school_pk, student_id=None, student_name=None):
    """Delete a student by id or name."""
    student, error = _resolve_student_target(school_pk, student_id=student_id, student_name=student_name)
    if not student:
        return False, error, None

    make_supabase_request(
        "DELETE", "users_registration",
        filters={"id": f"eq.{student.get('id')}", "school_id": f"eq.{school_pk}"},
        use_service_role=True
    )
    return True, f"Removed {full_name_from_row(student)}", student


def _update_student_in_school(
    school_pk,
    student_id=None,
    old_name=None,
    new_name=None,
    new_level=None,
    level_provided=False,
):
    """Update a student by id or old name."""
    student, error = _resolve_student_target(school_pk, student_id=student_id, student_name=old_name)
    if not student:
        return False, error, None

    patch = {}
    if new_name is not None:
        first_name, surname = split_full_name(new_name)
        if not first_name:
            return False, "New name is required", None
        normalized = normalize_student_name(first_name, surname)
        existing_students = _list_school_students(school_pk, select="id,name,surname")
        for ex in existing_students:
            try:
                if int(ex.get("id")) == int(student.get("id")):
                    continue
            except (TypeError, ValueError):
                continue
            if normalize_student_name(ex.get("name", ""), ex.get("surname", "")) == normalized:
                duplicate_name = f"{first_name} {surname}".strip()
                return False, f"'{duplicate_name}' already exists in this school", None
        patch["name"] = first_name
        patch["surname"] = surname

    if level_provided:
        patch["student_level"] = " ".join((new_level or "").strip().split()) or None

    if not patch:
        return False, "Nothing to update", None

    make_supabase_request(
        "PATCH", "users_registration", patch,
        filters={"id": f"eq.{student.get('id')}", "school_id": f"eq.{school_pk}"},
        use_service_role=True
    )

    updated = dict(student)
    updated.update(patch)
    return True, "Student updated", updated


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
            is_active, status_label = _school_subscription_status(s.get("subscription_expires_at"))
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
                "subscription_status": status_label,
                "is_active": is_active,
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
        is_active, status_label = _school_subscription_status(school.get("subscription_expires_at"))
        school["student_count"] = len(students) if students else 0
        school["students"] = students or []
        school["subscription_status"] = status_label
        school["is_active"] = is_active
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


def _add_student_to_school(school_pk, full_name, level=""):
    """Shared helper: add a single student to a school.
    Returns (success: bool, message: str, student_record_or_None).
    """
    full_name = (full_name or "").strip()
    level = (level or "").strip()

    if not full_name:
        return False, "Student full name is required", None

    rows = make_supabase_request(
        "GET", "schools", select="*", filters={"id": f"eq.{school_pk}"}, use_service_role=True
    )
    if not rows or len(rows) == 0:
        return False, "School not found", None
    school = rows[0]

    name_part, surname_part = split_full_name(full_name)
    normalized = normalize_student_name(name_part, surname_part)
    if not normalized:
        return False, "Invalid student name", None

    existing_students = make_supabase_request(
        "GET", "users_registration",
        select="id,name,surname",
        filters={"school_id": f"eq.{school_pk}"},
        use_service_role=True
    )
    for ex in (existing_students or []):
        ex_normalized = normalize_student_name(ex.get("name", ""), ex.get("surname", ""))
        if ex_normalized == normalized:
            return False, f"'{full_name}' already exists in this school", None

    slug = re.sub(r"[^a-z0-9]+", "_", normalized)[:80]
    chat_id = f"school_{school_pk}_{slug}"
    for i in range(100):
        if i > 0:
            chat_id = f"school_{school_pk}_{slug}_{i}"
        ur = get_user_registration(chat_id)
        if not ur:
            break
    else:
        return False, "Could not generate unique student ID", None

    nerdx_id = generate_nerdx_id()
    expires_at = school.get("subscription_expires_at")
    if expires_at and isinstance(expires_at, str):
        pass
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
        "role": "student",
        "registration_date": datetime.utcnow().isoformat(),
    }
    result = make_supabase_request("POST", "users_registration", registration_data, use_service_role=True)
    if not result:
        return False, "Failed to create student record", None
    created = result[0] if isinstance(result, list) else result
    try:
        get_or_create_user_stats(chat_id, username=normalized, first_name=name_part)
    except Exception as e:
        logger.warning(f"User stats init for school student: {e}")
    return True, "Student added", created


@schools_bp.route("/schools/<int:school_pk>/api/students", methods=["POST"])
@login_required
def api_school_students_add(school_pk):
    """Add a student to a school (create user_registration school_student)."""
    try:
        data = request.get_json() or {}
        full_name = (data.get("name") or data.get("full_name") or "").strip()
        level = (data.get("level") or data.get("student_level") or "").strip()
        ok, msg, student = _add_student_to_school(school_pk, full_name, level)
        if not ok:
            return jsonify({"success": False, "message": msg}), 400
        return jsonify({"success": True, "student": student})
    except Exception as e:
        logger.error(f"Add student error: {e}", exc_info=True)
        return jsonify({"success": False, "message": str(e)}), 500


# ── Delete student ───────────────────────────────────────────────────────────
@schools_bp.route("/schools/<int:school_pk>/api/students/<int:student_id>", methods=["DELETE"])
@login_required
def api_school_student_delete(school_pk, student_id):
    """Remove a student from a school."""
    try:
        ok, message, student = _delete_student_from_school(school_pk, student_id=student_id)
        if not ok:
            return jsonify({"success": False, "message": message}), 404
        return jsonify({"success": True, "message": message, "student": student})
    except Exception as e:
        logger.error(f"Delete student error: {e}", exc_info=True)
        return jsonify({"success": False, "message": str(e)}), 500


# ── Edit student ─────────────────────────────────────────────────────────────
@schools_bp.route("/schools/<int:school_pk>/api/students/<int:student_id>", methods=["PATCH"])
@login_required
def api_school_student_edit(school_pk, student_id):
    """Edit student name or level."""
    try:
        data = request.get_json() or {}
        new_name = data["name"] if "name" in data else data.get("new_name")
        level_provided = ("level" in data) or ("student_level" in data) or ("new_level" in data)
        new_level = data.get("new_level", data.get("level", data.get("student_level")))
        ok, message, student = _update_student_in_school(
            school_pk,
            student_id=student_id,
            new_name=new_name,
            new_level=new_level,
            level_provided=level_provided,
        )
        if not ok:
            status = 404 if "not found" in message.lower() else 400
            return jsonify({"success": False, "message": message}), status
        return jsonify({"success": True, "message": message, "student": student})
    except Exception as e:
        logger.error(f"Edit student error: {e}", exc_info=True)
        return jsonify({"success": False, "message": str(e)}), 500


# ── AI Chat Assistant for Student Management ─────────────────────────────────

AI_SYSTEM_PROMPT = """You are an AI assistant for school administrators in NerdX.
You manage school students from chat commands and student-list images.

Current school id: {school_id}

Current students in this school:
{students_list}

Behavior rules:
1. If an image is provided, extract all visible student names and levels.
2. Do not add, remove, or edit students until the admin clearly confirms an action.
3. If you extracted students and are waiting for confirmation, include a pending JSON block:
```pending
{{"pending_students":[{{"name":"Full Name","level":"Form 4"}}]}}
```
4. When the admin confirms an operation, include exactly one action JSON block:
```action
{{"action":"add_students","students":[{{"name":"Full Name","level":"Form 4"}}]}}
```
```action
{{"action":"remove_student","name":"Full Name"}}
```
```action
{{"action":"edit_student","old_name":"Old Full Name","new_name":"New Full Name","level":"Form 4"}}
```
5. You may use student_id for remove or edit when available:
{{"action":"remove_student","student_id":123,"name":"Full Name"}}
{{"action":"edit_student","student_id":123,"new_name":"New Full Name","level":"Form 4"}}
6. Always include a concise human reply above any JSON block.
"""


def _decode_base64_image(data_url_or_b64):
    """Decode base64 image data (raw base64 or data URL)."""
    value = (data_url_or_b64 or "").strip()
    if not value:
        return None
    if "base64," in value:
        value = value.split("base64,", 1)[1]
    value = value.replace("\n", "").replace("\r", "").replace(" ", "")
    pad_len = (-len(value)) % 4
    if pad_len:
        value += "=" * pad_len
    try:
        return base64.b64decode(value, validate=True)
    except Exception:
        try:
            return base64.b64decode(value)
        except Exception:
            return None


def _extract_json_fence(text, fence_name):
    """Extract first JSON payload from a fenced block, e.g. ```action ...```."""
    if not text:
        return None
    pattern = rf"```{re.escape(fence_name)}\s*(.*?)```"
    for match in re.finditer(pattern, text, flags=re.IGNORECASE | re.DOTALL):
        payload = (match.group(1) or "").strip()
        if not payload:
            continue
        try:
            return json.loads(payload)
        except json.JSONDecodeError:
            continue
    return None


def _parse_action_block(text):
    """Extract a JSON action block from AI response text."""
    obj = _extract_json_fence(text, "action")
    if isinstance(obj, dict) and obj.get("action"):
        return obj

    # Fallback if the model uses a generic json block.
    obj = _extract_json_fence(text, "json")
    if isinstance(obj, dict) and obj.get("action"):
        return obj
    return None


def _parse_pending_students(text):
    """Extract pending students from ```pending``` or fallback JSON blocks."""
    payload = _extract_json_fence(text, "pending")
    if payload is None:
        payload = _extract_json_fence(text, "students")

    students = []
    if isinstance(payload, dict):
        students = payload.get("pending_students") or payload.get("students") or []
    elif isinstance(payload, list):
        students = payload

    out = []
    for s in students:
        if not isinstance(s, dict):
            continue
        name = " ".join((s.get("name") or "").strip().split())
        level = " ".join((s.get("level") or "").strip().split())
        if name:
            out.append({"name": name, "level": level})
    return out


def _strip_control_blocks(text):
    """Remove JSON control fences from assistant text."""
    if not text:
        return ""
    text = re.sub(r"```action\s*.*?```", "", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"```pending\s*.*?```", "", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"```students\s*.*?```", "", text, flags=re.IGNORECASE | re.DOTALL)
    return text.strip()


def _execute_action(action, school_pk):
    """Execute a parsed action block against the database."""
    results = []
    act = (action.get("action") or "").strip()

    if act == "add_students":
        students = action.get("students", [])
        if not isinstance(students, list):
            students = []
        for s in students:
            if not isinstance(s, dict):
                continue
            name = " ".join((s.get("name") or "").strip().split())
            level = " ".join((s.get("level") or "").strip().split())
            if not name:
                continue
            ok, msg, created = _add_student_to_school(school_pk, name, level)
            results.append({
                "action": "add_student",
                "success": ok,
                "name": name,
                "student_id": created.get("id") if isinstance(created, dict) else None,
                "message": msg,
            })

    elif act == "remove_student":
        student_id = action.get("student_id")
        student_name = action.get("name") or action.get("full_name") or ""
        ok, msg, removed = _delete_student_from_school(
            school_pk,
            student_id=student_id,
            student_name=student_name,
        )
        results.append({
            "action": "remove_student",
            "success": ok,
            "name": full_name_from_row(removed) if removed else student_name,
            "student_id": removed.get("id") if isinstance(removed, dict) else student_id,
            "message": msg,
        })

    elif act == "edit_student":
        student_id = action.get("student_id")
        old_name = action.get("old_name") or action.get("current_name")
        new_name = action.get("new_name")
        if new_name is None and ("name" in action) and (student_id is not None):
            new_name = action.get("name")
        if new_name is None and ("name" in action) and not old_name:
            old_name = action.get("name")
        level_provided = ("level" in action) or ("new_level" in action) or ("student_level" in action)
        new_level = action.get("new_level", action.get("level", action.get("student_level")))
        ok, msg, updated = _update_student_in_school(
            school_pk,
            student_id=student_id,
            old_name=old_name,
            new_name=new_name,
            new_level=new_level,
            level_provided=level_provided,
        )
        results.append({
            "action": "edit_student",
            "success": ok,
            "name": full_name_from_row(updated) if updated else (new_name or old_name or ""),
            "student_id": updated.get("id") if isinstance(updated, dict) else student_id,
            "message": msg,
        })

    else:
        results.append({
            "action": act or "unknown",
            "success": False,
            "message": "Unsupported action",
        })

    return results


@schools_bp.route("/schools/<int:school_pk>/api/ai-chat", methods=["POST"])
@login_required
def api_school_ai_chat(school_pk):
    """AI chat endpoint for student management using Vertex AI."""
    try:
        data = request.get_json() or {}
        user_message = " ".join((data.get("message") or "").strip().split())
        image_b64 = data.get("image")
        mime_type = (data.get("mime_type") or "image/png").strip() or "image/png"
        history = data.get("history", [])
        if not isinstance(history, list):
            history = []

        if not user_message and not image_b64:
            return jsonify({
                "success": False,
                "reply": "",
                "message": "Please send a message or an image.",
                "actions_taken": [],
                "pending_students": [],
            }), 400

        if not vertex_service.is_available() or not getattr(vertex_service, "client", None):
            return jsonify({
                "success": False,
                "reply": "",
                "message": "Vertex AI service is unavailable.",
                "actions_taken": [],
                "pending_students": [],
            }), 503

        students = _list_school_students(
            school_pk,
            select="id,name,surname,student_level,subscription_expires_at"
        )
        if students:
            students_text = "".join(
                f'  - ID={s.get("id")}, Name="{full_name_from_row(s)}", Level="{s.get("student_level") or "N/A"}"\n'
                for s in students
            )
        else:
            students_text = "  (no students yet)\n"

        system_prompt = AI_SYSTEM_PROMPT.format(
            school_id=school_pk,
            students_list=students_text
        )

        history_lines = []
        for msg in history[-12:]:
            if not isinstance(msg, dict):
                continue
            role = (msg.get("role") or "user").strip().lower()
            role = "assistant" if role.startswith("assist") else "user"
            text = " ".join((msg.get("text") or "").strip().split())
            if not text:
                continue
            history_lines.append(f"{role}: {text}")

        conversation_prompt = system_prompt
        if history_lines:
            conversation_prompt += "\n\nConversation history:\n" + "\n".join(history_lines)
        if user_message:
            conversation_prompt += f"\n\nLatest admin message:\nuser: {user_message}"
        elif image_b64:
            conversation_prompt += (
                "\n\nLatest admin message:\n"
                "user: [uploaded an image; extract visible student names and levels]"
            )

        contents = [conversation_prompt]
        if image_b64:
            from google.genai.types import Part

            image_bytes = _decode_base64_image(image_b64)
            if image_bytes is None:
                return jsonify({
                    "success": False,
                    "reply": "",
                    "message": "Invalid image data.",
                    "actions_taken": [],
                    "pending_students": [],
                }), 400
            contents = [Part.from_bytes(data=image_bytes, mime_type=mime_type), conversation_prompt]

        response = vertex_service.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
        )

        ai_text = ""
        if response and getattr(response, "text", None):
            ai_text = response.text.strip()
        if not ai_text:
            ai_text = "I could not process that. Please try again."

        pending_students = _parse_pending_students(ai_text)
        action = _parse_action_block(ai_text)
        action_results = _execute_action(action, school_pk) if action else []

        display_text = _strip_control_blocks(ai_text)
        if action_results:
            result_lines = []
            for item in action_results:
                status_icon = "OK" if item.get("success") else "Failed"
                result_lines.append(f"- {status_icon}: {item.get('message')}")
            suffix = "\n".join(result_lines)
            display_text = (display_text + "\n\nResults:\n" + suffix).strip()

        if not display_text:
            display_text = "Done."

        return jsonify({
            "success": True,
            "reply": display_text,
            "actions_taken": action_results,
            "pending_students": pending_students,
        })

    except Exception as e:
        logger.error(f"AI chat error: {e}", exc_info=True)
        return jsonify({
            "success": False,
            "reply": "",
            "message": f"AI error: {str(e)}",
            "actions_taken": [],
            "pending_students": [],
        }), 500
