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
  Dna,
  FlaskConical,
  Search,
  type LucideIcon,
  Circle,
} from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { aLevelBiologyTopics, type ALevelBiologyTopic } from '../../data/aLevelBiology';
import '../sciences/ScienceUniverse.css';

type SixthLevel = 'Lower Sixth' | 'Upper Sixth';
type BiologyQuestionType = 'mcq' | 'structured' | 'essay';

const SUBJECT = {
  id: 'a_level_biology',
  name: 'A Level Biology',
  color: '#10B981',
};

const BIO_TOPIC_ICONS: Record<string, LucideIcon> = {
  cell_structure: Circle,
  biological_molecules: FlaskConical,
  enzymes: FlaskConical,
  cell_membranes: Circle,
  cell_division: Circle,
  nucleic_acids: Dna,
  transport_plants: Circle,
  transport_mammals: Circle,
  gas_exchange: Circle,
  infectious_diseases: Circle,
  immunity: Circle,
  smoking_health: Circle,
  energy_respiration: Circle,
  photosynthesis: Circle,
  homeostasis: Circle,
  excretion: Circle,
  nervous_coordination: Circle,
  hormonal_coordination: Circle,
  meiosis_genetics: Dna,
  selection_evolution: Circle,
  biodiversity_classification: Circle,
  genetic_technology: Dna,
  ecology: Circle,
  human_environment: Circle,
  reproduction: Circle,
};

export function ALevelBiologyTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [selectedLevel, setSelectedLevel] = useState<SixthLevel>('Lower Sixth');
  const [searchText, setSearchText] = useState('');
  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<ALevelBiologyTopic | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<BiologyQuestionType>('mcq');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredTopics = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return aLevelBiologyTopics.filter((topic) => {
      if (topic.difficulty !== selectedLevel) return false;
      if (!q) return true;
      return (
        topic.name.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        topic.learningObjectives.some((obj) => obj.toLowerCase().includes(q))
      );
    });
  }, [searchText, selectedLevel]);

  const notesTopics = aLevelBiologyTopics;

  const creditCost = calculateQuizCreditCost({
    subject: SUBJECT.id,
    questionType: 'topical',
    bioQuestionType: selectedQuestionType,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: SUBJECT.id,
    questionType: 'topical',
    bioQuestionType: selectedQuestionType,
  });
  const userCredits = user?.credits ?? 0;
  const hasEnoughCredits = userCredits >= minCredits;

  const openStartQuiz = (topic: ALevelBiologyTopic) => {
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
        'Biology',
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
          backTo: '/app/a-level-biology',
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
    <div className="science-universe-page bio">
      <div className="science-universe-bg bio-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={24} />
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge" style={{ background: 'rgba(16, 185, 129, 0.16)', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
          <Dna size={14} />
          <span>A-LEVEL BIOLOGY (6030)</span>
        </div>
        <h1 className="science-hero-title" style={{ background: 'linear-gradient(135deg, #10B981, #34D399, #6EE7B7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master A-Level<br />Biology
        </h1>
        <p style={{ maxWidth: 700, margin: '0 auto', opacity: 0.8 }}>
          Full Lower Sixth and Upper Sixth coverage with MCQ, structured, and essay practice.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSelectedLevel('Lower Sixth')}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border: selectedLevel === 'Lower Sixth' ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid rgba(255,255,255,0.12)',
              background: selectedLevel === 'Lower Sixth' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Lower Sixth
          </button>
          <button
            type="button"
            onClick={() => setSelectedLevel('Upper Sixth')}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border: selectedLevel === 'Upper Sixth' ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid rgba(255,255,255,0.12)',
              background: selectedLevel === 'Upper Sixth' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Upper Sixth
          </button>
        </div>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div
            className="science-feature-card"
            onClick={() => navigate('/app/a-level-biology/notes')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(16, 185, 129, 0.18)' }}>
              <BookOpen size={28} color="#6EE7B7" />
            </div>
            <h3 className="feature-card-title">Biology Notes</h3>
            <p className="feature-card-desc">Comprehensive A-Level topic notes with summaries and exam-ready detail.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/teacher', { state: { subject: 'A Level Biology', gradeLevel: 'Lower Sixth - Upper Sixth' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(124, 77, 255, 0.15)' }}>
              <MessageSquare size={28} color="#B388FF" />
            </div>
            <h3 className="feature-card-title">AI Biology Tutor</h3>
            <p className="feature-card-desc">Interactive tutoring aligned to A-Level biology objectives.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/virtual-lab?subject=biology')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
              <FlaskConical size={28} color="#FCD34D" />
            </div>
            <h3 className="feature-card-title">Virtual Labs</h3>
            <p className="feature-card-desc">Interactive biology experiments and simulations.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'a_level_biology', backTo: '/app/a-level-biology', subjectLabel: 'A Level Biology' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(16, 185, 129, 0.18)' }}>
              <FileText size={28} color="#6EE7B7" />
            </div>
            <h3 className="feature-card-title">Simulated Exam</h3>
            <p className="feature-card-desc">Mixed exam practice with MCQ, structured, and essay-style questions.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Play size={24} style={{ color: '#6EE7B7' }} />
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
              const TopicIcon = BIO_TOPIC_ICONS[topic.id] ?? Circle;
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
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.16)', color: '#6EE7B7' }}>{topic.paperRelevance}</span>
                    {topic.practicalComponent ? (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(245,158,11,0.16)', color: '#FCD34D' }}>Practical</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 60, marginBottom: 24 }}>
            <BookOpen size={24} style={{ color: '#6EE7B7' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes</span>
          </div>

          <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {notesTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/app/a-level-biology/notes/${topic.id}`}
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
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="modal-content" style={{
            background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)',
            width: '90%', maxWidth: '500px', borderRadius: 24, padding: 32,
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>
              {pendingTopic.name}
            </h3>
            <p style={{ opacity: 0.72, marginTop: 0, marginBottom: 20 }}>Choose question type</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
              <button
                type="button"
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: selectedQuestionType === 'mcq' ? '1px solid #6EE7B7' : '1px solid rgba(255,255,255,0.15)',
                  background: selectedQuestionType === 'mcq' ? 'rgba(110, 231, 183, 0.18)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => setSelectedQuestionType('mcq')}
              >
                MCQ (0.5 credits)
              </button>

              <button
                type="button"
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: selectedQuestionType === 'structured' ? '1px solid #6EE7B7' : '1px solid rgba(255,255,255,0.15)',
                  background: selectedQuestionType === 'structured' ? 'rgba(110, 231, 183, 0.18)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => setSelectedQuestionType('structured')}
              >
                Structured (0.5 credits)
              </button>

              <button
                type="button"
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: selectedQuestionType === 'essay' ? '1px solid #6EE7B7' : '1px solid rgba(255,255,255,0.15)',
                  background: selectedQuestionType === 'essay' ? 'rgba(110, 231, 183, 0.18)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => setSelectedQuestionType('essay')}
              >
                Essay (1 credit)
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
                  background: 'linear-gradient(135deg, #10B981, #34D399)',
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
        subtitle="Creating your A-Level Biology practice question"
        accentColor={SUBJECT.color}
        variant="fullscreen"
      />
    </div>
  );
}

