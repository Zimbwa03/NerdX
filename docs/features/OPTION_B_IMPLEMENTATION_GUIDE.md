# Option B Credit System Implementation Guide

## Overview

**Option B** is a student-friendly credit system that encourages learning rather than spending credits on navigation:

- **Commands:** 1 credit = 2 commands (bundled)
- **AI-Generated Content:** 1 credit per use (reduced from 2)
- **Complex Features:** 2 credits per use (reduced from 3)

---

## System Structure

### Commands: Bundled System (1 Credit = 2 Commands)

**How it works:**
1. User uses first command (menu, help, balance, stats, settings)
2. No credit deducted yet - tracked in session
3. User uses second command
4. **1 credit deducted** for both commands

**Benefits:**
- Students don't waste credits on navigation
- Encourages actual learning (questions, AI features)
- More sustainable than 1 credit = 3 commands

**Implementation:**
- Uses `command_credit_tracker` service
- Tracks commands in user session
- Bundle expires after 24 hours (if not completed)

---

### AI-Generated Content: 1 Credit Per Use

**Features:**
- Topical questions (all subjects)
- Exam questions
- Graph practice
- Teacher mode responses
- Project assistant responses
- Flashcards
- Virtual lab questions

**Cost:** Twilio ($0.005) + AI ($0.002) = $0.007 per credit
**You charge:** $0.011-0.013 per credit
**Profit:** $0.004-0.006 per credit (36-55% margin)

---

### Complex Features: 2 Credits Per Use

**Features:**
- English comprehension
- Essay writing/marking
- A-Level questions (all subjects)
- Image processing (OCR, solving)
- Audio features
- Voice chat
- Deep research
- Image generation

**Cost:** Twilio ($0.005) + High AI ($0.007) = $0.012 per 2 credits = $0.006 per credit
**You charge:** $0.011-0.013 per credit × 2 = $0.022-0.026 per use
**Profit:** $0.010-0.014 per use (45-64% margin)

---

## Files Updated

### 1. `config.py`
✅ Updated all credit costs:
- Commands: 10 units (1 credit) - bundled in code
- AI-Generated: 10 units (1 credit) - was 20
- Complex: 20 units (2 credits) - was 30

### 2. `services/command_credit_tracker.py`
✅ New service created:
- Tracks command usage
- Implements 1 credit = 2 commands bundling
- Handles bundle expiration (24 hours)

### 3. `services/advanced_credit_service.py`
✅ Updated `check_and_deduct_credits()`:
- Integrates command tracker
- Handles bundled command deduction
- Provides bundle status messages

### 4. `api/webhook.py`
✅ Updated command handlers:
- `send_main_menu()` - uses command tracking
- `show_credit_balance()` - uses command tracking
- `show_user_stats()` - uses command tracking
- `send_help_message()` - uses command tracking
- Added `handle_command_with_tracking()` helper

### 5. `database/option_b_credit_system_migration.sql`
✅ SQL migration script:
- Updates all costs to Option B structure
- Commands: 1 credit (bundled in code)
- AI: 1 credit
- Complex: 2 credits

---

## Implementation Steps

### Step 1: Update Supabase Database

Run the migration SQL:

```sql
-- Execute: database/option_b_credit_system_migration.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `database/option_b_credit_system_migration.sql`
3. Execute

**Verification:**
```sql
SELECT action_key, cost, category 
FROM credit_costs 
WHERE is_active = true 
ORDER BY cost, category, action_key;
```

Expected:
- Cost = 1: Commands, AI-generated content
- Cost = 2: Complex features

---

### Step 2: Test Command Bundling

**Test Cases:**

1. **First Command (No Deduction)**
   - User sends: "menu"
   - Expected: Menu shown, no credit deducted
   - Message: "Command 1 of 2 - No credit deducted yet"

2. **Second Command (Deduction)**
   - User sends: "help"
   - Expected: Help shown, 1 credit deducted
   - Message: "Bundle complete! 1 credit deducted for 2 commands"

3. **New Bundle Starts**
   - User sends: "credits"
   - Expected: Balance shown, no credit deducted
   - Message: "Command 1 of 2 - New bundle started"

---

### Step 3: Test AI Features

**Test Cases:**

1. **Topical Question (1 Credit)**
   - User requests: Math topical question
   - Expected: 1 credit deducted (was 2)

2. **Teacher Mode (1 Credit)**
   - User starts: Teacher mode
   - Expected: 1 credit deducted (was 2)

---

### Step 4: Test Complex Features

**Test Cases:**

1. **Essay Writing (2 Credits)**
   - User requests: Essay writing
   - Expected: 2 credits deducted (was 3)

2. **A-Level Question (2 Credits)**
   - User requests: A-Level question
   - Expected: 2 credits deducted (was 3)

---

## User Experience

### Command Bundle Messages

**First Command:**
```
📦 Command Bundle Status

