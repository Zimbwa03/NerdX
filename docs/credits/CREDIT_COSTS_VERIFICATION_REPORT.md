# Credit Costs Verification Report

## Executive Summary

This report verifies credit costs stored in Supabase database against code fallback values and documentation. **18 active entries** found in Supabase with several significant discrepancies identified.

**Verification Date:** Based on Supabase MCP query
**Database Source:** Supabase `credit_costs` table
**Code Source:** `database/credit_costs_db.py` fallback costs

---

## Verification Methodology

1. Queried Supabase `credit_costs` table using MCP `execute_sql` tool
2. Compared database values with code fallback values
3. Compared database values with documentation
4. Identified missing action keys (using fallback)

---

## Supabase Database Values (Verified)

### Combined Science (O-Level)
| Action Key | Database Cost | Code Fallback | Documentation | Status |
|------------|---------------|---------------|---------------|--------|
| `combined_science_topical` | **1 credit** | 10 units (1 credit) | 1 credit | ✅ Match |
| `combined_science_exam` | **2 credits** | 10 units (1 credit) | 1 credit | ⚠️ Discrepancy |
| `combined_science_topical_mcq` | ❌ Not in DB | 10 units (1 credit) | 1 credit | ⚠️ Missing |
| `combined_science_topical_structured` | ❌ Not in DB | 10 units (1 credit) | 1 credit | ⚠️ Missing |

### Mathematics (O-Level)
| Action Key | Database Cost | Code Fallback | Documentation | Status |
|------------|---------------|---------------|---------------|--------|
| `math_topical` | **1 credit** | 10 units (1 credit) | 1 credit | ✅ Match |
| `math_exam` | **2 credits** | 10 units (1 credit) | 1 credit | ⚠️ Discrepancy |
| `math_graph_practice` | **3 credits** | 10 units (1 credit) | 1 credit | ⚠️ Discrepancy |
| `math_quiz` | ❌ Not in DB | 10 units (1 credit) | 1 credit | ⚠️ Missing |
| `image_solve` | ❌ Not in DB | 30 units (3 credits) | 3 credits | ⚠️ Missing |

### English
| Action Key | Database Cost | Code Fallback | Documentation | Status |
|------------|---------------|---------------|---------------|--------|
| `english_topical` | **1 credit** | 10 units (1 credit) | 1 credit | ✅ Match |
| `english_comprehension` | **3 credits** | 30 units (3 credits) | 3 credits | ✅ Match |
| `english_essay_writing` | **3 credits** | 30 units (3 credits) | 3 credits | ✅ Match |
| `english_essay_marking` | ❌ Not in DB | 30 units (3 credits) | 3 credits | ⚠️ Missing |
| `english_comprehension_grading` | ❌ Not in DB | 30 units (3 credits) | 3 credits | ⚠️ Missing |
| `english_summary_grading` | ❌ Not in DB | 30 units (3 credits) | 3 credits | ⚠️ Missing |

### A-Level Subjects
| Action Key | Database Cost | Code Fallback | Documentation | Status |
|------------|---------------|---------------|---------------|--------|
| `a_level_pure_math_topical` | **5 credits** | 10 units (1 credit) | 1 credit | ⚠️ Major Discrepancy |
| `a_level_pure_math_exam` | **8 credits** | 10 units (1 credit) | 1 credit | ⚠️ Major Discrepancy |
| `a_level_chemistry_topical` | **5 credits** | 10 units (1 credit) | 1 credit | ⚠️ Major Discrepancy |
| `a_level_chemistry_exam` | **8 credits** | 10 units (1 credit) | 1 credit | ⚠️ Major Discrepancy |
| `a_level_physics_topical` | **5 credits** | 10 units (1 credit) | 1 credit | ⚠️ Major Discrepancy |
| `a_level_physics_exam` | **8 credits** | 10 units (1 credit) | 1 credit | ⚠️ Major Discrepancy |
| `a_level_biology_topical` | **5 credits** | 10 units (1 credit) | 1 credit | ⚠️ Major Discrepancy |
| `a_level_biology_exam` | **8 credits** | 10 units (1 credit) | 1 credit | ⚠️ Major Discrepancy |

**Note:** Database uses generic `a_level_*_topical` and `a_level_*_exam` keys, while code has detailed keys like `a_level_biology_topical_mcq`, `a_level_biology_topical_structured`, etc.

### Audio Features
| Action Key | Database Cost | Code Fallback | Documentation | Status |
|------------|---------------|---------------|---------------|--------|
| `audio_feature` | **10 credits** | 10 units (1 credit) | 1 credit | ⚠️ Major Discrepancy |
| `voice_chat` | **10 credits** | 10 units (1 credit) | 1 credit | ⚠️ Major Discrepancy |

---

## Missing Action Keys in Supabase

The following action keys are used in code but **NOT** present in Supabase database. Code falls back to default values:

### Combined Science
- `combined_science_topical_mcq` → Fallback: 10 units (1 credit)
- `combined_science_topical_structured` → Fallback: 10 units (1 credit)

### Mathematics
- `math_quiz` → Fallback: 10 units (1 credit)
- `image_solve` → Fallback: 30 units (3 credits)

### English
- `english_essay_marking` → Fallback: 30 units (3 credits)
- `english_comprehension_grading` → Fallback: 30 units (3 credits)
- `english_summary_grading` → Fallback: 30 units (3 credits)

