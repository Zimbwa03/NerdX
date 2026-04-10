"""
Multi-modal Scan & Solve service for NerdX.

Problem understanding, working, HTML visualization, and scripts use **Vertex AI**
(Gemini on Vertex). Spoken lesson audio is synthesized with **Google Cloud TTS**
(standard for production alongside Vertex). Redis-backed cache/rate limits when
configured; in-memory fallback for local development.
"""

from __future__ import annotations

import base64
import hashlib
import io
import json
import logging
import os
import re
import threading
import time
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple
from uuid import uuid4

import numpy as np
from PIL import Image, ImageOps

from services.analytics_tracker import analytics_tracker
from services.vertex_service import vertex_service
from services.voice_service import get_voice_service
from utils.vertex_ai_helper import extract_json_object

try:
    from google.cloud import texttospeech
except Exception:  # pragma: no cover - optional dependency at runtime
    texttospeech = None

try:
    import redis
except Exception:  # pragma: no cover - optional dependency at runtime
    redis = None

logger = logging.getLogger(__name__)

DEFAULT_SUBJECT = "algebra"
DEFAULT_DIFFICULTY = "O-Level"
MAX_SIMILAR_PROBLEMS = 3
MAX_COMMON_MISTAKES = 3
VALID_SUBJECTS = {
    "algebra",
    "calculus",
    "geometry",
    "trigonometry",
    "statistics",
    "mechanics",
    "probability",
    "matrices",
    "vectors",
    "number_theory",
    "chemistry",
    "physics",
}
VALID_DIFFICULTIES = {"O-Level", "A-Level", "university"}

MATHBOT_SYSTEM_PROMPT = """
You are MathBot, the core AI engine of NerdX — a ZIMSEC O-Level and A-Level exam preparation platform built for Zimbabwean students. You solve ANY mathematical problem with exceptional accuracy, then generate multi-modal learning content.

IMPORTANT OUTPUT FORMAT: Respond ONLY with a valid JSON object. No markdown, no preamble, no explanation outside the JSON.

JSON schema:
{
  "latex_problem": "LaTeX representation of the detected problem",
  "plain_problem": "Human-readable problem statement",
  "subject": "one of: algebra|calculus|geometry|trigonometry|statistics|mechanics|probability|matrices|vectors|number_theory|chemistry|physics",
  "difficulty": "one of: O-Level|A-Level|university",
  "solvable": true,
  "final_answer": "The final answer, formatted clearly with units if applicable",
  "steps": [
    {
      "step_number": 1,
      "title": "Short title of this step (max 8 words)",
      "explanation": "Clear explanation of WHY we do this step (2-3 sentences, use simple English)",
      "working": "The actual mathematical working/calculation for this step in LaTeX",
      "hint": "A helpful tip or thing to watch out for in this step"
    }
  ],
  "audio_script": "A friendly, conversational explanation of the ENTIRE solution in plain English. NO LaTeX, NO math symbols. Write it exactly as you would SAY it to a student face-to-face. Use words like 'squared', 'plus', 'equals', 'the square root of'. Duration target: 60-90 seconds when read aloud. Include: what type of problem this is, the key approach, and a sentence connecting it to real life. End with an encouraging phrase.",
  "simulation_html": "A COMPLETE, self-contained HTML5 page (no external dependencies except CDN links) that VISUALLY DEMONSTRATES this specific problem. Requirements: dark background (#0f1117), green accent (#22c55e), white text. Use HTML5 Canvas or inline SVG. The animation must: (1) show the problem graphically before solving, (2) animate the solution process step by step with smooth transitions, (3) show the final answer highlighted. Include a Play/Pause button and a step counter. For geometry: draw and animate the shapes. For algebra/equations: animate a number line or graph. For calculus: animate the curve and the operation. For statistics: animate the distribution. For vectors: animate the vector space. Make it genuinely educational and beautiful. The HTML must be 100% functional when set as an iframe srcdoc.",
  "key_concepts": ["concept1", "concept2", "concept3"],
  "common_mistakes": ["Mistake 1 description", "Mistake 2 description"],
  "similar_problems": [
    {"problem": "Similar problem 1", "hint": "Approach hint"},
    {"problem": "Similar problem 2", "hint": "Approach hint"},
    {"problem": "Similar problem 3", "hint": "Approach hint"}
  ],
  "zimsec_exam_tip": "A specific tip about how this type of question appears in ZIMSEC exams and what examiners look for"
}

If you cannot solve the problem, set solvable to false and provide explanation in the final_answer field.
""".strip()

