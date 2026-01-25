# Credit Costs Alignment Recommendations

## Executive Summary

After verifying credit costs from Supabase database using MCP tools, we've identified:
- **18 entries** verified in Supabase database
- **30+ missing action keys** using fallback values
- **8 major discrepancies** between database and code/documentation

**Priority:** High - Affects user billing and system consistency

---

## Verification Results

### Verified in Supabase (18 entries)
✅ All costs confirmed from database query

### Missing from Database (30+ entries)
⚠️ Using code fallback values - no centralized management

### Discrepancies Found (8 entries)
🔴 Database values differ significantly from code/documentation

---

## Critical Findings

### 1. Major Cost Discrepancies

| Feature | Supabase | Code/Doc | Multiplier | Impact |
|---------|----------|----------|------------|--------|
| A-Level Topical | 5 credits | 1 credit | 5x | 🔴 Very High |
| A-Level Exam | 8 credits | 1 credit | 8x | 🔴 Very High |
| Audio Features | 10 credits | 1 credit | 10x | 🔴 Very High |
| Math Graph Practice | 3 credits | 1 credit | 3x | 🟡 High |
| Exam Questions | 2 credits | 1 credit | 2x | 🟡 Medium |

**User Impact:** Users are being charged 2-10x more than documented for these features.

---

## Recommended Actions

### Phase 1: Immediate Decisions (Required)

#### Decision 1: Source of Truth
**Question:** Which values should be the source of truth?

**Option A: Use Supabase Database (Current Production)**
- Pros: Already in production, reflects actual billing
- Cons: Higher costs than documented, may surprise users
- Action: Update code fallback and documentation to match database

**Option B: Use Code/Documentation Values**
- Pros: Matches user expectations, lower costs
- Cons: Requires database updates, may affect revenue
- Action: Update Supabase database to match code/documentation

**Option C: New Unified Pricing Strategy**
- Pros: Clean slate, consistent pricing model
- Cons: Requires comprehensive review and planning
- Action: Define new pricing, update both database and code

**Recommendation:** **Option A** - Use Supabase as source of truth since it's already in production. Update code and documentation to match.

---

### Phase 2: Code Alignment

#### Task 1: Update Code Fallback Values
**File:** `database/credit_costs_db.py`

Update fallback costs to match Supabase database:

```python
self.fallback_costs = {
    # Update to match Supabase
    'combined_science_exam': 20,  # 2 credits (was 10)
    'math_exam': 20,               # 2 credits (was 10)
    'math_graph_practice': 30,     # 3 credits (was 10)
    'a_level_pure_math_topical': 50,      # 5 credits (was 10)
    'a_level_pure_math_exam': 80,         # 8 credits (was 10)
    'a_level_chemistry_topical': 50,       # 5 credits (was 10)
    'a_level_chemistry_exam': 80,          # 8 credits (was 10)
    'a_level_physics_topical': 50,         # 5 credits (was 10)
    'a_level_physics_exam': 80,            # 8 credits (was 10)
    'a_level_biology_topical': 50,         # 5 credits (was 10)
    'a_level_biology_exam': 80,            # 8 credits (was 10)
    'audio_feature': 100,                  # 10 credits (was 10)
    'voice_chat': 100,                     # 10 credits (was 10)
    # ... rest of fallback costs
}
```

#### Task 2: Verify Code Usage
Check if code correctly uses `advanced_credit_service.get_credit_cost()` which queries database first, then falls back.

**Files to Check:**
- `services/advanced_credit_service.py` - Verify database query logic
- All deduction points - Verify they use the service correctly

---

### Phase 3: Database Population

#### Task 3: Add Missing Action Keys to Supabase

**High Priority (Add First):**
1. `combined_science_topical_mcq` - 1 credit
2. `image_solve` - 3 credits
3. `teacher_mode_start` - 1 credit (or 0.1 if intentional)
4. `teacher_mode_followup` - 1 credit (or 0.1 if intentional)
5. `project_assistant_start` - 2 credits
6. `project_assistant_followup` - 2 credits
7. `project_web_search` - 2 credits

