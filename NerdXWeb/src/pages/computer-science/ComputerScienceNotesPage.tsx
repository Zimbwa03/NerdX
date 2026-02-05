import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import { ArrowLeft, BookOpen } from 'lucide-react';

const CS_TOPICS_FALLBACK: Topic[] = [
  { id: 'hardware_and_software', name: 'Hardware and Software', subject: 'computer_science' },
  { id: 'application_of_computer_science', name: 'Application of Computer Science', subject: 'computer_science' },
  { id: 'data_representation', name: 'Data Representation', subject: 'computer_science' },
  { id: 'communication_networks_and_internet_technologies', name: 'Communication Networks and Internet Technologies', subject: 'computer_science' },
  { id: 'security_and_ethics', name: 'Security and Ethics', subject: 'computer_science' },
  { id: 'systems_analysis_and_design', name: 'Systems Analysis and Design', subject: 'computer_science' },
  { id: 'algorithm_design_and_problem_solving', name: 'Algorithm Design and Problem-Solving', subject: 'computer_science' },
  { id: 'programming', name: 'Programming', subject: 'computer_science' },
  { id: 'databases', name: 'Databases', subject: 'computer_science' },
  { id: 'web_design_and_internet_uses', name: 'Web Design and Internet Uses', subject: 'computer_science' },
  { id: 'automated_and_emerging_technologies', name: 'Automated and Emerging Technologies', subject: 'computer_science' },
];

type Board = 'zimsec' | 'cambridge';

export function ComputerScienceNotesPage() {
  const location = useLocation() as { state?: { board?: Board } };
  const [board, setBoard] = useState<Board>(location.state?.board ?? 'zimsec');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="cs-notes-page">
      <header className="cs-notes-header">
        <Link to="/app/computer-science" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="cs-notes-title">Computer Science Notes</h1>
        <p className="cs-notes-subtitle">Comprehensive notes aligned with O-Level syllabus</p>
      </header>

      <section className="cs-notes-board-section">
        <span className="cs-notes-board-label">Syllabus</span>
        <div className="cs-notes-board-toggle">
          <button
            type="button"
            className={`cs-notes-board-btn ${board === 'zimsec' ? 'active' : ''}`}
            onClick={() => setBoard('zimsec')}
          >
            ZimSec
          </button>
          <button
            type="button"
            className={`cs-notes-board-btn ${board === 'cambridge' ? 'active' : ''}`}
            onClick={() => setBoard('cambridge')}
          >
            Cambridge
          </button>
        </div>
      </section>

      <section className="cs-notes-content">
        <div className="cs-notes-intro">
          <div className="cs-notes-intro-icon">
            <BookOpen size={40} />
          </div>
          <p>
            Notes for each topic are aligned with the {board === 'cambridge' ? 'Cambridge' : 'ZIMSEC'} O-Level Computer Science syllabus.
            Use the Quiz and Exam features to practice. Full interactive notes with examples are available in the NerdX mobile app.
          </p>
        </div>

        <h2 className="cs-notes-topics-title">Topics</h2>
        {loading ? (
          <div className="cs-notes-loading">Loading topics…</div>
        ) : (
          <ul className="cs-notes-topic-list">
            {displayTopics.map((topic) => (
              <li key={topic.id} className="cs-notes-topic-item">
                <Link
                  to={`/app/computer-science/notes/${topic.id.replace(/_/g, '-')}`}
                  className="cs-notes-topic-link"
                >
                  <span className="cs-notes-topic-name">{topic.name}</span>
                  <span className="cs-notes-topic-badge">View notes</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
