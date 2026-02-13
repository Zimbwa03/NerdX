import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { ArrowLeft, BookOpen, MessageSquare, ClipboardList, TrendingUp } from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { useAuth } from '../../context/AuthContext';

// 8 topics from ZIMSEC O-Level Business Enterprise and Skills 4048
const BES_TOPICS_FALLBACK: Topic[] = [
  { id: 'the_business_enterprise', name: 'The Business Enterprise', subject: 'business_enterprise_skills' },
  { id: 'the_enterprising_environment', name: 'The Enterprising Environment', subject: 'business_enterprise_skills' },
  { id: 'setting_up_a_new_enterprise', name: 'Setting Up a New Enterprise', subject: 'business_enterprise_skills' },
  { id: 'business_planning', name: 'Business Planning', subject: 'business_enterprise_skills' },
  { id: 'enterprise_finance_and_securing_investors', name: 'Enterprise Finance and Securing Investors', subject: 'business_enterprise_skills' },
  { id: 'people_in_business_enterprises', name: 'People in Business Enterprises', subject: 'business_enterprise_skills' },
  { id: 'markets_and_marketing', name: 'Markets and Marketing', subject: 'business_enterprise_skills' },
  { id: 'operations_management', name: 'Operations Management', subject: 'business_enterprise_skills' },
];

const SUBJECT = {
  id: 'business_enterprise_skills',
  name: 'Business Enterprise and Skills',
  color: '#2E7D32',
};

type QuestionFormat = 'mcq' | 'essay';

export function BESTopicsPage() {
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
        const data = await quizApi.getTopics('business_enterprise_skills');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(BES_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(BES_TOPICS_FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayTopics = topics.length ? topics : BES_TOPICS_FALLBACK;

  const openStartQuiz = (topic: Topic | null) => {
    setPendingTopic(topic);
    setQuestionFormat('mcq');
    setError(null);
    setStartQuizModalOpen(true);
  };

  const creditCost = calculateQuizCreditCost({
    subject: 'business_enterprise_skills',
    questionType: 'topical',
    questionFormat,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: 'business_enterprise_skills',
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
        'business_enterprise_skills',
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
          subject: { id: 'business_enterprise_skills', name: SUBJECT.name, color: SUBJECT.color },
          topic: useTopic ?? undefined,
          mixImagesEnabled: false,
          backTo: '/app/business-enterprise-skills',
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
    <div className="commerce-topics-page bes-topics-page">
      <header className="commerce-topics-header" style={{ borderLeftColor: SUBJECT.color }}>
        <Link to="/app" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="commerce-topics-title">Business Enterprise and Skills</h1>
        <p className="commerce-topics-subtitle">ZIMSEC O Level 4048 – Enterprise, Leadership & Skills</p>
      </header>

      <section className="commerce-features-section">
        <button
          type="button"
          className="commerce-feature-card commerce-feature-notes"
          onClick={() => navigate('/app/business-enterprise-skills/notes')}
          style={{ borderLeftColor: SUBJECT.color }}
        >
          <div className="commerce-feature-icon commerce-feature-icon-notes" style={{ backgroundColor: `${SUBJECT.color}20` }}>
            <BookOpen size={28} color={SUBJECT.color} />
          </div>
          <div className="commerce-feature-content">
            <h3>Business Enterprise Skills Notes</h3>
            <p>Comprehensive notes for all 8 topics</p>
          </div>
          <span className="commerce-feature-arrow">→</span>
        </button>

        <button
          type="button"
          className="commerce-feature-card"
          onClick={() => navigate('/app/teacher', { state: { subject: 'Business Enterprise and Skills', gradeLevel: 'Form 3-4 (O-Level)' } })}
          style={{ borderLeftColor: SUBJECT.color }}
        >
          <div className="commerce-feature-icon" style={{ backgroundColor: `${SUBJECT.color}20` }}>
            <MessageSquare size={28} color={SUBJECT.color} />
          </div>
          <div className="commerce-feature-content">
            <h3>AI Tutor</h3>
            <p>Interactive tutoring for Business Enterprise and Skills</p>
          </div>
          <span className="commerce-feature-arrow">→</span>
        </button>

        <button type="button" className="commerce-feature-card commerce-feature-labs" onClick={() => {}} disabled style={{ borderLeftColor: SUBJECT.color }}>
          <div className="commerce-feature-icon commerce-feature-icon-labs" style={{ backgroundColor: `${SUBJECT.color}20` }}>
            <TrendingUp size={28} color={SUBJECT.color} />
          </div>
          <div className="commerce-feature-content">
            <h3>Virtual Labs</h3>
            <p>Coming soon – interactive business enterprise simulations</p>
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
              state: { subject: 'business_enterprise_skills', backTo: '/app/business-enterprise-skills', subjectLabel: 'Business Enterprise and Skills' },
            })
          }
          style={{ borderLeftColor: SUBJECT.color }}
        >
          <div className="commerce-exam-icon" style={{ backgroundColor: `${SUBJECT.color}20` }}>
            <ClipboardList size={32} color={SUBJECT.color} />
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
                style={{ borderLeftColor: SUBJECT.color }}
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
              {pendingTopic ? pendingTopic.name : 'Business Enterprise and Skills Quiz'}
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
      <AILoadingOverlay
        isVisible={generating}
        title="Generating Question"
        subtitle="Creating your practice question"
        accentColor={SUBJECT.color}
        variant="fullscreen"
      />
    </div>
  );
}
