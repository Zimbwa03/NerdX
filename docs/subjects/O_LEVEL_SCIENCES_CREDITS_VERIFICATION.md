# O Level Sciences (Combined Science) – Credit System Verification Report

**Date:** February 2, 2025  
**Status:** Production Ready ✅

---

## 1. Supabase Credit Costs (Verified via MCP)

All O Level Combined Science action keys are correctly configured in the `credit_costs` table:

| Action Key | Cost (units) | Credits | Status |
|------------|--------------|---------|--------|
| combined_science_topical | 5 | 0.5 | ✅ Verified |
| combined_science_topical_mcq | 5 | 0.5 | ✅ Added & Verified |
| combined_science_topical_structured | 5 | 0.5 | ✅ Added & Verified |
| combined_science_exam | 5 | 0.5 | ✅ Verified |

**Image questions** (when mix_images enabled, every 6th question): Use `get_image_question_credit_cost()` = 10 units (1 credit).

---

## 2. Credit Deduction Flow (Backend)

All O Level Sciences features use the shared backbone where applicable:

- **Function:** `_deduct_credits_or_fail()` in `api/mobile.py`
- **Rule:** Credits are deducted **only after** the action succeeds

### Feature-by-Feature Audit

| Feature | Endpoint | Action Key | Deduction | Returns credits_remaining |
|---------|----------|------------|-----------|---------------------------|
| Topical MCQ | POST /quiz/generate | combined_science_topical_mcq | After question | ✅ question.credits_remaining |
| Topical Structured | POST /quiz/generate | combined_science_topical_structured | After question | ✅ question.credits_remaining |
| Exam (quiz flow) | POST /quiz/generate | combined_science_exam | After question | ✅ question.credits_remaining |
| Image question | POST /quiz/generate | get_image_question_credit_cost() | After question | ✅ question.credits_remaining |
| CBT exam (per question) | POST /exam/next | _get_exam_question_cost_units | After question | ✅ data.credits_remaining |
| Teacher Mode (Science) | POST /teacher/* | teacher_mode_* | After action | ✅ data.credits_remaining |

**Fix applied:** CBT exam `/exam/next` previously did **not** deduct credits. Credit deduction and `credits_remaining` in the response have been added.

---

## 3. Frontend Credits Update

| Screen | Update Location | Status |
|--------|-----------------|--------|
| TopicsScreen | Before navigation to Quiz | ✅ |
| QuizScreen | handleNext, initial load | ✅ |
| CombinedScienceExamScreen | loadQuestion (lines 146–148, 168–170) | ✅ |
| ExamSessionScreen (CBT) | loadNextQuestion (lines 227–229) | ✅ |

---

## 4. Exam Flows for Combined Science

### Flow A: CombinedScienceExamScreen
- Uses `quizApi.generateQuestion` with `question_type: 'exam'`
- Hits `POST /quiz/generate` → action `combined_science_exam`
- Credits deducted per question, `credits_remaining` returned ✅

### Flow B: ExamSessionScreen (CBT)
- Uses `examApi.getNextQuestion` → `POST /exam/next`
- Cost from `_get_exam_question_cost_units('combined_science', 'O_LEVEL', question_type)` = 5 units
- Credits deducted per question, `credits_remaining` in response ✅ (fixed)

---

## 5. Cost Resolution

- **Quiz:** `_get_quiz_credit_action("combined_science", question_type, question_format)`  
  → `combined_science_topical_mcq` | `combined_science_topical_structured` | `combined_science_exam`
- **Image questions:** `get_image_question_credit_cost()` = 10 units
- **CBT exam:** `_get_exam_question_cost_units(subject, level, question_type)` = 5 units for Combined Science

---

## 6. Fixes Applied

1. **Supabase:** Added `combined_science_topical_mcq` and `combined_science_topical_structured` (5 units each).
2. **CBT exam:** Added credit deduction and `credits_remaining` to `POST /exam/next`.
3. **Pre-check:** Added credit check before generating CBT exam question (402 if insufficient).
4. **credit_costs_db.py:** Aligned default seed for `combined_science_topical` and `combined_science_topical_mcq` to 5 units.

---

## 7. Production Readiness Checklist

- [x] All Combined Science action keys in Supabase
- [x] Credits deducted after success only
- [x] credits_remaining returned in all relevant responses
- [x] Frontend updates user credits from responses
- [x] CBT exam flow deducts and returns credits
- [x] Image question cost (1 credit) applied when used
