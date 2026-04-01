"""
NerdX AI School Ecosystem v2.0 API
Neuronet AI Solutions (Pvt) Ltd

Handles: Group Schools, Sub-Schools, Academic Years, Forms, Classes,
         Subjects, Teachers, Students, Class-Subject assignments.
All endpoints prefixed with /api/v2/ (registered in routes.py).
"""
import logging
import re
import uuid
import hashlib
import random
import string
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import Blueprint, request, jsonify
from database.external_db import make_supabase_request

logger = logging.getLogger(__name__)

school_ecosystem_bp = Blueprint('school_ecosystem_v2', __name__)


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
        return dt
    except Exception:
        return None


def _generate_token():
    return uuid.uuid4().hex + uuid.uuid4().hex


def _generate_code(prefix, length=5):
    digits = ''.join(random.choices(string.digits, k=length))
    return f"{prefix}-{digits}"


def _hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


# ─── AUTH HELPERS ────────────────────────────────────────────────────────────────

def _get_school_from_portal_token(token):
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


def _get_teacher_from_token(token):
    if not token:
        return None
    sessions = make_supabase_request(
        "GET", "teacher_sessions",
        select="teacher_id,sub_school_id,expires_at",
        filters={"token": f"eq.{token}"},
        use_service_role=True
    )
    if not sessions:
        return None
    session = sessions[0]
    exp = _parse_utc(session.get("expires_at"))
    if not exp or exp < _now_utc():
        return None
    teachers = make_supabase_request(
        "GET", "school_teachers", select="*",
        filters={"id": f"eq.{session['teacher_id']}"},
        use_service_role=True
    )
    return teachers[0] if teachers else None


def school_admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        token = auth.replace("Bearer ", "") if auth.startswith("Bearer ") else None
        school = _get_school_from_portal_token(token)
        if not school:
            return jsonify({"error": "Unauthorized"}), 401
        request.school = school
        return f(*args, **kwargs)
    return wrapper


def teacher_auth_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        token = auth.replace("Bearer ", "") if auth.startswith("Bearer ") else None
        teacher = _get_teacher_from_token(token)
        if not teacher:
            return jsonify({"error": "Unauthorized"}), 401
        request.teacher = teacher
        return f(*args, **kwargs)
    return wrapper


# ═══════════════════════════════════════════════════════════════════════════════
# GROUP SCHOOLS
# ═══════════════════════════════════════════════════════════════════════════════