### A-Level Detailed Keys
- `a_level_pure_math_topical_mcq` → Fallback: 10 units (1 credit)
- `a_level_pure_math_topical_structured` → Fallback: 10 units (1 credit)
- `a_level_chemistry_topical_mcq` → Fallback: 10 units (1 credit)
- `a_level_chemistry_topical_structured` → Fallback: 10 units (1 credit)
- `a_level_physics_topical_mcq` → Fallback: 10 units (1 credit)
- `a_level_physics_topical_structured` → Fallback: 10 units (1 credit)
- `a_level_biology_topical_mcq` → Fallback: 10 units (1 credit)
- `a_level_biology_topical_structured` → Fallback: 10 units (1 credit)
- `a_level_biology_topical_essay` → Fallback: 10 units (1 credit)
- `a_level_biology_exam_mcq` → Fallback: 10 units (1 credit)
- `a_level_biology_exam_structured` → Fallback: 10 units (1 credit)
- `a_level_biology_exam_essay` → Fallback: 10 units (1 credit)

### AI Teacher Mode
- `teacher_mode_start` → Fallback: 1 unit (0.1 credit)
- `teacher_mode_followup` → Fallback: 1 unit (0.1 credit)
- `teacher_mode_pdf` → Fallback: 10 units (1 credit)

### Project Assistant
- `project_assistant_start` → Fallback: 20 units (2 credits)
- `project_assistant_followup` → Fallback: 20 units (2 credits)
- `project_assistant_batch` → Fallback: 20 units (2 credits)
- `project_web_search` → Fallback: 20 units (2 credits)
- `project_deep_research` → Fallback: 50 units (5 credits)
- `project_transcribe` → Fallback: 20 units (2 credits)
- `project_image_generation` → Fallback: 20 units (2 credits)

### Study Tools
- `flashcard_single` → Fallback: 10 units (1 credit)
- `virtual_lab_knowledge_check` → Fallback: 10 units (1 credit)

**Total Missing:** 30+ action keys

---

## Critical Discrepancies Analysis

### High Priority Discrepancies

1. **A-Level Subjects (5x-8x difference)**
   - Database: 5 credits (topical), 8 credits (exam)
   - Code/Doc: 1 credit
   - **Impact:** Users charged 5-8x more than expected

2. **Audio Features (10x difference)**
   - Database: 10 credits
   - Code/Doc: 1 credit
   - **Impact:** Users charged 10x more than expected

3. **Math Graph Practice (3x difference)**
   - Database: 3 credits
   - Code/Doc: 1 credit
   - **Impact:** Users charged 3x more than expected

4. **Exam Questions (2x difference)**
   - Combined Science Exam: Database = 2 credits vs Code/Doc = 1 credit
   - Math Exam: Database = 2 credits vs Code/Doc = 1 credit
   - **Impact:** Users charged 2x more than expected

### Medium Priority

5. **Missing Action Keys**
   - Many features use fallback values
   - Inconsistent pricing across similar features
   - No centralized cost management

---

## Cost Conversion Reference

**System:** Supabase stores costs in **credits** (1, 2, 3, etc.)
**Code:** Fallback uses **units** (10, 20, 30, etc. where 10 units = 1 credit)

**Conversion Table:**
- 1 credit (DB) = 10 units (Code)
- 2 credits (DB) = 20 units (Code)
- 3 credits (DB) = 30 units (Code)
- 5 credits (DB) = 50 units (Code)
- 8 credits (DB) = 80 units (Code)
- 10 credits (DB) = 100 units (Code)

---

## Recommendations

### Immediate Actions Required

1. **Decide on Source of Truth**
   - Option A: Use Supabase database values (current production)
   - Option B: Update Supabase to match code fallback values
   - **Recommendation:** Use Supabase as source of truth, update code/documentation

2. **Add Missing Action Keys to Database**
   - Add all 30+ missing action keys to Supabase
   - Set appropriate costs based on feature complexity
   - Ensure consistency across similar features

3. **Update Code Fallback Values**
   - Align fallback costs with Supabase database values
   - Ensure fallback matches database when database is unavailable

4. **Update Documentation**
   - Document actual Supabase values
   - Mark which features use database vs fallback
   - Add verification status

### Long-term Improvements

5. **Cost Standardization**
   - Review pricing strategy for consistency
   - Consider feature complexity and AI usage
   - Document pricing rationale

6. **Monitoring**
   - Track which costs are used (database vs fallback)
   - Monitor for discrepancies
   - Regular verification audits

---

## Supabase Database Schema

**Table:** `credit_costs`
**Columns:**
- `id` (Integer, Primary Key)
- `action_key` (String, Unique, Indexed)
- `cost` (Integer) - **Stored in credits**
- `category` (String)
- `component` (String)
- `description` (Text)
- `is_active` (Boolean)
- `created_at` (DateTime)
- `updated_at` (DateTime)

---

## Verification Query Used

```sql
SELECT action_key, cost, category, component, description, is_active 
FROM credit_costs 
WHERE is_active = true 
ORDER BY category, action_key;
```

**Result:** 18 active entries returned

---

## Next Steps

1. ✅ Verification complete - discrepancies identified
2. ⏳ Update documentation with verified values
3. ⏳ Add missing action keys to Supabase
4. ⏳ Align code fallback with database values
5. ⏳ Update WhatsApp bot to use correct costs

---

**Report Generated:** Based on Supabase MCP query verification
**Verified By:** MCP Supabase tools (execute_sql)
**Status:** Complete - Ready for implementation
