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
  Globe,
  Cloud,
  Mountain,
  Leaf,
  Users,
  Building,
  Wheat,
  Factory,
  Recycle,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { aLevelGeographyTopics, type ALevelGeographyTopic } from '../../data/aLevelGeography';
import '../sciences/ScienceUniverse.css';

type GeographyPaper = 'Paper 1' | 'Paper 2';
type QuestionFormat = 'mcq' | 'structured' | 'essay';

const SUBJECT = {
  id: 'a_level_geography',
  name: 'A Level Geography',
  color: '#2E7D32',
};

const TOPIC_ICONS: Record<string, LucideIcon> = {
  climatology: Cloud,
  hydrology_and_fluvial_geomorphology: Globe,
  geomorphology: Mountain,
  biogeography: Leaf,
  population_geography: Users,
  settlement_geography: Building,
  agriculture_and_food_production: Wheat,
  industry_mining_and_energy: Factory,
  environmental_management: Recycle,
};

export function ALevelGeographyTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [selectedPaper, setSelectedPaper] = useState<GeographyPaper>('Paper 1');
  const [searchText, setSearchText] = useState('');
  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<ALevelGeographyTopic | null>(null);
  const [questionFormat, setQuestionFormat] = useState<QuestionFormat>('mcq');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredTopics = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return aLevelGeographyTopics.filter((topic) => {
      if (topic.paper !== selectedPaper) return false;
      if (!q) return true;
      return topic.name.toLowerCase().includes(q) || topic.description.toLowerCase().includes(q);
    });
  }, [searchText, selectedPaper]);

  const notesTopics = aLevelGeographyTopics.filter((topic) => topic.hasNotes);

  const creditCost = calculateQuizCreditCost({
    subject: SUBJECT.id,
    questionType: 'topical',
    questionFormat,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: SUBJECT.id,
    questionType: 'topical',
    questionFormat,
  });
  const userCredits = user?.credits ?? 0;
  const hasEnoughCredits = userCredits >= minCredits;

  const openStartQuiz = (topic: ALevelGeographyTopic) => {
    setPendingTopic(topic);
    setQuestionFormat('mcq');
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
        questionFormat,
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
          questionFormat,
          backTo: '/app/a-level-geography',
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
    <div className="science-universe-page geo">
      <div className="science-universe-bg geo-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={24} />
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge" style={{ background: 'rgba(46, 125, 50, 0.18)', border: '1px solid rgba(46, 125, 50, 0.35)' }}>
          <Globe size={14} />
          <span>A-LEVEL GEOGRAPHY (9156)</span>
        </div>
        <h1 className="science-hero-title" style={{ background: 'linear-gradient(135deg, #2E7D32, #43A047, #81C784)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master A-Level<br />Geography
        </h1>
        <p style={{ maxWidth: 700, margin: '0 auto', opacity: 0.8 }}>
          Physical and Human Geography coverage with MCQ, structured, and essay practice.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSelectedPaper('Paper 1')}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border: selectedPaper === 'Paper 1' ? '1px solid rgba(46, 125, 50, 0.45)' : '1px solid rgba(255,255,255,0.12)',
              background: selectedPaper === 'Paper 1' ? 'rgba(46, 125, 50, 0.18)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Paper 1 (Physical)
          </button>
          <button
            type="button"
            onClick={() => setSelectedPaper('Paper 2')}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border: selectedPaper === 'Paper 2' ? '1px solid rgba(46, 125, 50, 0.45)' : '1px solid rgba(255,255,255,0.12)',
              background: selectedPaper === 'Paper 2' ? 'rgba(46, 125, 50, 0.18)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Paper 2 (Human)
          </button>
        </div>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div className="science-feature-card" onClick={() => navigate('/app/a-level-geography/notes')}>
            <div className="feature-icon-box" style={{ background: 'rgba(46, 125, 50, 0.18)' }}>
              <BookOpen size={28} color="#81C784" />
            </div>
            <h3 className="feature-card-title">Geography Notes</h3>
            <p className="feature-card-desc">Full notes with summaries, sections, key points, exam tips, and media.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/teacher', { state: { subject: 'A Level Geography', gradeLevel: 'Form 5-6 (A-Level)' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(124, 77, 255, 0.15)' }}>
              <MessageSquare size={28} color="#B388FF" />
            </div>
            <h3 className="feature-card-title">AI Geography Tutor</h3>
            <p className="feature-card-desc">Interactive tutoring aligned to A-Level Geography objectives.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/virtual-lab/geo-maps-lab')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(0, 188, 212, 0.18)' }}>
              <Globe size={28} color="#4DD0E1" />
            </div>
            <h3 className="feature-card-title">Maps Lab</h3>
            <p className="feature-card-desc">Mapwork and fieldwork tools for Geography spatial analysis.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'a_level_geography', backTo: '/app/a-level-geography', subjectLabel: 'A Level Geography' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(46, 125, 50, 0.18)' }}>
              <FileText size={28} color="#81C784" />
            </div>
            <h3 className="feature-card-title">Simulated Exam</h3>
            <p className="feature-card-desc">Timed mixed-paper exam practice with A-Level style questions.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Play size={24} style={{ color: '#66BB6A' }} />
              <span style={{ fontSize: 24, fontWeight: 700 }}>{selectedPaper} Topics</span>
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
              const TopicIcon = TOPIC_ICONS[topic.id] ?? Globe;
              return (
                <div key={topic.id} className="science-topic-card" onClick={() => openStartQuiz(topic)}>
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
                to={`/app/a-level-geography/notes/${topic.id}`}
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
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>{pendingTopic.name}</h3>
            <p style={{ opacity: 0.72, marginTop: 0, marginBottom: 20 }}>Choose question type</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
              {(['mcq', 'structured', 'essay'] as QuestionFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: questionFormat === fmt ? '1px solid #81C784' : '1px solid rgba(255,255,255,0.15)',
                    background: questionFormat === fmt ? 'rgba(129, 199, 132, 0.18)' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    textTransform: 'capitalize',
                  }}
                  onClick={() => setQuestionFormat(fmt)}
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
        subtitle="Creating your A-Level Geography practice question"
        accentColor={SUBJECT.color}
        variant="fullscreen"
      />
    </div>
  );
}
