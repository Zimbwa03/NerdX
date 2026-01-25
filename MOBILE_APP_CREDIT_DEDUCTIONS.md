# Mobile Application Credit Deductions Documentation

## Overview
This document provides a comprehensive guide to all credit deductions in the NerdX Mobile Application. The system uses a unit-based credit system where **1 credit = 10 units**.

## Credit System Architecture

### Unit System
- **Internal Storage**: All credits stored as units (e.g., 150 credits = 1500 units)
- **Display**: Credits shown as whole numbers to users
- **Conversion**: `format_credits()` converts units to display credits

### Deduction Flow
1. **Check Credits**: Verify user has sufficient credits before action
2. **Execute Action**: Perform the requested feature/service
3. **Deduct Credits**: Only deduct after successful completion
4. **Return Balance**: Return remaining credits to user

### Helper Functions
- `_deduct_credits_or_fail()`: Deducts credits and returns remaining balance or None on failure
- `_credits_display()`: Converts units to display credits
- `_credits_text()`: Formats credits for error messages
- `_credits_remaining()`: Gets current remaining credits

---

## Credit Cost Categories

### 1. AI-Generated Content (1 Credit = 10 units)
**Cost**: 1 credit per use  
**Category**: Basic AI features

#### Mathematics
| Endpoint | Action Key | Cost | Description |
|----------|-----------|------|-------------|
| `/quiz/generate` | `math_topical` | 1 credit | Generate topical math question |
| `/quiz/generate-stream` | `math_quiz` | 1 credit | Streaming math quiz question |
| `/quiz/exam/next` | `math_exam` | 1 credit | Get next exam math question |
| `/math/graph` | `math_graph_practice` | 1 credit | Generate math graph practice |

#### Combined Science (O-Level)
| Endpoint | Action Key | Cost | Description |
|----------|-----------|------|-------------|
| `/quiz/generate` | `combined_science_topical` | 1 credit | Topical science question |
| `/quiz/generate` | `combined_science_topical_mcq` | 1 credit | Science MCQ question |
| `/quiz/generate` | `combined_science_topical_structured` | 1 credit | Structured science question |
| `/quiz/generate` | `combined_science_exam` | 1 credit | Exam science question |

#### English
| Endpoint | Action Key | Cost | Description |
|----------|-----------|------|-------------|
| `/quiz/generate` | `english_topical` | 1 credit | Generate English topical question |

#### AI Teacher Mode
| Endpoint | Action Key | Cost | Description |
|----------|-----------|------|-------------|
| `/teacher/start` | `teacher_mode_start` | 1 credit | Start teacher mode session |
| `/teacher/message` | `teacher_mode_followup` | 1 credit | Follow-up message in teacher mode |

#### Project Assistant (Basic)
| Endpoint | Action Key | Cost | Description |
|----------|-----------|------|-------------|
| `/project/<id>/chat` | `project_assistant_start` | 1 credit | Start project chat |
| `/project/<id>/chat` | `project_assistant_followup` | 1 credit | Follow-up project message |

#### Study Tools
| Endpoint | Action Key | Cost | Description |
|----------|-----------|------|-------------|
| `/flashcards/generate` | `flashcard_single` | 1 credit | Generate single flashcard |
| `/flashcards/generate-single` | `flashcard_single` | 1 credit | Generate one flashcard |
| `/virtual-lab/knowledge-check` | `virtual_lab_knowledge_check` | 1 credit | Virtual lab knowledge check question |

**Note**: Virtual lab knowledge check charges per question. If requesting multiple questions, cost = `1 credit × number_of_questions`.

---

### 2. Complex Features (2 Credits = 20 units)
**Cost**: 2 credits per use  
**Category**: Advanced AI features with higher processing costs

#### English Complex Features
| Endpoint | Action Key | Cost | Description |
|----------|-----------|------|-------------|
| `/english/comprehension` | `english_comprehension` | 2 credits | Full comprehension passage + questions |
| `/english/essay/submit` | `english_essay_marking` | 2 credits | Essay marking and detailed analysis |
| `/english/comprehension/grade` | `english_comprehension_grading` | 2 credits | AI grading of comprehension |
| `/english/summary/grade` | `english_summary_grading` | 2 credits | AI grading of summary |