✅ Command 1 of 2 used
💳 No credit deducted yet
📊 1 command(s) remaining in bundle

💡 Tip: Use 1 more command to complete the bundle (1 credit for 2 commands)
```

**Bundle Complete:**
```
✅ Bundle Complete!

💳 1 credit deducted for 2 commands
💰 New balance: X credits

🎯 New bundle started - Next 2 commands = 1 credit
```

---

## Profit Analysis (Option B)

### Cost Per Credit: ~$0.007

**Weighted Average:**
- Commands: 10% × $0.010 = $0.001
- AI: 60% × $0.007 = $0.0042
- Complex: 30% × $0.006 = $0.0018
- **Total: ~$0.007 per credit**

### Profit for 100 Users (70% utilization):

| Package | Revenue | Cost | **Profit** | **Margin** |
|---------|---------|------|-----------|------------|
| ⚪ Lite | $200.00 | $73.50 | **$126.50** | 63.3% |
| 🟤 Starter | $500.00 | $196.00 | **$304.00** | 60.8% |
| 🟢 Standard | $1,000.00 | $416.50 | **$583.50** | 58.4% |
| 🔵 Pro | $1,800.00 | $784.00 | **$1,016.00** | 56.4% |
| 🟡 Premium | $2,500.00 | $1,102.50 | **$1,397.50** | 55.9% |

**Better than 1 credit = 3 commands, sustainable margins!**

---

## Command Tracking Details

### Session Storage

**Key:** `command_tracker_{user_id}`

**Data Structure:**
```json
{
  "session_type": "command_bundle",
  "commands_used": 1,
  "bundle_started_at": "2025-01-24T10:30:00",
  "last_action": "menu_navigation"
}
```

### Bundle Expiration

- **Window:** 24 hours
- **If expired:** New bundle starts
- **If completed:** Credit deducted, bundle cleared

---

## Testing Checklist

- [ ] ✅ Command bundling works (1 credit = 2 commands)
- [ ] ✅ Bundle status messages display correctly
- [ ] ✅ AI features deduct 1 credit (was 2)
- [ ] ✅ Complex features deduct 2 credits (was 3)
- [ ] ✅ Bundle expires after 24 hours
- [ ] ✅ Database costs updated correctly
- [ ] ✅ Code fallback values match database
- [ ] ✅ Help text updated with new costs

---

## Migration Notes

### From Old System (1-3 scale):
- Commands: 1 credit → **1 credit = 2 commands** (bundled)
- AI: 2 credits → **1 credit** (reduced)
- Complex: 3 credits → **2 credits** (reduced)

### User Impact:
- **More affordable** AI questions (50% reduction)
- **More affordable** complex features (33% reduction)
- **Better value** on commands (2 for price of 1)

---

## Support & Troubleshooting

### Issue: Commands not bundling

**Check:**
1. `command_credit_tracker` service is imported
2. Session database is working
3. Command actions are in tracker's list

**Debug:**
```python
from services.command_credit_tracker import command_credit_tracker

# Check bundle status
status = command_credit_tracker.get_bundle_status(user_id)
print(f"Bundle status: {status}")
```

### Issue: Credits deducted incorrectly

**Check:**
1. Database costs are correct (1, 1, 2)
2. Code fallback matches database
3. Command tracker is working

---

**Status:** Ready for implementation
**Priority:** High - Student-friendly pricing
**Impact:** All WhatsApp credit deductions
