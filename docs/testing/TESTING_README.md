# Mathematics AI Features - Testing Documentation

## Overview

This directory contains comprehensive testing documentation and tools for all AI-powered mathematics features in the NerdX mobile application.

## Files Created

### 1. `TEST_PLAN_MATHEMATICS_AI.md`
**Comprehensive test plan** covering all AI features with detailed test cases, expected results, and success criteria.

**Use this for:**
- Understanding all test scenarios
- Planning test execution
- Documenting test results
- Reference for QA team

### 2. `MANUAL_TESTING_GUIDE_MATHEMATICS.md`
**Step-by-step manual testing guide** with clear instructions for testing each feature in the mobile app.

**Use this for:**
- Manual testing on mobile device
- Quick reference during testing
- Training new testers
- Recording test results

### 3. `test_mathematics_ai.py`
**Automated test script** for testing API endpoints programmatically.

**Use this for:**
- Automated API testing
- Regression testing
- Performance testing
- CI/CD integration

## Quick Start

### Option 1: Manual Testing (Recommended for First Pass)

1. **Read the manual testing guide:**
   ```bash
   # Open MANUAL_TESTING_GUIDE_MATHEMATICS.md
   ```

2. **Follow the step-by-step instructions:**
   - Test each feature systematically
   - Check off items as you complete them
   - Record any issues found

3. **Use the test results template** at the end of the guide to document findings

### Option 2: Automated Testing

1. **Update configuration in `test_mathematics_ai.py`:**
   ```python
   BASE_URL = "https://nerdx.onrender.com"  # Your backend URL
   TEST_USER_EMAIL = "test@example.com"      # Test user email
   TEST_USER_PASSWORD = "testpassword123"    # Test user password
   ```

2. **Run the test script:**
   ```bash
   python test_mathematics_ai.py
   ```

3. **Or with custom parameters:**
   ```bash
   python test_mathematics_ai.py <BASE_URL> <EMAIL> <PASSWORD>
   ```

4. **Review the output:**
   - ✅ PASS: Test passed
   - ❌ FAIL: Test failed
   - ⚠️ WARN: Test passed but with warnings
   - ⏭️ SKIP: Test skipped (e.g., insufficient credits)

## Features to Test

### 1. Quiz Question Generation (AI-Powered)
- **Endpoint:** `POST /api/mobile/quiz/generate`
- **Service:** `MathQuestionGenerator` (DeepSeek AI)
- **Tests:**
  - Topical question generation
  - Exam question generation
  - Different topics (algebra, geometry, etc.)
  - Different difficulty levels
  - Error handling

### 2. Answer Evaluation (AI-Powered)
- **Endpoint:** `POST /api/mobile/quiz/submit-answer`
- **Service:** `MathSolver` (DeepSeek AI)
- **Tests:**
  - Correct answer evaluation
  - Incorrect answer evaluation
  - Equivalent answer formats
  - Image answer evaluation
  - Complex problem evaluation

### 3. Graph Practice (AI-Powered)
- **Endpoint:** `POST /api/mobile/math/graph/generate`
- **Service:** `GraphService` + `MathQuestionGenerator` (DeepSeek AI)
- **Tests:**
  - Linear graph generation
  - Quadratic graph generation
  - Exponential graph generation
  - Trigonometric graph generation
  - Custom graph generation
  - Graph question quality

## Testing Checklist

### Pre-Testing Setup
- [ ] Backend server is running
- [ ] DeepSeek API key is configured
- [ ] Test user account created
- [ ] Test user has sufficient credits (20+ recommended)
- [ ] Mobile app is installed and connected to backend
- [ ] Network connectivity is stable

### Core Functionality Tests
- [ ] Quiz question generation works
- [ ] Answer evaluation works correctly
- [ ] Graph generation works
- [ ] Credits are deducted correctly
- [ ] Error handling works gracefully

### Quality Tests
- [ ] AI-generated questions are relevant
- [ ] AI-generated solutions are clear
- [ ] Answer evaluation is accurate
- [ ] Feedback is constructive
- [ ] Response times are acceptable

### User Experience Tests
- [ ] UI is responsive
- [ ] Loading states are clear
- [ ] Error messages are user-friendly
- [ ] Navigation is smooth
- [ ] No crashes or freezes

## Expected Response Times

- **Question Generation:** < 30 seconds
- **Answer Evaluation:** < 10 seconds
- **Graph Generation:** < 20 seconds

## Common Issues & Solutions

### Issue: Slow AI Responses
**Solution:** 
- Check DeepSeek API status
- Verify API key is valid
- Check network connectivity
- Review backend logs

### Issue: Incorrect Answer Evaluation
**Solution:**
- Verify MathSolver service is working
- Check question and answer format
- Review AI prompt quality
- Test with known correct/incorrect answers

### Issue: Graph Not Displaying
**Solution:**
- Check graph image URL
- Verify image generation service
- Check file permissions
- Review backend logs

### Issue: Credits Not Deducted
**Solution:**
- Check credit service logs
- Verify user has sufficient credits
- Check database transactions
- Review API response

## Test Results Documentation

### For Each Test Session:
1. **Date and Time**
2. **Tester Name**
3. **App Version**
4. **Backend URL**
5. **Test Results** (PASS/FAIL/SKIP)
6. **Issues Found**
7. **Screenshots** (if applicable)
8. **Recommendations**

### Use the Template:
The manual testing guide includes a test results template. Use it to document your findings.

## Next Steps After Mathematics Testing

Once mathematics AI features are tested and verified:

1. **Test Combined Science AI Features:**
   - Teacher Mode (Chatbot)
   - Science question generation

2. **Test English AI Features:**
   - Comprehension generation
   - Essay writing and marking

3. **Test Project Assistant:**
   - Project guidance chatbot
   - Research assistance

## Support

If you encounter issues during testing:

1. **Check Backend Logs:**
   - Review error messages
   - Check API responses
   - Verify service status

2. **Check Mobile App Logs:**
   - Review console output
   - Check network requests
   - Verify API calls

3. **Verify Configuration:**
   - DeepSeek API key
   - Backend URL
   - User credentials
   - Credit balance

## Contributing

When adding new test cases:
1. Update `TEST_PLAN_MATHEMATICS_AI.md`
2. Update `MANUAL_TESTING_GUIDE_MATHEMATICS.md`
3. Update `test_mathematics_ai.py` if applicable
4. Document any new test scenarios

## Notes

- AI responses may vary slightly between requests (this is expected)
- Some tests require manual verification of AI-generated content quality
- Network conditions may affect response times
- Ensure test environment matches production configuration

---

**Happy Testing! 🧪**

For questions or issues, refer to the detailed documentation in each file.

