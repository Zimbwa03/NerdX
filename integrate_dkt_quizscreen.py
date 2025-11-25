"""
Auto-integrate DKT into QuizScreen.tsx
This script safely adds DKT tracking without corrupting the file
"""

import os
import re

QUIZ_SCREEN_PATH = r'NerdXApp\src\screens\QuizScreen.tsx'

def integrate_dkt():
    """Apply all DKT integrations to QuizScreen"""
    
    if not os.path.exists(QUIZ_SCREEN_PATH):
        print(f"❌ Error: {QUIZ_SCREEN_PATH} not found")
        return False
    
    with open(QUIZ_SCREEN_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Step 1: Add DKT import
    print("Step 1: Adding DKT import...")
    import_pattern = r"(import { quizApi, Question, AnswerResult } from '\.\./services/api/quizApi';)"
    import_replacement = r"\1\nimport { dktService } from '../services/api/dktApi';"
    
    if 'dktService' not in content:
        content = re.sub(import_pattern, import_replacement, content)
        print("✅ DKT import added")
    else:
        print("⏭️  DKT import already exists")
    
    # Step 2: Add DKT state variables
    print("\nStep 2: Adding DKT state variables...")
    state_pattern = r"(const \[questionCount, setQuestionCount\] = useState\(1\);)"
    state_addition = r"""\1

  // DKT (Deep Knowledge Tracing) state
  const [selectedConfidence, setSelectedConfidence] = useState<'low' | 'medium' | 'high' | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [hintsUsed, setHintsUsed] = useState<number>(0);"""
    
    if 'selectedConfidence' not in content:
        content = re.sub(state_pattern, state_addition, content)
        print("✅ DKT state variables added")
    else:
        print("⏭️  DKT state variables already exist")
    
    # Step 3: Add DKT logging function before handleImageUpload
    print("\nStep 3: Adding DKT logging function...")
    function_addition = """
  // Log interaction to DKT system
  const logInteractionToDKT = async (isCorrect: boolean) => {
    if (!question || !subject) return;

    try {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
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

      console.log(`✅ DKT: Logged interaction for ${skill_id}`);
    } catch (error) {
      console.error('Failed to log to DKT:', error);
    }
  };

  const handleImageUpload"""
    
    if 'logInteractionToDKT' not in content:
        content = content.replace('  const handleImageUpload', function_addition)
        print("✅ DKT logging function added")
    else:
        print("⏭️  DKT logging function already exists")
    
    # Step 4: Add DKT call in handleSubmit
    print("\nStep 4: Adding DKT call in handleSubmit...")
    submit_pattern = r"(setResult\(answerResult\);)\s+(if \(answerResult\.correct)"
    submit_replacement = r"\1\n        await logInteractionToDKT(answerResult.correct);\n        \2"
    
    if 'await logInteractionToDKT' not in content:
        content = re.sub(submit_pattern, submit_replacement, content)
        print("✅ DKT call added to handleSubmit")
    else:
        print("⏭️  DKT call already in handleSubmit")
    
    # Step 5: Reset DKT state in handleNext
    print("\nStep 5: Resetting DKT state in handleNext...")
    next_pattern = r"(setShowHint\(false\);)\s+(if \(user\))"
    next_replacement = r"""\1
        setSelectedConfidence(null);
        setQuestionStartTime(Date.now());
        setHintsUsed(0);
        \2"""
    
    if 'setQuestionStartTime(Date.now())' not in content:
        content = re.sub(next_pattern, next_replacement, content)
        print("✅ DKT reset added to handleNext")
    else:
        print("⏭️  DKT reset already in handleNext")
    
    # Step 6: Track hints
    print("\nStep 6: Adding hint tracking...")
    hint_pattern = r"onPress=\{\(\) => setShowHint\(!showHint\)\}"
    hint_replacement = r"""onPress={() => {
                setShowHint(!showHint);
                if (!showHint) setHintsUsed(prev => prev + 1);
              }}"""
    
    if 'setHintsUsed' not in content or 'setHintsUsed(prev => prev + 1)' not in content:
        content = re.sub(hint_pattern, hint_replacement, content)
        print("✅ Hint tracking added")
    else:
        print("⏭️  Hint tracking already exists")
    
    # Check if anything changed
    if content == original_content:
        print("\n✅ All DKT integrations already present!")
        return True
    
    # Save the file
    try:
        with open(QUIZ_SCREEN_PATH, 'w', encoding='utf-8') as f:
            f.write(content)
        print("\n✅ Successfully integrated DKT into QuizScreen!")
        print(f"📝 File saved: {QUIZ_SCREEN_PATH}")
        return True
    except Exception as e:
        print(f"\n❌ Error saving file: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting DKT Integration for QuizScreen\n")
    print("="*60)
    
    success = integrate_dkt()
    
    print("="*60)
    if success:
        print("\n🎉 Integration complete!")
        print("\nNext steps:")
        print("1. Test the app - answer a quiz question")
        print("2. Check console for '✅ DKT: Logged interaction...'")
        print("3. Verify database has new interactions")
    else:
        print("\n❌ Integration failed - check errors above")
