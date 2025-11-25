# QuizScreen DKT Integration Guide

## Step 1: Add DKT Import

**Location**: Top of file after other imports (around line 18)

```typescript
import { quizApi, Question, AnswerResult } from '../services/api/quizApi';
import { dktService } from '../services/api/dktApi';  // ADD THIS LINE
import { useAuth } from '../context/AuthContext';
```

## Step 2: Add DKT State Variables

**Location**: After existing state variables (around line 45)

```typescript
const [questionCount, setQuestionCount] = useState(1);

// ADD THESE LINES - DKT (Deep Knowledge Tracing) state
const [selectedConfidence, setSelectedConfidence] = useState<'low' | 'medium' | 'high' | null>(null);
const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
const [hintsUsed, setHintsUsed] = useState<number>(0);
```

## Step 3: Add DKT Logging Function

**Location**: Before `handleImageUpload` function (around line 115)

```typescript
// Log interaction to DKT system
const logInteractionToDKT = async (isCorrect: boolean) => {
  if (!question || !subject) return;

  try {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000); // seconds
    const skill_id = dktService.mapTopicToSkillId(
      subject.id,
      topic?.name || topic?.id || 'general'
    );

    await dktService.logInteraction({
      subject: subject.id,
      topic: topic?.name || topic?.id || 'general',
      skill_id: skill_id,
      question_id: question.id,
      correct: isCorrect,
      confidence: selectedConfidence || undefined,
      time_spent: timeSpent,
      hints_used: hintsUsed,
      session_id: sessionId,
    });

    console.log(`✅ DKT: Logged interaction for ${skill_id}, mastery updated`);
  } catch (error) {
    console.error('Failed to log interaction to DKT:', error);
    // Don't show error to user - DKT is a background enhancement
  }
};
```

## Step 4: Call DKT Logging After Answer Submission

**Location**: In `handleSubmit` function, after `setResult(answerResult)` (around line 107)

```typescript
if (answerResult) {
  setResult(answerResult);
  if (answerResult.correct && user) {
    // Update user stats if needed
  }

  // ADD THIS LINE
  await logInteractionToDKT(answerResult.correct);
}
```

## Step 5: Reset DKT State When Loading Next Question

**Location**: In `handleNext` function, when setting newQuestion (around line 167)

```typescript
if (newQuestion) {
  setQuestion(newQuestion);
  setSelectedAnswer('');
  setTextAnswer('');
  setAnswerImage(null);
  setResult(null);
  setShowHint(false);
  // ADD THESE LINES - Reset DKT tracking for new question
  setSelectedConfidence(null);
  setQuestionStartTime(Date.now());
  setHintsUsed(0);
  if (user) {
    const newCredits = (user.credits || 0) - 1;
    updateUser({ credits: newCredits });
  }
}
```

## Step 6: Track Hints Used

**Location**: In the hint button's onPress handler (around line 347)

**FIND**:
```typescript
<TouchableOpacity
  style={styles.hintButton}
  onPress={() => setShowHint(!showHint)}
>
```

**REPLACE WITH**:
```typescript
<TouchableOpacity
  style={styles.hintButton}
  onPress={() => {
    setShowHint(!showHint);
    if (!showHint) setHintsUsed(prev => prev + 1); // Track hints
  }}
>
```

## Step 7: Add Confidence Selector UI

**Location**: Before the "Action Buttons" section, after result card (around line 480)

```typescript
{/* Confidence Selector (DKT Feature) */}
{!result && (selectedAnswer || textAnswer || answerImage) && (
  <Card variant="elevated" style={styles.confidenceCard}>
    <Text style={styles.confidenceTitle}>How confident are you?</Text>
    <Text style={styles.confidenceSubtitle}>This helps personalize your learning 🎯</Text>
    <View style={styles.confidenceButtons}>
      <TouchableOpacity
        style={[
          styles.confidenceButton,
          selectedConfidence === 'low' && styles.confidenceButtonSelected
        ]}
        onPress={() => setSelectedConfidence('low')}
      >
        <Text style={styles.confidenceEmoji}>🤔</Text>
        <Text style={[
          styles.confidenceButtonText,
          selectedConfidence === 'low' && styles.confidenceButtonTextSelected
        ]}>Not Sure</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.confidenceButton,
          selectedConfidence === 'medium' && styles.confidenceButtonSelected
        ]}
        onPress={() => setSelectedConfidence('medium')}
      >
        <Text style={styles.confidenceEmoji}>😐</Text>
        <Text style={[
          styles.confidenceButtonText,
          selectedConfidence === 'medium' && styles.confidenceButtonTextSelected
        ]}>Somewhat Sure</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.confidenceButton,
          selectedConfidence === 'high' && styles.confidenceButtonSelected
        ]}
        onPress={() => setSelectedConfidence('high')}
      >
        <Text style={styles.confidenceEmoji}>😊</Text>
        <Text style={[
          styles.confidenceButtonText,
          selectedConfidence === 'high' && styles.confidenceButtonTextSelected
        ]}>Very Sure</Text>
      </TouchableOpacity>
    </View>
  </Card>
)}
```

## Step 8: Add  Styles for Confidence Selector

**Location**: In the StyleSheet at the bottom (around line 860)

```typescript
// ADD THESE STYLES before the closing });
confidenceCard: {
  marginBottom: 20,
  backgroundColor: Colors.background.paper,
  borderWidth: 1,
  borderColor: Colors.primary.light,
  borderRadius: 16,
  padding: 16,
},
confidenceTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: Colors.text.primary,
  marginBottom: 4,
  textAlign: 'center',
},
confidenceSubtitle: {
  fontSize: 13,
  color: Colors.text.secondary,
  marginBottom: 16,
  textAlign: 'center',
},
confidenceButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 8,
},
confidenceButton: {
  flex: 1,
  alignItems: 'center',
  padding: 12,
  borderRadius: 12,
  backgroundColor: Colors.background.subtle,
  borderWidth: 2,
  borderColor: Colors.border.light,
},
confidenceButtonSelected: {
  backgroundColor: 'rgba(124, 77, 255, 0.1)',
  borderColor: Colors.primary.main,
},
confidenceEmoji: {
  fontSize: 24,
  marginBottom: 4,
},
confidenceButtonText: {
  fontSize: 12,
  fontWeight: '600',
  color: Colors.text.secondary,
  textAlign: 'center',
},
confidenceButtonTextSelected: {
  color: Colors.primary.main,
},
```

---

## ✅ Verification

After making these changes, test by:

1. **Answer a question** - Check console for "✅ DKT: Logged interaction..."
2. **Select confidence level** - Should see UI before submit button
3. **Use hints** - Hint count should increment
4. **Complete a session** - Check database for new interactions

## 🎯 What This Enables

- **Interaction Logging**: Every answer tracked with context
- **Confidence Tracking**: Helps detect misconceptions (high confidence + wrong = misconception)
- **Time Tracking**: Measures how long students take per question
- **Hint Usage**: Tracks when students need help
- **Session Tracking**: Groups questions into study sessions
- **Knowledge State**: Backend updates mastery predictions after each interaction

## 📊 Expected Results

After students answer 5-10 questions:
- Knowledge map will show mastery percentages
- Recommendations will suggest optimal next questions
- System detects struggling vs. mastered skills

---

**Need Help?** Check `DKT_IMPLEMENTATION_GUIDE.md` for full details!
