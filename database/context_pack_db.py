import json
import logging
import sqlite3
from datetime import datetime
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# Keep separate from nerdx_sessions.db to avoid schema coupling.
DATABASE_NAME = "nerdx_context_packs.db"

_initialized = False


def init_context_pack_database() -> bool:
    """Initialize local SQLite database for Context Packs (durable image context)."""
    global _initialized
    if _initialized:
        return True

    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS context_packs (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                chat_id TEXT,
                created_at TEXT NOT NULL,
                combined_summary TEXT,
                suggested_next_actions TEXT,
                raw_model_json TEXT
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS context_pack_images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                context_pack_id TEXT NOT NULL,
                image_id TEXT NOT NULL,
                storage_url TEXT NOT NULL,
                mime_type TEXT NOT NULL,
                size_bytes INTEGER NOT NULL,
                per_image_summary TEXT,
                extracted_text TEXT,
                key_concepts TEXT,
                subject_guess TEXT,
                confidence_notes TEXT,
                FOREIGN KEY(context_pack_id) REFERENCES context_packs(id)
            )
            """
        )

        cursor.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_context_pack_images_pack
            ON context_pack_images(context_pack_id)
            """
        )
        cursor.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_context_packs_user_chat
            ON context_packs(user_id, chat_id, created_at)
            """
        )

        conn.commit()
        conn.close()
        _initialized = True
        return True
    except Exception as e:
        logger.error(f"Error initializing context pack database: {e}", exc_info=True)
        return False


def save_context_pack(
    *,
    context_pack_id: str,
    user_id: str,
    chat_id: Optional[str],
    combined_summary: str,
    suggested_next_actions: List[str],
    raw_model_json: Dict[str, Any],
    images: List[Dict[str, Any]],
) -> bool:
    """Persist a Context Pack and its per-image records."""
    if not init_context_pack_database():
        return False

    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()

        created_at = datetime.utcnow().isoformat()
        cursor.execute(
            """
            INSERT OR REPLACE INTO context_packs
            (id, user_id, chat_id, created_at, combined_summary, suggested_next_actions, raw_model_json)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                context_pack_id,
                user_id,
                chat_id,
                created_at,
                combined_summary,
                json.dumps(suggested_next_actions or []),
                json.dumps(raw_model_json or {}),
            ),
        )

        # Replace images for idempotency
        cursor.execute(
            "DELETE FROM context_pack_images WHERE context_pack_id = ?",
            (context_pack_id,),
        )

        for img in images:
            cursor.execute(
                """
                INSERT INTO context_pack_images
                (context_pack_id, image_id, storage_url, mime_type, size_bytes,
                 per_image_summary, extracted_text, key_concepts, subject_guess, confidence_notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    context_pack_id,
                    img.get("image_id"),
                    img.get("storage_url"),
                    img.get("mime_type"),
                    int(img.get("size_bytes") or 0),
                    img.get("per_image_summary", ""),
                    img.get("extracted_text", ""),
                    json.dumps(img.get("key_concepts") or []),
                    img.get("subject_guess", ""),
                    img.get("confidence_notes", ""),
                ),
            )

        conn.commit()
        conn.close()
        return True
    except Exception as e:
        logger.error(f"Error saving context pack: {e}", exc_info=True)
        return False


def get_context_pack(context_pack_id: str) -> Optional[Dict[str, Any]]:
    """Load a Context Pack with its image records."""
    if not init_context_pack_database():
        return None

    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id, user_id, chat_id, created_at, combined_summary, suggested_next_actions, raw_model_json
            FROM context_packs
            WHERE id = ?
            """,
            (context_pack_id,),
        )
        row = cursor.fetchone()
        if not row:
            conn.close()
            return None

        pack = {
            "id": row[0],
            "user_id": row[1],
            "chat_id": row[2],
            "created_at": row[3],
            "combined_summary": row[4] or "",
            "suggested_next_actions": json.loads(row[5] or "[]"),
            "raw_model_json": json.loads(row[6] or "{}"),
        }

        cursor.execute(
            """
            SELECT image_id, storage_url, mime_type, size_bytes, per_image_summary,
                   extracted_text, key_concepts, subject_guess, confidence_notes
            FROM context_pack_images
            WHERE context_pack_id = ?
            ORDER BY id ASC
            """,
            (context_pack_id,),
        )
        images = []
        for r in cursor.fetchall():
            images.append(
                {
                    "image_id": r[0],
                    "storage_url": r[1],
                    "mime_type": r[2],
                    "size_bytes": r[3],
                    "per_image_summary": r[4] or "",
                    "extracted_text": r[5] or "",
                    "key_concepts": json.loads(r[6] or "[]"),
                    "subject_guess": r[7] or "",
                    "confidence_notes": r[8] or "",
                }
            )
        conn.close()

        pack["images"] = images
        return pack
    except Exception as e:
        logger.error(f"Error loading context pack {context_pack_id}: {e}", exc_info=True)
        return None


def get_latest_context_pack_id(user_id: str, chat_id: Optional[str]) -> Optional[str]:
    """Return most recent Context Pack ID for a user+chat."""
    if not init_context_pack_database():
        return None

    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id
            FROM context_packs
            WHERE user_id = ? AND chat_id = ?
            ORDER BY created_at DESC
            LIMIT 1
            """,
            (user_id, chat_id),
        )
        row = cursor.fetchone()
        conn.close()
        return row[0] if row else None
    except Exception as e:
        logger.error(f"Error getting latest context pack id: {e}", exc_info=True)
        return None

