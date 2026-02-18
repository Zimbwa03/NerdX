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
  Briefcase,
  ClipboardList,
  Landmark,
  Users,
  Megaphone,
  TrendingUp,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { oLevelBESTopics } from '../../data/oLevelBES/topics';
import '../sciences/ScienceUniverse.css';

const SUBJECT = {
  id: 'business_enterprise_skills',
  name: 'Business Enterprise and Skills',
  color: '#2E7D32',
};

type QuestionFormat = 'mcq' | 'essay';

const BES_TOPIC_ICONS: Record<string, LucideIcon> = {
  the_business_enterprise: Briefcase,
  the_enterprising_environment: TrendingUp,
  setting_up_a_new_enterprise: Building2,
  business_planning: ClipboardList,
  enterprise_finance_and_securing_investors: Landmark,
  people_in_business_enterprises: Users,
  markets_and_marketing: Megaphone,
  operations_management: Briefcase,
};

export function BESTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
  const [questionFormat, setQuestionFormat] = useState<QuestionFormat>('mcq');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayTopics = oLevelBESTopics.map((topic) => ({
    id: topic.id,
    name: topic.name,
    subject: 'business_enterprise_skills',
  } as Topic));

  const notesTopics = oLevelBESTopics.filter((topic) => topic.hasNotes);

  const openStartQuiz = (topic: Topic) => {
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
    setStartQuizModalOpen(false);
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
          subject: { id: SUBJECT.id, name: SUBJECT.name, color: SUBJECT.color },
          topic: useTopic ?? undefined,
          mixImagesEnabled: false,
          backTo: '/app/business-enterprise-skills',
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
    <div className="science-universe-page bes">
      <div className="science-universe-bg bes-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Dashboard</span>
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge" style={{ background: 'rgba(46, 125, 50, 0.18)', border: '1px solid rgba(46, 125, 50, 0.35)' }}>
          <Briefcase size={14} />
          <span>O-LEVEL BUSINESS ENTERPRISE AND SKILLS</span>
        </div>
        <h1 className="science-hero-title" style={{ background: 'linear-gradient(135deg, #2E7D32, #43A047, #81C784)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master Enterprise<br />and Business Skills
        </h1>
        <p style={{ maxWidth: 700, margin: '0 auto', opacity: 0.8 }}>
          Full O-Level BES (4048) coverage with topic practice, notes, virtual labs, and exam prep.
        </p>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div
            className="science-feature-card"
            onClick={() => navigate('/app/teacher', { state: { subject: 'Business Enterprise and Skills', gradeLevel: 'Form 3-4 (O-Level)' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(124, 77, 255, 0.15)' }}>
              <MessageSquare size={28} color="#B388FF" />
            </div>
            <h3 className="feature-card-title">AI BES Tutor</h3>
            <p className="feature-card-desc">Ask BES questions and get syllabus-aligned guidance instantly.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/business-enterprise-skills/notes')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(46, 125, 50, 0.18)' }}>
              <BookOpen size={28} color="#81C784" />
            </div>
            <h3 className="feature-card-title">Study Notes</h3>
            <p className="feature-card-desc">Read complete notes, key points, exam tips, and flashcards for each topic.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/virtual-lab?subject=business_enterprise_skills')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(0, 188, 212, 0.18)' }}>
              <ClipboardList size={28} color="#4DD0E1" />
            </div>
            <h3 className="feature-card-title">BES Virtual Labs</h3>
            <p className="feature-card-desc">Interactive business planning and enterprise decision simulations.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'business_enterprise_skills', backTo: '/app/business-enterprise-skills', subjectLabel: 'Business Enterprise and Skills' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(46, 125, 50, 0.18)' }}>
              <FileText size={28} color="#81C784" />
            </div>
            <h3 className="feature-card-title">Simulated Exam</h3>
            <p className="feature-card-desc">Practice timed exam conditions for Paper 1 MCQ and Paper 2 Essay work.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Play size={24} style={{ color: '#81C784' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Practice Topics</span>
            <span className="topics-count-badge" style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
              {displayTopics.length} Topics
            </span>
          </div>

          <p style={{ marginBottom: 20, opacity: 0.72 }}>
            Choose a topic to generate ZIMSEC-aligned <strong>Paper 1 (MCQ)</strong> or <strong>Paper 2 (Essay)</strong> practice.
          </p>

          {!hasEnoughCredits && (
            <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, marginBottom: 20, color: '#FCA5A5', fontSize: 14 }}>
              You need at least {formatCreditCost(minCredits)} to generate a question.
            </div>
          )}

          <div className="science-topics-grid">
            {displayTopics.map((topic) => {
              const TopicIcon = BES_TOPIC_ICONS[topic.id] ?? Briefcase;
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
            <BookOpen size={24} style={{ color: '#81C784' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes</span>
          </div>

          <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {notesTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/app/business-enterprise-skills/notes/${topic.id}`}
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
              {pendingTopic ? pendingTopic.name : 'BES Quiz'}
            </h3>
            <p style={{ opacity: 0.72, marginTop: 0, marginBottom: 20 }}>Choose question type</p>
            <div className="format-options" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: questionFormat === 'mcq' ? '1px solid #81C784' : '1px solid rgba(255,255,255,0.15)',
                  background: questionFormat === 'mcq' ? 'rgba(129, 199, 132, 0.18)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
                onClick={() => setQuestionFormat('mcq')}
              >
                Paper 1 (MCQ)
              </button>
              <button
                type="button"
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: questionFormat === 'essay' ? '1px solid #81C784' : '1px solid rgba(255,255,255,0.15)',
                  background: questionFormat === 'essay' ? 'rgba(129, 199, 132, 0.18)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
                onClick={() => setQuestionFormat('essay')}
              >
                Paper 2 (Essay)
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
                  background: 'linear-gradient(135deg, #2E7D32, #43A047)',
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
        subtitle="Creating your BES practice question"
        accentColor={SUBJECT.color}
        variant="fullscreen"
      />
    </div>
  );
}