#### A-Level Subjects (All)
| Subject | Action Key | Cost | Description |
|---------|-----------|------|-------------|
| Pure Mathematics | `a_level_pure_math_topical` | 2 credits | A-Level math topical question |
| Pure Mathematics | `a_level_pure_math_topical_mcq` | 2 credits | A-Level math MCQ |
| Pure Mathematics | `a_level_pure_math_topical_structured` | 2 credits | A-Level math structured question |
| Pure Mathematics | `a_level_pure_math_exam` | 2 credits | A-Level math exam question |
| Chemistry | `a_level_chemistry_topical` | 2 credits | A-Level chemistry topical |
| Chemistry | `a_level_chemistry_topical_mcq` | 2 credits | A-Level chemistry MCQ |
| Chemistry | `a_level_chemistry_topical_structured` | 2 credits | A-Level chemistry structured |
| Chemistry | `a_level_chemistry_exam` | 2 credits | A-Level chemistry exam |
| Physics | `a_level_physics_topical` | 2 credits | A-Level physics topical |
| Physics | `a_level_physics_topical_mcq` | 2 credits | A-Level physics MCQ |
| Physics | `a_level_physics_topical_structured` | 2 credits | A-Level physics structured |
| Physics | `a_level_physics_exam` | 2 credits | A-Level physics exam |
| Biology | `a_level_biology_topical_mcq` | 2 credits | A-Level biology MCQ |
| Biology | `a_level_biology_topical_structured` | 2 credits | A-Level biology structured |
| Biology | `a_level_biology_topical_essay` | 2 credits | A-Level biology essay |
| Biology | `a_level_biology_exam_mcq` | 2 credits | A-Level biology exam MCQ |
| Biology | `a_level_biology_exam_structured` | 2 credits | A-Level biology exam structured |
| Biology | `a_level_biology_exam_essay` | 2 credits | A-Level biology exam essay |

#### Vision & Image Processing
| Endpoint | Action Key | Cost | Description |
|----------|-----------|------|-------------|
| `/image/upload` | `image_solve` | 2 credits | OCR + solve image equation |
| `/math/scan` | `image_solve` | 2 credits | Scan and solve math problem |
| `/math/scan-gemini` | `image_solve` | 2 credits | Scan math with Gemini vision |
| `/math/graph/upload` | `image_solve` | 2 credits | Upload and process graph image |
| `/ocr/scan-equation` | `ocr_solve` | 2 credits | OCR scan equation |
| `/ocr/scan-page` | `ocr_solve` | 2 credits | OCR scan full page |

#### Project Assistant (Advanced)
| Endpoint | Action Key | Cost | Description |
|----------|-----------|------|-------------|
| `/project/<id>/web-search` | `project_web_search` | 2 credits | Web search + synthesis |
| `/project/<id>/research` | `project_deep_research` | 2 credits | Deep research |
| `/teacher/deep-research` | `deep_research` | 2 credits | Extensive research |
| `/project/<id>/transcribe` | `project_transcribe` | 2 credits | Audio transcription |

#### AI Teacher Advanced Features
| Endpoint | Action Key | Cost | Description |
|----------|-----------|------|-------------|
| `/teacher/generate-notes` | `teacher_mode_pdf` | 2 credits | Generate PDF notes |

#### Audio Features
| Endpoint | Action Key | Cost | Description |
|----------|-----------|------|-------------|
| `/voice/transcribe` | `audio_feature` | 2 credits | Voice transcription |
| `/voice/transcribe-vertex` | `audio_feature` | 2 credits | Vertex AI transcription |
| `/flashcards/generate` (audio) | `flashcard_audio` | 2 credits | Audio flashcards |

---

### 3. Exam Session System (Variable Cost)
**Cost**: Calculated based on subject, level, question mode, and number of questions

#### Exam Session Creation (`/exam/create`)
Cost calculation based on:
- **Subject**: Mathematics, Combined Science, A-Level subjects
- **Level**: O-Level, A-Level
- **Question Mode**: MCQ_ONLY, STRUCTURED_ONLY, MIXED
- **Total Questions**: Number of questions in session

**Cost Formula**:
```python
# O-Level
MCQ: 5 units per question (0.5 credits)
Structured: 5 units per question (0.5 credits)

# A-Level (except Biology)
MCQ: 5 units per question (0.5 credits)
Structured: 5 units per question (0.5 credits)

# A-Level Biology
MCQ: 3 units per question (0.3 credits)
Structured: 5 units per question (0.5 credits)

# Mixed Mode
Cost = (MCQ_count × MCQ_cost) + (Structured_count × Structured_cost)
```

