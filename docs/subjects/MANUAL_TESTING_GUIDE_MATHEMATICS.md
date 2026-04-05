# Mathematics AI Features - Manual Testing Guide

## Quick Start

This guide helps you manually test all AI-powered mathematics features in the mobile application.

## Prerequisites

1. ✅ Mobile app installed and running
2. ✅ User account with sufficient credits (recommended: 20+ credits)
3. ✅ Backend server running and accessible
4. ✅ DeepSeek API key configured on backend

---

## Test 1: Quiz Question Generation (AI-Powered)

### Steps:
1. Open the mobile app
2. Log in with test account
3. Navigate: **Dashboard** → **Start Quiz** → **Mathematics** → Select a topic (e.g., "Algebra")
4. Tap **"Start Quiz"** or select difficulty level

### What to Check:
- [ ] Question appears within 30 seconds
- [ ] Question text is clear and relevant to the topic
- [ ] Question is appropriate for ZIMSEC O-Level
- [ ] Text input field is available (for math answers)
- [ ] Image upload button is available (for math answers)
- [ ] Hint button is visible (if hint is available)
- [ ] Credits are deducted (check credit balance before/after)
- [ ] Loading indicator shows during generation

### Expected Result:
- AI-generated question with:
  - Clear question text
  - Correct answer field
  - Solution/explanation
  - Hint (optional)
  - Text input enabled
  - Image upload enabled

---

## Test 2: Answer Evaluation (AI-Powered)

### Steps:
1. After generating a question (from Test 1)
2. Enter your answer in the text input field
   - Try a **correct answer** first
   - Then try an **incorrect answer**
3. Tap **"Submit Answer"**

### What to Check (Correct Answer):
- [ ] Response appears within 10 seconds
- [ ] Shows "✅ Correct!" or similar positive feedback
- [ ] Displays detailed solution
- [ ] Shows points earned (typically 10 points)
- [ ] Shows "What went right" explanation (if available)
- [ ] Encouragement message appears

### What to Check (Incorrect Answer):
- [ ] Response appears within 10 seconds
- [ ] Shows "❌ Incorrect" or similar feedback
- [ ] Displays detailed solution explaining correct approach
- [ ] Shows "What went wrong" explanation
- [ ] Shows "Improvement tips"
- [ ] Hint is available (if applicable)

### Expected Result:
- AI evaluates answer intelligently
- Provides constructive feedback
- Explains solution clearly
- Recognizes equivalent answer formats (e.g., "4", "x=4", "4.0")

---

## Test 3: Graph Practice (AI-Powered)

### Steps:
1. Navigate: **Dashboard** → **Mathematics** → **Graph Practice**
2. Select a graph type:
   - Linear
   - Quadratic
   - Exponential
   - Trigonometric
3. Tap **"Generate Graph"**

### What to Check:
- [ ] Graph image appears within 20 seconds
- [ ] Graph image is clear and readable
- [ ] Equation is displayed correctly
- [ ] AI-generated question about the graph appears
- [ ] Question is relevant to the graph type
- [ ] Credits are deducted (3 credits)
- [ ] Loading indicator shows during generation

### Test Different Graph Types:
- [ ] **Linear**: y = mx + b format
- [ ] **Quadratic**: y = ax² + bx + c format
- [ ] **Exponential**: y = a^x format
- [ ] **Trigonometric**: y = sin(x), cos(x), etc.

### Expected Result:
- Graph image displays correctly
- Equation matches graph
- AI-generated question is relevant
- Solution is provided

---

## Test 4: Custom Graph Generation

### Steps:
1. Navigate to **Graph Practice**
2. Select **"Custom Graph"** mode
3. Enter a custom equation (e.g., "y = x^2 + 2x - 3")
4. Tap **"Generate"**

### What to Check:
- [ ] Graph generated with custom equation
- [ ] Graph matches the equation
- [ ] AI-generated question is relevant
- [ ] Credits deducted correctly

---

## Test 5: Image Answer Upload (Math Questions)

### Steps:
1. Generate a mathematics question
2. Tap **"Upload Answer Image"**
3. Select an image from gallery (or take photo)
4. Submit the answer

### What to Check:
- [ ] Image uploads successfully
- [ ] Image is processed
- [ ] Answer is evaluated (may require OCR)
- [ ] Feedback is provided

**Note:** This feature may require additional OCR setup.

---

## Test 6: Hint System (AI-Powered)

### Steps:
1. Generate a mathematics question
2. Tap **"Show Hint"** button
3. Review the hint

### What to Check:
- [ ] Hint appears immediately
- [ ] Hint is helpful but doesn't give away the answer
- [ ] Hint is appropriate for the difficulty level
- [ ] Multiple hint levels available (if implemented)

---

## Test 7: Different Topics

### Test Multiple Topics:
1. **Algebra**: Generate questions on algebra
2. **Geometry**: Generate questions on geometry
3. **Trigonometry**: Generate questions on trigonometry
4. **Calculus**: Generate questions on calculus
5. **Statistics**: Generate questions on statistics

