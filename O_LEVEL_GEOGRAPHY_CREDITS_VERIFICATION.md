# O Level Geography – Credit System Verification Report

**Date:** February 2, 2025  
**Status:** Production Ready ✅

---

## 1. Supabase Credit Costs (Verified via MCP)

All O Level Geography action keys are now configured in the `credit_costs` table:

| Action Key | Cost (units) | Credits | Status |
|------------|--------------|---------|--------|
| geography_topical | 5 | 0.5 | ✅ Added & Verified |
| geography_exam | 5 | 0.5 | ✅ Added & Verified |
| geo_maps_feedback | 1 | 0.1 | ✅ Added & Verified |

**Note:** Previously none of these existed in Supabase; all used fallback. All 3 have been added.

---

## 2. Credit Deduction Flow (Backend)

O Level Geography uses the shared backbone:

- **Function:** `_deduct_credits_or_fail()` in `api/mobile.py`
- **Action mapping:** `_get_quiz_credit_action("geography", ...)` returns `geography_topical` or `geography_exam` (via default `{subject}_topical` / `{subject}_exam`)

### Feature-by-Feature Audit

| Feature | Endpoint | Action Key | Deduction | Returns credits_remaining |
|---------|----------|------------|-----------|---------------------------|
| Topical quiz | POST /quiz/generate | geography_topical | After question | ✅ question.credits_remaining |
| Exam quiz | POST /quiz/generate | geography_exam | After question | ✅ question.credits_remaining |
| CBT exam (per question) | POST /exam/next | _get_exam_question_cost_units → 5 | After question | ✅ data.credits_remaining |
| Geography Maps Lab | POST /virtual-lab/geo-maps-feedback | geo_maps_feedback | After feedback | ✅ data.credits_remaining |
| Teacher Mode (Geography) | POST /teacher/* | teacher_mode_* | After action | ✅ data.credits_remaining |

---

## 3. CBT Exam Cost Logic

`_get_exam_question_cost_units("geography", level, question_type)` falls through to default: **5 units (0.5 credit)** per question.

---

## 4. Geography Maps Lab (geo_maps_feedback)

- **Cost:** 1 unit (0.1 credit)
- **Flow:** GeoMapsLabScreen → virtualLabApi.getGeoMapsFeedback → POST /virtual-lab/geo-maps-feedback
- **Frontend:** Updates credits from `credits_remaining` ✅

---

## 5. Frontend Credits Update

| Screen | Update Location | Status |
|--------|-----------------|--------|
| TopicsScreen | Before navigation to Quiz | ✅ |
| QuizScreen | handleNext, exam initial fetch | ✅ |
| GeoMapsLabScreen | After getGeoMapsFeedback (line ~112) | ✅ |
| ExamSessionScreen (CBT) | loadNextQuestion | ✅ |

---

## 6. Fixes Applied

1. **Supabase:** INSERT geography_topical (5), geography_exam (5), geo_maps_feedback (1).
2. **credit_costs_db.py:** Added geography_topical and geography_exam to fallback_costs.
3. **api/mobile.py:** Corrected geo_maps_feedback doc (1 credit → 0.1 credit).

---

## 7. Production Readiness Checklist

- [x] All O-Level Geography action keys in Supabase
- [x] Credits deducted after success only
- [x] credits_remaining returned in all relevant responses
- [x] Frontend updates user credits from responses
- [x] CBT exam flow deducts (via /exam/next fix from Sciences pass)
- [x] Geography Maps Lab deducts and returns credits
