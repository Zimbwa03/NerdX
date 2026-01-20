#!/usr/bin/env python3
"""
Refresh Supabase signed URLs in notes files by re-signing storage paths.

Requires environment variables:
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
"""
from __future__ import annotations

import os
import re
import json
import requests
from typing import Dict, Tuple
from urllib.parse import urlparse, quote
def load_fallback_supabase_config() -> Tuple[str, str]:
    config_path = "NerdXApp/src/services/supabase.ts"
    if not os.path.exists(config_path):
        return "", ""

    with open(config_path, "r", encoding="utf-8") as f:
        content = f.read()

    url_match = re.search(r"'https://[^']+\.supabase\.co'", content)
    key_match = re.search(r"'eyJhbGciOiJIUzI1Ni[^']+'", content)

    supabase_url = url_match.group(0).strip("'") if url_match else ""
    supabase_key = key_match.group(0).strip("'") if key_match else ""
    return supabase_url, supabase_key



NOTES_FILES = [
    "NerdXApp/src/data/aLevelPhysics/notes.ts",
    "NerdXApp/src/data/aLevelBiology/notes.ts",
    "NerdXApp/src/data/aLevelChemistry/notes.ts",
    "NerdXApp/src/data/oLevelMath/notes.ts",
    "NerdXApp/src/data/scienceNotes/chemistry.ts",
    "NerdXApp/src/data/scienceNotes/biology.ts",
    "NerdXApp/src/data/scienceNotes/physics.ts",
]


def parse_storage_path(url: str) -> Tuple[str, str]:
    parsed = urlparse(url)
    parts = parsed.path.split("/")
    if "sign" not in parts:
        raise ValueError("URL does not appear to be a signed Supabase storage URL.")
    sign_index = parts.index("sign")
    bucket = parts[sign_index + 1]
    path = "/".join(parts[sign_index + 2 :])
    return bucket, path


def create_signed_url(base_url: str, service_key: str, bucket: str, path: str, expires_in: int) -> str:
    encoded_path = quote(path, safe="/")
    endpoint = f"{base_url}/storage/v1/object/sign/{bucket}/{encoded_path}"
    headers = {
        "Authorization": f"Bearer {service_key}",
        "apikey": service_key,
        "Content-Type": "application/json",
    }
    resp = requests.post(endpoint, headers=headers, json={"expiresIn": expires_in}, timeout=20)
    resp.raise_for_status()
    data = resp.json()
    if "signedURL" not in data:
        raise ValueError(f"Unexpected response: {data}")
    return f"{base_url}{data['signedURL']}"


def refresh_urls_in_file(filepath: str, service_key: str, expires_in: int, base_url: str) -> Dict:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    url_pattern = re.compile(r'(audioUrl|videoUrl):\s*"([^"]+)"')
    updates: Dict[str, str] = {}
    errors: Dict[str, str] = {}

    def replace(match: re.Match) -> str:
        field = match.group(1)
        url = match.group(2)
        if not url.startswith("http"):
            return match.group(0)

        try:
            bucket, path = parse_storage_path(url)
            key = f"{bucket}/{path}"
            if key not in updates:
                updates[key] = create_signed_url(base_url, service_key, bucket, path, expires_in)
            return f'{field}: "{updates[key]}"'
        except Exception as exc:  # noqa: BLE001
            errors[url] = str(exc)
            return match.group(0)

    new_content = url_pattern.sub(replace, content)

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)

    return {"file": filepath, "updated": len(updates), "errors": errors}


def main() -> int:
    supabase_url = os.environ.get("SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

    if not supabase_url or not service_key:
        fallback_url, fallback_key = load_fallback_supabase_config()
        supabase_url = supabase_url or fallback_url
        service_key = service_key or fallback_key

    if not supabase_url or not service_key:
        print("Missing SUPABASE_URL and key. Provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")
        return 1

    expires_in = int(os.environ.get("SUPABASE_SIGNED_URL_TTL", "31536000"))  # 1 year default
    results = []

    for filepath in NOTES_FILES:
        if not os.path.exists(filepath):
            results.append({"file": filepath, "error": "file_not_found"})
            continue
        results.append(refresh_urls_in_file(filepath, service_key, expires_in, supabase_url.rstrip("/")))

    with open("media_refresh_report.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print("Refresh complete. Report saved to media_refresh_report.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