### What to Check:
- [ ] Each topic generates appropriate questions
- [ ] Questions match the selected topic
- [ ] Solutions are topic-relevant

---

## Test 8: Different Difficulty Levels

### Test All Difficulties:
1. Generate question with **Easy** difficulty
2. Generate question with **Medium** difficulty
3. Generate question with **Hard** difficulty

### What to Check:
- [ ] Easy questions are simpler
- [ ] Medium questions are moderate
- [ ] Hard questions are challenging
- [ ] Solutions match difficulty level

---

## Test 9: Error Handling

### Test Scenarios:

#### 9.1 Insufficient Credits
- [ ] Try to generate question with 0 credits
- [ ] **Expected:** Clear error message about insufficient credits
- [ ] **Expected:** Option to buy credits

#### 9.2 Network Issues
- [ ] Disable internet connection
- [ ] Try to generate question
- [ ] **Expected:** Appropriate error message
- [ ] **Expected:** Graceful fallback (if implemented)

#### 9.3 API Timeout
- [ ] If API is slow, question should still generate
- [ ] **Expected:** Fallback to local questions (if implemented)
- [ ] **Expected:** User-friendly error message

---

## Test 10: Credit System

### Verify Credit Deduction:
1. Note your credit balance
2. Generate a topical question (1 credit)
3. Check balance decreased by 1
4. Generate a graph (3 credits)
5. Check balance decreased by 3

### What to Check:
- [ ] Credits deducted correctly for each action
- [ ] Credit balance updates in real-time
- [ ] No credits deducted if generation fails

---

## Test 11: User Experience

### Overall Flow:
1. Complete a full quiz session:
   - Generate question → Answer → View feedback → Next question
2. Complete a graph practice session:
   - Generate graph → View question → Submit answer → View solution

### What to Check:
- [ ] Smooth transitions between screens
- [ ] Loading states are clear
- [ ] Error messages are user-friendly
- [ ] UI is responsive
- [ ] No crashes or freezes

---

## Test 12: Performance

### Response Times:
- [ ] Question generation: < 30 seconds
- [ ] Answer evaluation: < 10 seconds
- [ ] Graph generation: < 20 seconds

### What to Check:
- [ ] App remains responsive during AI processing
- [ ] Loading indicators are visible
- [ ] No UI freezing

---

## Common Issues to Watch For

### ⚠️ Potential Issues:
1. **Slow AI responses**: May indicate API issues
2. **Incorrect answer evaluation**: May indicate MathSolver issues
3. **Graph not displaying**: May indicate image URL issues
4. **Credits not deducted**: May indicate backend issue
5. **Questions not relevant**: May indicate prompt issues

---

## Test Results Template

```
Date: ___________
Tester: ___________
App Version: ___________
Backend URL: ___________

### Test Results:

1. Quiz Question Generation: [ ] PASS [ ] FAIL [ ] SKIP
   Notes: _________________________________

2. Answer Evaluation: [ ] PASS [ ] FAIL [ ] SKIP
   Notes: _________________________________

3. Graph Practice: [ ] PASS [ ] FAIL [ ] SKIP
   Notes: _________________________________

4. Custom Graph: [ ] PASS [ ] FAIL [ ] SKIP
   Notes: _________________________________

5. Image Upload: [ ] PASS [ ] FAIL [ ] SKIP
   Notes: _________________________________

6. Hint System: [ ] PASS [ ] FAIL [ ] SKIP
   Notes: _________________________________

7. Different Topics: [ ] PASS [ ] FAIL [ ] SKIP
   Notes: _________________________________

8. Different Difficulties: [ ] PASS [ ] FAIL [ ] SKIP
   Notes: _________________________________

9. Error Handling: [ ] PASS [ ] FAIL [ ] SKIP
   Notes: _________________________________

10. Credit System: [ ] PASS [ ] FAIL [ ] SKIP
    Notes: _________________________________

11. User Experience: [ ] PASS [ ] FAIL [ ] SKIP
    Notes: _________________________________

12. Performance: [ ] PASS [ ] FAIL [ ] SKIP
    Notes: _________________________________

### Overall Status: [ ] PASS [ ] FAIL [ ] PARTIAL

### Issues Found:
1. _________________________________
2. _________________________________
3. _________________________________

### Recommendations:
1. _________________________________
2. _________________________________
3. _________________________________
```

---

## Quick Test Checklist

Use this for quick smoke testing:

- [ ] Can generate mathematics question
- [ ] Can submit answer and get feedback
- [ ] Can generate graph
- [ ] Credits deducted correctly
- [ ] No crashes or errors
- [ ] UI is responsive

---

## Need Help?

If you encounter issues:
1. Check backend logs for errors
2. Verify DeepSeek API key is configured
3. Check network connectivity
4. Verify user has sufficient credits
5. Review error messages in app

---

## Next Steps

After completing mathematics tests, proceed to test:
- Combined Science AI features (Teacher Mode)
- English AI features (Comprehension, Essay Writing)
- Project Assistant AI features

