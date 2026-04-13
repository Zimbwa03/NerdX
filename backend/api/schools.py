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

        slug = re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')
        existing_slug = make_supabase_request(
            "GET", "schools", select="id", filters={"slug": f"eq.{slug}"}, use_service_role=True
        )
        if existing_slug:
            slug = f"{slug}_{school_id_raw.lower()}"

        payload = {
            "school_id": school_id_raw,
            "name": name,
            "slug": slug,
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


# ─── SCHOOL FINANCE (Admin) ────────────────────────────────────────────────────

REVENUE_PER_STUDENT = 10.0
SCHOOL_SHARE_PERCENT = 0.30
NERDX_SHARE_PERCENT = 0.70


@schools_bp.route("/schools/<int:pk>/api/finance")
@login_required
def api_school_finance(pk):
    """Admin view: school financial summary."""
    try:
        schools = make_supabase_request(
            "GET", "schools", select="*",
            filters={"id": f"eq.{pk}"},
            use_service_role=True
        )
        if not schools:
            return jsonify({"error": "School not found"}), 404
        school = schools[0]
        sid = school["school_id"]

        students = make_supabase_request(
            "GET", "users_registration", select="id",
            filters={"school_id": f"eq.{pk}"},
            use_service_role=True
        ) or []
        num_students = len(students)

        total_revenue = num_students * REVENUE_PER_STUDENT
        school_earnings = total_revenue * SCHOOL_SHARE_PERCENT
        nerdx_share = total_revenue * NERDX_SHARE_PERCENT

        payments = make_supabase_request(
            "GET", "school_payments", select="*",
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
            "nerdx_share": nerdx_share,
            "total_paid": total_paid,
            "total_pending": total_pending,
            "amount_due": max(0, nerdx_share - total_paid),
            "payments": sorted(payments, key=lambda p: p.get("created_at", ""), reverse=True),
        })
    except Exception as e:
        logger.error(f"School finance error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/payments")
@login_required
def api_school_payments(pk):
    """Admin view: all payments from a school."""
    try:
        schools = make_supabase_request(
            "GET", "schools", select="school_id",
            filters={"id": f"eq.{pk}"},
            use_service_role=True
        )
        if not schools:
            return jsonify({"error": "School not found"}), 404

        payments = make_supabase_request(
            "GET", "school_payments", select="*",
            filters={"school_id": f"eq.{schools[0]['school_id']}"},
            use_service_role=True
        ) or []

        return jsonify({
            "payments": sorted(payments, key=lambda p: p.get("created_at", ""), reverse=True)
        })
    except Exception as e:
        logger.error(f"School payments error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/payments/<int:payment_id>", methods=["PATCH"])
