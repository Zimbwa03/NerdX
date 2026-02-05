import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { scienceTopics } from '../../data/scienceNotes';
import { ArrowLeft, Atom, FlaskConical, Leaf, MessageCircle, Sparkles } from 'lucide-react';

type ScienceSubject = 'Biology' | 'Chemistry' | 'Physics';

const SUBJECT_META: Record<ScienceSubject, {
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  accent: string;
  Icon: typeof Atom;
}> = {
  Biology: {
    slug: 'biology',
    title: 'Biology',
    subtitle: 'Cells, systems, and ecosystems',
    color: '#2E7D32',
    accent: '#00E676',
    Icon: Leaf,
  },
  Chemistry: {
    slug: 'chemistry',
    title: 'Chemistry',
    subtitle: 'Matter, reactions, and energy',
    color: '#00897B',
    accent: '#26C6DA',
    Icon: FlaskConical,
  },
  Physics: {
    slug: 'physics',
    title: 'Physics',
    subtitle: 'Forces, waves, and electricity',
    color: '#1565C0',
    accent: '#42A5F5',
    Icon: Atom,
  },
};

const SUBJECTS: ScienceSubject[] = ['Biology', 'Chemistry', 'Physics'];

export function ScienceTopicsPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { activeTab?: ScienceSubject } };
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<ScienceSubject>(
    location.state?.activeTab ?? 'Biology'
  );
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
  const [quizMode, setQuizMode] = useState<'topical' | 'exam'>('topical');
  const [questionFormat, setQuestionFormat] = useState<'mcq' | 'structured'>('mcq');
  const [mixImages, setMixImages] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.activeTab && location.state.activeTab !== activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [activeTab, location.state?.activeTab]);

  useEffect(() => {
    let cancelled = false;
    const fallbackTopics = (scienceTopics[activeTab] ?? []).map((name) => ({
      id: name,
      name,
      subject: 'combined_science',
      parent_subject: activeTab,
    }));

    (async () => {
      setLoading(true);
      try {
        const data = await quizApi.getTopics('combined_science', activeTab);
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(fallbackTopics);
      } catch {
        if (!cancelled) setTopics(fallbackTopics);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [activeTab]);

  const noteTopics = useMemo(() => scienceTopics[activeTab] ?? [], [activeTab]);
  const displayTopics = topics.length ? topics : noteTopics.map((name) => ({
    id: name,
    name,
    subject: 'combined_science',
    parent_subject: activeTab,
  }));

  const subjectMeta = SUBJECT_META[activeTab];

  const openStartQuiz = (topic: Topic | null) => {
    setPendingTopic(topic);
    setQuizMode(topic ? 'topical' : 'exam');
    setQuestionFormat('mcq');
    setMixImages(false);
    setError(null);
    setStartQuizModalOpen(true);
  };

  const isExamMode = quizMode === 'exam' || !pendingTopic;
  const effectiveTopic = isExamMode ? null : pendingTopic;

  const creditCost = calculateQuizCreditCost({
    subject: 'combined_science',
    questionType: isExamMode ? 'exam' : 'topical',
    isImageQuestion: mixImages,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: 'combined_science',
    questionType: isExamMode ? 'exam' : 'topical',
    isImageQuestion: mixImages,
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
      const question = await quizApi.generateQuestion(
        'combined_science',
        effectiveTopic?.id,
        'medium',
        isExamMode ? 'exam' : 'topical',
        activeTab,
        undefined,
        questionFormat,
        mixImages
      );

      const creditsRemaining = (question as { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) {
        updateUser({ credits: creditsRemaining });
      }

      setStartQuizModalOpen(false);
      setPendingTopic(null);
      navigate('/app/sciences/quiz', {
        state: {
          question,
          subject: {
            id: 'combined_science',
            name: `O Level ${activeTab}`,
            color: subjectMeta.accent,
          },
          topic: effectiveTopic ?? undefined,
          parentSubject: activeTab,
          questionFormat,
          mixImagesEnabled: mixImages,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate question');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      className="science-topics-page"
      style={{ '--science-accent': subjectMeta.accent } as CSSProperties}
    >
      <header className="science-topics-header">
        <Link to="/app" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="science-topics-title">O Level Science</h1>
        <p className="science-topics-subtitle">Biology, Chemistry, and Physics in one place</p>
      </header>

      <section className="science-subject-tabs">
        {SUBJECTS.map((subject) => {
          const meta = SUBJECT_META[subject];
          const isActive = activeTab === subject;
          const Icon = meta.Icon;
          return (
            <button
              key={subject}
              type="button"
              className={`science-subject-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(subject)}
              style={
                {
                  '--science-accent': meta.accent,
                  ...(isActive ? { borderColor: meta.accent } : {}),
                } as CSSProperties
              }
            >
              <span className="science-subject-icon" style={{ color: meta.accent }}>
                <Icon size={20} />
              </span>
              <span className="science-subject-name">{meta.title}</span>
              <span className="science-subject-desc">{meta.subtitle}</span>
            </button>
          );
        })}
      </section>

      <div className="science-desktop-grid">
        <div className="science-desktop-left">
          <section className="science-notes-section">
            <div className="science-section-head">
              <h2 className="science-section-title">Complete Science Notes</h2>
              <span className="science-section-tag">{noteTopics.length} topics</span>
            </div>
            <p className="science-section-subtitle">
              Tap a topic to open audio, video, and detailed explanations.
            </p>
            <div className="science-notes-chips">
              {noteTopics.map((name) => (
                <Link
                  key={name}
                  to={`/app/sciences/notes/${subjectMeta.slug}/${encodeURIComponent(name)}`}
                  className="science-topic-chip"
                  style={{ borderColor: subjectMeta.accent }}
                >
                  {name}
                </Link>
              ))}
            </div>
          </section>

          <section className="science-features-section">
            <button
              type="button"
              className="science-feature-card"
              onClick={() =>
                navigate('/app/teacher', {
                  state: { subject: activeTab, gradeLevel: 'Form 3-4 (O-Level)' },
                })
              }
            >
              <div className="science-feature-icon" style={{ color: subjectMeta.accent }}>
                <MessageCircle size={26} />
              </div>
              <div className="science-feature-content">
                <h3>AI Science Tutor</h3>
                <p>Ask questions, get explanations, and request notes</p>
              </div>
              <span className="science-feature-arrow">-&gt;</span>
            </button>

            <button
              type="button"
              className="science-feature-card"
              onClick={() =>
                navigate('/app/exam/setup', {
                  state: {
                    subject: 'combined_science',
                    backTo: '/app/sciences',
                    subjectLabel: 'O Level Science',
                  },
                })
              }
            >
              <div className="science-feature-icon" style={{ color: subjectMeta.accent }}>
                <Sparkles size={26} />
              </div>
              <div className="science-feature-content">
                <h3>Start Exam</h3>
                <p>Timed exam with mixed questions from Biology, Chemistry &amp; Physics</p>
              </div>
              <span className="science-feature-arrow">-&gt;</span>
            </button>

            <button
              type="button"
              className="science-feature-card"
              onClick={() => openStartQuiz(null)}
            >
              <div className="science-feature-icon" style={{ color: subjectMeta.accent }}>
                <Sparkles size={26} />
              </div>
              <div className="science-feature-content">
                <h3>Exam Practice</h3>
                <p>Single question from all {activeTab} topics</p>
              </div>
              <span className="science-feature-arrow">-&gt;</span>
            </button>
          </section>
        </div>

        <div className="science-desktop-right">
          <section className="science-topics-section">
            <h2 className="science-section-title">{activeTab} Topics</h2>
            {loading ? (
              <div className="science-loading">Loading topics...</div>
            ) : (
              <div className="science-topics-grid">
                {displayTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className="science-topic-card"
                    onClick={() => openStartQuiz(topic)}
                  >
                    <span className="science-topic-name">{topic.name}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {startQuizModalOpen && (
        <div className="science-modal-overlay" onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="science-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="science-modal-title">
              {isExamMode ? `Start ${activeTab} Exam` : `Practice: ${pendingTopic?.name ?? ''}`}
            </h3>
            <div className="science-modal-options">
              <button
                type="button"
                className={`science-modal-option ${quizMode === 'topical' ? 'active' : ''}`}
                onClick={() => setQuizMode('topical')}
                disabled={!pendingTopic}
              >
                Topical
              </button>
              <button
                type="button"
                className={`science-modal-option ${quizMode === 'exam' ? 'active' : ''}`}
                onClick={() => setQuizMode('exam')}
              >
                Exam
              </button>
            </div>
            <div className="science-modal-options">
              <button
                type="button"
                className={`science-modal-option ${questionFormat === 'mcq' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('mcq')}
              >
                Paper 1 (MCQ)
              </button>
              <button
                type="button"
                className={`science-modal-option ${questionFormat === 'structured' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('structured')}
              >
                Paper 2 (Structured)
              </button>
            </div>
            <label className="science-modal-toggle">
              <input
                type="checkbox"
                checked={mixImages}
                onChange={(e) => setMixImages(e.target.checked)}
              />
              <span>Visual learning (mix image questions)</span>
            </label>
            <p className="science-modal-cost">
              Cost: {formatCreditCost(creditCost)} per question
            </p>
            {error && <p className="science-modal-error">{error}</p>}
            <div className="science-modal-actions">
              <button
                type="button"
                className="science-modal-cancel"
                onClick={() => !generating && setStartQuizModalOpen(false)}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="science-modal-start"
                onClick={handleStartQuiz}
                disabled={generating || !hasEnoughCredits}
              >
                {generating ? 'Generating...' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
