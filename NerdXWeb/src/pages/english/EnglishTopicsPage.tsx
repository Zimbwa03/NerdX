/**
 * EnglishTopicsPage - Premium Desktop Design
 * Features gradient cards, glassmorphism, and advanced desktop layout
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { ArrowLeft, BookOpen, PenLine, MessageSquare, ClipboardList, GraduationCap } from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { useAuth } from '../../context/AuthContext';

const ENGLISH_TOPICS_FALLBACK: Topic[] = [
  { id: 'grammar', name: 'Grammar Usage and Vocabulary', subject: 'english' },
  { id: 'vocabulary', name: 'Vocabulary', subject: 'english' },
  { id: 'comprehension_skills', name: 'Comprehension Skills', subject: 'english' },
];

const SUBJECT = {
  id: 'english',
  name: 'English',
  color: '#FF9100',
};

export function EnglishTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
  const [quizMode, setQuizMode] = useState<'topical' | 'exam'>('topical');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('english');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(ENGLISH_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(ENGLISH_TOPICS_FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayTopics = topics.length ? topics : ENGLISH_TOPICS_FALLBACK;

  const openStartQuiz = (topic: Topic | null) => {
    setPendingTopic(topic);
    setQuizMode(topic ? 'topical' : 'exam');
    setError(null);
    setStartQuizModalOpen(true);
  };

  const creditCost = calculateQuizCreditCost({
    subject: 'english',
    questionType: pendingTopic ? 'topical' : 'exam',
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: 'english',
    questionType: pendingTopic ? 'topical' : 'exam',
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
      // English does not support streaming (backend only streams for mathematics). Use generate endpoint only.
      const question = await quizApi.generateQuestion(
        'english',
        useTopic?.id,
        'medium',
        useTopic ? 'topical' : 'exam'
      );

      if (!question) {
        setError('No question was generated. Please try again.');
        return;
      }

      const creditsRemaining = (question as { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) {
        updateUser({ credits: creditsRemaining });
      }

      setStartQuizModalOpen(false);
      const topicToPass = useTopic ?? undefined;
      setPendingTopic(null);
      navigate('/app/quiz', {
        state: {
          question,
          subject: { id: 'english', name: 'English', color: SUBJECT.color },
          topic: topicToPass,
          mixImagesEnabled: false,
          backTo: '/app/english',
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
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="subject-page-v2">
      {/* Header */}
      <header className="subject-header-v2">
        <Link to="/app" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9100, #FF6D00)' }}>
            <BookOpen size={28} />
          </div>
          <div>
            <h1>English Language</h1>
            <p>Read, write & communicate effectively</p>
          </div>
        </div>
      </header>

      {/* Main content grid - desktop optimized */}
      <div className="subject-content-grid">
        {/* Left column - Features */}
        <div className="subject-features-col">
          {/* AI Features */}
          <section className="subject-section-v2">
            <h2>English Skills</h2>
            <div className="feature-cards-v2">
              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/english/comprehension')}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #FF5252, #D50000)' }}>
                  <BookOpen size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Comprehension</h3>
                  <p>AI-generated passages with 10 questions & summary</p>
                </div>
                <span className="feature-arrow">→</span>
              </button>

              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/english/essay')}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #7C4DFF, #651FFF)' }}>
                  <PenLine size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Essay Writing</h3>
                  <p>Free response, guided composition & mark essay</p>
                </div>
                <span className="feature-arrow">→</span>
              </button>

              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/teacher', { state: { subject: 'English', gradeLevel: 'Form 3-4 (O-Level)' } })}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #00E676, #00C853)' }}>
                  <MessageSquare size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>AI English Tutor</h3>
                  <p>Interactive Socratic tutoring for grammar & writing</p>
                </div>
                <span className="feature-arrow">→</span>
              </button>
            </div>
          </section>

          {/* Exam Mode */}
          <section className="subject-section-v2">
            <h2>Exam Practice</h2>
            <button
              type="button"
              className="exam-card-v2"
              onClick={() =>
                navigate('/app/exam/setup', {
                  state: { subject: 'english', backTo: '/app/english', subjectLabel: 'English' },
                })
              }
            >
              <div className="exam-card-icon" style={{ background: 'linear-gradient(135deg, #FF9100, #EF6C00)' }}>
                <ClipboardList size={28} />
              </div>
              <div className="exam-card-text">
                <h3>Start Exam</h3>
                <p>Timed exam with mixed questions from all topics</p>
              </div>
              <span className="feature-arrow">→</span>
            </button>
          </section>
        </div>

        {/* Right column - Topics Grid */}
        <div className="subject-topics-col">
          <section className="subject-section-v2">
            <h2>Grammar & Quiz Topics</h2>
            <p className="section-subtitle">Practice topical or exam-style questions</p>
            {loading ? (
              <div className="loading-state">Loading topics…</div>
            ) : (
              <div className="topics-grid-v2">
                {displayTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className="topic-card-v2"
                    onClick={() => openStartQuiz(topic)}
                  >
                    <div className="topic-card-icon" style={{ background: 'linear-gradient(135deg, #FF9100, #FF6D00)' }}>
                      <GraduationCap size={18} />
                    </div>
                    <span className="topic-card-name">{topic.name}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Start Quiz Modal */}
      {startQuizModalOpen && (
        <div className="modal-overlay-v2" onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="modal-v2" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              {pendingTopic ? `Practice: ${pendingTopic.name}` : 'Start English Quiz'}
            </h3>
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
      <AILoadingOverlay
        isVisible={generating}
        title="Generating Question"
        subtitle="Creating your practice question"
        accentColor="#667eea"
        variant="fullscreen"
      />
    </div>
  );
}
