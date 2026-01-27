# Credits & AI Features – Detailed Analysis

This document describes **where credits are deducted** and **where AI is used** for each feature in NerdX, with exact costs. Costs are stored in **units** (1 credit = 10 units). Display uses whole/fractional credits (e.g. 5 units → 0.5 credit).

---

## 1. Credit system overview

| Concept | Value |
|--------|--------|
| **1 credit** | 10 units |
| **Where costs live** | Supabase `credit_costs` table; fallback in `database/credit_costs_db.py` |
| **Who resolves cost** | `advanced_credit_service.get_credit_cost(action_key)` (mobile); DB first, then `fallback_costs` |
| **When deducted** | Only **after** the action succeeds (e.g. question generated, graph returned). No deduction on failure. |

**Units → credits (examples):**

- 1 unit → 0.1 credit  
- 3 units → 0.25 credit  
- 5 units → 0.5 credit  
- 10 units → 1 credit  
- 20 units → 2 credits  

---

## 2. O Level Mathematics – feature-by-feature

All mathematics features that use AI and/or charge credits are listed below. **Action keys** are the values used in `get_credit_cost(...)` and in the DB.

---

### 2.1 Topical quiz (single question)

| Field | Detail |
|-------|--------|
| **Feature** | O Level Mathematics – topical question (one question per request) |
| **API** | `POST /quiz/generate` (or equivalent quiz generate endpoint) |
| **Request** | `subject: "mathematics"`, `question_type: "topical"`, `topic`, `difficulty`, etc. |
| **Action key** | `math_topical` |
| **Cost** | **5 units = 0.5 credit** per question |
| **When deducted** | After a question payload is successfully returned. |
| **AI** | **Vertex AI** (primary) and **DeepSeek** (fallback). `MathQuestionGenerator` in `services/math_question_generator.py`. If a cached question is used, no new AI call; credits still deducted for that delivered question. |
| **Code** | `_get_quiz_credit_action("mathematics", "topical", …)` → `math_topical`; cost from `advanced_credit_service.get_credit_cost("math_topical")`. Deduction in mobile API after successful generation. |

**Note:** Mathematics does **not** use “image questions” in the quiz flow. Image questions (and higher image cost) apply only to Combined Science and A-Level science subjects. So for math topical, the cost is always the **text** rate: 0.5 credit per question.

---

### 2.2 Exam-style quiz (single question from quiz UI)

| Field | Detail |
|-------|--------|
| **Feature** | O Level Mathematics – exam-style question from the same quiz pipeline |
| **API** | `POST /quiz/generate` with `question_type: "exam"` |
| **Request** | `subject: "mathematics"`, `question_type: "exam"`, optional `topic` (random topic if missing). |
| **Action key** | `math_exam` |
| **Cost** | **5 units = 0.5 credit** per question |
| **When deducted** | After a question is successfully generated and returned. |
| **AI** | Same as topical: **Vertex AI** + **DeepSeek** via `MathQuestionGenerator`. |
| **Code** | `_get_quiz_credit_action("mathematics", "exam", …)` → `math_exam`; cost and deduction same pattern as topical. |

---

### 2.3 Math quiz stream (thinking + question)

| Field | Detail |
|-------|--------|
| **Feature** | O Level Mathematics – streamed “thinking” updates then one question |
| **API** | `POST /quiz/generate-stream` |
| **Request** | `subject: "mathematics"`, `topic`, `difficulty`. Only math-type subjects allowed. |
| **Action key** | `math_quiz` |
| **Cost** | **5 units = 0.5 credit** per streamed question |
| **When deducted** | When the first `question` event is sent in the stream (i.e. after the question is successfully produced). |
| **AI** | **DeepSeek Reasoner (V3.2)** via `MathQuestionGenerator.generate_question_stream()` for step-by-step reasoning and question generation. |
| **Code** | `advanced_credit_service.get_credit_cost("math_quiz")`. Deduction inside the SSE generator when `event_type == 'question'`. |

---

### 2.4 Legacy “Math exam” next-question endpoint

