import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quizApi, type Topic, type Question } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import {
  ArrowLeft, BookOpen, MessageCircle, Play, Monitor, Info, X, FileText,
  Cpu, HardDrive, Globe, Binary, Network, ShieldCheck, Settings,
  GitBranch, Code, Database, Layout, Zap,
  type LucideIcon,
} from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { computerScienceTopicNames } from '../../data/computerScienceNotes/notes';
import '../sciences/ScienceUniverse.css';

const SUBJECT = {
  id: 'computer_science',
  name: 'O Level Computer Science',
  color: '#0288D1',
};

type Board = 'zimsec' | 'cambridge';
type QuestionFormat = 'mcq' | 'structured' | 'essay';

const CS_TOPIC_ICONS: Record<string, LucideIcon> = {
  hardware_and_software: HardDrive,
  application_of_computer_science: Globe,
  data_representation: Binary,
  communication_networks_and_internet_technologies: Network,
  security_and_ethics: ShieldCheck,
  systems_analysis_and_design: Settings,
  'algorithm_design_and_problem-solving': GitBranch,
  programming: Code,
  databases: Database,
  web_design_and_internet_uses: Layout,
  automated_and_emerging_technologies: Zap,
};

function getCSTopicIcon(topicId: string): LucideIcon {
  return CS_TOPIC_ICONS[topicId] ?? Monitor;
}

const CS_TOPICS_FALLBACK: Topic[] = [
  { id: 'hardware_and_software', name: 'Hardware and Software', subject: 'computer_science' },
  { id: 'application_of_computer_science', name: 'Application of Computer Science', subject: 'computer_science' },
  { id: 'data_representation', name: 'Data Representation', subject: 'computer_science' },
  { id: 'communication_networks_and_internet_technologies', name: 'Communication Networks and Internet Technologies', subject: 'computer_science' },
  { id: 'security_and_ethics', name: 'Security and Ethics', subject: 'computer_science' },
  { id: 'systems_analysis_and_design', name: 'Systems Analysis and Design', subject: 'computer_science' },
  { id: 'algorithm_design_and_problem-solving', name: 'Algorithm Design and Problem-Solving', subject: 'computer_science' },
  { id: 'programming', name: 'Programming', subject: 'computer_science' },
  { id: 'databases', name: 'Databases', subject: 'computer_science' },
  { id: 'web_design_and_internet_uses', name: 'Web Design and Internet Uses', subject: 'computer_science' },
  { id: 'automated_and_emerging_technologies', name: 'Automated and Emerging Technologies', subject: 'computer_science' },
];

