import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { ArrowLeft, BookOpen, MessageSquare, ClipboardList, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// 11 topics from ZIMSEC O-Level Principles of Commerce syllabus
const COMMERCE_TOPICS_FALLBACK: Topic[] = [
  { id: 'production', name: 'Production', subject: 'commerce' },
  { id: 'trade', name: 'Trade', subject: 'commerce' },
  { id: 'consumer_protection', name: 'Consumer Protection', subject: 'commerce' },
  { id: 'business_organisations', name: 'Business Organisations', subject: 'commerce' },
  { id: 'enterprise', name: 'Enterprise', subject: 'commerce' },
  { id: 'finance_and_banking', name: 'Finance and Banking', subject: 'commerce' },
  { id: 'insurance_and_assurance', name: 'Insurance and Assurance', subject: 'commerce' },
  { id: 'business_communication', name: 'Business Communication', subject: 'commerce' },
  { id: 'transport', name: 'Transport', subject: 'commerce' },
  { id: 'warehousing', name: 'Warehousing', subject: 'commerce' },
  { id: 'marketing', name: 'Marketing', subject: 'commerce' },
];

const SUBJECT = {
  id: 'commerce',
  name: 'Commerce',
  color: '#B8860B',
};

type QuestionFormat = 'mcq' | 'essay';

export function CommerceTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
  const [questionFormat, setQuestionFormat] = useState<QuestionFormat>('mcq');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('commerce');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(COMMERCE_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(COMMERCE_TOPICS_FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayTopics = topics.length ? topics : COMMERCE_TOPICS_FALLBACK;

  const openStartQuiz = (topic: Topic | null) => {
    setPendingTopic(topic);
    setQuestionFormat('mcq');
    setError(null);
    setStartQuizModalOpen(true);
  };

  const creditCost = calculateQuizCreditCost({
    subject: 'commerce',
    questionType: 'topical',
    questionFormat,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: 'commerce',
    questionType: 'topical',
    questionFormat,
  });
  const userCredits = user?.credits ?? 0;
  const hasEnoughCredits = userCredits >= minCredits;

  const handleStartQuiz = async () => {
    if (!hasEnoughCredits) {
      setError(`You need at least ${formatCreditCost(minCredits)} to start. Please top up credits.`);
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const useTopic = pendingTopic;
      const topicParam = useTopic?.name ?? useTopic?.id ?? undefined;
      const question = await quizApi.generateQuestion(
        'commerce',
        topicParam,
        'medium',
        'topical',
        undefined,
        undefined,
        questionFormat,
        undefined,
        undefined
      );

      if (!question) {
        setError('No question was generated. Please try again.');
        return;
      }

      const creditsRemaining = (question as { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) {
        updateUser({ credits: creditsRemaining });
      }

      setStartQuizModalOpen(false);
      setPendingTopic(null);
      navigate('/app/quiz', {
        state: {
          question,
          subject: { id: 'commerce', name: 'Commerce', color: SUBJECT.color },
          topic: useTopic ?? undefined,
          mixImagesEnabled: false,
          backTo: '/app/commerce',
          questionFormat,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate question';
      setError(typeof message === 'string' ? message : 'Failed to generate question. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="commerce-topics-page">
      <header className="commerce-topics-header">
        <Link to="/app" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="commerce-topics-title">Commerce</h1>
        <p className="commerce-topics-subtitle">ZIMSEC O Level – Business, Trade & Economics</p>
      </header>

      <section className="commerce-features-section">
        <button
          type="button"
          className="commerce-feature-card commerce-feature-notes"
          onClick={() => navigate('/app/commerce/notes')}
        >
          <div className="commerce-feature-icon commerce-feature-icon-notes">
            <BookOpen size={28} />
          </div>
          <div className="commerce-feature-content">
            <h3>Commerce Notes</h3>
            <p>Comprehensive notes for all topics</p>
          </div>
          <span className="commerce-feature-arrow">→</span>
        </button>

        <button
          type="button"
          className="commerce-feature-card"
          onClick={() => navigate('/app/teacher', { state: { subject: 'Commerce', gradeLevel: 'Form 3-4 (O-Level)' } })}
        >
          <div className="commerce-feature-icon">
            <MessageSquare size={28} />
          </div>
          <div className="commerce-feature-content">
            <h3>AI Tutor</h3>
            <p>Interactive tutoring for Commerce topics</p>
          </div>
          <span className="commerce-feature-arrow">→</span>
        </button>

        <button type="button" className="commerce-feature-card commerce-feature-labs" onClick={() => {}} disabled>
          <div className="commerce-feature-icon commerce-feature-icon-labs">
            <TrendingUp size={28} />
          </div>
          <div className="commerce-feature-content">
            <h3>Virtual Labs</h3>
            <p>Coming soon – interactive business simulations</p>
          </div>
          <span className="commerce-feature-arrow">→</span>
        </button>
      </section>

      <section className="commerce-exam-section">
        <button
          type="button"
          className="commerce-exam-card"
          onClick={() =>
            navigate('/app/exam/setup', {
              state: { subject: 'commerce', backTo: '/app/commerce', subjectLabel: 'Commerce' },
            })
          }
        >
          <div className="commerce-exam-icon">
            <ClipboardList size={32} />
          </div>
          <div className="commerce-exam-content">
            <h3>Start Exam</h3>
            <p>Timed exam with mixed questions from all topics</p>
          </div>
          <span className="commerce-feature-arrow">→</span>
        </button>
      </section>

      <section className="commerce-topics-section">
        <h2 className="commerce-section-title">Topical Questions</h2>
        <p className="commerce-section-subtitle">Choose a topic, then Paper 1 (MCQ) or Paper 2 (Essay)</p>
        {loading ? (
          <div className="commerce-loading">Loading topics…</div>
        ) : (
          <div className="commerce-topics-grid">
            {displayTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="commerce-topic-card"
                onClick={() => openStartQuiz(topic)}
              >
                <span className="commerce-topic-name">{topic.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {startQuizModalOpen && (
        <div className="commerce-modal-overlay" onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="commerce-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="commerce-modal-title">
              {pendingTopic ? pendingTopic.name : 'Commerce Quiz'}
            </h3>
            <p className="commerce-modal-subtitle">Choose Paper 1 (MCQ) or Paper 2 (Essay)</p>
            <div className="commerce-modal-options commerce-modal-options-format">
              <button
                type="button"
                className={`commerce-modal-option ${questionFormat === 'mcq' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('mcq')}
              >
                Paper 1 (MCQ)
              </button>
              <button
                type="button"
                className={`commerce-modal-option ${questionFormat === 'essay' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('essay')}
              >
                Paper 2 (Essay)
              </button>
            </div>
            <p className="commerce-modal-cost">
              Cost: {formatCreditCost(creditCost)} per question
            </p>
            {error && <p className="commerce-modal-error">{error}</p>}
            <div className="commerce-modal-actions">
              <button
                type="button"
                className="commerce-modal-cancel"
                onClick={() => !generating && setStartQuizModalOpen(false)}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="commerce-modal-start"
                onClick={handleStartQuiz}
                disabled={generating || !hasEnoughCredits}
              >
                {generating ? 'Generating…' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
