# Credit Deduction – All Subjects Verification

This document audits **every** subject and feature that deducts credits in the mobile API and confirms they use the backbone (`_deduct_credits_or_fail` → `deduct_credits_with_balance`) and return **credits_remaining** in the response.

---

## 1. Shared backbone (all subjects)

- **Deduction:** `_deduct_credits_or_fail(user_id, cost_units, transaction_type, description)` in `api/mobile.py`.
- **Implementation:** Calls `deduct_credits_with_balance` in `database/external_db.py` (RPC first, legacy fallback).
- **User resolution:** `user_id` (e.g. email from JWT) is resolved to `users_registration.chat_id` before any DB call.
- **Response:** On success, `credits_remaining` is the **post-deduction** balance (real-time when RPC is used).

---

## 2. Subject-by-subject audit (mobile API)

### 2.1 O Level Mathematics

| Endpoint / flow | Action key / cost | Deduction | Returns credits_remaining |
|-----------------|-------------------|-----------|---------------------------|
| `POST /quiz/generate` (subject=mathematics, topical/exam) | `math_topical` / `math_exam` via `_get_quiz_credit_action` | `_deduct_credits_or_fail` after question delivered | ✅ `question['credits_remaining']` |
| `POST /quiz/generate-stream` | `math_quiz` | `_deduct_credits_or_fail` on first `question` event | ✅ in SSE `data.credits_remaining` |
| `POST /exam/math/next` | `math_exam` | `_deduct_credits_or_fail` after question | ✅ `data.credits_remaining` |
| `POST /math/graph` | `math_graph_practice` | `_deduct_credits_or_fail` after graph URL | ✅ `data.credits_remaining` |
| Image solve (upload math problem) | `image_solve` | `_deduct_credits_or_fail` after solution | ✅ `data.credits_remaining` |
| Teacher Mode (Math) – start | `teacher_mode_start` | `_deduct_credits_or_fail` on session create | ✅ `data.credits_remaining` |
| Teacher Mode (Math) – follow-up | `teacher_mode_followup` | `_deduct_credits_or_fail` after AI reply | ✅ `data.credits_remaining` |
| Teacher Mode (Math) – PDF notes | `teacher_mode_pdf` | `_deduct_credits_or_fail` after PDF | ✅ `data.credits_remaining` |

**Cost source:** `advanced_credit_service.get_credit_cost(...)` and/or `_get_quiz_credit_action("mathematics", ...)`.

---

### 2.2 Combined Science (O Level)

| Endpoint / flow | Action key / cost | Deduction | Returns credits_remaining |
|-----------------|-------------------|-----------|---------------------------|
| `POST /quiz/generate` (subject=combined_science) | `combined_science_topical_mcq` / `_structured` / `combined_science_exam` via `_get_quiz_credit_action` | `_deduct_credits_or_fail` after question | ✅ `question['credits_remaining']` |
| Image question (every 6th when mix_images) | `get_image_question_credit_cost()` (Vertex) | Same deduction path | ✅ in question payload |
| CBT exam (`/exam/next` with subject=combined_science) | `_get_exam_question_cost_units('combined_science', ...)` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Teacher Mode (Science) – start/follow-up/PDF | `teacher_mode_start` / `teacher_mode_followup` / `teacher_mode_pdf` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Teacher multimodal (Science) | `teacher_mode_followup` | `_deduct_credits_or_fail` after service success | ✅ `data.credits_remaining` |

---

### 2.3 English (O Level)

| Endpoint / flow | Action key / cost | Deduction | Returns credits_remaining |
|-----------------|-------------------|-----------|---------------------------|
| `POST /quiz/generate` (subject=english) | `english_topical` via `_get_quiz_credit_action` | `_deduct_credits_or_fail` after question | ✅ `question['credits_remaining']` |
| English comprehension generate | `english_comprehension` | `_deduct_credits_or_fail` after generation | ✅ `data.credits_remaining` |
| English comprehension grading | `english_comprehension_grading` | `_deduct_credits_or_fail` after grading | ✅ `data.credits_remaining` |
| English summary grading | `english_summary_grading` | `_deduct_credits_or_fail` after grading | ✅ `data.credits_remaining` |
| English essay marking | `english_essay_marking` | `_deduct_credits_or_fail` after marking | ✅ `data.credits_deducted` + `credits_remaining` |
| Teacher Mode (English) – start/follow-up/PDF | Same as Math/Science | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |

---

### 2.4 A-Level (Pure Math, Chemistry, Physics, Biology)

