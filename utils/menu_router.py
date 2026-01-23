import logging
import re
import time
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class MenuRouter:
    """In-memory router for text-based menu selections (Twilio WhatsApp)."""

    def __init__(self, ttl_seconds: int = 900):
        self._ttl_seconds = ttl_seconds
        self._menus: Dict[str, Dict] = {}

    def store_menu(self, user_id: str, options: List[Dict], source: str = "menu") -> None:
        """Store a menu mapping for a user. Options are list of dicts with text/title + callback_data/id."""
        if not user_id or not options:
            return

        user_key = self._normalize_user_id(user_id)
        now = time.time()

        by_number: Dict[str, str] = {}
        by_text: Dict[str, str] = {}
        by_callback: Dict[str, str] = {}

        for idx, opt in enumerate(options, 1):
            if not isinstance(opt, dict):
                continue

            text = (opt.get("text") or opt.get("title") or opt.get("name") or "").strip()
            desc = (opt.get("description") or "").strip()
            display_text = f"{text} - {desc}" if text and desc else text
            if not display_text:
                display_text = f"Option {idx}"

            callback = (opt.get("callback_data") or opt.get("id") or text or display_text).strip()

            by_number[str(idx)] = callback

            norm_display = self._normalize_text(display_text)
            if norm_display:
                by_text[norm_display] = callback

            norm_text = self._normalize_text(text)
            if norm_text:
                by_text[norm_text] = callback

            norm_cb = self._normalize_text(callback)
            if norm_cb:
                by_callback[norm_cb] = callback

        if not by_number:
            return

        self._menus[user_key] = {
            "timestamp": now,
            "source": source,
            "by_number": by_number,
            "by_text": by_text,
            "by_callback": by_callback,
        }

    def resolve_selection(self, user_id: str, message_text: str, allow_numbers: bool = True) -> Optional[str]:
        """Resolve a user's text reply to a stored callback_data selection."""
        if not user_id or not message_text:
            return None

        user_key = self._normalize_user_id(user_id)
        menu = self._menus.get(user_key)
        if not menu:
            return None

        if self._is_expired(menu.get("timestamp")):
            self._menus.pop(user_key, None)
            return None

        text = message_text.strip()
        if allow_numbers:
            number = self._extract_number(text)
            if number and number in menu["by_number"]:
                selection = menu["by_number"][number]
                self._menus.pop(user_key, None)
                return selection

        normalized = self._normalize_text(text)
        if not normalized:
            return None

        if normalized in menu["by_text"]:
            selection = menu["by_text"][normalized]
            self._menus.pop(user_key, None)
            return selection

        if normalized in menu["by_callback"]:
            selection = menu["by_callback"][normalized]
            self._menus.pop(user_key, None)
            return selection

        # Fuzzy partial match (only if unique)
        if len(normalized) >= 3:
            candidates = []
            for key, value in menu["by_text"].items():
                if normalized in key or key in normalized:
                    candidates.append(value)
            candidates = list(dict.fromkeys(candidates))
            if len(candidates) == 1:
                selection = candidates[0]
                self._menus.pop(user_key, None)
                return selection

        return None

    def clear_menu(self, user_id: str) -> None:
        """Clear stored menu for a user."""
        if not user_id:
            return
        user_key = self._normalize_user_id(user_id)
        self._menus.pop(user_key, None)

    def _is_expired(self, timestamp: Optional[float]) -> bool:
        if not timestamp:
            return True
        return (time.time() - timestamp) > self._ttl_seconds

    @staticmethod
    def _normalize_user_id(user_id: str) -> str:
        user_id = user_id.strip()
        return user_id.replace("whatsapp:", "") if user_id.startswith("whatsapp:") else user_id

    @staticmethod
    def _extract_number(text: str) -> Optional[str]:
        match = re.search(r"\b(\d{1,2})\b", text)
        if not match:
            return None
        return match.group(1).lstrip("0") or match.group(1)

    @staticmethod
    def _normalize_text(text: str) -> str:
        cleaned = text.lower().strip()
        cleaned = re.sub(r"[\s]+", " ", cleaned)
        cleaned = re.sub(r"[^a-z0-9\s]", "", cleaned)
        return cleaned.strip()


menu_router = MenuRouter()
