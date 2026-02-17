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
  FlaskConical,
  Search,
  Circle,
  Beaker,
  Atom,
  Microscope,
  type LucideIcon,
} from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { aLevelChemistryTopics, type ALevelChemistryTopic } from '../../data/aLevelChemistry';
import '../sciences/ScienceUniverse.css';

type ChemistryLevel = 'AS Level' | 'A2 Level';
type ChemistryQuestionType = 'mcq' | 'structured';

const SUBJECT = {
  id: 'a_level_chemistry',
  name: 'A Level Chemistry',
  color: '#14B8A6',
};

const CATEGORY_ICONS: Record<ALevelChemistryTopic['category'], LucideIcon> = {
  'Physical Chemistry': Atom,
  'Inorganic Chemistry': Beaker,
  'Organic Chemistry': FlaskConical,
  Analysis: Microscope,
};

export function ALevelChemistryTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [selectedLevel, setSelectedLevel] = useState<ChemistryLevel>('AS Level');
  const [searchText, setSearchText] = useState('');
  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<ALevelChemistryTopic | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<ChemistryQuestionType>('mcq');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredTopics = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return aLevelChemistryTopics.filter((topic) => {
      if (topic.difficulty !== selectedLevel) return false;
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

  const openStartQuiz = (topic: ALevelChemistryTopic) => {
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
        'Chemistry',
        undefined,
        selectedQuestionType,
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
          backTo: '/app/a-level-chemistry',
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
    <div className="science-universe-page chem">
      <div className="science-universe-bg chem-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={24} />
      </Link>

      <div className="science-hero">
        <div
          className="science-hero-badge"
          style={{
            background: 'rgba(20, 184, 166, 0.16)',
            border: '1px solid rgba(20, 184, 166, 0.35)',
          }}
        >
          <FlaskConical size={14} />
          <span>A-LEVEL CHEMISTRY (6030)</span>
        </div>
        <h1
          className="science-hero-title"
          style={{
            background: 'linear-gradient(135deg, #14B8A6, #2DD4BF, #5EEAD4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Master A-Level
          <br />
          Chemistry
        </h1>
        <p style={{ maxWidth: 700, margin: '0 auto', opacity: 0.8 }}>
          Full AS and A2 coverage with MCQ and structured practice.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSelectedLevel('AS Level')}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border:
                selectedLevel === 'AS Level'
                  ? '1px solid rgba(20, 184, 166, 0.45)'
                  : '1px solid rgba(255,255,255,0.12)',
              background:
                selectedLevel === 'AS Level'
                  ? 'rgba(20, 184, 166, 0.18)'
                  : 'rgba(255,255,255,0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            AS Level
          </button>
          <button
            type="button"
            onClick={() => setSelectedLevel('A2 Level')}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border:
                selectedLevel === 'A2 Level'
                  ? '1px solid rgba(20, 184, 166, 0.45)'
                  : '1px solid rgba(255,255,255,0.12)',
              background:
                selectedLevel === 'A2 Level'
                  ? 'rgba(20, 184, 166, 0.18)'
                  : 'rgba(255,255,255,0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            A2 Level
          </button>
        </div>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div className="science-feature-card" onClick={() => navigate('/app/a-level-chemistry/notes')}>
            <div className="feature-icon-box" style={{ background: 'rgba(20, 184, 166, 0.18)' }}>
              <BookOpen size={28} color="#5EEAD4" />
            </div>
            <h3 className="feature-card-title">Chemistry Notes</h3>
            <p className="feature-card-desc">Comprehensive A-Level notes with equations and worked explanations.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() =>
              navigate('/app/teacher', {
                state: { subject: 'A Level Chemistry', gradeLevel: 'AS Level - A2 Level' },
              })
            }
          >
            <div className="feature-icon-box" style={{ background: 'rgba(124, 77, 255, 0.15)' }}>
              <MessageSquare size={28} color="#B388FF" />
            </div>
            <h3 className="feature-card-title">AI Chemistry Tutor</h3>
            <p className="feature-card-desc">Interactive tutoring aligned to A-Level chemistry objectives.</p>
          </div>

          <div className="science-feature-card" onClick={() => navigate('/app/virtual-lab?subject=chemistry')}>
            <div className="feature-icon-box" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
              <FlaskConical size={28} color="#FCD34D" />
            </div>
            <h3 className="feature-card-title">Virtual Labs</h3>
            <p className="feature-card-desc">Interactive chemistry experiments and simulations.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() =>
              navigate('/app/exam/setup', {
                state: {
                  subject: 'a_level_chemistry',
                  backTo: '/app/a-level-chemistry',
                  subjectLabel: 'A Level Chemistry',
                },
              })
            }
          >
            <div className="feature-icon-box" style={{ background: 'rgba(20, 184, 166, 0.18)' }}>
              <FileText size={28} color="#5EEAD4" />
            </div>
            <h3 className="feature-card-title">Simulated Exam</h3>
            <p className="feature-card-desc">Mixed exam practice pulled from your selected level topics.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Play size={24} style={{ color: '#5EEAD4' }} />
              <span style={{ fontSize: 24, fontWeight: 700 }}>{selectedLevel} Topics</span>
              <span className="topics-count-badge" style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
                {filteredTopics.length} topics
              </span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Search size={14} />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search topics..."
                style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', minWidth: 190 }}
              />
            </label>
          </div>

          <p style={{ marginBottom: 20, opacity: 0.72 }}>
            Choose a topic and select <strong>MCQ</strong> or <strong>Structured</strong> generation.
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
              const TopicIcon = CATEGORY_ICONS[topic.category] ?? Circle;
              return (
                <div key={topic.id} className="science-topic-card" onClick={() => openStartQuiz(topic)}>
                  <div className="topic-icon-small">
                    <TopicIcon size={20} />
                  </div>
                  <span className="topic-card-name">{topic.name}</span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(20,184,166,0.18)', color: '#5EEAD4' }}>
                      {topic.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 60, marginBottom: 24 }}>
            <BookOpen size={24} style={{ color: '#5EEAD4' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes</span>
          </div>

          <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {aLevelChemistryTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/app/a-level-chemistry/notes/${topic.id}`}
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

      {startQuizModalOpen && pendingTopic && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => !generating && setStartQuizModalOpen(false)}
        >
          <div
            className="modal-content"
            style={{
              background: '#0F172A',
              border: '1px solid rgba(255,255,255,0.1)',
              width: '90%',
              maxWidth: '500px',
              borderRadius: 24,
              padding: 32,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>{pendingTopic.name}</h3>
            <p style={{ opacity: 0.72, marginTop: 0, marginBottom: 20 }}>Choose question format</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
              <button
                type="button"
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: selectedQuestionType === 'mcq' ? '1px solid #5EEAD4' : '1px solid rgba(255,255,255,0.15)',
                  background: selectedQuestionType === 'mcq' ? 'rgba(94, 234, 212, 0.18)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => setSelectedQuestionType('mcq')}
              >
                MCQ ({formatCreditCost(calculateQuizCreditCost({ subject: SUBJECT.id, questionFormat: 'mcq' }))})
              </button>

              <button
                type="button"
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: selectedQuestionType === 'structured' ? '1px solid #5EEAD4' : '1px solid rgba(255,255,255,0.15)',
                  background:
                    selectedQuestionType === 'structured'
                      ? 'rgba(94, 234, 212, 0.18)'
                      : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => setSelectedQuestionType('structured')}
              >
                Structured ({formatCreditCost(calculateQuizCreditCost({ subject: SUBJECT.id, questionFormat: 'structured' }))})
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
                  background: 'linear-gradient(135deg, #14B8A6, #2DD4BF)',
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
        subtitle="Creating your A-Level Chemistry practice question"
        accentColor={SUBJECT.color}
        variant="fullscreen"
      />
    </div>
  );
}
