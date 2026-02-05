import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  examApi,
  type ExamConfig,
  type TimeInfo,
  type ExamSession,
  type QuestionResponse,
} from '../../services/api/examApi';
import { MathRenderer } from '../../components/MathRenderer';
import { Flag, Grid3X3, ChevronLeft, ChevronRight, Upload } from 'lucide-react';

function hasLatex(text: string): boolean {
  return /\\\(|\\\[|\$/.test(text);
}

export function ExamSessionPage() {
  const { state } = useLocation() as {
    state?: {
      examConfig: ExamConfig;
      timeInfo: TimeInfo;
      backTo?: string;
      subjectLabel?: string;
    };
  };
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const examConfig = state?.examConfig;
  const timeInfo = state?.timeInfo;
  const backTo = state?.backTo ?? '/app/mathematics';
  const subjectLabel = state?.subjectLabel ?? 'Mathematics';

  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentResponse, setCurrentResponse] = useState<QuestionResponse | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [structuredAnswer, setStructuredAnswer] = useState('');
  const [answerImage, setAnswerImage] = useState<File | null>(null);
  const [responses, setResponses] = useState<Record<number, { answer: string }>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [remainingSeconds, setRemainingSeconds] = useState(timeInfo?.total_seconds ?? 0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewGrid, setShowReviewGrid] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [lastAnswerSubmitted, setLastAnswerSubmitted] = useState(false);
  const questionStartTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answerImageInputRef = useRef<HTMLInputElement>(null);

  const totalQuestions = session?.total_questions ?? examConfig?.total_questions ?? 10;
  const currentIndex = currentResponse?.question_index ?? 0;
  const allowAnswerImage =
    examConfig?.subject === 'mathematics' || examConfig?.subject === 'combined_science' ||
    (examConfig?.subject === 'business_enterprise_skills' && (currentResponse?.question?.question_type === 'essay' || currentResponse?.question?.question_type === 'STRUCTURED'));

  useEffect(() => {
    if (!examConfig) {
      navigate(backTo);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const s = await examApi.createSession(examConfig);
        if (!cancelled && s) {
          setSession(s);
          setRemainingSeconds(s.total_time_seconds);
          const res = await examApi.getNextQuestion(s.session_id, 0);
          if (!cancelled && res) {
            setCurrentResponse(res);
            if (res.credits_remaining !== undefined) updateUser({ credits: res.credits_remaining });
          }
        } else if (!cancelled) {
          navigate(backTo);
        }
      } catch {
        if (!cancelled) navigate(backTo);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [examConfig, backTo, navigate]);

  useEffect(() => {
    if (session && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session]);

  const handleAutoSubmit = async () => {
    if (!session || !currentResponse) return;
    saveCurrentAnswer();
    await submitCurrentAndFinish();
  };

  const loadQuestion = async (index: number) => {
    if (!session) return;
    setLoading(true);
    questionStartTime.current = Date.now();
    try {
      const res = await examApi.getNextQuestion(session.session_id, index);
      if (res) {
        setCurrentResponse(res);
        if (res.credits_remaining !== undefined) updateUser({ credits: res.credits_remaining });
        const prev = responses[res.question_index];
        if (prev) {
          if (res.question.question_type === 'MCQ') setSelectedAnswer(prev.answer);
          else setStructuredAnswer(prev.answer);
        } else {
          setSelectedAnswer('');
          setStructuredAnswer('');
          setAnswerImage(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentAnswer = () => {
    if (!currentResponse) return;
    const answer = currentResponse.question.question_type === 'MCQ' ? selectedAnswer : structuredAnswer;
    setResponses((prev) => ({ ...prev, [currentIndex]: { answer } }));
  };

  const uploadAnswerImage = async (): Promise<string | null> => {
    if (!answerImage) return null;
    return examApi.uploadExamImage(answerImage);
  };

  const completeAndFinish = async () => {
    if (!session) return;
    setSubmitting(true);
    try {
      const results = await examApi.completeExam(session.session_id);
      navigate('/app/exam/review', {
        state: { sessionId: session.session_id, results, backTo, subjectLabel },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const submitCurrentAndFinish = async () => {
    if (!session || !currentResponse) return;
    setSubmitting(true);
    try {
      const q = currentResponse.question;
      const answer = q.question_type === 'MCQ' ? selectedAnswer : structuredAnswer;
      let imageUrl: string | undefined;
      if (allowAnswerImage && (q.question_type === 'STRUCTURED' || q.question_type === 'essay') && answerImage) {
        imageUrl = (await uploadAnswerImage()) ?? undefined;
      }
      const timeSpent = Math.floor((Date.now() - questionStartTime.current) / 1000);
      await examApi.submitAnswer(
        session.session_id,
        q.id,
        answer,
        timeSpent,
        flaggedQuestions.has(currentIndex),
        imageUrl
      );
      await completeAndFinish();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    saveCurrentAnswer();
    if (!session || !currentResponse) return;

    const q = currentResponse.question;
    const answer = q.question_type === 'MCQ' ? selectedAnswer : structuredAnswer;
    let imageUrl: string | undefined;
    if (allowAnswerImage && (q.question_type === 'STRUCTURED' || q.question_type === 'essay') && answerImage) {
      imageUrl = (await uploadAnswerImage()) ?? undefined;
    }
    const timeSpent = Math.floor((Date.now() - questionStartTime.current) / 1000);

    try {
      await examApi.submitAnswer(
        session.session_id,
        q.id,
        answer,
        timeSpent,
        flaggedQuestions.has(currentIndex),
        imageUrl
      );
    } catch (err) {
      console.error(err);
    }

    if (currentIndex >= totalQuestions - 1) {
      setShowSubmitConfirm(true);
      setLastAnswerSubmitted(true);
    } else {
      await loadQuestion(currentIndex + 1);
    }
  };

  const handlePrevious = async () => {
    saveCurrentAnswer();
    if (!session || currentIndex === 0) return;
    await loadQuestion(currentIndex - 1);
  };

  const handleJumpToQuestion = (index: number) => {
    saveCurrentAnswer();
    setShowReviewGrid(false);
    loadQuestion(index);
  };

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) next.delete(currentIndex);
      else next.add(currentIndex);
      return next;
    });
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerColor = remainingSeconds <= 60 ? 'var(--error)' : remainingSeconds <= 300 ? '#FF9800' : '#fff';

  if (!examConfig) return null;

  if (loading && !currentResponse && !session) {
    return (
      <div className="exam-session-page">
        <div className="exam-session-loading">Creating exam session…</div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="exam-session-page">
        <div className="exam-session-loading">Submitting your exam…</div>
      </div>
    );
  }

  if (!session || !currentResponse) return null;

  const q = currentResponse.question;
  const hasOptions = q.options && q.options.length > 0;
  const answer = q.question_type === 'MCQ' ? selectedAnswer : structuredAnswer;

  return (
    <div className="exam-session-page">
      <header className="exam-session-header-bar">
        <div className="exam-session-timer" style={{ color: timerColor }}>
          <span>⏱</span> {formatTimer(remainingSeconds)}
        </div>
        <span className="exam-session-progress">
          {currentIndex + 1} / {totalQuestions}
        </span>
        <button
          type="button"
          className={`exam-session-flag ${flaggedQuestions.has(currentIndex) ? 'active' : ''}`}
          onClick={toggleFlag}
          title="Flag question"
        >
          <Flag size={20} />
        </button>
      </header>
      <div
        className="exam-session-progress-bar"
        style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
      />

      <main className="exam-session-main">
        <div className="exam-question-card">
          <div className="exam-question-header">
            <span className="exam-question-num">Question {currentIndex + 1}</span>
            {q.topic && <span className="exam-question-topic">{q.topic}</span>}
          </div>
          {q.prompt_to_student && (
            <p className="exam-question-prompt">{q.prompt_to_student}</p>
          )}
          {hasLatex(q.stem) ? (
            <MathRenderer content={q.stem} fontSize={16} />
          ) : (
            <p className="exam-question-stem">{q.stem}</p>
          )}
        </div>

        {q.question_type === 'MCQ' && hasOptions ? (
          <div className="exam-options">
            {q.options!.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className={`exam-option ${selectedAnswer === opt.label ? 'selected' : ''}`}
                onClick={() => setSelectedAnswer(opt.label)}
              >
                <span className="exam-option-label">{opt.label}</span>
                {hasLatex(opt.text) ? (
                  <MathRenderer content={opt.text} fontSize={15} />
                ) : (
                  <span>{opt.text}</span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="exam-structured-answer">
            {q.parts?.map((part) => (
              <div key={part.part} className="exam-structured-part">
                <span className="exam-part-label">({part.part})</span>
                <span className="exam-part-marks">[{part.marks} mark{part.marks > 1 ? 's' : ''}]</span>
                <p>{part.prompt}</p>
              </div>
            ))}
            <textarea
              value={structuredAnswer}
              onChange={(e) => setStructuredAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
            />
            {allowAnswerImage && (
              <div className="exam-answer-image">
                <input
                  ref={answerImageInputRef}
                  type="file"
                  accept="image/*"
                  className="exam-file-hidden"
                  onChange={(e) => setAnswerImage(e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  className="exam-upload-answer-btn"
                  onClick={() => answerImageInputRef.current?.click()}
                >
                  <Upload size={18} /> {answerImage ? 'Change Image' : 'Upload Answer Image'}
                </button>
                {answerImage && <span className="exam-image-name">{answerImage.name}</span>}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="exam-session-footer">
        <button
          type="button"
          className="exam-nav-btn"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={20} /> Previous
        </button>
        <button
          type="button"
          className="exam-review-btn"
          onClick={() => setShowReviewGrid(true)}
        >
          <Grid3X3 size={20} /> Review
        </button>
        <button
          type="button"
          className="exam-nav-btn primary"
          onClick={handleNext}
          disabled={!answer?.trim()}
        >
          {currentIndex >= totalQuestions - 1 ? 'Submit' : 'Next'}
          <ChevronRight size={20} />
        </button>
      </footer>

      {showReviewGrid && (
        <div className="exam-review-overlay" onClick={() => setShowReviewGrid(false)}>
          <div className="exam-review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="exam-review-header">
              <h3>Question Review</h3>
              <button type="button" onClick={() => setShowReviewGrid(false)}>✕</button>
            </div>
            <div className="exam-review-legend">
              <span><i className="answered" /> Answered</span>
              <span><i className="unanswered" /> Unanswered</span>
              <span><i className="flagged" /> Flagged</span>
            </div>
            <div className="exam-review-grid">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`exam-review-cell ${
                    responses[i]?.answer ? 'answered' : ''
                  } ${flaggedQuestions.has(i) ? 'flagged' : ''} ${
                    i === currentIndex ? 'current' : ''
                  }`}
                  onClick={() => handleJumpToQuestion(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="exam-submit-exam-btn"
              onClick={() => {
                setShowReviewGrid(false);
                setLastAnswerSubmitted(false);
                setShowSubmitConfirm(true);
              }}
            >
              Submit Exam
            </button>
          </div>
        </div>
      )}

      {showSubmitConfirm && (
        <div className="exam-review-overlay" onClick={() => setShowSubmitConfirm(false)}>
          <div className="exam-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Submit Exam</h3>
            <p>
              {Object.keys(responses).length < totalQuestions
                ? `You have ${totalQuestions - Object.keys(responses).length} unanswered question(s). Submit anyway?`
                : 'Are you sure you want to submit your exam?'}
            </p>
            <div className="exam-confirm-actions">
              <button type="button" onClick={() => setShowSubmitConfirm(false)}>
                Review
              </button>
              <button
                type="button"
                className="primary"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  if (lastAnswerSubmitted) completeAndFinish();
                  else submitCurrentAndFinish();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