@school_ecosystem_bp.route("/group-schools", methods=["POST"])
def create_group_school():
    body = request.get_json(silent=True) or {}
    name = (body.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Group school name is required"}), 400

    group_id = name.upper().replace(" ", "_")[:20]
    existing = make_supabase_request(
        "GET", "group_schools", select="id",
        filters={"group_id": f"eq.{group_id}"},
        use_service_role=True
    )
    if existing:
        return jsonify({"error": "Group school already exists"}), 409

    result = make_supabase_request("POST", "group_schools", {
        "group_id": group_id,
        "name": name,
        "logo_url": body.get("logo_url"),
        "admin_email": body.get("admin_email"),
        "phone": body.get("phone"),
        "country": body.get("country", "Zimbabwe"),
    }, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to create group school"}), 500
    return jsonify({"success": True, "group_school": result[0]}), 201


@school_ecosystem_bp.route("/group-schools/<group_id>/sub-schools", methods=["GET"])
def list_group_sub_schools(group_id):
    schools = make_supabase_request(
        "GET", "schools", select="*",
        filters={"group_id": f"eq.{group_id}"},
        use_service_role=True
    ) or []

    for s in schools:
        students = make_supabase_request(
            "GET", "school_students", select="id",
            filters={"sub_school_id": f"eq.{s['school_id']}"},
            use_service_role=True
        ) or []
        teachers = make_supabase_request(
            "GET", "school_teachers", select="id",
            filters={"sub_school_id": f"eq.{s['school_id']}"},
            use_service_role=True
        ) or []
        s["student_count"] = len(students)
        s["teacher_count"] = len(teachers)

    return jsonify({"sub_schools": schools, "total": len(schools)})


# ═══════════════════════════════════════════════════════════════════════════════
# SUB-SCHOOLS
# ═══════════════════════════════════════════════════════════════════════════════

@school_ecosystem_bp.route("/sub-schools", methods=["POST"])
def create_sub_school():
    body = request.get_json(silent=True) or {}
    group_id = (body.get("group_id") or "").strip()
    name = (body.get("name") or "").strip()
    campus = (body.get("campus_name") or "").strip()
    location = (body.get("location") or "").strip()

    if not name:
        return jsonify({"error": "School name is required"}), 400

    school_id = ''.join(random.choices(string.ascii_uppercase, k=6))
    slug = re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')
    existing_slug = make_supabase_request("GET", "schools", select="id", filters={"slug": f"eq.{slug}"}, use_service_role=True)
    if existing_slug:
        slug = f"{slug}_{school_id.lower()}"
    login_url = f"/school/{slug}"

    parent_sub = {}
    if group_id:
        parent_rows = make_supabase_request("GET", "schools", select="subscription_type,subscription_months,subscription_started_at,subscription_expires_at", filters={"group_id": f"eq.{group_id}"}, use_service_role=True)
        if parent_rows:
            parent_sub = parent_rows[0]

    result = make_supabase_request("POST", "schools", {
        "school_id": school_id,
        "name": name,
        "slug": slug,
        "group_id": group_id or None,
        "campus_name": campus or None,
        "location": location or None,
        "city": body.get("city"),
        "unique_login_url": login_url,
        "email": body.get("email"),
        "phone": body.get("phone"),
        "contact_person": body.get("contact_person"),
        "address": body.get("address"),
        "subscription_type": parent_sub.get("subscription_type") or body.get("subscription_type", "term"),
        "subscription_months": parent_sub.get("subscription_months") or body.get("subscription_months", 3),
        "subscription_started_at": parent_sub.get("subscription_started_at"),
        "subscription_expires_at": parent_sub.get("subscription_expires_at"),
    }, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to create sub-school"}), 500
    return jsonify({"success": True, "sub_school": result[0], "school_id": school_id, "login_url": login_url}), 201


@school_ecosystem_bp.route("/sub-schools/<school_id>", methods=["GET"])
def get_sub_school(school_id):
    schools = make_supabase_request(
        "GET", "schools", select="*",
        filters={"school_id": f"eq.{school_id}"},
        use_service_role=True
    )
    if not schools:
        return jsonify({"error": "School not found"}), 404
    return jsonify(schools[0])


# ═══════════════════════════════════════════════════════════════════════════════
# ACADEMIC YEARS
# ═══════════════════════════════════════════════════════════════════════════════

@school_ecosystem_bp.route("/sub-schools/<school_id>/academic-years", methods=["POST"])
@school_admin_required
def create_academic_year(school_id):
    body = request.get_json(silent=True) or {}
    year_label = (body.get("year_label") or "").strip()
    if not year_label:
        return jsonify({"error": "year_label is required"}), 400

    result = make_supabase_request("POST", "academic_years", {
        "sub_school_id": school_id,
        "year_label": year_label,
        "is_active": body.get("is_active", True),
        "term_structure": body.get("term_structure", []),
        "start_date": body.get("start_date"),
        "end_date": body.get("end_date"),
    }, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to create academic year"}), 500
    return jsonify({"success": True, "academic_year": result[0]}), 201


@school_ecosystem_bp.route("/sub-schools/<school_id>/academic-years", methods=["GET"])
@school_admin_required
def list_academic_years(school_id):
    years = make_supabase_request(
        "GET", "academic_years", select="*",
        filters={"sub_school_id": f"eq.{school_id}"},
        use_service_role=True
    ) or []
    return jsonify({"academic_years": years})


# ═══════════════════════════════════════════════════════════════════════════════
# FORMS
# ═══════════════════════════════════════════════════════════════════════════════

@school_ecosystem_bp.route("/sub-schools/<school_id>/forms", methods=["POST"])
@school_admin_required
def create_form(school_id):
    body = request.get_json(silent=True) or {}
    form_number = body.get("form_number")
    academic_year_id = body.get("academic_year_id")

    if not form_number or not academic_year_id:
        return jsonify({"error": "form_number and academic_year_id are required"}), 400

    label = body.get("label", f"Form {form_number}")

    result = make_supabase_request("POST", "school_forms", {
        "sub_school_id": school_id,
        "academic_year_id": academic_year_id,
        "form_number": form_number,
        "label": label,
    }, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to create form"}), 500
    return jsonify({"success": True, "form": result[0]}), 201


@school_ecosystem_bp.route("/sub-schools/<school_id>/forms", methods=["GET"])
@school_admin_required
def list_forms(school_id):
    year_id = request.args.get("academic_year_id")
    filters = {"sub_school_id": f"eq.{school_id}"}
    if year_id:
        filters["academic_year_id"] = f"eq.{year_id}"

    forms = make_supabase_request(
        "GET", "school_forms", select="*",
        filters=filters,
        use_service_role=True
    ) or []
    return jsonify({"forms": sorted(forms, key=lambda f: f.get("form_number", 0))})


# ═══════════════════════════════════════════════════════════════════════════════
# CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@school_ecosystem_bp.route("/sub-schools/<school_id>/classes", methods=["POST"])
@school_admin_required
def create_class(school_id):
    body = request.get_json(silent=True) or {}
    form_id = body.get("form_id")
    class_name = (body.get("class_name") or "").strip()

    if not form_id or not class_name:
        return jsonify({"error": "form_id and class_name are required"}), 400

    forms = make_supabase_request(
        "GET", "school_forms", select="label",
        filters={"id": f"eq.{form_id}"},
        use_service_role=True
    )
    form_label = forms[0]["label"] if forms else "Form"
    display_name = f"{form_label} {class_name}"

    result = make_supabase_request("POST", "school_classes", {
        "form_id": form_id,
        "sub_school_id": school_id,
        "class_name": class_name,
        "display_name": display_name,
        "capacity": body.get("capacity", 40),
    }, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to create class"}), 500
    return jsonify({"success": True, "class": result[0]}), 201


@school_ecosystem_bp.route("/sub-schools/<school_id>/classes", methods=["GET"])
@school_admin_required
def list_classes(school_id):
    form_id = request.args.get("form_id")
    filters = {"sub_school_id": f"eq.{school_id}"}
    if form_id:
        filters["form_id"] = f"eq.{form_id}"

    classes = make_supabase_request(
        "GET", "school_classes", select="*",
        filters=filters,
        use_service_role=True
    ) or []
    return jsonify({"classes": classes})


@school_ecosystem_bp.route("/classes/<int:class_id>/students", methods=["GET"])
@school_admin_required
def list_class_students(class_id):
    students = make_supabase_request(
        "GET", "school_students", select="*",
        filters={"class_id": f"eq.{class_id}"},
        use_service_role=True
    ) or []
    return jsonify({"students": students, "total": len(students)})


@school_ecosystem_bp.route("/classes/<int:class_id>/subjects", methods=["GET"])
@school_admin_required
def list_class_subjects(class_id):
    cs_rows = make_supabase_request(
        "GET", "class_subjects", select="*",
        filters={"class_id": f"eq.{class_id}"},
        use_service_role=True
    ) or []

    enriched = []
    for cs in cs_rows:
        subject = None
        teacher = None
        if cs.get("subject_id"):
            subjects = make_supabase_request(
                "GET", "school_subjects", select="id,name,zimsec_code,is_compulsory",
                filters={"id": f"eq.{cs['subject_id']}"},
                use_service_role=True
            )
            subject = subjects[0] if subjects else None
        if cs.get("teacher_id"):
            teachers = make_supabase_request(
                "GET", "school_teachers", select="id,first_name,last_name,photo_url,login_code",
                filters={"id": f"eq.{cs['teacher_id']}"},
                use_service_role=True
            )
            teacher = teachers[0] if teachers else None
        enriched.append({**cs, "subject": subject, "teacher": teacher})

    return jsonify({"class_subjects": enriched})


# ═══════════════════════════════════════════════════════════════════════════════
# SUBJECTS
# ═══════════════════════════════════════════════════════════════════════════════

@school_ecosystem_bp.route("/sub-schools/<school_id>/subjects", methods=["POST"])
@school_admin_required
def create_subject(school_id):
    body = request.get_json(silent=True) or {}
    name = (body.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Subject name is required"}), 400

    result = make_supabase_request("POST", "school_subjects", {
        "sub_school_id": school_id,
        "form_id": body.get("form_id"),
        "name": name,
        "zimsec_code": body.get("zimsec_code"),
        "description": body.get("description"),
        "is_compulsory": body.get("is_compulsory", False),
    }, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to create subject"}), 500
    return jsonify({"success": True, "subject": result[0]}), 201


@school_ecosystem_bp.route("/sub-schools/<school_id>/subjects", methods=["GET"])
@school_admin_required
def list_subjects(school_id):
    form_id = request.args.get("form_id")
    filters = {"sub_school_id": f"eq.{school_id}"}
    if form_id:
        filters["form_id"] = f"eq.{form_id}"

    subjects = make_supabase_request(
        "GET", "school_subjects", select="*",
        filters=filters,
        use_service_role=True
    ) or []
    return jsonify({"subjects": subjects})


# ═══════════════════════════════════════════════════════════════════════════════
# TEACHERS
# ═══════════════════════════════════════════════════════════════════════════════

@school_ecosystem_bp.route("/sub-schools/<school_id>/teachers", methods=["POST"])
@school_admin_required
def register_teacher(school_id):
    body = request.get_json(silent=True) or {}
    first_name = (body.get("first_name") or "").strip()
    last_name = (body.get("last_name") or "").strip()

    if not first_name or not last_name:
        return jsonify({"error": "first_name and last_name are required"}), 400

    login_code = _generate_code("TCH")

    existing = make_supabase_request(
        "GET", "school_teachers", select="id",
        filters={"sub_school_id": f"eq.{school_id}", "login_code": f"eq.{login_code}"},
        use_service_role=True
    )
    while existing:
        login_code = _generate_code("TCH")
        existing = make_supabase_request(
            "GET", "school_teachers", select="id",
            filters={"sub_school_id": f"eq.{school_id}", "login_code": f"eq.{login_code}"},
            use_service_role=True
        )

    teacher_data = {
        "sub_school_id": school_id,
        "login_code": login_code,
        "first_name": first_name,
        "last_name": last_name,
        "email": body.get("email"),
        "phone": body.get("phone"),
        "national_id": body.get("national_id"),
        "photo_url": body.get("photo_url"),
        "specialisation": body.get("specialisation"),
        "qualification": body.get("qualification"),
        "bio": body.get("bio"),
    }

    if body.get("password"):
        teacher_data["password_hash"] = _hash_password(body["password"])

    result = make_supabase_request("POST", "school_teachers", teacher_data, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to register teacher"}), 500
    return jsonify({"success": True, "teacher": result[0], "login_code": login_code}), 201


@school_ecosystem_bp.route("/sub-schools/<school_id>/teachers", methods=["GET"])
@school_admin_required
def list_teachers(school_id):
    teachers = make_supabase_request(
        "GET", "school_teachers",
        select="id,sub_school_id,login_code,first_name,last_name,email,phone,photo_url,specialisation,qualification,status,created_at",
        filters={"sub_school_id": f"eq.{school_id}"},
        use_service_role=True
    ) or []
    return jsonify({"teachers": teachers, "total": len(teachers)})


@school_ecosystem_bp.route("/sub-schools/<school_id>/teachers/assign", methods=["POST"])
@school_admin_required
def assign_teacher(school_id):
    body = request.get_json(silent=True) or {}
    class_id = body.get("class_id")
    subject_id = body.get("subject_id")
    teacher_id = body.get("teacher_id")
    academic_year_id = body.get("academic_year_id")

    if not class_id or not subject_id or not teacher_id:
        return jsonify({"error": "class_id, subject_id, and teacher_id are required"}), 400

    cs_result = make_supabase_request("POST", "class_subjects", {
        "class_id": class_id,
        "subject_id": subject_id,
        "teacher_id": teacher_id,
        "academic_year_id": academic_year_id,
    }, use_service_role=True)

    if not cs_result:
        return jsonify({"error": "Failed to assign teacher"}), 500

    cs_id = cs_result[0]["id"]
    teacher = make_supabase_request(
        "GET", "school_teachers", select="first_name,last_name",
        filters={"id": f"eq.{teacher_id}"},
        use_service_role=True
    )
    subject = make_supabase_request(
        "GET", "school_subjects", select="name",
        filters={"id": f"eq.{subject_id}"},
        use_service_role=True
    )
    cls = make_supabase_request(
        "GET", "school_classes", select="display_name",
        filters={"id": f"eq.{class_id}"},
        use_service_role=True
    )

    t_name = f"{teacher[0]['first_name']} {teacher[0]['last_name']}" if teacher else "Teacher"
    s_name = subject[0]["name"] if subject else "Subject"
    c_name = cls[0]["display_name"] if cls else "Class"
    classroom_name = f"{t_name}'s {s_name} Classroom - {c_name}"

    make_supabase_request("POST", "ai_classrooms", {
        "class_subject_id": cs_id,
        "name": classroom_name,
        "is_active": True,
    }, use_service_role=True)

    return jsonify({"success": True, "class_subject": cs_result[0], "classroom_name": classroom_name}), 201


# ═══════════════════════════════════════════════════════════════════════════════
# TEACHER LOGIN
# ═══════════════════════════════════════════════════════════════════════════════

@school_ecosystem_bp.route("/teachers/login", methods=["POST"])
def teacher_login():
    body = request.get_json(silent=True) or {}
    school_id = (body.get("school_id") or "").strip().upper()
    login_code = (body.get("login_code") or "").strip().upper()

    if not school_id or not login_code:
        return jsonify({"error": "school_id and login_code are required"}), 400

    schools = make_supabase_request(
        "GET", "schools", select="school_id,name,slug,logo_url",
        filters={"school_id": f"eq.{school_id}"},
        use_service_role=True
    )
    if not schools:
        return jsonify({"error": "Invalid credentials"}), 401

    teachers = make_supabase_request(
        "GET", "school_teachers", select="*",
        filters={"sub_school_id": f"eq.{school_id}", "login_code": f"eq.{login_code}"},
        use_service_role=True
    )
    if not teachers:
        return jsonify({"error": "Invalid credentials"}), 401

    teacher = teachers[0]
    if teacher.get("status") != "active":
        return jsonify({"error": "Teacher account is not active"}), 403

    token = _generate_token()
    expires = _now_utc() + timedelta(days=7)
    make_supabase_request("POST", "teacher_sessions", {
        "teacher_id": teacher["id"],
        "sub_school_id": school_id,
        "token": token,
        "expires_at": expires.isoformat(),
    }, use_service_role=True)

    school = schools[0]
    return jsonify({
        "token": token,
        "teacher": {
            "id": teacher["id"],
            "login_code": teacher["login_code"],
            "first_name": teacher["first_name"],
            "last_name": teacher["last_name"],
            "email": teacher.get("email"),
            "phone": teacher.get("phone"),
            "photo_url": teacher.get("photo_url"),
            "specialisation": teacher.get("specialisation"),
        },
        "school": {
            "school_id": school["school_id"],
            "name": school["name"],
            "slug": school.get("slug"),
            "logo_url": school.get("logo_url"),
        }
    })


@school_ecosystem_bp.route("/teachers/me", methods=["GET"])
@teacher_auth_required
def teacher_me():
    t = request.teacher
    return jsonify({
        "id": t["id"],
        "login_code": t["login_code"],
        "first_name": t["first_name"],
        "last_name": t["last_name"],
        "email": t.get("email"),
        "phone": t.get("phone"),
        "photo_url": t.get("photo_url"),
        "specialisation": t.get("specialisation"),
        "qualification": t.get("qualification"),
        "bio": t.get("bio"),
        "sub_school_id": t["sub_school_id"],
    })


@school_ecosystem_bp.route("/teachers/my-classes", methods=["GET"])
@teacher_auth_required
def teacher_my_classes():
    teacher = request.teacher
    cs_rows = make_supabase_request(
        "GET", "class_subjects", select="*",
        filters={"teacher_id": f"eq.{teacher['id']}"},
        use_service_role=True
    ) or []

    classes = []
    for cs in cs_rows:
        subject = make_supabase_request(
            "GET", "school_subjects", select="id,name,zimsec_code",
            filters={"id": f"eq.{cs['subject_id']}"},
            use_service_role=True
        )
        cls = make_supabase_request(
            "GET", "school_classes", select="id,display_name,form_id",
            filters={"id": f"eq.{cs['class_id']}"},
            use_service_role=True
        )
        classroom = make_supabase_request(
            "GET", "ai_classrooms", select="id,name",
            filters={"class_subject_id": f"eq.{cs['id']}"},
            use_service_role=True
        )
        student_count = make_supabase_request(
            "GET", "school_students", select="id",
            filters={"class_id": f"eq.{cs['class_id']}"},
            use_service_role=True
        ) or []

        classes.append({
            "class_subject_id": cs["id"],
            "subject": subject[0] if subject else None,
            "class": cls[0] if cls else None,
            "classroom": classroom[0] if classroom else None,
            "student_count": len(student_count),
        })

    return jsonify({"classes": classes, "total": len(classes)})


@school_ecosystem_bp.route("/teachers/dashboard", methods=["GET"])
@teacher_auth_required
def teacher_dashboard():
    teacher = request.teacher
    school_id = teacher["sub_school_id"]

    school = make_supabase_request(
        "GET", "schools", select="school_id,name,slug,logo_url",
        filters={"school_id": f"eq.{school_id}"},
        use_service_role=True
    )

    cs_rows = make_supabase_request(
        "GET", "class_subjects", select="id,class_id,subject_id",
        filters={"teacher_id": f"eq.{teacher['id']}"},
        use_service_role=True
    ) or []

    classroom_ids = []
    for cs in cs_rows:
        cr = make_supabase_request(
            "GET", "ai_classrooms", select="id",
            filters={"class_subject_id": f"eq.{cs['id']}"},
            use_service_role=True
        )
        if cr:
            classroom_ids.append(cr[0]["id"])

    pending_submissions = 0
    upcoming_due = []
    for cid in classroom_ids:
        assessments = make_supabase_request(
            "GET", "assessments", select="id,title,due_date,is_released,results_released",
            filters={"classroom_id": f"eq.{cid}"},
            use_service_role=True
        ) or []
        for a in assessments:
            due = _parse_utc(a.get("due_date"))
            if due and due > _now_utc():
                upcoming_due.append({"title": a["title"], "due_date": a["due_date"], "assessment_id": a["id"]})
            if a.get("is_released") and not a.get("results_released"):
                subs = make_supabase_request(
                    "GET", "student_submissions", select="id",
                    filters={"assessment_id": f"eq.{a['id']}", "status": "eq.submitted"},
                    use_service_role=True
                ) or []
                pending_submissions += len(subs)

    upcoming_due.sort(key=lambda x: x["due_date"] or "")

    return jsonify({
        "teacher": {
            "id": teacher["id"],
            "first_name": teacher["first_name"],
            "last_name": teacher["last_name"],
            "photo_url": teacher.get("photo_url"),
            "specialisation": teacher.get("specialisation"),
        },
        "school": school[0] if school else None,
        "total_classes": len(cs_rows),
        "pending_submissions": pending_submissions,
        "upcoming_due": upcoming_due[:10],
    })


# ═══════════════════════════════════════════════════════════════════════════════
# STUDENTS
# ═══════════════════════════════════════════════════════════════════════════════

@school_ecosystem_bp.route("/sub-schools/<school_id>/students", methods=["POST"])
@school_admin_required
def register_student(school_id):
    body = request.get_json(silent=True) or {}
    first_name = (body.get("first_name") or "").strip()
    last_name = (body.get("last_name") or "").strip()
    class_id = body.get("class_id")
    dob = body.get("date_of_birth")

    if not first_name or not last_name or not class_id or not dob:
        return jsonify({"error": "first_name, last_name, class_id, and date_of_birth are required"}), 400

    student_code = _generate_code("STU")
    existing = make_supabase_request(
        "GET", "school_students", select="id",
        filters={"sub_school_id": f"eq.{school_id}", "student_code": f"eq.{student_code}"},
        use_service_role=True
    )
    while existing:
        student_code = _generate_code("STU")
        existing = make_supabase_request(
            "GET", "school_students", select="id",
            filters={"sub_school_id": f"eq.{school_id}", "student_code": f"eq.{student_code}"},
            use_service_role=True
        )

    student_data = {
        "sub_school_id": school_id,
        "class_id": class_id,
        "student_code": student_code,
        "first_name": first_name,
        "last_name": last_name,
        "date_of_birth": dob,
        "gender": body.get("gender"),
        "home_address": body.get("home_address"),
        "guardian_name": body.get("guardian_name"),
        "guardian_phone": body.get("guardian_phone"),
        "guardian_email": body.get("guardian_email"),
        "guardian_relationship": body.get("guardian_relationship"),
        "national_id": body.get("national_id"),
        "photo_url": body.get("photo_url"),
        "medical_notes": body.get("medical_notes"),
        "previous_school": body.get("previous_school"),
    }

    result = make_supabase_request("POST", "school_students", student_data, use_service_role=True)

    if not result:
        return jsonify({"error": "Failed to register student"}), 500
    return jsonify({"success": True, "student": result[0], "student_code": student_code}), 201


@school_ecosystem_bp.route("/sub-schools/<school_id>/students", methods=["GET"])
@school_admin_required
def list_students(school_id):
    class_id = request.args.get("class_id")
    form_id = request.args.get("form_id")
    search = request.args.get("search", "").strip().lower()

    filters = {"sub_school_id": f"eq.{school_id}"}
    if class_id:
        filters["class_id"] = f"eq.{class_id}"

    students = make_supabase_request(
        "GET", "school_students", select="*",
        filters=filters,
        use_service_role=True
    ) or []

    if form_id:
        class_ids = make_supabase_request(
            "GET", "school_classes", select="id",
            filters={"form_id": f"eq.{form_id}"},
            use_service_role=True
        ) or []
        valid_ids = {c["id"] for c in class_ids}
        students = [s for s in students if s.get("class_id") in valid_ids]

    if search:
        students = [s for s in students if
                    search in (s.get("first_name") or "").lower() or
                    search in (s.get("last_name") or "").lower() or
                    search in (s.get("student_code") or "").lower()]

    return jsonify({"students": students, "total": len(students)})


@school_ecosystem_bp.route("/students/<int:student_id>", methods=["GET"])
@school_admin_required
def get_student(student_id):
    students = make_supabase_request(
        "GET", "school_students", select="*",
        filters={"id": f"eq.{student_id}"},
        use_service_role=True
    )
    if not students:
        return jsonify({"error": "Student not found"}), 404

    student = students[0]
    cls = make_supabase_request(
        "GET", "school_classes", select="display_name,form_id",
        filters={"id": f"eq.{student['class_id']}"},
        use_service_role=True
    )

    return jsonify({
        "student": student,
        "class": cls[0] if cls else None,
    })


@school_ecosystem_bp.route("/students/<int:student_id>", methods=["PATCH"])
@school_admin_required
def update_student(student_id):
    body = request.get_json(silent=True) or {}
    allowed = ["first_name", "last_name", "date_of_birth", "gender", "home_address",
               "guardian_name", "guardian_phone", "guardian_email", "guardian_relationship",
               "national_id", "photo_url", "medical_notes", "previous_school", "status", "class_id"]

    updates = {k: v for k, v in body.items() if k in allowed and v is not None}
    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400

    updates["updated_at"] = _now_utc().isoformat()
    result = make_supabase_request(
        "PATCH", "school_students", updates,
        filters={"id": f"eq.{student_id}"},
        use_service_role=True
    )
    if result is None:
        return jsonify({"error": "Failed to update student"}), 500
    return jsonify({"success": True, "student": result[0] if result else None})


@school_ecosystem_bp.route("/students/<int:student_id>/transfer", methods=["POST"])
@school_admin_required
def transfer_student(student_id):
    body = request.get_json(silent=True) or {}
    new_class_id = body.get("new_class_id")
    if not new_class_id:
        return jsonify({"error": "new_class_id is required"}), 400

    result = make_supabase_request(
        "PATCH", "school_students",
        {"class_id": new_class_id, "updated_at": _now_utc().isoformat()},
        filters={"id": f"eq.{student_id}"},
        use_service_role=True
    )
    if result is None:
        return jsonify({"error": "Failed to transfer student"}), 500
    return jsonify({"success": True, "student": result[0] if result else None})


# ═══════════════════════════════════════════════════════════════════════════════
# STUDENT PERFORMANCE (teacher-facing analytics)
# ═══════════════════════════════════════════════════════════════════════════════

@school_ecosystem_bp.route("/students/<int:student_id>/performance/<int:subject_id>", methods=["GET"])
@teacher_auth_required
def student_performance(student_id, subject_id):
    perf = make_supabase_request(
        "GET", "student_performance", select="*",
        filters={"student_id": f"eq.{student_id}", "subject_id": f"eq.{subject_id}"},
        use_service_role=True
    ) or []

    submissions = make_supabase_request(
        "GET", "student_submissions",
        select="id,assessment_id,submitted_at,status,ai_score,ai_total,teacher_score,final_score,final_total",
        filters={"student_id": f"eq.{student_id}"},
        use_service_role=True
    ) or []

    overall_score = 0
    overall_total = 0
    for s in submissions:
        if s.get("final_score") is not None and s.get("final_total"):
            overall_score += float(s["final_score"])
            overall_total += float(s["final_total"])

    overall_accuracy = round((overall_score / overall_total * 100), 1) if overall_total > 0 else 0

    topics = []
    for p in perf:
        topics.append({
            "topic": p["topic_tag"],
            "accuracy": float(p.get("accuracy_pct", 0)),
            "attempts": p.get("total_attempts", 0),
            "trend": p.get("improvement_trend", "new"),
            "weak_areas": p.get("weak_areas_json", []),
        })

    weak_topics = [t for t in topics if t["accuracy"] < 60]
    strong_topics = [t for t in topics if t["accuracy"] >= 80]

    return jsonify({
        "overall_accuracy": overall_accuracy,
        "topics": sorted(topics, key=lambda t: t["accuracy"]),
        "weak_topics": weak_topics,
        "strong_topics": strong_topics,
        "assessment_history": submissions,
        "total_assessments": len(submissions),
    })
