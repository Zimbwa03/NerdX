import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { ArrowLeft, BookOpen, MessageSquare, ClipboardList, TrendingUp } from 'lucide-react';
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
    <div className="commerce-topics-page bes-topics-page history-topics-page">
      <header className="commerce-topics-header" style={{ borderLeftColor: SUBJECT.color }}>
        <Link to="/app" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="commerce-topics-title">History</h1>
        <p className="commerce-topics-subtitle">ZIMSEC O-Level History – Paper 1 Essays</p>
      </header>

      <section className="commerce-features-section">
        <button
          type="button"
          className="commerce-feature-card commerce-feature-notes"
          onClick={() => navigate('/app/history/notes')}
          style={{ borderLeftColor: SUBJECT.color }}
        >
          <div className="commerce-feature-icon commerce-feature-icon-notes" style={{ backgroundColor: `${SUBJECT.color}20` }}>
            <BookOpen size={28} color={SUBJECT.color} />
          </div>
          <div className="commerce-feature-content">
            <h3>History Notes</h3>
            <p>Comprehensive notes for all topics</p>
          </div>
          <span className="commerce-feature-arrow">→</span>
        </button>

        <button
          type="button"
          className="commerce-feature-card"
          onClick={() => navigate('/app/teacher', { state: { subject: 'History', gradeLevel: 'Form 3-4 (O-Level)' } })}
          style={{ borderLeftColor: SUBJECT.color }}
        >
          <div className="commerce-feature-icon" style={{ backgroundColor: `${SUBJECT.color}20` }}>
            <MessageSquare size={28} color={SUBJECT.color} />
          </div>
          <div className="commerce-feature-content">
            <h3>AI Tutor</h3>
            <p>Interactive tutoring for History</p>
          </div>
          <span className="commerce-feature-arrow">→</span>
        </button>

        <button type="button" className="commerce-feature-card commerce-feature-labs" onClick={() => {}} disabled style={{ borderLeftColor: SUBJECT.color }}>
          <div className="commerce-feature-icon commerce-feature-icon-labs" style={{ backgroundColor: `${SUBJECT.color}20` }}>
            <TrendingUp size={28} color={SUBJECT.color} />
          </div>
          <div className="commerce-feature-content">
            <h3>Virtual Labs</h3>
            <p>Coming soon – History simulations</p>
          </div>
          <span className="commerce-feature-arrow">→</span>
        </button>
      </section>

      <section className="commerce-exam-section">
        <button
          type="button"
          className="commerce-exam-card"
          onClick={() =>
            navigate('/app/exam/setup', {
              state: { subject: 'history', backTo: '/app/history', subjectLabel: 'History' },
            })
          }
          style={{ borderLeftColor: SUBJECT.color }}
        >
          <div className="commerce-exam-icon" style={{ backgroundColor: `${SUBJECT.color}20` }}>
            <ClipboardList size={32} color={SUBJECT.color} />
          </div>
          <div className="commerce-exam-content">
            <h3>Start Exam</h3>
            <p>Timed exam – Essay questions only</p>
          </div>
          <span className="commerce-feature-arrow">→</span>
        </button>
      </section>

      <section className="commerce-topics-section">
        <h2 className="commerce-section-title">Topical Questions</h2>
        <p className="commerce-section-subtitle">Choose a topic – Paper 1 Essays (3-part ZIMSEC format)</p>
        {!hasEnoughCredits && (
          <p className="commerce-modal-cost" style={{ marginBottom: '0.5rem' }}>
            You need at least {formatCreditCost(minCredits)} to generate a question.
          </p>
        )}
        {loading ? (
          <div className="commerce-loading">Loading topics…</div>
        ) : (
          <div className="commerce-topics-grid">
            {displayTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="commerce-topic-card"
                onClick={() => handleTopicClick(topic)}
                style={{ borderLeftColor: SUBJECT.color }}
              >
                <span className="commerce-topic-name">{topic.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
