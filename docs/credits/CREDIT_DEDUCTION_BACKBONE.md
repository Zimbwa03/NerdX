# Credit Deduction Backbone

This document describes how credits are deducted, how remaining balance is returned in real time, and how to verify it per subject (starting with O Level Mathematics).

---

## 1. Flow overview

1. **Mobile** (or any caller) uses `_deduct_credits_or_fail(user_id, cost_units, transaction_type, description)` in `api/mobile.py`.
2. That calls **`deduct_credits_with_balance`** in `database/external_db.py`, which:
   - Resolves `user_id` (email, phone, or chat_id) to **`chat_id`** in `users_registration` via `get_user_registration(user_id)`.
   - Tries **Supabase RPC `deduct_credits_atomic`** first.
   - If RPC returns success and `credits_remaining`, that value is returned as the **real-time** new balance (no extra read).
   - If RPC fails or is unavailable, falls back to **legacy** read‑then‑patch; on success returns `(True, new_total_units)`.
3. **`_deduct_credits_or_fail`** returns:
   - **`None`** if deduction failed.
   - **Display credits remaining** (int): from RPC/legacy `new_units` when present, otherwise from a follow-up `get_user_credits(user_id)`.

So **credits_remaining** in API responses is always **after** the deduction and is **real-time** when the RPC is used.

---

## 2. RPC contract (Supabase)

- **Function:** `deduct_credits_atomic(p_user_id, p_amount, p_transaction_type, p_description)`
- **Returns:** JSONB, e.g.  
  - Success: `{ "success": true, "credits_remaining": <int>, "deducted": <int>, ... }`  
  - Failure: `{ "success": false, "error": "<message>", "credits_remaining": <int or null>, ... }`
- **Lookup:** `users_registration` is queried with `WHERE chat_id = p_user_id`.  
  `p_user_id` must be the **chat_id** (or the same value used as chat_id for mobile, e.g. email).

Backend expects **`credits_remaining`** (not `new_balance`) and **`error`** (not `message`) on failure.  
RPC existence was checked via Supabase MCP: `deduct_credits_atomic` exists.

---

## 3. User ID resolution

- **Mobile** sends JWT with `user_id` = email (or phone) for many flows.
- **Credits** are stored and keyed by **`users_registration.chat_id`**.
- **`_resolve_credits_user_id(user_id)`** and, where needed, **`get_user_registration(user_id)`** ensure:
  - Lookup is done by `chat_id`, then `whatsapp_number`, then `email`.
  - The resolved **chat_id** is used for all credit DB operations (RPC and legacy).

So deduction and balance work for both **email (mobile)** and **chat_id (WhatsApp)**.

---

## 4. Per-subject behaviour (e.g. O Level Mathematics)

- **Cost** is determined by **action key** (e.g. `math_topical`, `math_exam`, `math_quiz`, `math_graph_practice`, `image_solve`, `teacher_mode_*`).  
  See **`CREDITS_AND_AI_FEATURES_ANALYSIS.md`** for each subject and feature.
- **Deduction** is always:
  1. Resolve `user_id` → `creds_id`.
  2. Try RPC `deduct_credits_atomic(creds_id, cost_units, transaction_type, description)`.
  3. If RPC success and `credits_remaining` present → use it as real-time balance.
  4. If RPC fails → legacy path; on success return `(True, new_total_units)`.
- **Response** to the client includes `credits_remaining` (display units) after that deduction.

No subject-specific logic lives in the deduction path; only the **action key** and **cost** change per feature.

---

## 5. Render logs and RPC failures

If Render logs show **“RPC has failed”** or similar:

1. **Confirm RPC exists**  
   In Supabase SQL Editor or MCP:  
   `SELECT proname FROM pg_proc WHERE proname = 'deduct_credits_atomic';`
2. **Confirm schema**  
   RPC must match your **users_registration** schema (columns used: `credits`, `purchased_credits`, `chat_id`).  
   If your app uses **free** and **purchased** in separate columns, the RPC must do the same.  
   Migration: `database/atomic_credit_deduction_migration.sql`.
3. **Confirm `p_user_id`**  
   For mobile, `user_id` is resolved to `chat_id` before calling the RPC.  
   Ensure `users_registration.chat_id` is set consistently (e.g. to email for email logins).
4. **Logs**  
   Backend logs:
   - Success: `"RPC credit deduction successful for {user_id} (-{amount}). credits_remaining=..."`  
   - RPC failure: `"RPC deduction failed for {user_id}: {err}"` or `"RPC call failed (Status ...): ..."`  
   - Fallback: `"Using legacy deduction method (non-atomic)"`.

---

## 6. Files and functions

| Role | File | Function / behaviour |
|------|------|----------------------|
| Entry for mobile | `api/mobile.py` | `_deduct_credits_or_fail` → uses `deduct_credits_with_balance`, then returns display `credits_remaining` or `None` |
| Deduction + balance | `database/external_db.py` | `deduct_credits_with_balance` → RPC then legacy; returns `(bool, new_units\|None)` |
| Backward compatibility | `database/external_db.py` | `deduct_credits` → calls `deduct_credits_with_balance`, returns only `bool` |
| User resolution | `database/external_db.py` | `_resolve_credits_user_id`, `get_user_registration` |
| Balance read | `database/external_db.py` | `get_user_credits` → uses resolved `chat_id` for lookup |
| RPC definition | Supabase | `deduct_credits_atomic` (see `database/atomic_credit_deduction_migration.sql`) |
| Cost and features | `CREDITS_AND_AI_FEATURES_ANALYSIS.md` | Per-feature costs and when deduction runs (e.g. O Level Mathematics) |

---

*Ensuring deduction works and credits_remaining is correct and real-time is the backbone of the system; all flows use this path.*
