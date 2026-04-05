# Credit System Deep Audit – NerdX

**Purpose:** Ensure credit deduction is tight everywhere AI generates content; align frontend display with Supabase; list all features that use AI but do not charge.

---

## 1. Summary

| Item | Status |
|------|--------|
| **Backbone** | ✅ Single path: `_deduct_credits_or_fail` → `deduct_credits_with_balance` → Supabase RPC `deduct_credits_atomic` (or legacy). |
| **Frontend ↔ Supabase** | ✅ Balance source is Supabase `users_registration` (credits + purchased_credits in **units**). API converts to display via `_credits_display()`. |
| **Supabase `credit_costs`** | ⚠️ **Mismatch:** DB has 29 rows with costs in a **different scale** than backend fallback (e.g. math_topical cost 1 in DB vs 5 or 10 units in config/fallback). See Section 4. |
| **AI not charging** | ✅ **Programming Lab AI** – backend route added: `POST /api/mobile/virtual-programming-lab/ai` with 1 credit (10 units) deduction after success. Add `programming_lab_ai` to Supabase `credit_costs` for consistency. |

---

## 2. Credit Data in Supabase (via MCP)

### 2.1 Tables involved

- **`users_registration`** – `credits` (free), `purchased_credits`; both stored in **units** (1 credit = 10 units).
- **`user_stats`** – mirror of credits for stats; kept in sync on deduction.
- **`credit_transactions`** – every deduction/addition: `user_id`, `action`, `transaction_type`, `credits_change` (negative for deductions), `balance_before`, `balance_after`, `description`, `transaction_date`.
- **`credit_costs`** – action_key, cost, category, component, description (29 rows). **Cost scale may not be units** – see Section 4.

### 2.2 Supabase `credit_costs` (all 29 rows)

| action_key | cost (DB) | category |
|------------|-----------|----------|
| a_level_biology_exam | 8 | A-Level |
| a_level_biology_topical | 5 | A-Level |
| a_level_chemistry_exam | 8 | A-Level |
| a_level_chemistry_topical | 5 | A-Level |
| a_level_physics_exam | 8 | A-Level |
| a_level_physics_topical | 5 | A-Level |
| a_level_pure_math_exam | 8 | A-Level |
| a_level_pure_math_topical | 5 | A-Level |
| audio_feature | 10 | Audio |
| check_balance | 1 | System |
| combined_science_exam | 2 | Combined Science |
| combined_science_topical | 1 | Combined Science |
| english_comprehension | 20 | English |
| english_comprehension_grading | 10 | English |
| english_essay_marking | 20 | English |
| english_essay_writing | 20 | English |
| english_summary_grading | 10 | English |
| english_topical | 5 | English |
| help_command | 1 | System |
| image_generation | 2 | Vision |
| image_solve | 2 | Mathematics |
| math_exam | 2 | Mathematics |
| math_graph_practice | 3 | Mathematics |
| math_topical | 1 | Mathematics |
| menu_navigation | 1 | System |
| ocr_solve | 2 | Vision |
| registration_step | 1 | System |
| settings_access | 1 | System |
| voice_chat | 10 | Audio |

**Note:** Backend expects **units** (10 units = 1 credit). If Supabase `credit_costs.cost` is in “display credits” or another scale, deductions will be wrong until aligned.

### 2.3 Top transaction types (Supabase `credit_transactions` – deductions only)

| transaction_type | count | total_units_deducted |
|------------------|-------|----------------------|
| voice_chat | 636 | 6,362 |
| quiz_generation | 533 | 2,132 |
| teacher_mode_followup_usage | 142 | 694 |
| teacher_mode_start | 211 | 623 |
| exam_question | 146 | 624 |
| teacher_mode_followup | 174 | 502 |
| math_graph_practice | 106 | 318 |
| project_assistant_followup_usage | 175 | 848 |
| teacher_mode_pdf_usage | 77 | 385 |
| … (others) | … | … |

---

## 3. Frontend vs Supabase – How They Stay in Sync

- **Source of truth:** `users_registration.credits` + `users_registration.purchased_credits` (both in **units**).
- **Backend:** `get_user_credits(user_id)` and `get_credit_breakdown(user_id)` read from Supabase; mobile API uses `_credits_display(units)` so responses send **whole-credit display** (e.g. 1500 units → 150 credits).
- **Deduction:** `deduct_credits_with_balance(user_id, amount_units, transaction_type, description)` writes to Supabase (RPC or legacy) and logs to `credit_transactions`.
- **Frontend:** Uses `credits_remaining` / balance from API and `updateUser({ credits: ... })` so the displayed balance is the same as backend/Supabase once the user has performed an action that returns `credits_remaining`. Initial load uses `GET /api/mobile/credits/balance` (from same Supabase-backed `get_user_credits`).

