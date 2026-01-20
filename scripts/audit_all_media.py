#!/usr/bin/env python3
"""
Audit all audio/video URLs in notes files for missing fields, expired tokens,
invalid formats, and network accessibility.
"""
from __future__ import annotations

import base64
import json
import os
import re
import sys
import time
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Tuple
from urllib.parse import urlparse, parse_qs
from urllib.request import Request, urlopen


NOTES_FILES = [
    "NerdXApp/src/data/aLevelPhysics/notes.ts",
    "NerdXApp/src/data/aLevelBiology/notes.ts",
    "NerdXApp/src/data/aLevelChemistry/notes.ts",
    "NerdXApp/src/data/oLevelMath/notes.ts",
    "NerdXApp/src/data/scienceNotes/chemistry.ts",
    "NerdXApp/src/data/scienceNotes/biology.ts",
    "NerdXApp/src/data/scienceNotes/physics.ts",
]


@dataclass
class UrlAuditResult:
    topic: str
    field: str
    url: str
    valid_format: bool
    token_expired: Optional[bool]
    token_exp: Optional[int]
    accessible: Optional[bool]
    error: Optional[str]


def _decode_jwt_exp(token: str) -> Tuple[Optional[int], Optional[str]]:
    try:
        parts = token.split(".")
        if len(parts) < 2:
            return None, "not_jwt"
        payload_b64 = parts[1]
        padding = "=" * (-len(payload_b64) % 4)
        payload_bytes = base64.urlsafe_b64decode(payload_b64 + padding)
        payload = json.loads(payload_bytes.decode("utf-8"))
        exp = payload.get("exp")
        return int(exp) if exp is not None else None, None
    except Exception as exc:  # noqa: BLE001
        return None, f"jwt_decode_error:{exc}"


def _check_accessible(url: str, timeout: int = 8) -> Tuple[Optional[bool], Optional[str]]:
    try:
        req = Request(url, method="HEAD")
        with urlopen(req, timeout=timeout) as response:  # noqa: S310
            return 200 <= response.status < 400, None
    except Exception as exc:  # noqa: BLE001
        return False, str(exc)


def _extract_topic_blocks(content: str) -> List[Tuple[str, str]]:
    # Matches: "Topic Name": { ... }
    topic_pattern = re.compile(r'^\s*"([^"]+)":\s*\{', re.MULTILINE)
    matches = list(topic_pattern.finditer(content))
    blocks = []
    for i, match in enumerate(matches):
        topic_name = match.group(1)
        start_index = match.end()
        end_index = matches[i + 1].start() if i + 1 < len(matches) else len(content)
        blocks.append((topic_name, content[start_index:end_index]))
    return blocks


def _audit_url(topic: str, field: str, url: str) -> UrlAuditResult:
    valid_format = bool(url.startswith("http"))
    token_exp = None
    token_expired = None
    accessible = None
    error = None

    if valid_format:
        try:
            parsed = urlparse(url)
            token_values = parse_qs(parsed.query).get("token", [])
            if token_values:
                token_exp, jwt_error = _decode_jwt_exp(token_values[0])
                if jwt_error:
                    error = jwt_error
                if token_exp is not None:
                    token_expired = token_exp <= int(time.time())
            accessible, access_error = _check_accessible(url)
            if access_error:
                error = access_error if error is None else f"{error}; {access_error}"
        except Exception as exc:  # noqa: BLE001
            error = str(exc)
    else:
        error = "invalid_url_format"

    return UrlAuditResult(
        topic=topic,
        field=field,
        url=url,
        valid_format=valid_format,
        token_expired=token_expired,
        token_exp=token_exp,
        accessible=accessible,
        error=error,
    )


def audit_notes_file(filepath: str) -> Dict:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    results: List[UrlAuditResult] = []
    missing_audio: List[str] = []
    missing_video: List[str] = []

    for topic, block in _extract_topic_blocks(content):
        audio_match = re.search(r'audioUrl:\s*["\']([^"\']*)["\']', block)
        video_match = re.search(r'videoUrl:\s*["\']([^"\']*)["\']', block)

        audio_url = audio_match.group(1).strip() if audio_match else ""
        video_url = video_match.group(1).strip() if video_match else ""

        if not audio_url:
            missing_audio.append(topic)
        else:
            results.append(_audit_url(topic, "audioUrl", audio_url))

        if not video_url:
            missing_video.append(topic)
        else:
            results.append(_audit_url(topic, "videoUrl", video_url))

    return {
        "file": filepath,
        "total_topics": len(_extract_topic_blocks(content)),
        "missing_audio": missing_audio,
        "missing_video": missing_video,
        "url_results": [asdict(r) for r in results],
    }


def main() -> int:
    report = {
        "generated_at": int(time.time()),
        "files": [],
    }

    for filepath in NOTES_FILES:
        if not os.path.exists(filepath):
            report["files"].append({
                "file": filepath,
                "error": "file_not_found",
            })
            continue
        report["files"].append(audit_notes_file(filepath))

    output_path = "media_audit_report.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print(f"Audit complete. Report saved to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
