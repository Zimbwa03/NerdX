import logging
import os
from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Set, Tuple

import requests

from database.external_db import get_user_registration, make_supabase_request
from services.whatsapp_service import WhatsAppService

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover
    ZoneInfo = None

logger = logging.getLogger(__name__)


class EngagementNotificationService:
    """Automated engagement campaigns (push + in-app + WhatsApp)."""

    DEFAULT_PREFERENCES: Dict[str, Any] = {
        "preferred_subjects": [],
        "exam_level": "O Level",
        "target_exam_date": None,
        "daily_question_goal": 10,
        "study_time_goal_minutes": 30,
        "difficulty_preference": "adaptive",
        "notification_reminders": True,
        "notification_achievements": True,
        "notification_tips": True,
        "theme_preference": "system",
        "school_name": None,
        "grade_level": None,
        "whatsapp_reminders": True,
        "social_notifications": True,
        "weekly_report_notifications": True,
        "exam_countdown_notifications": True,
        "reminder_frequency_per_day": 3,
    }

    ALLOWED_PREFERENCE_FIELDS: Set[str] = set(DEFAULT_PREFERENCES.keys())

    def __init__(self) -> None:
        self.supabase_url = (os.getenv("SUPABASE_URL") or "").rstrip("/")
        self.supabase_service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.expo_push_url = "https://exp.host/--/api/v2/push/send"
        self.expo_push_timeout_seconds = int(os.getenv("EXPO_PUSH_TIMEOUT_SECONDS", "15"))
        self.whatsapp_service = WhatsAppService()

        self._supabase_uid_cache: Dict[str, Optional[str]] = {}
        self._batch_mode = False

        tz_name = (os.getenv("ENGAGEMENT_TIMEZONE") or "Africa/Harare").strip() or "Africa/Harare"
        self.timezone_name = tz_name
        if ZoneInfo is not None:
            try:
                self.local_tz = ZoneInfo(tz_name)
            except Exception:
                logger.warning("Invalid ENGAGEMENT_TIMEZONE=%s, defaulting to UTC", tz_name)
                self.local_tz = timezone.utc
        else:
            self.local_tz = timezone.utc

        self.reminder_hours = self._parse_hours_env("ENGAGEMENT_REMINDER_HOURS", "8,13,17")
        self.weekly_report_hour = int(os.getenv("ENGAGEMENT_WEEKLY_REPORT_HOUR", "18"))
        self.exam_countdown_hour = int(os.getenv("ENGAGEMENT_EXAM_COUNTDOWN_HOUR", "9"))

    # ---------------------------------------------------------------------
    # Preferences + token persistence
    # ---------------------------------------------------------------------

    def get_user_preferences(self, user_id: str) -> Dict[str, Any]:
        defaults = self._build_default_preferences(user_id)

        rows = make_supabase_request(
            "GET",
            "user_notification_preferences",
            select="*",
            filters={"user_id": f"eq.{user_id}"},
            limit=1,
            use_service_role=True,
        )

        if not rows:
            return defaults

        row = rows[0]
        merged = {**defaults, **row}
        merged["preferred_subjects"] = self._normalize_subjects(merged.get("preferred_subjects"))
        merged["target_exam_date"] = self._normalize_date_str(merged.get("target_exam_date"))
        merged["reminder_frequency_per_day"] = self._clamp_int(merged.get("reminder_frequency_per_day"), 1, 6, 3)
        return merged

    def update_user_preferences(self, user_id: str, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        normalized = self._normalize_preferences_payload(payload)
        normalized["updated_at"] = datetime.now(timezone.utc).isoformat()

        existing = make_supabase_request(
            "GET",
            "user_notification_preferences",
            select="user_id",
            filters={"user_id": f"eq.{user_id}"},
            limit=1,
            use_service_role=True,
        )

        if existing and len(existing) > 0:
            result = make_supabase_request(
                "PATCH",
                "user_notification_preferences",
                data=normalized,
                filters={"user_id": f"eq.{user_id}"},
                use_service_role=True,
            )
            if result is None:
                return None
        else:
            create_data = {
                "user_id": user_id,
                **self._build_default_preferences(user_id),
                **normalized,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
            result = make_supabase_request(
                "POST",
                "user_notification_preferences",
                data=create_data,
                use_service_role=True,
            )
            if result is None:
                return None

        return self.get_user_preferences(user_id)

    def register_push_token(
        self,
        user_id: str,
        expo_push_token: str,
        platform: str = "unknown",
        device_id: Optional[str] = None,
        app_version: Optional[str] = None,
        supabase_user_id: Optional[str] = None,
    ) -> Tuple[bool, str]:
        if not self._is_valid_expo_push_token(expo_push_token):
            return False, "Invalid Expo push token"

        now_iso = datetime.now(timezone.utc).isoformat()

        existing = make_supabase_request(
            "GET",
            "mobile_push_tokens",
            select="id,user_id",
            filters={"expo_push_token": f"eq.{expo_push_token}"},
            limit=1,
            use_service_role=True,
        )

        payload = {
            "user_id": user_id,
            "expo_push_token": expo_push_token,
            "platform": (platform or "unknown")[:30],
            "device_id": (device_id or "")[:120] or None,
            "app_version": (app_version or "")[:30] or None,
            "supabase_user_id": (supabase_user_id or "")[:120] or None,
            "is_active": True,
            "last_seen_at": now_iso,
            "updated_at": now_iso,
        }

        if existing and len(existing) > 0:
            result = make_supabase_request(
                "PATCH",
                "mobile_push_tokens",
                data=payload,
                filters={"expo_push_token": f"eq.{expo_push_token}"},
                use_service_role=True,
            )
            if result is None:
                return False, "Failed to update push token"
            return True, "Push token updated"

        payload["created_at"] = now_iso
        result = make_supabase_request(
            "POST",
            "mobile_push_tokens",
            data=payload,
            use_service_role=True,
        )
        if result is None:
            return False, "Failed to register push token"
        return True, "Push token registered"

    def unregister_push_token(
        self,
        user_id: str,
        expo_push_token: Optional[str] = None,
        device_id: Optional[str] = None,
    ) -> Tuple[bool, str]:
        filters = {"user_id": f"eq.{user_id}"}
        if expo_push_token:
            filters["expo_push_token"] = f"eq.{expo_push_token}"
        elif device_id:
            filters["device_id"] = f"eq.{device_id}"

        result = make_supabase_request(
            "PATCH",
            "mobile_push_tokens",
            data={
                "is_active": False,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            filters=filters,
            use_service_role=True,
        )

        if result is None:
            return False, "Failed to unregister push token"
        return True, "Push token unregistered"

    # ---------------------------------------------------------------------
    # Event handlers
    # ---------------------------------------------------------------------

    def handle_badge_earned(
        self,
        user_id: str,
        badge_id: str,
        badge_name: str,
        rarity: Optional[str] = None,
    ) -> Dict[str, Any]:
        user_row = get_user_registration(user_id) or {}
        student_name = self._first_name(user_row)
        prefs = self.get_user_preferences(user_id)

        if not prefs.get("notification_achievements", True):
            return {"success": True, "sent": 0, "skipped": "Achievements disabled"}

        title = "New badge unlocked!"
        body = f"Awesome {student_name}! You earned '{badge_name}'."
        metadata = {
            "campaign_type": "badge_unlocked",
            "badge_id": badge_id,
            "badge_name": badge_name,
            "rarity": rarity,
            "student_name": student_name,
        }

        sent = self._dispatch_campaign_message(
            user_id=user_id,
            campaign_type="badge_unlocked",
            dedupe_key=badge_id or badge_name,
            title=title,
            body=body,
            notification_type="update",
            metadata=metadata,
            channels=("in_app", "push"),
            user_row=user_row,
        )
        return {"success": True, "sent": sent}

    def handle_level_up(self, user_id: str, new_level: int) -> Dict[str, Any]:
        users = self._fetch_all_students()
        users_by_chat_id = {str(u.get("chat_id") or ""): u for u in users if u.get("chat_id")}
        users_by_nerdx_id = {
            str(u.get("nerdx_id") or ""): u for u in users if u.get("nerdx_id")
        }

        actor = users_by_chat_id.get(user_id) or (get_user_registration(user_id) or {})
        actor_name = self._first_name(actor)

        friend_ids = self._find_friend_user_ids(actor, users, users_by_nerdx_id)
        if not friend_ids:
            return {"success": True, "notified": 0}

        notified = 0
        for friend_id in friend_ids:
            prefs = self.get_user_preferences(friend_id)
            if not prefs.get("social_notifications", True):
                continue

            friend_row = users_by_chat_id.get(friend_id) or get_user_registration(friend_id) or {}
            friend_name = self._first_name(friend_row)

            title = "Your friend just leveled up!"
            body = f"{actor_name} reached Level {new_level}. Keep pushing, {friend_name}!"
            metadata = {
                "campaign_type": "friend_level_up",
                "friend_user_id": user_id,
                "friend_name": actor_name,
                "new_level": int(new_level),
            }

            sent_count = self._dispatch_campaign_message(
                user_id=friend_id,
                campaign_type="friend_level_up",
                dedupe_key=f"manual:{user_id}:{new_level}",
                title=title,
                body=body,
                notification_type="info",
                metadata=metadata,
                channels=("in_app", "push"),
                user_row=friend_row,
            )
            if sent_count > 0:
                notified += 1

        return {"success": True, "notified": notified}

    # ---------------------------------------------------------------------
    # Scheduled campaigns
    # ---------------------------------------------------------------------

    def run_scheduled_campaigns(self, force: bool = False, dry_run: bool = False) -> Dict[str, Any]:
        now_utc = datetime.now(timezone.utc)
        local_now = now_utc.astimezone(self.local_tz)

        users = self._fetch_all_students()
        preferences_map = self._fetch_preferences_map()
        users_by_chat_id = {str(u.get("chat_id") or ""): u for u in users if u.get("chat_id")}
        users_by_nerdx_id = {
            str(u.get("nerdx_id") or ""): u for u in users if u.get("nerdx_id")
        }

        user_stats_map = self._fetch_user_stats_map()

        self._preload_supabase_uid_cache()
        self._batch_mode = True

        summary: Dict[str, Any] = {
            "timezone": self.timezone_name,
            "ran_at_utc": now_utc.isoformat(),
            "local_time": local_now.isoformat(),
            "users_considered": len(users),
            "force": bool(force),
            "dry_run": bool(dry_run),
            "campaigns": {
                "inactive_reminders": {"sent": 0, "skipped": 0},
                "weekly_report": {"sent": 0, "skipped": 0},
                "exam_countdown": {"sent": 0, "skipped": 0},
                "friend_level_up": {"sent": 0, "skipped": 0},
            },
        }

        inactivity_result = self._run_inactivity_reminders(
            users=users,
            stats_map=user_stats_map,
            preferences_map=preferences_map,
            local_now=local_now,
            force=force,
            dry_run=dry_run,
        )
        summary["campaigns"]["inactive_reminders"] = inactivity_result

        weekly_result = self._run_weekly_report(
            users=users,
            stats_map=user_stats_map,
            preferences_map=preferences_map,
            local_now=local_now,
            force=force,
            dry_run=dry_run,
        )
        summary["campaigns"]["weekly_report"] = weekly_result

        exam_result = self._run_exam_countdown(
            users=users,
            preferences_map=preferences_map,
            local_now=local_now,
            force=force,
            dry_run=dry_run,
        )
        summary["campaigns"]["exam_countdown"] = exam_result

        social_result = self._run_friend_level_up_campaign(
            users=users,
            users_by_chat_id=users_by_chat_id,
            users_by_nerdx_id=users_by_nerdx_id,
            preferences_map=preferences_map,
            local_now=local_now,
            force=force,
            dry_run=dry_run,
        )
        summary["campaigns"]["friend_level_up"] = social_result

        return summary

    def _run_inactivity_reminders(
        self,
        users: List[Dict[str, Any]],
        stats_map: Dict[str, Dict[str, Any]],
        preferences_map: Dict[str, Dict[str, Any]],
        local_now: datetime,
        force: bool,
        dry_run: bool,
    ) -> Dict[str, int]:
        hour = local_now.hour
        if not force and hour not in self.reminder_hours:
            return {"sent": 0, "skipped": len(users)}

        sent = 0
        skipped = 0
        today_local = local_now.date()
        slot_key = f"{today_local.isoformat()}-{hour:02d}"

        for user in users:
            user_id = str(user.get("chat_id") or "")
            if not user_id:
                skipped += 1
                continue

            prefs = self._get_effective_preferences(user_id, user, preferences_map)
            if not prefs.get("notification_reminders", True):
                skipped += 1
                continue

            stats = stats_map.get(user_id) or {}
            last_activity_dt = self._parse_datetime(stats.get("last_activity"))
            last_local_date = (
                last_activity_dt.astimezone(self.local_tz).date() if last_activity_dt else None
            )

            if last_local_date == today_local:
                skipped += 1
                continue

            student_name = self._first_name(user)
            title, body = self._build_inactivity_message(student_name, hour)
            metadata = {
                "campaign_type": "inactive_reminder",
                "slot_hour": hour,
                "student_name": student_name,
            }

            if dry_run:
                sent += 1
                continue

            sent_count = self._dispatch_campaign_message(
                user_id=user_id,
                campaign_type="inactive_reminder",
                dedupe_key=slot_key,
                title=title,
                body=body,
                notification_type="warning",
                metadata=metadata,
                channels=("in_app", "push"),
                user_row=user,
            )

            # Evening WhatsApp reminder (5-6 PM local)
            if hour in (17, 18) and prefs.get("whatsapp_reminders", True):
                whatsapp_text = f"Hi {student_name}, you haven't studied today. Do a 20-minute NerdX session now and keep your streak alive."
                sent_count += self._dispatch_campaign_message(
                    user_id=user_id,
                    campaign_type="inactive_reminder",
                    dedupe_key=slot_key,
                    title=title,
                    body=whatsapp_text,
                    notification_type="warning",
                    metadata=metadata,
                    channels=("whatsapp",),
                    user_row=user,
                )

            if sent_count > 0:
                sent += 1
            else:
                skipped += 1

        return {"sent": sent, "skipped": skipped}

    def _run_weekly_report(
        self,
        users: List[Dict[str, Any]],
        stats_map: Dict[str, Dict[str, Any]],
        preferences_map: Dict[str, Dict[str, Any]],
        local_now: datetime,
        force: bool,
        dry_run: bool,
    ) -> Dict[str, int]:
        is_sunday = local_now.weekday() == 6
        if not force and (not is_sunday or local_now.hour != self.weekly_report_hour):
            return {"sent": 0, "skipped": len(users)}

        today = local_now.date()
        week_start = today - timedelta(days=6)
        week_start_iso = week_start.isoformat()
        week_end_iso = today.isoformat()

        weekly_questions = self._fetch_weekly_question_counts(week_start_iso, week_end_iso)
        weekly_xp = self._fetch_weekly_xp(week_start, today)

        sent = 0
        skipped = 0

        for user in users:
            user_id = str(user.get("chat_id") or "")
            if not user_id:
                skipped += 1
                continue

            prefs = self._get_effective_preferences(user_id, user, preferences_map)
            if not prefs.get("weekly_report_notifications", True):
                skipped += 1
                continue

            questions = int(weekly_questions.get(user_id, 0) or 0)
            xp = int(weekly_xp.get(user_id, 0) or 0)
            streak = int((stats_map.get(user_id) or {}).get("streak") or 0)

            student_name = self._first_name(user)
            title = f"Weekly Report, {student_name}"
            body = (
                f"You answered {questions} questions, earned {xp} XP, "
                f"and maintained a {streak}-day streak."
            )

            if dry_run:
                sent += 1
                continue

            sent_count = self._dispatch_campaign_message(
                user_id=user_id,
                campaign_type="weekly_report",
                dedupe_key=week_end_iso,
                title=title,
                body=body,
                notification_type="update",
                metadata={
                    "campaign_type": "weekly_report",
                    "week_start": week_start_iso,
                    "week_end": week_end_iso,
                    "questions": questions,
                    "xp": xp,
                    "streak": streak,
                },
                channels=("in_app", "push"),
                user_row=user,
            )

            if sent_count > 0:
                sent += 1
            else:
                skipped += 1

        return {"sent": sent, "skipped": skipped}

    def _run_exam_countdown(
        self,
        users: List[Dict[str, Any]],
        preferences_map: Dict[str, Dict[str, Any]],
        local_now: datetime,
        force: bool,
        dry_run: bool,
    ) -> Dict[str, int]:
        if not force and local_now.hour != self.exam_countdown_hour:
            return {"sent": 0, "skipped": len(users)}

        sent = 0
        skipped = 0
        today = local_now.date()

        for user in users:
            user_id = str(user.get("chat_id") or "")
            if not user_id:
                skipped += 1
                continue

            prefs = self._get_effective_preferences(user_id, user, preferences_map)
            if not prefs.get("exam_countdown_notifications", True):
                skipped += 1
                continue

            target_exam_date = self._parse_date(prefs.get("target_exam_date"))
            if not target_exam_date:
                skipped += 1
                continue

            days_left = (target_exam_date - today).days
            if days_left < 0 or days_left > 180:
                skipped += 1
                continue

            student_name = self._first_name(user)
            subjects = self._normalize_subjects(prefs.get("preferred_subjects"))
            plan_text = self._build_exam_plan(days_left, subjects)

            title = f"ZIMSEC exam in {days_left} day{'s' if days_left != 1 else ''}"
            body = f"{student_name}, {plan_text}"

            if dry_run:
                sent += 1
                continue

            sent_count = self._dispatch_campaign_message(
                user_id=user_id,
                campaign_type="exam_countdown",
                dedupe_key=today.isoformat(),
                title=title,
                body=body,
                notification_type="info",
                metadata={
                    "campaign_type": "exam_countdown",
                    "target_exam_date": target_exam_date.isoformat(),
                    "days_left": days_left,
                    "subjects": subjects,
                },
                channels=("in_app", "push"),
                user_row=user,
            )

            if sent_count > 0:
                sent += 1
            else:
                skipped += 1

        return {"sent": sent, "skipped": skipped}

    def _run_friend_level_up_campaign(
        self,
        users: List[Dict[str, Any]],
        users_by_chat_id: Dict[str, Dict[str, Any]],
        users_by_nerdx_id: Dict[str, Dict[str, Any]],
        preferences_map: Dict[str, Dict[str, Any]],
        local_now: datetime,
        force: bool,
        dry_run: bool,
    ) -> Dict[str, int]:
        del local_now  # currently unused in this campaign

        if force:
            since = datetime.now(timezone.utc) - timedelta(days=7)
        else:
            since = datetime.now(timezone.utc) - timedelta(hours=6)

        level_events = self._fetch_level_up_events(since)
        sent = 0
        skipped = 0

        for event in level_events:
            actor_id = str(event.get("user_id") or "")
            if not actor_id:
                continue

            actor = users_by_chat_id.get(actor_id)
            if not actor:
                actor = get_user_registration(actor_id) or {}
            actor_name = self._first_name(actor)
            new_level = int(event.get("level_after") or 0)
            event_at = self._normalize_date_str(event.get("created_at")) or "event"

            friend_ids = self._find_friend_user_ids(actor, users, users_by_nerdx_id)
            for friend_id in friend_ids:
                friend_row = users_by_chat_id.get(friend_id) or get_user_registration(friend_id) or {}
                friend_prefs = self._get_effective_preferences(friend_id, friend_row, preferences_map)
                if not friend_prefs.get("social_notifications", True):
                    skipped += 1
                    continue

                friend_name = self._first_name(friend_row)
                title = "Your friend just leveled up!"
                body = f"{actor_name} reached Level {new_level}. Keep climbing, {friend_name}!"

                if dry_run:
                    sent += 1
                    continue

                sent_count = self._dispatch_campaign_message(
                    user_id=friend_id,
                    campaign_type="friend_level_up",
                    dedupe_key=f"{actor_id}:{new_level}:{event_at}",
                    title=title,
                    body=body,
                    notification_type="info",
                    metadata={
                        "campaign_type": "friend_level_up",
                        "friend_user_id": actor_id,
                        "friend_name": actor_name,
                        "new_level": new_level,
                        "event_at": event.get("created_at"),
                    },
                    channels=("in_app", "push"),
                    user_row=friend_row,
                )
                if sent_count > 0:
                    sent += 1
                else:
                    skipped += 1

        return {"sent": sent, "skipped": skipped}

    # ---------------------------------------------------------------------
    # Dispatch helpers
    # ---------------------------------------------------------------------

    def _dispatch_campaign_message(
        self,
        user_id: str,
        campaign_type: str,
        dedupe_key: str,
        title: str,
        body: str,
        notification_type: str,
        metadata: Dict[str, Any],
        channels: Tuple[str, ...],
        user_row: Optional[Dict[str, Any]] = None,
    ) -> int:
        sent_channels = 0

        if "in_app" in channels:
            if not self._campaign_already_sent(user_id, campaign_type, dedupe_key, "in_app"):
                in_app_sent = self._send_in_app_notification(
                    user_id=user_id,
                    title=title,
                    body=body,
                    notification_type=notification_type,
                    metadata=metadata,
                )
                if in_app_sent:
                    self._log_campaign_send(user_id, campaign_type, dedupe_key, "in_app", metadata)
                    sent_channels += 1

        if "push" in channels:
            if not self._campaign_already_sent(user_id, campaign_type, dedupe_key, "push"):
                push_sent = self._send_push_notification(
                    user_id=user_id,
                    title=title,
                    body=body,
                    data={**metadata, "title": title, "body": body},
                )
                if push_sent:
                    self._log_campaign_send(user_id, campaign_type, dedupe_key, "push", metadata)
                    sent_channels += 1

        if "whatsapp" in channels:
            if not self._campaign_already_sent(user_id, campaign_type, dedupe_key, "whatsapp"):
                target_user = user_row or get_user_registration(user_id) or {}
                whatsapp_sent = self._send_whatsapp_message(target_user, body)
                if whatsapp_sent:
                    self._log_campaign_send(user_id, campaign_type, dedupe_key, "whatsapp", metadata)
                    sent_channels += 1

        return sent_channels

    def _send_in_app_notification(
        self,
        user_id: str,
        title: str,
        body: str,
        notification_type: str,
        metadata: Dict[str, Any],
    ) -> bool:
        supabase_user_id = self._resolve_supabase_user_id_for_app_user(user_id)
        if not supabase_user_id:
            return False

        notification_payload = {
            "title": title,
            "body": body,
            "type": notification_type,
            "audience": "targeted",
            "metadata": {**metadata, "app_user_id": user_id},
            "status": "sent",
        }

        created = make_supabase_request(
            "POST",
            "notifications",
            data=notification_payload,
            use_service_role=True,
        )

        if not created:
            return False

        notification_id = (
            created[0].get("id")
            if isinstance(created, list)
            else (created.get("id") if isinstance(created, dict) else None)
        )

        if not notification_id:
            return False

        recipient_payload = {
            "notification_id": notification_id,
            "user_id": supabase_user_id,
        }

        recipient_result = make_supabase_request(
            "POST",
            "notification_recipients",
            data=recipient_payload,
            use_service_role=True,
        )
        return recipient_result is not None

    def _send_push_notification(self, user_id: str, title: str, body: str, data: Dict[str, Any]) -> bool:
        tokens = make_supabase_request(
            "GET",
            "mobile_push_tokens",
            select="expo_push_token",
            filters={"user_id": f"eq.{user_id}", "is_active": "eq.true"},
            use_service_role=True,
        ) or []

        if not tokens:
            return False

        messages = []
        for row in tokens:
            token = row.get("expo_push_token")
            if not self._is_valid_expo_push_token(token):
                continue
            messages.append(
                {
                    "to": token,
                    "title": title,
                    "body": body,
                    "sound": "default",
                    "priority": "high",
                    "data": data,
                }
            )

        if not messages:
            return False

        sent_any = False
        invalid_tokens: List[str] = []

        for i in range(0, len(messages), 100):
            chunk = messages[i : i + 100]
            try:
                resp = requests.post(
                    self.expo_push_url,
                    json=chunk,
                    headers={"Content-Type": "application/json"},
                    timeout=self.expo_push_timeout_seconds,
                )
                if resp.status_code >= 400:
                    logger.warning("Expo push failed (%s): %s", resp.status_code, resp.text[:300])
                    continue

                payload = resp.json() if resp.content else {}
                items = payload.get("data") if isinstance(payload, dict) else None
                if not isinstance(items, list):
                    continue

                for msg, item in zip(chunk, items):
                    if item.get("status") == "ok":
                        sent_any = True
                    elif item.get("status") == "error":
                        details = item.get("details") or {}
                        error_code = (details.get("error") or "").lower()
                        if "device" in error_code and "registered" in error_code:
                            invalid_tokens.append(msg.get("to"))
            except Exception as e:
                logger.warning("Expo push send error: %s", e)

        if invalid_tokens:
            for token in invalid_tokens:
                if not token:
                    continue
                make_supabase_request(
                    "PATCH",
                    "mobile_push_tokens",
                    data={
                        "is_active": False,
                        "updated_at": datetime.now(timezone.utc).isoformat(),
                    },
                    filters={"expo_push_token": f"eq.{token}"},
                    use_service_role=True,
                )

        return sent_any

    def _send_whatsapp_message(self, user_row: Dict[str, Any], message: str) -> bool:
        phone = user_row.get("phone_number") or user_row.get("chat_id")
        normalized = self._normalize_whatsapp_number(phone)
        if not normalized:
            return False
        try:
            return bool(self.whatsapp_service.send_message(normalized, message))
        except Exception as e:
            logger.warning("WhatsApp send failed for %s: %s", normalized, e)
            return False

    # ---------------------------------------------------------------------
    # Data loaders
    # ---------------------------------------------------------------------

    def _fetch_all_students(self) -> List[Dict[str, Any]]:
        students: List[Dict[str, Any]] = []
        batch_size = 1000
        offset = 0

        while True:
            rows = make_supabase_request(
                "GET",
                "users_registration",
                select="*",
                limit=batch_size,
                offset=offset,
                use_service_role=True,
            )
            if not rows:
                break

            for row in rows:
                role = str((row or {}).get("role") or "student").lower()
                user_type = str((row or {}).get("user_type") or "student").lower()
                if role == "teacher" or user_type == "teacher":
                    continue
                if not row.get("chat_id"):
                    continue
                students.append(row)

            if len(rows) < batch_size:
                break
            offset += batch_size

        return students

    def _fetch_user_stats_map(self) -> Dict[str, Dict[str, Any]]:
        stats_map: Dict[str, Dict[str, Any]] = {}
        batch_size = 1000
        offset = 0

        while True:
            rows = make_supabase_request(
                "GET",
                "user_stats",
                select="user_id,total_attempts,correct_answers,xp_points,level,streak,last_activity",
                limit=batch_size,
                offset=offset,
                use_service_role=True,
            )
            if not rows:
                break

            for row in rows:
                uid = str(row.get("user_id") or "")
                if uid:
                    stats_map[uid] = row

            if len(rows) < batch_size:
                break
            offset += batch_size

        return stats_map

    def _fetch_preferences_map(self) -> Dict[str, Dict[str, Any]]:
        pref_map: Dict[str, Dict[str, Any]] = {}
        batch_size = 1000
        offset = 0

        while True:
            rows = make_supabase_request(
                "GET",
                "user_notification_preferences",
                select="*",
                limit=batch_size,
                offset=offset,
                use_service_role=True,
            )
            if not rows:
                break

            for row in rows:
                uid = str(row.get("user_id") or "")
                if uid:
                    pref_map[uid] = row

            if len(rows) < batch_size:
                break
            offset += batch_size

        return pref_map

    def _fetch_weekly_question_counts(self, week_start_iso: str, week_end_iso: str) -> Dict[str, int]:
        result: Dict[str, int] = {}
        batch_size = 1000
        offset = 0

        while True:
            rows = make_supabase_request(
                "GET",
                "student_weekly_activity",
                select="user_id,questions_answered,activity_date",
                filters={"activity_date": f"gte.{week_start_iso}"},
                limit=batch_size,
                offset=offset,
                use_service_role=True,
            )
            if not rows:
                break

            for row in rows:
                d = self._parse_date(row.get("activity_date"))
                if not d:
                    continue
                if d.isoformat() > week_end_iso:
                    continue
                uid = str(row.get("user_id") or "")
                if not uid:
                    continue
                result[uid] = int(result.get(uid, 0) + int(row.get("questions_answered") or 0))

            if len(rows) < batch_size:
                break
            offset += batch_size

        return result

    def _fetch_weekly_xp(self, week_start: date, week_end: date) -> Dict[str, int]:
        start_iso = datetime.combine(week_start, datetime.min.time(), tzinfo=timezone.utc).isoformat()
        end_dt = datetime.combine(week_end + timedelta(days=1), datetime.min.time(), tzinfo=timezone.utc)

        result: Dict[str, int] = {}
        batch_size = 1000
        offset = 0

        while True:
            rows = make_supabase_request(
                "GET",
                "xp_transactions",
                select="user_id,xp_earned,created_at",
                filters={"created_at": f"gte.{start_iso}"},
                limit=batch_size,
                offset=offset,
                use_service_role=True,
            )
            if not rows:
                break

            for row in rows:
                created = self._parse_datetime(row.get("created_at"))
                if not created:
                    continue
                if created >= end_dt:
                    continue
                uid = str(row.get("user_id") or "")
                if not uid:
                    continue
                result[uid] = int(result.get(uid, 0) + int(row.get("xp_earned") or 0))

            if len(rows) < batch_size:
                break
            offset += batch_size

        return result

    def _fetch_level_up_events(self, since: datetime) -> List[Dict[str, Any]]:
        rows = make_supabase_request(
            "GET",
            "xp_transactions",
            select="user_id,level_before,level_after,created_at",
            filters={"created_at": f"gte.{since.isoformat()}"},
            use_service_role=True,
        ) or []

        events: List[Dict[str, Any]] = []
        for row in rows:
            before = int(row.get("level_before") or 0)
            after = int(row.get("level_after") or 0)
            if after > before:
                events.append(row)
        return events

    # ---------------------------------------------------------------------
    # Dedupe log helpers
    # ---------------------------------------------------------------------

    def _campaign_already_sent(
        self,
        user_id: str,
        campaign_type: str,
        dedupe_key: str,
        channel: str,
    ) -> bool:
        rows = make_supabase_request(
            "GET",
            "engagement_campaign_log",
            select="id",
            filters={
                "user_id": f"eq.{user_id}",
                "campaign_type": f"eq.{campaign_type}",
                "dedupe_key": f"eq.{dedupe_key}",
                "channel": f"eq.{channel}",
            },
            limit=1,
            use_service_role=True,
        )
        return bool(rows)

    def _log_campaign_send(
        self,
        user_id: str,
        campaign_type: str,
        dedupe_key: str,
        channel: str,
        payload: Dict[str, Any],
    ) -> None:
        make_supabase_request(
            "POST",
            "engagement_campaign_log",
            data={
                "user_id": user_id,
                "campaign_type": campaign_type,
                "dedupe_key": dedupe_key,
                "channel": channel,
                "payload": payload,
                "sent_at": datetime.now(timezone.utc).isoformat(),
            },
            use_service_role=True,
        )

    # ---------------------------------------------------------------------
    # Utility methods
    # ---------------------------------------------------------------------

    def _get_effective_preferences(
        self,
        user_id: str,
        user_row: Optional[Dict[str, Any]],
        preferences_map: Dict[str, Dict[str, Any]],
    ) -> Dict[str, Any]:
        defaults = dict(self.DEFAULT_PREFERENCES)
        profile = user_row or {}
        defaults["school_name"] = profile.get("school_name")
        defaults["grade_level"] = profile.get("grade_level")

        row = preferences_map.get(user_id) or {}
        merged = {**defaults, **row}
        merged["preferred_subjects"] = self._normalize_subjects(merged.get("preferred_subjects"))
        merged["target_exam_date"] = self._normalize_date_str(merged.get("target_exam_date"))
        merged["reminder_frequency_per_day"] = self._clamp_int(merged.get("reminder_frequency_per_day"), 1, 6, 3)
        return merged

    def _build_default_preferences(self, user_id: str) -> Dict[str, Any]:
        defaults = dict(self.DEFAULT_PREFERENCES)
        profile = get_user_registration(user_id) or {}
        defaults["school_name"] = profile.get("school_name")
        defaults["grade_level"] = profile.get("grade_level")
        return defaults

    def _normalize_preferences_payload(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        normalized: Dict[str, Any] = {}
        if not isinstance(payload, dict):
            return normalized

        for key, value in payload.items():
            if key not in self.ALLOWED_PREFERENCE_FIELDS:
                continue

            if key == "preferred_subjects":
                normalized[key] = self._normalize_subjects(value)
            elif key == "target_exam_date":
                normalized[key] = self._normalize_date_str(value)
            elif key in ("daily_question_goal", "study_time_goal_minutes", "reminder_frequency_per_day"):
                if key == "daily_question_goal":
                    normalized[key] = self._clamp_int(value, 1, 200, 10)
                elif key == "study_time_goal_minutes":
                    normalized[key] = self._clamp_int(value, 5, 600, 30)
                else:
                    normalized[key] = self._clamp_int(value, 1, 6, 3)
            elif key in (
                "notification_reminders",
                "notification_achievements",
                "notification_tips",
                "whatsapp_reminders",
                "social_notifications",
                "weekly_report_notifications",
                "exam_countdown_notifications",
            ):
                normalized[key] = bool(value)
            elif key in ("exam_level", "difficulty_preference", "theme_preference"):
                normalized[key] = str(value or "").strip()[:30] or self.DEFAULT_PREFERENCES[key]
            elif key in ("school_name", "grade_level"):
                text = str(value).strip() if value is not None else ""
                normalized[key] = text[:120] if text else None
            else:
                normalized[key] = value

        return normalized

    def _resolve_supabase_user_id_for_app_user(self, user_id: str) -> Optional[str]:
        rows = make_supabase_request(
            "GET",
            "mobile_push_tokens",
            select="supabase_user_id",
            filters={"user_id": f"eq.{user_id}", "is_active": "eq.true"},
            limit=1,
            use_service_role=True,
        )
        if rows and len(rows) > 0:
            sid = rows[0].get("supabase_user_id")
            if sid:
                return str(sid)

        app_user = get_user_registration(user_id) or {}
        email = (app_user.get("email") or "").strip().lower()
        if not email or not self.supabase_url or not self.supabase_service_key:
            return None

        try:
            resp = requests.get(
                f"{self.supabase_url}/auth/v1/admin/users",
                headers={
                    "apikey": self.supabase_service_key,
                    "Authorization": f"Bearer {self.supabase_service_key}",
                },
                params={"page": 1, "per_page": 1, "filter": email},
                timeout=15,
            )
            if resp.status_code != 200:
                return None

            users = (resp.json() or {}).get("users") or []
            for auth_user in users:
                if str((auth_user or {}).get("email") or "").strip().lower() == email:
                    return auth_user.get("id")
        except Exception:
            pass

        return None

    def _find_friend_user_ids(
        self,
        actor: Dict[str, Any],
        all_users: List[Dict[str, Any]],
        users_by_nerdx_id: Dict[str, Dict[str, Any]],
    ) -> List[str]:
        actor_id = str(actor.get("chat_id") or "")
        actor_nerdx_id = str(actor.get("nerdx_id") or "")

        friend_ids: Set[str] = set()

        referred_by = str(actor.get("referred_by_nerdx_id") or "")
        if referred_by and referred_by in users_by_nerdx_id:
            referrer_chat_id = str(users_by_nerdx_id[referred_by].get("chat_id") or "")
            if referrer_chat_id:
                friend_ids.add(referrer_chat_id)

        if actor_nerdx_id:
            for row in all_users:
                if str(row.get("referred_by_nerdx_id") or "") == actor_nerdx_id:
                    cid = str(row.get("chat_id") or "")
                    if cid:
                        friend_ids.add(cid)

        if actor_id in friend_ids:
            friend_ids.remove(actor_id)

        return list(friend_ids)

    def _build_inactivity_message(self, student_name: str, hour: int) -> Tuple[str, str]:
        if hour < 12:
            return (
                f"Good morning, {student_name}",
                "Start with a quick 10-minute revision to build momentum today.",
            )
        if hour < 17:
            return (
                f"Midday check-in, {student_name}",
                "You haven't studied yet today. Do 5 quick questions now.",
            )
        return (
            f"You haven't studied today, {student_name}",
            "Spend 20 minutes now in NerdX and keep your progress streak alive.",
        )

    def _build_exam_plan(self, days_left: int, preferred_subjects: List[str]) -> str:
        friendly_subjects = [self._humanize_subject(s) for s in preferred_subjects[:3]]
        if not friendly_subjects:
            friendly_subjects = ["Mathematics", "Combined Science"]

        if len(friendly_subjects) == 1:
            s1 = friendly_subjects[0]
            if days_left > 60:
                return f"Focus on 40 minutes of {s1} concept review today."
            if days_left > 30:
                return f"Do 45 minutes of {s1} past-paper questions today."
            return f"Run a timed {s1} exam drill today and review all mistakes."

        s1, s2 = friendly_subjects[0], friendly_subjects[1]
        if days_left > 60:
            return f"Today's plan: 30 min {s1} concepts + 20 min {s2} flashcards."
        if days_left > 30:
            return f"Today's plan: 30 min {s1} past-paper practice + 30 min {s2} weak topics."
        return f"Today's plan: timed {s1} drill + targeted {s2} revision for exam readiness."

    @staticmethod
    def _humanize_subject(subject: str) -> str:
        s = str(subject or "").strip().replace("_", " ")
        if not s:
            return "Subject"
        return " ".join(part.capitalize() for part in s.split())

    @staticmethod
    def _first_name(user_row: Dict[str, Any]) -> str:
        raw = (
            user_row.get("name")
            or user_row.get("first_name")
            or user_row.get("full_name")
            or user_row.get("nerdx_id")
            or "Student"
        )
        text = str(raw).strip()
        if not text:
            return "Student"
        return text.split()[0][:40]

    @staticmethod
    def _normalize_subjects(value: Any) -> List[str]:
        if value is None:
            return []
        if isinstance(value, list):
            return [str(v).strip().lower() for v in value if str(v).strip()]
        if isinstance(value, str):
            parts = [p.strip().lower() for p in value.split(",")]
            return [p for p in parts if p]
        return []

    @staticmethod
    def _normalize_date_str(value: Any) -> Optional[str]:
        d = EngagementNotificationService._parse_date(value)
        return d.isoformat() if d else None

    @staticmethod
    def _parse_date(value: Any) -> Optional[date]:
        if value is None:
            return None
        if isinstance(value, date) and not isinstance(value, datetime):
            return value
        text = str(value).strip()
        if not text:
            return None
        try:
            # Handles yyyy-mm-dd and full iso datetime
            return datetime.fromisoformat(text.replace("Z", "+00:00")).date()
        except Exception:
            return None

    @staticmethod
    def _parse_datetime(value: Any) -> Optional[datetime]:
        if value is None:
            return None
        if isinstance(value, datetime):
            dt = value
        else:
            text = str(value).strip()
            if not text:
                return None
            try:
                dt = datetime.fromisoformat(text.replace("Z", "+00:00"))
            except Exception:
                return None

        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)

    @staticmethod
    def _clamp_int(value: Any, min_value: int, max_value: int, fallback: int) -> int:
        try:
            num = int(value)
        except Exception:
            return fallback
        return max(min_value, min(max_value, num))

    @staticmethod
    def _is_valid_expo_push_token(token: Any) -> bool:
        if not token or not isinstance(token, str):
            return False
        return token.startswith("ExponentPushToken[") or token.startswith("ExpoPushToken[")

    @staticmethod
    def _normalize_whatsapp_number(value: Any) -> Optional[str]:
        if value is None:
            return None
        text = str(value).strip()
        if not text:
            return None

        if text.startswith("whatsapp:"):
            text = text.split(":", 1)[1]

        digits = "".join(ch for ch in text if ch.isdigit() or ch == "+")
        if not digits:
            return None

        if digits.startswith("+"):
            return digits

        if digits.startswith("0") and len(digits) >= 10:
            # Zimbabwe local fallback (07xxxxxxxx -> +2637xxxxxxxx)
            return "+263" + digits[1:]

        if digits.isdigit():
            return f"+{digits}"

        return None

    @staticmethod
    def _parse_hours_env(env_key: str, default_csv: str) -> List[int]:
        raw = (os.getenv(env_key) or default_csv).strip()
        values: List[int] = []
        for part in raw.split(","):
            part = part.strip()
            if not part:
                continue
            try:
                hour = int(part)
            except Exception:
                continue
            if 0 <= hour <= 23:
                values.append(hour)
        if not values:
            values = [8, 13, 17]
        return sorted(list(set(values)))


engagement_notification_service = EngagementNotificationService()