**Example**:
- O-Level Math, 20 questions, MIXED mode:
  - 10 MCQ × 5 units = 50 units (5 credits)
  - 10 Structured × 5 units = 50 units (5 credits)
  - **Total: 100 units (10 credits)**

#### Exam Question Retrieval (`/exam/next`)
Cost per question based on question type:
- **MCQ**: 3-5 units (0.3-0.5 credits) depending on subject/level
- **Structured**: 5 units (0.5 credits)

**Deduction**: Credits deducted when each question is retrieved, not upfront.

---

### 4. Special Cases

#### Image Questions (Vertex AI)
Some questions use image generation which has variable costs:
- **Image Questions**: Higher cost (uses `get_image_question_credit_cost()`)
- **Text Questions**: Standard cost (uses `get_text_question_credit_cost()`)

The system automatically detects question type and applies appropriate cost.

#### Virtual Lab Knowledge Check
- **Free Simulations**: Some virtual lab simulations are free (see `FREE_VIRTUAL_LAB_SIMULATIONS`)
- **Knowledge Check Questions**: 1 credit per question
- **Multiple Questions**: Cost = `1 credit × number_of_questions`

---

## Endpoint Reference

### Quiz & Questions
| Endpoint | Method | Cost | Action Key |
|----------|--------|------|------------|
| `/quiz/generate` | POST | 1 credit | Subject-specific (see above) |
| `/quiz/generate-stream` | POST | 1 credit | `math_quiz` |
| `/quiz/exam/next` | POST | 1 credit | `math_exam` |
| `/quiz/submit-answer` | POST | Free | No deduction |
| `/quiz/start-session` | POST | Free | No deduction |

### Mathematics
| Endpoint | Method | Cost | Action Key |
|----------|--------|------|------------|
| `/math/graph` | POST | 1 credit | `math_graph_practice` |
| `/math/graph/generate` | POST | 1 credit | `math_graph_practice` |
| `/math/graph/custom` | POST | 1 credit | `math_graph_practice` |
| `/math/graph/upload` | POST | 2 credits | `image_solve` |
| `/math/graph/linear-programming` | POST | 1 credit | `math_graph_practice` |
| `/math/solve` | POST | Free | No deduction |
| `/math/voice-to-text` | POST | Free | No deduction |
| `/math/differentiate` | POST | Free | No deduction |
| `/math/integrate` | POST | Free | No deduction |
| `/math/simplify` | POST | Free | No deduction |
| `/math/scan` | POST | 2 credits | `image_solve` |
| `/math/scan-gemini` | POST | 2 credits | `image_solve` |

### English
| Endpoint | Method | Cost | Action Key |
|----------|--------|------|------------|
| `/english/comprehension` | POST | 2 credits | `english_comprehension` |
| `/english/essay/submit` | POST | 2 credits | `english_essay_marking` |
| `/english/comprehension/grade` | POST | 2 credits | `english_comprehension_grading` |
| `/english/summary/grade` | POST | 2 credits | `english_summary_grading` |
| `/english/essay/prompts` | GET | Free | No deduction |
| `/english/essay/history` | GET | Free | No deduction |

### Teacher Mode
| Endpoint | Method | Cost | Action Key |
|----------|--------|------|------------|
| `/teacher/start` | POST | 1 credit | `teacher_mode_start` |
| `/teacher/message` | POST | 1 credit | `teacher_mode_followup` |
| `/teacher/generate-notes` | POST | 2 credits | `teacher_mode_pdf` |
| `/teacher/multimodal` | POST | Free | No deduction |
| `/teacher/analyze-image` | POST | Free | No deduction |
| `/teacher/analyze-document` | POST | Free | No deduction |
| `/teacher/search` | POST | Free | No deduction |
| `/teacher/deep-research` | POST | 2 credits | `deep_research` |
| `/teacher/history` | GET | Free | No deduction |

### Project Assistant
| Endpoint | Method | Cost | Action Key |
|----------|--------|------|------------|
| `/project/<id>/chat` | POST | 1 credit | `project_assistant_start` or `project_assistant_followup` |
| `/project/<id>/web-search` | POST | 2 credits | `project_web_search` |
| `/project/<id>/research` | POST | 2 credits | `project_deep_research` |
| `/project/<id>/transcribe` | POST | 2 credits | `project_transcribe` |
| `/project/<id>/multimodal-chat` | POST | Free | No deduction |
| `/project/<id>/analyze-document` | POST | Free | No deduction |

