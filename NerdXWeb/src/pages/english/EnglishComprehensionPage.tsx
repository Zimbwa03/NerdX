import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  englishApi,
  type ComprehensionData,
  type GradingResult,
  type SummaryGradingResult,
} from '../../services/api/englishApi';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';

const COMPREHENSION_CREDITS = 2;

export function EnglishComprehensionPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [comprehension, setComprehension] = useState<ComprehensionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [summaryAnswer, setSummaryAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [summaryResult, setSummaryResult] = useState<SummaryGradingResult | null>(null);
  const [activeTab, setActiveTab] = useState<'questions' | 'summary'>('questions');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if ((user?.credits ?? 0) < COMPREHENSION_CREDITS) {
      setError(`Comprehension requires ${COMPREHENSION_CREDITS} credits. Please buy credits first.`);
      return;
    }
    setError(null);
    setLoading(true);
    setIsGenerating(true);
    setSubmitted(false);
    setGradingResult(null);
    setSummaryResult(null);
    setAnswers({});
    setSummaryAnswer('');
    try {
      const data = await englishApi.generateComprehension();
      if (data) {
        setComprehension(data);
        if (user && data.credits_remaining !== undefined) {
          updateUser({ credits: data.credits_remaining });
        }
      } else {
        setError('Failed to generate comprehension. Please try again.');
      }
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
      const msg = e && typeof e === 'object' && 'response' in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to generate comprehension';
      setError(msg || 'Failed to generate comprehension');
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!comprehension) return;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < comprehension.questions.length) {
      setError(`Please answer all ${comprehension.questions.length} questions before submitting.`);
      return;
    }
    if (comprehension.summary_question && !summaryAnswer.trim()) {
      setError('Please write your summary before submitting.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const gradeResult = await englishApi.gradeComprehension(
        comprehension.passage,
        comprehension.questions,
        answers
      );
      setGradingResult(gradeResult ?? null);
      if (user && gradeResult?.credits_remaining !== undefined) {
        updateUser({ credits: gradeResult.credits_remaining });
      }
      let sumResult: SummaryGradingResult | null = null;
      if (comprehension.summary_question && summaryAnswer) {
        sumResult = await englishApi.gradeSummary(
          comprehension.passage,
          comprehension.summary_question.question,
          summaryAnswer
        );
        setSummaryResult(sumResult);
        if (user && sumResult?.credits_remaining !== undefined) {
          updateUser({ credits: sumResult.credits_remaining });
        }
      }
      setSubmitted(true);
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
      setError('Failed to grade answers. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalScore = (gradingResult?.total_score ?? 0) + (summaryResult?.total_score ?? 0);
  const maxScore = (gradingResult?.total_possible ?? 0) + (summaryResult?.max_score ?? 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <div className="english-comprehension-page">
      <header className="english-comprehension-header">
        <Link to="/app/english" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="english-comprehension-title">Comprehension</h1>
        <span className="english-comprehension-credits">Credits: {user?.credits ?? 0}</span>
      </header>

      <main className="english-comprehension-main">
        {!comprehension && (
          <section className="english-comprehension-welcome">
            <div className="english-comprehension-welcome-card">
              <div className="english-comprehension-welcome-icon">
                <BookOpen size={48} />
              </div>
              <h2>Master Comprehension</h2>
              <p>
                Practice with AI-generated passages tailored to the O-Level syllabus.
                Improve your reading and analytical skills.
              </p>
              {error && <p className="english-comprehension-error">{error}</p>}
              <button
                type="button"
                className="english-comprehension-btn-primary"
                onClick={handleGenerate}
                disabled={loading}
              >
                {isGenerating ? 'Generating…' : loading ? 'Loading…' : `Start Practice (${COMPREHENSION_CREDITS} Credits)`}
              </button>
            </div>
          </section>
        )}

        {comprehension && (
          <>
            <section className="english-comprehension-passage">
              <h2 className="english-comprehension-section-title">Reading Passage</h2>
              <div className="english-comprehension-passage-card">
                <p className="english-comprehension-passage-text">{comprehension.passage}</p>
              </div>
            </section>

            <div className="english-comprehension-tabs">
              <button
                type="button"
                className={`english-comprehension-tab ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => setActiveTab('questions')}
              >
                Questions
              </button>
              {comprehension.summary_question && (
                <button
                  type="button"
                  className={`english-comprehension-tab ${activeTab === 'summary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('summary')}
                >
                  Summary
                </button>
              )}
            </div>

            {activeTab === 'questions' && (
              <section className="english-comprehension-questions">
                <h2 className="english-comprehension-section-title">Comprehension Questions</h2>
                {comprehension.questions.map((q, index) => {
                  const grade = gradingResult?.question_grades.find((g) => g.question_index === index);
                  return (
                    <div key={index} className="english-comprehension-question-card">
                      <div className="english-comprehension-question-header">
                        <span className="english-comprehension-q-num">Q{index + 1}</span>
                        <span className="english-comprehension-marks">{q.marks} marks</span>
                        {submitted && grade && (
                          <span className={`english-comprehension-awarded ${grade.marks_awarded === grade.max_marks ? 'correct' : 'partial'}`}>
                            {grade.marks_awarded}/{grade.max_marks}
                          </span>
                        )}
                      </div>
                      <p className="english-comprehension-question-text">{q.question}</p>
                      <textarea
                        className="english-comprehension-answer-input"
                        value={answers[index] ?? ''}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [index]: e.target.value }))}
                        placeholder="Type your answer here..."
                        rows={3}
                        readOnly={submitted}
                      />
                      {submitted && grade && (
                        <div className="english-comprehension-feedback">
                          <strong>Feedback:</strong> {grade.feedback}
                          <br />
                          <strong>Correct answer:</strong> {q.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            )}

            {activeTab === 'summary' && comprehension.summary_question && (
              <section className="english-comprehension-summary">
                <h2 className="english-comprehension-section-title">Summary Writing</h2>
                <div className="english-comprehension-question-card">
                  <p className="english-comprehension-question-text">{comprehension.summary_question.question}</p>
                  <p className="english-comprehension-meta">Max words: {comprehension.summary_question.max_words}</p>
                  <textarea
                    className="english-comprehension-answer-input english-comprehension-summary-input"
                    value={summaryAnswer}
                    onChange={(e) => setSummaryAnswer(e.target.value)}
                    placeholder="Write your summary here..."
                    rows={6}
                    readOnly={submitted}
                  />
                  <p className="english-comprehension-word-count">
                    Word count: {summaryAnswer.trim().split(/\s+/).filter(Boolean).length}
                  </p>
                  {submitted && summaryResult && (
                    <div className="english-comprehension-feedback">
                      <p><strong>Feedback:</strong> {summaryResult.feedback}</p>
                      <p>Content: {summaryResult.content_points}/10 · Language: {summaryResult.language_mark}/10</p>
                      {summaryResult.key_points_missed?.length ? (
                        <ul>
                          {summaryResult.key_points_missed.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  )}
                </div>
              </section>
            )}

            {!submitted && (
              <section className="english-comprehension-actions">
                {error && <p className="english-comprehension-error">{error}</p>}
                <button
                  type="button"
                  className="english-comprehension-btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Grading…' : 'Submit All Answers'}
                </button>
                <button
                  type="button"
                  className="english-comprehension-btn-secondary"
                  onClick={() => {
                    setComprehension(null);
                    setAnswers({});
                    setSummaryAnswer('');
                    setSubmitted(false);
                    setGradingResult(null);
                    setSummaryResult(null);
                    setActiveTab('questions');
                  }}
                  disabled={loading}
                >
                  New Practice
                </button>
              </section>
            )}

            {submitted && gradingResult && (
              <section className="english-comprehension-result">
                <div className="english-comprehension-result-card">
                  <h2>Practice Complete!</h2>
                  <div className="english-comprehension-score-circle">
                    <span className="english-comprehension-score-value">{percentage}%</span>
                    <span className="english-comprehension-score-label">Total Score</span>
                  </div>
                  <p className="english-comprehension-overall-feedback">{gradingResult.overall_feedback}</p>
                  <button
                    type="button"
                    className="english-comprehension-btn-primary"
                    onClick={() => {
                      setComprehension(null);
                      setAnswers({});
                      setSummaryAnswer('');
                      setSubmitted(false);
                      setGradingResult(null);
                      setSummaryResult(null);
                      setActiveTab('questions');
                    }}
                  >
                    New Practice
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <AILoadingOverlay
        isVisible={isGenerating}
        title="Generating Question"
        subtitle="Creating your practice question"
        accentColor="#667eea"
        variant="fullscreen"
      />
    </div>
  );
}