**Recommendation:** Ensure mobile passes a consistent `user_id` that resolves to `users_registration.chat_id` (e.g. via `_resolve_credits_user_id` / registration lookup) so balance and transactions always match one row in Supabase.

---

## 4. Credit Costs: Supabase vs Config vs Fallback (Units)

Backend uses **units** everywhere (1 credit = 10 units). Sources of cost:

1. **Mobile:** `advanced_credit_service.get_credit_cost(action)` → `credit_cost_service.get_credit_cost(mapped_action)` in `database/credit_costs_db.py` → **DB first, then fallback_costs** (in units).
2. **WhatsApp:** Same service but `platform='whatsapp'` → `Config.CREDIT_COSTS` (units).

**Problem:** Supabase `credit_costs` has e.g. `math_topical = 1`, `combined_science_topical = 1`. If that “1” is treated as **units**, users are charged 0.1 credit per question instead of 1 credit (10 units). If the DB is in “tenths of credits,” then 1 = 1 unit and we are undercharging. The **fallback_costs** in `credit_costs_db.py` use full units (e.g. math_topical 5, math_graph_practice 10). So:

- Either **Supabase `credit_costs` must store costs in units** and be updated to match fallback/config (e.g. math_topical = 5 or 10),  
- Or the backend must **multiply DB cost by 10** when reading from Supabase so that “1” in DB = 10 units.

**Action:** Decide a single convention (recommend: **store units in Supabase**), then either migrate `credit_costs` to unit values or add a conversion in `credit_costs_db.get_credit_cost()` when reading from DB.

---

## 5. All Features Where Credits Are Deducted (Mobile API)

Every row below uses `_deduct_credits_or_fail(...)` (or equivalent) **after** success.

| Feature | Endpoint / flow | Action key / transaction_type | When deducted |
|---------|------------------|-------------------------------|---------------|
| Quiz generate (all subjects) | POST /quiz/generate | _get_quiz_credit_action(…) → quiz_generation | After question payload |
| Quiz stream | POST /quiz/generate-stream | math_quiz | On first question event |
| Exam next | POST /quiz/exam/next, CBT | exam_question / _get_exam_question_cost_units | After question |
| Math graph | POST /math/graph | math_graph_practice | After graph URL |
| Image solve | POST /image/upload (solve) | image_solve | After solution |
| Teacher start | POST /teacher/start | teacher_mode_start | On session create |
| Teacher message | POST /teacher/message | teacher_mode_followup | After AI reply |
| Teacher multimodal | POST /teacher/multimodal | teacher_mode_followup | After success |
| Teacher PDF | (teacher flow) | teacher_mode_pdf | After PDF sent |
| Virtual lab knowledge-check | POST /virtual-lab/knowledge-check | virtual_lab_knowledge_check | After questions delivered |
| Geo maps feedback | POST /virtual-lab/geo-maps-feedback | geo_maps_feedback | After AI feedback |
| Flashcards | (flashcard flow) | flashcard_single | Per card/batch |
| Project assistant start/follow-up | project_assistant_service | project_assistant_start / project_assistant_followup | Per message/response |
| Project web search / deep research / transcribe / image gen | (project assistant) | project_web_search, project_deep_research, project_transcribe, project_image_generation | Per use |
| English comprehension | POST /english/comprehension | english_comprehension | After generation |
| English comprehension grade | POST /english/comprehension/grade | english_comprehension_grading | After grading |
| English summary grade | POST /english/summary/grade | english_summary_grading | After grading |
| English essay submit/marking | POST /english/essay/submit etc. | english_essay_marking, english_essay_writing | After submit/marking |
| Audio / voice | (audio/voice endpoints) | audio_feature, voice_chat | Per use |

---

## 6. AI Features NOT Charging (Gaps – Must Fix)

### 6.1 Programming Lab AI – **FIXED (route + deduction added)**

- **Where AI runs:** `services/programming_lab_ai_service.py` – Vertex (Gemini) + DeepSeek for code help/debug/explain/suggest-test/fix-error/general-question.
- **Frontend:** `NerdXApp` calls `POST /api/mobile/virtual-programming-lab/ai` via `programmingLabAiApi.ask()`.
- **Backend (implemented):** Route `POST /api/mobile/virtual-programming-lab/ai` in `api/mobile.py`:
  - Requires auth; uses `g.current_user_id`.
  - Cost: `programming_lab_ai` = 10 units (1 credit) from config and fallback.
  - Checks balance; returns 402 if insufficient.
  - Calls `programming_lab_ai_service.process_request(payload)`; on success deducts via `_deduct_credits_or_fail(..., 'programming_lab_ai', 'Programming Lab AI')` and returns `data.credits_remaining` and `data.credit_cost`.
