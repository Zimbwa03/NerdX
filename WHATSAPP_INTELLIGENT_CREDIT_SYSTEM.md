# WhatsApp Intelligent Credit System (1-3 Credit Scale)

## Overview

This document defines the new intelligent credit system for WhatsApp bot using a **1-3 credit scale**, replacing the old 0.1/0.2 credit system. WhatsApp costs are higher than mobile app due to **Twilio per-message charges**.

---

## Understanding Twilio WhatsApp Pricing

### Twilio Charges Per Message (Not Per Conversation)

**Key Facts:**
- Twilio charges **per message sent** (outbound)
- Typical cost: **$0.005 - $0.01 per message** (varies by region)
- Each message segment counts separately
- No per-conversation fee - purely message-based

**Implications:**
- Simple command responses = 1 message = Twilio cost
- AI-generated responses = 1 message = Twilio cost (same base cost)
- **BUT**: AI responses require additional AI API costs (DeepSeek/Gemini)
- Multi-part responses = multiple messages = multiple Twilio charges

**Cost Breakdown:**
1. **Base Twilio Cost**: ~$0.005-0.01 per message (fixed)
2. **AI API Cost**: Variable based on tokens used
   - DeepSeek: ~$0.001-0.003 per 1K tokens
   - Gemini: ~$0.002-0.01 per 1K tokens
3. **Total Cost**: Base + AI = WhatsApp message cost

---

## New Credit System: 1-3 Scale

### Credit Tiers

| Tier | Credits | Use Case | Cost Justification |
|------|---------|----------|-------------------|
| **1 Credit** | 1 | Simple commands, menu navigation, basic responses | Base Twilio cost only |
| **2 Credits** | 2 | AI-generated content, questions, moderate complexity | Twilio + moderate AI cost |
| **3 Credits** | 3 | Complex AI (essays, comprehension, images, deep research) | Twilio + high AI cost |

---

## Intelligent Credit Assignment by Feature

### Tier 1: Simple Commands (1 Credit)
**Fixed cost** - No AI generation, just Twilio message cost

| Feature | Action Key | Credits | Reason |
|---------|------------|--------|--------|
| Menu Navigation | `menu_navigation` | 1 | Simple text response |
| Help/Info Commands | `help_command` | 1 | Static content |
| Credit Balance Check | `check_balance` | 1 | Database query only |
| Settings/Profile | `settings_access` | 1 | No AI involved |
| Registration Flow | `registration_step` | 1 | Form-based, no AI |

**Cost Model:**
- Twilio message: ~$0.005-0.01
- AI cost: $0
- **Total: ~$0.005-0.01 per message**

---

### Tier 2: AI-Generated Content (2 Credits)
**Moderate AI usage** - Twilio + AI API costs

| Feature | Action Key | Credits | AI Complexity | Reason |
|---------|------------|---------|---------------|--------|
| Topical Questions (All Subjects) | `*_topical` | 2 | Moderate (500-800 tokens) | AI question generation |
| Exam Questions | `*_exam` | 2 | Moderate (600-1000 tokens) | Past paper retrieval + formatting |
| Math Graph Practice | `math_graph_practice` | 2 | Moderate (400-600 tokens) | Graph generation + explanation |
| AI Teacher Start | `teacher_mode_start` | 2 | Moderate (800-1200 tokens) | Initial AI response |
| AI Teacher Follow-up | `teacher_mode_followup` | 2 | Moderate (600-1000 tokens) | Conversational AI |
| Project Assistant Start | `project_assistant_start` | 2 | Moderate (1000-1500 tokens) | Initial project guidance |
| Project Assistant Follow-up | `project_assistant_followup` | 2 | Moderate (800-1200 tokens) | Continued conversation |
| Flashcards | `flashcard_single` | 2 | Moderate (300-500 tokens) | AI-generated flashcards |
| Virtual Lab Questions | `virtual_lab_knowledge_check` | 2 | Moderate (500-700 tokens) | AI question generation |

