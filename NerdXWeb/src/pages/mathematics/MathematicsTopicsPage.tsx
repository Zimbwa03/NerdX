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
  ArrowLeft, TrendingUp, Camera, MessageCircle, BookOpen,
  Calculator, FileText, Play, Atom, X, Info,
} from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import {
  mathFormLevels,
  getMathTopicsByForm,
  type MathFormLevel,
} from '../../data/oLevelMath/topics';
import '../sciences/ScienceUniverse.css';

const SUBJECT = {
  id: 'mathematics',
  name: 'O Level Mathematics',
  color: '#2979FF',
};

export function MathematicsTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [selectedForm, setSelectedForm] = useState<MathFormLevel>('Form 1');

  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
  const [mixImages, setMixImages] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formTopics = getMathTopicsByForm(selectedForm);
  const displayTopics = formTopics.map((t) => ({ id: t.id, name: t.name, subject: 'mathematics' } as Topic));

  const openStartQuiz = (topic: Topic) => {
    setPendingTopic(topic);
    setMixImages(false);
    setError(null);
    setStartQuizModalOpen(true);
  };

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

  const handleStartQuiz = async () => {
    if (!pendingTopic || !hasEnoughCredits) {
      if (!hasEnoughCredits) {
        setError(`You need at least ${formatCreditCost(minCredits)} to start. Please top up credits.`);
      }
      return;
    }

    setGenerating(true);
    setStartQuizModalOpen(false);
    setError(null);

    try {
      let question: Question | null = null;

      question = await quizApi.generateQuestionStream(
        'mathematics',
        pendingTopic.id,
        'medium',
        {},
        selectedForm,
      );

      if (!question) {
        question = await quizApi.generateQuestion(
          'mathematics',
          pendingTopic.id,
          'medium',
          'topical',
          undefined,
          undefined,
          undefined,
          mixImages,
          undefined,
          undefined,
          selectedForm,
        );
      }

      const creditsRemaining = (question as Question & { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) {
        updateUser({ credits: creditsRemaining });
      }

      const topicToPass = pendingTopic;
      setPendingTopic(null);
      navigate('/app/mathematics/quiz', {
        state: {
          question,
          subject: SUBJECT,
          topic: topicToPass,
          mixImagesEnabled: mixImages,
          formLevel: selectedForm,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate question');
    } finally {
      setGenerating(false);
    }
  };

  const notesTopics = getMathTopicsByForm(selectedForm).filter((t) => t.hasNotes);

  return (
    <div className="science-universe-page math">
      <div className="science-universe-bg math-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={24} />
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge" style={{ background: 'rgba(41, 121, 255, 0.15)', border: '1px solid rgba(41, 121, 255, 0.3)' }}>
          <Calculator size={14} />
          <span>O-LEVEL MATHEMATICS</span>
        </div>
        <h1 className="science-hero-title" style={{ background: 'linear-gradient(135deg, #2979FF, #448AFF, #82B1FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master the Universe<br />of Mathematics
        </h1>
        <p style={{ maxWidth: 600, margin: '0 auto', opacity: 0.8 }}>
          AI-powered tutoring, real-time feedback, and exam-grade practice from Form 1 to Form 4.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
          {mathFormLevels.map((form) => (
            <button
              key={form}
              type="button"
              onClick={() => setSelectedForm(form)}
              style={{
                padding: '10px 22px',
                borderRadius: 50,
                border: `2px solid ${selectedForm === form ? '#2979FF' : 'rgba(255,255,255,0.15)'}`,
                background: selectedForm === form ? 'rgba(41, 121, 255, 0.25)' : 'rgba(255,255,255,0.05)',
                color: selectedForm === form ? '#82B1FF' : 'rgba(255,255,255,0.7)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(8px)',
              }}
            >
              {form}
            </button>
          ))}
        </div>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div
            className="science-feature-card"
            onClick={() => navigate('/app/teacher', { state: { subject: 'O Level Mathematics', gradeLevel: 'Form 3-4 (O-Level)' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(0, 230, 118, 0.15)' }}>
              <MessageCircle size={28} color="#00E676" />
            </div>
            <h3 className="feature-card-title">AI Math Tutor</h3>
            <p className="feature-card-desc">Interactive Socratic tutoring. Ask any question and get instant, step-by-step guidance.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/mathematics/graph-practice')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(255, 145, 0, 0.15)' }}>
              <TrendingUp size={28} color="#FF9100" />
            </div>
            <h3 className="feature-card-title">Graph Practice</h3>
            <p className="feature-card-desc">Master coordinate geometry. Practice reading, plotting, and analyzing graphs.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/mathematics/scan-solve')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(124, 77, 255, 0.15)' }}>
              <Camera size={28} color="#7C4DFF" />
            </div>
            <h3 className="feature-card-title">Scan & Solve</h3>
            <p className="feature-card-desc">Snap a photo of any math problem. Our AI solves it instantly with working.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/virtual-lab?subject=mathematics')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(41, 121, 255, 0.15)' }}>
              <Atom size={28} color="#2979FF" />
            </div>
            <h3 className="feature-card-title">Virtual Lab</h3>
            <p className="feature-card-desc">Interactive simulations for calculus, graphs, probability, and vectors.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'mathematics', backTo: '/app/mathematics', subjectLabel: 'Mathematics' } })}
          >
            <div className="feature-icon-box" style={{ background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.3), rgba(101, 31, 255, 0.3))' }}>
              <FileText size={28} color="#B388FF" />
            </div>
            <h3 className="feature-card-title">Simulated Exam</h3>
            <p className="feature-card-desc">Full timed exam conditions. Test your readiness with past-paper style questions.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Play size={24} style={{ color: '#448AFF' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Practice Topics – {selectedForm}</span>
            <span className="topics-count-badge" style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
              {displayTopics.length} Topics
            </span>
          </div>

          <p style={{ marginBottom: 20, opacity: 0.7 }}>
            Select a topic to practice <strong>ZIMSEC-aligned questions</strong> for {selectedForm}. Each question is AI-generated with step-by-step solutions and detailed marking.
          </p>

          {!hasEnoughCredits && (
            <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, marginBottom: 20, color: '#FCA5A5', fontSize: 14 }}>
              You need at least {formatCreditCost(minCredits)} to generate a question.
            </div>
          )}

          <div className="science-topics-grid">
            {displayTopics.map((topic) => (
              <div
                key={topic.id}
                className="science-topic-card"
                onClick={() => openStartQuiz(topic)}
              >
                <div className="topic-icon-small">
                  <Calculator size={20} />
                </div>
                <span className="topic-card-name">{topic.name}</span>
              </div>
            ))}
          </div>

          {notesTopics.length > 0 && (
            <>
              <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 60, marginBottom: 24 }}>
                <BookOpen size={24} style={{ color: '#82B1FF' }} />
                <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes – {selectedForm}</span>
              </div>

              <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {notesTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/app/mathematics/notes/${encodeURIComponent(topic.name.replace(/\s+/g, '-'))}`}
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
            </>
          )}
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
                width: 60, height: 60, background: 'rgba(41, 121, 255, 0.2)',
                borderRadius: 16, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#448AFF',
              }}>
                <Calculator size={32} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{pendingTopic.name}</h2>
              <p style={{ opacity: 0.7, marginTop: 8 }}>ZIMSEC O-Level Mathematics</p>
              <p style={{ opacity: 0.5, marginTop: 4, fontSize: 13 }}>{selectedForm}</p>
            </div>

            <label style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
              borderRadius: 12, marginBottom: 20, cursor: 'pointer', fontSize: 14,
            }}>
              <input
                type="checkbox"
                checked={mixImages}
                onChange={(e) => setMixImages(e.target.checked)}
                style={{ accentColor: '#2979FF' }}
              />
              <span>Include image-based questions</span>
            </label>

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
                background: 'linear-gradient(135deg, #1565C0, #2979FF)',
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
        subtitle={`Creating a ${selectedForm} ZIMSEC mathematics question on ${pendingTopic?.name ?? 'this topic'}...`}
        accentColor={SUBJECT.color}
        variant="fullscreen"
      />
    </div>
  );
}
