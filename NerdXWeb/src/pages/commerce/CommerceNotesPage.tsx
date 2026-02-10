import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { commerceTopicNames } from '../../data/commerceNotes/notes';

const COMMERCE_TOPICS_FALLBACK: Topic[] = commerceTopicNames.map((name) => ({
  id: name.toLowerCase().replace(/ /g, '_').replace(/-/g, '_'),
  name,
  subject: 'commerce',
}));

export function CommerceNotesPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('commerce');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(COMMERCE_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(COMMERCE_TOPICS_FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayTopics = topics.length ? topics : COMMERCE_TOPICS_FALLBACK;

  return (
    <div className="commerce-notes-page">
      <header className="commerce-notes-header">
        <Link to="/app/commerce" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="commerce-notes-title">Commerce Notes</h1>
        <p className="commerce-notes-subtitle">Comprehensive notes aligned with ZIMSEC O-Level syllabus</p>
      </header>

      <section className="commerce-notes-content">
        <div className="commerce-notes-intro">
          <div className="commerce-notes-intro-icon">
            <BookOpen size={40} />
          </div>
          <p>
            Full book-standard notes for each topic, aligned with the ZIMSEC O-Level Principles of Commerce syllabus. Choose a topic below to read summaries, sections, key points, and exam tips. Use the Quiz and Exam features from the Commerce page to practice.
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
                  to={`/app/commerce/notes/${topic.id.replace(/_/g, '-')}`}
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