**Cost Model:**
- Twilio message: ~$0.005-0.01
- AI cost: ~$0.001-0.003 (500-1500 tokens)
- **Total: ~$0.006-0.013 per message**

---

### Tier 3: Complex AI Features (3 Credits)
**High AI usage** - Twilio + significant AI API costs

| Feature | Action Key | Credits | AI Complexity | Reason |
|---------|------------|---------|---------------|--------|
| English Comprehension | `english_comprehension` | 3 | High (1500-2500 tokens) | Full passage + questions |
| English Essay Writing | `english_essay_writing` | 3 | High (2000-3000 tokens) | Long-form content generation |
| English Essay Marking | `english_essay_marking` | 3 | High (1500-2000 tokens) | Detailed AI analysis |
| Image Math Solver (OCR) | `image_solve` | 3 | High (Vision + 1000-2000 tokens) | Image processing + solving |
| Project Deep Research | `project_deep_research` | 3 | High (2000-4000 tokens) | Extensive research |
| Project Web Search | `project_web_search` | 3 | High (1500-2500 tokens) | Search + synthesis |
| Audio Features | `audio_feature` | 3 | High (Audio processing + 1000-2000 tokens) | Audio transcription + response |
| Voice Chat | `voice_chat` | 3 | High (Real-time audio + AI) | Live voice processing |
| A-Level Topical (All) | `a_level_*_topical` | 3 | High (800-1500 tokens) | Advanced content |
| A-Level Exam (All) | `a_level_*_exam` | 3 | High (1000-2000 tokens) | Advanced past papers |
| Image Generation | `image_generation` | 3 | High (Image generation API) | AI image creation |
| Project Transcription | `project_transcribe` | 3 | High (Audio processing) | Speech-to-text |

**Cost Model:**
- Twilio message: ~$0.005-0.01
- AI cost: ~$0.003-0.015 (1500-4000 tokens + special APIs)
- **Total: ~$0.008-0.025 per message**

---

## WhatsApp vs Mobile App Pricing

### Why WhatsApp Costs More

| Factor | Mobile App | WhatsApp |
|--------|-----------|----------|
| **Message Delivery** | Free (in-app) | $0.005-0.01 per message (Twilio) |
| **Base Cost** | $0 | ~$0.005-0.01 |
| **AI Cost** | Same | Same |
| **Total Minimum** | AI cost only | AI cost + $0.005-0.01 |

**Example: Topical Question**
- Mobile: AI cost only (~$0.001-0.003) = **1 credit**
- WhatsApp: AI cost (~$0.001-0.003) + Twilio (~$0.005-0.01) = **2 credits**

**Pricing Multiplier:** WhatsApp typically costs **1.5-2x** more than mobile due to Twilio fees.

---

## Implementation Model

### Fixed + Variable Credit System

**Base Credit (Fixed):**
- Every WhatsApp message: **1 credit** (covers Twilio cost)
- Applied to ALL messages (commands, AI responses, everything)

**AI Credit (Variable):**
- Simple AI (Tier 2): **+1 credit** (total = 2 credits)
- Complex AI (Tier 3): **+2 credits** (total = 3 credits)

**Formula:**
```
Total Credits = Base Credit (1) + AI Credit (0, 1, or 2)
```

**Examples:**
- Menu command: 1 (base) + 0 (no AI) = **1 credit**
- Topical question: 1 (base) + 1 (simple AI) = **2 credits**
- Essay writing: 1 (base) + 2 (complex AI) = **3 credits**

---

## Complete Feature Credit Mapping

### Combined Science (O-Level)
| Feature | Action Key | Credits | Tier |
|---------|------------|---------|------|
| Topical Questions | `combined_science_topical` | 2 | 2 |
| Topical MCQ | `combined_science_topical_mcq` | 2 | 2 |
| Topical Structured | `combined_science_topical_structured` | 2 | 2 |
| Exam Questions | `combined_science_exam` | 2 | 2 |

