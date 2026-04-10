import logging

from flask import Blueprint, current_app, g, jsonify, request

from api.mobile import require_auth
from services.scan_solve_service import scan_solve_service

logger = logging.getLogger(__name__)

solve_bp = Blueprint("solve", __name__)


@solve_bp.route("/solve", methods=["POST"])
@require_auth
def solve_problem():
    try:
        text_input = (request.form.get("text") or "").strip()
        subject_hint = (request.form.get("subject_hint") or "").strip()
        level = (request.form.get("level") or "").strip()
        image_file = request.files.get("image")

        if not text_input and not image_file:
            return jsonify({"success": False, "message": "At least one of image or text must be provided."}), 400

        image_bytes = None
        if image_file:
            image_bytes = image_file.read()
            max_bytes = int(current_app.config.get("SCAN_SOLVE_MAX_IMAGE_MB", 10)) * 1024 * 1024
            if not image_bytes:
                return jsonify({"success": False, "message": "Uploaded image is empty."}), 400
            if len(image_bytes) > max_bytes:
                return jsonify({"success": False, "message": "Image exceeds the 10MB limit."}), 413

        payload = scan_solve_service.solve(
            user_id=str(g.current_user_id),
            text_input=text_input,
            subject_hint=subject_hint,
            level=level,
            image_bytes=image_bytes,
        )
        return jsonify(payload), 200
    except ValueError as exc:
        message = str(exc)
        status = 429 if "limit" in message.lower() else 400
        return jsonify({"success": False, "message": message}), status
    except Exception as exc:
        logger.error("Scan & Solve API error for user %s: %s", getattr(g, "current_user_id", "unknown"), exc, exc_info=True)
        return jsonify({"success": False, "message": "Scan & Solve failed. Please try again."}), 500
