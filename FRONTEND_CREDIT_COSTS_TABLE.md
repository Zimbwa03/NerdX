# Frontend Mobile Application - Credit Costs Table

## Overview
This document lists **ALL credit costs as defined in the frontend code**. The backend should match these values exactly.

**Note**: 1 credit = 10 units in backend storage

---

## 📋 Complete Credit Costs Table

| # | Feature | Subject/Type | Question Format | Credit Cost | Frontend File Location | Notes |
|---|---------|--------------|-----------------|-------------|------------------------|-------|
| **QUIZ QUESTIONS (TOPICAL)** |
| 1 | Quiz Question | Mathematics | MCQ/Structured | **0.5 credit** | `creditCalculator.ts:31` | All math topical questions |
| 2 | Quiz Question | Combined Science | MCQ | **0.25 credit** | `creditCalculator.ts:37` | O-Level Combined Science MCQ |
| 3 | Quiz Question | Combined Science | Structured | **0.5 credit** | `creditCalculator.ts:37` | O-Level Combined Science Structured |
| 4 | Quiz Question | English | Topical | **0.5 credit** | `creditCalculator.ts:42` | All English topical questions |
| 5 | Quiz Question | A-Level Pure Math | MCQ/Structured | **0.5 credit** | `creditCalculator.ts:47` | All A-Level Pure Math questions |
| 6 | Quiz Question | A-Level Chemistry | MCQ/Structured | **0.5 credit** | `creditCalculator.ts:52` | All A-Level Chemistry questions |
| 7 | Quiz Question | A-Level Physics | MCQ/Structured | **0.5 credit** | `creditCalculator.ts:57` | All A-Level Physics questions |
| 8 | Quiz Question | A-Level Biology | MCQ | **0.25 credit** | `ALevelBiologyScreen.tsx:110` | A-Level Biology MCQ only |
| 9 | Quiz Question | A-Level Biology | Structured | **0.5 credit** | `ALevelBiologyScreen.tsx:110` | A-Level Biology Structured |
| 10 | Quiz Question | A-Level Biology | Essay | **0.5 credit** | `ALevelBiologyScreen.tsx:110` | A-Level Biology Essay |
| 11 | Quiz Question | Computer Science | MCQ/Structured | **1 credit** | `creditCalculator.ts:67` | O-Level Computer Science |
| 12 | Quiz Question | Any Subject | Image Question | **2 credits** | `creditCalculator.ts:26` | When `mix_images=true` and image question generated |
| **EXAM QUESTIONS** |
| 13 | Exam Question | Mathematics | MCQ/Structured | **0.5 credit** | `ExamSetupModal.tsx:158` | Per question in exam session |
| 14 | Exam Question | Combined Science | MCQ/Structured | **0.5 credit** | `ExamSetupModal.tsx:160` | Per question in exam session |
| 15 | Exam Question | A-Level Biology | MCQ | **0.25 credit** | `ExamSetupModal.tsx:164` | Per MCQ in exam session |
| 16 | Exam Question | A-Level Biology | Structured/Essay | **0.5 credit** | `ExamSetupModal.tsx:171` | Per structured/essay in exam session |
| 17 | Exam Question | A-Level (Other) | MCQ/Structured | **0.5 credit** | `ExamSetupModal.tsx:174` | A-Level Pure Math, Chemistry, Physics |
| 18 | Exam Question | English | Any | **0.5 credit** | `ExamSetupModal.tsx:176` | Per question in exam session |
| **ENGLISH FEATURES** |
| 19 | Comprehension | English | Full Passage + Questions | **2 credits** | `EnglishComprehensionScreen.tsx:45` | Generate comprehension passage |
| 20 | Comprehension Grading | English | AI Grading | **1 credits** | Backend only | Not explicitly shown in frontend |
| 21 | Summary Grading | English | AI Grading | **1 credits** | Backend only | Not explicitly shown in frontend |
| 22 | Essay Marking | English | Essay Submission | **2 credits** | `EnglishEssayScreen.tsx:172` | Mark essay submission |
| **MATHEMATICS - GRAPH PRACTICE** |
| 23 | Graph Generation | Mathematics | Graph Practice | **1 credit** | `GraphPracticeScreen.tsx:115` | Generate math graph |
| 24 | Graph Generation | Mathematics | Custom Graph | **1 credit** | `GraphPracticeScreen.tsx:115` | Custom graph generation |
| 25 | Graph Generation | Mathematics | Linear Programming | **1 credit** | `GraphPracticeScreen.tsx:115` | Linear programming graph |
| 26 | Image Solving | Mathematics | OCR + Solve | **2 credits** | `GraphPracticeScreen.tsx:116` | Upload image and solve equation |
| **TEACHER MODE** |
| 27 | Teacher Mode | Any Subject | Start Session | **0.1 credit** | `TeacherModeSetupScreen.tsx:551` | Displayed as "Start for Free" but shows 0.1 credit |
| 28 | Teacher Mode | Any Subject | Follow-up Message | **0.1 credit** | `DashboardScreen.tsx:230` | Per AI response in teacher mode |
| 29 | Teacher Mode PDF | Any Subject | Generate Notes PDF | **2 credits** | Backend only | Not explicitly shown in frontend |
| **PROJECT ASSISTANT** |
| 30 | Project Assistant | Any Project | Start Chat | **0.1 credit** | `ProjectAssistantScreen.tsx:279` | Per AI response |
| 31 | Project Assistant | Any Project | Follow-up Message | **0.1 credit** | `ProjectAssistantScreen.tsx:344` | Per AI response |
| 32 | Project Web Search | Any Project | Web Search | **2 credits** | Backend only | Not explicitly shown in frontend |
| 33 | Project Deep Research | Any Project | Deep Research | **2 credits** | Backend only | Not explicitly shown in frontend |
| 34 | Project Transcribe | Any Project | Audio Transcription | **0.1 credits** | Backend only | Not explicitly shown in frontend |
| 35 | Project Image Generation | Any Project | Generate Image | **3 credits** | `ProjectAssistantScreen.tsx:1117` | Displayed in UI |
| **STUDY TOOLS** |
| 36 | Flashcards | Any Subject | Generate Single | **0.25 credit** | `FlashcardSection.tsx:298` | Per flashcard generated |
| 37 | Flashcards | Any Subject | Generate Multiple | **0.25 credit × count** | `FlashcardSection.tsx:298` | Per flashcard (e.g., 5 flashcards = 1.25 credits) |
| 38 | Virtual Lab Knowledge Check | Any Subject | Per Question | **0.25 credit** | Backend only | Not explicitly shown in frontend (likely 1 credit per question) |
| **A-LEVEL SCREENS (SPECIAL CASES)** |
| 39 | A-Level Pure Math | A-Level | Start Quiz | **0.5 credit** | `ALevelPureMathScreen.tsx:89` | Initial cost check (may be per question) |
| 40 | A-Level Physics | A-Level | Start Quiz | **0.5 credit** | `ALevelPhysicsScreen.tsx:114` | Initial cost check (may be per question) |
| 41 | A-Level Chemistry | A-Level | Start Quiz | **0.5 credit** | `ALevelChemistryScreen.tsx:106` | Initial cost check (may be per question) |

