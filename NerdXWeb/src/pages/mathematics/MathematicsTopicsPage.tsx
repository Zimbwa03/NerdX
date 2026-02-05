import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { ArrowLeft, TrendingUp, Camera, MessageCircle } from 'lucide-react';

const MATH_TOPICS_FALLBACK: Topic[] = [
  { id: 'num', name: 'Number Theory', subject: 'mathematics' },
  { id: 'sets', name: 'Sets', subject: 'mathematics' },
  { id: 'ind', name: 'Indices & Standard Form', subject: 'mathematics' },
  { id: 'alg', name: 'Algebra', subject: 'mathematics' },
  { id: 'ineq', name: 'Inequalities', subject: 'mathematics' },
  { id: 'seq', name: 'Sequences & Series', subject: 'mathematics' },
  { id: 'mat', name: 'Matrices', subject: 'mathematics' },
  { id: 'vec', name: 'Vectors', subject: 'mathematics' },
  { id: 'geo', name: 'Geometry', subject: 'mathematics' },
  { id: 'mens', name: 'Mensuration', subject: 'mathematics' },
  { id: 'trig', name: 'Trigonometry', subject: 'mathematics' },
  { id: 'trans', name: 'Transformation Geometry', subject: 'mathematics' },
  { id: 'stat', name: 'Statistics', subject: 'mathematics' },
  { id: 'prob', name: 'Probability', subject: 'mathematics' },
  { id: 'graph', name: 'Graphs', subject: 'mathematics' },
  { id: 'var', name: 'Variation', subject: 'mathematics' },
  { id: 'loci', name: 'Loci & Construction', subject: 'mathematics' },
];

const SUBJECT = {
  id: 'mathematics',
  name: 'O Level Mathematics',
  color: '#2979FF',
};