| Endpoint / flow | Action key / cost | Deduction | Returns credits_remaining |
|-----------------|-------------------|-----------|---------------------------|
| `POST /quiz/generate` (subject=a_level_pure_math, a_level_chemistry, a_level_physics, a_level_biology) | `a_level_*_topical_mcq` / `_structured` / `_exam` or `a_level_biology_{qt}_{mcq|structured|essay}` via `_get_quiz_credit_action` | `_deduct_credits_or_fail` after question | ✅ `question['credits_remaining']` |
| Image question (A-Level science) | `get_image_question_credit_cost()` | Same deduction path | ✅ in question payload |
| CBT exam (`/exam/next`) | `_get_exam_question_cost_units(subject, 'A_LEVEL', question_type)` — Biology MCQ 3 units, rest 5 | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Teacher Mode (any A-Level subject) | `teacher_mode_*` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |

**Exam cost helper:** `_get_exam_question_cost_units` and `_get_exam_session_cost_units` in `api/mobile.py` encode per-subject, per-level costs (A-Level Biology MCQ 0.25 credit, others 0.5 credit).

---

### 2.5 Cross-subject / tools

| Endpoint / flow | Action key / cost | Deduction | Returns credits_remaining |
|-----------------|-------------------|-----------|---------------------------|
| CBT exam create | No deduction at create; only validation via `_get_exam_session_cost_units` | — | N/A (credits taken per question in `/exam/next`) |
| CBT exam next (`/exam/next`) | `_get_exam_question_cost_units(session.subject, session.level, question_type)` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Image solve (any subject) | `image_solve` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Teacher Mode start | `teacher_mode_start` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Teacher Mode message (follow-up) | `teacher_mode_followup` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Teacher Mode PDF | `teacher_mode_pdf` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Teacher multimodal | `teacher_mode_followup` | `_deduct_credits_or_fail` (fixed: was not deducting) | ✅ `data.credits_remaining` |
| Virtual lab knowledge-check | `virtual_lab_knowledge_check` | `_deduct_credits_or_fail` (total = cost × delivered count) | ✅ `credits_remaining` in top-level JSON |
| Flashcards | `flashcard_single` (per card or batch) | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Deep research | `deep_research` / `project_deep_research` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Project web search | `project_web_search` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Project transcribe | `project_transcribe` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |
| Math graph (custom / LP / analysis) | `math_graph_practice` | `_deduct_credits_or_fail` | ✅ `data.credits_remaining` |

---

## 3. Cost resolution (all subjects)

- **Quiz:** `credit_action = _get_quiz_credit_action(subject, question_type, question_format, bio_question_type)` then `advanced_credit_service.get_credit_cost(credit_action)`. Image questions use `get_image_question_credit_cost()` when applicable.
- **Exam:** `_get_exam_session_cost_units(subject, level, question_mode, total_questions)` for validation; `_get_exam_question_cost_units(subject, level, question_type)` for per-question deduction.
- **All other features:** `advanced_credit_service.get_credit_cost(action_key)` with the key from `advanced_credit_service._get_action_mapping()`.

Action keys for every subject/feature are in `database/credit_costs_db.py` (defaults + fallbacks) and in `services/advanced_credit_service.py` (`_get_action_mapping`).

---

## 4. Fix applied in this pass

- **Teacher multimodal (`POST /teacher/multimodal`):**  
  Previously did **not** check or deduct credits; it only returned `result.get('credits_remaining')` from the service (which was current balance, not post-deduction).  
  **Change:** Added credit check (same as teacher/message), and after a successful `process_multimodal_message`, the mobile endpoint calls `_deduct_credits_or_fail(g.current_user_id, credit_cost, 'teacher_mode_followup', 'Teacher multimodal message')` and returns that `credits_remaining` in `data.credits_remaining`.

---

## 5. Consistency checklist

- [x] Every mobile deduction path uses `_deduct_credits_or_fail(g.current_user_id, …)` (or `user_id` in SSE).
- [x] Every success response that follows a deduction includes `credits_remaining` (in `data` or in the question object).
- [x] User identity is resolved via `get_user_registration` / `_resolve_credits_user_id` in `get_user_credits` and `deduct_credits_with_balance` so email/phone/chat_id all work.
- [x] Quiz cost is subject-aware via `_get_quiz_credit_action`.
- [x] Exam cost is subject- and level-aware via `_get_exam_question_cost_units` / `_get_exam_session_cost_units`.
- [x] Teacher multimodal now uses the same backbone as teacher/message (check, deduct, return `credits_remaining`).

---

## 6. References

- **Backbone flow:** `CREDIT_DEDUCTION_BACKBONE.md`
- **Per-feature costs and AI usage:** `CREDITS_AND_AI_FEATURES_ANALYSIS.md`
- **RPC and DB:** `database/atomic_credit_deduction_migration.sql`, `database/external_db.py` (`deduct_credits_with_balance`, `_resolve_credits_user_id`).
