import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { besTopicNames } from '../../data/besNotes/notes';

const BES_TOPICS_FALLBACK: Topic[] = besTopicNames.map((name) => ({
  id: name.toLowerCase().replace(/ /g, '_').replace(/-/g, '_'),
  name,
  subject: 'business_enterprise_skills',
}));

export function BESNotesPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('business_enterprise_skills');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(BES_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(BES_TOPICS_FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayTopics = topics.length ? topics : BES_TOPICS_FALLBACK;

  return (
    <div className="commerce-notes-page bes-notes-page">
      <header className="commerce-notes-header">
        <Link to="/app/business-enterprise-skills" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="commerce-notes-title">Business Enterprise Skills Notes</h1>
        <p className="commerce-notes-subtitle">Comprehensive notes aligned with ZIMSEC O-Level 4048</p>
      </header>

      <section className="commerce-notes-content">
        <div className="commerce-notes-intro">
          <div className="commerce-notes-intro-icon" style={{ backgroundColor: 'rgba(46, 125, 50, 0.15)' }}>
            <BookOpen size={40} color="#2E7D32" />
          </div>
          <p>
            Notes for each topic are aligned with the ZIMSEC O-Level Business Enterprise and Skills syllabus (4048).
            Use the Quiz and Exam features to practice Paper 1 (MCQs) and Paper 2 (Essays).
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
                  to={`/app/business-enterprise-skills/notes/${topic.id.replace(/_/g, '-')}`}
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
