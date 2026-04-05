# A-Level Biology – Credit System Verification Report

**Date:** February 2, 2025  
**Status:** Production Ready ✅

---

## 1. Credit Costs (per FEATURE_CREDITS_TABLE)

| Action Key | Cost (units) | Credits |
|------------|--------------|---------|
| a_level_biology_topical_mcq | 5 | 0.5 |
| a_level_biology_topical_structured | 5 | 0.5 |
| a_level_biology_topical_essay | 10 | 1 |
| a_level_biology_exam_mcq | 5 | 0.5 |
| a_level_biology_exam_structured | 5 | 0.5 |
| a_level_biology_exam_essay | 10 | 1 |

**Note:** Ensure these exist in Supabase `credit_costs`. Fallback in `credit_costs_db.py` has all six.

---

## 2. Credit Deduction Flow (Backend)

- **Function:** `_deduct_credits_or_fail()` in `api/mobile.py`
- **Action mapping:** `_get_quiz_credit_action("a_level_biology", qt, qf, bio_question_type)` returns `a_level_biology_{qt}_{bio_key}` (mcq/structured/essay)

### Feature-by-Feature Audit

| Feature | Endpoint | Action Key | Deduction | Returns credits_remaining |
|---------|----------|------------|-----------|---------------------------|
| Topical MCQ | POST /quiz/generate | a_level_biology_topical_mcq | After question | ✅ question.credits_remaining |
| Topical Structured | POST /quiz/generate | a_level_biology_topical_structured | After question | ✅ |
| Topical Essay | POST /quiz/generate | a_level_biology_topical_essay | After question | ✅ |
| Exam MCQ/Structured/Essay | POST /quiz/generate | a_level_biology_exam_* | After question | ✅ |
| Image question | POST /quiz/generate | get_image_question_credit_cost() | After question | ✅ |
| CBT exam (per question) | POST /exam/next | _get_exam_question_cost_units | After question | ✅ |
| Teacher Mode | POST /teacher/* | teacher_mode_* | After action | ✅ |

---

## 3. CBT Exam Cost Logic

`_get_exam_question_cost_units("a_level_biology", level, question_type)`:
- **MCQ:** 3 units (0.25 credit)
- **STRUCTURED/ESSAY:** 5 units (0.5 credit)

*Note: CBT costs differ from quiz (0.5/1 credit for essay). Quiz uses per-format keys.*

---

## 4. Fixes Applied

1. **ALevelBiologyScreen.tsx**
   - **Before:** Used client-calculated `newCredits = currentCredits - creditCost` for `updateUser`.
   - **After:** Uses `question.credits_remaining` from server response.
   - **Pre-check:** Essay now requires 1 credit (was 0.5).
   - **Cost display:** MCQ/Structured 0.5, Essay 1 credit (aligned with backend).

---

## 5. Frontend Credits Update

| Screen | Update Location | Status |
|--------|-----------------|--------|
| ALevelBiologyScreen | startQuestion – uses credits_remaining | ✅ Fixed |
| QuizScreen | handleNext, exam initial fetch | ✅ |
| ExamSessionScreen (CBT) | loadNextQuestion | ✅ |
| TopicsScreen | Before navigation (when via topics) | ✅ |

---

## 6. Production Readiness Checklist

- [x] Credits deducted after success only
- [x] credits_remaining returned in quiz response
- [x] Frontend uses server credits_remaining (not client estimate)
- [x] Pre-check: MCQ/Structured 0.5, Essay 1 credit
- [x] CBT exam deducts via /exam/next
- [x] Image questions supported (A-Level Biology in image-question list)
