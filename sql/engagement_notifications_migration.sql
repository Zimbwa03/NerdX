-- Engagement notifications schema (mobile push + preferences + campaign dedupe log)
-- ALREADY APPLIED to Supabase production via MCP on 2026-02-14.
-- Kept here for reference and reproducibility.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================================
-- 1. User notification preferences
-- =========================================================================
CREATE TABLE IF NOT EXISTS user_notification_preferences (
    user_id TEXT PRIMARY KEY,
    preferred_subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
    exam_level TEXT NOT NULL DEFAULT 'O Level',
    target_exam_date DATE NULL,
    daily_question_goal INTEGER NOT NULL DEFAULT 10,
    study_time_goal_minutes INTEGER NOT NULL DEFAULT 30,
    difficulty_preference TEXT NOT NULL DEFAULT 'adaptive',
    notification_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    notification_achievements BOOLEAN NOT NULL DEFAULT TRUE,
    notification_tips BOOLEAN NOT NULL DEFAULT TRUE,
    theme_preference TEXT NOT NULL DEFAULT 'system',
    school_name TEXT NULL,
    grade_level TEXT NULL,
    whatsapp_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    social_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_report_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    exam_countdown_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_frequency_per_day INTEGER NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_exam_date
    ON user_notification_preferences (target_exam_date);

ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 2. Mobile push tokens
-- =========================================================================
CREATE TABLE IF NOT EXISTS mobile_push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    supabase_user_id TEXT NULL,
    expo_push_token TEXT NOT NULL UNIQUE,
    platform TEXT NULL,
    device_id TEXT NULL,
    app_version TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mobile_push_tokens_user_id
    ON mobile_push_tokens (user_id);

CREATE INDEX IF NOT EXISTS idx_mobile_push_tokens_active
    ON mobile_push_tokens (is_active) WHERE is_active = TRUE;

ALTER TABLE mobile_push_tokens ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 3. Engagement campaign log (dedupe + audit)
-- =========================================================================
CREATE TABLE IF NOT EXISTS engagement_campaign_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    campaign_type TEXT NOT NULL,
    dedupe_key TEXT NOT NULL,
    channel TEXT NOT NULL,
    payload JSONB NULL,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, campaign_type, dedupe_key, channel)
);

CREATE INDEX IF NOT EXISTS idx_engagement_campaign_log_user_id
    ON engagement_campaign_log (user_id);

CREATE INDEX IF NOT EXISTS idx_engagement_campaign_log_sent_at
    ON engagement_campaign_log (sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_engagement_campaign_log_type_sent
    ON engagement_campaign_log (campaign_type, sent_at DESC);

ALTER TABLE engagement_campaign_log ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 4. Retention cleanup function (keeps last 90 days of campaign logs)
--    Call via: SELECT cleanup_engagement_campaign_log();
--    Schedule with pg_cron or an external cron job.
-- =========================================================================
CREATE OR REPLACE FUNCTION cleanup_engagement_campaign_log()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM engagement_campaign_log
    WHERE sent_at < NOW() - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;
