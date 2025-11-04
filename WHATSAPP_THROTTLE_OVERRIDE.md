# WhatsApp Throttle Override

## Overview
To ensure critical bot conversations (registration, consent, payment, etc.) are never blocked, the WhatsApp quality monitor now supports a global throttle override and expanded critical message detection.

## 1. Disable Throttle via Environment Flag
- **Environment variable:** `DISABLE_WHATSAPP_THROTTLE`
- **Values:**
  - `true` (case-insensitive) – force-disable all quality throttling checks.
  - Any other value – keep automatic throttling enabled (default behaviour).
- **Usage:** Set the variable in Render/production environment and redeploy. The service also re-reads the variable every ~30 seconds, so toggling it does not require a full restart.
- **Logging:** When the override is active you will see `WhatsApp throttle override active - allowing message despite quality metrics` in the logs; throttle checks are skipped but tracking remains.

## 2. Critical Messages Always Allowed
`services/whatsapp_service.py` now treats the following as critical and bypasses both the quality monitor throttle and the per-user message chain throttle:
- Registration commands (e.g. `_registration`, `_consent`, `_start`, `/start`).
- Registration dialog phrases ("provide your first name", "enter a valid surname", "NerdX ID", etc.).
- Existing consent and payment keywords (Paynow, EcoCash, credits, packages, etc.).
- Any interactive/menu message that contains registration, consent, or payment keywords or starts with `_`/`/`.

This guarantees that registration and payment flows continue even if overall quality metrics are temporarily poor.

## 3. Operational Notes
- The override should be used sparingly because WhatsApp may rate-limit accounts with consistently poor metrics; treat it as an emergency switch.
- The quality monitor still records metrics and raises alerts so teams can monitor complaint/response rates while the override is active.
- If you see blocked-message warnings for other content, consider adding the appropriate keywords so the message is whitelisted. All keyword lists are located near the top of `send_message` and `send_interactive_message` in `services/whatsapp_service.py`.

## 4. Testing Checklist
- [x] Messages with `_registration` go through even when throttling is active.
- [x] Paynow/payment buttons continue to work.
- [x] Setting `DISABLE_WHATSAPP_THROTTLE=true` allows all traffic while logging the override.
- [x] No linter issues.
