import { useParams, Link } from 'react-router-dom';
import { getTopicNotesBySlug } from '../../data/computerScienceNotes/notes';
import { ArrowLeft, Info, CheckCircle, Lightbulb } from 'lucide-react';

/** Renders content string with **bold** and newlines */
function ContentBlock({ content }: { content: string }) {
  return (
    <div className="cs-notes-detail-body">
      {content.split(/\n\n+/).map((para, i) => (
        <p key={i} className="cs-notes-detail-para">
          {para.split(/(\*\*.*?\*\*)/g).map((bit, j) =>
            bit.startsWith('**') && bit.endsWith('**') ? (
              <strong key={j}>{bit.slice(2, -2)}</strong>
            ) : (
              bit
            )
          )}
        </p>
      ))}
    </div>
  );
}

export function ComputerScienceNoteDetailPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const notes = topicSlug ? getTopicNotesBySlug(topicSlug) : null;

  if (!topicSlug || !notes) {
    return (
      <div className="cs-notes-page">
        <Link to="/app/computer-science/notes" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <p className="cs-notes-detail-not-found">
          Notes for this topic are not available.
        </p>
      </div>
    );
  }

  return (
    <div className="cs-notes-page cs-notes-detail-page">
      <header className="cs-notes-detail-header">
        <Link to="/app/computer-science/notes" className="back-link">
          <ArrowLeft size={20} /> Back to topics
        </Link>
        <span className="cs-notes-detail-subtitle">Computer Science Notes</span>
        <h1 className="cs-notes-detail-title">{notes.topic}</h1>
      </header>

      <div className="cs-notes-detail-content">
        <div className="cs-notes-detail-card cs-notes-detail-summary">
          <div className="cs-notes-detail-card-head">
            <Info size={24} className="cs-notes-detail-icon" />
            <h2 className="cs-notes-detail-card-title">Summary</h2>
          </div>
          <div className="cs-notes-detail-card-body">
            <ContentBlock content={notes.summary} />
          </div>
        </div>

        {notes.sections.map((section, i) => (
          <div key={i} className="cs-notes-detail-card cs-notes-detail-section">
            <h2 className="cs-notes-detail-card-title">{section.title}</h2>
            <div className="cs-notes-detail-card-body">
              <ContentBlock content={section.content} />
            </div>
          </div>
        ))}

        {notes.key_points.length > 0 && (
          <div className="cs-notes-detail-card cs-notes-detail-keypoints">
            <div className="cs-notes-detail-card-head">
              <CheckCircle size={24} className="cs-notes-detail-icon" />
              <h2 className="cs-notes-detail-card-title">Key points</h2>
            </div>
            <ul className="cs-notes-detail-list">
              {notes.key_points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {notes.exam_tips.length > 0 && (
          <div className="cs-notes-detail-card cs-notes-detail-examtips">
            <div className="cs-notes-detail-card-head">
              <Lightbulb size={24} className="cs-notes-detail-icon" />
              <h2 className="cs-notes-detail-card-title">Exam tips</h2>
            </div>
            <ul className="cs-notes-detail-list">
              {notes.exam_tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