| Field | Detail |
|-------|--------|
| **Feature** | Legacy math exam – “next question” (hybrid DB + AI) |
| **API** | `POST /exam/math/next` (or equivalent math-exam next endpoint) |
| **Request** | Session/context for current math exam. |
| **Action key** | `math_exam` |
| **Cost** | **5 units = 0.5 credit** per question |
| **When deducted** | After the next question is successfully generated and returned. |
| **AI** | **MathExamService**: every 3rd question (3, 6, 9, …) is AI via **MathQuestionGenerator** (Vertex/DeepSeek); others come from DB, with AI fallback if DB fails. |
| **Code** | `advanced_credit_service.get_credit_cost("math_exam")`; deduction after successful `math_exam_service.get_next_question()`. |

---

### 2.5 CBT exam session (create + per-question)

| Field | Detail |
|-------|--------|
| **Feature** | CBT exam for Mathematics (create session + fetch questions one by one) |
| **API** | `POST /exam/create` (subject e.g. `"mathematics"`, `level: "O_LEVEL"`, `question_mode`, `total_questions`, …) and `POST /exam/next` for each question. |
| **Create** | **No deduction** at create. Credits are only checked so the user has enough for the **whole** session. Total = `_get_exam_session_cost_units(subject, level, question_mode, total_questions)`. |
| **Per question** | **Deducted on each** `POST /exam/next`. Cost per question = `_get_exam_question_cost_units(subject, level, question_type)`. |
| **O Level Mathematics cost** | For `"mathematics"` + `O_LEVEL`: **5 units = 0.5 credit** per question, both MCQ and STRUCTURED. |
| **When deducted** | On each successful `exam_session_service.generate_next_question()` in the `/exam/next` handler. |
| **AI** | **ExamSessionService** uses DeepSeek (and subject-specific generators) to generate questions on demand. |
| **Code** | `_get_exam_question_cost_units("mathematics", "O_LEVEL", "MCQ"|"STRUCTURED")` → 5; `_get_exam_session_cost_units` for maths uses `mcq_cost=5`, `structured_cost=5` and sums over `total_questions` for the session total (validation only). |

---

### 2.6 Math graph (function plot)

| Field | Detail |
|-------|--------|
| **Feature** | Plot of a maths function (e.g. linear, quadratic, custom equation) |
| **API** | `POST /math/graph` and other graph endpoints (e.g. custom graph, linear programming) that use the same action key. |
| **Request** | e.g. `function_text` or equation/type parameters. |
| **Action key** | `math_graph_practice` |
| **Cost** | **10 units = 1 credit** per graph/request |
| **When deducted** | After the graph image is successfully generated and a URL/path is returned. |
| **AI** | **GraphService** – primarily rule-based/symbolic plotting. Any AI is in parsing/validation if present; main work is plot generation. Charged as “graph practice” feature. |
| **Code** | `advanced_credit_service.get_credit_cost("math_graph_practice")`; deduction after successful `graph_service.generate_function_graph(...)` and URL resolution. |

Other graph-related endpoints (e.g. custom graph, linear programming) use the same `math_graph_practice` cost and deduct once per successful graph.

---

### 2.7 Image solve (upload math problem image)

| Field | Detail |
|-------|--------|
| **Feature** | User uploads an image of a math problem; app returns extracted text and solution. |
| **API** | Image-upload endpoint that runs “original OCR flow” (e.g. upload image for solve). |
| **Action key** | `image_solve` |
| **Cost** | **20 units = 2 credits** per solve (from fallback; not in default DB seed). |
| **When deducted** | After the image is successfully processed and solution/text is returned. |
| **AI** | **ImageService** uses an “expert mathematics tutor” prompt and vision/LLM to analyze the image and produce solution text. |
| **Code** | `advanced_credit_service.get_credit_cost("image_solve")`; deduction after `image_service.process_image(image_file)` success. |

Used for maths (and any subject that goes through this flow). Cost is per successful solve.

---

### 2.8 Teacher Mode – Mathematics

Teacher Mode for “O Level Mathematics” (and other math-like subjects) uses the same action keys as the rest of Teacher Mode; cost is per action, not per subject.

| Sub-feature | Action key | Cost | When deducted | AI |
|-------------|------------|------|----------------|-----|
| Start session | `teacher_mode_start` | 1 unit = 0.1 credit | When session is successfully created. | Session init only; no reply yet. |
| Each follow-up reply | `teacher_mode_followup` | 1 unit = 0.1 credit | When the AI reply is successfully generated and sent. | **mathematics_teacher_service** (e.g. Vertex/DeepSeek) for “O Level Mathematics” / “Pure Mathematics”. |
| PDF notes | `teacher_mode_pdf` | 20 units = 2 credits | When PDF generation and delivery succeed. | **mathematics_teacher_service.generate_notes()** plus PDF build. |

