# Engagement Notifications Setup

## 1. Run migration
Execute `sql/engagement_notifications_migration.sql` in Supabase SQL Editor.

This creates:
- `user_notification_preferences`
- `mobile_push_tokens`
- `engagement_campaign_log`

## 2. Backend environment variables
Set these on your backend host:

- `ENGAGEMENT_CRON_SECRET` (required): shared secret for campaign runner endpoint.
- `ENGAGEMENT_TIMEZONE` (optional, default `Africa/Harare`)
- `ENGAGEMENT_REMINDER_HOURS` (optional, default `8,13,17`)
- `ENGAGEMENT_WEEKLY_REPORT_HOUR` (optional, default `18`)
- `ENGAGEMENT_EXAM_COUNTDOWN_HOUR` (optional, default `9`)

## 3. Mobile app push requirements
- Expo push works after the app registers a token through:
  - `POST /api/mobile/notifications/push-token`
- Registration is now automatic after user authentication.

## 4. Campaign trigger endpoint (cron)
`POST /api/mobile/notifications/engagement/run`

Headers:
- `X-Engagement-Secret: <ENGAGEMENT_CRON_SECRET>`

Body (optional):
```json
{
  "force": false,
  "dry_run": false
}
```

## 5. Suggested cron schedule
Run every hour (or every 30 minutes). The service enforces time-window logic and dedupe.

If you prefer explicit runs:
- `08:00` local: inactivity reminder wave
- `13:00` local: inactivity reminder wave
- `17:00` local: inactivity reminder wave + WhatsApp for inactive students
- `Sunday 18:00` local: weekly report
- `09:00` local: exam countdown reminders
