# Missing Credit Costs Action Keys in Supabase Database

## Overview
This document lists all action keys used in the WhatsApp bot code that are **NOT** present in the Supabase `credit_costs` table. These features currently use fallback values from code.

**Total Missing:** 30+ action keys
**Impact:** Inconsistent pricing, no centralized cost management for these features

---

## Missing Action Keys by Category

### 📚 Combined Science (O-Level)
| Action Key | Code Fallback | Used In | Priority |
|------------|---------------|---------|----------|
| `combined_science_topical_mcq` | 10 units (1 credit) | `api/webhook.py` - `handle_combined_science_question()` | High |
| `combined_science_topical_structured` | 10 units (1 credit) | Database configuration | Medium |

### 🔢 Mathematics (O-Level)
| Action Key | Code Fallback | Used In | Priority |
|------------|---------------|---------|----------|
| `math_quiz` | 10 units (1 credit) | Database configuration | Medium |
| `image_solve` | 30 units (3 credits) | `api/webhook.py` - `handle_image_message()` | High |

### 📖 English
| Action Key | Code Fallback | Used In | Priority |
|------------|---------------|---------|----------|
| `english_essay_marking` | 30 units (3 credits) | Database configuration | Medium |
| `english_comprehension_grading` | 30 units (3 credits) | Database configuration | Medium |
| `english_summary_grading` | 30 units (3 credits) | Database configuration | Medium |

### 🎓 A-Level Detailed Keys

**Note:** Supabase has generic keys (`a_level_*_topical`, `a_level_*_exam`) but code uses detailed keys for specific question types.

#### Pure Mathematics
| Action Key | Code Fallback | Priority |
|------------|---------------|----------|
| `a_level_pure_math_topical_mcq` | 10 units (1 credit) | Low |
| `a_level_pure_math_topical_structured` | 10 units (1 credit) | Low |

#### Chemistry
| Action Key | Code Fallback | Priority |
|------------|---------------|----------|
| `a_level_chemistry_topical_mcq` | 10 units (1 credit) | Low |
| `a_level_chemistry_topical_structured` | 10 units (1 credit) | Low |

#### Physics
| Action Key | Code Fallback | Priority |
|------------|---------------|----------|
| `a_level_physics_topical_mcq` | 10 units (1 credit) | Low |
| `a_level_physics_topical_structured` | 10 units (1 credit) | Low |

#### Biology
| Action Key | Code Fallback | Priority |
|------------|---------------|----------|
| `a_level_biology_topical_mcq` | 10 units (1 credit) | Low |
| `a_level_biology_topical_structured` | 10 units (1 credit) | Low |
| `a_level_biology_topical_essay` | 10 units (1 credit) | Low |
| `a_level_biology_exam_mcq` | 10 units (1 credit) | Low |
| `a_level_biology_exam_structured` | 10 units (1 credit) | Low |
| `a_level_biology_exam_essay` | 10 units (1 credit) | Low |

### 👨‍🏫 AI Teacher Mode
| Action Key | Code Fallback | Used In | Priority |
|------------|---------------|---------|----------|
| `teacher_mode_start` | 1 unit (0.1 credit) | `services/combined_science_teacher_service.py` | High |
| `teacher_mode_followup` | 1 unit (0.1 credit) | `services/combined_science_teacher_service.py` | High |
| `teacher_mode_pdf` | 10 units (1 credit) | Database configuration | Medium |

### 🎓 Project Assistant
| Action Key | Code Fallback | Used In | Priority |
|------------|---------------|---------|----------|
| `project_assistant_start` | 20 units (2 credits) | `services/project_assistant_service.py` | High |
| `project_assistant_followup` | 20 units (2 credits) | `services/project_assistant_service.py` | High |
| `project_assistant_batch` | 20 units (2 credits) | Database configuration | Medium |
| `project_web_search` | 20 units (2 credits) | `api/mobile.py` | High |
| `project_deep_research` | 50 units (5 credits) | Database configuration | Medium |
| `project_transcribe` | 20 units (2 credits) | Database configuration | Medium |
| `project_image_generation` | 20 units (2 credits) | Database configuration | Medium |

