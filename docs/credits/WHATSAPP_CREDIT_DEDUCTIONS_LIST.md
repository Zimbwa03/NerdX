# WhatsApp Bot - Complete Credit Deduction List

## Overview
This document lists all credit deductions currently implemented in the WhatsApp bot, organized by feature area.

**Note:** 
- Supabase database stores costs in **credits** (1, 2, 3, etc.)
- Code fallback uses **units** (10, 20, 30, etc. where 10 units = 1 credit)
- **Verified:** Costs verified from Supabase database using MCP tools
- **Status:** ✅ = Verified in Supabase, ⚠️ = Uses fallback (not in database), 🔴 = Discrepancy found

**Last Verified:** Via Supabase MCP query

---

## 📚 **COMBINED SCIENCE (O-Level)**

### Topical Questions (Generic)
- **Action Key:** `combined_science_topical`
- **Supabase Cost:** ✅ **1 credit** (verified)
- **Code Fallback:** 10 units (1 credit)
- **Status:** ✅ Verified - Matches
- **Location:** Database (Supabase)
- **Description:** Combined Science topical questions

### Topical Questions (MCQ)
- **Action Key:** `combined_science_topical_mcq`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 10 units (1 credit)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** `api/webhook.py` - `handle_combined_science_question()`
- **When Deducted:** After successful question generation
- **Description:** MCQ questions from Biology, Chemistry, or Physics topics

### Topical Structured Questions
- **Action Key:** `combined_science_topical_structured`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 10 units (1 credit)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** Database configuration
- **Description:** Structured questions (non-MCQ)

### Exam Questions
- **Action Key:** `combined_science_exam`
- **Supabase Cost:** 🔴 **2 credits** (verified)
- **Code Fallback:** 10 units (1 credit)
- **Status:** 🔴 **DISCREPANCY** - Database = 2 credits, Code/Doc = 1 credit
- **Location:** `api/webhook.py` - `load_next_combined_question()`
- **When Deducted:** Per exam question loaded
- **Description:** Past paper exam questions from all science subjects

---

## 🔢 **MATHEMATICS (O-Level)**

### Topical Questions
- **Action Key:** `math_topical`
- **Supabase Cost:** ✅ **1 credit** (verified)
- **Code Fallback:** 10 units (1 credit)
- **Status:** ✅ Verified - Matches
- **Location:** `handlers/mathematics_handler.py` - `handle_question_generation()`
- **When Deducted:** After successful question delivery (secure post-delivery deduction)
- **Description:** AI-generated topical questions

### Exam Questions
- **Action Key:** `math_exam`
- **Supabase Cost:** 🔴 **2 credits** (verified)
- **Code Fallback:** 10 units (1 credit)
- **Status:** 🔴 **DISCREPANCY** - Database = 2 credits, Code/Doc = 1 credit
- **Location:** `handlers/exam_mathematics_handler.py` - `handle_next_question()`
- **When Deducted:** Per exam question
- **Description:** Past paper exam questions

### Quiz Questions (Streaming)
- **Action Key:** `math_quiz`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 10 units (1 credit)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** Database configuration
- **Description:** Streaming quiz questions

### Graph Practice
- **Action Key:** `math_graph_practice`
- **Supabase Cost:** 🔴 **3 credits** (verified)
- **Code Fallback:** 10 units (1 credit)
- **Status:** 🔴 **DISCREPANCY** - Database = 3 credits, Code/Doc = 1 credit
- **Location:** 
  - `api/webhook.py` - Graph generation (line 2813)
  - `handlers/graph_practice_handler.py` - Graph practice questions
- **When Deducted:** Per graph/question/video generated
- **Description:** Graph generation and practice questions

### Image Math Solver (OCR)
- **Action Key:** `image_solve`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 30 units (3 credits)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** `api/webhook.py` - `handle_image_message()` (line 1588)
- **When Deducted:** After successful image processing and solution
- **Description:** OCR-based math problem solving from images

---

## 📖 **ENGLISH**

### Topical Questions
- **Action Key:** `english_topical`
- **Supabase Cost:** ✅ **1 credit** (verified)
- **Code Fallback:** 10 units (1 credit)
- **Status:** ✅ Verified - Matches
- **Location:** `handlers/english_handler.py` - Multiple locations
- **When Deducted:** Per question generated
- **Description:** Grammar, vocabulary, and comprehension questions

### Comprehension
- **Action Key:** `english_comprehension`
- **Supabase Cost:** ✅ **3 credits** (verified)
- **Code Fallback:** 30 units (3 credits)
- **Status:** ✅ Verified - Matches
- **Location:** `handlers/english_handler.py` - `handle_comprehension_request()`
- **When Deducted:** Per comprehension passage generated
- **Description:** Full comprehension passages with questions

