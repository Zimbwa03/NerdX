import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Sigma,
  FlaskConical,
  MessageCircle,
  FileText,
  Search,
  Layers3,
  Play,
  X,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Divide,
  Superscript,
  Crosshair,
  Spline,
  ListOrdered,
  Hash,
  Triangle,
  TrendingDown,
  LineChart,
  Infinity,
  TrendingUp,
  GitBranch,
  Compass,
  LayoutGrid,
  Box,
  Calculator,
  CircleDot,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { quizApi, type Question, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import {
  aLevelPureMathTopics,
  topicCounts,
  type ALevelPureMathTopic,
} from '../../data/aLevelPureMath/topics';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import '../sciences/ScienceUniverse.css';
import './ALevelPureMathPage.css';

type SixthLevel = 'Lower Sixth' | 'Upper Sixth';
type QuestionFormat = 'mcq' | 'structured';

const SUBJECT_ID = 'a_level_pure_math';

/** Unique icon per A-Level Pure Math topic. */
const ALEVEL_MATH_ICONS: Record<string, LucideIcon> = {
  polynomials: Sigma,
  rational_functions: Divide,
  indices_surds_logs: Superscript,
  quadratic_functions: Crosshair,
  functions: Spline,
  coordinate_geometry: Crosshair,
  sequences_series: ListOrdered,
  binomial_theorem: Hash,
  trigonometry_basic: Triangle,
  differentiation_basic: TrendingDown,
  applications_differentiation: LineChart,
  integration_basic: Layers3,
  further_trigonometry: Triangle,
  hyperbolic_functions: Infinity,
  further_differentiation: TrendingUp,
  further_integration: Layers3,
  differential_equations: GitBranch,
  complex_numbers: Compass,
  matrices: LayoutGrid,
  vectors_3d: Box,
  summation_series: Hash,
  numerical_methods: Calculator,
  proof: CheckCircle2,
  groups: CircleDot,
};

export function ALevelPureMathPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [selectedLevel, setSelectedLevel] = useState<SixthLevel>('Lower Sixth');
  const [searchText, setSearchText] = useState('');
  const [pendingTopic, setPendingTopic] = useState<ALevelPureMathTopic | null>(null);
  const [questionFormat, setQuestionFormat] = useState<QuestionFormat>('mcq');
  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredTopics = useMemo(() => {
    const normalizedQuery = searchText.trim().toLowerCase();
    return aLevelPureMathTopics.filter((topic) => {
      if (topic.difficulty !== selectedLevel) return false;
      if (!normalizedQuery) return true;
      return (
        topic.name.toLowerCase().includes(normalizedQuery) ||
        topic.description.toLowerCase().includes(normalizedQuery) ||
        topic.learningObjectives.some((objective) => objective.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [searchText, selectedLevel]);

  const paperPatternCounts = useMemo(() => {
    const paperOne = aLevelPureMathTopics.filter((topic) => topic.paperRelevance === 'Paper 1').length;
    const paperTwo = aLevelPureMathTopics.filter((topic) => topic.paperRelevance === 'Paper 2').length;
    const both = aLevelPureMathTopics.filter((topic) => topic.paperRelevance === 'Both').length;
    return { paperOne, paperTwo, both };
  }, []);

  const creditCost = calculateQuizCreditCost({
    subject: SUBJECT_ID,
    questionType: 'topical',
    questionFormat,
  });
  const minimumCredits = getMinimumCreditsForQuiz({
    subject: SUBJECT_ID,
    questionType: 'topical',
    questionFormat,
  });

  const currentCredits = user?.credits ?? 0;
  const hasEnoughCredits = currentCredits >= minimumCredits;

  const openStartQuiz = (topic: ALevelPureMathTopic) => {
    setPendingTopic(topic);
    setQuestionFormat('mcq');
    setError(null);
    setStartQuizModalOpen(true);
  };

  const handleStartQuiz = async () => {
    if (!pendingTopic) return;

    if (!hasEnoughCredits) {
      setError(`You need at least ${formatCreditCost(minimumCredits)} to start.`);
      return;
    }

    setGenerating(true);
    setStartQuizModalOpen(false);
    setError(null);

    try {
      const question: Question | null = await quizApi.generateQuestion(
        SUBJECT_ID,
        pendingTopic.id,
        'medium',
        'topical',
        'Pure Mathematics',
        undefined,
        questionFormat,
      );

      if (!question) {
        throw new Error('Unable to generate a question for this topic right now.');
      }

      const creditsRemaining = (question as Question & { credits_remaining?: number }).credits_remaining;
      if (creditsRemaining !== undefined) {
        updateUser({ credits: creditsRemaining });
      }

      const topicToPass: Topic = {
        id: pendingTopic.id,
        name: pendingTopic.name,
        subject: SUBJECT_ID,
      };

      setPendingTopic(null);
      navigate('/app/mathematics/quiz', {
        state: {
          question,
          subject: {
            id: SUBJECT_ID,
            name: 'A Level Pure Mathematics',
            icon: 'Calculator',
            color: '#8B5CF6',
          },
          topic: topicToPass,
          formLevel: selectedLevel,
          questionFormat,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate question.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="science-universe-page math alevel-pure-math-page">
      <div className="science-universe-bg math-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={22} />
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge alevel-pure-badge">
          <Sparkles size={14} />
          <span>A LEVEL PURE MATHEMATICS (6042)</span>
        </div>
        <h1 className="science-hero-title alevel-pure-title">
          Build Mastery in
          <br />
          Pure Mathematics
        </h1>
        <p className="alevel-hero-subtitle">
          Full Lower Sixth and Upper Sixth topical coverage with interactive generation and exam-focused progression.
        </p>

        <div className="alevel-level-toggle" role="tablist" aria-label="Select sixth form level">
          <button
            type="button"
            className={`alevel-level-btn ${selectedLevel === 'Lower Sixth' ? 'active lower' : ''}`}
            onClick={() => setSelectedLevel('Lower Sixth')}
          >
            <span>Lower Sixth</span>
            <small>{topicCounts.lowerSixth} topics</small>
          </button>
          <button
            type="button"
            className={`alevel-level-btn ${selectedLevel === 'Upper Sixth' ? 'active upper' : ''}`}
            onClick={() => setSelectedLevel('Upper Sixth')}
          >
            <span>Upper Sixth</span>
            <small>{topicCounts.upperSixth} topics</small>
          </button>
        </div>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <button type="button" className="science-feature-card" onClick={() => navigate('/app/pure-math/notes')}>
            <div className="feature-icon-box" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
              <BookOpen size={28} color="#A78BFA" />
            </div>
            <h3 className="feature-card-title">Topic Notes</h3>
            <p className="feature-card-desc">Book-style expanded notes with worked examples and topic diagrams.</p>
          </button>

          <button type="button" className="science-feature-card" onClick={() => navigate('/app/teacher', { state: { subject: 'A Level Pure Mathematics' } })}>
            <div className="feature-icon-box" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
              <MessageCircle size={28} color="#34D399" />
            </div>
            <h3 className="feature-card-title">AI Tutor</h3>
            <p className="feature-card-desc">Interactive A-Level tutor aligned to pure mathematics objectives.</p>
          </button>

          <button type="button" className="science-feature-card" onClick={() => navigate('/app/formula-sheet')}>
            <div className="feature-icon-box" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
              <Sigma size={28} color="#93C5FD" />
            </div>
            <h3 className="feature-card-title">Formula Sheet</h3>
            <p className="feature-card-desc">Revision formulas for calculus, trigonometry, vectors, and matrices.</p>
          </button>

          <button type="button" className="science-feature-card" onClick={() => navigate('/app/virtual-lab?subject=mathematics')}>
            <div className="feature-icon-box" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
              <FlaskConical size={28} color="#FCD34D" />
            </div>
            <h3 className="feature-card-title">Virtual Lab</h3>
            <p className="feature-card-desc">Hands-on interactive labs for complex numbers, matrices, integration, and vectors.</p>
          </button>

          <button
            type="button"
            className="science-feature-card"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'pure_math', backTo: '/app/pure-math', subjectLabel: 'A Level Pure Mathematics' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(236, 72, 153, 0.2)' }}>
              <FileText size={28} color="#F9A8D4" />
            </div>
            <h3 className="feature-card-title">Simulated Exam</h3>
            <p className="feature-card-desc">Practice under exam conditions with pure mathematics style questions.</p>
          </button>
        </div>

        <div className="science-topics-col">
          <div className="alevel-topics-toolbar">
            <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Play size={24} style={{ color: '#A78BFA' }} />
              <span style={{ fontSize: 24, fontWeight: 700 }}>{selectedLevel} Topics</span>
              <span className="topics-count-badge" style={{ fontSize: 12, background: 'rgba(139,92,246,0.2)', padding: '4px 10px', borderRadius: 12 }}>
                {filteredTopics.length} showing
              </span>
            </div>

            <label className="alevel-search-wrap">
              <Search size={16} />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search topics, objectives, or methods"
              />
            </label>
          </div>

          <div className="alevel-pattern-grid">
            <div className="alevel-pattern-card">
              <Layers3 size={16} />
              <span>Total Topics</span>
              <strong>{topicCounts.total}</strong>
            </div>
            <div className="alevel-pattern-card">
              <Layers3 size={16} />
              <span>Paper 1 Pattern</span>
              <strong>{paperPatternCounts.paperOne}</strong>
            </div>
            <div className="alevel-pattern-card">
              <Layers3 size={16} />
              <span>Paper 2 Pattern</span>
              <strong>{paperPatternCounts.paperTwo}</strong>
            </div>
            <div className="alevel-pattern-card">
              <Layers3 size={16} />
              <span>Both Papers</span>
              <strong>{paperPatternCounts.both}</strong>
            </div>
          </div>

          {error ? (
            <div className="alevel-error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          ) : null}

          <div className="science-topics-grid">
            {filteredTopics.map((topic) => (
              <button
                type="button"
                key={topic.id}
                className="science-topic-card alevel-topic-card"
                onClick={() => openStartQuiz(topic)}
              >
                <div className="topic-icon-small">
                  {(() => { const I = ALEVEL_MATH_ICONS[topic.id] ?? Sigma; return <I size={18} />; })()}
                </div>
                <span className="topic-card-name">{topic.name}</span>
                <div className="alevel-topic-meta-row">
                  <span className="alevel-topic-chip">{topic.paperRelevance}</span>
                  <span className="alevel-topic-chip muted">{topic.learningObjectives.length} objectives</span>
                </div>
                <p className="alevel-topic-desc">{topic.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {startQuizModalOpen && pendingTopic ? (
        <div className="modal-overlay" onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="modal-content alevel-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="alevel-modal-close"
              onClick={() => setStartQuizModalOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2>{pendingTopic.name}</h2>
            <p className="alevel-modal-subtitle">A Level Pure Mathematics ({selectedLevel})</p>

            <div className="alevel-format-grid">
              <button
                type="button"
                className={`alevel-format-btn ${questionFormat === 'mcq' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('mcq')}
              >
                <span>MCQ</span>
                <small>Quick concept check</small>
              </button>
              <button
                type="button"
                className={`alevel-format-btn ${questionFormat === 'structured' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('structured')}
              >
                <span>Structured</span>
                <small>Exam-style multi-part</small>
              </button>
            </div>

            <div className="alevel-credit-line">
              <CheckCircle2 size={16} />
              <span>Cost: {formatCreditCost(creditCost)} | Balance: {formatCreditCost(currentCredits)}</span>
            </div>

            {!hasEnoughCredits ? (
              <div className="alevel-error-banner inline" role="alert">
                <AlertCircle size={16} />
                <span>You need at least {formatCreditCost(minimumCredits)} to continue.</span>
              </div>
            ) : null}

            <button
              type="button"
              className="alevel-start-btn"
              onClick={handleStartQuiz}
              disabled={generating || !hasEnoughCredits}
            >
              {generating ? 'Generating...' : 'Start Topical Generation'}
            </button>
          </div>
        </div>
      ) : null}

      <AILoadingOverlay
        isVisible={generating}
        title="Generating Pure Math Question"
        subtitle={`Preparing a ${questionFormat.toUpperCase()} question for ${pendingTopic?.name ?? 'selected topic'}...`}
        accentColor="#8B5CF6"
        variant="fullscreen"
      />
    </div>
  );
}
