# Credit Costs Discrepancies Report

## Overview
This document details discrepancies between Supabase database values, code fallback values, and documentation.

**Verification Method:** Direct Supabase database query via MCP tools
**Date:** Current verification

---

## Critical Discrepancies (High Impact)

### 1. A-Level Subjects - MAJOR DISCREPANCY

**Database Values:**
- Topical: **5 credits** (all A-Level subjects)
- Exam: **8 credits** (all A-Level subjects)

**Code/Documentation:**
- Topical: 1 credit (10 units)
- Exam: 1 credit (10 units)

**Impact:** Users are charged **5-8x more** than documented
**Affected Subjects:**
- Pure Mathematics
- Chemistry
- Physics
- Biology

**Recommendation:** 
- Option A: Update Supabase to 1 credit (match documentation)
- Option B: Update code/documentation to match database (5/8 credits)
- **Decision Required:** Which is the intended pricing?

---

### 2. Audio Features - MAJOR DISCREPANCY

**Database Values:**
- `audio_feature`: **10 credits**
- `voice_chat`: **10 credits**

**Code/Documentation:**
- Both: 1 credit (10 units)

**Impact:** Users are charged **10x more** than documented

**Recommendation:**
- Verify intended pricing for audio features
- Update either database or code/documentation

---

### 3. Mathematics Graph Practice - DISCREPANCY

**Database Value:**
- `math_graph_practice`: **3 credits**

**Code/Documentation:**
- 1 credit (10 units)

**Impact:** Users are charged **3x more** than documented

**Recommendation:**
- Graph practice may legitimately cost more (image generation)
- Verify if 3 credits is intentional

---

### 4. Exam Questions - DISCREPANCY

**Database Values:**
- `combined_science_exam`: **2 credits**
- `math_exam`: **2 credits**

**Code/Documentation:**
- Both: 1 credit (10 units)

**Impact:** Users are charged **2x more** than documented

**Recommendation:**
- Exam questions may legitimately cost more (past papers)
- Verify if 2 credits is intentional

---

## Discrepancy Summary Table

| Feature | Supabase | Code Fallback | Documentation | Difference | Impact |
|---------|---------|---------------|---------------|------------|--------|
| A-Level Topical | 5 credits | 1 credit | 1 credit | 5x | 🔴 High |
| A-Level Exam | 8 credits | 1 credit | 1 credit | 8x | 🔴 High |
| Audio Features | 10 credits | 1 credit | 1 credit | 10x | 🔴 High |
| Math Graph Practice | 3 credits | 1 credit | 1 credit | 3x | 🟡 Medium |
| Combined Science Exam | 2 credits | 1 credit | 1 credit | 2x | 🟡 Medium |
| Math Exam | 2 credits | 1 credit | 1 credit | 2x | 🟡 Medium |

---

## Matching Values (No Discrepancy)

✅ **Verified Matches:**
- `combined_science_topical`: 1 credit ✅
- `math_topical`: 1 credit ✅
- `english_topical`: 1 credit ✅
- `english_comprehension`: 3 credits ✅
- `english_essay_writing`: 3 credits ✅

---

## Root Cause Analysis

### Possible Reasons for Discrepancies

1. **Database Updated, Code Not**
   - Costs changed in Supabase dashboard
   - Code fallback values not updated
   - Documentation not updated

2. **Different Pricing Strategy**
   - Database reflects actual production pricing
   - Code/documentation reflects old/planned pricing
   - Intentional premium pricing for certain features

3. **Incomplete Migration**
   - Some costs migrated to database
   - Others still using fallback
   - Inconsistent implementation

---

## Recommendations

### Immediate Actions

1. **Decision Required:** Which values are correct?
   - Supabase database (current production)
   - Code fallback (documented/planned)
   - New pricing strategy

2. **Align All Systems:**
   - Update code fallback to match database OR
   - Update database to match code/documentation OR
   - Create new unified pricing strategy

3. **Update Documentation:**
   - Document actual production costs
   - Note any intentional premium pricing
   - Update user-facing cost information

### Long-term Actions

4. **Add Missing Keys:**
   - Add all 30+ missing action keys to Supabase
   - Ensure no features use fallback values
   - Centralize all cost management

5. **Monitoring:**
   - Regular verification audits
   - Alert on discrepancies
   - Version control for cost changes

---

## Cost Conversion Reference

**Supabase Database:** Stores costs in **credits** (1, 2, 3, etc.)
**Code Fallback:** Uses **units** (10, 20, 30, etc. where 10 units = 1 credit)

**When comparing:**
- Database: 1 credit = Code: 10 units
- Database: 2 credits = Code: 20 units
- Database: 3 credits = Code: 30 units
- Database: 5 credits = Code: 50 units
- Database: 8 credits = Code: 80 units
- Database: 10 credits = Code: 100 units

---

## Next Steps

1. ✅ Discrepancies identified and documented
2. ⏳ Decision on correct values needed
3. ⏳ Alignment of all systems
4. ⏳ Update user-facing documentation
5. ⏳ Add missing keys to database

---

**Status:** Complete - Ready for decision and implementation
**Priority:** High - Affects user billing and experience