**APIs:** `POST /teacher/start`, `POST /teacher/message` (or equivalent), and the PDF endpoint. Math is detected by subject name containing “math” or “pure mathematics”; then `mathematics_teacher_service` is used.

---

## 3. O Level Mathematics – summary table

| # | Feature | Action key | Cost (units) | Cost (credits) | When deducted | AI used |
|---|--------|------------|--------------|----------------|----------------|---------|
| 1 | Topical quiz question | `math_topical` | 5 | 0.5 | After question delivered | Vertex / DeepSeek (MathQuestionGenerator) |
| 2 | Exam-style quiz question | `math_exam` | 5 | 0.5 | After question delivered | Vertex / DeepSeek |
| 3 | Math quiz stream (thinking + 1 question) | `math_quiz` | 5 | 0.5 | On first `question` event | DeepSeek Reasoner |
| 4 | Legacy math exam next question | `math_exam` | 5 | 0.5 | After question delivered | MathQuestionGenerator (every 3rd + DB fallback) |
| 5 | CBT exam next question (O Level Math) | (exam_question) | 5 | 0.5 | Per question in `/exam/next` | ExamSessionService + DeepSeek |
| 6 | Math graph (any graph endpoint) | `math_graph_practice` | 10 | 1 | After graph URL returned | GraphService (plotting; AI only if used in parsing) |
| 7 | Image solve (math problem from photo) | `image_solve` | 20 | 2 | After solution returned | ImageService + vision/LLM |
| 8 | Teacher Mode – start | `teacher_mode_start` | 1 | 0.1 | When session created | — |
| 9 | Teacher Mode – follow-up | `teacher_mode_followup` | 1 | 0.1 | Per AI reply | mathematics_teacher_service |
| 10 | Teacher Mode – PDF notes | `teacher_mode_pdf` | 20 | 2 | When PDF delivered | mathematics_teacher_service + PDF |

---

## 4. All other AI features and credit deduction

Below, “cost” is in **units** (÷10 for credits). “When” is when credits are actually deducted. All of these use AI unless marked otherwise.

### 4.1 Combined Science (O Level)

| Feature | Action key | Cost (units) | Credits | When deducted | AI |
|---------|------------|---------------|---------|----------------|-----|
| Topical MCQ | `combined_science_topical_mcq` or default topical | 3 | 0.25 | Per question delivered | Vertex/DeepSeek (CombinedScienceGenerator or equivalent) |
| Topical structured | `combined_science_topical_structured` | 5 | 0.5 | Per question delivered | Same |
| Exam question | `combined_science_exam` | 5 | 0.5 | Per question delivered | Same |
| Image question (every 6th when mix_images) | `get_image_question_credit_cost()` | 20 | 2 | Per image question delivered | Vertex `generate_image_question` |

Quiz path uses `_get_quiz_credit_action("combined_science", …)` and, when it’s an image turn, `get_image_question_credit_cost()`.

### 4.2 English (O Level)

| Feature | Action key | Cost (units) | Credits | When deducted | AI |
|---------|------------|---------------|---------|----------------|-----|
| Topical question | `english_topical` | 5 | 0.5 | Per question | English generator |
| Comprehension (generate/do) | `english_comprehension` | 20 | 2 | Per comprehension | Comprehension AI |
| Comprehension grading | `english_comprehension_grading` | 10 | 1 | Per grading | Grading AI |
| Summary grading | `english_summary_grading` | 10 | 1 | Per grading | Grading AI |
| Essay marking | `english_essay_marking` | 20 | 2 | Per marking | Essay-marking AI |

### 4.3 A-Level (Pure Math, Chemistry, Physics, Biology)

| Subject / type | Action key examples | Cost (units) | Credits | When deducted | AI |
|----------------|---------------------|--------------|---------|----------------|-----|
| Pure Math topical MCQ/structured/exam | `a_level_pure_math_topical_mcq`, `_structured`, `a_level_pure_math_exam` | 5 | 0.5 | Per question | MathQuestionGenerator (Vertex/DeepSeek) |
| Chemistry topical/exam | `a_level_chemistry_topical_mcq`, `_structured`, `a_level_chemistry_exam` | 5 | 0.5 | Per question | Subject generator |
| Physics topical/exam | `a_level_physics_topical_*`, `a_level_physics_exam` | 5 | 0.5 | Per question | Subject generator |
| Biology MCQ | `a_level_biology_topical_mcq`, `a_level_biology_exam_mcq` | 3 | 0.25 | Per question | Biology generator |
| Biology structured/essay | `a_level_biology_topical_structured`, `_essay`, exam_structured, exam_essay | 5 | 0.5 | Per question | Same |