SIMULATION_GUIDANCE = {
    "algebra": "<!-- Show parabola, x-intercepts animating in, roots labelled -->",
    "trigonometry": "<!-- Show unit circle, angle rotating, sin/cos values updating live -->",
    "statistics": "<!-- Show bell curve, shade regions, animate z-score line moving -->",
    "geometry": "<!-- Draw the shape, animate construction, and show measurements -->",
    "calculus": "<!-- Draw the curve, animate the tangent/area, and update values live -->",
    "matrices": "<!-- Show matrix grid, animate transformation with grid lines moving -->",
    "vectors": "<!-- Show vector space, vector arrows, and step-by-step translation/scaling -->",
}


def _normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "").strip())


def _slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (value or "").lower()).strip("-")


def _safe_json_roundtrip(payload: Dict[str, Any]) -> Dict[str, Any]:
    return json.loads(json.dumps(payload))


@dataclass
class ProcessedImage:
    image_bytes: bytes
    image_base64: str
    mime_type: str
    image_hash: str


class SolveCache:
    def __init__(self, ttl_seconds: int = 3600):
        self.ttl_seconds = ttl_seconds
        self._cache: Dict[str, Tuple[float, Dict[str, Any]]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> Optional[Dict[str, Any]]:
        now = time.time()
        with self._lock:
            entry = self._cache.get(key)
            if not entry:
                return None
            created_at, payload = entry
            if now - created_at > self.ttl_seconds:
                self._cache.pop(key, None)
                return None
            return _safe_json_roundtrip(payload)

    def set(self, key: str, payload: Dict[str, Any]) -> None:
        with self._lock:
            self._cache[key] = (time.time(), _safe_json_roundtrip(payload))


class RedisSolveCache:
    def __init__(self, client: Any, ttl_seconds: int = 3600, prefix: str = "scan_solve:cache:"):
        self.client = client
        self.ttl_seconds = ttl_seconds
        self.prefix = prefix

    def get(self, key: str) -> Optional[Dict[str, Any]]:
        raw = self.client.get(f"{self.prefix}{key}")
        if not raw:
            return None
        try:
            if isinstance(raw, bytes):
                raw = raw.decode("utf-8")
            return json.loads(raw)
        except Exception:
            return None

    def set(self, key: str, payload: Dict[str, Any]) -> None:
        self.client.setex(
            f"{self.prefix}{key}",
            self.ttl_seconds,
            json.dumps(payload),
        )


class RollingSolveRateLimiter:
    def __init__(self, max_solves: int = 30, window_seconds: int = 24 * 60 * 60):
        self.max_solves = max_solves
        self.window_seconds = window_seconds
        self._events: Dict[str, List[float]] = {}
        self._lock = threading.Lock()

    def allow(self, user_id: str) -> Tuple[bool, int]:
        now = time.time()
        with self._lock:
            timestamps = [ts for ts in self._events.get(user_id, []) if now - ts < self.window_seconds]
            if len(timestamps) >= self.max_solves:
                self._events[user_id] = timestamps
                return False, 0
            timestamps.append(now)
            self._events[user_id] = timestamps
            return True, self.max_solves - len(timestamps)

    def remaining(self, user_id: str) -> int:
        now = time.time()
        with self._lock:
            timestamps = [ts for ts in self._events.get(user_id, []) if now - ts < self.window_seconds]
            self._events[user_id] = timestamps
            return max(0, self.max_solves - len(timestamps))


class RedisRollingSolveRateLimiter:
    def __init__(
        self,
        client: Any,
        max_solves: int = 30,
        window_seconds: int = 24 * 60 * 60,
        prefix: str = "scan_solve:rate:",
    ):
        self.client = client
        self.max_solves = max_solves
        self.window_seconds = window_seconds
        self.prefix = prefix

    def _key(self, user_id: str) -> str:
        return f"{self.prefix}{user_id}"

    def allow(self, user_id: str) -> Tuple[bool, int]:
        now = time.time()
        window_start = now - self.window_seconds
        key = self._key(user_id)
        member = f"{now}:{uuid4().hex}"

        pipeline = self.client.pipeline()
        pipeline.zremrangebyscore(key, 0, window_start)
        pipeline.zcard(key)
        _, current_count = pipeline.execute()

        if int(current_count) >= self.max_solves:
            return False, 0

        pipeline = self.client.pipeline()
        pipeline.zadd(key, {member: now})
        pipeline.expire(key, self.window_seconds)
        pipeline.execute()
        return True, max(0, self.max_solves - int(current_count) - 1)

    def remaining(self, user_id: str) -> int:
        now = time.time()
        window_start = now - self.window_seconds
        key = self._key(user_id)
        pipeline = self.client.pipeline()
        pipeline.zremrangebyscore(key, 0, window_start)
        pipeline.zcard(key)
        _, current_count = pipeline.execute()
        return max(0, self.max_solves - int(current_count))


class ScanSolveService:
    def __init__(self):
        ttl_seconds = int(os.getenv("SCAN_SOLVE_CACHE_TTL", "3600"))
        max_solves = int(os.getenv("SCAN_SOLVE_MAX_PER_DAY", "30"))
        redis_url = os.getenv("REDIS_URL", "").strip()
        redis_client = self._build_redis_client(redis_url)
        if redis_client is not None:
            self.cache = RedisSolveCache(redis_client, ttl_seconds=ttl_seconds)
            self.rate_limiter = RedisRollingSolveRateLimiter(
                redis_client,
                max_solves=max_solves,
                window_seconds=24 * 60 * 60,
            )
        else:
            self.cache = SolveCache(ttl_seconds=ttl_seconds)
            self.rate_limiter = RollingSolveRateLimiter(
                max_solves=max_solves,
                window_seconds=24 * 60 * 60,
            )
        self.model_name = os.getenv("SCAN_SOLVE_VERTEX_MODEL", "gemini-2.5-flash")

    def _build_redis_client(self, redis_url: str) -> Optional[Any]:
        if not redis_url or redis is None:
            return None
        try:
            client = redis.Redis.from_url(redis_url, decode_responses=False)
            client.ping()
            logger.info("Scan & Solve using Redis cache/rate limiting")
            return client
        except Exception as exc:
            logger.warning("Redis unavailable for Scan & Solve, falling back to in-memory: %s", exc)
            return None

    def build_cache_key(
        self,
        text_input: str,
        processed_image: Optional[ProcessedImage],
        subject_hint: str,
        level: str,
    ) -> str:
        raw = json.dumps(
            {
                "text": _normalize_space(text_input),
                "image_hash": processed_image.image_hash if processed_image else "",
                "subject_hint": _normalize_space(subject_hint),
                "level": _normalize_space(level),
            },
            sort_keys=True,
        )
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    @staticmethod
    def _input_kind(processed_image: Optional[ProcessedImage], text_input: str) -> str:
        t = _normalize_space(text_input)
        if processed_image and t:
            return "image+text"
        if processed_image:
            return "image"
        return "text"

    def preprocess_image(self, image_bytes: bytes) -> ProcessedImage:
        image = Image.open(io.BytesIO(image_bytes))
        image = ImageOps.exif_transpose(image)
        grayscale = ImageOps.grayscale(image)
        contrasted = ImageOps.autocontrast(grayscale)
        thresholded = contrasted.point(lambda px: 255 if px > 168 else 0, mode="L")
        deskewed = self._deskew_image(thresholded)
        resized = ImageOps.contain(deskewed, (1024, 1024))

        output = io.BytesIO()
        resized.save(output, format="JPEG", quality=85, optimize=True)
        processed_bytes = output.getvalue()
        encoded = base64.b64encode(processed_bytes).decode("utf-8")

        return ProcessedImage(
            image_bytes=processed_bytes,
            image_base64=encoded,
            mime_type="image/jpeg",
            image_hash=hashlib.sha256(processed_bytes).hexdigest(),
        )

    def _deskew_image(self, image: Image.Image) -> Image.Image:
        # Estimate a small skew angle by maximizing row projection variance.
        array = np.asarray(image)
        best_angle = 0.0
        best_score = -1.0
        for angle in np.arange(-4.0, 4.5, 0.5):
            rotated = image.rotate(float(angle), resample=Image.Resampling.BICUBIC, fillcolor=255)
            rotated_array = np.asarray(rotated)
            row_sums = np.sum(255 - rotated_array, axis=1)
            score = float(np.var(row_sums))
            if score > best_score:
                best_score = score
                best_angle = float(angle)
        if abs(best_angle) < 0.5:
            return image
        return image.rotate(best_angle, resample=Image.Resampling.BICUBIC, fillcolor=255)

    def solve(
        self,
        *,
        user_id: str,
        text_input: str,
        subject_hint: str = "",
        level: str = "",
        image_bytes: Optional[bytes] = None,
    ) -> Dict[str, Any]:
        started = time.time()
        processed_image = self.preprocess_image(image_bytes) if image_bytes else None
        cache_key = self.build_cache_key(text_input, processed_image, subject_hint, level)
        cached = self.cache.get(cache_key)
        if cached:
            cached.setdefault("meta", {})
            cached["meta"]["cache_hit"] = True
            duration_ms = int((time.time() - started) * 1000)
            prob = cached.get("problem") or {}
            analytics_tracker.record_scan_solve_run(
                user_id,
                subject=str(prob.get("subject") or ""),
                difficulty=str(prob.get("difficulty") or ""),
                duration_ms=duration_ms,
                cache_hit=True,
                solvable=bool((cached.get("meta") or {}).get("solvable", True)),
                input_kind=self._input_kind(processed_image, text_input),
            )
            return cached

        allowed, remaining = self.rate_limiter.allow(user_id)
        if not allowed:
            raise ValueError("Daily Scan & Solve limit reached. Please try again tomorrow.")

        solution_json = self._generate_solution_json(
            text_input=text_input,
            subject_hint=subject_hint,
            level=level,
            processed_image=processed_image,
        )
        audio_base64 = self.generate_audio(solution_json.get("audio_script", ""))
        response_payload = self._build_response(
            cache_key=cache_key,
            solution_json=solution_json,
            audio_base64=audio_base64,
            cache_hit=False,
        )
        self.cache.set(cache_key, response_payload)

        duration_ms = int((time.time() - started) * 1000)
        logger.info(
            "scan_solve completed user=%s subject=%s difficulty=%s cache_hit=%s solvable=%s input_type=%s duration_ms=%s remaining=%s",
            user_id,
            response_payload["problem"]["subject"],
            response_payload["problem"]["difficulty"],
            False,
            response_payload["meta"]["solvable"],
            "image+text" if processed_image and text_input else "image" if processed_image else "text",
            duration_ms,
            remaining,
        )
        analytics_tracker.track_feature_usage(
            feature_name="scan_solve",
            user_id=user_id,
            success=True,
            time_spent=duration_ms,
            credits_consumed=0,
        )
        analytics_tracker.record_scan_solve_run(
            user_id,
            subject=response_payload["problem"]["subject"],
            difficulty=response_payload["problem"]["difficulty"],
            duration_ms=duration_ms,
            cache_hit=False,
            solvable=bool(response_payload["meta"].get("solvable", True)),
            input_kind=self._input_kind(processed_image, text_input),
        )
        return response_payload

    def _generate_solution_json(
        self,
        *,
        text_input: str,
        subject_hint: str,
        level: str,
        processed_image: Optional[ProcessedImage],
    ) -> Dict[str, Any]:
        if not vertex_service.is_available() or vertex_service.client is None:
            raise RuntimeError("Vertex AI is not configured for Scan & Solve.")

        prompt = self._build_generation_prompt(
            text_input=text_input,
            subject_hint=subject_hint,
            level=level,
        )

        parsed = self._call_vertex(prompt, processed_image=processed_image, temperature=0.1)
        if parsed is None:
            parsed = self._call_vertex(prompt, processed_image=processed_image, temperature=0.0)
        if parsed is None:
            raise RuntimeError("Gemini returned an invalid Scan & Solve response.")

        return self._normalize_solution_json(parsed)

    def _build_generation_prompt(self, *, text_input: str, subject_hint: str, level: str) -> str:
        simulation_hint = SIMULATION_GUIDANCE.get((subject_hint or "").strip().lower(), "")
        context_lines = [
            MATHBOT_SYSTEM_PROMPT,
            "",
            "Additional simulation guidance:",
            "For the simulation_html, study the problem's subject and generate a simulation that directly demonstrates THIS specific problem's numbers and answer. Do not generate a generic template — use the actual values from the problem. The student should see their specific equation/shape/graph, not a placeholder.",
        ]
        if simulation_hint:
            context_lines.append(simulation_hint)
        if text_input:
            context_lines.append(f"Problem to solve: {text_input}")
        if subject_hint:
            context_lines.append(f"Subject hint: {subject_hint}")
        if level:
            context_lines.append(f"Level: {level}")
        return "\n".join(context_lines).strip()

    def _call_vertex(
        self,
        prompt: str,
        *,
        processed_image: Optional[ProcessedImage],
        temperature: float,
    ) -> Optional[Dict[str, Any]]:
        from google.genai.types import Part

        contents: List[Any] = [prompt]
        if processed_image:
            contents.insert(
                0,
                Part.from_bytes(
                    data=processed_image.image_bytes,
                    mime_type=processed_image.mime_type,
                ),
            )

        response = vertex_service.client.models.generate_content(
            model=self.model_name,
            contents=contents,
            config={
                "response_mime_type": "application/json",
                "temperature": temperature,
                "top_p": 0.95,
                "max_output_tokens": 8192,
            },
        )
        raw_text = (getattr(response, "text", None) or "").strip()
        if not raw_text:
            return None
        return extract_json_object(raw_text, logger=logger, context="scan_solve")

    def _normalize_solution_json(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        subject = payload.get("subject") if payload.get("subject") in VALID_SUBJECTS else DEFAULT_SUBJECT
        difficulty = payload.get("difficulty") if payload.get("difficulty") in VALID_DIFFICULTIES else DEFAULT_DIFFICULTY
        steps = self._normalize_steps(payload.get("steps"))
        final_answer = _normalize_space(str(payload.get("final_answer") or ""))
        latex_problem = _normalize_space(str(payload.get("latex_problem") or payload.get("plain_problem") or ""))
        plain_problem = _normalize_space(str(payload.get("plain_problem") or payload.get("latex_problem") or ""))
        solvable = bool(payload.get("solvable", True))
        audio_script = _normalize_space(str(payload.get("audio_script") or ""))
        simulation_html = self._sanitize_simulation_html(str(payload.get("simulation_html") or ""))
        key_concepts = self._normalize_string_list(payload.get("key_concepts"), limit=6)
        common_mistakes = self._normalize_string_list(payload.get("common_mistakes"), limit=MAX_COMMON_MISTAKES)
        similar_problems = self._normalize_similar_problems(payload.get("similar_problems"))
        exam_tip = _normalize_space(str(payload.get("zimsec_exam_tip") or ""))

        if not simulation_html:
            simulation_html = self._build_fallback_simulation_html(plain_problem or latex_problem, final_answer)

        if not audio_script:
            audio_script = (
                f"This is a {subject} problem. We work through the method step by step, then check the answer carefully. "
                f"The final answer is {final_answer or 'not available yet'}. Keep practicing and you will get stronger with each question."
            )

        if not final_answer and not solvable:
            final_answer = "This problem could not be solved confidently from the provided input."

        return {
            "latex_problem": latex_problem,
            "plain_problem": plain_problem,
            "subject": subject,
            "difficulty": difficulty,
            "solvable": solvable,
            "final_answer": final_answer,
            "steps": steps,
            "audio_script": audio_script,
            "simulation_html": simulation_html,
            "key_concepts": key_concepts,
            "common_mistakes": common_mistakes,
            "similar_problems": similar_problems,
            "zimsec_exam_tip": exam_tip,
        }

    def _normalize_steps(self, raw_steps: Any) -> List[Dict[str, Any]]:
        if not isinstance(raw_steps, list):
            return []
        normalized_steps: List[Dict[str, Any]] = []
        for index, step in enumerate(raw_steps, start=1):
            if not isinstance(step, dict):
                continue
            normalized_steps.append(
                {
                    "step_number": int(step.get("step_number") or index),
                    "title": _normalize_space(str(step.get("title") or f"Step {index}")),
                    "explanation": _normalize_space(str(step.get("explanation") or "")),
                    "working": _normalize_space(str(step.get("working") or "")),
                    "hint": _normalize_space(str(step.get("hint") or "")),
                }
            )
        return normalized_steps

    def _normalize_string_list(self, values: Any, *, limit: int) -> List[str]:
        if not isinstance(values, list):
            return []
        result: List[str] = []
        for value in values:
            normalized = _normalize_space(str(value))
            if normalized:
                result.append(normalized)
            if len(result) >= limit:
                break
        return result

    def _normalize_similar_problems(self, values: Any) -> List[Dict[str, str]]:
        if not isinstance(values, list):
            return []
        result: List[Dict[str, str]] = []
        for item in values:
            if not isinstance(item, dict):
                continue
            problem = _normalize_space(str(item.get("problem") or ""))
            hint = _normalize_space(str(item.get("hint") or ""))
            if problem:
                result.append({"problem": problem, "hint": hint})
            if len(result) >= MAX_SIMILAR_PROBLEMS:
                break
        return result

    def _sanitize_simulation_html(self, html: str) -> str:
        cleaned = html.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:html)?", "", cleaned, flags=re.IGNORECASE).strip()
            cleaned = re.sub(r"```$", "", cleaned).strip()
        if not cleaned:
            return ""
        if "<html" in cleaned.lower():
            return cleaned
        return self._wrap_simulation_fragment(cleaned)

    def _wrap_simulation_fragment(self, fragment: str) -> str:
        return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {{
      margin: 0;
      background: #0f1117;
      color: #ffffff;
      font-family: Arial, sans-serif;
    }}
  </style>
</head>
<body>
{fragment}
</body>
</html>"""

    def _build_fallback_simulation_html(self, problem_text: str, final_answer: str) -> str:
        safe_problem = json.dumps(problem_text or "Problem")
        safe_answer = json.dumps(final_answer or "Answer unavailable")
        return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {{
      margin: 0;
      background: #0f1117;
      color: #ffffff;
      font-family: Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }}
    .card {{
      border: 1px solid rgba(34, 197, 94, 0.35);
      border-radius: 16px;
      padding: 24px;
      width: min(88vw, 520px);
      background: rgba(255,255,255,0.04);
    }}
    .accent {{ color: #22c55e; }}
  </style>
</head>
<body>
  <div class="card">
    <h2 class="accent">Visual Explanation</h2>
    <p id="problem"></p>
    <p id="answer"></p>
  </div>
  <script>
    document.getElementById('problem').textContent = {safe_problem};
    document.getElementById('answer').textContent = 'Final answer: ' + {safe_answer};
  </script>
</body>
</html>"""

    def generate_audio(self, audio_script: str) -> str:
        script = _normalize_space(audio_script)
        if not script:
            return ""

        if texttospeech is not None:
            try:
                client = texttospeech.TextToSpeechClient()
                synthesis_input = texttospeech.SynthesisInput(text=script)
                voice = texttospeech.VoiceSelectionParams(
                    language_code="en-GB",
                    name="en-GB-Neural2-A",
                    ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
                )
                audio_config = texttospeech.AudioConfig(
                    audio_encoding=texttospeech.AudioEncoding.MP3,
                    speaking_rate=0.90,
                    pitch=0.0,
                    volume_gain_db=2.0,
                )
                response = client.synthesize_speech(
                    input=synthesis_input,
                    voice=voice,
                    audio_config=audio_config,
                )
                return base64.b64encode(response.audio_content).decode("utf-8")
            except Exception as exc:
                logger.warning("Google Cloud TTS failed, falling back to VoiceService: %s", exc, exc_info=True)

        try:
            voice_service = get_voice_service()
            result = voice_service.text_to_speech_sync(script, "teacher")
            if not result.get("success"):
                return ""
            full_path = result.get("full_path")
            if not full_path or not os.path.exists(full_path):
                return ""
            with open(full_path, "rb") as audio_file:
                return base64.b64encode(audio_file.read()).decode("utf-8")
        except Exception as exc:
            logger.error("Fallback TTS failed: %s", exc, exc_info=True)
            return ""

    def _build_response(
        self,
        *,
        cache_key: str,
        solution_json: Dict[str, Any],
        audio_base64: str,
        cache_hit: bool,
    ) -> Dict[str, Any]:
        return {
            "success": True,
            "problem": {
                "latex": solution_json["latex_problem"],
                "plain": solution_json["plain_problem"],
                "subject": solution_json["subject"],
                "difficulty": solution_json["difficulty"],
            },
            "solution": {
                "final_answer": solution_json["final_answer"],
                "steps": solution_json["steps"],
                "key_concepts": solution_json["key_concepts"],
                "common_mistakes": solution_json["common_mistakes"],
                "similar_problems": solution_json["similar_problems"],
                "zimsec_exam_tip": solution_json["zimsec_exam_tip"],
                "audio_script": solution_json["audio_script"],
            },
            "media": {
                "simulation_html": solution_json["simulation_html"],
                "audio_base64": audio_base64,
                "audio_format": "mp3",
            },
            "meta": {
                "id": _slugify(cache_key[:12]),
                "solvable": bool(solution_json["solvable"]),
                "cache_hit": cache_hit,
            },
        }


scan_solve_service = ScanSolveService()
