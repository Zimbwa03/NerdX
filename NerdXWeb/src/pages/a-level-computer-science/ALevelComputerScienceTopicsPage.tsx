import { useMemo, useState } from 'react';
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
  Cpu,
  Search,
  Code,
  Database,
  Network,
  Shield,
  GitBranch,
  type LucideIcon,
} from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { aLevelComputerScienceTopics, type ALevelComputerScienceTopic } from '../../data/aLevelComputerScience';
import '../sciences/ScienceUniverse.css';

type LevelFilter = 'Form 5' | 'Form 6';
type Board = 'zimsec' | 'cambridge';
type CSQuestionType = 'mcq' | 'structured' | 'essay';

const SUBJECT = {
  id: 'a_level_computer_science',
  name: 'A Level Computer Science',
  color: '#0D47A1',
};

const TOPIC_ICONS: Record<string, LucideIcon> = {
  data_representation_form5: Code,
  communication_and_internet_technologies: Network,
  hardware_and_software_form5: Cpu,
  logic_gates_boolean_algebra: GitBranch,
  systems_analysis_design_methodology: GitBranch,
  database_management_systems: Database,
  algorithm_design_programming_form5: Code,
  data_representation_form6: Code,
  hardware_and_software_form6: Cpu,
  algorithm_design_programming_form6: Code,
  software_development_lifecycle: GitBranch,
  systems_security_and_ethics: Shield,
  computer_architecture_and_organization: Cpu,
  data_communication_networking_form6: Network,
};