---

## 📊 Summary by Category

### Topical Questions (Regular Quiz)
- **Mathematics**: 1 credit
- **Combined Science**: 1 credit (MCQ or Structured)
- **English**: 1 credit
- **A-Level Pure Math**: 1 credit
- **A-Level Chemistry**: 1 credit
- **A-Level Physics**: 1 credit
- **A-Level Biology**: 0.25 credit (MCQ) or 0.5 credit (Structured/Essay)
- **Computer Science**: 1 credit
- **Image Questions**: 4 credits (when mix_images enabled)

### Exam Questions
- **Mathematics**: 0.5 credit per question
- **Combined Science**: 0.5 credit per question
- **A-Level Biology**: 0.25 credit (MCQ) or 0.5 credit (Structured/Essay)
- **A-Level (Other)**: 0.5 credit per question
- **English**: 1 credit per question

### English Complex Features
- **Comprehension Generation**: 3 credits
- **Comprehension Grading**: 2 credits (backend)
- **Summary Grading**: 2 credits (backend)
- **Essay Marking**: 3 credits

### Mathematics Graph Practice
- **Graph Generation**: 1 credit per graph
- **Image Solving (OCR)**: 3 credits per image

### Teacher Mode
- **Start Session**: 0.1 credit (shown as "Start for Free")
- **Follow-up Messages**: 1 credit per AI response
- **PDF Generation**: 2 credits (backend)

