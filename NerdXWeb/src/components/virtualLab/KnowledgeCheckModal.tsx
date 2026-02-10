import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, Loader2, Sparkles, X, XCircle } from 'lucide-react';
import type { QuizQuestion, SimulationMetadata } from '../../data/virtualLab';
import { virtualLabApi } from '../../services/api/virtualLabApi';
import { useAuth } from '../../context/AuthContext';

export interface KnowledgeCheckResult {
  correctAnswers: number;
  totalQuestions: number;
  scorePercent: number;
  xpEarned: number;
}

type Step = 'setup' | 'loading' | 'quiz' | 'result';

interface Props {
  open: boolean;
  simulation: SimulationMetadata;
  onClose: () => void;
  onComplete?: (result: KnowledgeCheckResult) => void;
}

function clampCount(n: number) {
  return Math.max(3, Math.min(20, n));
}

export function KnowledgeCheckModal({ open, simulation, onClose, onComplete }: Props) {
  const { updateUser } = useAuth();
  const [step, setStep] = useState<Step>('setup');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    if (!open) return;
    setStep('setup');
    setQuestionCount(5);
    setQuestions([]);
    setUsedFallback(false);
    setLoadError(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCorrectAnswers(0);
  }, [open, simulation.id]);

  const fallbackQuestions = useMemo(() => {
    const qs = simulation.quizQuestions || [];
    return qs.slice(0, Math.max(1, Math.min(qs.length, 10)));
  }, [simulation.quizQuestions]);

  const buildFallback = (count: number): QuizQuestion[] => {
    if (!fallbackQuestions.length) {
      return [
        {
          id: 'fallback-q1',
          question: `What is the key idea in "${simulation.topic}"?`,
          options: ['Definition', 'Example', 'Application', 'All of the above'],
          correctIndex: 3,
          explanation: 'Good learning connects definitions, examples, and applications.',
        },
      ];
    }
    const result: QuizQuestion[] = [];
    let i = 0;
    while (result.length < count) {
      const base = fallbackQuestions[i % fallbackQuestions.length];
      result.push({ ...base, id: `${base.id}-${result.length + 1}` });
      i++;
    }
    return result.slice(0, count);
  };

  const start = async () => {
    const count = clampCount(questionCount);
    setStep('loading');
    setLoadError(null);
    setUsedFallback(false);

    try {
      const result = await virtualLabApi.generateKnowledgeCheck({
        simulation_id: simulation.id,
        subject: simulation.subject as any,
        topic: simulation.topic,
        difficulty: simulation.difficulty as any,
        count,
      });

      if (typeof result.credits_remaining === 'number') {
        updateUser({ credits: result.credits_remaining });
      }

      const mapped: QuizQuestion[] = (result.questions || [])
        .filter((q) => q && q.question_text && Array.isArray(q.options) && q.options.length >= 2)
        .map((q) => ({
          id: q.id,
          question: q.question_text,
          options: q.options,
          correctIndex: typeof q.correct_index === 'number' ? q.correct_index : 0,
          explanation: q.explanation || '',
        }));

      let finalQuestions = mapped.slice(0, count);
      if (finalQuestions.length < count) {
        finalQuestions = [...finalQuestions, ...buildFallback(count - finalQuestions.length)];
        setUsedFallback(true);
      }

      setQuestions(finalQuestions);
      setStep('quiz');
    } catch (e) {
      setUsedFallback(true);
      setLoadError('Could not load AI questions. Using offline questions instead.');
      setQuestions(buildFallback(count));
      setStep('quiz');
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;
  const isCorrect = selectedAnswer !== null && selectedAnswer === currentQuestion?.correctIndex;

  const select = (idx: number) => {
    if (!currentQuestion) return;
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === currentQuestion.correctIndex) setCorrectAnswers((p) => p + 1);
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      return;
    }

    const total = questions.length || 1;
    const scorePercent = Math.round((correctAnswers / total) * 100);
    const xpEarned = Math.round((simulation.xpReward * scorePercent) / 100);
    onComplete?.({ correctAnswers, totalQuestions: total, scorePercent, xpEarned });
    setStep('result');
  };

  if (!open) return null;

  return (
    <div className="vl-modal-overlay" role="dialog" aria-modal="true" aria-label="Knowledge check">
      <div className="vl-modal">
        <div className="vl-modal-top">
          <div className="vl-modal-title">
            <Sparkles size={18} /> Knowledge Check
          </div>
          <button type="button" className="vl-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="vl-modal-body">
          <div className="vl-modal-sim">
            <div className="vl-modal-sim-title">{simulation.title}</div>
            <div className="vl-modal-sim-sub">{simulation.topic}</div>
          </div>

          {step === 'setup' && (
            <div className="vl-modal-card">
              <div className="vl-modal-row">
                <div>
                  <div className="vl-modal-label">Questions</div>
                  <div className="vl-modal-help">Choose how many questions to practice</div>
                </div>
                <div className="vl-stepper">
                  <button type="button" onClick={() => setQuestionCount((v) => clampCount(v - 1))}>
                    -
                  </button>
                  <span>{questionCount}</span>
                  <button type="button" onClick={() => setQuestionCount((v) => clampCount(v + 1))}>
                    +
                  </button>
                </div>
              </div>

              <button type="button" className="vl-btn primary" onClick={() => void start()}>
                Start
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === 'loading' && (
            <div className="vl-modal-card">
              <div className="vl-loading">
                <Loader2 size={18} className="vl-spin" /> Generating questions...
              </div>
              <div className="vl-card-subtitle">This may take a few seconds.</div>
            </div>
          )}

          {step === 'quiz' && currentQuestion && (
            <div className="vl-modal-card">
              {loadError && <div className="vl-alert">{loadError}</div>}
              {usedFallback && !loadError && <div className="vl-alert">Some questions are offline fallback.</div>}

              <div className="vl-progress">
                <div className="vl-progress-top">
                  <div className="vl-progress-label">
                    Question {currentIndex + 1} / {questions.length}
                  </div>
                  <div className="vl-progress-label">{progress}%</div>
                </div>
                <div className="vl-progress-bar">
                  <div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="vl-question">{currentQuestion.question}</div>
              <div className="vl-options">
                {currentQuestion.options.map((opt, idx) => {
                  const selected = selectedAnswer === idx;
                  const correct = showExplanation && idx === currentQuestion.correctIndex;
                  const wrong = showExplanation && selected && idx !== currentQuestion.correctIndex;
                  return (
                    <button
                      key={`${currentQuestion.id}-${idx}`}
                      type="button"
                      className={`vl-option ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}
                      onClick={() => select(idx)}
                      disabled={selectedAnswer !== null}
                    >
                      <span className="vl-option-marker">{String.fromCharCode(65 + idx)}</span>
                      <span className="vl-option-text">{opt}</span>
                      {correct ? <CheckCircle2 size={18} /> : null}
                      {wrong ? <XCircle size={18} /> : null}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className={`vl-explanation ${isCorrect ? 'ok' : 'bad'}`}>
                  <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {currentQuestion.explanation}
                </div>
              )}

              <div className="vl-modal-actions">
                <button type="button" className="vl-btn secondary" onClick={onClose}>
                  Exit
                </button>
                <button type="button" className="vl-btn primary" onClick={next} disabled={!showExplanation}>
                  {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="vl-modal-card">
              <div className="vl-result">
                <div className="vl-result-title">Done</div>
                <div className="vl-result-sub">
                  Score: {correctAnswers}/{Math.max(1, questions.length)}
                </div>
              </div>
              <div className="vl-modal-actions">
                <button type="button" className="vl-btn secondary" onClick={onClose}>
                  Close
                </button>
                <button type="button" className="vl-btn primary" onClick={() => setStep('setup')}>
                  Try again
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