export function MathematicsTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
  const [quizMode, setQuizMode] = useState<'topical' | 'exam'>('topical');
  const [mixImages, setMixImages] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('mathematics');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(MATH_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(MATH_TOPICS_FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayTopics = topics.length ? topics : MATH_TOPICS_FALLBACK;
  const topicNames = displayTopics.map((t) => t.name);

  const openStartQuiz = (topic: Topic | null) => {
    setPendingTopic(topic);
    setQuizMode(topic ? 'topical' : 'exam');
    setMixImages(false);
    setError(null);
    setStartQuizModalOpen(true);
  };

  const creditCost = calculateQuizCreditCost({
    subject: 'mathematics',
    questionType: pendingTopic ? 'topical' : 'exam',
    isImageQuestion: mixImages,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: 'mathematics',
    questionType: pendingTopic ? 'topical' : 'exam',
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
      const useTopic = quizMode === 'topical' ? pendingTopic : null;
      const canStream = !!useTopic?.id;
      let question = null;

      if (canStream) {
        question = await quizApi.generateQuestionStream(
          'mathematics',
          useTopic!.id,
          'medium',
          {}
        );
      }
      if (!question) {
        question = await quizApi.generateQuestion(
          'mathematics',
          useTopic?.id,
          'medium',
          useTopic ? 'topical' : 'exam',
          undefined,
          undefined,
          undefined,
          mixImages
        );
      }

      const creditsRemaining = (question as { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) {
        updateUser({ credits: creditsRemaining });
      }

      setStartQuizModalOpen(false);
      const topicToPass = useTopic ?? undefined;
      setPendingTopic(null);
      navigate('/app/mathematics/quiz', {
        state: {
          question,
          subject: SUBJECT,
          topic: topicToPass,
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
    <div className="math-topics-page">
      <header className="math-topics-header">
        <Link to="/app" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="math-topics-title">O Level Mathematics</h1>
        <p className="math-topics-subtitle">Build strong math foundations</p>
      </header>

      {/* Math Notes */}
      <section className="math-notes-section">
        <h2 className="math-section-title">Professional Math Notes</h2>
        <p className="math-section-subtitle">O-Level Standard – tap to study</p>
        <div className="math-notes-chips">
          {topicNames.map((name, i) => (
            <Link
              key={i}
              to={`/app/mathematics/notes/${encodeURIComponent(name.replace(/\s+/g, '-'))}`}
              className="math-topic-chip"
            >
              {name}
            </Link>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="math-features-section">
        <button
          type="button"
          className="math-feature-card"
          onClick={() => navigate('/app/teacher', { state: { subject: 'O Level Mathematics', gradeLevel: 'Form 3-4 (O-Level)' } })}
        >
          <div className="math-feature-icon">
            <MessageCircle size={28} />
          </div>
          <div className="math-feature-content">
            <h3>AI Math Tutor</h3>
            <p>Interactive Socratic tutoring with graphs</p>
          </div>
          <span className="math-feature-arrow">→</span>
        </button>

        <button
          type="button"
          className="math-feature-card"
          onClick={() => navigate('/app/mathematics/graph-practice')}
        >
          <div className="math-feature-icon">
            <TrendingUp size={28} />
          </div>
          <div className="math-feature-content">
            <h3>Graph Practice</h3>
            <p>Practice reading and analyzing graphs</p>
          </div>
          <span className="math-feature-arrow">→</span>
        </button>

        <button
          type="button"
          className="math-feature-card math-feature-scan"
          onClick={() => navigate('/app/mathematics/scan-solve')}
        >
          <div className="math-feature-icon math-feature-icon-scan">
            <Camera size={28} />
          </div>
          <div className="math-feature-content">
            <div className="math-feature-badge-row">
              <h3>Scan & Solve</h3>
              <span className="math-badge-online">ONLINE</span>
            </div>
            <p>Upload a photo of any math problem – AI solves it</p>
          </div>
          <span className="math-feature-arrow">→</span>
        </button>
      </section>

      {/* Exam card - same flow as mobile (setup → session → review) */}
      <section className="math-exam-section">
        <button
          type="button"
          className="math-exam-card"
          onClick={() =>
            navigate('/app/exam/setup', {
              state: { subject: 'mathematics', backTo: '/app/mathematics', subjectLabel: 'Mathematics' },
            })
          }
        >
          <div className="math-exam-icon">📝</div>
          <div className="math-exam-content">
            <h3>Start Exam</h3>
            <p>Timed exam with mixed questions from all topics</p>
          </div>
          <span className="math-feature-arrow">→</span>
        </button>
      </section>

      {/* Topics grid */}
      <section className="math-topics-section">
        <h2 className="math-section-title">Topics</h2>
        {loading ? (
          <div className="math-loading">Loading topics…</div>
        ) : (
          <div className="math-topics-grid">
            {displayTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="math-topic-card"
                onClick={() => openStartQuiz(topic)}
              >
                <span className="math-topic-name">{topic.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Start Quiz Modal */}
      {startQuizModalOpen && (
        <div className="math-modal-overlay" onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="math-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="math-modal-title">
              {pendingTopic ? `Practice: ${pendingTopic.name}` : 'Start Mathematics Exam'}
            </h3>
            <div className="math-modal-options">
              <button
                type="button"
                className={`math-modal-option ${quizMode === 'topical' ? 'active' : ''}`}
                onClick={() => setQuizMode('topical')}
              >
                Topical
              </button>
              <button
                type="button"
                className={`math-modal-option ${quizMode === 'exam' ? 'active' : ''}`}
                onClick={() => setQuizMode('exam')}
              >
                Exam
              </button>
            </div>
            <label className="math-modal-toggle">
              <input
                type="checkbox"
                checked={mixImages}
                onChange={(e) => setMixImages(e.target.checked)}
              />
              <span>Visual learning (mix image questions)</span>
            </label>
            <p className="math-modal-cost">
              Cost: {formatCreditCost(creditCost)} per question
            </p>
            {error && <p className="math-modal-error">{error}</p>}
            <div className="math-modal-actions">
              <button
                type="button"
                className="math-modal-cancel"
                onClick={() => !generating && setStartQuizModalOpen(false)}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="math-modal-start"
                onClick={handleStartQuiz}
                disabled={generating || !hasEnoughCredits}
              >
                {generating ? 'Generating…' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
