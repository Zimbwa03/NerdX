# A-Level Computer Science – Credit System Verification Report

**Date:** February 2, 2025  
**Status:** Production Ready ✅

---

## 1. Credit Costs (same as O-Level: MCQ 0.3, Structured 0.5, Essay 1)

| Action Key | Cost (units) | Credits |
|------------|--------------|---------|
| a_level_computer_science_topical_mcq | 3 | 0.3 |
| a_level_computer_science_topical_structured | 5 | 0.5 |
| a_level_computer_science_topical_essay | 10 | 1 |
| a_level_computer_science_exam_mcq | 3 | 0.3 |
| a_level_computer_science_exam_structured | 5 | 0.5 |
| a_level_computer_science_exam_essay | 10 | 1 |

**Supabase:** All 6 A-Level Computer Science action keys have been added.  
**Fallback:** `credit_costs_db.py` fallback_costs includes all 6 keys.

---

## 2. Credit Deduction Flow (Backend)

- **Function:** `_deduct_credits_or_fail()` in `api/mobile.py`
- **Action mapping:** `_get_quiz_credit_action("a_level_computer_science", qt, cs_fmt)` returns per-format keys (topical_mcq, topical_structured, topical_essay, exam_mcq, exam_structured, exam_essay)

### Feature-by-Feature Audit

| Feature | Endpoint | Action Key | Deduction | Returns credits_remaining |
|---------|----------|------------|-----------|---------------------------|
| Topical MCQ | POST /quiz/generate | a_level_computer_science_topical_mcq | ✅ After question | ✅ question.credits_remaining |
| Topical Structured | POST /quiz/generate | a_level_computer_science_topical_structured | ✅ After question | ✅ |
| Topical Essay | POST /quiz/generate | a_level_computer_science_topical_essay | ✅ After question | ✅ |
| Exam MCQ | POST /quiz/generate | a_level_computer_science_exam_mcq | ✅ After question | ✅ |
| Exam Structured | POST /quiz/generate | a_level_computer_science_exam_structured | ✅ After question | ✅ |
| Exam Essay | POST /quiz/generate | a_level_computer_science_exam_essay | ✅ After question | ✅ |
| CBT exam (per question) | POST /exam/next | _get_exam_question_cost_units | ✅ After question | ✅ |
| Image upload (structured/essay) | POST /quiz/generate | image_solve if applicable | ✅ After question | ✅ |

---

## 3. CBT Exam Cost Logic

`_get_exam_question_cost_units("a_level_computer_science", level, question_type)`:
- **MCQ:** 3 units (0.3 credit)
- **STRUCTURED:** 5 units (0.5 credit)
- **ESSAY:** 10 units (1 credit)

**Fix applied:** A-Level Computer Science was previously using the generic `is_a_level` path (5 units for all). It now uses the same per-format logic as O-Level Computer Science.

---

## 4. Fixes Applied

1. **Supabase `credit_costs`**
   - **Before:** No `a_level_computer_science_*` keys; backend fell back to default 5 units.
   - **After:** Inserted all 6 keys with correct costs (3, 5, 10 units).

2. **`credit_costs_db.py` fallback_costs**
   - **Before:** No `a_level_computer_science_*` keys; fallback used default 5.
   - **After:** Added all 6 keys with correct costs.

3. **`api/mobile.py` _get_exam_question_cost_units**
   - **Before:** `a_level_computer_science` used generic A-Level path (5 units for all).
   - **After:** Added explicit case for `a_level_computer_science` with per-format costs (MCQ=3, Structured=5, Essay=10).

---

## 5. Frontend Credits Update

| Screen | Update Location | Status |
|--------|-----------------|--------|
| TopicsScreen | Before navigation to Quiz | ✅ |
| QuizScreen | handleNextQuestion – uses `newQuestion.credits_remaining` | ✅ |
| ExamSessionScreen (CBT) | loadNextQuestion – uses `response.credits_remaining` | ✅ |
| creditCalculator.ts | a_level_computer_science: MCQ 0.3, Structured 0.5, Essay 1 | ✅ |

---

## 6. Board Support

- **ZIMSEC:** Form 5 / Form 6 topics.
- **Cambridge:** AS Level / A2 Level topics (9618).
- Both use the same credit costs.

---

## 7. Production Readiness Checklist

- [x] Credits deducted after success only
- [x] credits_remaining returned in quiz response
- [x] Frontend uses server credits_remaining
- [x] Per-format pricing: MCQ 0.3, Structured 0.5, Essay 1
- [x] CBT exam deducts via /exam/next with per-format costs
- [x] Supabase credit_costs populated with all 6 keys
- [x] Fallback_costs includes all 6 keys
