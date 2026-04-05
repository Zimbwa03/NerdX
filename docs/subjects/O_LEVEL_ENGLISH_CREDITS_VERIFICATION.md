# O Level English – Credit System Verification Report

**Date:** February 2, 2025  
**Status:** Production Ready ✅

---

## 1. Supabase Credit Costs (Verified via MCP)

All O Level English action keys are correctly configured in the `credit_costs` table:

| Action Key | Cost (units) | Credits | Status |
|------------|--------------|---------|--------|
| english_topical | 5 | 0.5 | ✅ Verified |
| english_comprehension | 20 | 2 | ✅ Verified |
| english_comprehension_grading | 20 | 2 | ✅ Verified |
| english_essay_writing | 20 | 2 | ✅ Verified (WhatsApp; mobile uses essay_marking) |
| english_essay_marking | 20 | 2 | ✅ Verified |
| english_summary_grading | 20 | 2 | ✅ Verified |

---

## 2. Credit Deduction Flow (Backend)

All O Level English features use the shared backbone:

- **Function:** `_deduct_credits_or_fail()` in `api/mobile.py`
- **Rule:** Credits are deducted **only after** the action succeeds

### Feature-by-Feature Audit

| Feature | Endpoint | Action Key | Deduction | Returns credits_remaining |
|---------|----------|------------|-----------|---------------------------|
| Topical quiz | POST /quiz/generate | english_topical | After question | ✅ question.credits_remaining |
| Comprehension generate | POST /english/comprehension | english_comprehension | After generation | ✅ data.credits_remaining |
| Comprehension grading | POST /english/comprehension/grade | english_comprehension_grading | After grading | ✅ data.credits_remaining |
| Summary grading | POST /english/summary/grade | english_summary_grading | After grading | ✅ data.credits_remaining |
| Essay marking | POST /english/essay/submit | english_essay_marking | After marking | ✅ data.credits_remaining |
| Teacher Mode (English) | POST /teacher/* | teacher_mode_* | After action | ✅ data.credits_remaining |

### Free Endpoints (No Deduction)

| Endpoint | Description |
|----------|-------------|
| GET /english/essay/free-response-topics | Topic list only |
| GET /english/essay/guided-composition | Prompt generation (lightweight) |
| POST /english/essay/extract-from-images | OCR for essay text (user pays on submit) |
| GET /english/essay/history | Fetch submission history |
| GET /english/essay/submission/:id | Fetch single submission |
| GET /english/essay/:id/report | Fetch report |

---

## 3. Frontend Credits Update

| Screen | Update Location | Status |
|--------|-----------------|--------|
| TopicsScreen | Before navigation to Quiz (English topical) | ✅ |
| QuizScreen | handleNext (English topical) | ✅ |
| EnglishComprehensionScreen | generateComprehension, gradeComprehension, gradeSummary | ✅ Fixed |
| EnglishEssayScreen | submitEssayForMarking | ✅ |

**Fix applied:** EnglishComprehensionScreen now updates credits after both comprehension grading and summary grading (each returns credits_remaining).

---

## 4. API Layer Fixes

**englishApi.ts:**
- `gradeComprehension` – merges `credits_remaining` from `response.data` into returned data
- `gradeSummary` – merges `credits_remaining` from `response.data` into returned data
- `GradingResult` and `SummaryGradingResult` – added `credits_remaining?: number`

---

## 5. Cost Resolution

- **Quiz:** `_get_quiz_credit_action("english", ...)` → `english_topical` (5 units)
- **Comprehension:** `advanced_credit_service.get_credit_cost('english_comprehension')` = 20 units
- **Comprehension grading:** `english_comprehension_grading` = 20 units
- **Summary grading:** `english_summary_grading` = 20 units
- **Essay marking:** `english_essay_marking` = 20 units

---

## 6. Production Readiness Checklist

- [x] All English action keys in Supabase
- [x] Credits deducted after success only
- [x] credits_remaining returned in all paid responses
- [x] Frontend updates user credits from responses
- [x] Comprehension + grading flows update credits
- [x] Essay marking updates credits
- [x] Free endpoints correctly have no deduction
