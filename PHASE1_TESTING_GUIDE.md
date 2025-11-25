# Phase 1: Deep Knowledge Tracing - End-to-End Testing Guide

## 🧪 Complete Testing Checklist

This guide covers all tests needed to verify Phase 1 is production-ready.

---

## Test 1: Database Verification ✅

**Verify all tables exist**:

```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'student_interactions',
  'student_knowledge_state',
  'skills_taxonomy',
  'misconceptions',
  'student_misconceptions_log',
  'dkt_model_metrics',
  'daily_review_queue',
  'offline_sync_queue'
)
ORDER BY table_name;
```

**Expected**: 8 rows returned

**Verify skills loaded**:
```sql
SELECT COUNT(*) as total_skills FROM skills_taxonomy;
-- Expected: 13

SELECT skill_id, skill_name, subject FROM skills_taxonomy ORDER BY subject, topic;
```

**Expected**: Skills like `math_algebra_basic`, `biology_cells_structure`, etc.

---

## Test 2: API Endpoints Testing 🌐

**File**: `test_dkt_api.py`

### Setup:
1. Get JWT token:
   ```bash
   # Login via API or mobile app
   # Copy token from response/storage
   ```

2. Update test file:
   ```python
   TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  # Your actual token
   ```

3. Run tests:
   ```bash
   python test_dkt_api.py
   ```

### Expected Output:
```
🧪 DEEP KNOWLEDGE TRACING API TESTS
============================================================

TEST 1: Log Interaction
Status: 201
Response: {
  "success": true,
  "data": {
    "interaction_id": 1,
    "skill_mastery": 0.75
  }
}
✅ PASS - Log Interaction

TEST 2: Get Knowledge Map
Status: 200
Total Skills: 13
Mastered: 0
Learning: 0
Struggling: 0
✅ PASS - Knowledge Map

TEST 3: Get Skill Mastery
Status: 200
Skill: math_algebra_quadratic
Mastery: 0.75 (proficient)
Total Interactions: 1
✅ PASS - Skill Mastery

TEST 4: Get Recommendation
Status: 200
✨ Recommendation:
  Skill: Basic Algebra
  Current Mastery: 0.30
  Suggested Difficulty: medium
✅ PASS - Recommendation

TEST 5: Get Interaction History
Status: 200
Total Interactions: 1
Recent Interactions:
1. ✓ math_algebra_quadratic | 2025-11-24T...
✅ PASS - Interaction History

📊 TEST SUMMARY
============================================================
✅ PASS - Log Interaction
✅ PASS - Knowledge Map
✅ PASS - Skill Mastery
✅ PASS - Recommendation
✅ PASS - Interaction History

Total: 5/5 tests passed

🎉 All tests passed! DKT integration is working!
```

---

## Test 3: Mobile App - QuizScreen Integration 📱

### Steps:
1. **Start the app**:
   ```bash
   cd NerdXApp
   npx expo start
   ```

2. **Navigate to a quiz**:
   - Dashboard → Mathematics → Any Topic → Start Practice

3. **Answer a question**:
   - Select an answer
   - Submit

4. **Check console logs**:
   ```
   ✅ DKT: Logged interaction for math_algebra_quadratic, mastery updated
   ```

5. **Verify in database**:
   ```sql
   SELECT * FROM student_interactions 
   ORDER BY timestamp DESC 
   LIMIT 5;
   ```
   
### Expected:
- New row with:
  - `user_id`
  - `subject`: 'mathematics'
  - `skill_id`: 'math_algebra_quadratic'
  - `response`: true/false
  - `time_spent_seconds`: ~30-60
  - `timestamp`: Just now

---

## Test 4: Knowledge Map Widget 📊

### Steps:
1. **Answer 5-10 quiz questions** across different subjects/topics

2. **Return to Dashboard**

3. **Verify Knowledge Map Widget displays**:
   - Summary stats (Mastered, Learning, Practice)
   - Top 5 skills with progress bars
   - Color-coded status badges

### Expected UI:
```
📊 Your Knowledge Map
Tracking 13 skills across all subjects

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Mastered    │  │ Learning    │  │ Practice    │
│     2       │  │     5       │  │     6       │
│    🌟       │  │    📈       │  │    🎯       │
└─────────────┘  └─────────────┘  └─────────────┘

Skills to Focus On

[Skill Card 1] [Skill Card 2] [Skill Card 3] ...
━━━━━━━━━━━  ━━━━━━━━━━━  ━━━━━━━━━━━
45% Learning 72% Proficient 28% Needs Practice
```

---

## Test 5: DKT Predictions Accuracy 🎯

**Measure prediction accuracy**:

```sql
-- After 20+ interactions
WITH predictions AS (
  SELECT 
    si.skill_id,
    si.response as actual_correct,
    sks.mastery_probability as predicted_mastery
  FROM student_interactions si
  LEFT JOIN student_knowledge_state sks 
    ON si.skill_id = sks.skill_id 
    AND si.user_id = sks.user_id
  WHERE si.user_id = 'YOUR_USER_ID'
  ORDER BY si.timestamp DESC
  LIMIT 20
)
SELECT 
  skill_id,
  COUNT(*) as total,
  AVG(CASE WHEN actual_correct THEN 1.0 ELSE 0.0 END) as actual_accuracy,
  AVG(predicted_mastery) as predicted_mastery,
  ABS(AVG(CASE WHEN actual_correct THEN 1.0 ELSE 0.0 END) - AVG(predicted_mastery)) as prediction_error
FROM predictions
GROUP BY skill_id;
```