### Essay Writing
- **Action Key:** `english_essay_writing`
- **Supabase Cost:** ✅ **3 credits** (verified)
- **Code Fallback:** 30 units (3 credits)
- **Status:** ✅ Verified - Matches
- **Location:** `handlers/english_handler.py` - `handle_essay_writing_request()`
- **When Deducted:** Per essay generated
- **Description:** Essay generation and writing assistance

### Essay Marking
- **Action Key:** `english_essay_marking`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 30 units (3 credits)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** Database configuration
- **Description:** AI marking and feedback for essays

### Comprehension Grading
- **Action Key:** `english_comprehension_grading`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 30 units (3 credits)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** Database configuration
- **Description:** Grading of comprehension answers

### Summary Grading
- **Action Key:** `english_summary_grading`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 30 units (3 credits)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** Database configuration
- **Description:** Grading of summary writing

---

## 🎓 **A-LEVEL SUBJECTS**

**Note:** Supabase uses generic keys (`a_level_*_topical`, `a_level_*_exam`) while code has detailed keys. Database costs are significantly higher than documented.

### Pure Mathematics
- **Topical (Generic):** `a_level_pure_math_topical`
  - **Supabase Cost:** 🔴 **5 credits** (verified)
  - **Code Fallback:** 10 units (1 credit)
  - **Status:** 🔴 **MAJOR DISCREPANCY** - Database = 5 credits, Code/Doc = 1 credit
- **Topical MCQ:** `a_level_pure_math_topical_mcq` - ⚠️ Not in database (fallback: 10 units = 1 credit)
- **Topical Structured:** `a_level_pure_math_topical_structured` - ⚠️ Not in database (fallback: 10 units = 1 credit)
- **Exam:** `a_level_pure_math_exam`
  - **Supabase Cost:** 🔴 **8 credits** (verified)
  - **Code Fallback:** 10 units (1 credit)
  - **Status:** 🔴 **MAJOR DISCREPANCY** - Database = 8 credits, Code/Doc = 1 credit

### Chemistry
- **Topical (Generic):** `a_level_chemistry_topical`
  - **Supabase Cost:** 🔴 **5 credits** (verified)
  - **Code Fallback:** 10 units (1 credit)
  - **Status:** 🔴 **MAJOR DISCREPANCY** - Database = 5 credits, Code/Doc = 1 credit
- **Topical MCQ:** `a_level_chemistry_topical_mcq` - ⚠️ Not in database (fallback: 10 units = 1 credit)
- **Topical Structured:** `a_level_chemistry_topical_structured` - ⚠️ Not in database (fallback: 10 units = 1 credit)
- **Exam:** `a_level_chemistry_exam`
  - **Supabase Cost:** 🔴 **8 credits** (verified)
  - **Code Fallback:** 10 units (1 credit)
  - **Status:** 🔴 **MAJOR DISCREPANCY** - Database = 8 credits, Code/Doc = 1 credit

### Physics
- **Topical (Generic):** `a_level_physics_topical`
  - **Supabase Cost:** 🔴 **5 credits** (verified)
  - **Code Fallback:** 10 units (1 credit)
  - **Status:** 🔴 **MAJOR DISCREPANCY** - Database = 5 credits, Code/Doc = 1 credit
- **Topical MCQ:** `a_level_physics_topical_mcq` - ⚠️ Not in database (fallback: 10 units = 1 credit)
- **Topical Structured:** `a_level_physics_topical_structured` - ⚠️ Not in database (fallback: 10 units = 1 credit)
- **Exam:** `a_level_physics_exam`
  - **Supabase Cost:** 🔴 **8 credits** (verified)
  - **Code Fallback:** 10 units (1 credit)
  - **Status:** 🔴 **MAJOR DISCREPANCY** - Database = 8 credits, Code/Doc = 1 credit

### Biology
- **Topical (Generic):** `a_level_biology_topical`
  - **Supabase Cost:** 🔴 **5 credits** (verified)
  - **Code Fallback:** 10 units (1 credit)
  - **Status:** 🔴 **MAJOR DISCREPANCY** - Database = 5 credits, Code/Doc = 1 credit
- **Topical MCQ:** `a_level_biology_topical_mcq` - ⚠️ Not in database (fallback: 10 units = 1 credit)
- **Topical Structured:** `a_level_biology_topical_structured` - ⚠️ Not in database (fallback: 10 units = 1 credit)
- **Topical Essay:** `a_level_biology_topical_essay` - ⚠️ Not in database (fallback: 10 units = 1 credit)
- **Exam:** `a_level_biology_exam`
  - **Supabase Cost:** 🔴 **8 credits** (verified)
  - **Code Fallback:** 10 units (1 credit)
  - **Status:** 🔴 **MAJOR DISCREPANCY** - Database = 8 credits, Code/Doc = 1 credit