### Project Assistant
- **Chat Messages**: 1 credit per AI response
- **Web Search**: 2 credits (backend)
- **Deep Research**: 2 credits (backend)
- **Audio Transcription**: 2 credits (backend)
- **Image Generation**: 2 credits

### Study Tools
- **Flashcards**: 0.25 credit per flashcard
- **Virtual Lab Knowledge Check**: 1 credit per question (estimated, not explicitly shown)

---

## 🔍 Key Findings

### Discrepancies to Fix:

1. **A-Level Biology MCQ**: Frontend uses **0.25 credit**, backend likely uses 1 credit (10 units)
2. **A-Level Biology Structured/Essay**: Frontend uses **0.5 credit**, backend likely uses 2 credits (20 units)
3. **Exam Questions**: Frontend uses **0.5 credit** for most subjects, backend may use different values
4. **Flashcards**: Frontend uses **0.25 credit**, backend likely uses 1 credit (10 units)
5. **Teacher Mode Start**: Frontend shows **0.1 credit**, backend likely uses 1 credit (10 units)
6. **Image Questions**: Frontend uses **4 credits**, need to verify backend
7. **Image Solving**: Frontend uses **3 credits**, backend likely uses 2 credits (20 units)

### Special Notes:

- **A-Level Pure Math/Physics/Chemistry Screens**: Show 0.5 credit check, but `creditCalculator.ts` shows 1 credit for topical questions. This may be for exam mode only.
- **Virtual Lab**: No explicit credit cost shown in frontend, likely handled by backend
- **English Comprehension Grading/Summary Grading**: Costs shown in backend (2 credits) but not explicitly in frontend UI

---

## 📝 Next Steps

1. ✅ **Verify this table** - Please review all values
2. ⏳ **Update backend** - Match backend credit costs to frontend values
3. ⏳ **Update database** - Update `credit_costs` table in Supabase
4. ⏳ **Test** - Verify deductions match frontend expectations

---

## 🔗 Frontend Files Referenced

- `NerdXApp/src/utils/creditCalculator.ts` - Main credit calculation utility
- `NerdXApp/src/screens/ALevelBiologyScreen.tsx` - A-Level Biology specific costs
- `NerdXApp/src/screens/ALevelPureMathScreen.tsx` - A-Level Pure Math
- `NerdXApp/src/screens/ALevelPhysicsScreen.tsx` - A-Level Physics
- `NerdXApp/src/screens/ALevelChemistryScreen.tsx` - A-Level Chemistry
- `NerdXApp/src/components/ExamSetupModal.tsx` - Exam session costs
- `NerdXApp/src/screens/GraphPracticeScreen.tsx` - Graph and image solving costs
- `NerdXApp/src/screens/EnglishComprehensionScreen.tsx` - Comprehension costs
- `NerdXApp/src/screens/EnglishEssayScreen.tsx` - Essay marking costs
- `NerdXApp/src/screens/TeacherModeSetupScreen.tsx` - Teacher mode costs
- `NerdXApp/src/screens/ProjectAssistantScreen.tsx` - Project assistant costs
- `NerdXApp/src/components/FlashcardSection.tsx` - Flashcard costs
- `NerdXApp/src/screens/CombinedScienceExamScreen.tsx` - Combined Science exam costs

---

**Please review this table and confirm all values are correct before we proceed to update the backend!**
