# A-Level Pure Mathematics – Credit System Verification Report

**Date:** February 2, 2025  
**Status:** Production Ready ✅

---

## 1. Supabase Credit Costs (Verified via MCP)

All A-Level Pure Mathematics action keys are now configured in the `credit_costs` table:

| Action Key | Cost (units) | Credits | Status |
|------------|--------------|---------|--------|
| a_level_pure_math_topical | 5 | 0.5 | ✅ Verified |
| a_level_pure_math_topical_mcq | 5 | 0.5 | ✅ Added & Verified |
| a_level_pure_math_topical_structured | 5 | 0.5 | ✅ Added & Verified |
| a_level_pure_math_exam | 5 | 0.5 | ✅ Verified |

**Related (shared with O-Level Math):** math_quiz (streaming), math_graph_practice, image_solve.

---

## 2. Credit Deduction Flow (Backend)

All A-Level Pure Mathematics features use the shared backbone:

- **Function:** `_deduct_credits_or_fail()` in `api/mobile.py`
- **Action mapping:** `_get_quiz_credit_action("a_level_pure_math", question_type, question_format)` returns:
  - `a_level_pure_math_exam` (exam)
  - `a_level_pure_math_topical_structured` (structured)
  - `a_level_pure_math_topical_mcq` (mcq default)

### Feature-by-Feature Audit

| Feature | Endpoint | Action Key | Deduction | Returns credits_remaining |
|---------|----------|------------|-----------|---------------------------|
| Topical MCQ | POST /quiz/generate | a_level_pure_math_topical_mcq | After question | ✅ question.credits_remaining |
| Topical Structured | POST /quiz/generate | a_level_pure_math_topical_structured | After question | ✅ question.credits_remaining |
| Exam quiz | POST /quiz/generate | a_level_pure_math_exam | After question | ✅ question.credits_remaining |
| Streaming quiz | POST /quiz/generate-stream | math_quiz | On first question event | ✅ data.credits_remaining |
| CBT exam (per question) | POST /exam/next | _get_exam_question_cost_units → 5 | After question | ✅ data.credits_remaining |
| Graph practice | POST /math/graph, etc. | math_graph_practice | After graph | ✅ data.credits_remaining |
| Image math solve | POST /math/graph/upload-image, etc. | image_solve | After solution | ✅ data.credits_remaining |
| Teacher Mode | POST /teacher/* | teacher_mode_* | After action | ✅ data.credits_remaining |

---

## 3. CBT Exam Cost Logic

`_get_exam_question_cost_units("a_level_pure_math", level, question_type)` → **5 units (0.5 credit)** per question (is_a_level branch).

---

## 4. Frontend Credits Update

| Screen | Update Location | Status |
|--------|-----------------|--------|
| ALevelPureMathScreen | startQuizWithFormat (line ~129) | ✅ |
| QuizScreen | handleNext, exam initial fetch | ✅ |
| ExamSessionScreen (CBT) | loadNextQuestion | ✅ |
| GraphPracticeScreen | All graph/solve flows | ✅ |

---

## 5. Fixes Applied

1. **Supabase:** INSERT a_level_pure_math_topical_mcq (5) and a_level_pure_math_topical_structured (5). Previously only topical and exam existed.

---

## 6. Production Readiness Checklist

- [x] All A-Level Pure Math action keys in Supabase
- [x] Credits deducted after success only
- [x] credits_remaining returned in all relevant responses
- [x] Frontend updates user credits from responses
- [x] CBT exam flow deducts (via /exam/next fix from Sciences pass)
- [x] Streaming quiz uses math_quiz (0.5 credit)
- [x] Graph practice and image solve available for A-Level Pure Math