export function ALevelComputerScienceTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('Form 5');
  const [board, setBoard] = useState<Board>('zimsec');
  const [searchText, setSearchText] = useState('');
  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<ALevelComputerScienceTopic | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<CSQuestionType>('mcq');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredTopics = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return aLevelComputerScienceTopics.filter((topic) => {
      const levelMatch =
        selectedLevel === 'Form 5'
          ? topic.level === 'Form 5' || topic.level === 'Both'
          : topic.level === 'Form 6' || topic.level === 'Both';
      if (!levelMatch) return false;
      if (!q) return true;
      return (
        topic.name.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        topic.learningObjectives.some((obj) => obj.toLowerCase().includes(q))
      );
    });
  }, [searchText, selectedLevel]);

  const creditCost = calculateQuizCreditCost({
    subject: SUBJECT.id,
    questionType: 'topical',
    questionFormat: selectedQuestionType,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: SUBJECT.id,
    questionType: 'topical',
    questionFormat: selectedQuestionType,
  });
  const userCredits = user?.credits ?? 0;
  const hasEnoughCredits = userCredits >= minCredits;

  const openStartQuiz = (topic: ALevelComputerScienceTopic) => {
    setPendingTopic(topic);
    setSelectedQuestionType('mcq');
    setError(null);
    setStartQuizModalOpen(true);
  };

  const handleStartQuiz = async () => {
    if (!pendingTopic) return;
    if (!hasEnoughCredits) {
      setError(`You need at least ${formatCreditCost(minCredits)} to start. Please top up credits.`);
      return;
    }

    setGenerating(true);
    setStartQuizModalOpen(false);
    setError(null);

    try {
      const question = await quizApi.generateQuestion(
        SUBJECT.id,
        pendingTopic.id,
        'medium',
        'topical',
        undefined,
        undefined,
        selectedQuestionType,
        undefined,
        undefined,
        board,
      );

      if (!question) {
        setError('No question was generated. Please try again.');
        setStartQuizModalOpen(true);
        return;
      }

      const creditsRemaining = (question as { credits_remaining?: number }).credits_remaining;
      if (creditsRemaining !== undefined) {
        updateUser({ credits: creditsRemaining });
      }

      const topicToPass: Topic = {
        id: pendingTopic.id,
        name: pendingTopic.name,
        subject: SUBJECT.id,
      };

      setPendingTopic(null);
      navigate('/app/quiz', {
        state: {
          question,
          subject: { id: SUBJECT.id, name: SUBJECT.name, color: SUBJECT.color },
          topic: topicToPass,
          questionType: selectedQuestionType,
          board,
          backTo: '/app/a-level-computer-science',
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
    <div className="science-universe-page cs">
      <div className="science-universe-bg cs-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Dashboard</span>
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge" style={{ background: 'rgba(13, 71, 161, 0.15)', border: '1px solid rgba(13, 71, 161, 0.3)' }}>
          <Cpu size={14} />
          <span>A-LEVEL COMPUTER SCIENCE (6023)</span>
        </div>
        <h1 className="science-hero-title" style={{ background: 'linear-gradient(135deg, #0D47A1, #1976D2, #42A5F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master A-Level<br />Computer Science
        </h1>
        <p style={{ maxWidth: 650, margin: '0 auto', opacity: 0.8 }}>
          Form 5 and Form 6 coverage with MCQ, structured, and essay practice.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSelectedLevel('Form 5')}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border: selectedLevel === 'Form 5' ? '1px solid rgba(66,165,245,0.5)' : '1px solid rgba(255,255,255,0.12)',
              background: selectedLevel === 'Form 5' ? 'rgba(66,165,245,0.18)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Form 5
          </button>
          <button
            type="button"
            onClick={() => setSelectedLevel('Form 6')}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border: selectedLevel === 'Form 6' ? '1px solid rgba(66,165,245,0.5)' : '1px solid rgba(255,255,255,0.12)',
              background: selectedLevel === 'Form 6' ? 'rgba(66,165,245,0.18)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Form 6
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setBoard('zimsec')}
            style={{
              padding: '8px 16px',
              borderRadius: 50,
              border: `2px solid ${board === 'zimsec' ? '#42A5F5' : 'rgba(255,255,255,0.15)'}`,
              background: board === 'zimsec' ? 'rgba(66,165,245,0.2)' : 'rgba(255,255,255,0.05)',
              color: board === 'zimsec' ? '#90CAF9' : 'rgba(255,255,255,0.7)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ZIMSEC
          </button>
          <button
            type="button"
            onClick={() => setBoard('cambridge')}
            style={{
              padding: '8px 16px',
              borderRadius: 50,
              border: `2px solid ${board === 'cambridge' ? '#42A5F5' : 'rgba(255,255,255,0.15)'}`,
              background: board === 'cambridge' ? 'rgba(66,165,245,0.2)' : 'rgba(255,255,255,0.05)',
              color: board === 'cambridge' ? '#90CAF9' : 'rgba(255,255,255,0.7)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cambridge
          </button>
        </div>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div className="science-feature-card" onClick={() => navigate('/app/a-level-computer-science/notes')}>
            <div className="feature-icon-box" style={{ background: 'rgba(13, 71, 161, 0.16)' }}>
              <BookOpen size={28} color="#90CAF9" />
            </div>
            <h3 className="feature-card-title">Computer Science Notes</h3>
            <p className="feature-card-desc">Study notes and references across core computer science areas.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/teacher', { state: { subject: 'A Level Computer Science', gradeLevel: 'Form 5-6 (A-Level)' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(0, 230, 118, 0.15)' }}>
              <MessageSquare size={28} color="#00E676" />
            </div>
            <h3 className="feature-card-title">AI CS Tutor</h3>
            <p className="feature-card-desc">Interactive tutoring for theory, algorithms, and systems.</p>
          </div>

          <div className="science-feature-card" onClick={() => navigate('/app/virtual-lab?subject=computer_science')}>
            <div className="feature-icon-box" style={{ background: 'rgba(255, 145, 0, 0.15)' }}>
              <Cpu size={28} color="#FF9100" />
            </div>
            <h3 className="feature-card-title">Virtual Labs</h3>
            <p className="feature-card-desc">Hands-on programming and system simulations.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'a_level_computer_science', backTo: '/app/a-level-computer-science', subjectLabel: 'A Level Computer Science' } })}
          >
            <div className="feature-icon-box" style={{ background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.3), rgba(101, 31, 255, 0.3))' }}>
              <FileText size={28} color="#B388FF" />
            </div>
            <h3 className="feature-card-title">Simulated Exam</h3>
            <p className="feature-card-desc">Timed mixed practice across selected topics.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Play size={24} style={{ color: '#90CAF9' }} />
              <span style={{ fontSize: 24, fontWeight: 700 }}>{selectedLevel} Topics</span>
              <span className="topics-count-badge" style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
                {filteredTopics.length} topics
              </span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', flex: '1 1 220px', minWidth: 0 }}>
              <Search size={14} />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search topics..."
                style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', minWidth: 0, width: '100%' }}
              />
            </label>
          </div>

          <p style={{ marginBottom: 20, opacity: 0.72 }}>
            Choose a topic and select <strong>MCQ</strong>, <strong>Structured</strong>, or <strong>Essay</strong> generation.
          </p>

          {error && (
            <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, marginBottom: 20, color: '#FCA5A5', fontSize: 14 }}>
              {error}
            </div>
          )}

          {!hasEnoughCredits && (
            <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, marginBottom: 20, color: '#FCA5A5', fontSize: 14 }}>
              You need at least {formatCreditCost(minCredits)} to generate a question.
            </div>
          )}

          <div className="science-topics-grid">
            {filteredTopics.map((topic) => {
              const TopicIcon = TOPIC_ICONS[topic.id] ?? Cpu;
              return (
                <div key={topic.id} className="science-topic-card" onClick={() => openStartQuiz(topic)}>
                  <div className="topic-icon-small">
                    <TopicIcon size={20} />
                  </div>
                  <span className="topic-card-name">{topic.name}</span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(13,71,161,0.18)', color: '#90CAF9' }}>{topic.paperRelevance}</span>
                    {topic.practicalComponent ? (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(255,145,0,0.16)', color: '#FFCC80' }}>Practical</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {startQuizModalOpen && pendingTopic && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="modal-content" style={{
            background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)',
            width: '90%', maxWidth: '500px', borderRadius: 24, padding: 32,
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>{pendingTopic.name}</h3>
            <p style={{ opacity: 0.72, marginTop: 0, marginBottom: 20 }}>Choose question type</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
              {(['mcq', 'structured', 'essay'] as CSQuestionType[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: selectedQuestionType === fmt ? '1px solid #90CAF9' : '1px solid rgba(255,255,255,0.15)',
                    background: selectedQuestionType === fmt ? 'rgba(144, 202, 249, 0.18)' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    textTransform: 'capitalize',
                  }}
                  onClick={() => setSelectedQuestionType(fmt)}
                >
                  {fmt === 'mcq' ? 'MCQ' : fmt} ({formatCreditCost(calculateQuizCreditCost({ subject: SUBJECT.id, questionFormat: fmt }))})
                </button>
              ))}
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
                  background: 'linear-gradient(135deg, #0D47A1, #1976D2)',
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
        subtitle="Creating your A-Level Computer Science practice question"
        accentColor={SUBJECT.color}
        variant="fullscreen"
      />
    </div>
  );
}
