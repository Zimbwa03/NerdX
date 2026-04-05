# A-Level Chemistry – Credit System Verification Report

**Date:** February 2, 2025  
**Status:** Production Ready ✅

---

## 1. Credit Costs (per FEATURE_CREDITS_TABLE)

| Action Key | Cost (units) | Credits |
|------------|--------------|---------|
| a_level_chemistry_topical_mcq | 5 | 0.5 |
| a_level_chemistry_topical_structured | 5 | 0.5 |
| a_level_chemistry_exam | 5 | 0.5 |

**Supabase:** All four keys present (including generic `a_level_chemistry_topical` for backward compatibility):
- `a_level_chemistry_topical_mcq` – 5 units ✅
- `a_level_chemistry_topical_structured` – 5 units ✅
- `a_level_chemistry_topical` – 5 units ✅
- `a_level_chemistry_exam` – 5 units ✅

**Fallback:** `credit_costs_db.py` has all keys at 5 units.

---

## 2. Credit Deduction Flow (Backend)

- **Function:** `_deduct_credits_or_fail()` in `api/mobile.py`
- **Action mapping:** `_get_quiz_credit_action("a_level_chemistry", qt, qf)` returns:
  - Exam: `a_level_chemistry_exam`
  - Topical: `a_level_chemistry_topical_structured` or `a_level_chemistry_topical_mcq` based on `question_format`

### Feature-by-Feature Audit

| Feature | Endpoint | Action Key | Deduction | Returns credits_remaining |
|---------|----------|------------|-----------|---------------------------|
| Topical MCQ | POST /quiz/generate | a_level_chemistry_topical_mcq | ✅ After question | ✅ question.credits_remaining |
| Topical Structured | POST /quiz/generate | a_level_chemistry_topical_structured | ✅ After question | ✅ |
| Exam (MCQ/Structured) | POST /quiz/generate | a_level_chemistry_exam | ✅ After question | ✅ |
| Image question | POST /quiz/generate | image_solve (10 units) | ✅ After question | ✅ |
| CBT exam (per question) | POST /exam/next | _get_exam_question_cost_units | ✅ After question | ✅ |

---

## 3. CBT Exam Cost Logic

`_get_exam_question_cost_units("a_level_chemistry", level, question_type)`:
- **MCQ / STRUCTURED:** 5 units (0.5 credit) – standard A-Level (non-biology)

---

## 4. Fixes Applied

1. **Supabase `credit_costs`**
   - **Before:** Only `a_level_chemistry_exam` and `a_level_chemistry_topical` existed.
   - **After:** Inserted `a_level_chemistry_topical_mcq` and `a_level_chemistry_topical_structured` (5 units each).
   - Backend was already using per-format keys; fallback in `credit_costs_db.py` applied when keys were missing. Now Supabase is the source of truth.

---

## 5. Frontend Credits Update

| Screen | Update Location | Status |
|--------|-----------------|--------|
| QuizScreen | handleNextQuestion – uses `newQuestion.credits_remaining` from generateQuestion | ✅ |
| QuizScreen | Exam mode initial fetch – uses `firstQuestion.credits_remaining` from getNextExamQuestion | N/A (Chemistry uses /quiz/generate for topical; CBT uses ExamSessionScreen) |
| ExamSessionScreen (CBT) | loadNextQuestion – uses `response.credits_remaining` from examApi.getNextQuestion | ✅ |
| creditCalculator.ts | calculateQuizCreditCost('a_level_chemistry') returns 1 credit (pre-check) | ✅ |

**Note:** A-Level Chemistry uses the shared **QuizScreen** (not a dedicated Chemistry screen). Topical and exam-style questions go through `/quiz/generate`. CBT exams use ExamSessionScreen + `/exam/next`.

---

## 6. Production Readiness Checklist

- [x] Credits deducted after success only
- [x] credits_remaining returned in quiz response
- [x] Frontend uses server credits_remaining (QuizScreen lines 688–698)
- [x] Pre-check: 1 credit (creditCalculator.ts)
- [x] CBT exam deducts via /exam/next
- [x] Image questions supported (a_level_chemistry in image-question subject list)
- [x] Supabase credit_costs populated with per-format keys

---

## 7. Summary

A-Level Chemistry credit deduction is working as intended:
- **Topical & Exam (Quiz):** 0.5 credit per question via `/quiz/generate`, with `credits_remaining` in the response.
- **CBT Exam:** 0.5 credit per question via `/exam/next`, with `credits_remaining` in the response.
- **Image questions:** 1 credit via `image_solve` when mix_images is enabled.
- **Supabase:** All required action keys present; fallback in `credit_costs_db.py` remains for resilience.
