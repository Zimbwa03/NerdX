import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { historyTopicNames } from '../../data/historyNotes/notes';

const HISTORY_TOPICS_FALLBACK: Topic[] = historyTopicNames.map((name) => ({
  id: name.toLowerCase().replace(/ /g, '_').replace(/-/g, '_'),
  name,
  subject: 'history',
}));

export function HistoryNotesPage() {
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

  return (
    <div className="commerce-notes-page bes-notes-page history-notes-page">
      <header className="commerce-notes-header">
        <Link to="/app/history" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="commerce-notes-title">History Notes</h1>
        <p className="commerce-notes-subtitle">Comprehensive notes aligned with ZIMSEC O-Level History</p>
      </header>

      <section className="commerce-notes-content">
        <div className="commerce-notes-intro">
          <div className="commerce-notes-intro-icon" style={{ backgroundColor: 'rgba(93, 64, 55, 0.15)' }}>
            <BookOpen size={40} color="#5D4037" />
          </div>
          <p>
            Notes for each topic are aligned with the ZIMSEC O-Level History syllabus.
            Use the Topical Questions and Exam features to practice 3-part essays (Part [a], [b], [c]).
          </p>
        </div>

        <h2 className="commerce-notes-topics-title">Topics</h2>
        {loading ? (
          <div className="commerce-notes-loading">Loading topics…</div>
        ) : (
          <ul className="commerce-notes-topic-list">
            {displayTopics.map((topic) => (
              <li key={topic.id} className="commerce-notes-topic-item">
                <Link
                  to={`/app/history/notes/${topic.id.replace(/_/g, '-')}`}
                  className="commerce-notes-topic-link"
                >
                  <span className="commerce-notes-topic-name">{topic.name}</span>
                  <span className="commerce-notes-topic-badge">View notes</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