### Study Tools
| Endpoint | Method | Cost | Action Key |
|----------|--------|------|------------|
| `/flashcards/generate` | POST | 1 credit per card | `flashcard_single` |
| `/flashcards/generate-single` | POST | 1 credit | `flashcard_single` |
| `/virtual-lab/knowledge-check` | POST | 1 credit per question | `virtual_lab_knowledge_check` |

### Exam System
| Endpoint | Method | Cost | Action Key |
|----------|--------|------|------------|
| `/exam/create` | POST | Variable | Calculated per session |
| `/exam/next` | POST | Variable | Per question (3-5 units) |
| `/exam/submit` | POST | Free | No deduction |
| `/exam/complete` | POST | Free | No deduction |
| `/exam/state/<id>` | GET | Free | No deduction |
| `/exam/review/<id>` | GET | Free | No deduction |

### Image & OCR
| Endpoint | Method | Cost | Action Key |
|----------|--------|------|------------|
| `/image/upload` | POST | 2 credits | `image_solve` |
| `/image/analyze-gemini` | POST | Free | No deduction |
| `/ocr/scan-equation` | POST | 2 credits | `ocr_solve` |
| `/ocr/scan-page` | POST | 2 credits | `ocr_solve` |
| `/ocr/verify` | GET | Free | No deduction |

### Voice & Audio
| Endpoint | Method | Cost | Action Key |
|----------|--------|------|------------|
| `/voice/transcribe` | POST | 2 credits | `audio_feature` |
| `/voice/transcribe-vertex` | POST | 2 credits | `audio_feature` |
| `/voice/speak` | POST | Free | No deduction |

### Free Endpoints (No Credit Deduction)
These endpoints do not deduct credits:
- `/auth/*` - Authentication endpoints
- `/user/*` - User profile and stats
- `/credits/*` - Credit balance and transactions
- `/payment/*` - Payment processing
- `/referral/*` - Referral system
- `/quiz/subjects` - Get available subjects
- `/quiz/topics` - Get topics
- `/dkt/*` - Knowledge tracking (most endpoints)
- `/sync/*` - Data synchronization
- `/vector/*` - Vector search
- `/math/animate/*` - Math animations
- `/math/notes/*` - Math notes
- `/document/analyze` - Document analysis
- `/project/create` - Create project
- `/project/list` - List projects
- `/project/<id>` - Get project details
- `/project/<id>/history` - Project history
- `/project/<id>/export/*` - Export features
- `/project/<id>/sections` - Project sections
- `/project/<id>/evidence` - Project evidence
- `/project/<id>/references` - Project references
- `/project/<id>/logbook` - Project logbook

---

## Credit Deduction Logic

### Standard Flow
```python
1. Check user credits: get_user_credits(user_id)
2. Get credit cost: advanced_credit_service.get_credit_cost(action_key)
3. Validate: if user_credits < credit_cost → return error
4. Execute action (generate question, process image, etc.)
5. Deduct credits: _deduct_credits_or_fail(user_id, cost_units, transaction_type, description)
6. Return result with credits_remaining
```

### Error Handling
- **Insufficient Credits**: Returns 400 error with message showing required vs available credits
- **Transaction Failure**: Returns 500 error if deduction fails
- **Action Failure**: Credits not deducted if action fails before deduction

### Transaction Logging
All credit deductions are logged in `credit_transactions` table with:
- `user_id`: User identifier
- `transaction_type`: Action key (e.g., 'math_topical', 'image_solve')
- `amount`: Credits deducted (in units)
- `balance_before`: Credits before deduction
- `balance_after`: Credits after deduction
- `description`: Human-readable description
- `transaction_date`: Timestamp

---

## Cost Calculation Examples

### Example 1: Generate Math Question
```
User requests: POST /quiz/generate
Subject: Mathematics
Question Type: Topical
Action Key: math_topical
Cost: 10 units (1 credit)
User Credits: 1500 units (150 credits)
After: 1490 units (149 credits)
```

### Example 2: English Comprehension
```
User requests: POST /english/comprehension
Action Key: english_comprehension
Cost: 20 units (2 credits)
User Credits: 500 units (50 credits)
After: 480 units (48 credits)
```

