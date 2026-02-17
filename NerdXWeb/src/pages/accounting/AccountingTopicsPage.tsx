/**
 * AccountingTopicsPage - Topical Questions (Paper 1 + Paper 2)
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList, GraduationCap, MessageSquare, TrendingUp } from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { quizApi, type Topic } from '../../services/api/quizApi';
import { useAuth } from '../../context/AuthContext';
import { accountingTopics } from '../../data/accounting/topics';
import { calculateQuizCreditCost, formatCreditCost, getMinimumCreditsForQuiz } from '../../utils/creditCalculator';

const ACCOUNTING_TOPICS_FALLBACK: Topic[] = accountingTopics.map((t) => ({
  id: t.id,
  name: t.name,
  subject: 'accounting',
}));

const SUBJECT = {
  id: 'accounting',
  name: 'Accounting',
  color: '#B8860B',
};

type QuestionFormat = 'mcq' | 'essay';

export function AccountingTopicsPage() {
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
        const data = await quizApi.getTopics('accounting');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(ACCOUNTING_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(ACCOUNTING_TOPICS_FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayTopics = topics.length ? topics : ACCOUNTING_TOPICS_FALLBACK;

  const openStartQuiz = (topic: Topic | null) => {
    setPendingTopic(topic);
    setQuestionFormat('mcq');
    setError(null);
    setStartQuizModalOpen(true);
  };

  const creditCost = calculateQuizCreditCost({
    subject: 'accounting',
    questionType: 'topical',
    questionFormat,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: 'accounting',
    questionType: 'topical',
    questionFormat,
  });
  const userCredits = user?.credits ?? 0;
  const hasEnoughCredits = userCredits >= minCredits;

  const topicSubtitle = useMemo(() => {
    if (!pendingTopic) return 'Choose Paper 1 (MCQ) or Paper 2 (Structured)';
    return `Topic: ${pendingTopic.name} â€¢ Choose Paper 1 (MCQ) or Paper 2 (Structured)`;
  }, [pendingTopic]);

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
        'accounting',
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
          subject: { id: SUBJECT.id, name: SUBJECT.name, color: SUBJECT.color },
          topic: useTopic ?? undefined,
          mixImagesEnabled: false,
          backTo: '/app/accounting',
          questionFormat,
        },
      });
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
      const message = err instanceof Error ? err.message : 'Failed to generate question';
      setError(typeof message === 'string' ? message : 'Failed to generate question. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="subject-page-v2">
      <header className="subject-header-v2">
        <Link to="/app/accounting" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
            <ClipboardList size={28} />
          </div>
          <div>
            <h1>Accounting Topical Questions</h1>
            <p>Paper 1 (MCQ) â€¢ Paper 2 (Structured)</p>
          </div>
        </div>
      </header>

      <div className="subject-content-grid">
        <div className="subject-features-col">
          <section className="subject-section-v2">
            <h2>Practice Modes</h2>
            <div className="feature-cards-v2">
              <button type="button" className="feature-card-v2" onClick={() => openStartQuiz(null)}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
                  <ClipboardList size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Start Random Topical</h3>
                  <p>Generate a topical question (choose Paper 1 or 2)</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>

              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/teacher', { state: { subject: 'Principles of Accounting', gradeLevel: 'Form 3-4 (O-Level)' } })}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #7C4DFF, #651FFF)' }}>
                  <MessageSquare size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>AI Tutor</h3>
                  <p>Ask questions and get feedback</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>

              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/exam/setup', { state: { subject: 'accounting', backTo: '/app/accounting', subjectLabel: 'Accounting' } })}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #14B8A6, #0D9488)' }}>
                  <TrendingUp size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Exam Practice</h3>
                  <p>Timed mixed questions across topics</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>
            </div>
          </section>
        </div>

        <div className="subject-topics-col">
          <section className="subject-section-v2">
            <h2>Topics</h2>
            <p className="section-subtitle">Choose a topic, then Paper 1 (MCQ) or Paper 2 (Structured)</p>
            {loading ? (
              <div className="loading-state">Loading topicsâ€¦</div>
            ) : (
              <div className="topics-grid-v2">
                {displayTopics.map((topic) => (
                  <button key={topic.id} type="button" className="topic-card-v2" onClick={() => openStartQuiz(topic)}>
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

      {startQuizModalOpen && (
        <div className="modal-overlay-v2" onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="modal-v2" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{pendingTopic ? pendingTopic.name : 'Accounting Quiz'}</h3>
            <p className="modal-subtitle">{topicSubtitle}</p>
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
                Paper 2 (Structured)
              </button>
            </div>
            <p className="modal-cost">Cost: {formatCreditCost(creditCost)} per question</p>
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-actions">
              <button type="button" className="modal-cancel" onClick={() => !generating && setStartQuizModalOpen(false)} disabled={generating}>
                Cancel
              </button>
              <button type="button" className="modal-start" onClick={handleStartQuiz} disabled={generating || !hasEnoughCredits}>
                {generating ? 'Generatingâ€¦' : 'Start'}
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

