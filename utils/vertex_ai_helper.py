"""
Helpers for using Vertex AI as the primary JSON generator.
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any, Dict, Optional

from services.vertex_service import vertex_service


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
    model: str = "gemini-2.5-flash",
    logger: Optional[logging.Logger] = None,
    context: str = "",
) -> Optional[Dict[str, Any]]:
    """
    Attempt Vertex AI generation and parse a JSON object from the response.
    Returns None if Vertex AI is unavailable or parsing fails.

    IMPORTANT: Callers must pass the same full prompt string that DeepSeek receives.
    When DeepSeek uses system + user messages, pass (system + "\\n\\n" + user) so only
    the model/API changes, not the prompt structure or content.
    """
    if not vertex_service.is_available():
        if logger:
            logger.info("Vertex AI unavailable%s; skipping primary attempt", f" ({context})" if context else "")
        return None

    try:
        result = vertex_service.generate_text(prompt=prompt, model=model)
    except Exception as exc:  # pragma: no cover - defensive logging
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
    if not text:
        if logger:
            logger.warning("Vertex AI returned empty text%s", f" ({context})" if context else "")
        return None

    return extract_json_object(text, logger=logger, context=context)

