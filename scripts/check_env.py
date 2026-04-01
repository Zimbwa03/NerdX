#!/usr/bin/env python3
"""
Print whether noted environment variables are set (values are never shown).
Run from repo root: python scripts/check_env.py

Exit code 0 always (informational). Use --strict to exit 1 if critical vars missing.
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]


def _load_dotenv() -> None:
    try:
        from dotenv import load_dotenv

        load_dotenv(REPO_ROOT / ".env")
    except ImportError:
        pass


def _set(name: str) -> bool:
    v = os.getenv(name)
    return bool(v and str(v).strip())


def main() -> int:
    parser = argparse.ArgumentParser(description="Check NerdX env vars (names only, no secret values).")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit with code 1 if any CRITICAL variable is missing.",
    )
    args = parser.parse_args()
    _load_dotenv()

    groups: list[tuple[str, list[tuple[str, str]], bool]] = [
        (
            "CRITICAL - Supabase (mobile app, credits, MAIC classroom, school data)",
            [
                ("SUPABASE_URL", "Supabase project URL"),
                ("SUPABASE_SERVICE_ROLE_KEY", "Server-side REST + bypass RLS where used"),
            ],
            True,
        ),
        (
            "RECOMMENDED — Supabase anon (some client flows; optional if API-only)",
            [
                ("SUPABASE_ANON_KEY", "Public anon key for Supabase client"),
            ],
            False,
        ),
        (
            "SECURITY - JWT (mobile /api/mobile/*)",
            [
                ("JWT_SECRET", "If unset, api/mobile.py uses a dev default - change in production"),
            ],
            False,
        ),
        (
            "AI — Vertex (primary path; MAIC + many generators use vertex_service)",
            [
                ("GOOGLE_APPLICATION_CREDENTIALS", "Path to GCP service account JSON file"),
                ("GOOGLE_SERVICE_ACCOUNT_JSON", "Or paste full JSON (alternative to file path)"),
                ("GOOGLE_CLOUD_PROJECT", "GCP project id (has code default but should be set)"),
                ("GOOGLE_CLOUD_LOCATION", "e.g. global (optional, has default)"),
            ],
            False,
        ),
        (
            "AI - API key fallbacks (when Vertex off or specific services)",
            [
                ("GEMINI_API_KEY", "Google AI Studio / Gemini API"),
                ("GOOGLE_API_KEY", "Some services read this alias"),
                ("DEEPSEEK_API_KEY", "DeepSeek fallback for many features"),
            ],
            False,
        ),
        (
            "VOICE - Edge TTS (Flask /api/mobile/voice/speak)",
            [
                ("(no env)", "Requires Python package edge_tts installed on server"),
            ],
            False,
        ),
        (
            "OPTIONAL - WhatsApp (Twilio)",
            [
                ("TWILIO_ACCOUNT_SID", ""),
                ("TWILIO_AUTH_TOKEN", ""),
                ("TWILIO_PHONE_NUMBER", ""),
            ],
            False,
        ),
        (
            "OPTIONAL - Payments / misc",
            [
                ("ECOCASH_API_KEY", ""),
                ("ECOCASH_MERCHANT_CODE", ""),
                ("BASE_URL", "Public URL for links / media"),
                ("DATABASE_URL", "Defaults to sqlite:///nerdx_quiz.db if unset"),
                ("DESMOS_API_KEY", ""),
            ],
            False,
        ),
    ]

    critical_missing: list[str] = []
    print("NerdX environment check (values hidden)\n")

    for title, rows, is_critical in groups:
        print(f"## {title}")
        for name, note in rows:
            if name.startswith("("):
                print(f"  {name} {note}")
                continue
            ok = _set(name)
            status = "OK " if ok else "MISSING"
            line = f"  [{status}] {name}"
            if note:
                line += f" - {note}"
            print(line)
            if is_critical and not ok:
                critical_missing.append(name)
        print()

    vertex_ok = _set("GOOGLE_APPLICATION_CREDENTIALS") or _set("GOOGLE_SERVICE_ACCOUNT_JSON")
    gemini_ok = _set("GEMINI_API_KEY") or _set("GOOGLE_API_KEY")
    deepseek_ok = _set("DEEPSEEK_API_KEY")
    if not vertex_ok and not gemini_ok and not deepseek_ok:
        print(
            "## WARNING: No Vertex credentials and no GEMINI_API_KEY/GOOGLE_API_KEY/DEEPSEEK_API_KEY - "
            "most AI features will return stub errors or fallbacks.\n"
        )

    if critical_missing:
        print(f"Critical missing ({len(critical_missing)}): {', '.join(critical_missing)}")
        if args.strict:
            return 1
    elif args.strict:
        print("Strict check: all critical variables are set.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
