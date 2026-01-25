# WhatsApp Credit System Implementation Guide

## Overview

This guide helps you implement the new **WhatsApp Intelligent Credit System** using a **1-3 credit scale**, replacing the old 0.1/0.2 credit system.

---

## Key Changes

### Old System → New System

| Old | New | Reason |
|-----|-----|--------|
| 0.1 credit (1 unit) | 1 credit (10 units) | Simple commands - covers Twilio base cost |
| 1 credit (10 units) | 2 credits (20 units) | AI-generated content - Twilio + AI cost |
| 3 credits (30 units) | 3 credits (30 units) | Complex features - unchanged |

**Why the change?**
- Twilio charges **$0.005 per message** (base cost)
- Old system didn't account for Twilio costs
- New system: Base (1 credit) + AI tier (0, 1, or 2 credits)

---

## Implementation Steps

### Step 1: Update Supabase Database

Run the migration SQL script:

```bash
# Execute the migration script
psql -h your-supabase-host -U postgres -d postgres -f database/whatsapp_credit_system_migration.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `database/whatsapp_credit_system_migration.sql`
3. Execute

**Verification:**
```sql
-- Check all costs are in 1-3 range
SELECT action_key, cost, category 
FROM credit_costs 
WHERE is_active = true 
ORDER BY cost, category, action_key;
```

Expected:
- Cost = 1: System commands
- Cost = 2: Topical questions, exam questions, basic AI
- Cost = 3: Complex features

---

### Step 2: Update Code Fallback Values

✅ **Already Updated:** `config.py` has been updated with new credit costs.

**Verify:**
- All Tier 1 (simple commands) = 10 units (1 credit)
- All Tier 2 (AI content) = 20 units (2 credits)
- All Tier 3 (complex features) = 30 units (3 credits)

---

### Step 3: Test Credit Deductions

**Test Cases:**

1. **Simple Command (1 credit)**
   - Navigate menu → Should deduct 1 credit
   - Check balance → Should deduct 1 credit
   - Help command → Should deduct 1 credit

2. **AI Content (2 credits)**
   - Request topical question → Should deduct 2 credits
   - Start teacher mode → Should deduct 2 credits
   - Generate flashcard → Should deduct 2 credits

3. **Complex Features (3 credits)**
   - Request comprehension → Should deduct 3 credits
   - Solve image math → Should deduct 3 credits
   - A-Level question → Should deduct 3 credits

**Test Script:**
```python
# Test credit deduction
from services.advanced_credit_service import advanced_credit_service

# Test simple command
cost = advanced_credit_service.get_credit_cost('menu_navigation')
assert cost == 10, f"Expected 10 units (1 credit), got {cost}"

# Test AI content
cost = advanced_credit_service.get_credit_cost('math_topical')
assert cost == 20, f"Expected 20 units (2 credits), got {cost}"

# Test complex feature
cost = advanced_credit_service.get_credit_cost('english_comprehension')
assert cost == 30, f"Expected 30 units (3 credits), got {cost}"
```

---

### Step 4: Update User-Facing Messages

**Update help text:**
- ✅ Already updated in `api/webhook.py`

**Update any cost displays:**
- Check for hardcoded cost mentions
- Update to reflect new 1-3 scale

**Search for old references:**
```bash
# Find old 0.1/0.2 credit mentions
grep -r "0\.1\|0\.2" --include="*.py" --include="*.md"
```

---

### Step 5: Monitor and Adjust

**Metrics to Track:**
1. **Credit Usage by Tier**
   - How many Tier 1 vs Tier 2 vs Tier 3 deductions
   - Average credits per user per day

2. **Cost Analysis**
   - Actual Twilio costs per message
   - Actual AI API costs per feature
   - Compare to credit revenue

3. **User Feedback**
   - Are costs fair?
   - Any complaints about pricing?

**Adjustment Guidelines:**
- If Twilio costs increase → May need to increase base credit
- If AI costs decrease → May reduce Tier 2/3 credits
- Monitor profit margins per feature

---

## Credit System Breakdown

### Tier 1: Simple Commands (1 Credit)

**Features:**
- Menu navigation
- Help commands
- Balance checks
- Settings access
- Registration steps

**Cost Justification:**
- Twilio message: ~$0.005
- AI cost: $0
- **Total: ~$0.005 per message**

**Action Keys:**
- `menu_navigation`
- `help_command`
- `check_balance`
- `settings_access`
- `registration_step`

---

### Tier 2: AI-Generated Content (2 Credits)

**Features:**
- Topical questions (all subjects)
- Exam questions
- Graph practice
- Teacher mode (start & follow-up)
- Project assistant (start & follow-up)
- Flashcards
- Virtual lab questions

**Cost Justification:**
- Twilio message: ~$0.005
- AI cost: ~$0.001-0.003 (500-1500 tokens)
- **Total: ~$0.006-0.013 per message**

**Action Keys:**
- `*_topical` (all subjects)
- `*_exam` (all subjects)
- `math_graph_practice`
- `teacher_mode_start`
- `teacher_mode_followup`
- `project_assistant_start`
- `project_assistant_followup`
- `flashcard_single`
- `virtual_lab_knowledge_check`

---

### Tier 3: Complex AI Features (3 Credits)

**Features:**
- English comprehension
- Essay writing/marking
- Image processing (OCR, solving)
- A-Level (all subjects)
- Audio features
- Voice chat
- Deep research
- Image generation

**Cost Justification:**
- Twilio message: ~$0.005
- AI cost: ~$0.003-0.015 (1500-4000 tokens + special APIs)
- **Total: ~$0.008-0.025 per message**

**Action Keys:**
- `english_comprehension`
- `english_essay_writing`
- `english_essay_marking`
- `image_solve`
- `a_level_*` (all)
- `audio_feature`
- `voice_chat`
- `project_deep_research`
- `project_web_search`
- `image_generation`

---

## Migration Checklist

- [ ] ✅ Update Supabase database (run migration SQL)
- [ ] ✅ Update code fallback values (`config.py`)
- [ ] ✅ Update help text (`api/webhook.py`)
- [ ] ⏳ Test credit deductions (all tiers)
- [ ] ⏳ Update any hardcoded cost references
- [ ] ⏳ Monitor costs and user feedback
- [ ] ⏳ Adjust if needed based on actual costs

---

## Troubleshooting

### Issue: Credits not deducting correctly

**Check:**
1. Database has correct costs (1, 2, or 3)
2. Code fallback matches database
3. `advanced_credit_service.get_credit_cost()` returns correct values

**Debug:**
```python
from services.advanced_credit_service import advanced_credit_service
from database.credit_costs_db import credit_cost_service

# Check database value
db_cost = credit_cost_service.get_credit_cost('math_topical')
print(f"Database cost: {db_cost}")

# Check service value
service_cost = advanced_credit_service.get_credit_cost('math_topical')
print(f"Service cost: {service_cost}")

# Should both be 20 units (2 credits)
```

### Issue: Users complaining about higher costs

**Explain:**
- WhatsApp has Twilio message costs ($0.005 per message)
- Mobile app doesn't have this cost
- New system is fair and transparent
- Costs reflect actual expenses

---

## Support

For questions or issues:
1. Check `WHATSAPP_INTELLIGENT_CREDIT_SYSTEM.md` for system design
2. Review migration SQL for database changes
3. Check `config.py` for code fallback values
4. Test with sample user actions

---

**Status:** Ready for implementation
**Last Updated:** Based on new 1-3 credit scale system
**Priority:** High - Replaces outdated 0.1/0.2 system
