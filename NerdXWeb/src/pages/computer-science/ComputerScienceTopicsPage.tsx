import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { ArrowLeft, BookOpen, MessageSquare, ClipboardList, Cpu } from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { useAuth } from '../../context/AuthContext';

const CS_TOPICS_FALLBACK: Topic[] = [
  { id: 'hardware_and_software', name: 'Hardware and Software', subject: 'computer_science' },
  { id: 'application_of_computer_science', name: 'Application of Computer Science', subject: 'computer_science' },
  { id: 'data_representation', name: 'Data Representation', subject: 'computer_science' },
  { id: 'programming', name: 'Programming', subject: 'computer_science' },
  { id: 'databases', name: 'Databases', subject: 'computer_science' },
];

const SUBJECT = {
  id: 'computer_science',
  name: 'Computer Science',
  color: '#0288D1',
};

type Board = 'zimsec' | 'cambridge';
type QuestionFormat = 'mcq' | 'structured' | 'essay';

export function ComputerScienceTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [board, setBoard] = useState<Board>('zimsec');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
  const [questionFormat, setQuestionFormat] = useState<QuestionFormat>('mcq');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('computer_science', undefined, board);
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(CS_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(CS_TOPICS_FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [board]);

  const displayTopics = topics.length ? topics : CS_TOPICS_FALLBACK;

  const openStartQuiz = (topic: Topic | null) => {
    setPendingTopic(topic);
    setQuestionFormat('mcq');
    setError(null);
    setStartQuizModalOpen(true);
  };

  const creditCost = calculateQuizCreditCost({
    subject: 'computer_science',
    questionType: 'topical',
    questionFormat,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: 'computer_science',
    questionType: 'topical',
    questionFormat,
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
      const useTopic = pendingTopic;
      const question = await quizApi.generateQuestion(
        'computer_science',
        useTopic?.id,
        'medium',
        'topical',
        undefined,
        undefined,
        questionFormat,
        undefined,
        undefined,
        board
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
      setPendingTopic(null);
      navigate('/app/quiz', {
        state: {
          question,
          subject: { id: 'computer_science', name: 'Computer Science', color: SUBJECT.color },
          topic: useTopic ?? undefined,
          mixImagesEnabled: false,
          backTo: '/app/computer-science',
          board,
          questionFormat,
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
    <div className="cs-topics-page">
      <header className="cs-topics-header">
        <Link to="/app" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="cs-topics-title">Computer Science</h1>
        <p className="cs-topics-subtitle">ZimSec & Cambridge O Level</p>
      </header>

      {/* Board toggle */}
      <section className="cs-board-section">
        <span className="cs-board-label">Syllabus</span>
        <div className="cs-board-toggle">
          <button
            type="button"
            className={`cs-board-btn ${board === 'zimsec' ? 'active' : ''}`}
            onClick={() => setBoard('zimsec')}
          >
            ZimSec
          </button>
          <button
            type="button"
            className={`cs-board-btn ${board === 'cambridge' ? 'active' : ''}`}
            onClick={() => setBoard('cambridge')}
          >
            Cambridge
          </button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="cs-features-section">
        <button
          type="button"
          className="cs-feature-card cs-feature-notes"
          onClick={() => navigate('/app/computer-science/notes', { state: { board } })}
        >
          <div className="cs-feature-icon cs-feature-icon-notes">
            <BookOpen size={28} />
          </div>
          <div className="cs-feature-content">
            <h3>Computer Science Notes</h3>
            <p>Comprehensive notes for all topics</p>
          </div>
          <span className="cs-feature-arrow">→</span>
        </button>

        <button
          type="button"
          className="cs-feature-card"
          onClick={() => navigate('/app/teacher', { state: { subject: 'Computer Science', gradeLevel: 'Form 3-4 (O-Level)' } })}
        >
          <div className="cs-feature-icon">
            <MessageSquare size={28} />
          </div>
          <div className="cs-feature-content">
            <h3>AI Tutor</h3>
            <p>Interactive tutoring for Computer Science topics</p>
          </div>
          <span className="cs-feature-arrow">→</span>
        </button>

        <button type="button" className="cs-feature-card cs-feature-labs" onClick={() => {}} disabled>
          <div className="cs-feature-icon cs-feature-icon-labs">
            <Cpu size={28} />
          </div>
          <div className="cs-feature-content">
            <h3>Virtual Labs</h3>
            <p>Coming soon – interactive experiments</p>
          </div>
          <span className="cs-feature-arrow">→</span>
        </button>
      </section>

      {/* Start Exam */}
      <section className="cs-exam-section">
        <button
          type="button"
          className="cs-exam-card"
          onClick={() =>
            navigate('/app/exam/setup', {
              state: { subject: 'computer_science', backTo: '/app/computer-science', subjectLabel: 'Computer Science' },
            })
          }
        >
          <div className="cs-exam-icon">
            <ClipboardList size={32} />
          </div>
          <div className="cs-exam-content">
            <h3>Start Exam</h3>
            <p>Timed exam with mixed questions from all topics</p>
          </div>
          <span className="cs-feature-arrow">→</span>
        </button>
      </section>

      {/* Topics grid for Quiz */}
      <section className="cs-topics-section">
        <h2 className="cs-section-title">Quiz – Practice by Topic</h2>
        <p className="cs-section-subtitle">Choose a topic and question type (MCQ, Structured, Essay)</p>
        {loading ? (
          <div className="cs-loading">Loading topics…</div>
        ) : (
          <div className="cs-topics-grid">
            {displayTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="cs-topic-card"
                onClick={() => openStartQuiz(topic)}
              >
                <span className="cs-topic-name">{topic.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Start Quiz Modal */}
      {startQuizModalOpen && (
        <div className="cs-modal-overlay" onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="cs-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="cs-modal-title">
              {pendingTopic ? pendingTopic.name : 'Computer Science Quiz'}
            </h3>
            <p className="cs-modal-subtitle">Choose question type</p>
            <div className="cs-modal-options cs-modal-options-format">
              <button
                type="button"
                className={`cs-modal-option ${questionFormat === 'mcq' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('mcq')}
              >
                MCQ
              </button>
              <button
                type="button"
                className={`cs-modal-option ${questionFormat === 'structured' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('structured')}
              >
                Structured
              </button>
              <button
                type="button"
                className={`cs-modal-option ${questionFormat === 'essay' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('essay')}
              >
                Essay
              </button>
            </div>
            <p className="cs-modal-cost">
              Cost: {formatCreditCost(creditCost)} per question
            </p>
            {error && <p className="cs-modal-error">{error}</p>}
            <div className="cs-modal-actions">
              <button
                type="button"
                className="cs-modal-cancel"
                onClick={() => !generating && setStartQuizModalOpen(false)}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cs-modal-start"
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
        accentColor={SUBJECT.color}
        variant="fullscreen"
      />
    </div>
  );
}
