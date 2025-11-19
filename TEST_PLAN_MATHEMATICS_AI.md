# Mathematics AI Features - Test Plan

## Overview
This document outlines the comprehensive testing plan for all AI-powered features in the Mathematics section of the NerdX mobile application.

## AI Features to Test

### 1. Quiz Question Generation (AI-Powered)
**Endpoint:** `POST /api/mobile/quiz/generate`
**Service:** `MathQuestionGenerator` (uses DeepSeek AI)

#### Test Cases:

##### 1.1 Topical Question Generation
- [ ] **Test:** Generate a topical mathematics question
  - Subject: `mathematics`
  - Type: `topical`
  - Topic: `algebra` (or any valid topic)
  - Difficulty: `easy`, `medium`, `hard`
  - **Expected:** Returns a valid question with:
    - `question_text` (non-empty)
    - `correct_answer` (non-empty)
    - `solution` (non-empty)
    - `hint` (optional but preferred)
    - `allows_text_input: true`
    - `allows_image_upload: true`
  - **Verify:** Credits are deducted correctly
  - **Verify:** Question is appropriate for ZIMSEC O-Level

##### 1.2 Exam Question Generation
- [ ] **Test:** Generate an exam mathematics question
  - Subject: `mathematics`
  - Type: `exam`
  - Difficulty: `medium`
  - **Expected:** Returns a valid question (topic randomly selected)
  - **Verify:** Credits are deducted correctly

##### 1.3 Different Topics
- [ ] Test with topic: `algebra`
- [ ] Test with topic: `geometry`
- [ ] Test with topic: `trigonometry`
- [ ] Test with topic: `calculus`
- [ ] Test with topic: `statistics`
- **Expected:** Each topic generates appropriate questions

##### 1.4 Different Difficulties
- [ ] Test with difficulty: `easy`
- [ ] Test with difficulty: `medium`
- [ ] Test with difficulty: `hard`
- **Expected:** Questions match difficulty level

##### 1.5 Error Handling
- [ ] **Test:** Generate question with insufficient credits
  - **Expected:** Returns error: "Insufficient credits"
- [ ] **Test:** Generate question with invalid topic
  - **Expected:** Falls back gracefully or uses default topic
- [ ] **Test:** Generate question when AI API is unavailable
  - **Expected:** Uses fallback question generator

---

### 2. Answer Evaluation (AI-Powered)
**Endpoint:** `POST /api/mobile/quiz/submit-answer`
**Service:** `MathSolver` (uses DeepSeek AI)

#### Test Cases:

##### 2.1 Correct Answer Evaluation
- [ ] **Test:** Submit a correct answer
  - Question: "Solve for x: 2x + 5 = 13"
  - User Answer: "4" or "x = 4"
  - Correct Answer: "4"
  - **Expected:**
    - `correct: true`
    - `feedback`: Positive feedback message
    - `points_earned: 10`
    - `solution`: Detailed solution provided
    - `what_went_right`: Explanation of correct approach

##### 2.2 Incorrect Answer Evaluation
- [ ] **Test:** Submit an incorrect answer
  - Question: "Solve for x: 2x + 5 = 13"
  - User Answer: "5"
  - Correct Answer: "4"
  - **Expected:**
    - `correct: false`
    - `feedback`: Constructive feedback
    - `points_earned: 0`
    - `solution`: Detailed solution provided
    - `what_went_wrong`: Explanation of mistake
    - `improvement_tips`: Suggestions for improvement

##### 2.3 Equivalent Answer Formats
- [ ] **Test:** Submit answer in different formats
  - Answer: "4"
  - Answer: "x = 4"
  - Answer: "4.0"
  - Answer: "4/1"
  - **Expected:** All recognized as correct if mathematically equivalent

##### 2.4 Partial Credit (if applicable)
- [ ] **Test:** Submit partially correct answer
  - **Expected:** Appropriate feedback indicating partial correctness

##### 2.5 Image Answer Evaluation
- [ ] **Test:** Submit answer as image
  - Upload image of handwritten solution
  - **Expected:** Image is processed and evaluated
  - **Note:** May require OCR functionality

##### 2.6 Complex Problem Evaluation
- [ ] **Test:** Submit answer for complex problem
  - Multi-step problem
  - **Expected:** Detailed analysis of solution steps

---

### 3. Graph Practice (AI-Powered)
**Endpoint:** `POST /api/mobile/math/graph/generate`
**Service:** `GraphService` + `MathQuestionGenerator` (uses DeepSeek AI)

#### Test Cases:

##### 3.1 Linear Graph Generation
- [ ] **Test:** Generate linear graph
  - Graph Type: `linear`
  - **Expected:**
    - `graph_url`: Valid image URL
    - `equation`: Valid linear equation (e.g., "y = 2x + 3")
    - `question`: AI-generated question about the graph
    - `solution`: AI-generated solution
  - **Verify:** Credits deducted (3 credits)
  - **Verify:** Graph image displays correctly

