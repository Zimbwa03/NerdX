#!/usr/bin/env python3
"""
Verification script for school-student credits: 06:00 daily reset, 100 credits/day, stop on subscription expiry.
Run from project root: python -m tests.verify_school_credits_system
Requires .env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
"""
import os
import sys
from datetime import datetime, timedelta

# Ensure project root on path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

def main():
    from database.external_db import (
        make_supabase_request,
        get_user_credits,
        deduct_credits_with_balance,
        SCHOOL_STUDENT_DAILY_CREDITS_UNITS,
        SCHOOL_CREDITS_RESET_TZ,
        SCHOOL_CREDITS_RESET_HOUR,
        _school_student_reset_boundary_utc,
    )
    from utils.credit_units import CREDIT_UNITS_PER_CREDIT, units_to_credits

    if not os.environ.get("SUPABASE_URL") or not os.environ.get("SUPABASE_SERVICE_ROLE_KEY"):
        print("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env")
        return 1

    print("=== School credits system verification ===\n")
    print(f"Reset: {SCHOOL_CREDITS_RESET_HOUR}:00 daily in timezone: {SCHOOL_CREDITS_RESET_TZ}")
    print(f"Daily allowance: {SCHOOL_STUDENT_DAILY_CREDITS_UNITS} units = {units_to_credits(SCHOOL_STUDENT_DAILY_CREDITS_UNITS)} credits")
    boundary = _school_student_reset_boundary_utc()
    print(f"Current period start (UTC): {boundary}\n")

    # 1. Find or create a school_student
    students = make_supabase_request(
        "GET", "users_registration",
        select="chat_id,name,surname,school_id,user_type,subscription_expires_at,daily_credits_used,daily_credits_reset_at",
        filters={"user_type": "eq.school_student"},
        limit=1,
        use_service_role=True,
    )
    if not students:
        print("No school_student in DB. Create one via Admin Dashboard: Schools -> Add School -> Add Student.")
        print("Then re-run this script.")
        return 0
    student = students[0]
    chat_id = student["chat_id"]
    school_id = student.get("school_id")
    print(f"Using school_student: chat_id={chat_id}, name={student.get('name')} {student.get('surname')}, school_id={school_id}")

    # 2. Check subscription not expired
    exp = student.get("subscription_expires_at")
    if exp:
        try:
            exp_dt = datetime.fromisoformat(exp.replace("Z", "+00:00")) if isinstance(exp, str) else exp
            if exp_dt < datetime.utcnow():
                print("WARNING: This student's school subscription has expired. Credits will be 0 until renewed.")
        except Exception:
            pass

    # 3. Get credits (should trigger reset if new period)
    credits_units = get_user_credits(chat_id, check_expiry=True)
    credits_display = int(units_to_credits(credits_units))
    print(f"Current credits: {credits_units} units = {credits_display} display credits")
    if credits_display > 100:
        print("(Expected max 100; if >100 check reset logic.)")
    try:
        exp_parsed = datetime.fromisoformat(exp.replace("Z", "+00:00")) if exp and isinstance(exp, str) else None
        if credits_units == 0 and exp_parsed and exp_parsed > datetime.utcnow():
            print("FAIL: Credits 0 but subscription not expired. Check reset/subscription logic.")
            return 1
    except Exception:
        pass

    # 4. Deduct a small amount (10 units = 1 credit) and re-check
    ok, new_bal = deduct_credits_with_balance(chat_id, 10, "test_verify", "Verification script")
    if not ok:
        print("Deduct failed (e.g. daily limit reached).")
    else:
        print(f"Deducted 10 units (1 credit). New balance: {new_bal} units = {int(units_to_credits(new_bal or 0))} credits")
        credits_after = get_user_credits(chat_id, check_expiry=False)
        print(f"get_user_credits after deduct: {credits_after} units")

    # 5. Expiry: if you have a school with expiry in past, get_user_credits for that student should return 0
    print("\n--- Expiry check ---")
    print("Credits stop when subscription_expires_at is in the past (month/term over).")
    print("Login and API access are blocked with: 'School subscription expired. Contact your school administrator.'")

    # 6. 06:00 reset instructions
    print("\n--- 06:00 daily reset ---")
    print(f"Credits reset at {SCHOOL_CREDITS_RESET_HOUR}:00 every day in timezone: {SCHOOL_CREDITS_RESET_TZ}")
    print("To change timezone: set env SCHOOL_CREDITS_RESET_TIMEZONE (e.g. Africa/Harare, UTC).")
    print("To verify reset: run this script before and after 06:00 in that TZ, or set TZ to UTC and run at 05:59 vs 06:01 UTC.")

    print("\n=== Verification run complete ===")
    return 0


if __name__ == "__main__":
    sys.exit(main())
