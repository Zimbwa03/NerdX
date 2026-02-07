/**
 * CommerceTopicsPage - Premium Desktop Design
 * Features gradient cards, glassmorphism, and advanced desktop layout
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { ArrowLeft, BookOpen, MessageSquare, ClipboardList, TrendingUp, GraduationCap } from 'lucide-react';
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
    <div className="subject-page-v2">
      {/* Header */}
      <header className="subject-header-v2">
        <Link to="/app" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #B8860B, #8B6914)' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <h1>Commerce</h1>
            <p>ZIMSEC O Level – Business, Trade & Economics</p>
          </div>
        </div>
      </header>

      {/* Main content grid - desktop optimized */}
      <div className="subject-content-grid">
        {/* Left column - Features */}
        <div className="subject-features-col">
          {/* Commerce Features */}
          <section className="subject-section-v2">
            <h2>Commerce Skills</h2>
            <div className="feature-cards-v2">
              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/commerce/notes')}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
                  <BookOpen size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Commerce Notes</h3>
                  <p>Comprehensive notes for all topics</p>
                </div>
                <span className="feature-arrow">→</span>
              </button>

              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/teacher', { state: { subject: 'Commerce', gradeLevel: 'Form 3-4 (O-Level)' } })}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #7C4DFF, #651FFF)' }}>
                  <MessageSquare size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>AI Tutor</h3>
                  <p>Interactive tutoring for Commerce topics</p>
                </div>
                <span className="feature-arrow">→</span>
              </button>

              <button type="button" className="feature-card-v2" onClick={() => { }} disabled>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #FF6D00, #DD2C00)', opacity: 0.5 }}>
                  <TrendingUp size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Virtual Labs</h3>
                  <p>Coming soon – interactive business simulations</p>
                </div>
                <span className="feature-arrow">→</span>
              </button>
            </div>
          </section>

          {/* Exam Mode */}
          <section className="subject-section-v2">
            <h2>Exam Practice</h2>
            <button
              type="button"
              className="exam-card-v2"
              onClick={() =>
                navigate('/app/exam/setup', {
                  state: { subject: 'commerce', backTo: '/app/commerce', subjectLabel: 'Commerce' },
                })
              }
            >
              <div className="exam-card-icon" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
                <ClipboardList size={28} />
              </div>
              <div className="exam-card-text">
                <h3>Start Exam</h3>
                <p>Timed exam with mixed questions from all topics</p>
              </div>
              <span className="feature-arrow">→</span>
            </button>
          </section>
        </div>

        {/* Right column - Topics Grid */}
        <div className="subject-topics-col">
          <section className="subject-section-v2">
            <h2>Topical Questions</h2>
            <p className="section-subtitle">Choose a topic, then Paper 1 (MCQ) or Paper 2 (Essay)</p>
            {loading ? (
              <div className="loading-state">Loading topics…</div>
            ) : (
              <div className="topics-grid-v2">
                {displayTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className="topic-card-v2"
                    onClick={() => openStartQuiz(topic)}
                  >
                    <div className="topic-card-icon" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
                      <GraduationCap size={18} />
                    </div>
                    <span className="topic-card-name">{topic.name}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Start Quiz Modal */}
      {startQuizModalOpen && (
        <div className="modal-overlay-v2" onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="modal-v2" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              {pendingTopic ? pendingTopic.name : 'Commerce Quiz'}
            </h3>
            <p className="modal-subtitle">Choose Paper 1 (MCQ) or Paper 2 (Essay)</p>
            <div className="modal-options">
              <button
                type="button"
                className={`modal-option ${questionFormat === 'mcq' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('mcq')}
              >
                Paper 1 (MCQ)
              </button>
              <button
                type="button"
                className={`modal-option ${questionFormat === 'essay' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('essay')}
              >
                Paper 2 (Essay)
              </button>
            </div>
            <p className="modal-cost">
              Cost: {formatCreditCost(creditCost)} per question
            </p>
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel"
                onClick={() => !generating && setStartQuizModalOpen(false)}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-start"
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