export function ComputerScienceTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [board, setBoard] = useState<Board>('zimsec');

  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
  const [questionFormat, setQuestionFormat] = useState<QuestionFormat>('mcq');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayTopics = CS_TOPICS_FALLBACK;

  const openStartQuiz = (topic: Topic) => {
    setPendingTopic(topic);
    setQuestionFormat('mcq');
    setError(null);
    setStartQuizModalOpen(true);
  };

  const creditCost = calculateQuizCreditCost({
    subject: 'computer_science',
    questionType: 'topical',
    questionFormat,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: 'computer_science',
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
      const question: Question | null = await quizApi.generateQuestion(
        'computer_science',
        useTopic?.id,
        'medium',
        'topical',
        undefined,
        undefined,
        questionFormat,
        undefined,
        undefined,
        board,
      );

      if (!question) {
        setError('No question was generated. Please try again.');
        setGenerating(false);
        return;
      }

      const creditsRemaining = (question as Question & { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) {
        updateUser({ credits: creditsRemaining });
      }

      const topicToPass = useTopic;
      setPendingTopic(null);
      navigate('/app/quiz', {
        state: {
          question,
          subject: { id: 'computer_science', name: 'Computer Science', color: SUBJECT.color },
          topic: topicToPass ?? undefined,
          mixImagesEnabled: false,
          backTo: '/app/computer-science',
          board,
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
    <div className="science-universe-page cs">
      <div className="science-universe-bg cs-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Dashboard</span>
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge" style={{ background: 'rgba(2, 136, 209, 0.15)', border: '1px solid rgba(2, 136, 209, 0.3)' }}>
          <Monitor size={14} />
          <span>O-LEVEL COMPUTER SCIENCE</span>
        </div>
        <h1 className="science-hero-title" style={{ background: 'linear-gradient(135deg, #0288D1, #03A9F4, #4FC3F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master Computer<br />Science
        </h1>
        <p style={{ maxWidth: 600, margin: '0 auto', opacity: 0.8 }}>
          AI-powered tutoring, comprehensive notes, and exam-grade practice for all {computerScienceTopicNames.length} topics.
        </p>

        {/* Board toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setBoard('zimsec')}
            style={{
              padding: '10px 22px',
              borderRadius: 50,
              border: `2px solid ${board === 'zimsec' ? '#0288D1' : 'rgba(255,255,255,0.15)'}`,
              background: board === 'zimsec' ? 'rgba(2, 136, 209, 0.25)' : 'rgba(255,255,255,0.05)',
              color: board === 'zimsec' ? '#4FC3F7' : 'rgba(255,255,255,0.7)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(8px)',
            }}
          >
            ZimSec
          </button>
          <button
            type="button"
            onClick={() => setBoard('cambridge')}
            style={{
              padding: '10px 22px',
              borderRadius: 50,
              border: `2px solid ${board === 'cambridge' ? '#0288D1' : 'rgba(255,255,255,0.15)'}`,
              background: board === 'cambridge' ? 'rgba(2, 136, 209, 0.25)' : 'rgba(255,255,255,0.05)',
              color: board === 'cambridge' ? '#4FC3F7' : 'rgba(255,255,255,0.7)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(8px)',
            }}
          >
            Cambridge
          </button>
        </div>
      </div>

      <div className="science-content-grid">
        {/* Feature cards column */}
        <div className="science-features-col">
          <div
            className="science-feature-card"
            onClick={() => navigate('/app/computer-science/notes')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(2, 136, 209, 0.15)' }}>
              <BookOpen size={28} color="#4FC3F7" />
            </div>
            <h3 className="feature-card-title">Computer Science Notes</h3>
            <p className="feature-card-desc">Comprehensive notes for all 11 topics, aligned with O-Level syllabus.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/teacher', { state: { subject: 'Computer Science', gradeLevel: 'Form 3-4 (O-Level)' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(0, 230, 118, 0.15)' }}>
              <MessageCircle size={28} color="#00E676" />
            </div>
            <h3 className="feature-card-title">AI CS Tutor</h3>
            <p className="feature-card-desc">Interactive tutoring. Ask any Computer Science question and get instant guidance.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/virtual-lab?subject=computer_science')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(255, 145, 0, 0.15)' }}>
              <Cpu size={28} color="#FF9100" />
            </div>
            <h3 className="feature-card-title">Virtual Labs</h3>
            <p className="feature-card-desc">Interactive programming, web design, and database simulations.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'computer_science', backTo: '/app/computer-science', subjectLabel: 'Computer Science' } })}
          >
            <div className="feature-icon-box" style={{ background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.3), rgba(101, 31, 255, 0.3))' }}>
              <FileText size={28} color="#B388FF" />
            </div>
            <h3 className="feature-card-title">Simulated Exam</h3>
            <p className="feature-card-desc">Full timed exam conditions with mixed questions from all topics.</p>
          </div>
        </div>

        {/* Topics grid column */}
        <div className="science-topics-col">
          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Play size={24} style={{ color: '#4FC3F7' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Practice Topics</span>
            <span className="topics-count-badge" style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
              {displayTopics.length} Topics
            </span>
          </div>

          <p style={{ marginBottom: 20, opacity: 0.7 }}>
            Select a topic to practice <strong>{board === 'cambridge' ? 'Cambridge' : 'ZIMSEC'}-aligned questions</strong>. Choose MCQ, Structured, or Essay format.
          </p>

          {!hasEnoughCredits && (
            <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, marginBottom: 20, color: '#FCA5A5', fontSize: 14 }}>
              You need at least {formatCreditCost(minCredits)} to generate a question.
            </div>
          )}

          <div className="science-topics-grid">
            {displayTopics.map((topic) => {
              const TopicIcon = getCSTopicIcon(topic.id);
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

          {/* Study Notes chips */}
          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 60, marginBottom: 24 }}>
            <BookOpen size={24} style={{ color: '#4FC3F7' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes</span>
          </div>

          <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {computerScienceTopicNames.map((name) => (
              <Link
                key={name}
                to={`/app/computer-science/notes/${name.toLowerCase().replace(/ /g, '-')}`}
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
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Start Quiz Modal */}
      {startQuizModalOpen && pendingTopic && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="modal-content" style={{
            background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)',
            width: '90%', maxWidth: '450px', borderRadius: 24, padding: 32,
            position: 'relative',
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setStartQuizModalOpen(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 60, height: 60, background: 'rgba(2, 136, 209, 0.2)',
                borderRadius: 16, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#4FC3F7',
              }}>
                <Monitor size={32} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{pendingTopic.name}</h2>
              <p style={{ opacity: 0.7, marginTop: 8 }}>{board === 'cambridge' ? 'Cambridge' : 'ZIMSEC'} O-Level Computer Science</p>
            </div>

            {/* Question format selection */}
            <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 12, textAlign: 'center' }}>Choose question type</p>
            <div className="format-options" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {(['mcq', 'structured', 'essay'] as QuestionFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setQuestionFormat(fmt)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 12,
                    border: `2px solid ${questionFormat === fmt ? '#0288D1' : 'rgba(255,255,255,0.1)'}`,
                    background: questionFormat === fmt ? 'rgba(2, 136, 209, 0.2)' : 'rgba(255,255,255,0.05)',
                    color: questionFormat === fmt ? '#4FC3F7' : 'rgba(255,255,255,0.7)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize',
                  }}
                >
                  {fmt === 'mcq' ? 'MCQ' : fmt}
                </button>
              ))}
            </div>

            {error && (
              <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 12, marginBottom: 20, color: '#FCA5A5', fontSize: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24, fontSize: 14, opacity: 0.8 }}>
              <Info size={16} />
              <span>Cost: <strong>{formatCreditCost(creditCost)} per question</strong></span>
            </div>

            <button
              onClick={handleStartQuiz}
              disabled={generating || !hasEnoughCredits}
              style={{
                width: '100%', padding: '16px', borderRadius: 16,
                background: 'linear-gradient(135deg, #01579B, #0288D1)',
                border: 'none', color: '#fff', fontSize: 16, fontWeight: 700,
                cursor: generating ? 'wait' : 'pointer',
                opacity: (generating || !hasEnoughCredits) ? 0.6 : 1,
              }}
            >
              {generating ? 'Generating...' : 'Start Practice'}
            </button>
          </div>
        </div>
      )}

      <AILoadingOverlay
        isVisible={generating}
        title="Generating Question"
        subtitle={`Creating a ${board === 'cambridge' ? 'Cambridge' : 'ZIMSEC'} Computer Science question on ${pendingTopic?.name ?? 'this topic'}...`}
        accentColor={SUBJECT.color}
        variant="fullscreen"
      />
    </div>
  );
}
