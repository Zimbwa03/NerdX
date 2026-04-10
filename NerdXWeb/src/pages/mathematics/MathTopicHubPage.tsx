import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quizApi, type Topic, type Question } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { getSuggestedMathLabsForTopic } from '../../utils/mathTopicLabs';
import { getMathTopicById } from '../../data/oLevelMath/topics';
import { getMathTopicIcon } from '../../data/oLevelMath/topicIcons';
import { MaicTopicClassroomLink } from '../../components/MaicTopicClassroomLink';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import {
  ArrowLeft,
  Calculator,
  ChevronRight,
  FileText,
  BookOpen,
  MessageCircle,
  Atom,
  X,
  Info,
  TrendingUp,
} from 'lucide-react';
import '../sciences/ScienceUniverse.css';
import './MathTopicHubPage.css';

const SUBJECT = {
  id: 'mathematics',
  name: 'O Level Mathematics',
  color: '#10B981',
};

export function MathTopicHubPage() {
  const { topicId: rawTopicId } = useParams<{ topicId: string }>();
  const topicId = rawTopicId ? decodeURIComponent(rawTopicId) : '';
  const topic = getMathTopicById(topicId);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [practiceOpen, setPracticeOpen] = useState(false);
  const [mixImages, setMixImages] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingSubtitle, setLoadingSubtitle] = useState('Preparing your mathematics question');
  const [loadingProgress, setLoadingProgress] = useState<number | undefined>(undefined);

  const quizTopic: Topic | null = useMemo(() => {
    if (!topic) return null;
    return {
      id: topic.formLevel === 'Form 4' ? topic.name : topic.id,
      name: topic.name,
      subject: 'mathematics',
    };
  }, [topic]);

  const labs = useMemo(() => (topic ? getSuggestedMathLabsForTopic(topic, 4) : []), [topic]);

  const creditCost = calculateQuizCreditCost({
    subject: 'mathematics',
    questionType: 'topical',
    isImageQuestion: mixImages,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: 'mathematics',
    questionType: 'topical',
    isImageQuestion: mixImages,
  });
  const userCredits = user?.credits ?? 0;
  const hasEnoughCredits = userCredits >= minCredits;

  const notesSlug = topic?.notesKey?.replace(/\s+/g, '-') ?? topic?.name.replace(/\s+/g, '-') ?? '';
  const notesPath = topic?.hasNotes && topic.notesKey
    ? `/app/mathematics/notes/${encodeURIComponent(notesSlug)}`
    : null;

  const openGraphPractice = /graph|coordinate|cartesian|distance|travel/i.test(
    `${topic?.name ?? ''} ${topic?.description ?? ''}`,
  );

  if (!topic || !quizTopic) {
    return <Navigate to="/app/mathematics" replace />;
  }

  const TopicIcon = getMathTopicIcon(topic.name);

  const handleStartQuiz = async () => {
    if (!hasEnoughCredits) {
      setError(`You need at least ${formatCreditCost(minCredits)} to start. Please top up credits.`);
      return;
    }
    setGenerating(true);
    setLoadingSubtitle(`Preparing a ${topic.formLevel} ${topic.name} question`);
    setLoadingProgress(undefined);
    setPracticeOpen(false);
    setError(null);
    try {
      let question: Question | null = null;
      question = await quizApi.generateQuestionStream(
        'mathematics',
        quizTopic.id,
        'medium',
        {
          onThinking: (update) => {
            if (update.content) {
              setLoadingSubtitle(update.content);
            }
            if (update.stage && update.total_stages) {
              setLoadingProgress((update.stage / update.total_stages) * 100);
            }
          },
        },
        topic.formLevel,
      );
      if (!question) {
        question = await quizApi.generateQuestion(
          'mathematics',
          quizTopic.id,
          'medium',
          'topical',
          undefined,
          undefined,
          undefined,
          mixImages,
          undefined,
          undefined,
          topic.formLevel,
        );
      }
      const creditsRemaining = (question as Question & { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) {
        updateUser({ credits: creditsRemaining });
      }
      navigate('/app/mathematics/quiz', {
        state: {
          question,
          subject: SUBJECT,
          topic: quizTopic,
          mixImagesEnabled: mixImages,
          formLevel: topic.formLevel,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate question');
      setPracticeOpen(true);
    } finally {
      setGenerating(false);
      setLoadingSubtitle('Preparing your mathematics question');
      setLoadingProgress(undefined);
    }
  };

  return (
    <div className="science-universe-page math math-topic-hub">
      <div className="science-universe-bg math-bg">
        <div className="science-grid-overlay" />
      </div>

      <div className="math-topic-hub__inner">
        <Link to="/app/mathematics" className="math-topic-hub__back">
          <ArrowLeft size={18} aria-hidden />
          Mathematics
        </Link>

        <header className="math-topic-hub__hero">
          <div className="math-topic-hub__icon-wrap" aria-hidden>
            <TopicIcon size={26} strokeWidth={2} />
          </div>
          <div className="math-topic-hub__hero-text">
            <span className="math-topic-hub__badge">{topic.formLevel}</span>
            <h1 className="math-topic-hub__title">{topic.name}</h1>
            <p className="math-topic-hub__desc">{topic.description}</p>
          </div>
        </header>

        {!hasEnoughCredits && (
          <div
            style={{
              padding: 12,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.28)',
              borderRadius: 14,
              marginBottom: 20,
              color: '#FCA5A5',
              fontSize: 13,
            }}
          >
            You need at least {formatCreditCost(minCredits)} to generate a practice question.
          </div>
        )}

        <section className="math-topic-hub__section" aria-labelledby="mth-practice-label">
          <h2 id="mth-practice-label" className="math-topic-hub__section-label">
            Practice &amp; assessment
          </h2>
          <div className="math-topic-hub__actions math-topic-hub__actions--pair">
            <button
              type="button"
              className="math-topic-hub__action math-topic-hub__action--primary"
              onClick={() => {
                setMixImages(false);
                setError(null);
                setPracticeOpen(true);
              }}
            >
              <span className="math-topic-hub__action-icon math-topic-hub__action-icon--brand">
                <Calculator size={20} aria-hidden />
              </span>
              <span className="math-topic-hub__action-body">
                <span className="math-topic-hub__action-title">Practice questions</span>
                <span className="math-topic-hub__action-sub">AI-generated ZIMSEC-style items with full solutions</span>
              </span>
            </button>
            <button
              type="button"
              className="math-topic-hub__action"
              onClick={() =>
                navigate('/app/exam/setup', {
                  state: {
                    subject: 'mathematics',
                    backTo: `/app/mathematics/topic/${encodeURIComponent(topic.id)}`,
                    subjectLabel: 'Mathematics',
                    preselectedTopicNames: [topic.name],
                  },
                })
              }
            >
              <span className="math-topic-hub__action-icon math-topic-hub__action-icon--exam">
                <FileText size={20} aria-hidden />
              </span>
              <span className="math-topic-hub__action-body">
                <span className="math-topic-hub__action-title">Simulated exam</span>
                <span className="math-topic-hub__action-sub">Timed paper; narrow to this topic in setup</span>
              </span>
            </button>
          </div>
        </section>

        {notesPath && (
          <section className="math-topic-hub__section" aria-labelledby="mth-study-label">
            <h2 id="mth-study-label" className="math-topic-hub__section-label">
              Study
            </h2>
            <div className="math-topic-hub__actions">
              <Link to={notesPath} className="math-topic-hub__action">
                <span className="math-topic-hub__action-icon math-topic-hub__action-icon--brand-mint">
                  <BookOpen size={20} aria-hidden />
                </span>
                <span className="math-topic-hub__action-body">
                  <span className="math-topic-hub__action-title">Notes &amp; videos</span>
                  <span className="math-topic-hub__action-sub">Structured explanations and media for this topic</span>
                </span>
                <ChevronRight className="math-topic-hub__lab-chev" size={20} aria-hidden />
              </Link>
            </div>
          </section>
        )}

        <section className="math-topic-hub__section" aria-labelledby="mth-help-label">
          <h2 id="mth-help-label" className="math-topic-hub__section-label">
            Help
          </h2>
          <div className="math-topic-hub__help-row">
            <button
              type="button"
              className="math-topic-hub__action"
              onClick={() =>
                navigate('/app/teacher', {
                  state: {
                    subject: 'O Level Mathematics',
                    gradeLevel: topic.formLevel,
                    topic: topic.name,
                    initialMessage: `I need help with ${topic.name} (${topic.formLevel}). `,
                  },
                })
              }
            >
              <span className="math-topic-hub__action-icon math-topic-hub__action-icon--tutor">
                <MessageCircle size={20} aria-hidden />
              </span>
              <span className="math-topic-hub__action-body">
                <span className="math-topic-hub__action-title">AI Math Tutor</span>
                <span className="math-topic-hub__action-sub">Step-by-step guidance for this topic</span>
              </span>
            </button>
            <div className="math-topic-hub__classroom-slot">
              <MaicTopicClassroomLink
                navigate={navigate}
                subject="O Level Mathematics"
                gradeLevel={topic.formLevel}
                topicName={topic.name}
              />
            </div>
          </div>
        </section>

        {openGraphPractice && (
          <section className="math-topic-hub__section">
            <button
              type="button"
              className="math-topic-hub__action"
              onClick={() => navigate('/app/mathematics/graph-practice')}
            >
              <span className="math-topic-hub__action-icon math-topic-hub__action-icon--graph">
                <TrendingUp size={20} aria-hidden />
              </span>
              <span className="math-topic-hub__action-body">
                <span className="math-topic-hub__action-title">Graph practice</span>
                <span className="math-topic-hub__action-sub">Plotting and reading coordinates</span>
              </span>
            </button>
          </section>
        )}

        <section className="math-topic-hub__section" aria-labelledby="mth-labs-label">
          <h2 id="mth-labs-label" className="math-topic-hub__section-label">
            Virtual labs
          </h2>
          <p className="math-topic-hub__desc" style={{ marginBottom: 14 }}>
            Hands-on simulations matched to this topic. Open one below or browse the full math lab library.
          </p>
          <div className="math-topic-hub__labs">
            {labs.map((lab) => (
              <Link key={lab.id} to={`/app/virtual-lab/${lab.id}`} className="math-topic-hub__lab">
                <div>
                  <div className="math-topic-hub__lab-title">{lab.title}</div>
                  <div className="math-topic-hub__lab-meta">{lab.estimatedTime}</div>
                </div>
                <ChevronRight className="math-topic-hub__lab-chev" size={18} aria-hidden />
              </Link>
            ))}
          </div>
          <Link to="/app/virtual-lab?subject=mathematics" className="math-topic-hub__browse-labs">
            <Atom size={16} aria-hidden />
            Browse all mathematics labs
          </Link>
        </section>
      </div>

      {practiceOpen && (
        <div
          className="math-topic-hub__modal-overlay"
          role="presentation"
          onClick={() => !generating && setPracticeOpen(false)}
        >
          <div
            className="math-topic-hub__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mth-practice-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="math-topic-hub__modal-x"
              onClick={() => setPracticeOpen(false)}
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <div className="math-topic-hub__modal-head">
              <div className="math-topic-hub__modal-icon" aria-hidden>
                <Calculator size={28} />
              </div>
              <h2 id="mth-practice-title" className="math-topic-hub__modal-title">
                {topic.name}
              </h2>
              <p className="math-topic-hub__modal-sub">{topic.formLevel}</p>
            </div>
            <label className="math-topic-hub__modal-check-row">
              <input
                type="checkbox"
                checked={mixImages}
                onChange={(e) => setMixImages(e.target.checked)}
              />
              <span>Include image-based questions</span>
            </label>
            {error && (
              <div
                style={{
                  padding: 12,
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: 12,
                  marginBottom: 16,
                  color: '#FCA5A5',
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            )}
            <div className="math-topic-hub__modal-cost">
              <Info size={16} aria-hidden />
              <span>
                Cost: <strong>{formatCreditCost(creditCost)} per question</strong>
              </span>
            </div>
            <button
              type="button"
              className="math-topic-hub__modal-start"
              onClick={handleStartQuiz}
              disabled={generating || !hasEnoughCredits}
            >
              {generating ? 'Generating…' : 'Start practice'}
            </button>
          </div>
        </div>
      )}

      <AILoadingOverlay
        isVisible={generating}
        title="Generating question"
        subtitle={loadingSubtitle}
        progress={loadingProgress}
        accentColor={SUBJECT.color}
        variant="fullscreen"
      />
    </div>
  );
}
