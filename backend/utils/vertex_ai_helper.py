"""
Helpers for using Vertex AI as the primary JSON generator.
"""

from __future__ import annotations

import json
import logging
import os
import re
from typing import Any, Dict, Optional

from services.vertex_service import vertex_service

# Default Gemini model for Vertex text/JSON (override with VERTEX_GEMINI_TEXT_MODEL)
DEFAULT_VERTEX_TEXT_MODEL = os.environ.get("VERTEX_GEMINI_TEXT_MODEL", "gemini-2.5-flash")


def repair_invalid_json_string_escapes(fragment: str) -> str:
    """
    Fix common model mistakes: LaTeX like \\frac emitted as \\f (invalid JSON \\escape).
    Only adjusts backslashes inside JSON string literals (between unescaped quotes).
    """
    out: list[str] = []
    i = 0
    n = len(fragment)
    in_string = False
    while i < n:
        ch = fragment[i]
        if not in_string:
            if ch == '"':
                bs = 0
                j = i - 1
                while j >= 0 and fragment[j] == "\\":
                    bs += 1
                    j -= 1
                if bs % 2 == 0:
                    in_string = True
            out.append(ch)
            i += 1
            continue

        if ch == '"':
            bs = 0
            j = i - 1
            while j >= 0 and fragment[j] == "\\":
                bs += 1
                j -= 1
            if bs % 2 == 0:
                in_string = False
            out.append(ch)
            i += 1
            continue

        if ch == "\\" and i + 1 < n:
            nxt = fragment[i + 1]
            valid = nxt in '\\"/bfnrtu'
            if nxt == "u" and i + 5 < n:
                hx = fragment[i + 2 : i + 6]
                if len(hx) == 4 and all(c in "0123456789abcdefABCDEF" for c in hx):
                    valid = True
            if valid:
                out.append(ch)
                out.append(nxt)
                i += 2
                continue
            out.append("\\")
            out.append("\\")
            out.append(nxt)
            i += 2
            continue

        out.append(ch)
        i += 1
    return "".join(out)


def extract_json_object(text: str, logger: Optional[logging.Logger] = None, context: str = "") -> Optional[Dict[str, Any]]:
    """
    Best-effort extraction of a JSON object from model text.
    Supports raw JSON and JSON wrapped in markdown code fences.
    """
    if not text:
        return None

    cleaned = text.strip()

    # Strip markdown code fences if present.
    fence_match = re.search(r"```(?:json)?\s*(.*?)```", cleaned, flags=re.IGNORECASE | re.DOTALL)
    if fence_match:
        cleaned = fence_match.group(1).strip()

    # Try direct parse first.
    try:
        parsed = json.loads(cleaned)
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        try:
            parsed = json.loads(repair_invalid_json_string_escapes(cleaned))
            return parsed if isinstance(parsed, dict) else None
        except json.JSONDecodeError:
            pass

    # Fallback: extract the first {...} span.
    start = cleaned.find("{")
    end = cleaned.rfind("}") + 1
    if start < 0 or end <= start:
        if logger:
            logger.warning("Vertex AI JSON extraction failed%s: no object found", f" ({context})" if context else "")
        return None

    candidate = cleaned[start:end]
    try:
        parsed = json.loads(candidate)
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        try:
            repaired = repair_invalid_json_string_escapes(candidate)
            parsed = json.loads(repaired)
            return parsed if isinstance(parsed, dict) else None
        except json.JSONDecodeError as exc:
            if logger:
                logger.warning(
                    "Vertex AI JSON extraction failed%s: %s",
                    f" ({context})" if context else "",
                    exc,
                )
            return None


def try_vertex_json(
    prompt: str,
    *,
    model: Optional[str] = None,
    logger: Optional[logging.Logger] = None,
    context: str = "",
    max_attempts: int = 2,
) -> Optional[Dict[str, Any]]:
    """
    Attempt Vertex AI generation and parse a JSON object from the response.
    Uses JSON MIME type first, then a plain-text retry with escape repair if needed.
    """
    if not vertex_service.is_available():
        if logger:
            logger.info("Vertex AI unavailable%s; skipping primary attempt", f" ({context})" if context else "")
        return None

    resolved_model = model or DEFAULT_VERTEX_TEXT_MODEL

    for attempt in range(max(1, max_attempts)):
        json_mode = attempt == 0
        try:
            result = vertex_service.generate_text(
                prompt=prompt,
                model=resolved_model,
                json_mode=json_mode,
                temperature=0.75 if json_mode else 0.8,
                max_output_tokens=8192,
            )
        except Exception as exc:  # pragma: no cover - defensive logging
            if logger:
                logger.error(
                    "Vertex AI call failed%s: %s",
                    f" ({context})" if context else "",
                    exc,
                    exc_info=True,
                )
            continue

        if not result or not result.get("success"):
            if logger:
                err = result.get("error") if isinstance(result, dict) else "unknown error"
                logger.warning(
                    "Vertex AI returned no result%s (attempt %s): %s",
                    f" ({context})" if context else "",
                    attempt + 1,
                    err,
                )
            continue

        text = (result.get("text") or "").strip()
        if not text:
            if logger:
                logger.warning(
                    "Vertex AI returned empty text%s (attempt %s)",
                    f" ({context})" if context else "",
                    attempt + 1,
                )
            continue

        parsed = extract_json_object(text, logger=None, context=context)
        if parsed:
            return parsed

    if logger:
        logger.warning("Vertex AI JSON extraction failed%s after %s attempts", f" ({context})" if context else "", max_attempts)
    return None


