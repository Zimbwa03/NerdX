/**
 * HistoryTopicsPage - Premium Desktop Design
 * Features gradient cards, glassmorphism, and advanced desktop layout
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { ArrowLeft, BookOpen, MessageSquare, ClipboardList, TrendingUp, GraduationCap, Scroll } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { historyTopicNames } from '../../data/historyNotes/notes';

const HISTORY_TOPICS_FALLBACK: Topic[] = historyTopicNames.map((name) => ({
  id: name.toLowerCase().replace(/ /g, '_').replace(/-/g, '_'),
  name,
  subject: 'history',
}));

const SUBJECT = {
  id: 'history',
  name: 'History',
  color: '#5D4037',
};

export function HistoryTopicsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('history');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(HISTORY_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(HISTORY_TOPICS_FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayTopics = topics.length ? topics : HISTORY_TOPICS_FALLBACK;
  const minCredits = getMinimumCreditsForQuiz({
    subject: 'history',
    questionType: 'topical',
    questionFormat: 'essay',
  });
  const userCredits = user?.credits ?? 0;
  const hasEnoughCredits = userCredits >= minCredits;

  const handleTopicClick = (topic: Topic) => {
    navigate('/app/history/essay', {
      state: {
        topic: { id: topic.id, name: topic.name },
        subject: { id: SUBJECT.id, name: SUBJECT.name, color: SUBJECT.color },
        backTo: '/app/history',
      },
    });
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
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #795548, #5D4037)' }}>
            <Scroll size={28} />
          </div>
          <div>
            <h1>History</h1>
            <p>ZIMSEC O-Level History – Paper 1 Essays</p>
          </div>
        </div>
      </header>

      {/* Main content grid - desktop optimized */}
      <div className="subject-content-grid">
        {/* Left column - Features */}
        <div className="subject-features-col">
          {/* History Features */}
          <section className="subject-section-v2">
            <h2>History Skills</h2>
            <div className="feature-cards-v2">
              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/history/notes')}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #8D6E63, #6D4C41)' }}>
                  <BookOpen size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>History Notes</h3>
                  <p>Comprehensive notes for all topics</p>
                </div>
                <span className="feature-arrow">→</span>
              </button>

              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/teacher', { state: { subject: 'History', gradeLevel: 'Form 3-4 (O-Level)' } })}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #7C4DFF, #651FFF)' }}>
                  <MessageSquare size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>AI Tutor</h3>
                  <p>Interactive tutoring for History</p>
                </div>
                <span className="feature-arrow">→</span>
              </button>

              <button type="button" className="feature-card-v2" onClick={() => { }} disabled>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #FF6D00, #DD2C00)', opacity: 0.5 }}>
                  <TrendingUp size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Virtual Labs</h3>
                  <p>Coming soon – History simulations</p>
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
                  state: { subject: 'history', backTo: '/app/history', subjectLabel: 'History' },
                })
              }
            >
              <div className="exam-card-icon" style={{ background: 'linear-gradient(135deg, #8D6E63, #6D4C41)' }}>
                <ClipboardList size={28} />
              </div>
              <div className="exam-card-text">
                <h3>Start Exam</h3>
                <p>Timed exam – Essay questions only</p>
              </div>
              <span className="feature-arrow">→</span>
            </button>
          </section>
        </div>

        {/* Right column - Topics Grid */}
        <div className="subject-topics-col">
          <section className="subject-section-v2">
            <h2>Topical Questions</h2>
            <p className="section-subtitle">Choose a topic – Paper 1 Essays (3-part ZIMSEC format)</p>
            {!hasEnoughCredits && (
              <p className="modal-cost" style={{ marginBottom: '0.5rem' }}>
                You need at least {formatCreditCost(minCredits)} to generate a question.
              </p>
            )}
            {loading ? (
              <div className="loading-state">Loading topics…</div>
            ) : (
              <div className="topics-grid-v2">
                {displayTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className="topic-card-v2"
                    onClick={() => handleTopicClick(topic)}
                  >
                    <div className="topic-card-icon" style={{ background: 'linear-gradient(135deg, #8D6E63, #6D4C41)' }}>
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
    </div>
  );
}
