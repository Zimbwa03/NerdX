# English Credit Costs Verification

## Summary
English topical questions should deduct **0.5 credit (5 units)** per question, exactly as specified in the plan and frontend table.

## Frontend Specification (Source of Truth)
- **English Topical**: **0.5 credit** (from `FRONTEND_CREDIT_COSTS_TABLE.md` line 18)
- **English Exam**: **0.5 credit** (from `FRONTEND_CREDIT_COSTS_TABLE.md` line 33)

## Backend Implementation Status

### ✅ Database Credit Costs (`database/credit_costs_db.py`)

**Line 137-142** - `default_costs` list:
```python
{
    'action_key': 'english_topical',
    'cost': 5,  # ✅ 0.5 credit (5 units)
    'category': 'English',
    'component': 'Topical Questions',
    'description': '0.5 credit per question'
}
```

**Line 467** - `fallback_costs` dict:
```python
'english_topical': 5,  # ✅ 0.5 credit
```

### ✅ Exam Cost Functions (`api/mobile.py`)

**Line 163-165** - `_get_exam_session_cost_units()`:
```python
# English and other subjects
mcq_cost = 5  # ✅ 0.5 credit
structured_cost = 5  # ✅ 0.5 credit
```

**Line 193** - `_get_exam_question_cost_units()`:
```python
# English and other subjects
return 5  # ✅ 0.5 credit
```

### ✅ Database Migration SQL (`database/mobile_app_credit_costs_migration.sql`)

**Line 22**:
```sql
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'english_topical';
```

## Verification Checklist

- [x] `database/credit_costs_db.py` - `default_costs`: 5 units (0.5 credit) ✅
- [x] `database/credit_costs_db.py` - `fallback_costs`: 5 units (0.5 credit) ✅
- [x] `api/mobile.py` - Exam session costs: 5 units (0.5 credit) ✅
- [x] `api/mobile.py` - Exam question costs: 5 units (0.5 credit) ✅
- [x] Migration SQL script created ✅
- [ ] **Supabase database updated** (needs verification)

## Next Step

**Run the migration SQL in Supabase** to ensure the database matches the code:
```sql
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'english_topical';
```

## Answer to Your Question

**English topical questions deduct 0.5 credit (5 units) per question** - exactly as specified in the plan and frontend table.