### Expected:
- `prediction_error` < 0.25 for heuristic MVP
- Better accuracy after ML model (Phase 1 Week 2)

---

## Test 6: Recommendations Quality ✨

**Test personalization**:

```python
# After answering questions
rec = await dktService.getRecommendation('mathematics')

print(rec)
# Expected intelligent recommendation:
# - Suggests skill in 40-70% mastery range (learning zone)  
# - Appropriate difficulty based on current level
# - Helpful reason explaining the suggestion
```

### Example Good Recommendation:
```json
{
  "recommended": true,
  "skill_id": "math_geometry_angles",
  "skill_name": "Angle Calculations",
  "current_mastery": 0.55,
  "suggested_difficulty": "medium",
  "reason": "You're in the learning zone for Angle Calculations. Perfect time to practice and reach mastery!"
}
```

---

## Test 7: Offline Sync Readiness 🔄

**Verify offline tables ready**:

```sql
-- Check offline sync queue table exists and is empty
SELECT COUNT(*) FROM offline_sync_queue;
-- Expected: 0 (nothing pending yet)

-- Check daily review queue
SELECT COUNT(*) FROM daily_review_queue;
-- Expected: 0 (will be populated in Phase 2)
```

---

## Test 8: Performance Testing ⚡

### API Response Times:
```bash
# Test API latency
time curl -X POST https://nerdx.onrender.com/api/mobile/dkt/log-interaction \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subject":"mathematics","topic":"Algebra","skill_id":"math_algebra_basic","question_id":"q1","correct":true}'
```

**Expected**: < 500ms for interaction logging

### Mobile App Performance:
- Quiz answer submission: < 1s total (including DKT logging)
- Knowledge map load: < 2s
- No UI blocking or lag

---

## Test 9: Error Handling 🛡️

**Test graceful failures**:

1. **Network offline**:
   - Quiz should still work
   - DKT logging fails silently
   - No user-facing errors

2. **Invalid data**:
   ```python
   # Test with bad skill_id
   await dktService.logInteraction({
     skill_id: 'invalid_skill',
     ...
   })
   # Should handle gracefully
   ```

3. **Missing token**:
   - API returns 401
   - Mobile shows appropriate message

---

## Test 10: Data Integrity 🔒

**Verify data quality**:

```sql
-- Check for data integrity
SELECT 
  COUNT(*) as total_interactions,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT skill_id) as skills_practiced,
  AVG(time_spent_seconds) as avg_time_per_question,
  SUM(CASE WHEN response THEN 1 ELSE 0 END)::float / COUNT(*) as overall_accuracy
FROM student_interactions;
```

### Expected Ranges:
- `avg_time_per_question`: 20-120 seconds
- `overall_accuracy`: 0.40-0.80 (varies by skill level)
- No NULL values in required fields

---

## 🎯 Success Criteria

Phase 1 is ready for deployment when:

- [ ] All 8 database tables created ✓
- [ ] All 5 API tests pass ✓
- [ ] QuizScreen logs interactions ✓
- [ ] Knowledge Map displays on Dashboard ✓
- [ ] Predictions accuracy > 70% (heuristic MVP)
- [ ] API response time < 500ms
- [ ] No critical errors in logs
- [ ] Mobile app performance acceptable
- [ ] Data integrity verified

---

## 🚀 Deployment Readiness

Once all tests pass:

### Backend:
```bash
git add .
git commit -m "feat: Complete Phase 1 DKT - All tests passing"
git push origin main
```

**Render auto-deploys** - Monitor at dashboard.render.com

### Mobile:
```bash
# Development
npx expo start

# Production (when ready)
eas build --platform android
eas build --platform ios
```

---

## 📊 Metrics to Track Post-Deployment

**Week 1 Metrics**:
- Total interactions logged
- Unique users using DKT
- Average questions per session
- Knowledge map engagement

**Week 2 Metrics** (ML model):
- Prediction accuracy vs heuristic
- User retention improvement
- Time to mastery reduction

---

## 🐛 Known Limitations (MVP)

1. **Heuristic Predictions**: Simple weighted average (ML model in Week 2)
2. **Limited Skills**: 13 pre-defined skills (expand to 100+ later)
3. **No Forgetting Curve**: Doesn't account for time decay yet (Phase 3)
4. **No Misconception Detection**: Confidence tracked but not analyzed (Phase 4)

---

## ✅ Sign-Off Checklist

Ready to move to Phase 2 when:

- [x] Database migrated ✓
- [x] Backend APIs working ✓
- [x] Mobile integration complete ✓
- [ ] All automated tests passing
- [ ] Manual testing complete
- [ ] Performance acceptable
- [ ] Beta user feedback positive

---

**Next Phase**: Offline-First Architecture (Weeks 3-4) 🔥
