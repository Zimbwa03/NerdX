/**
 * MathematicsTopicsPage - Premium Desktop Design
 * Features gradient cards, glassmorphism, and advanced desktop layout
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { ArrowLeft, TrendingUp, Camera, MessageCircle, BookOpen, Calculator, FileText, Play, Atom } from 'lucide-react';
import './Mathematics.css'; // Import the new premium styles

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
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayTopics = topics.length ? topics : MATH_TOPICS_FALLBACK;

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
    // ... keeping existing handleStartQuiz logic ...
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
    <div className="math-universe-page">
      {/* Animated Space Background */}
      <div className="math-universe-background">
        <div className="math-grid-overlay"></div>
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={24} />
      </Link>

      {/* Hero Section */}
      <div className="math-hero">
        <div className="math-hero-content">
          <div className="math-hero-badge">
            <Calculator size={14} />
            <span>O-LEVEL MASTERY</span>
          </div>
          <h1 className="math-hero-title">
            Unlock the Universe<br />of Mathematics
          </h1>
          <p className="math-hero-subtitle">
            Master every concept with AI-powered tutoring, real-time feedback,
            and exam-grade practice questions from the future.
          </p>
        </div>

        {/* Visual Decoration (Right Side) */}
        <div className="math-hero-visual">
          {/* Decorative Only - Icons handled via CSS */}
        </div>
      </div>

      <div className="math-content-container">
        {/* Left Column: Premium Feature Cards */}
        <div className="math-features-col">

          {/* AI Math Tutor */}
          <div
            className="glass-card"
            role="button"
            onClick={() => navigate('/app/teacher', { state: { subject: 'O Level Mathematics', gradeLevel: 'Form 3-4 (O-Level)' } })}
          >
            <div className="feature-icon-wrapper" style={{ color: '#00E676', borderColor: 'rgba(0, 230, 118, 0.3)' }}>
              <MessageCircle size={32} />
            </div>
            <h3 className="feature-title">AI Math Tutor</h3>
            <p className="feature-desc">Interactive Socratic tutoring. Ask any question and get instant, step-by-step guidance.</p>
          </div>

          {/* Graph Practice */}
          <div
            className="glass-card"
            role="button"
            onClick={() => navigate('/app/mathematics/graph-practice')}
          >
            <div className="feature-icon-wrapper" style={{ color: '#FF9100', borderColor: 'rgba(255, 145, 0, 0.3)' }}>
              <TrendingUp size={32} />
            </div>
            <h3 className="feature-title">Graph Practice</h3>
            <p className="feature-desc">Master coordinate geometry. Practice reading, plotting, and analyzing graphs.</p>
          </div>

          {/* Scan & Solve */}
          <div
            className="glass-card"
            role="button"
            onClick={() => navigate('/app/mathematics/scan-solve')}
          >
            <div className="feature-icon-wrapper" style={{ color: '#7C4DFF', borderColor: 'rgba(124, 77, 255, 0.3)' }}>
              <Camera size={32} />
            </div>
            <div className="feature-badge-row" style={{ marginBottom: 8 }}>
              <h3 className="feature-title" style={{ margin: 0 }}>Scan & Solve</h3>
              <span className="online-badge">ONLINE</span>
            </div>
            <p className="feature-desc">Snap a photo of any math problem. Our AI solves it instantly with working.</p>
          </div>

          {/* Virtual Lab */}
          <div
            className="glass-card"
            role="button"
            onClick={() => navigate('/app/virtual-lab?subject=mathematics')}
          >
            <div className="feature-icon-wrapper" style={{ color: '#2979FF', borderColor: 'rgba(41, 121, 255, 0.3)' }}>
              <Atom size={32} />
            </div>
            <div className="feature-badge-row" style={{ marginBottom: 8 }}>
              <h3 className="feature-title" style={{ margin: 0 }}>Virtual Lab</h3>
              <span className="online-badge" style={{ background: 'rgba(41, 121, 255, 0.2)', color: '#2979FF', border: '1px solid rgba(41, 121, 255, 0.3)' }}>CALCULUS &amp; ALGEBRA</span>
            </div>
            <p className="feature-desc">Interactive simulations for calculus, graphs, probability, and vectors.</p>
          </div>

          {/* Exam Mode - Featured */}
          <div
            className="glass-card exam-glass-card"
            role="button"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'mathematics', backTo: '/app/mathematics', subjectLabel: 'Mathematics' } })}
          >
            <div className="feature-icon-wrapper" style={{ background: 'linear-gradient(135deg, #7C4DFF, #651FFF)', border: 'none', color: '#fff' }}>
              <FileText size={32} />
            </div>
            <h3 className="feature-title">Simulated Exam</h3>
            <p className="feature-desc">Full timed exam conditions. Test your readiness with mixed past-paper style questions.</p>
          </div>

        </div>

        {/* Right Column: Topics Grid */}
        <div className="math-topics-col">
          <div className="topics-section-title">
            <Play size={24} color="#448AFF" fill="#448AFF" />
            <span>Practice Topics</span>
            <span className="topics-count-badge">{displayTopics.length} Topics</span>
          </div>

          <div className="math-topics-grid">
            {displayTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="topic-glass-btn"
                onClick={() => openStartQuiz(topic)}
              >
                <div className="topic-icon-box">
                  {/* Map icons based on topic name keywords if desired, defaulting to calculator/generic */}
                  {topic.name.includes("Geo") ? <TrendingUp size={20} /> :
                    topic.name.includes("Stat") ? <TrendingUp size={20} /> :
                      <Calculator size={20} />}
                </div>
                <span className="topic-name">{topic.name}</span>
              </button>
            ))}
          </div>

          <div className="topics-section-title" style={{ marginTop: 40 }}>
            <BookOpen size={24} color="#00E676" />
            <span>Study Notes</span>
          </div>
          <div className="topic-chips-v2" style={{ marginTop: 16 }}>
            {displayTopics.map((t, i) => (
              <Link
                key={i}
                to={`/app/mathematics/notes/${encodeURIComponent(t.name.replace(/\s+/g, '-'))}`}
                className="topic-chip-v2"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {t.name}
              </Link>
            ))}
          </div>

        </div>
      </div>

      {/* Reusing existing Modal Logic with new styling classes if possible, 
          but the modal uses classes from index.css. 
          To keep it consistent, we'll wrap it or override it in Mathematics.css if needed. 
          For now, standard modal is fine, but let's check class names. 
      */}
      {startQuizModalOpen && (
        <div className="modal-overlay-v2" onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="modal-v2" onClick={(e) => e.stopPropagation()} style={{ background: '#131420', borderColor: '#2b2d42' }}>
            <h3 className="modal-title">
              {pendingTopic ? `Practice: ${pendingTopic.name}` : 'Start Mathematics Exam'}
            </h3>
            {/* ... keeping modal content same ... */}
            <div className="modal-options">
              <button
                type="button"
                className={`modal-option ${quizMode === 'topical' ? 'active' : ''}`}
                onClick={() => setQuizMode('topical')}
              >
                Topical
              </button>
              <button
                type="button"
                className={`modal-option ${quizMode === 'exam' ? 'active' : ''}`}
                onClick={() => setQuizMode('exam')}
              >
                Exam
              </button>
            </div>
            <label className="modal-toggle">
              <input
                type="checkbox"
                checked={mixImages}
                onChange={(e) => setMixImages(e.target.checked)}
              />
              <span>Visual learning (mix image questions)</span>
            </label>
            <p className="modal-cost">
              Cost: {formatCreditCost(creditCost)} per question
            </p>
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel"
                onClick={() => !generating && setStartQuizModalOpen(false)}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-start"
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