### Mathematics (O-Level)
| Feature | Action Key | Credits | Tier |
|---------|------------|---------|------|
| Topical Questions | `math_topical` | 2 | 2 |
| Exam Questions | `math_exam` | 2 | 2 |
| Quiz Questions | `math_quiz` | 2 | 2 |
| Graph Practice | `math_graph_practice` | 2 | 2 |
| Image Solver (OCR) | `image_solve` | 3 | 3 |

### English
| Feature | Action Key | Credits | Tier |
|---------|------------|---------|------|
| Topical Questions | `english_topical` | 2 | 2 |
| Comprehension | `english_comprehension` | 3 | 3 |
| Essay Writing | `english_essay_writing` | 3 | 3 |
| Essay Marking | `english_essay_marking` | 3 | 3 |
| Comprehension Grading | `english_comprehension_grading` | 3 | 3 |
| Summary Grading | `english_summary_grading` | 3 | 3 |

### A-Level (All Subjects)
| Feature | Action Key | Credits | Tier |
|---------|------------|---------|------|
| Topical (All) | `a_level_*_topical` | 3 | 3 |
| Topical MCQ | `a_level_*_topical_mcq` | 3 | 3 |
| Topical Structured | `a_level_*_topical_structured` | 3 | 3 |
| Topical Essay | `a_level_*_topical_essay` | 3 | 3 |
| Exam (All) | `a_level_*_exam` | 3 | 3 |
| Exam MCQ | `a_level_*_exam_mcq` | 3 | 3 |
| Exam Structured | `a_level_*_exam_structured` | 3 | 3 |
| Exam Essay | `a_level_*_exam_essay` | 3 | 3 |

### AI Teacher Mode
| Feature | Action Key | Credits | Tier |
|---------|------------|---------|------|
| Start Session | `teacher_mode_start` | 2 | 2 |
| Follow-up Response | `teacher_mode_followup` | 2 | 2 |
| PDF Generation | `teacher_mode_pdf` | 3 | 3 |

### Project Assistant
| Feature | Action Key | Credits | Tier |
|---------|------------|---------|------|
| Start Session | `project_assistant_start` | 2 | 2 |
| Follow-up Response | `project_assistant_followup` | 2 | 2 |
| Web Search | `project_web_search` | 3 | 3 |
| Deep Research | `project_deep_research` | 3 | 3 |
| Transcription | `project_transcribe` | 3 | 3 |
| Image Generation | `project_image_generation` | 3 | 3 |

### Audio Features
| Feature | Action Key | Credits | Tier |
|---------|------------|---------|------|
| Audio Feature | `audio_feature` | 3 | 3 |
| Voice Chat | `voice_chat` | 3 | 3 |

### Study Tools
| Feature | Action Key | Credits | Tier |
|---------|------------|---------|------|
| Flashcards | `flashcard_single` | 2 | 2 |
| Virtual Lab | `virtual_lab_knowledge_check` | 2 | 2 |

### System Commands
| Feature | Action Key | Credits | Tier |
|---------|------------|---------|------|
| Menu Navigation | `menu_navigation` | 1 | 1 |
| Help/Info | `help_command` | 1 | 1 |
| Balance Check | `check_balance` | 1 | 1 |
| Settings | `settings_access` | 1 | 1 |

---

## Migration from Old System

### Old System (0.1/0.2 credits)
- Teacher mode: 0.1 credit (1 unit)
- Simple commands: 0.1 credit (1 unit)
- Questions: 1 credit (10 units)

### New System (1-3 credits)
- Teacher mode: 2 credits (20 units)
- Simple commands: 1 credit (10 units)
- Questions: 2 credits (20 units)
- Complex features: 3 credits (30 units)

