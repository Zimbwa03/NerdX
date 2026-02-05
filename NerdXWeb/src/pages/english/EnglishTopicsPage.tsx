import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { ArrowLeft, BookOpen, PenLine, MessageSquare, ClipboardList } from 'lucide-react';
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
      const message = err instanceof Error ? err.message : 'Failed to generate question';
      setError(typeof message === 'string' ? message : 'Failed to generate question. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="english-topics-page">
      <header className="english-topics-header">
        <Link to="/app" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="english-topics-title">English</h1>
        <p className="english-topics-subtitle">Read, write & communicate</p>
      </header>

      {/* Feature cards: Comprehension, Essay, Tutor */}
      <section className="english-features-section">
        <button
          type="button"
          className="english-feature-card english-feature-comprehension"
          onClick={() => navigate('/app/english/comprehension')}
        >
          <div className="english-feature-icon english-feature-icon-comprehension">
            <BookOpen size={28} />
          </div>
          <div className="english-feature-content">
            <h3>Comprehension</h3>
            <p>AI-generated passages with 10 questions & summary • 2 credits</p>
          </div>
          <span className="english-feature-arrow">→</span>
        </button>

        <button
          type="button"
          className="english-feature-card english-feature-essay"
          onClick={() => navigate('/app/english/essay')}
        >
          <div className="english-feature-icon english-feature-icon-essay">
            <PenLine size={28} />
          </div>
          <div className="english-feature-content">
            <h3>Essay Writing</h3>
            <p>Free response, guided composition & mark essay • 2 credits</p>
          </div>
          <span className="english-feature-arrow">→</span>
        </button>

        <button
          type="button"
          className="english-feature-card"
          onClick={() => navigate('/app/teacher', { state: { subject: 'English', gradeLevel: 'Form 3-4 (O-Level)' } })}
        >
          <div className="english-feature-icon">
            <MessageSquare size={28} />
          </div>
          <div className="english-feature-content">
            <h3>AI English Tutor</h3>
            <p>Interactive Socratic tutoring for grammar & writing</p>
          </div>
          <span className="english-feature-arrow">→</span>
        </button>
      </section>

      {/* Start Exam */}
      <section className="english-exam-section">
        <button
          type="button"
          className="english-exam-card"
          onClick={() =>
            navigate('/app/exam/setup', {
              state: { subject: 'english', backTo: '/app/english', subjectLabel: 'English' },
            })
          }
        >
          <div className="english-exam-icon">
            <ClipboardList size={32} />
          </div>
          <div className="english-exam-content">
            <h3>Start Exam</h3>
            <p>Timed exam with mixed questions from all topics</p>
          </div>
          <span className="english-feature-arrow">→</span>
        </button>
      </section>

      {/* Topics grid for Quiz */}
      <section className="english-topics-section">
        <h2 className="english-section-title">Quiz – Grammar & Vocabulary</h2>
        <p className="english-section-subtitle">Practice topical or exam-style questions</p>
        {loading ? (
          <div className="english-loading">Loading topics…</div>
        ) : (
          <div className="english-topics-grid">
            {displayTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="english-topic-card"
                onClick={() => openStartQuiz(topic)}
              >
                <span className="english-topic-name">{topic.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Start Quiz Modal */}
      {startQuizModalOpen && (
        <div className="english-modal-overlay" onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="english-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="english-modal-title">
              {pendingTopic ? `Practice: ${pendingTopic.name}` : 'Start English Quiz'}
            </h3>
            <div className="english-modal-options">
              <button
                type="button"
                className={`english-modal-option ${quizMode === 'topical' ? 'active' : ''}`}
                onClick={() => setQuizMode('topical')}
              >
                Topical
              </button>
              <button
                type="button"
                className={`english-modal-option ${quizMode === 'exam' ? 'active' : ''}`}
                onClick={() => setQuizMode('exam')}
              >
                Exam
              </button>
            </div>
            <p className="english-modal-cost">
              Cost: {formatCreditCost(creditCost)} per question
            </p>
            {error && <p className="english-modal-error">{error}</p>}
            <div className="english-modal-actions">
              <button
                type="button"
                className="english-modal-cancel"
                onClick={() => !generating && setStartQuizModalOpen(false)}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="english-modal-start"
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