**Medium Priority:**
8. `combined_science_topical_structured` - 1 credit
9. `math_quiz` - 1 credit
10. English grading features - 3 credits each
11. `teacher_mode_pdf` - 1 credit
12. Other Project Assistant features

**Low Priority:**
13. A-Level detailed keys (if needed)
14. Study tools (flashcards, virtual lab)

**SQL Template:**
```sql
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('action_key', cost_in_credits, 'Category', 'Component', 'Description', true);
```

See `MISSING_CREDIT_COSTS_ACTION_KEYS.md` for complete SQL statements.

---

### Phase 4: Documentation Updates

#### Task 4: Update User-Facing Documentation
- Update help text in WhatsApp bot
- Update mobile app cost displays
- Update any user guides or FAQs
- Ensure consistency across all platforms

#### Task 5: Internal Documentation
- ✅ `WHATSAPP_CREDIT_DEDUCTIONS_LIST.md` - Updated with verified values
- ✅ `CREDIT_COSTS_VERIFICATION_REPORT.md` - Created
- ✅ `CREDIT_COSTS_DISCREPANCIES.md` - Created
- ✅ `MISSING_CREDIT_COSTS_ACTION_KEYS.md` - Created

---

## Implementation Priority

### Critical (Do First)
1. **Decision on source of truth** - Required before any changes
2. **Update code fallback** - Ensures consistency when database unavailable
3. **Add high-priority missing keys** - Frequently used features

### High Priority
4. **Update documentation** - User-facing cost information
5. **Add medium-priority missing keys** - Complete database coverage

### Medium Priority
6. **Monitor and verify** - Regular audits
7. **Add low-priority keys** - Complete the set

---

## Cost Conversion Reference

**Supabase Database Format:**
- Stores costs as **credits** (integer: 1, 2, 3, 5, 8, 10, etc.)

**Code Format:**
- Uses **units** (integer: 10, 20, 30, 50, 80, 100, etc.)
- Conversion: 1 credit = 10 units

**When Adding to Database:**
- Use credit values directly (1, 2, 3, etc.)
- Code will automatically convert: cost × 10 = units

---

## Testing Checklist

After implementation, verify:

- [ ] All costs match between Supabase and code fallback
- [ ] Missing keys added to database
- [ ] Code correctly queries database first
- [ ] Fallback values match database (for redundancy)
- [ ] Documentation updated with verified values
- [ ] User-facing displays show correct costs
- [ ] No features using hardcoded costs
- [ ] All deduction points use `advanced_credit_service`

---

## Monitoring

### Regular Audits
- Monthly verification of database vs code
- Alert on new discrepancies
- Track which costs are actually used
- Monitor user billing accuracy

### Metrics to Track
- Features using database costs vs fallback
- Cost discrepancies detected
- Missing keys usage frequency
- User billing accuracy

---

## Files Created/Updated

1. ✅ `CREDIT_COSTS_VERIFICATION_REPORT.md` - Comprehensive verification report
2. ✅ `WHATSAPP_CREDIT_DEDUCTIONS_LIST.md` - Updated with verified values and status
3. ✅ `CREDIT_COSTS_DISCREPANCIES.md` - Detailed discrepancy analysis
4. ✅ `MISSING_CREDIT_COSTS_ACTION_KEYS.md` - Complete list of missing keys with SQL
5. ✅ `CREDIT_COSTS_ALIGNMENT_RECOMMENDATIONS.md` - This file

---

## Next Steps

1. ✅ Verification complete
2. ✅ Documentation updated
3. ⏳ **Decision required:** Which values are correct?
4. ⏳ Update code fallback values
5. ⏳ Add missing keys to Supabase
6. ⏳ Update user-facing documentation
7. ⏳ Test and verify

---

**Status:** Documentation complete - Ready for implementation decisions
**Priority:** High - Affects billing and user experience
**Blockers:** Decision on source of truth required