- **Remaining:** Add row to Supabase `credit_costs`: `action_key='programming_lab_ai', cost=10, category='Virtual Lab', component='Programming Lab AI', description='1 credit per AI request'`.

### 6.2 Virtual Lab “execute” (code execution)

- **Frontend:** `programmingLabApi` calls `POST /api/mobile/virtual-programming-lab/execute`.
- **Backend:** No such route in `api/mobile.py`. If execution is done server-side with AI (e.g. for feedback), that path should also require auth and deduct credits; if it’s pure run-only, you may still want a small charge or keep it free by policy.

### 6.3 Offline AI (Phi-3 on device)

- **Where:** `NerdXApp/src/services/OfflineAIService.ts` – on-device Phi-3.
- **Charging:** No server call, so no central deduction. If you want to “charge” for offline use, you’d need a separate design (e.g. deduct when app syncs usage or cap free offline uses). Noted as policy/design gap, not a missing backend deduction.

---

## 7. Credit Cost List (Backend – Units) for Every Feature

From `config.py` and `database/credit_costs_db.py` fallback (1 credit = 10 units):

| Action key | Config (units) | Fallback (units) | Supabase cost | Note |
|------------|----------------|------------------|---------------|------|
| menu_navigation, help_command, check_balance, settings_access, registration_step | 10 | 10 | 1 | Bundled commands; DB scale likely wrong |
| combined_science_* | 3–10 | 3–5 | 1–2 | Align DB to units |
| computer_science_* | 3, 5, 10 | 3, 5, 10 | — | Not in Supabase list; fallback used |
| math_topical, math_exam, math_quiz | 10 | 5 | 1, 2 | Align DB to units |
| math_graph_practice | 10 | 10 | 3 | Align DB to 10 |
| english_topical | 10 | 5 | 5 | Align |
| teacher_mode_start, teacher_mode_followup | 10 | 1 | — | DB missing; fallback 1 unit (0.1 cr) |
| teacher_mode_pdf | 20 | 20 | — | DB missing |
| project_assistant_* | 10, 20 | 1, 20, 30 | — | DB missing |
| flashcard_single | 10 | 3 | — | DB missing |
| virtual_lab_knowledge_check | 10 | 3 | — | DB missing |
| geo_maps_feedback | 10 | 10 | — | DB missing |
| english_comprehension, essay_marking, etc. | 10–20 | 10–20 | 10–20 | Partially in DB |
| audio_feature, voice_chat | 20 | 20 | 10 | Align |
| image_solve, ocr_solve, image_generation | 20 | 20 | 2 | DB 2 vs 20 units |
| a_level_* | 3–20 | 3–10 | 5, 8 | Align |
| **programming_lab_ai** | — | — | — | **Missing everywhere – add and charge** |

---

## 8. Recommendations (Priority)

1. **Align Supabase `credit_costs` with units**  
   Update all 29 rows so `cost` is in **units** (same as `config`/fallback), or add a single conversion in `credit_costs_db.get_credit_cost()` when reading from DB.

2. **Programming Lab AI (done)**  
   - Route `POST /api/mobile/virtual-programming-lab/ai` added with credit check and deduction (1 credit per request).  
   - Add `programming_lab_ai` to Supabase `credit_costs` (cost=10 units) for consistency.

3. **Clarify Virtual Lab execute**  
   Implement or document `virtual-programming-lab/execute`; if it uses AI, add credit check and deduction.

4. **Single source for cost**  
   Prefer Supabase `credit_costs` as source of truth for mobile (with units) and keep config/fallback only for WhatsApp and as fallback when DB fails.

5. **Frontend credit info**  
   `creditsApi.getCreditInfo()` calls `/api/mobile/credits/info`, which does not exist. Either add `GET /api/mobile/credits/info` (e.g. returning `get_credit_breakdown` + display) or switch the app to use `/api/mobile/credits/balance` and other existing endpoints.

---

## 9. Quick Reference – Deduction Flow

```
Mobile request (e.g. generate question)
  → Check: get_user_credits(user_id) >= cost_units
  → Execute AI/feature
  → On success: _deduct_credits_or_fail(user_id, cost_units, transaction_type, description)
       → deduct_credits_with_balance(...)
          → Supabase RPC deduct_credits_atomic(...) [preferred]
          → or legacy: PATCH users_registration + user_stats, POST credit_transactions
  → Response: credits_remaining = _credits_display(new_units)
```

All persistent balance and transaction data is in Supabase; frontend should match as long as user identity and units are consistent.
