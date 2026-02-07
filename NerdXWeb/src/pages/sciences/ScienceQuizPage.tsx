import { useCallback, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  quizApi,
  type Question,
  type Topic,
  type AnswerResult,
} from '../../services/api/quizApi';
import { API_BASE_URL } from '../../services/api/config';
import { calculateQuizCreditCost } from '../../utils/creditCalculator';
import { ArrowLeft } from 'lucide-react';

interface SubjectInfo {
  id: string;
  name: string;
  color: string;
}

export function ScienceQuizPage() {
  const { state } = useLocation() as {
    state?: {
      question: Question;
      subject: SubjectInfo;
      topic?: Topic;
      parentSubject?: string;
      questionFormat?: 'mcq' | 'structured';
      mixImagesEnabled?: boolean;
      backTo?: string;
    };
  };
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const subject = state?.subject ?? { id: 'combined_science', name: 'O Level Science', color: '#00E676' };
  const topic = state?.topic;
  const parentSubject = state?.parentSubject ?? 'Biology';
  const questionFormat = state?.questionFormat ?? 'mcq';
  const mixImagesEnabled = state?.mixImagesEnabled ?? false;

  const [question, setQuestion] = useState<Question | null>(state?.question ?? null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [structuredAnswers, setStructuredAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const questionStartTime = useRef(Date.now());

  const isStructured =
    question?.question_type === 'structured' && question.structured_question;
  const structParts = question?.structured_question?.parts ?? [];
  const hasStructAnswer = structParts.some(
    (p) => (structuredAnswers[p.label] ?? '').trim().length > 0
  );
  const hasOptions = Array.isArray(question?.options) && (question?.options?.length ?? 0) > 0;
  const canSubmit = isStructured
    ? hasStructAnswer
    : hasOptions
      ? !!selectedAnswer
      : !!textAnswer.trim();

  const resolveMediaUrl = (url?: string | null) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const normalized = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${normalized}`;
  };

  const generateNext = useCallback(async () => {
    setGenerating(true);
    setResult(null);
    setSelectedAnswer('');
    setTextAnswer('');
    setStructuredAnswers({});
    try {
      const nextQuestion = await quizApi.generateQuestion(
        subject.id,
        topic?.id,
        'medium',
        topic ? 'topical' : 'exam',
        subject.id === 'combined_science' ? parentSubject : undefined,
        undefined,
        questionFormat,
        mixImagesEnabled
      );
      const creditsRemaining = (nextQuestion as Question & { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) updateUser({ credits: creditsRemaining });
      setQuestion(nextQuestion);
      questionStartTime.current = Date.now();
    } catch (err) {
      console.error('Generate question error', err);
    } finally {
      setGenerating(false);
    }
  }, [parentSubject, questionFormat, mixImagesEnabled, subject.id, topic, updateUser]);

  const handleSubmit = async () => {
    if (!question || !canSubmit) return;
    setLoading(true);
    try {
      let answerToSubmit: string;
      if (isStructured) {
        answerToSubmit = structParts
          .map((p) => `${p.label}: ${structuredAnswers[p.label] ?? ''}`)
          .join('\n\n');
      } else {
        answerToSubmit = hasOptions ? selectedAnswer : textAnswer.trim();
      }
      const res = await quizApi.submitAnswer(
        question.id,
        answerToSubmit,
        undefined,
        subject.id,
        question.correct_answer,
        question.solution,
        question.hint,
        question.question_text,
        question.options,
        isStructured ? question.structured_question : undefined,
        question.question_type
      );
      if (res) {
        setResult(res);
        const creditsRemaining = (res as AnswerResult & { credits_remaining?: number })?.credits_remaining;
        if (creditsRemaining !== undefined) updateUser({ credits: creditsRemaining });
      }
    } catch (err) {
      console.error('Submit answer error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (generating) return;
    const userCredits = user?.credits ?? 0;
    const cost = calculateQuizCreditCost({
      subject: subject.id,
      questionType: topic ? 'topical' : 'exam',
      isImageQuestion: mixImagesEnabled,
    });
    if (userCredits < cost) {
      navigate('/app/credits');
      return;
    }
    generateNext();
  };

  const handleBack = () => {
    if (state?.backTo) {
      navigate(state.backTo);
    } else {
      navigate('/app/sciences', { state: { activeTab: parentSubject } });
    }
  };

  if (!question && !generating) {
    return (
      <div className="quiz-page">
        <Link to="/app/sciences" className="back-link">
          <ArrowLeft size={20} /> Back to Sciences
        </Link>
        <p className="quiz-no-question">No question loaded. Start from the Topics page.</p>
      </div>
    );
  }

  if (generating && !question) {
    return (
      <div className="quiz-page">
        <div className="quiz-loading">
          <p>Generating your question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <button type="button" className="back-link" onClick={handleBack}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="quiz-title">Practice</h1>
        {topic && <span className="quiz-topic">{topic.name}</span>}
      </header>

      <main className="quiz-main">
        {question && (
          <>
            <div className="quiz-question-block">
              <h2 className="quiz-question-label">Question</h2>
              {question.question_image_url && (
                <div className="quiz-question-image">
                  <img src={resolveMediaUrl(question.question_image_url)} alt="Question visual" />
                </div>
              )}
              <div className="quiz-question-text">
                {question.structured_question ? (
                  <>
                    <p>{question.structured_question.stem}</p>
                    {question.structured_question.parts.map((p) => (
                      <div key={p.label} className="quiz-struct-part">
                        <strong>{p.label}</strong> [{p.marks} marks]: {p.question}
                      </div>
                    ))}
                  </>
                ) : (
                  <p>{question.question_text}</p>
                )}
              </div>
            </div>

            {!result && (
              <div className="quiz-answer-block">
                {isStructured ? (
                  <div className="quiz-structured-inputs">
                    {structParts.map((p) => (
                      <div key={p.label} className="quiz-struct-input">
                        <label>{p.label}</label>
                        <textarea
                          value={structuredAnswers[p.label] ?? ''}
                          onChange={(e) =>
                            setStructuredAnswers((prev) => ({
                              ...prev,
                              [p.label]: e.target.value,
                            }))
                          }
                          placeholder={`Your answer for ${p.label}`}
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                ) : hasOptions ? (
                  <div className="quiz-options">
                    {question.options!.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`quiz-option ${selectedAnswer === opt ? 'selected' : ''}`}
                        onClick={() => setSelectedAnswer(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="quiz-text-input">
                    <textarea
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      rows={4}
                    />
                  </div>
                )}

                <button
                  type="button"
                  className="quiz-submit-btn"
                  onClick={handleSubmit}
                  disabled={!canSubmit || loading}
                >
                  {loading ? 'Checking...' : 'Submit'}
                </button>
              </div>
            )}

            {result && (
              <div className="quiz-result-block">
                <div
                  className={`quiz-result-badge ${result.correct ? 'correct' : 'incorrect'}`}
                >
                  {result.correct ? 'Correct!' : 'Incorrect'}
                </div>
                <p className="quiz-feedback">{result.feedback}</p>
                <div className="quiz-solution">
                  <h3>Solution</h3>
                  <p>{result.solution}</p>
                </div>
                <div className="quiz-result-actions">
                  <button type="button" className="quiz-next-btn" onClick={handleNext}>
                    Next Question
                  </button>
                  <button type="button" className="quiz-back-btn" onClick={handleBack}>
                    Back to Topics
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