CBT exam session for A-Level uses `_get_exam_session_cost_units` / `_get_exam_question_cost_units` with the same per-question logic as O Level; deduction in `/exam/next`.

### 4.4 Teacher Mode (non-math)

| Sub-feature | Action key | Cost (units) | Credits | When deducted | AI |
|-------------|------------|---------------|---------|----------------|-----|
| Start | `teacher_mode_start` | 1 | 0.1 | Session created | — |
| Follow-up | `teacher_mode_followup` | 1 | 0.1 | Per reply | Combined/science/english teacher service |
| PDF notes | `teacher_mode_pdf` | 20 | 2 | When PDF sent | Same + PDF |

### 4.5 Project Assistant

| Feature | Action key | Cost (units) | Credits | When deducted | AI |
|---------|------------|---------------|---------|----------------|-----|
| Start / follow-up | `project_assistant_start`, `project_assistant_followup` | 1 | 0.1 | Per message/response | Project assistant model |
| Web search | `project_web_search` | 20 | 2 | Per search | Search + LLM |
| Deep research | `project_deep_research` | 20 | 2 | Per run | Research pipeline |
| Transcribe | `project_transcribe` | 1 | 0.1 | Per transcription | ASR |
| Image generation | `project_image_generation` | 30 | 3 | Per image | Image model |

### 4.6 Virtual lab

| Feature | Action key | Cost (units) | Credits | When deducted | AI |
|---------|------------|---------------|---------|----------------|-----|
| Knowledge-check questions | `virtual_lab_knowledge_check` | 3 | 0.25 | Per question delivered (after success) | DeepSeek |

### 4.7 Study tools

| Feature | Action key | Cost (units) | Credits | When deducted | AI |
|---------|------------|---------------|---------|----------------|-----|
| Single flashcard | `flashcard_single` | 3 | 0.25 | Per flashcard (e.g. per batch or per card depending on flow) | Flashcard generator |

### 4.8 Audio / voice

| Feature | Action key | Cost (units) | Credits | When deducted | AI |
|---------|------------|---------------|---------|----------------|-----|
| Audio feature | `audio_feature` | 10 | 1 | Per audio response | TTS/STT + model |
| Voice chat | `voice_chat` | 10 or 20 (config/fallback) | 1 or 2 | Per 5s or per use | Voice pipeline |

(Exact mapping and per-5s logic can differ; fallback in `credit_costs_db` is 20 for both.)

---

## 5. Where cost and deduction are implemented

- **Cost resolution:** `services/advanced_credit_service.py` → `get_credit_cost(action)`; for mobile it uses `database/credit_costs_db.py` (DB + `fallback_costs`).
- **Quiz cost mapping:** `api/mobile.py` → `_get_quiz_credit_action(subject, question_type, question_format, bio_question_type)` maps to action keys. Image-question cost from `services/vertex_service.py`: `get_image_question_credit_cost()` = 20 units, `get_text_question_credit_cost()` = 5 units.
- **Deduction:** `_deduct_credits_or_fail(user_id, cost_units, transaction_type, description)` in `api/mobile.py`; called only after the corresponding success (e.g. question in hand, graph URL in hand, PDF sent).
- **Units/credits:** `utils/credit_units.py`: 1 credit = 10 units; `format_credits(units)` for display.

---

## 6. Vertex image vs text question costs (quiz only)

Used only for **quiz** flows that support image questions (Combined Science, A-Level Biology/Chemistry/Physics). **Not** used for O Level Mathematics quiz.

| Type | Constant | Units | Credits |
|------|----------|-------|---------|
| Image question | `IMAGE_QUESTION_CREDIT_COST` in `vertex_service.py` | 20 | 2 |
| Text question | `TEXT_QUESTION_CREDIT_COST` | 5 | 0.5 |

O Level Mathematics quiz always uses the standard action cost (`math_topical` / `math_exam`) and never switches to image cost in that flow.

---

*Document generated from the NerdX codebase (api/mobile.py, services/advanced_credit_service.py, database/credit_costs_db.py, vertex_service.py, and related services).*