### Example 3: Exam Session (O-Level Math, 20 questions, MIXED)
```
User requests: POST /exam/create
Subject: Mathematics
Level: O-Level
Mode: MIXED
Questions: 20
Calculation:
  - MCQ: 10 questions × 5 units = 50 units
  - Structured: 10 questions × 5 units = 50 units
  - Total: 100 units (10 credits)
User Credits: 2000 units (200 credits)
After: 1900 units (190 credits)
```

### Example 4: Virtual Lab (5 questions)
```
User requests: POST /virtual-lab/knowledge-check
Questions: 5
Action Key: virtual_lab_knowledge_check
Cost: 5 × 10 units = 50 units (5 credits)
User Credits: 300 units (30 credits)
After: 250 units (25 credits)
```

### Example 5: Teacher Mode Session
```
User requests: POST /teacher/start
Action Key: teacher_mode_start
Cost: 10 units (1 credit)
User Credits: 100 units (10 credits)
After: 90 units (9 credits)

User sends message: POST /teacher/message
Action Key: teacher_mode_followup
Cost: 10 units (1 credit)
User Credits: 90 units (9 credits)
After: 80 units (8 credits)
```

---

## Important Notes

1. **Credits Only Deducted on Success**: Credits are deducted AFTER the action completes successfully. If generation fails, no credits are deducted.

2. **Exam Sessions**: 
   - Session creation deducts credits upfront for all questions
   - Individual question retrieval also deducts per question
   - Ensure users understand total cost before creating session

3. **Streaming Questions**: Streaming endpoints (`/quiz/generate-stream`) deduct credits after the stream completes successfully.

4. **Image Questions**: Some questions use image generation which may have higher costs. The system automatically detects and applies appropriate pricing.

5. **Free Features**: Many read-only or informational endpoints are free. Only actions that consume AI resources or processing deduct credits.

6. **Transaction Atomicity**: Credit deductions are atomic - either fully succeed or fully fail. No partial deductions.

7. **Credit Display**: All credit values returned to mobile app are in display format (whole credits), not units.

---

## Testing Credit Deductions

### Test Scenarios
1. **Sufficient Credits**: User has enough credits → Action succeeds, credits deducted
2. **Insufficient Credits**: User lacks credits → Action fails with error, no deduction
3. **Zero Credits**: User has 0 credits → Action fails, clear error message
4. **Transaction Failure**: Database error during deduction → Action fails, credits not deducted
5. **Action Failure**: Action fails after credit check → Credits not deducted (should not reach deduction step)

### Verification Queries
```sql
-- Check user's credit transactions
SELECT * FROM credit_transactions 
WHERE user_id = 'user_id' 
ORDER BY transaction_date DESC 
LIMIT 10;

-- Check user's current balance
SELECT credits FROM users_registration 
WHERE chat_id = 'user_id';

-- Verify transaction logging
SELECT 
    transaction_type,
    COUNT(*) as count,
    SUM(amount) as total_deducted
FROM credit_transactions
WHERE user_id = 'user_id'
GROUP BY transaction_type;
```

---

## Configuration

Credit costs are defined in `config.py` under `Config.CREDIT_COSTS`. To modify costs:

1. Update the cost value in `config.py`
2. Restart the application
3. Changes apply immediately to new requests

**Note**: Cost changes do not affect existing transactions or refund previous charges.

---

## Support & Troubleshooting

### Common Issues

1. **Credits Not Deducting**: 
   - Check transaction logs in `credit_transactions` table
   - Verify `deduct_credits()` function is being called
   - Check for errors in application logs

2. **Incorrect Credit Amounts**:
   - Verify action key matches `Config.CREDIT_COSTS`
   - Check if special cost calculation applies (exam sessions, etc.)
   - Verify unit-to-credit conversion (1 credit = 10 units)

3. **Double Deductions**:
   - Ensure credits are only deducted once per action
   - Check for duplicate API calls from mobile app
   - Verify idempotency in transaction logging

### Debug Endpoints
- `/credits/balance`: Get current credit balance
- `/credits/transactions`: Get transaction history
- `/credits/info`: Get detailed credit breakdown

---

## Version History

- **v1.0** (Current): Initial documentation
  - All endpoints documented
  - Cost structure defined
  - Examples provided

---

## Contact

For questions or issues regarding credit deductions:
- Check application logs
- Review `credit_transactions` table
- Contact development team