### Conversion Table
| Old (Units) | Old (Credits) | New (Credits) | New (Units) |
|-------------|---------------|--------------|-------------|
| 1 unit | 0.1 credit | 1 credit | 10 units |
| 10 units | 1 credit | 2 credits | 20 units |
| 20 units | 2 credits | 2 credits | 20 units |
| 30 units | 3 credits | 3 credits | 30 units |

**Note:** The new system uses whole credits (1, 2, 3) instead of decimals (0.1, 0.2).

---

## Database Update Required

### Supabase `credit_costs` Table Updates

**Update existing entries:**
```sql
-- Update to new 1-3 credit scale
UPDATE credit_costs SET cost = 2 WHERE action_key IN (
  'combined_science_topical',
  'combined_science_exam',
  'math_topical',
  'math_exam',
  'math_graph_practice',
  'english_topical'
);

UPDATE credit_costs SET cost = 3 WHERE action_key IN (
  'english_comprehension',
  'english_essay_writing',
  'a_level_pure_math_topical',
  'a_level_pure_math_exam',
  'a_level_chemistry_topical',
  'a_level_chemistry_exam',
  'a_level_physics_topical',
  'a_level_physics_exam',
  'a_level_biology_topical',
  'a_level_biology_exam',
  'audio_feature',
  'voice_chat'
);
```

**Add new entries:**
```sql
-- Add system commands (1 credit)
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('menu_navigation', 1, 'System', 'Navigation', 'Menu navigation commands', true),
  ('help_command', 1, 'System', 'Help', 'Help and information commands', true),
  ('check_balance', 1, 'System', 'Balance', 'Credit balance check', true),
  ('settings_access', 1, 'System', 'Settings', 'Settings and profile access', true);
```

---

## Code Implementation

### Update `config.py`
```python
# New WhatsApp Credit System (1-3 scale)
CREDIT_COSTS = {
    # Tier 1: Simple Commands (1 credit)
    'menu_navigation': 10,      # 1 credit
    'help_command': 10,         # 1 credit
    'check_balance': 10,         # 1 credit
    'settings_access': 10,       # 1 credit
    
    # Tier 2: AI-Generated Content (2 credits)
    'combined_science_topical': 20,      # 2 credits
    'combined_science_exam': 20,         # 2 credits
    'math_topical': 20,                  # 2 credits
    'math_exam': 20,                     # 2 credits
    'math_graph_practice': 20,           # 2 credits
    'teacher_mode_start': 20,            # 2 credits
    'teacher_mode_followup': 20,         # 2 credits
    'project_assistant_start': 20,       # 2 credits
    'project_assistant_followup': 20,    # 2 credits
    
    # Tier 3: Complex AI Features (3 credits)
    'english_comprehension': 30,         # 3 credits
    'english_essay_writing': 30,          # 3 credits
    'image_solve': 30,                    # 3 credits
    'a_level_pure_math_topical': 30,      # 3 credits
    'a_level_pure_math_exam': 30,         # 3 credits
    'audio_feature': 30,                  # 3 credits
    'voice_chat': 30,                     # 3 credits
    # ... (all A-Level and complex features = 3 credits)
}
```

---

## Benefits of New System

1. **Simpler for Users**: Whole numbers (1, 2, 3) instead of decimals (0.1, 0.2)
2. **Fair Pricing**: Reflects actual costs (Twilio + AI)
3. **Scalable**: Easy to adjust per tier
4. **Transparent**: Clear cost justification
5. **WhatsApp-Specific**: Accounts for Twilio message costs

---

## Next Steps

1. ✅ System designed
2. ⏳ Update Supabase database
3. ⏳ Update code fallback values
4. ⏳ Test credit deductions
5. ⏳ Update user-facing documentation
6. ⏳ Monitor costs and adjust if needed

---

**Status:** Ready for implementation
**Priority:** High - Replaces outdated 0.1/0.2 system
**Impact:** All WhatsApp credit deductions
