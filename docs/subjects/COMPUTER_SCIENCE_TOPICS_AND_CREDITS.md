# Computer Science O-Level: Topics and Credit System

## 1. Syllabus and topics

**Primary syllabus**: ZIMSEC O-Level Computer Science **7014** (theory; practical in Virtual Labs).  
Topic names and objectives follow the ZIMSEC syllabus. Cambridge O-Level 2210 can be supported via the same 11-topic structure.

**Topics** (from `constants.py` → `TOPICS["Computer Science"]` and `services/zimsec_cs_syllabus.py`):

| # | Topic name |
|---|------------|
| 1 | Hardware and Software |
| 2 | Application of Computer Science |
| 3 | Data Representation |
| 4 | Communication Networks and Internet Technologies |
| 5 | Security and Ethics |
| 6 | Systems Analysis and Design |
| 7 | Algorithm Design and Problem-Solving |
| 8 | Programming |
| 9 | Databases |
| 10 | Web Design and Internet Uses |
| 11 | Automated and Emerging Technologies |

- **Paper 1 (MCQ)**: Breadth of knowledge; prompts use `get_paper1_prompt_guidance()` and syllabus learning objectives.
- **Paper 2 (Structured)**: Deep understanding and problem-solving; prompts use `get_paper2_prompt_guidance()`.
- **Paper 3 (Practical)**: Not in this flow; covered in Virtual Labs later.
- **Theory only**: Database, web design, and programming **theory** are in scope; hands-on practicals are in Virtual Labs.

The quiz topics API (`GET /quiz/topics?subject=computer_science`) returns these with `subject: 'computer_science'`.

---

## 2. Credit structure (per-format, like other subjects)

Computer Science uses **per-format pricing** (aligned with how exam modes work elsewhere):

- **MCQ**: 0.3 credit (3 units) → **1 credit = 3 MCQs**
- **Structured**: 0.5 credit (5 units)
- **Essay**: 1 credit (10 units)
- **Exam mode**: same per question – MCQ 0.3, Structured 0.5, Essay 1

| Mode    | Format   | Action key                           | Cost (units) | Display |
|---------|----------|--------------------------------------|--------------|---------|
| Topical | MCQ      | `computer_science_topical_mcq`       | 3            | 0.3 credit |
| Topical | Structured | `computer_science_topical_structured` | 5          | 0.5 credit |
| Topical | Essay    | `computer_science_topical_essay`     | 10           | 1 credit |
| Exam    | MCQ      | `computer_science_exam_mcq`          | 3            | 0.3 credit |
| Exam    | Structured | `computer_science_exam_structured`   | 5          | 0.5 credit |
| Exam    | Essay    | `computer_science_exam_essay`        | 10           | 1 credit |

---

## 3. Flow

1. **Action key**  
   `_get_quiz_credit_action(..., cs_question_type)`  
   - If `subject == 'computer_science'`:
     - **Exam**: by `cs_question_type` → `computer_science_exam_mcq` (3), `computer_science_exam_structured` (5), `computer_science_exam_essay` (10).
     - **Topical**: by `cs_question_type` → `computer_science_topical_mcq` (3), `computer_science_topical_structured` (5), `computer_science_topical_essay` (10).

2. **Cost**  
   `advanced_credit_service.get_credit_cost(credit_action)`  
   - Config/DB/fallback: MCQ = 3 units, Structured = 5 units, Essay = 10 units.

3. **Deduction**  
   After a question is generated, `_deduct_credits_or_fail(user_id, credit_cost, 'quiz_generation', description)`.

4. **Frontend**  
   - `creditCalculator.ts`: for `computer_science`, returns 0.3 (MCQ), 0.5 (structured), 1 (essay) using `questionFormat` / `bioQuestionType`.
   - Record/voice: `supportsVoiceToText` includes `computer_science` so **record buttons** (VoiceMathInput) show in structured and essay input boxes.

---

## 4. Credit deduction for MCQs and Structured – path and Supabase

### 4.1 End-to-end flow (MCQ and Structured)

1. **Request**  
   `POST /quiz/generate` with `subject: 'computer_science'`, `question_type` (topical/exam), `question_format` or `question_type` (mcq/structured/essay).

2. **Action key** (`api/mobile.py` → `_get_quiz_credit_action`)  
   - `cs_question_type = (data.get('question_type') or question_format or 'mcq').lower()`  
   - Topical MCQ  → `'computer_science_topical_mcq'`  
   - Topical Structured → `'computer_science_topical_structured'`  
   - Exam MCQ/Structured use `computer_science_exam_mcq` / `computer_science_exam_structured`.

3. **Cost**  
   - `credit_cost = advanced_credit_service.get_credit_cost(credit_action)`  
   - MCQ: **3 units** (0.3 credit)  
   - Structured: **5 units** (0.5 credit)  
   - Sources: `config.py` CREDIT_COSTS, `database/credit_costs_db.py`, `services/advanced_credit_service._get_action_mapping()`.

4. **Deduction** (only after a question is successfully generated)  
   - `_deduct_credits_or_fail(g.current_user_id, int(credit_cost), 'quiz_generation', desc)`  
   - `desc` includes format for CS, e.g. `"Generated computer_science topical mcq question"` or `"Generated computer_science topical structured question"`.

5. **Persistence** (`database/external_db.py` → `deduct_credits_with_balance`)  
   - Prefer **RPC**: `POST .../rpc/deduct_credits_atomic` with `p_user_id`, `p_amount` (3 or 5), `p_transaction_type='quiz_generation'`, `p_description=desc`.  
   - The RPC (see `database/atomic_credit_deduction_migration.sql`) updates `users_registration.credits` / `purchased_credits` and **inserts a row into `credit_transactions`** with:
     - `user_id`, `transaction_type = 'quiz_generation'`, `amount = -p_amount` (-3 or -5), `description = desc`, `balance_before`, `balance_after`, `created_at`.
   - **Legacy path** (if RPC fails): PATCH `users_registration` and `user_stats`, then **POST** to `credit_transactions` with the same logical fields (`transaction_type`, `credits_change` = -amount, `description`, etc.).

### 4.2 “Added to Supabase” – where it’s stored

- **Balances**: `users_registration.credits` and `users_registration.purchased_credits` (and synced to `user_stats` in the legacy path).
- **Audit trail**: table **`credit_transactions`**.
  - Each deduction adds one row:
    - `transaction_type = 'quiz_generation'`
    - `description` e.g. `"Generated computer_science topical mcq question"` or `"Generated computer_science topical structured question"`
    - `amount` (or `credits_change`) = **-3** for MCQ, **-5** for Structured
  - So MCQ vs Structured is visible by **amount** (-3 vs -5) and by **description** (format is included for CS).

CS MCQ and Structured deductions use the same flow as other quiz generations and are written to Supabase via `deduct_credits_with_balance` (RPC or legacy), with every deduction recorded in `credit_transactions`.