##### 3.2 Quadratic Graph Generation
- [ ] **Test:** Generate quadratic graph
  - Graph Type: `quadratic`
  - **Expected:** Valid quadratic equation and question

##### 3.3 Exponential Graph Generation
- [ ] **Test:** Generate exponential graph
  - Graph Type: `exponential`
  - **Expected:** Valid exponential equation and question

##### 3.4 Trigonometric Graph Generation
- [ ] **Test:** Generate trigonometric graph
  - Graph Type: `trigonometric`
  - **Expected:** Valid trigonometric equation and question

##### 3.5 Custom Graph Generation
- [ ] **Test:** Generate custom graph
  - Endpoint: `POST /api/mobile/math/graph/custom`
  - Equation: "y = x^2 + 2x - 3"
  - **Expected:** Graph generated with custom equation

##### 3.6 Graph Question Quality
- [ ] **Test:** Verify AI-generated questions are relevant
  - **Expected:** Questions relate to graph features (intercepts, slope, etc.)

##### 3.7 Error Handling
- [ ] **Test:** Generate graph with insufficient credits
  - **Expected:** Error message
- [ ] **Test:** Generate graph with invalid equation
  - **Expected:** Graceful error handling

---

## Integration Testing

### 4. End-to-End Quiz Flow
- [ ] **Test:** Complete quiz session
  1. Navigate to Mathematics → Topics → Select topic
  2. Generate question (AI-powered)
  3. Submit answer (AI evaluation)
  4. View feedback and solution
  5. Generate next question
  - **Verify:** All steps work seamlessly
  - **Verify:** Credits deducted correctly
  - **Verify:** User stats updated

### 5. End-to-End Graph Practice Flow
- [ ] **Test:** Complete graph practice session
  1. Navigate to Mathematics → Graph Practice
  2. Select graph type
  3. Generate graph (AI-powered)
  4. View graph and question
  5. Submit answer
  6. View solution
  - **Verify:** All steps work seamlessly
  - **Verify:** Credits deducted correctly

---

## Performance Testing

### 6. Response Time
- [ ] **Test:** Question generation response time
  - **Expected:** < 30 seconds (with retries)
- [ ] **Test:** Answer evaluation response time
  - **Expected:** < 10 seconds
- [ ] **Test:** Graph generation response time
  - **Expected:** < 20 seconds

### 7. Concurrent Requests
- [ ] **Test:** Multiple simultaneous question generations
  - **Expected:** All requests handled correctly

---

## Error Scenarios

### 8. API Failures
- [ ] **Test:** DeepSeek API timeout
  - **Expected:** Fallback to local questions
- [ ] **Test:** DeepSeek API error
  - **Expected:** Graceful error handling
- [ ] **Test:** Network connectivity issues
  - **Expected:** Appropriate error message

### 9. Invalid Inputs
- [ ] **Test:** Empty question text
- [ ] **Test:** Invalid answer format
- [ ] **Test:** Missing required fields
  - **Expected:** Appropriate validation errors

---

## Credit System Testing

### 10. Credit Deduction
- [ ] **Test:** Verify credits deducted for topical questions (1 credit)
- [ ] **Test:** Verify credits deducted for exam questions (1 credit)
- [ ] **Test:** Verify credits deducted for graph practice (3 credits)
- [ ] **Test:** Verify no credits deducted if generation fails

---

## Mobile App UI Testing

### 11. User Interface
- [ ] **Test:** Question displays correctly in QuizScreen
- [ ] **Test:** Text input works for math answers
- [ ] **Test:** Image upload works for math answers
- [ ] **Test:** Hint button displays AI-generated hints
- [ ] **Test:** Solution displays correctly after submission
- [ ] **Test:** Graph displays correctly in GraphPracticeScreen
- [ ] **Test:** Loading states display during AI processing

---

## Test Execution Checklist

### Pre-Testing Setup
- [ ] Ensure backend server is running
- [ ] Ensure DeepSeek API key is configured
- [ ] Ensure test user has sufficient credits
- [ ] Ensure mobile app is connected to backend

### Testing Order
1. Start with Quiz Question Generation (Section 1)
2. Test Answer Evaluation (Section 2)
3. Test Graph Practice (Section 3)
4. Run Integration Tests (Section 4-5)
5. Test Error Scenarios (Section 8-9)
6. Verify Credit System (Section 10)
7. Test UI Components (Section 11)

### Test Results Recording
- Record pass/fail for each test case
- Note any errors or unexpected behavior
- Document response times
- Capture screenshots of UI issues

---

## Success Criteria

✅ All AI features generate appropriate content
✅ All API endpoints respond within acceptable time limits
✅ Error handling works gracefully
✅ Credits are deducted correctly
✅ User experience is smooth and intuitive
✅ Fallback mechanisms work when AI is unavailable

---

## Notes

- AI responses may vary slightly between requests (this is expected)
- Some tests may require manual verification of AI-generated content quality
- Network conditions may affect response times
- Ensure test environment matches production configuration