@login_required
def api_school_verify_payment(pk, payment_id):
    """Admin: verify or reject a bank transfer payment."""
    try:
        schools = make_supabase_request(
            "GET", "schools", select="school_id",
            filters={"id": f"eq.{pk}"},
            use_service_role=True
        )
        if not schools:
            return jsonify({"error": "School not found"}), 404
        school_id = schools[0]["school_id"]

        body = request.get_json(silent=True) or {}
        new_status = body.get("status")
        admin_notes = body.get("admin_notes", "")

        if new_status not in ("verified", "rejected", "paid"):
            return jsonify({"error": "Status must be verified, rejected, or paid"}), 400

        patch_data = {
            "status": new_status,
            "admin_notes": admin_notes,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        if new_status == "verified":
            patch_data["verified_at"] = datetime.now(timezone.utc).isoformat()
            patch_data["verified_by"] = getattr(request, "admin_user", {}).get("username", "admin")

        result = make_supabase_request(
            "PATCH", "school_payments", patch_data,
            filters={"id": f"eq.{payment_id}", "school_id": f"eq.{school_id}"},
            use_service_role=True
        )
        if not result:
            return jsonify({"error": "Payment not found for this school"}), 404

        return jsonify({"success": True, "payment": result[0] if result else None})
    except Exception as e:
        logger.error(f"Payment verify error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


# ─── SCHOOL ECOSYSTEM (Admin Endpoints) ──────────────────────────────────────

def _get_school_code(pk):
    """Get the school_id (code like FN0XXN) from the DB PK."""
    rows = make_supabase_request("GET", "schools", select="school_id", filters={"id": f"eq.{pk}"}, use_service_role=True)
    if rows and len(rows) > 0:
        return rows[0].get("school_id")
    return None


def _get_school_full(pk):
    """Get full school row from DB PK."""
    rows = make_supabase_request("GET", "schools", select="*", filters={"id": f"eq.{pk}"}, use_service_role=True)
    return rows[0] if rows else None


def _resolve_school_code(pk):
    """Get school code, using ?code= query param override if present (for sub-school scoping)."""
    override = request.args.get("code")
    if override:
        return override.strip()
    return _get_school_code(pk)


# ─── GROUP SCHOOL MANAGEMENT ─────────────────────────────────────────────────

@schools_bp.route("/schools/<int:pk>/api/group-info", methods=["GET"])
@login_required
def api_school_group_info(pk):
    """Check if this school is a group parent and return group info + sub-schools."""
    try:
        school = _get_school_full(pk)
        if not school:
            return jsonify({"error": "School not found"}), 404

        school_code = school.get("school_id")
        group_id = school.get("group_id")

        group_school = None
        if group_id:
            gs_rows = make_supabase_request("GET", "group_schools", select="*", filters={"group_id": f"eq.{group_id}"}, use_service_role=True)
            group_school = gs_rows[0] if gs_rows else None

        sub_schools = []
        if group_id:
            sub_rows = make_supabase_request("GET", "schools", select="*", filters={"group_id": f"eq.{group_id}"}, use_service_role=True) or []
            for s in sub_rows:
                if s.get("id") == pk:
                    continue
                stu_count = len(make_supabase_request("GET", "school_students", select="id", filters={"sub_school_id": f"eq.{s.get('school_id')}"}, use_service_role=True) or [])
                tch_count = len(make_supabase_request("GET", "school_teachers", select="id", filters={"sub_school_id": f"eq.{s.get('school_id')}"}, use_service_role=True) or [])
                sub_schools.append({
                    "id": s.get("id"),
                    "school_id": s.get("school_id"),
                    "name": s.get("name"),
                    "slug": s.get("slug"),
                    "campus_name": s.get("campus_name"),
                    "location": s.get("location"),
                    "city": s.get("city"),
                    "phone": s.get("phone"),
                    "email": s.get("email"),
                    "contact_person": s.get("contact_person"),
                    "logo_url": s.get("logo_url"),
                    "created_at": s.get("created_at"),
                    "is_active": _school_subscription_status(s.get("subscription_expires_at"))[0],
                    "student_count": stu_count,
                    "teacher_count": tch_count,
                })

        return jsonify({
            "is_group": bool(group_id and group_school),
            "group_id": group_id,
            "group_school": group_school,
            "sub_schools": sub_schools,
            "total_sub_schools": len(sub_schools),
        })
    except Exception as e:
        logger.error(f"Group info error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/make-group", methods=["POST"])
@login_required
def api_school_make_group(pk):
    """Convert a school into a group school parent."""
    try:
        school = _get_school_full(pk)
        if not school:
            return jsonify({"error": "School not found"}), 404

        if school.get("group_id"):
            gs_rows = make_supabase_request("GET", "group_schools", select="*", filters={"group_id": f"eq.{school['group_id']}"}, use_service_role=True)
            if gs_rows:
                return jsonify({"success": True, "group_school": gs_rows[0], "message": "Already a group school"})

        group_id = "GRP-" + (school.get("school_id") or "".join(random.choices(string.ascii_uppercase, k=6)))

        gs_payload = {
            "group_id": group_id,
            "name": school.get("name"),
            "logo_url": school.get("logo_url"),
            "admin_email": school.get("email"),
            "phone": school.get("phone"),
            "country": "Zimbabwe",
        }
        gs_result = make_supabase_request("POST", "group_schools", gs_payload, use_service_role=True)
        gs_row = gs_result[0] if isinstance(gs_result, list) and gs_result else gs_result

        make_supabase_request("PATCH", "schools", {"group_id": group_id}, filters={"id": f"eq.{pk}"}, use_service_role=True)

        return jsonify({"success": True, "group_school": gs_row, "group_id": group_id})
    except Exception as e:
        logger.error(f"Make group error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/sub-schools", methods=["POST"])
@login_required
def api_school_add_sub_school(pk):
    """Add a new sub-school under this group."""
    try:
        school = _get_school_full(pk)
        if not school:
            return jsonify({"error": "School not found"}), 404

        group_id = school.get("group_id")
        if not group_id:
            return jsonify({"error": "This school is not a group school. Convert it first."}), 400

        data = request.get_json() or {}
        name = (data.get("name") or "").strip()
        if not name:
            return jsonify({"error": "School name is required"}), 400

        sub_school_id = generate_school_id()
        slug = re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')
        existing_slug = make_supabase_request("GET", "schools", select="id", filters={"slug": f"eq.{slug}"}, use_service_role=True)
        if existing_slug:
            slug = f"{slug}_{sub_school_id.lower()}"

        parent_expires = school.get("subscription_expires_at")

        sub_payload = {
            "school_id": sub_school_id,
            "name": name,
            "slug": slug,
            "group_id": group_id,
            "campus_name": (data.get("campus_name") or "").strip() or None,
            "location": (data.get("location") or "").strip() or None,
            "city": (data.get("city") or "").strip() or None,
            "phone": (data.get("phone") or "").strip() or None,
            "email": (data.get("email") or "").strip() or None,
            "contact_person": (data.get("contact_person") or "").strip() or None,
            "address": (data.get("address") or "").strip() or None,
            "subscription_type": school.get("subscription_type") or "term",
            "subscription_months": school.get("subscription_months") or 3,
            "subscription_started_at": school.get("subscription_started_at"),
            "subscription_expires_at": parent_expires,
        }
        result = make_supabase_request("POST", "schools", sub_payload, use_service_role=True)
        if not result:
            return jsonify({"error": "Failed to create sub-school"}), 500

        sub_school = result[0] if isinstance(result, list) else result
        return jsonify({
            "success": True,
            "sub_school": sub_school,
            "school_id": sub_school_id,
            "slug": slug,
        })
    except Exception as e:
        logger.error(f"Add sub-school error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/ecosystem", methods=["GET"])
@login_required
def api_school_ecosystem(pk):
    """Admin: get full ecosystem overview for a school (or a sub-school via ?code=XXX)."""
    try:
        school_code = _resolve_school_code(pk)
        if not school_code:
            return jsonify({"error": "School not found"}), 404

        academic_years = make_supabase_request("GET", "academic_years", select="*", filters={"sub_school_id": f"eq.{school_code}"}, use_service_role=True) or []
        forms = make_supabase_request("GET", "school_forms", select="*", filters={"sub_school_id": f"eq.{school_code}"}, use_service_role=True) or []
        classes = make_supabase_request("GET", "school_classes", select="*", filters={"sub_school_id": f"eq.{school_code}"}, use_service_role=True) or []
        subjects = make_supabase_request("GET", "school_subjects", select="*", filters={"sub_school_id": f"eq.{school_code}"}, use_service_role=True) or []
        teachers = make_supabase_request("GET", "school_teachers", select="*", filters={"sub_school_id": f"eq.{school_code}"}, use_service_role=True) or []
        students = make_supabase_request("GET", "school_students", select="*", filters={"sub_school_id": f"eq.{school_code}"}, use_service_role=True) or []

        class_ids = [c["id"] for c in classes if c.get("id")]
        class_subjects = []
        classrooms = []
        if class_ids:
            for cid in class_ids:
                cs_rows = make_supabase_request("GET", "class_subjects", select="*", filters={"class_id": f"eq.{cid}"}, use_service_role=True) or []
                class_subjects.extend(cs_rows)
            cs_ids = [cs["id"] for cs in class_subjects if cs.get("id")]
            for csid in cs_ids:
                cr_rows = make_supabase_request("GET", "ai_classrooms", select="*", filters={"class_subject_id": f"eq.{csid}"}, use_service_role=True) or []
                classrooms.extend(cr_rows)

        return jsonify({
            "school_code": school_code,
            "academic_years": academic_years,
            "forms": forms,
            "classes": classes,
            "subjects": subjects,
            "teachers": teachers,
            "students": students,
            "class_subjects": class_subjects,
            "classrooms": classrooms,
        })
    except Exception as e:
        logger.error(f"Ecosystem overview error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/ecosystem/academic-years", methods=["POST"])
@login_required
def api_eco_create_academic_year(pk):
    """Admin: create an academic year."""
    try:
        school_code = _resolve_school_code(pk)
        if not school_code:
            return jsonify({"error": "School not found"}), 404
        data = request.get_json() or {}
        year_label = (data.get("year_label") or "").strip()
        if not year_label:
            return jsonify({"error": "year_label is required"}), 400

        existing = make_supabase_request("GET", "academic_years", select="id", filters={"sub_school_id": f"eq.{school_code}", "year_label": f"eq.{year_label}"}, use_service_role=True)
        if existing:
            return jsonify({"error": "Academic year already exists"}), 400

        payload = {"sub_school_id": school_code, "year_label": year_label, "is_active": data.get("is_active", True)}
        result = make_supabase_request("POST", "academic_years", payload, use_service_role=True)
        row = result[0] if isinstance(result, list) and result else result
        return jsonify({"success": True, "academic_year": row})
    except Exception as e:
        logger.error(f"Create academic year error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/ecosystem/forms", methods=["POST"])
@login_required
def api_eco_create_form(pk):
    """Admin: create a form (grade level)."""
    try:
        school_code = _resolve_school_code(pk)
        if not school_code:
            return jsonify({"error": "School not found"}), 404
        data = request.get_json() or {}
        form_number = data.get("form_number")
        academic_year_id = data.get("academic_year_id")
        if not form_number or not academic_year_id:
            return jsonify({"error": "form_number and academic_year_id required"}), 400

        existing = make_supabase_request("GET", "school_forms", select="id", filters={"sub_school_id": f"eq.{school_code}", "form_number": f"eq.{form_number}", "academic_year_id": f"eq.{academic_year_id}"}, use_service_role=True)
        if existing:
            return jsonify({"error": f"Form {form_number} already exists for this academic year"}), 400

        payload = {
            "sub_school_id": school_code,
            "academic_year_id": academic_year_id,
            "form_number": int(form_number),
            "label": data.get("label") or f"Form {form_number}",
        }
        result = make_supabase_request("POST", "school_forms", payload, use_service_role=True)
        row = result[0] if isinstance(result, list) and result else result
        return jsonify({"success": True, "form": row})
    except Exception as e:
        logger.error(f"Create form error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/ecosystem/classes", methods=["POST"])
@login_required
def api_eco_create_class(pk):
    """Admin: create a class under a form."""
    try:
        school_code = _resolve_school_code(pk)
        if not school_code:
            return jsonify({"error": "School not found"}), 404
        data = request.get_json() or {}
        form_id = data.get("form_id")
        class_name = (data.get("class_name") or "").strip()
        if not form_id or not class_name:
            return jsonify({"error": "form_id and class_name required"}), 400

        form_rows = make_supabase_request("GET", "school_forms", select="form_number", filters={"id": f"eq.{form_id}"}, use_service_role=True)
        form_number = form_rows[0]["form_number"] if form_rows else "?"

        payload = {
            "sub_school_id": school_code,
            "form_id": int(form_id),
            "class_name": class_name,
            "display_name": f"Form {form_number} {class_name}",
            "capacity": int(data.get("capacity") or 40),
        }
        result = make_supabase_request("POST", "school_classes", payload, use_service_role=True)
        row = result[0] if isinstance(result, list) and result else result
        return jsonify({"success": True, "school_class": row})
    except Exception as e:
        logger.error(f"Create class error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/ecosystem/subjects", methods=["POST"])
@login_required
def api_eco_create_subject(pk):
    """Admin: create a subject."""
    try:
        school_code = _resolve_school_code(pk)
        if not school_code:
            return jsonify({"error": "School not found"}), 404
        data = request.get_json() or {}
        name = (data.get("name") or "").strip()
        if not name:
            return jsonify({"error": "name is required"}), 400

        payload = {
            "sub_school_id": school_code,
            "name": name,
            "form_id": data.get("form_id"),
            "zimsec_code": (data.get("zimsec_code") or "").strip() or None,
            "is_compulsory": data.get("is_compulsory", False),
            "description": (data.get("description") or "").strip() or None,
        }
        result = make_supabase_request("POST", "school_subjects", payload, use_service_role=True)
        row = result[0] if isinstance(result, list) and result else result
        return jsonify({"success": True, "subject": row})
    except Exception as e:
        logger.error(f"Create subject error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/ecosystem/teachers", methods=["POST"])
@login_required
def api_eco_register_teacher(pk):
    """Admin: register a teacher."""
    try:
        school_code = _resolve_school_code(pk)
        if not school_code:
            return jsonify({"error": "School not found"}), 404
        data = request.get_json() or {}
        first_name = (data.get("first_name") or "").strip()
        last_name = (data.get("last_name") or "").strip()
        if not first_name or not last_name:
            return jsonify({"error": "first_name and last_name required"}), 400

        login_code = "TCH-" + "".join(random.choices(string.digits, k=5))
        for _ in range(50):
            existing = make_supabase_request("GET", "school_teachers", select="id", filters={"login_code": f"eq.{login_code}", "sub_school_id": f"eq.{school_code}"}, use_service_role=True)
            if not existing:
                break
            login_code = "TCH-" + "".join(random.choices(string.digits, k=5))

        payload = {
            "sub_school_id": school_code,
            "first_name": first_name,
            "last_name": last_name,
            "login_code": login_code,
            "email": (data.get("email") or "").strip() or None,
            "phone": (data.get("phone") or "").strip() or None,
            "specialisation": (data.get("specialisation") or "").strip() or None,
            "status": "active",
        }
        result = make_supabase_request("POST", "school_teachers", payload, use_service_role=True)
        row = result[0] if isinstance(result, list) and result else result
        return jsonify({"success": True, "teacher": row})
    except Exception as e:
        logger.error(f"Register teacher error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/ecosystem/students-v2", methods=["POST"])
@login_required
def api_eco_register_student(pk):
    """Admin: register a student (v2 ecosystem)."""
    try:
        school_code = _resolve_school_code(pk)
        if not school_code:
            return jsonify({"error": "School not found"}), 404
        data = request.get_json() or {}
        first_name = (data.get("first_name") or "").strip()
        last_name = (data.get("last_name") or "").strip()
        class_id = data.get("class_id")
        dob = data.get("date_of_birth") or data.get("dob") or "2000-01-01"
        if not first_name or not last_name or not class_id:
            return jsonify({"error": "first_name, last_name, and class_id required"}), 400

        student_code = "STU-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
        for _ in range(50):
            existing = make_supabase_request("GET", "school_students", select="id", filters={"student_code": f"eq.{student_code}"}, use_service_role=True)
            if not existing:
                break
            student_code = "STU-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))

        payload = {
            "sub_school_id": school_code,
            "class_id": int(class_id),
            "first_name": first_name,
            "last_name": last_name,
            "student_code": student_code,
            "date_of_birth": dob,
            "gender": (data.get("gender") or "").strip() or None,
            "guardian_name": (data.get("guardian_name") or "").strip() or None,
            "guardian_phone": (data.get("guardian_phone") or "").strip() or None,
            "status": "active",
        }
        result = make_supabase_request("POST", "school_students", payload, use_service_role=True)
        row = result[0] if isinstance(result, list) and result else result
        return jsonify({"success": True, "student": row})
    except Exception as e:
        logger.error(f"Register student v2 error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/ecosystem/assign-teacher", methods=["POST"])
@login_required
def api_eco_assign_teacher(pk):
    """Admin: assign a teacher to a class+subject combination."""
    try:
        school_code = _resolve_school_code(pk)
        if not school_code:
            return jsonify({"error": "School not found"}), 404
        data = request.get_json() or {}
        class_id = data.get("class_id")
        subject_id = data.get("subject_id")
        teacher_id = data.get("teacher_id")
        academic_year_id = data.get("academic_year_id")
        if not class_id or not subject_id or not teacher_id:
            return jsonify({"error": "class_id, subject_id, teacher_id required"}), 400

        cs_payload = {
            "class_id": int(class_id),
            "subject_id": int(subject_id),
            "teacher_id": int(teacher_id),
            "academic_year_id": int(academic_year_id) if academic_year_id else None,
        }
        cs_result = make_supabase_request("POST", "class_subjects", cs_payload, use_service_role=True)
        cs_row = cs_result[0] if isinstance(cs_result, list) and cs_result else cs_result

        teacher_rows = make_supabase_request("GET", "school_teachers", select="first_name,last_name", filters={"id": f"eq.{teacher_id}"}, use_service_role=True)
        teacher_name = f"{teacher_rows[0]['first_name']} {teacher_rows[0]['last_name']}" if teacher_rows else "Teacher"
        subject_rows = make_supabase_request("GET", "school_subjects", select="name", filters={"id": f"eq.{subject_id}"}, use_service_role=True)
        subject_name = subject_rows[0]["name"] if subject_rows else "Subject"

        classroom_name = f"{teacher_name}'s {subject_name} Classroom"
        cs_id = cs_row.get("id") if isinstance(cs_row, dict) else None
        if cs_id:
            cr_payload = {"class_subject_id": cs_id, "name": classroom_name, "is_active": True}
            make_supabase_request("POST", "ai_classrooms", cr_payload, use_service_role=True)

        return jsonify({"success": True, "class_subject": cs_row, "classroom_name": classroom_name})
    except Exception as e:
        logger.error(f"Assign teacher error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@schools_bp.route("/schools/<int:pk>/api/logo", methods=["POST"])
@login_required
def api_school_upload_logo(pk):
    """Admin: upload/update school logo (base64 data URL)."""
    try:
        body = request.get_json(silent=True) or {}
        logo_data = body.get("logo_url", "")

        if not logo_data:
            return jsonify({"error": "Logo image data is required"}), 400

        result = make_supabase_request(
            "PATCH", "schools", {"logo_url": logo_data},
            filters={"id": f"eq.{pk}"},
            use_service_role=True
        )

        if result:
            return jsonify({"success": True, "logo_url": result[0].get("logo_url")})
        return jsonify({"error": "School not found"}), 404
    except Exception as e:
        logger.error(f"Logo upload error: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