def try_vertex_text(
    prompt: str,
    *,
    model: Optional[str] = None,
    logger: Optional[logging.Logger] = None,
    context: str = "",
) -> Optional[str]:
    """
    Attempt Vertex AI text generation. Returns plain text or None.
    """
    if not vertex_service.is_available():
        if logger:
            logger.info("Vertex AI unavailable%s; skipping primary attempt", f" ({context})" if context else "")
        return None

    try:
        result = vertex_service.generate_text(prompt=prompt, model=model or DEFAULT_VERTEX_TEXT_MODEL)
    except Exception as exc:
        if logger:
            logger.error(
                "Vertex AI call failed%s: %s",
                f" ({context})" if context else "",
                exc,
                exc_info=True,
            )
        return None

    if not result or not result.get("success"):
        if logger:
            err = result.get("error") if isinstance(result, dict) else "unknown error"
            logger.warning("Vertex AI returned no result%s: %s", f" ({context})" if context else "", err)
        return None

    text = (result.get("text") or "").strip()
    return text if text else None


def _gemini_api_key() -> Optional[str]:
    return os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")


def try_gemini_text(
    prompt: str,
    *,
    model: str = "gemini-1.5-flash",
    logger: Optional[logging.Logger] = None,
    context: str = "",
    max_output_tokens: int = 4096,
    temperature: float = 0.7,
) -> Optional[str]:
    """
    Consumer Gemini API (GOOGLE_API_KEY / GEMINI_API_KEY). Plain text only.
    """
    api_key = _gemini_api_key()
    if not api_key:
        if logger:
            logger.info("Gemini API key not set%s; skipping", f" ({context})" if context else "")
        return None
    try:
        import google.generativeai as genai
    except ImportError:
        if logger:
            logger.warning("google.generativeai not available%s", f" ({context})" if context else "")
        return None

    genai.configure(api_key=api_key)
    try:
        m = genai.GenerativeModel(model)
        response = m.generate_content(
            prompt,
            generation_config={
                "temperature": temperature,
                "max_output_tokens": max_output_tokens,
            },
        )
        text = (getattr(response, "text", None) or "").strip()
        return text if text else None
    except Exception as exc:
        if logger:
            logger.warning(
                "Gemini text call failed%s: %s",
                f" ({context})" if context else "",
                exc,
            )
        return None


def try_gemini_json(
    prompt: str,
    *,
    model: str = "gemini-1.5-flash",
    logger: Optional[logging.Logger] = None,
    context: str = "",
    max_attempts: int = 2,
) -> Optional[Dict[str, Any]]:
    """
    Parse a JSON object from consumer Gemini API output (JSON MIME first, then plain + extract).
    """
    api_key = _gemini_api_key()
    if not api_key:
        if logger:
            logger.info("Gemini API key not set%s; skipping JSON fallback", f" ({context})" if context else "")
        return None
    try:
        import google.generativeai as genai
    except ImportError:
        if logger:
            logger.warning("google.generativeai not available%s", f" ({context})" if context else "")
        return None

    genai.configure(api_key=api_key)

    for attempt in range(max(1, max_attempts)):
        use_json_mime = attempt == 0
        gen_cfg: Dict[str, Any] = {
            "temperature": 0.75 if use_json_mime else 0.8,
            "max_output_tokens": 8192,
        }
        if use_json_mime:
            gen_cfg["response_mime_type"] = "application/json"

        try:
            m = genai.GenerativeModel(model)
            response = m.generate_content(prompt, generation_config=gen_cfg)
            text = (getattr(response, "text", None) or "").strip()
        except Exception as exc:
            if logger:
                logger.warning(
                    "Gemini JSON call failed%s (attempt %s): %s",
                    f" ({context})" if context else "",
                    attempt + 1,
                    exc,
                )
            continue
        if not text:
            continue
        parsed = extract_json_object(text, logger=None, context=context)
        if parsed:
            return parsed

    if logger:
        logger.warning(
            "Gemini JSON extraction failed%s after %s attempts",
            f" ({context})" if context else "",
            max_attempts,
        )
    return None

