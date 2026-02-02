import logging
import os
import uuid
from typing import Any, Dict, List, Optional, Tuple

from database.context_pack_db import get_context_pack, save_context_pack
from services.vertex_service import vertex_service

logger = logging.getLogger(__name__)


ALLOWED_IMAGE_MIME_TYPES: Dict[str, str] = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


class ContextPackService:
    """
    Context Pack = durable, machine-parseable "visual memory" created from 1..10 images.

    Storage:
    - Raw images saved under static/context_packs/<context_pack_id>/
    - Metadata stored in database/context_pack_db.py (SQLite)
    """

    def __init__(self):
        self._static_root = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")

    def _ensure_pack_dir(self, context_pack_id: str) -> str:
        pack_dir = os.path.join(self._static_root, "context_packs", context_pack_id)
        os.makedirs(pack_dir, exist_ok=True)
        return pack_dir

    def _save_image(self, context_pack_id: str, image_id: str, mime_type: str, data: bytes) -> Tuple[str, int]:
        pack_dir = self._ensure_pack_dir(context_pack_id)
        ext = ALLOWED_IMAGE_MIME_TYPES.get(mime_type, ".bin")
        filename = f"{image_id}{ext}"
        abs_path = os.path.join(pack_dir, filename)
        with open(abs_path, "wb") as f:
            f.write(data)
        storage_url = f"/static/context_packs/{context_pack_id}/{filename}"
        return storage_url, len(data)

    def create_context_pack(
        self,
        *,
        user_id: str,
        chat_id: Optional[str],
        images: List[Dict[str, Any]],
        prompt: str = "",
        model: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        images: [{bytes: <bytes>, mime_type: str}]
        """
        if not images or len(images) < 1:
            raise ValueError("At least 1 image is required")
        if len(images) > 10:
            raise ValueError("Too many images (max 10)")

        if not vertex_service.is_available():
            raise RuntimeError("Vertex AI not available")

        context_pack_id = uuid.uuid4().hex

        stored: List[Dict[str, Any]] = []
        analysis_inputs: List[Tuple[bytes, str]] = []

        for img in images:
            mime_type = (img.get("mime_type") or "").lower().strip()
            if mime_type not in ALLOWED_IMAGE_MIME_TYPES:
                raise ValueError(f"Unsupported image type: {mime_type or 'unknown'}")

            data = img.get("bytes")
            if not isinstance(data, (bytes, bytearray)) or len(data) == 0:
                raise ValueError("Invalid image bytes")

            image_id = uuid.uuid4().hex[:12]
            storage_url, size_bytes = self._save_image(context_pack_id, image_id, mime_type, bytes(data))

            stored.append(
                {
                    "image_id": image_id,
                    "storage_url": storage_url,
                    "mime_type": mime_type,
                    "size_bytes": size_bytes,
                }
            )
            analysis_inputs.append((bytes(data), mime_type))

        # Ask Gemini (Vertex multimodal) for structured JSON
        analysis = vertex_service.analyze_images_context_pack(
            images=analysis_inputs,
            user_prompt=prompt or "",
            model=model or "gemini-2.5-flash",
        )

        # Treat Vertex failure as hard error so API returns 500 and client sees clear error
        if isinstance(analysis, dict) and (analysis.get("success") is False or analysis.get("error")):
            raise RuntimeError(analysis.get("error") or "Image analysis failed")

        # Map model output back onto stored images by index
        images_out: List[Dict[str, Any]] = []
        model_images = (analysis or {}).get("images") or []
        for i, s in enumerate(stored):
            m = model_images[i] if i < len(model_images) and isinstance(model_images[i], dict) else {}
            images_out.append(
                {
                    **s,
                    "per_image_summary": (m.get("short_description") or "").strip(),
                    "extracted_text": (m.get("extracted_text") or "").strip(),
                    "key_concepts": m.get("key_concepts") or [],
                    "subject_guess": (m.get("subject_guess") or "").strip(),
                    "confidence_notes": (m.get("confidence_notes") or "").strip(),
                }
            )

        combined_summary = (analysis or {}).get("combined_summary") or ""
        suggested_next_actions = (analysis or {}).get("follow_up_questions_suggestions") or []
        if isinstance(suggested_next_actions, str):
            suggested_next_actions = [suggested_next_actions]

        save_ok = save_context_pack(
            context_pack_id=context_pack_id,
            user_id=str(user_id),
            chat_id=str(chat_id) if chat_id is not None else None,
            combined_summary=combined_summary,
            suggested_next_actions=suggested_next_actions,
            raw_model_json=analysis or {},
            images=images_out,
        )
        if not save_ok:
            logger.warning("Failed to persist context pack metadata (continuing).")

        return {
            "id": context_pack_id,
            "chat_id": chat_id,
            "images": images_out,
            "combined_summary": combined_summary,
            "suggested_next_actions": suggested_next_actions,
        }

    def get_context_pack(self, context_pack_id: str) -> Optional[Dict[str, Any]]:
        return get_context_pack(context_pack_id)


context_pack_service = ContextPackService()