- **Exam MCQ:** `a_level_biology_exam_mcq` - ⚠️ Not in database (fallback: 10 units = 1 credit)
- **Exam Structured:** `a_level_biology_exam_structured` - ⚠️ Not in database (fallback: 10 units = 1 credit)
- **Exam Essay:** `a_level_biology_exam_essay` - ⚠️ Not in database (fallback: 10 units = 1 credit)

---

## 👨‍🏫 **AI TEACHER MODE (Combined Science)**

### Start Session
- **Action Key:** `teacher_mode_start`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 1 unit (0.1 credit)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** `services/combined_science_teacher_service.py` - `start_teaching_session()`
- **When Deducted:** Per AI response (first message in new session)
- **Description:** Starting a new teaching session

### Follow-up Responses
- **Action Key:** `teacher_mode_followup`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 1 unit (0.1 credit)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** `services/combined_science_teacher_service.py` - `start_teaching_session()`
- **When Deducted:** Per AI response (continuation messages)
- **Description:** Follow-up questions and responses in active session

### PDF Notes Generation
- **Action Key:** `teacher_mode_pdf`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 10 units (1 credit)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** Database configuration
- **Description:** Generating PDF study notes from session

---

## 🎓 **PROJECT ASSISTANT**

### Start Session
- **Action Key:** `project_assistant_start`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 20 units (2 credits)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** `services/project_assistant_service.py`
- **When Deducted:** Per AI response (first message)
- **Description:** Starting new project assistance session

### Follow-up Responses
- **Action Key:** `project_assistant_followup`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 20 units (2 credits)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** `services/project_assistant_service.py` - `_handle_conversation()` (line 1531)
- **When Deducted:** Per AI response
- **Description:** Continued conversation in project session

### Web Search
- **Action Key:** `project_web_search`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 20 units (2 credits)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** `api/mobile.py` - Project web search endpoint
- **When Deducted:** Per web search performed
- **Description:** Google grounding search for project research

### Deep Research
- **Action Key:** `project_deep_research`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 50 units (5 credits)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** Database configuration
- **Description:** Advanced deep research feature

### Audio Transcription
- **Action Key:** `project_transcribe`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 20 units (2 credits)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** Database configuration
- **Description:** Transcribing audio for projects

### Image Generation
- **Action Key:** `project_image_generation`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 20 units (2 credits)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** Database configuration
- **Description:** Generating images for projects

---

## 🎤 **AUDIO FEATURES**

### Audio Feature (General)
- **Action Key:** `audio_feature`
- **Supabase Cost:** 🔴 **10 credits** (verified)
- **Code Fallback:** 10 units (1 credit)
- **Status:** 🔴 **MAJOR DISCREPANCY** - Database = 10 credits, Code/Doc = 1 credit
- **Location:** Database configuration
- **Description:** General audio responses

### Voice Chat (Live)
- **Action Key:** `voice_chat`
- **Supabase Cost:** 🔴 **10 credits** (verified)
- **Code Fallback:** 10 units (1 credit)
- **Status:** 🔴 **MAJOR DISCREPANCY** - Database = 10 credits, Code/Doc = 1 credit
- **Location:** Database configuration
- **Description:** Live voice chat feature (per 5 seconds)

---

## 📚 **STUDY TOOLS**

### Flashcards
- **Action Key:** `flashcard_single`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 10 units (1 credit)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** Database configuration
- **Description:** Single flashcard generation

---

## 🧪 **VIRTUAL LAB**

### Knowledge Check
- **Action Key:** `virtual_lab_knowledge_check`
- **Supabase Cost:** ⚠️ **Not in database** (uses fallback)
- **Code Fallback:** 10 units (1 credit)
- **Status:** ⚠️ Missing from database - Uses fallback
- **Location:** Database configuration
- **Description:** Virtual lab knowledge check questions

---

## 📊 **CREDIT COST SUMMARY BY CATEGORY (Verified from Supabase)**

### Low Cost (1 Credit)
- Combined Science topical: **1 credit** ✅
- Mathematics topical: **1 credit** ✅
- English topical: **1 credit** ✅

### Medium Cost (2-3 Credits)
- Combined Science exam: **2 credits** 🔴 (was documented as 1)
- Mathematics exam: **2 credits** 🔴 (was documented as 1)
- Mathematics graph practice: **3 credits** 🔴 (was documented as 1)
- English comprehension: **3 credits** ✅
- English essay writing: **3 credits** ✅

