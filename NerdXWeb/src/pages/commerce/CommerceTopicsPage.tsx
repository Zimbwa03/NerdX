import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  Play,
  FileText,
  Store,
  Factory,
  ShieldCheck,
  Building2,
  Lightbulb,
  Landmark,
  Umbrella,
  MessagesSquare,
  Truck,
  Warehouse,
  Megaphone,
  type LucideIcon,
} from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { commerceTopics } from '../../data/oLevelCommerce';
import '../sciences/ScienceUniverse.css';

const SUBJECT = {
  id: 'commerce',
  name: 'O Level Commerce',
  color: '#B8860B',
};

type QuestionFormat = 'mcq' | 'essay';

const COMMERCE_TOPIC_ICONS: Record<string, LucideIcon> = {
  production: Factory,
  trade: Store,
  consumer_protection: ShieldCheck,
  business_organisations: Building2,
  enterprise: Lightbulb,
  finance_and_banking: Landmark,
  insurance_and_assurance: Umbrella,
  business_communication: MessagesSquare,
  transport: Truck,
  warehousing: Warehouse,
  marketing: Megaphone,
};

export function CommerceTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
  const [questionFormat, setQuestionFormat] = useState<QuestionFormat>('mcq');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayTopics = commerceTopics.map((topic) => ({
    id: topic.id,
    name: topic.name,
    subject: 'commerce',
  } as Topic));
  const notesTopics = commerceTopics.filter((topic) => topic.hasNotes);

  const openStartQuiz = (topic: Topic) => {
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
    setStartQuizModalOpen(false);
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
        undefined,
      );

      if (!question) {
        setError('No question was generated. Please try again.');
        setStartQuizModalOpen(true);
        return;
      }

      const creditsRemaining = (question as { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) {
        updateUser({ credits: creditsRemaining });
      }

      setPendingTopic(null);
      navigate('/app/quiz', {
        state: {
          question,
          subject: { id: 'commerce', name: 'O Level Commerce', color: SUBJECT.color },
          topic: useTopic ?? undefined,
          mixImagesEnabled: false,
          backTo: '/app/commerce',
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
      setStartQuizModalOpen(true);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="science-universe-page com">
      <div className="science-universe-bg com-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Dashboard</span>
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge" style={{ background: 'rgba(184, 134, 11, 0.18)', border: '1px solid rgba(184, 134, 11, 0.35)' }}>
          <Store size={14} />
          <span>O-LEVEL COMMERCE</span>
        </div>
        <h1 className="science-hero-title" style={{ background: 'linear-gradient(135deg, #B8860B, #DAA520, #F6C453)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master Business<br />and Trade Concepts
        </h1>
        <p style={{ maxWidth: 700, margin: '0 auto', opacity: 0.8 }}>
          Full O-Level Commerce coverage with topic practice, notes, exam prep, and AI support.
        </p>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div
            className="science-feature-card"
            onClick={() => navigate('/app/teacher', { state: { subject: 'Commerce', gradeLevel: 'Form 3-4 (O-Level)' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(124, 77, 255, 0.15)' }}>
              <MessageSquare size={28} color="#B388FF" />
            </div>
            <h3 className="feature-card-title">AI Commerce Tutor</h3>
            <p className="feature-card-desc">Ask Commerce questions and get syllabus-aligned explanations instantly.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/commerce/notes')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(184, 134, 11, 0.18)' }}>
              <BookOpen size={28} color="#EEC66B" />
            </div>
            <h3 className="feature-card-title">Study Notes</h3>
            <p className="feature-card-desc">Read complete notes, key points, exam tips, and flashcards for each topic.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/virtual-lab?subject=commerce')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(0, 188, 212, 0.18)' }}>
              <Warehouse size={28} color="#4DD0E1" />
            </div>
            <h3 className="feature-card-title">Virtual Lab</h3>
            <p className="feature-card-desc">Interactive practice labs for practical business and commerce scenarios.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'commerce', backTo: '/app/commerce', subjectLabel: 'Commerce' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(184, 134, 11, 0.18)' }}>
              <FileText size={28} color="#EEC66B" />
            </div>
            <h3 className="feature-card-title">Simulated Exam</h3>
            <p className="feature-card-desc">Practice timed exam conditions for Paper 1 MCQ and Paper 2 Essay formats.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Play size={24} style={{ color: '#EEC66B' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Practice Topics</span>
            <span className="topics-count-badge" style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
              {displayTopics.length} Topics
            </span>
          </div>

          <p style={{ marginBottom: 20, opacity: 0.72 }}>
            Choose a topic to generate ZIMSEC-aligned <strong>MCQ or Essay</strong> practice questions.
          </p>

          {!hasEnoughCredits && (
            <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, marginBottom: 20, color: '#FCA5A5', fontSize: 14 }}>
              You need at least {formatCreditCost(minCredits)} to generate a question.
            </div>
          )}

          <div className="science-topics-grid">
            {displayTopics.map((topic) => {
              const TopicIcon = COMMERCE_TOPIC_ICONS[topic.id] ?? Store;
              return (
                <div
                  key={topic.id}
                  className="science-topic-card"
                  onClick={() => openStartQuiz(topic)}
                >
                  <div className="topic-icon-small">
                    <TopicIcon size={20} />
                  </div>
                  <span className="topic-card-name">{topic.name}</span>
                </div>
              );
            })}
          </div>

          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 60, marginBottom: 24 }}>
            <BookOpen size={24} style={{ color: '#EEC66B' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes</span>
          </div>

          <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {notesTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/app/commerce/notes/${topic.id}`}
                style={{
                  display: 'inline-block',
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50px',
                  color: '#fff',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                {topic.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {startQuizModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="modal-content" style={{
            background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)',
            width: '90%', maxWidth: '460px', borderRadius: 24, padding: 32,
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>
              {pendingTopic ? pendingTopic.name : 'Commerce Quiz'}
            </h3>
            <p style={{ opacity: 0.72, marginTop: 0, marginBottom: 20 }}>Choose question type</p>
            <div className="format-options" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: questionFormat === 'mcq' ? '1px solid #EEC66B' : '1px solid rgba(255,255,255,0.15)',
                  background: questionFormat === 'mcq' ? 'rgba(238, 198, 107, 0.18)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
                onClick={() => setQuestionFormat('mcq')}
              >
                MCQ
              </button>
              <button
                type="button"
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: questionFormat === 'essay' ? '1px solid #EEC66B' : '1px solid rgba(255,255,255,0.15)',
                  background: questionFormat === 'essay' ? 'rgba(238, 198, 107, 0.18)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
                onClick={() => setQuestionFormat('essay')}
              >
                Essay
              </button>
            </div>
            <p style={{ marginTop: 16, marginBottom: 8, opacity: 0.85 }}>
              Cost: {formatCreditCost(creditCost)} per question
            </p>
            {error && <p style={{ color: '#FCA5A5', marginTop: 0 }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button
                type="button"
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                }}
                onClick={() => !generating && setStartQuizModalOpen(false)}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                  color: '#fff',
                  cursor: 'pointer',
                  opacity: generating || !hasEnoughCredits ? 0.6 : 1,
                }}
                onClick={handleStartQuiz}
                disabled={generating || !hasEnoughCredits}
              >
                {generating ? 'Generating...' : 'Start Practice'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AILoadingOverlay
        isVisible={generating}
        title="Generating Question"
        subtitle="Creating your Commerce practice question"
        accentColor={SUBJECT.color}
        variant="fullscreen"
      />
    </div>
  );
}