### 📚 Study Tools
| Action Key | Code Fallback | Used In | Priority |
|------------|---------------|---------|----------|
| `flashcard_single` | 10 units (1 credit) | Database configuration | Low |
| `virtual_lab_knowledge_check` | 10 units (1 credit) | Database configuration | Low |

---

## SQL Insert Statements for Missing Keys

To add these to Supabase, use the following SQL (adjust costs as needed):

```sql
-- Combined Science
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('combined_science_topical_mcq', 1, 'Combined Science', 'Topical Questions (MCQ)', 'Combined Science MCQ questions', true),
  ('combined_science_topical_structured', 1, 'Combined Science', 'Topical Questions (Structured)', 'Combined Science structured questions', true);

-- Mathematics
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('math_quiz', 1, 'Mathematics', 'Quiz Questions (Streaming)', 'Mathematics streaming quiz questions', true),
  ('image_solve', 3, 'Mathematics', 'Image Math Solver (OCR)', 'OCR-based math problem solving from images', true);

-- English
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('english_essay_marking', 3, 'English', 'Essay Marking', 'AI marking and feedback for essays', true),
  ('english_comprehension_grading', 3, 'English', 'Comprehension Grading', 'Grading of comprehension answers', true),
  ('english_summary_grading', 3, 'English', 'Summary Grading', 'Grading of summary writing', true);

-- AI Teacher Mode
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('teacher_mode_start', 1, 'AI Teacher', 'Start Session', 'Starting new teaching session', true),
  ('teacher_mode_followup', 1, 'AI Teacher', 'Follow-up Response', 'Follow-up questions in active session', true),
  ('teacher_mode_pdf', 1, 'AI Teacher', 'PDF Notes Generation', 'Generating PDF study notes from session', true);

-- Project Assistant
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('project_assistant_start', 2, 'Project Assistant', 'Start Session', 'Starting new project assistance session', true),
  ('project_assistant_followup', 2, 'Project Assistant', 'Follow-up Response', 'Continued conversation in project session', true),
  ('project_assistant_batch', 2, 'Project Assistant', 'Batch Processing', 'Batch project processing', true),
  ('project_web_search', 2, 'Project Assistant', 'Web Search', 'Google grounding search for project research', true),
  ('project_deep_research', 5, 'Project Assistant', 'Deep Research', 'Advanced deep research feature', true),
  ('project_transcribe', 2, 'Project Assistant', 'Audio Transcription', 'Transcribing audio for projects', true),
  ('project_image_generation', 2, 'Project Assistant', 'Image Generation', 'Generating images for projects', true);

-- Study Tools
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('flashcard_single', 1, 'Study Tools', 'Flashcard Generation', 'Single flashcard generation', true),
  ('virtual_lab_knowledge_check', 1, 'Virtual Lab', 'Knowledge Check', 'Virtual lab knowledge check questions', true);
```

**Note:** A-Level detailed keys (MCQ, structured, essay variants) may not need separate entries if the generic keys are sufficient. Review code usage to determine if detailed keys are actually used.

---

## Priority Recommendations

### High Priority (Add to Database)
1. `combined_science_topical_mcq` - Frequently used
2. `image_solve` - High-value feature
3. `teacher_mode_start` / `teacher_mode_followup` - Active feature
4. `project_assistant_start` / `project_assistant_followup` - Active feature
5. `project_web_search` - Used in mobile API

### Medium Priority
6. `combined_science_topical_structured`
7. `math_quiz`
8. English grading features
9. `teacher_mode_pdf`
10. Other Project Assistant features

### Low Priority
11. A-Level detailed keys (if generic keys are sufficient)
12. Study tools (flashcards, virtual lab)

---

## Impact Analysis

### Current State
- **30+ features** use fallback values
- No centralized cost management for these features
- Costs cannot be updated without code deployment
- Inconsistent with database-driven approach

### After Adding to Database
- All costs manageable via Supabase dashboard
- Can update costs without code changes
- Consistent pricing strategy
- Better cost tracking and analytics

---

**Last Updated:** Based on codebase analysis and Supabase verification
**Status:** Ready for database population
