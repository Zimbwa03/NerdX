"""
Portal scope for schools that belong to a group (e.g. Herentals head office + campuses).

users_registration.school_id references schools.id (DB PK). Payments and activity rows use
the human-readable schools.school_id string. Head-office rows often have zero direct learners;
learners sit on campus rows — aggregate with portal_network_scope().
"""
from __future__ import annotations

from typing import Any, Dict, List, Tuple

from database.external_db import make_supabase_request


def _in_filter_csv(values) -> str:
    parts = []
    for v in values:
        s = str(v).strip()
        if not s or "," in s:
            continue
        parts.append(s)
    return ",".join(parts)


def _chunks(seq: List, size: int):
    for i in range(0, len(seq), size):
        yield seq[i : i + size]


def portal_network_scope(school_row: Dict[str, Any]) -> Tuple[List[Any], List[str]]:
    """
    Returns (db_school_ids for users_registration FK, payment/activity school_id codes).
    """
    gid = (school_row.get("group_id") or "").strip()
    if not gid:
        sid = school_row.get("id")
        code = school_row.get("school_id")
        db = [sid] if sid is not None else []
        codes = [str(code)] if code is not None and str(code).strip() else []
        return db, codes

    members = (
        make_supabase_request(
            "GET",
            "schools",
            select="id,school_id",
            filters={"group_id": f"eq.{gid}"},
            use_service_role=True,
        )
        or []
    )
    db_ids = [m["id"] for m in members if m.get("id") is not None]
    codes = [str(m["school_id"]) for m in members if m.get("school_id")]

    if school_row.get("id") is not None and school_row["id"] not in db_ids:
        db_ids.append(school_row["id"])
    sc = school_row.get("school_id")
    if sc is not None and str(sc) not in codes:
        codes.append(str(sc))

    if not db_ids and school_row.get("id") is not None:
        db_ids = [school_row["id"]]
    if not codes and school_row.get("school_id") is not None:
        codes = [str(school_row["school_id"])]

    return db_ids, codes


def fetch_users_registration_by_school_pks(
    db_ids: List[Any],
    select: str,
    *,
    limit: int | None = None,
) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    id_csv = _in_filter_csv(db_ids)
    if not id_csv:
        return out
    for chunk in _chunks(id_csv.split(","), 45):
        c = ",".join(chunk)
        rows = make_supabase_request(
            "GET",
            "users_registration",
            select=select,
            filters={"school_id": f"in.({c})"},
            limit=limit,
            use_service_role=True,
        ) or []
        out.extend(rows)
    return out


def fetch_school_payments_by_codes(codes: List[str], select: str = "*") -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    code_csv = _in_filter_csv(codes)
    if not code_csv:
        return out
    for chunk in _chunks(code_csv.split(","), 40):
        c = ",".join(chunk)
        rows = (
            make_supabase_request(
                "GET",
                "school_payments",
                select=select,
                filters={"school_id": f"in.({c})"},
                use_service_role=True,
                limit=5000,
            )
            or []
        )
        out.extend(rows)
    return out


def fetch_school_activity_by_codes(
    codes: List[str],
    date_from: str,
    *,
    limit: int = 20000,
) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    code_csv = _in_filter_csv(codes)
    if not code_csv:
        return out
    for chunk in _chunks(code_csv.split(","), 35):
        c = ",".join(chunk)
        rows = (
            make_supabase_request(
                "GET",
                "school_student_activity",
                select="date,sessions_count,questions_answered,credits_used,time_spent_minutes,subjects_accessed",
                filters={"school_id": f"in.({c})", "date": f"gte.{date_from}"},
                use_service_role=True,
                limit=limit,
            )
            or []
        )
        out.extend(rows)
    return out