### High Cost (5-10 Credits)
- A-Level topical (all subjects): **5 credits** 🔴 (was documented as 1)
- A-Level exam (all subjects): **8 credits** 🔴 (was documented as 1)
- Audio features: **10 credits** 🔴 (was documented as 1)

### Missing from Database (Using Fallback)
- Combined Science topical MCQ/structured
- Mathematics quiz, image solve
- English essay marking, grading features
- A-Level detailed keys (MCQ, structured, essay variants)
- AI Teacher mode (all keys)
- Project Assistant (all keys)
- Flashcards, Virtual Lab

---

## 🔍 **DEDUCTION POINTS IN CODE**

### Direct Deductions (api/webhook.py)
1. **Line 1588:** Image solve (`image_solve`)
2. **Line 2813:** Math graph practice (`math_graph_practice`)
3. **Line 3381:** Combined science exam (`combined_science_exam`)
4. **Line 3722:** General question generation (varies by subject/difficulty)
5. **Line 4242:** Combined science topical MCQ (`combined_science_topical_mcq`)

### Handler-Based Deductions
1. **handlers/mathematics_handler.py:**
   - `handle_question_generation()` - Math topical (secure post-delivery)

2. **handlers/exam_mathematics_handler.py:**
   - `handle_next_question()` - Math exam

3. **handlers/graph_practice_handler.py:**
   - Graph practice questions

4. **handlers/english_handler.py:**
   - `handle_comprehension_request()` - English comprehension
   - `handle_essay_writing_request()` - English essay
   - Multiple locations for topical questions

### Service-Based Deductions
1. **services/combined_science_teacher_service.py:**
   - `start_teaching_session()` - Teacher mode (start & follow-up)

2. **services/project_assistant_service.py:**
   - `_handle_conversation()` - Project assistant responses

---

## ⚠️ **IMPORTANT NOTES**

1. **Credit Units vs Credits:**
   - **Supabase database stores costs in CREDITS** (1, 2, 3, etc.)
   - **Code fallback uses UNITS** (10, 20, 30, etc. where 10 units = 1 credit)
   - Conversion: Database 1 credit = Code 10 units

2. **Verification Status:**
   - ✅ **Verified in Supabase** - Cost confirmed from database
   - ⚠️ **Uses Fallback** - Not in Supabase, uses code fallback value
   - 🔴 **Discrepancy** - Database value differs from code/documentation

3. **Critical Discrepancies Found:**
   - A-Level subjects: Database = 5-8 credits vs Code/Doc = 1 credit (5-8x difference)
   - Audio features: Database = 10 credits vs Code/Doc = 1 credit (10x difference)
   - Math graph practice: Database = 3 credits vs Code/Doc = 1 credit (3x difference)
   - Exam questions: Database = 2 credits vs Code/Doc = 1 credit (2x difference)

4. **Deduction Timing:**
   - Most deductions happen AFTER successful delivery
   - Some use secure post-delivery deduction system
   - Credits checked BEFORE action, deducted AFTER success

5. **Fallback Costs:**
   - If database unavailable, uses fallback costs from `credit_costs_db.py`
   - **30+ action keys missing from Supabase** - all use fallback values
   - Fallback costs may differ significantly from database values

6. **Missing from Database:**
   - Many detailed action keys (MCQ, structured variants)
   - AI Teacher mode features
   - Project Assistant features
   - Study tools (flashcards, virtual lab)
   - Image solve/OCR features

---

## 📝 **RECOMMENDATIONS FOR REVIEW**

1. Verify all action keys are properly implemented
2. Check if deduction timing is consistent (pre vs post-delivery)
3. Ensure error handling for failed deductions
4. Verify credit costs match between database and code
5. Check for any missing deduction points
6. Review if all features properly check credits before action

---

---

## 📋 **VERIFICATION SUMMARY**

**Total Entries in Supabase:** 18 active entries
**Total Missing from Database:** 30+ action keys (use fallback)
**Discrepancies Found:** 8 major discrepancies identified

### Verified Entries (18)
- Combined Science: 2 entries
- Mathematics: 3 entries
- English: 3 entries
- A-Level: 8 entries (4 subjects × 2 types)
- Audio: 2 entries

### Missing Entries (30+)
- Combined Science variants: 2
- Mathematics variants: 2
- English variants: 3
- A-Level detailed keys: 12
- AI Teacher: 3
- Project Assistant: 7
- Study Tools: 2

---

**Last Updated:** Verified from Supabase database via MCP tools
**Database Source:** Supabase `credit_costs` table (verified)
**Code Fallback Source:** `database/credit_costs_db.py`
**Service Source:** `services/advanced_credit_service.py`
**Verification Report:** See `CREDIT_COSTS_VERIFICATION_REPORT.md`
